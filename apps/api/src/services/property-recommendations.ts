import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PropertyPerformance {
  id: string;
  name: string;
  revenue: number;
  occupancyRate: number;
  averageRating: number;
  bookingCount: number;
  averagePrice: number;
  profitMargin: number;
  marketPosition: string;
  optimizationScore: number;
  recommendations: string[];
}

export interface MarketInsights {
  marketTrend: 'growing' | 'stable' | 'declining';
  demandForecast: number; // 0-100
  competitionLevel: 'low' | 'medium' | 'high';
  priceTrend: number; // percentage change
  seasonalPatterns: any[];
  opportunities: string[];
  risks: string[];
}

export class PropertyRecommendationsService {
  
  // Analyze property performance and generate insights
  async analyzePropertyPerformance(propertyId: string): Promise<PropertyPerformance> {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        reservations: {
          include: {
            reviews: true
          },
          where: {
            createdAt: {
              gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
            }
          }
        },
        reviews: true,
        dynamicPricingConfig: true,
        marketData: {
          orderBy: { date: 'desc' },
          take: 30 // Last 30 days
        }
      }
    });

    if (!property) {
      throw new Error('Property not found');
    }

    const revenue = this.calculateRevenue(property.reservations);
    const occupancyRate = this.calculateOccupancyRate(property.reservations);
    const averageRating = this.calculateAverageRating(property.reviews);
    const bookingCount = property.reservations.length;
    const averagePrice = this.calculateAveragePrice(property.reservations);
    const profitMargin = this.calculateProfitMargin(property);
    const marketPosition = this.determineMarketPosition(property);
    const optimizationScore = this.calculateOptimizationScore(property);
    const recommendations = await this.generateRecommendations(property);

    return {
      id: property.id,
      name: property.name,
      revenue,
      occupancyRate,
      averageRating,
      bookingCount,
      averagePrice,
      profitMargin,
      marketPosition,
      optimizationScore,
      recommendations
    };
  }

  // Get market insights for a property
  async getMarketInsights(propertyId: string): Promise<MarketInsights> {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        marketData: {
          orderBy: { date: 'desc' },
          take: 90 // Last 90 days
        }
      }
    });

    if (!property) {
      throw new Error('Property not found');
    }

    const marketTrend = this.analyzeMarketTrend(property.marketData);
    const demandForecast = this.forecastDemand(property.marketData);
    const competitionLevel = this.assessCompetition(property.marketData);
    const priceTrend = this.calculatePriceTrend(property.marketData);
    const seasonalPatterns = this.analyzeSeasonalPatterns(property.marketData);
    const opportunities = await this.identifyOpportunities(property);
    const risks = await this.identifyRisks(property);

    return {
      marketTrend,
      demandForecast,
      competitionLevel,
      priceTrend,
      seasonalPatterns,
      opportunities,
      risks
    };
  }

  // Get AI-powered property recommendations
  async getPropertyRecommendations(propertyId: string): Promise<any> {
    const performance = await this.analyzePropertyPerformance(propertyId);
    const marketInsights = await this.getMarketInsights(propertyId);
    
    return {
      performance,
      marketInsights,
      aiRecommendations: {
        pricingStrategy: this.getPricingStrategy(performance, marketInsights),
        marketingStrategy: this.getMarketingStrategy(performance, marketInsights),
        operationalImprovements: this.getOperationalImprovements(performance),
        investmentOpportunities: this.getInvestmentOpportunities(performance, marketInsights),
        riskMitigation: this.getRiskMitigationStrategies(marketInsights)
      }
    };
  }

  // Calculate revenue from reservations
  private calculateRevenue(reservations: any[]): number {
    return reservations
      .filter((r: any) => r.status === 'CONFIRMED')
      .reduce((sum, r) => sum + Number(r.totalAmount || 0), 0);
  }

  // Calculate occupancy rate
  private calculateOccupancyRate(reservations: any[]): number {
    const totalDays = 365;
    const occupiedDays = reservations
      .filter((r: any) => r.status === 'CONFIRMED')
      .reduce((sum, r) => {
        const checkIn = new Date(r.checkIn);
        const checkOut = new Date(r.checkOut);
        const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);

    return (occupiedDays / totalDays) * 100;
  }

  // Calculate average rating
  private calculateAverageRating(reviews: any[]): number {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length;
  }

  // Calculate average price
  private calculateAveragePrice(reservations: any[]): number {
    if (reservations.length === 0) return 0;
    const confirmedReservations = reservations.filter((r: any) => r.status === 'CONFIRMED');
    return confirmedReservations.reduce((sum, r) => sum + Number(r.totalAmount || 0), 0) / confirmedReservations.length;
  }

  // Calculate profit margin (simplified)
  private calculateProfitMargin(property: any): number {
    // This would need actual cost data
    const estimatedCosts = 0.3; // 30% estimated costs
    return (1 - estimatedCosts) * 100;
  }

  // Determine market position
  private determineMarketPosition(property: any): string {
    const avgPrice = this.calculateAveragePrice(property.reservations);
    const marketAvg = property.marketData[0]?.averagePrice || avgPrice;
    
    if (avgPrice > marketAvg * 1.2) return 'Premium';
    if (avgPrice < marketAvg * 0.8) return 'Budget';
    return 'Competitive';
  }

  // Calculate optimization score
  private calculateOptimizationScore(property: any): number {
    let score = 50; // Base score

    // Adjust based on occupancy rate
    const occupancyRate = this.calculateOccupancyRate(property.reservations);
    if (occupancyRate > 80) score += 20;
    else if (occupancyRate > 60) score += 10;
    else if (occupancyRate < 40) score -= 20;

    // Adjust based on average rating
    const avgRating = this.calculateAverageRating(property.reviews);
    if (avgRating > 4.5) score += 15;
    else if (avgRating > 4.0) score += 5;
    else if (avgRating < 3.5) score -= 15;

    // Adjust based on booking count
    const bookingCount = property.reservations.length;
    if (bookingCount > 50) score += 10;
    else if (bookingCount < 10) score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  // Generate property-specific recommendations
  private async generateRecommendations(property: any): Promise<string[]> {
    const recommendations: string[] = [];
    const occupancyRate = this.calculateOccupancyRate(property.reservations);
    const avgRating = this.calculateAverageRating(property.reviews);
    const bookingCount = property.reservations.length;

    // Occupancy-based recommendations
    if (occupancyRate < 50) {
      recommendations.push('Consider reducing prices to increase occupancy');
      recommendations.push('Improve property photos and descriptions');
      recommendations.push('Add more amenities to attract guests');
    }

    // Rating-based recommendations
    if (avgRating < 4.0) {
      recommendations.push('Address guest feedback to improve ratings');
      recommendations.push('Consider property upgrades or renovations');
      recommendations.push('Improve cleaning and maintenance standards');
    }

    // Booking-based recommendations
    if (bookingCount < 20) {
      recommendations.push('Increase marketing efforts to boost bookings');
      recommendations.push('Consider listing on additional platforms');
      recommendations.push('Optimize your listing for better visibility');
    }

    // Market-based recommendations
    if (property.marketData.length > 0) {
      const latestMarketData = property.marketData[0];
      if (latestMarketData.demandScore > 70) {
        recommendations.push('High demand detected - consider increasing prices');
      } else if (latestMarketData.demandScore < 30) {
        recommendations.push('Low demand - consider promotional pricing');
      }
    }

    return recommendations;
  }

  // Analyze market trend
  private analyzeMarketTrend(marketData: any[]): 'growing' | 'stable' | 'declining' {
    if (marketData.length < 2) return 'stable';

    const recent = marketData.slice(0, 7); // Last week
    const previous = marketData.slice(7, 14); // Week before

    const recentAvg = recent.reduce((sum, d) => sum + d.demandScore, 0) / recent.length;
    const previousAvg = previous.reduce((sum, d) => sum + d.demandScore, 0) / previous.length;

    const change = ((recentAvg - previousAvg) / previousAvg) * 100;

    if (change > 10) return 'growing';
    if (change < -10) return 'declining';
    return 'stable';
  }

  // Forecast demand
  private forecastDemand(marketData: any[]): number {
    if (marketData.length === 0) return 50;

    const recentDemand = marketData.slice(0, 7).reduce((sum, d) => sum + d.demandScore, 0) / 7;
    const trend = this.analyzeMarketTrend(marketData);

    let forecast = recentDemand;
    if (trend === 'growing') forecast *= 1.1;
    else if (trend === 'declining') forecast *= 0.9;

    return Math.max(0, Math.min(100, forecast));
  }

  // Assess competition level
  private assessCompetition(marketData: any[]): 'low' | 'medium' | 'high' {
    if (marketData.length === 0) return 'medium';

    const avgCompetitorCount = marketData.reduce((sum, d) => sum + d.competitorCount, 0) / marketData.length;

    if (avgCompetitorCount < 5) return 'low';
    if (avgCompetitorCount > 15) return 'high';
    return 'medium';
  }

  // Calculate price trend
  private calculatePriceTrend(marketData: any[]): number {
    if (marketData.length < 2) return 0;

    const recent = marketData[0];
    const previous = marketData[1];

    return ((recent.averagePrice - previous.averagePrice) / previous.averagePrice) * 100;
  }

  // Analyze seasonal patterns
  private analyzeSeasonalPatterns(marketData: any[]): any[] {
    const patterns: any[] = [];
    
    // Group by month
    const monthlyData: { [key: number]: any[] } = {};
    marketData.forEach(d => {
      const month = new Date(d.date).getMonth();
      if (!monthlyData[month]) monthlyData[month] = [];
      monthlyData[month].push(d);
    });

    // Calculate average demand by month
    Object.keys(monthlyData).forEach(month => {
      const monthNum = parseInt(month);
      const avgDemand = monthlyData[monthNum].reduce((sum, d) => sum + d.demandScore, 0) / monthlyData[monthNum].length;
      const avgPrice = monthlyData[monthNum].reduce((sum, d) => sum + d.averagePrice, 0) / monthlyData[monthNum].length;

      patterns.push({
        month: monthNum,
        monthName: new Date(2024, monthNum).toLocaleDateString('en-US', { month: 'long' }),
        averageDemand: avgDemand,
        averagePrice: avgPrice,
        season: this.getSeason(monthNum)
      });
    });

    return patterns.sort((a, b) => a.month - b.month);
  }

  // Identify opportunities
  private async identifyOpportunities(property: any): Promise<string[]> {
    const opportunities: string[] = [];
    const marketData = property.marketData[0];

    if (marketData) {
      if (marketData.demandScore > 70) {
        opportunities.push('High market demand - opportunity to increase prices');
      }
      if (marketData.competitorCount < 5) {
        opportunities.push('Low competition in area - opportunity to capture market share');
      }
      if (marketData.priceTrend > 5) {
        opportunities.push('Rising market prices - opportunity to increase rates');
      }
    }

    const occupancyRate = this.calculateOccupancyRate(property.reservations);
    if (occupancyRate < 60) {
      opportunities.push('Low occupancy - opportunity to optimize pricing and marketing');
    }

    return opportunities;
  }

  // Identify risks
  private async identifyRisks(property: any): Promise<string[]> {
    const risks: string[] = [];
    const marketData = property.marketData[0];

    if (marketData) {
      if (marketData.demandScore < 30) {
        risks.push('Low market demand - risk of reduced bookings');
      }
      if (marketData.competitorCount > 20) {
        risks.push('High competition - risk of price pressure');
      }
      if (marketData.priceTrend < -5) {
        risks.push('Declining market prices - risk of revenue reduction');
      }
    }

    const avgRating = this.calculateAverageRating(property.reviews);
    if (avgRating < 3.5) {
      risks.push('Low guest ratings - risk of reduced bookings');
    }

    return risks;
  }

  // Get pricing strategy recommendations
  private getPricingStrategy(performance: PropertyPerformance, marketInsights: MarketInsights): string {
    if (marketInsights.marketTrend === 'growing' && performance.occupancyRate > 80) {
      return 'Increase prices gradually to maximize revenue';
    }
    if (marketInsights.marketTrend === 'declining' && performance.occupancyRate < 60) {
      return 'Reduce prices to maintain occupancy';
    }
    if (marketInsights.competitionLevel === 'high') {
      return 'Stay competitive with market prices';
    }
    return 'Maintain current pricing strategy';
  }

  // Get marketing strategy recommendations
  private getMarketingStrategy(performance: PropertyPerformance, marketInsights: MarketInsights): string {
    if (performance.bookingCount < 20) {
      return 'Increase marketing budget and expand to new platforms';
    }
    if (marketInsights.demandForecast > 70) {
      return 'Focus on premium positioning and quality marketing';
    }
    if (marketInsights.competitionLevel === 'high') {
      return 'Differentiate through unique amenities and experiences';
    }
    return 'Maintain current marketing approach';
  }

  // Get operational improvements
  private getOperationalImprovements(performance: PropertyPerformance): string[] {
    const improvements: string[] = [];

    if (performance.averageRating < 4.0) {
      improvements.push('Improve cleaning standards and property maintenance');
      improvements.push('Enhance guest communication and response times');
      improvements.push('Consider property upgrades or renovations');
    }

    if (performance.occupancyRate < 70) {
      improvements.push('Optimize pricing strategy for better occupancy');
      improvements.push('Improve property photos and listing descriptions');
      improvements.push('Add more amenities to attract guests');
    }

    return improvements;
  }

  // Get investment opportunities
  private getInvestmentOpportunities(performance: PropertyPerformance, marketInsights: MarketInsights): string[] {
    const opportunities: string[] = [];

    if (marketInsights.marketTrend === 'growing') {
      opportunities.push('Consider expanding to additional properties in this market');
    }

    if (performance.profitMargin > 70) {
      opportunities.push('High profitability - consider scaling operations');
    }

    if (marketInsights.competitionLevel === 'low') {
      opportunities.push('Low competition - opportunity for market expansion');
    }

    return opportunities;
  }

  // Get risk mitigation strategies
  private getRiskMitigationStrategies(marketInsights: MarketInsights): string[] {
    const strategies: string[] = [];

    if (marketInsights.marketTrend === 'declining') {
      strategies.push('Diversify into multiple markets to reduce risk');
      strategies.push('Focus on cost optimization and efficiency');
    }

    if (marketInsights.competitionLevel === 'high') {
      strategies.push('Differentiate through unique value propositions');
      strategies.push('Build strong guest relationships and loyalty programs');
    }

    return strategies;
  }

  // Helper method to get season
  private getSeason(month: number): string {
    if (month >= 2 && month <= 5) return 'Spring';
    if (month >= 6 && month <= 8) return 'Summer';
    if (month >= 9 && month <= 11) return 'Fall';
    return 'Winter';
  }
} 