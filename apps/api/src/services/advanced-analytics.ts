import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AnalyticsMetrics {
  revenue: RevenueMetrics;
  occupancy: OccupancyMetrics;
  performance: PerformanceMetrics;
  market: MarketMetrics;
  guest: GuestMetrics;
  operational: OperationalMetrics;
}

export interface RevenueMetrics {
  totalRevenue: number;
  averageDailyRate: number;
  revenuePerProperty: number;
  revenueGrowth: number; // percentage
  projectedRevenue: number;
  revenueByPlatform: { [platform: string]: number };
  revenueByMonth: { [month: string]: number };
  topPerformingProperties: Array<{
    propertyId: string;
    name: string;
    revenue: number;
    growth: number;
  }>;
}

export interface OccupancyMetrics {
  overallOccupancy: number; // percentage
  averageOccupancy: number;
  occupancyByProperty: { [propertyId: string]: number };
  occupancyByMonth: { [month: string]: number };
  occupancyTrend: 'increasing' | 'decreasing' | 'stable';
  projectedOccupancy: number;
  seasonalPatterns: Array<{
    month: string;
    averageOccupancy: number;
    trend: number;
  }>;
}

export interface PerformanceMetrics {
  bookingConversionRate: number;
  averageResponseTime: number; // hours
  guestSatisfactionScore: number;
  reviewScore: number;
  repeatGuestRate: number;
  cancellationRate: number;
  performanceByProperty: Array<{
    propertyId: string;
    name: string;
    conversionRate: number;
    satisfactionScore: number;
    responseTime: number;
  }>;
}

export interface MarketMetrics {
  marketPosition: 'leader' | 'competitive' | 'follower';
  marketShare: number; // percentage
  competitorAnalysis: Array<{
    competitor: string;
    averagePrice: number;
    occupancyRate: number;
    marketShare: number;
  }>;
  pricePositioning: {
    averagePrice: number;
    marketAverage: number;
    priceDifference: number;
    positioning: 'premium' | 'competitive' | 'budget';
  };
  demandForecast: {
    nextMonth: number;
    nextQuarter: number;
    nextYear: number;
  };
}

export interface GuestMetrics {
  totalGuests: number;
  newGuests: number;
  repeatGuests: number;
  averageGuestValue: number;
  guestLifetimeValue: number;
  guestSatisfaction: number;
  guestDemographics: {
    ageGroups: { [ageGroup: string]: number };
    countries: { [country: string]: number };
    bookingChannels: { [channel: string]: number };
  };
  topGuests: Array<{
    guestId: string;
    name: string;
    totalSpent: number;
    bookings: number;
    lastBooking: Date;
  }>;
}

export interface OperationalMetrics {
  averageCleaningTime: number; // hours
  maintenanceCosts: number;
  taskCompletionRate: number;
  averageTaskDuration: number;
  operationalEfficiency: number; // percentage
  costPerBooking: number;
  profitMargin: number;
  operationalByProperty: Array<{
    propertyId: string;
    name: string;
    cleaningTime: number;
    maintenanceCosts: number;
    efficiency: number;
  }>;
}

export class AdvancedAnalyticsService {
  
  // Get comprehensive analytics for a property or portfolio
  async getAnalytics(propertyIds: string[], dateRange: { start: Date; end: Date }): Promise<AnalyticsMetrics> {
    const [
      revenueMetrics,
      occupancyMetrics,
      performanceMetrics,
      marketMetrics,
      guestMetrics,
      operationalMetrics
    ] = await Promise.all([
      this.calculateRevenueMetrics(propertyIds, dateRange),
      this.calculateOccupancyMetrics(propertyIds, dateRange),
      this.calculatePerformanceMetrics(propertyIds, dateRange),
      this.calculateMarketMetrics(propertyIds, dateRange),
      this.calculateGuestMetrics(propertyIds, dateRange),
      this.calculateOperationalMetrics(propertyIds, dateRange)
    ]);

    return {
      revenue: revenueMetrics,
      occupancy: occupancyMetrics,
      performance: performanceMetrics,
      market: marketMetrics,
      guest: guestMetrics,
      operational: operationalMetrics
    };
  }

