import { PrismaClient } from '@prisma/client';
// @ts-ignore
import axios from 'axios';
import { LocationBasedPricingService } from './location-based-pricing';

const prisma = new PrismaClient();

export interface PricingFactors {
  basePrice: number;
  marketTrend: number;
  competitorPrices: number[];
  seasonalMultiplier: number;
  dayOfWeekMultiplier: number;
  occupancyRate: number;
  demandScore: number;
  weatherImpact: number;
  eventMultiplier: number;
  leadTimeMultiplier: number;
  amenityMultipliers: number[];
}

export interface PricingResult {
  date: Date;
  basePrice: number;
  finalPrice: number;
  appliedRules: string[];
  marketFactors: any;
  confidence: number;
}

export class DynamicPricingService {
  private locationPricingService: LocationBasedPricingService;

  constructor() {
    this.locationPricingService = new LocationBasedPricingService();
  }

  // Calculate dynamic price for a specific date
  async calculatePrice(propertyId: string, date: Date, guestCount: number = 1): Promise<PricingResult> {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        dynamicPricingConfig: true,
        pricingRules: { where: { isActive: true }, orderBy: { priority: 'desc' } },
        seasonalAdjustments: { where: { isActive: true } },
        amenityMultipliers: { where: { isActive: true } },
        marketData: { where: { date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } }
      }
    });

    if (!property || !property.dynamicPricingConfig) {
      throw new Error('Property or dynamic pricing config not found');
    }

    const config = property.dynamicPricingConfig;
    const factors = await this.gatherPricingFactors(property, date, guestCount);
    
    let finalPrice = factors.basePrice;
    const appliedRules: string[] = [];
    const marketFactors: any = {};

    // Apply base multiplier
    finalPrice *= config.baseMultiplier;

    // Apply seasonal adjustments
    const seasonalMultiplier = await this.calculateSeasonalMultiplier(property, date);
    finalPrice *= seasonalMultiplier;
    appliedRules.push(`Seasonal: ${seasonalMultiplier.toFixed(2)}x`);

    // Apply day-of-week pricing
    const dayMultiplier = this.calculateDayOfWeekMultiplier(date, config);
    finalPrice *= dayMultiplier;
    appliedRules.push(`Day of week: ${dayMultiplier.toFixed(2)}x`);

    // Apply market-based adjustments
    if (config.marketTrendAnalysis) {
      const marketMultiplier = await this.calculateMarketMultiplier(property, date);
      finalPrice *= marketMultiplier;
      appliedRules.push(`Market trend: ${marketMultiplier.toFixed(2)}x`);
      marketFactors.marketTrend = marketMultiplier;
    }

    // Apply competitor-based pricing
    if (config.competitorTracking) {
      const competitorMultiplier = await this.calculateCompetitorMultiplier(property, date);
      finalPrice *= competitorMultiplier;
      appliedRules.push(`Competitor: ${competitorMultiplier.toFixed(2)}x`);
      marketFactors.competitorAdjustment = competitorMultiplier;
    }

    // Apply occupancy-based pricing
    const occupancyMultiplier = await this.calculateOccupancyMultiplier(property, date, config);
    finalPrice *= occupancyMultiplier;
    appliedRules.push(`Occupancy: ${occupancyMultiplier.toFixed(2)}x`);

    // Apply lead time pricing
    const leadTimeMultiplier = this.calculateLeadTimeMultiplier(date, config);
    finalPrice *= leadTimeMultiplier;
    appliedRules.push(`Lead time: ${leadTimeMultiplier.toFixed(2)}x`);

    // Apply amenity multipliers
    const amenityMultiplier = this.calculateAmenityMultiplier(property, guestCount);
    finalPrice *= amenityMultiplier;
    appliedRules.push(`Amenities: ${amenityMultiplier.toFixed(2)}x`);

    // Apply custom pricing rules
    const ruleMultiplier = this.applyPricingRules(property.pricingRules, date, guestCount);
    finalPrice *= ruleMultiplier;
    if (ruleMultiplier !== 1) {
      appliedRules.push(`Custom rules: ${ruleMultiplier.toFixed(2)}x`);
    }

    // Apply location-based pricing (NEW)
    const locationMultiplier = await this.locationPricingService.calculateLocationMultiplier(propertyId, date);
    finalPrice *= locationMultiplier;
    appliedRules.push(`Location factors: ${locationMultiplier.toFixed(2)}x`);
    marketFactors.locationMultiplier = locationMultiplier;

    // Ensure price is within bounds
    finalPrice = Math.max(config.minPrice, Math.min(config.maxPrice, finalPrice));

    // Calculate confidence score
    const confidence = this.calculateConfidence(factors, appliedRules.length);

    // Store pricing history
    await this.storePricingHistory(propertyId, date, factors.basePrice, finalPrice, appliedRules, marketFactors);

    return {
      date,
      basePrice: factors.basePrice,
      finalPrice: Math.round(finalPrice * 100) / 100,
      appliedRules,
      marketFactors,
      confidence
    };
  }

  // Gather all pricing factors
  private async gatherPricingFactors(property: any, date: Date, guestCount: number): Promise<PricingFactors> {
    const marketData = await this.getMarketData(property.id, date);
    const competitorPrices = await this.getCompetitorPrices(property.id, date);
    const occupancyRate = await this.calculateOccupancyRate(property.id, date);
    const weatherData = await this.getWeatherData(property.city, date);
    const eventData = await this.getEventData(property.city, date);

    return {
      basePrice: property.basePrice,
      marketTrend: marketData?.priceTrend || 0,
      competitorPrices: competitorPrices.map(cp => cp.price),
      seasonalMultiplier: 1.0, // Will be calculated separately
      dayOfWeekMultiplier: 1.0, // Will be calculated separately
      occupancyRate,
      demandScore: marketData?.demandScore || 50,
      weatherImpact: weatherData?.impact || 0,
      eventMultiplier: eventData?.multiplier || 1.0,
      leadTimeMultiplier: 1.0, // Will be calculated separately
      amenityMultipliers: property.amenityMultipliers.map((am: any) => am.multiplier)
    };
  }

  // Calculate seasonal multiplier
  private async calculateSeasonalMultiplier(property: any, date: Date): Promise<number> {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Check for specific seasonal adjustments
    const seasonalAdjustment = property.seasonalAdjustments.find((sa: any) => {
      if (sa.startMonth <= sa.endMonth) {
        return month >= sa.startMonth && month <= sa.endMonth;
      } else {
        // Handles seasons that span across year end (e.g., Dec-Feb)
        return month >= sa.startMonth || month <= sa.endMonth;
      }
    });

    if (seasonalAdjustment) {
      return seasonalAdjustment.multiplier;
    }

    // Default seasonal logic based on month
    const config = property.dynamicPricingConfig;
    
    // Peak season (summer months)
    if ([6, 7, 8].includes(month)) {
      return config.peakSeasonMultiplier;
    }
    
    // Off season (winter months)
    if ([12, 1, 2].includes(month)) {
      return config.offSeasonMultiplier;
    }
    
    // Shoulder season (spring/fall)
    return config.shoulderSeasonMultiplier;
  }

  // Calculate day-of-week multiplier
  private calculateDayOfWeekMultiplier(date: Date, config: any): number {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Weekend pricing
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return config.weekendMultiplier;
    }
    
    return config.weekdayMultiplier;
  }

  // Calculate market-based multiplier
  private async calculateMarketMultiplier(property: any, date: Date): Promise<number> {
    const marketData = await this.getMarketData(property.id, date);
    
    if (!marketData) {
      return 1.0;
    }

    // Adjust based on market trends
    let multiplier = 1.0;
    
    // Price trend adjustment
    if (marketData.priceTrend > 0) {
      multiplier += marketData.priceTrend * 0.1; // 10% of trend
    } else {
      multiplier += marketData.priceTrend * 0.05; // 5% of trend for decreases
    }
    
    // Demand adjustment
    const demandFactor = (marketData.demandScore - 50) / 50; // -1 to 1
    multiplier += demandFactor * 0.2; // ±20% based on demand
    
    return Math.max(0.5, Math.min(2.0, multiplier));
  }

  // Calculate competitor-based multiplier
  private async calculateCompetitorMultiplier(property: any, date: Date): Promise<number> {
    const competitorPrices = await this.getCompetitorPrices(property.id, date);
    
    if (competitorPrices.length === 0) {
      return 1.0;
    }

    const avgCompetitorPrice = competitorPrices.reduce((sum, cp) => sum + cp.price, 0) / competitorPrices.length;
    const basePrice = property.basePrice;
    
    // Calculate position relative to competitors
    const priceRatio = avgCompetitorPrice / basePrice;
    
    // Adjust to be competitive but not underpriced
    if (priceRatio > 1.2) {
      return 1.1; // Increase price if competitors are much higher
    } else if (priceRatio < 0.8) {
      return 0.9; // Decrease price if competitors are much lower
    }
    
    return 1.0;
  }

  // Calculate occupancy-based multiplier
  private async calculateOccupancyMultiplier(property: any, date: Date, config: any): Promise<number> {
    const occupancyRate = await this.calculateOccupancyRate(property.id, date);
    
    if (occupancyRate > config.occupancyThreshold) {
      return config.highOccupancyMultiplier;
    } else if (occupancyRate < 30) {
      return config.lowOccupancyMultiplier;
    }
    
    return 1.0;
  }

  // Calculate lead time multiplier
  private calculateLeadTimeMultiplier(date: Date, config: any): number {
    const daysUntilDate = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDate <= 7) {
      return config.lastMinuteDiscount;
    } else if (daysUntilDate >= 90) {
      return config.earlyBirdMultiplier;
    }
    
    return 1.0;
  }

  // Calculate amenity multiplier
  private calculateAmenityMultiplier(property: any, guestCount: number): number {
    let multiplier = 1.0;
    
    for (const amenityMultiplier of property.amenityMultipliers) {
      if (amenityMultiplier.guestCountRequired && guestCount >= amenityMultiplier.guestCountRequired) {
        multiplier *= amenityMultiplier.multiplier;
      } else if (!amenityMultiplier.guestCountRequired) {
        multiplier *= amenityMultiplier.multiplier;
      }
    }
    
    return multiplier;
  }

  // Apply custom pricing rules
  private applyPricingRules(rules: any[], date: Date, guestCount: number): number {
    let multiplier = 1.0;
    
    for (const rule of rules) {
      if (this.ruleApplies(rule, date, guestCount)) {
        switch (rule.priceType) {
          case 'MULTIPLIER':
            multiplier *= rule.value;
            break;
          case 'FIXED_AMOUNT':
            // This would need to be handled differently in the main calculation
            break;
          case 'PERCENTAGE':
            multiplier *= (1 + rule.value / 100);
            break;
        }
      }
    }
    
    return multiplier;
  }

  // Check if a pricing rule applies
  private ruleApplies(rule: any, date: Date, guestCount: number): boolean {
    // Date range check
    if (rule.startDate && date < new Date(rule.startDate)) return false;
    if (rule.endDate && date > new Date(rule.endDate)) return false;
    
    // Day of week check
    if (rule.dayOfWeek !== null && date.getDay() !== rule.dayOfWeek) return false;
    
    // Guest count check
    if (rule.guestCount && guestCount !== rule.guestCount) return false;
    
    return true;
  }

  // Calculate confidence score
  private calculateConfidence(factors: PricingFactors, rulesApplied: number): number {
    let confidence = 0.5; // Base confidence
    
    // Market data availability
    if (factors.competitorPrices.length > 0) confidence += 0.2;
    if (factors.marketTrend !== 0) confidence += 0.1;
    
    // Data quality indicators
    if (factors.demandScore > 0) confidence += 0.1;
    if (factors.occupancyRate > 0) confidence += 0.1;
    
    // Rules applied
    confidence += Math.min(0.1, rulesApplied * 0.02);
    
    return Math.min(1.0, confidence);
  }

  // Get market data for a property and date
  private async getMarketData(propertyId: string, date: Date) {
    return await prisma.marketData.findFirst({
      where: {
        propertyId,
        date: {
          gte: new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000),
          lte: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000)
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  // Get competitor prices
  private async getCompetitorPrices(propertyId: string, date: Date) {
    return await prisma.competitorPrice.findMany({
      where: {
        propertyId,
        date: {
          gte: new Date(date.getTime() - 3 * 24 * 60 * 60 * 1000),
          lte: new Date(date.getTime() + 3 * 24 * 60 * 60 * 1000)
        }
      }
    });
  }

  // Calculate occupancy rate for a property
  private async calculateOccupancyRate(propertyId: string, date: Date): Promise<number> {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    const reservations = await prisma.reservation.findMany({
      where: {
        propertyId,
        checkIn: { lte: endOfMonth },
        checkOut: { gte: startOfMonth },
        status: { in: ['CONFIRMED', 'CHECKED_IN'] }
      }
    });
    
    const totalDays = endOfMonth.getDate();
    let occupiedDays = 0;
    
    for (const reservation of reservations) {
      const start = Math.max(startOfMonth.getTime(), reservation.checkIn.getTime());
      const end = Math.min(endOfMonth.getTime(), reservation.checkOut.getTime());
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      occupiedDays += Math.max(0, days);
    }
    
    return (occupiedDays / totalDays) * 100;
  }

  // Get weather data (placeholder - would integrate with weather API)
  private async getWeatherData(city: string, date: Date) {
    // This would integrate with a weather API like OpenWeatherMap
    // For now, return mock data
    return {
      impact: 0.1, // Slight positive impact
      temperature: 75,
      conditions: 'sunny'
    };
  }

  // Get event data (placeholder - would integrate with event APIs)
  private async getEventData(city: string, date: Date) {
    // This would integrate with event APIs like Eventbrite, Ticketmaster, etc.
    // For now, return mock data
    return {
      multiplier: 1.0,
      events: []
    };
  }

  // Store pricing history
  private async storePricingHistory(
    propertyId: string,
    date: Date,
    basePrice: number,
    finalPrice: number,
    appliedRules: string[],
    marketFactors: any
  ) {
    await prisma.pricingHistory.upsert({
      where: {
        propertyId_date: {
          propertyId,
          date
        }
      },
      update: {
        basePrice,
        finalPrice,
        appliedRules: appliedRules as any,
        marketFactors: marketFactors as any
      },
      create: {
        propertyId,
        date,
        basePrice,
        finalPrice,
        appliedRules: appliedRules as any,
        marketFactors: marketFactors as any
      }
    });
  }

  // Update market data (called by external data collection service)
  async updateMarketData(propertyId: string, marketData: any) {
    await prisma.marketData.upsert({
      where: {
        propertyId_date_location: {
          propertyId,
          date: marketData.date,
          location: marketData.location
        }
      },
      update: marketData,
      create: {
        propertyId,
        ...marketData
      }
    });
  }

  // Update competitor prices (called by competitor tracking service)
  async updateCompetitorPrices(propertyId: string, competitorData: any[]) {
    for (const data of competitorData) {
      await prisma.competitorPrice.upsert({
        where: {
          propertyId_competitorName_date: {
            propertyId,
            competitorName: data.competitorName,
            date: data.date
          }
        },
        update: data,
        create: {
          propertyId,
          ...data
        }
      });
    }
  }

  // Get pricing recommendations for a date range
  async getPricingRecommendations(propertyId: string, startDate: Date, endDate: Date) {
    const recommendations = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const pricing = await this.calculatePrice(propertyId, new Date(currentDate));
      recommendations.push(pricing);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return recommendations;
  }

  // Analyze pricing performance
  async analyzePricingPerformance(propertyId: string, startDate: Date, endDate: Date) {
    const history = await prisma.pricingHistory.findMany({
      where: {
        propertyId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { date: 'asc' }
    });

    const reservations = await prisma.reservation.findMany({
      where: {
        propertyId,
        checkIn: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Calculate performance metrics
    const totalRevenue = reservations.reduce((sum, res) => sum + Number(res.totalAmount || 0), 0);
    const avgPrice = history.reduce((sum, h) => sum + h.finalPrice, 0) / history.length;
    const occupancyRate = (reservations.length / history.length) * 100;

    return {
      totalRevenue,
      averagePrice: avgPrice,
      occupancyRate,
      bookingCount: reservations.length,
      priceHistory: history
    };
  }

  // Always enforce absolute minimum price
  private enforceAbsoluteMinimum(price: number, minPrice: number): number {
    return Math.max(price, minPrice);
  }

  // Fetch and update market data from external APIs (mocked for now)
  async fetchAndUpdateMarketData(property: any, date: Date) {
    // TODO: Integrate with AirDNA, PriceLabs, or other APIs
    // For now, mock data
    const mockMarketData = {
      date,
      location: `${property.city},${property.state}`,
      averagePrice: property.basePrice * (0.9 + Math.random() * 0.2),
      medianPrice: property.basePrice * (0.9 + Math.random() * 0.2),
      priceRange: `${property.basePrice * 0.8}-${property.basePrice * 1.2}`,
      occupancyRate: 60 + Math.random() * 30,
      demandScore: 40 + Math.random() * 40,
      supplyScore: 40 + Math.random() * 40,
      competitorCount: 10 + Math.floor(Math.random() * 10),
      competitorAvgPrice: property.basePrice * (0.85 + Math.random() * 0.3),
      marketShare: Math.random(),
      priceTrend: -0.05 + Math.random() * 0.1,
      demandTrend: -0.05 + Math.random() * 0.1,
      seasonalityScore: 0.5 + Math.random(),
      weatherData: {},
      eventData: {},
      economicIndicators: {}
    };
    await this.updateMarketData(property.id, mockMarketData);
    return mockMarketData;
  }

  // API: Get calendar demand for a property and month
  async getCalendarDemand(propertyId: string, year: number, month: number) {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        dynamicPricingConfig: true,
        pricingRules: true,
        seasonalAdjustments: true,
        amenityMultipliers: true,
        marketData: true
      }
    });
    if (!property || !property.dynamicPricingConfig) throw new Error('Property or config not found');
    const daysInMonth = new Date(year, month, 0).getDate();
    const results = [];
    let sum = 0, min = Infinity, max = -Infinity;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const pricing = await this.calculatePrice(propertyId, date);
      const demandScore = pricing.marketFactors?.marketTrend || 50;
      let demandLevel = 'average', color = 'yellow';
      if (demandScore >= 70) { demandLevel = 'high'; color = 'red'; }
      else if (demandScore <= 40) { demandLevel = 'low'; color = 'green'; }
      sum += pricing.finalPrice;
      min = Math.min(min, pricing.finalPrice);
      max = Math.max(max, pricing.finalPrice);
      results.push({
        date,
        price: pricing.finalPrice,
        demandScore,
        demandLevel,
        color,
        minimumStay: property.minimumStay,
        appliedRules: pricing.appliedRules
      });
    }
    const avg = sum / daysInMonth;
    return {
      days: results,
      averagePrice: Math.round(avg * 100) / 100,
      minPrice: Math.round(min * 100) / 100,
      maxPrice: Math.round(max * 100) / 100,
      minimumStay: property.minimumStay
    };
  }
}

export const dynamicPricingService = new DynamicPricingService(); 