  // Calculate revenue metrics
  private async calculateRevenueMetrics(propertyIds: string[], dateRange: { start: Date; end: Date }): Promise<RevenueMetrics> {
    const reservations = await prisma.reservation.findMany({
      where: {
        propertyId: { in: propertyIds },
        checkIn: { gte: dateRange.start },
        checkOut: { lte: dateRange.end },
        status: 'CONFIRMED'
      },
      include: { property: true }
    });

    const totalRevenue = reservations.reduce((sum, r) => sum + Number(r.totalAmount), 0);
    const totalDays = reservations.reduce((sum, r) => {
      const days = Math.ceil((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);

    const averageDailyRate = totalDays > 0 ? totalRevenue / totalDays : 0;
    const revenuePerProperty = propertyIds.length > 0 ? totalRevenue / propertyIds.length : 0;

    // Calculate revenue by platform
    const revenueByPlatform: { [platform: string]: number } = {};
    reservations.forEach(r => {
      const platform = r.platform;
      revenueByPlatform[platform] = (revenueByPlatform[platform] || 0) + Number(r.totalAmount);
    });

    // Calculate revenue by month
    const revenueByMonth: { [month: string]: number } = {};
    reservations.forEach(r => {
      const month = new Date(r.checkIn).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      revenueByMonth[month] = (revenueByMonth[month] || 0) + Number(r.totalAmount);
    });

    // Calculate top performing properties
    const propertyRevenue: { [propertyId: string]: number } = {};
    reservations.forEach(r => {
      propertyRevenue[r.propertyId] = (propertyRevenue[r.propertyId] || 0) + Number(r.totalAmount);
    });

    const topPerformingProperties = Object.entries(propertyRevenue)
      .map(([propertyId, revenue]) => ({
        propertyId,
        name: reservations.find(r => r.propertyId === propertyId)?.property.name || 'Unknown',
        revenue,
        growth: 0 // Would need historical data to calculate
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Calculate revenue growth (simplified)
    const revenueGrowth = 0; // Would need historical data to calculate

    // Project revenue (simplified)
    const projectedRevenue = totalRevenue * 1.1; // 10% growth assumption

    return {
      totalRevenue,
      averageDailyRate,
      revenuePerProperty,
      revenueGrowth,
      projectedRevenue,
      revenueByPlatform,
      revenueByMonth,
      topPerformingProperties
    };
  }

  // Calculate occupancy metrics
  private async calculateOccupancyMetrics(propertyIds: string[], dateRange: { start: Date; end: Date }): Promise<OccupancyMetrics> {
    const reservations = await prisma.reservation.findMany({
      where: {
        propertyId: { in: propertyIds },
        checkIn: { gte: dateRange.start },
        checkOut: { lte: dateRange.end },
        status: 'CONFIRMED'
      }
    });

    const totalDays = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPropertyDays = totalDays * propertyIds.length;

    const occupiedDays = reservations.reduce((sum, r) => {
      const days = Math.ceil((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);

    const overallOccupancy = totalPropertyDays > 0 ? (occupiedDays / totalPropertyDays) * 100 : 0;
    const averageOccupancy = overallOccupancy;

    // Calculate occupancy by property
    const occupancyByProperty: { [propertyId: string]: number } = {};
    propertyIds.forEach(propertyId => {
      const propertyReservations = reservations.filter(r => r.propertyId === propertyId);
      const propertyOccupiedDays = propertyReservations.reduce((sum, r) => {
        const days = Math.ceil((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0);
      occupancyByProperty[propertyId] = totalDays > 0 ? (propertyOccupiedDays / totalDays) * 100 : 0;
    });

    // Calculate occupancy by month
    const occupancyByMonth: { [month: string]: number } = {};
    const monthlyData: { [month: string]: { occupied: number; total: number } } = {};

    // Initialize monthly data
    for (let d = new Date(dateRange.start); d <= dateRange.end; d.setMonth(d.getMonth() + 1)) {
      const month = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      monthlyData[month] = { occupied: 0, total: 0 };
    }

    // Calculate monthly occupancy
    reservations.forEach(r => {
      const month = new Date(r.checkIn).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      const days = Math.ceil((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60 * 24));
      if (monthlyData[month]) {
        monthlyData[month].occupied += days;
        monthlyData[month].total += days * propertyIds.length;
      }
    });

    Object.entries(monthlyData).forEach(([month, data]) => {
      occupancyByMonth[month] = data.total > 0 ? (data.occupied / data.total) * 100 : 0;
    });

    // Determine occupancy trend
    const months = Object.keys(occupancyByMonth).sort();
    const occupancyTrend = months.length >= 2 
      ? occupancyByMonth[months[months.length - 1]] > occupancyByMonth[months[months.length - 2]]
        ? 'increasing' as const
        : occupancyByMonth[months[months.length - 1]] < occupancyByMonth[months[months.length - 2]]
        ? 'decreasing' as const
        : 'stable' as const
      : 'stable' as const;

    // Project occupancy
    const projectedOccupancy = overallOccupancy * 1.05; // 5% growth assumption

    // Calculate seasonal patterns
    const seasonalPatterns = Object.entries(occupancyByMonth).map(([month, occupancy]) => ({
      month,
      averageOccupancy: occupancy,
      trend: 0 // Would need historical data to calculate
    }));

    return {
      overallOccupancy,
      averageOccupancy,
      occupancyByProperty,
      occupancyByMonth,
      occupancyTrend,
      projectedOccupancy,
      seasonalPatterns
    };
  }

  // Calculate performance metrics
  private async calculatePerformanceMetrics(propertyIds: string[], dateRange: { start: Date; end: Date }): Promise<PerformanceMetrics> {
    const reservations = await prisma.reservation.findMany({
      where: {
        propertyId: { in: propertyIds },
        checkIn: { gte: dateRange.start },
        checkOut: { lte: dateRange.end }
      },
      include: { reviews: true }
    });

    const confirmedReservations = reservations.filter(r => r.status === 'CONFIRMED');
    const totalInquiries = reservations.length;
    const bookingConversionRate = totalInquiries > 0 ? (confirmedReservations.length / totalInquiries) * 100 : 0;

    // Calculate average response time (simplified)
    const averageResponseTime = 24; // Would need message data to calculate

    // Calculate guest satisfaction
    const reviews = reservations.flatMap(r => r.reviews);
    const guestSatisfactionScore = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length 
      : 0;

    const reviewScore = guestSatisfactionScore;

    // Calculate repeat guest rate
    const uniqueGuests = new Set(reservations.map(r => r.guestEmail));
    const repeatGuests = new Set();
    const guestBookings: { [email: string]: number } = {};
    
    reservations.forEach(r => {
      guestBookings[r.guestEmail] = (guestBookings[r.guestEmail] || 0) + 1;
      if (guestBookings[r.guestEmail] > 1) {
        repeatGuests.add(r.guestEmail);
      }
    });

    const repeatGuestRate = uniqueGuests.size > 0 ? (repeatGuests.size / uniqueGuests.size) * 100 : 0;

    // Calculate cancellation rate
    const cancelledReservations = reservations.filter(r => r.status === 'CANCELLED');
    const cancellationRate = totalInquiries > 0 ? (cancelledReservations.length / totalInquiries) * 100 : 0;

    // Calculate performance by property
    const performanceByProperty = propertyIds.map(propertyId => {
      const propertyReservations = reservations.filter(r => r.propertyId === propertyId);
      const propertyConfirmed = propertyReservations.filter(r => r.status === 'CONFIRMED');
      const propertyReviews = propertyReservations.flatMap(r => r.reviews);
      
      const conversionRate = propertyReservations.length > 0 
        ? (propertyConfirmed.length / propertyReservations.length) * 100 
        : 0;
      
      const satisfactionScore = propertyReviews.length > 0 
        ? propertyReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / propertyReviews.length 
        : 0;

      return {
        propertyId,
        name: propertyReservations[0]?.property?.name || 'Unknown',
        conversionRate,
        satisfactionScore,
        responseTime: 24 // Would need message data to calculate
      };
    });

    return {
      bookingConversionRate,
      averageResponseTime,
      guestSatisfactionScore,
      reviewScore,
      repeatGuestRate,
      cancellationRate,
      performanceByProperty
    };
  }

  // Calculate market metrics
  private async calculateMarketMetrics(propertyIds: string[], dateRange: { start: Date; end: Date }): Promise<MarketMetrics> {
    // Get market data for properties
    const marketData = await prisma.marketData.findMany({
      where: {
        propertyId: { in: propertyIds },
        date: { gte: dateRange.start, lte: dateRange.end }
      }
    });

    // Calculate average price
    const reservations = await prisma.reservation.findMany({
      where: {
        propertyId: { in: propertyIds },
        checkIn: { gte: dateRange.start },
        checkOut: { lte: dateRange.end },
        status: 'CONFIRMED'
      }
    });

    const totalRevenue = reservations.reduce((sum, r) => sum + Number(r.totalAmount), 0);
    const totalDays = reservations.reduce((sum, r) => {
      const days = Math.ceil((new Date(r.checkOut).getTime() - new Date(r.checkIn).getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);

    const averagePrice = totalDays > 0 ? totalRevenue / totalDays : 0;
    const marketAverage = marketData.length > 0 
      ? marketData.reduce((sum, d) => sum + d.averagePrice, 0) / marketData.length 
      : averagePrice;

    const priceDifference = ((averagePrice - marketAverage) / marketAverage) * 100;
    const positioning = priceDifference > 10 ? 'premium' as const 
      : priceDifference < -10 ? 'budget' as const 
      : 'competitive' as const;

    // Determine market position
    const marketShare = marketData.length > 0 
      ? marketData.reduce((sum, d) => sum + d.marketShare, 0) / marketData.length 
      : 0;

    const marketPosition = marketShare > 20 ? 'leader' as const 
      : marketShare > 5 ? 'competitive' as const 
      : 'follower' as const;

    // Competitor analysis (simplified)
    const competitorAnalysis = [
      {
        competitor: 'Airbnb Average',
        averagePrice: marketAverage * 1.1,
        occupancyRate: 75,
        marketShare: 15
      },
      {
        competitor: 'VRBO Average',
        averagePrice: marketAverage * 0.95,
        occupancyRate: 70,
        marketShare: 10
      }
    ];

    // Demand forecast
    const demandForecast = {
      nextMonth: 85,
      nextQuarter: 80,
      nextYear: 90
    };

    return {
      marketPosition,
      marketShare,
      competitorAnalysis,
      pricePositioning: {
        averagePrice,
        marketAverage,
        priceDifference,
        positioning
      },
      demandForecast
    };
  }

  // Calculate guest metrics
  private async calculateGuestMetrics(propertyIds: string[], dateRange: { start: Date; end: Date }): Promise<GuestMetrics> {
    const reservations = await prisma.reservation.findMany({
      where: {
        propertyId: { in: propertyIds },
        checkIn: { gte: dateRange.start },
        checkOut: { lte: dateRange.end },
        status: 'CONFIRMED'
      }
    });

    const totalGuests = reservations.length;
    const uniqueGuests = new Set(reservations.map(r => r.guestEmail));
    const newGuests = uniqueGuests.size;
    const repeatGuests = new Set();
    const guestBookings: { [email: string]: number } = {};
    
    reservations.forEach(r => {
      guestBookings[r.guestEmail] = (guestBookings[r.guestEmail] || 0) + 1;
      if (guestBookings[r.guestEmail] > 1) {
        repeatGuests.add(r.guestEmail);
      }
    });

    const totalRevenue = reservations.reduce((sum, r) => sum + Number(r.totalAmount), 0);
    const averageGuestValue = uniqueGuests.size > 0 ? totalRevenue / uniqueGuests.size : 0;
    const guestLifetimeValue = averageGuestValue * 3; // Simplified calculation

    // Guest satisfaction
    const reviews = reservations.flatMap(r => r.reviews);
    const guestSatisfaction = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length 
      : 0;

    // Guest demographics (simplified)
    const guestDemographics = {
      ageGroups: { '25-34': 30, '35-44': 25, '45-54': 20, '55+': 15, '18-24': 10 },
      countries: { 'USA': 60, 'Canada': 15, 'UK': 10, 'Other': 15 },
      bookingChannels: { 'Airbnb': 50, 'VRBO': 25, 'Direct': 15, 'Other': 10 }
    };

    // Top guests
    const guestRevenue: { [email: string]: number } = {};
    reservations.forEach(r => {
      guestRevenue[r.guestEmail] = (guestRevenue[r.guestEmail] || 0) + Number(r.totalAmount);
    });

    const topGuests = Object.entries(guestRevenue)
      .map(([email, totalSpent]) => ({
        guestId: email,
        name: reservations.find(r => r.guestEmail === email)?.guestName || 'Unknown',
        totalSpent,
        bookings: guestBookings[email] || 0,
        lastBooking: new Date(Math.max(...reservations.filter(r => r.guestEmail === email).map(r => new Date(r.checkIn).getTime())))
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    return {
      totalGuests,
      newGuests,
      repeatGuests: repeatGuests.size,
      averageGuestValue,
      guestLifetimeValue,
      guestSatisfaction,
      guestDemographics,
      topGuests
    };
  }

  // Calculate operational metrics
  private async calculateOperationalMetrics(propertyIds: string[], dateRange: { start: Date; end: Date }): Promise<OperationalMetrics> {
    const tasks = await prisma.task.findMany({
      where: {
        propertyId: { in: propertyIds },
        createdAt: { gte: dateRange.start },
        updatedAt: { lte: dateRange.end }
      }
    });

    const expenses = await prisma.expense.findMany({
      where: {
        propertyId: { in: propertyIds },
        date: { gte: dateRange.start, lte: dateRange.end }
      }
    });

    const reservations = await prisma.reservation.findMany({
      where: {
        propertyId: { in: propertyIds },
        checkIn: { gte: dateRange.start },
        checkOut: { lte: dateRange.end },
        status: 'CONFIRMED'
      }
    });

    // Calculate operational metrics
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
    const taskCompletionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

    const averageTaskDuration = completedTasks.length > 0 
      ? completedTasks.reduce((sum, t) => {
          const duration = new Date(t.completedAt || new Date()).getTime() - new Date(t.createdAt).getTime();
          return sum + duration;
        }, 0) / completedTasks.length / (1000 * 60 * 60) // Convert to hours
      : 0;

    const averageCleaningTime = 4; // Would need task data to calculate
    const maintenanceCosts = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalRevenue = reservations.reduce((sum, r) => sum + Number(r.totalAmount), 0);
    const costPerBooking = reservations.length > 0 ? maintenanceCosts / reservations.length : 0;
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - maintenanceCosts) / totalRevenue) * 100 : 0;
    const operationalEfficiency = 85; // Would need more data to calculate

    // Operational metrics by property
    const operationalByProperty = propertyIds.map(propertyId => {
      const propertyTasks = tasks.filter(t => t.propertyId === propertyId);
      const propertyExpenses = expenses.filter(e => e.propertyId === propertyId);
      const propertyReservations = reservations.filter(r => r.propertyId === propertyId);

      const propertyCleaningTime = 4; // Would need task data to calculate
      const propertyMaintenanceCosts = propertyExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
      const propertyEfficiency = 85; // Would need more data to calculate

      return {
        propertyId,
        name: propertyReservations[0]?.property?.name || 'Unknown',
        cleaningTime: propertyCleaningTime,
        maintenanceCosts: propertyMaintenanceCosts,
        efficiency: propertyEfficiency
      };
    });

    return {
      averageCleaningTime,
      maintenanceCosts,
      taskCompletionRate,
      averageTaskDuration,
      operationalEfficiency,
      costPerBooking,
      profitMargin,
      operationalByProperty
    };
  }

  // Get predictive insights
  async getPredictiveInsights(propertyIds: string[]): Promise<any> {
    const insights = {
      revenueForecast: await this.forecastRevenue(propertyIds),
      occupancyForecast: await this.forecastOccupancy(propertyIds),
      marketTrends: await this.analyzeMarketTrends(propertyIds),
      guestBehavior: await this.analyzeGuestBehavior(propertyIds),
      operationalOptimization: await this.getOperationalOptimization(propertyIds)
    };

    return insights;
  }

  // Forecast revenue
  private async forecastRevenue(propertyIds: string[]): Promise<any> {
    // This would implement machine learning models for revenue forecasting
    return {
      nextMonth: 45000,
      nextQuarter: 135000,
      nextYear: 540000,
      confidence: 0.85,
      factors: ['seasonal trends', 'market demand', 'pricing strategy']
    };
  }

  // Forecast occupancy
  private async forecastOccupancy(propertyIds: string[]): Promise<any> {
    // This would implement machine learning models for occupancy forecasting
    return {
      nextMonth: 78,
      nextQuarter: 75,
      nextYear: 80,
      confidence: 0.82,
      factors: ['booking patterns', 'seasonal demand', 'market competition']
    };
  }

  // Analyze market trends
  private async analyzeMarketTrends(propertyIds: string[]): Promise<any> {
    return {
      priceTrend: 'increasing',
      demandTrend: 'stable',
      competitionLevel: 'medium',
      opportunities: ['expand to new markets', 'optimize pricing strategy'],
      risks: ['economic downturn', 'increased competition']
    };
  }

  // Analyze guest behavior
  private async analyzeGuestBehavior(propertyIds: string[]): Promise<any> {
    return {
      bookingPatterns: ['advance booking', 'weekend preference'],
      preferences: ['mountain views', 'pet-friendly', 'wifi'],
      satisfactionDrivers: ['cleanliness', 'location', 'value'],
      improvementAreas: ['response time', 'amenities']
    };
  }

  // Get operational optimization recommendations
  private async getOperationalOptimization(propertyIds: string[]): Promise<any> {
    return {
      efficiencyGains: ['automate cleaning schedules', 'optimize pricing'],
      costReductions: ['bulk purchasing', 'energy optimization'],
      qualityImprovements: ['staff training', 'maintenance schedules'],
      automationOpportunities: ['guest communication', 'task management']
    };
  }
} 