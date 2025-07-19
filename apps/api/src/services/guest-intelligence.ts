import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface GuestProfile {
  id: string;
  email: string;
  preferences: GuestPreferences;
  behaviorPatterns: BehaviorPatterns;
  lifetimeValue: number;
  riskScore: number;
  recommendations: string[];
}

export interface GuestPreferences {
  propertyTypes: string[];
  amenities: string[];
  locations: string[];
  priceRange: { min: number; max: number };
  stayDuration: { min: number; max: number };
  bookingAdvance: number; // days in advance
  seasonalPreferences: string[];
  groupSize: { min: number; max: number };
}

export interface BehaviorPatterns {
  bookingFrequency: number; // bookings per year
  cancellationRate: number;
  reviewScore: number;
  responseTime: number; // hours
  repeatBookingRate: number;
  lastBookingDate: Date;
  totalBookings: number;
  averageStayDuration: number;
  preferredCheckInDay: string;
  preferredCheckOutDay: string;
}

export class GuestIntelligenceService {
  
  // Analyze guest behavior and create/update profile
  async analyzeGuestBehavior(guestId: string): Promise<GuestProfile> {
    const guest = await prisma.user.findUnique({
      where: { id: guestId },
      include: {
        reservations: {
          include: {
            property: true,
            reviews: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!guest) {
      throw new Error('Guest not found');
    }

    const preferences = await this.extractGuestPreferences(guest);
    const behaviorPatterns = await this.analyzeBehaviorPatterns(guest);
    const lifetimeValue = await this.calculateLifetimeValue(guest);
    const riskScore = await this.calculateRiskScore(guest);
    const recommendations = await this.generateRecommendations(preferences, behaviorPatterns);

    return {
      id: guest.id,
      email: guest.email,
      preferences,
      behaviorPatterns,
      lifetimeValue,
      riskScore,
      recommendations
    };
  }

  // Extract guest preferences from booking history
  private async extractGuestPreferences(guest: any): Promise<GuestPreferences> {
    const reservations = guest.reservations;
    
    if (reservations.length === 0) {
      return this.getDefaultPreferences();
    }

    const propertyTypes = [...new Set(reservations.map((r: any) => r.property.propertyType))];
    const amenities = this.extractAmenitiesFromReservations(reservations);
    const locations = [...new Set(reservations.map((r: any) => `${r.property.city}, ${r.property.state}`))];
    
    const prices = reservations.map((r: any) => Number(r.totalAmount || 0));
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };

    const stayDurations = reservations.map((r: any) => {
      const checkIn = new Date(r.checkIn);
      const checkOut = new Date(r.checkOut);
      return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    });

    const stayDuration = {
      min: Math.min(...stayDurations),
      max: Math.max(...stayDurations)
    };

    const bookingAdvances = reservations.map((r: any) => {
      const bookingDate = new Date(r.createdAt);
      const checkIn = new Date(r.checkIn);
      return Math.ceil((checkIn.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24));
    });

    const averageAdvance = bookingAdvances.reduce((a, b) => a + b, 0) / bookingAdvances.length;

    return {
      propertyTypes,
      amenities,
      locations,
      priceRange,
      stayDuration,
      bookingAdvance: Math.round(averageAdvance),
      seasonalPreferences: this.extractSeasonalPreferences(reservations),
      groupSize: this.extractGroupSizePreferences(reservations)
    };
  }

  // Analyze behavioral patterns
  private async analyzeBehaviorPatterns(guest: any): Promise<BehaviorPatterns> {
    const reservations = guest.reservations;
    
    if (reservations.length === 0) {
      return this.getDefaultBehaviorPatterns();
    }

    const totalBookings = reservations.length;
    const cancellations = reservations.filter((r: any) => r.status === 'CANCELLED').length;
    const cancellationRate = (cancellations / totalBookings) * 100;

    const reviews = reservations.flatMap((r: any) => r.reviews);
    const averageReviewScore = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length 
      : 0;

    const stayDurations = reservations.map((r: any) => {
      const checkIn = new Date(r.checkIn);
      const checkOut = new Date(r.checkOut);
      return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    });

    const averageStayDuration = stayDurations.reduce((a, b) => a + b, 0) / stayDurations.length;

    // Analyze check-in/check-out day preferences
    const checkInDays = reservations.map((r: any) => new Date(r.checkIn).toLocaleDateString('en-US', { weekday: 'long' }));
    const checkOutDays = reservations.map((r: any) => new Date(r.checkOut).toLocaleDateString('en-US', { weekday: 'long' }));

    const preferredCheckInDay = this.getMostFrequent(checkInDays);
    const preferredCheckOutDay = this.getMostFrequent(checkOutDays);

    // Calculate repeat booking rate
    const uniqueProperties = [...new Set(reservations.map((r: any) => r.propertyId))];
    const repeatBookingRate = ((totalBookings - uniqueProperties.length) / totalBookings) * 100;

    return {
      bookingFrequency: totalBookings / Math.max(1, this.getYearsSinceFirstBooking(reservations)),
      cancellationRate,
      reviewScore: averageReviewScore,
      responseTime: this.calculateAverageResponseTime(reservations),
      repeatBookingRate,
      lastBookingDate: new Date(Math.max(...reservations.map((r: any) => new Date(r.createdAt).getTime()))),
      totalBookings,
      averageStayDuration,
      preferredCheckInDay,
      preferredCheckOutDay
    };
  }

  // Calculate guest lifetime value
  private async calculateLifetimeValue(guest: any): Promise<number> {
    const reservations = guest.reservations;
    
    if (reservations.length === 0) return 0;

    const totalSpent = reservations
      .filter((r: any) => r.status === 'CONFIRMED')
      .reduce((sum, r) => sum + Number(r.totalAmount || 0), 0);

    const yearsSinceFirstBooking = this.getYearsSinceFirstBooking(reservations);
    const annualValue = totalSpent / Math.max(1, yearsSinceFirstBooking);

    // Project future value based on behavior patterns
    const behaviorPatterns = await this.analyzeBehaviorPatterns(guest);
    const projectedYears = 5; // Project 5 years ahead
    const projectedValue = annualValue * projectedYears * (1 - behaviorPatterns.cancellationRate / 100);

    return Math.round(projectedValue);
  }

  // Calculate risk score for the guest
  private async calculateRiskScore(guest: any): Promise<number> {
    const reservations = guest.reservations;
    
    if (reservations.length === 0) return 50; // Medium risk for new guests

    const behaviorPatterns = await this.analyzeBehaviorPatterns(guest);
    
    let riskScore = 50; // Base risk score

    // Adjust based on cancellation rate
    if (behaviorPatterns.cancellationRate > 20) riskScore += 30;
    else if (behaviorPatterns.cancellationRate > 10) riskScore += 15;
    else if (behaviorPatterns.cancellationRate < 5) riskScore -= 10;

    // Adjust based on review score
    if (behaviorPatterns.reviewScore < 3) riskScore += 20;
    else if (behaviorPatterns.reviewScore > 4.5) riskScore -= 15;

    // Adjust based on repeat booking rate
    if (behaviorPatterns.repeatBookingRate > 50) riskScore -= 20;
    else if (behaviorPatterns.repeatBookingRate < 10) riskScore += 10;

    // Adjust based on booking frequency
    if (behaviorPatterns.bookingFrequency > 3) riskScore -= 10;
    else if (behaviorPatterns.bookingFrequency < 1) riskScore += 15;

    return Math.max(0, Math.min(100, riskScore));
  }

  // Generate personalized recommendations
  private async generateRecommendations(preferences: GuestPreferences, behaviorPatterns: BehaviorPatterns): Promise<string[]> {
    const recommendations: string[] = [];

    // Property recommendations based on preferences
    if (preferences.propertyTypes.length > 0) {
      recommendations.push(`Consider properties of type: ${preferences.propertyTypes.join(', ')}`);
    }

    // Pricing recommendations
    if (preferences.priceRange.max > 0) {
      recommendations.push(`Your preferred price range: $${preferences.priceRange.min} - $${preferences.priceRange.max} per night`);
    }

    // Location recommendations
    if (preferences.locations.length > 0) {
      recommendations.push(`Popular locations for you: ${preferences.locations.join(', ')}`);
    }

    // Booking timing recommendations
    if (behaviorPatterns.bookingFrequency > 0) {
      const nextBookingDate = new Date();
      nextBookingDate.setDate(nextBookingDate.getDate() + preferences.bookingAdvance);
      recommendations.push(`Consider booking ${preferences.bookingAdvance} days in advance for best availability`);
    }

    // Stay duration recommendations
    if (behaviorPatterns.averageStayDuration > 0) {
      recommendations.push(`Your average stay duration: ${Math.round(behaviorPatterns.averageStayDuration)} days`);
    }

    // Seasonal recommendations
    if (preferences.seasonalPreferences.length > 0) {
      recommendations.push(`Preferred seasons: ${preferences.seasonalPreferences.join(', ')}`);
    }

    return recommendations;
  }

  // Helper methods
  private getDefaultPreferences(): GuestPreferences {
    return {
      propertyTypes: [],
      amenities: [],
      locations: [],
      priceRange: { min: 0, max: 0 },
      stayDuration: { min: 1, max: 7 },
      bookingAdvance: 30,
      seasonalPreferences: [],
      groupSize: { min: 1, max: 4 }
    };
  }

  private getDefaultBehaviorPatterns(): BehaviorPatterns {
    return {
      bookingFrequency: 0,
      cancellationRate: 0,
      reviewScore: 0,
      responseTime: 0,
      repeatBookingRate: 0,
      lastBookingDate: new Date(),
      totalBookings: 0,
      averageStayDuration: 0,
      preferredCheckInDay: 'Friday',
      preferredCheckOutDay: 'Sunday'
    };
  }

  private extractAmenitiesFromReservations(reservations: any[]): string[] {
    const allAmenities: string[] = [];
    reservations.forEach((r: any) => {
      if (r.property.amenities) {
        allAmenities.push(...r.property.amenities);
      }
    });
    return [...new Set(allAmenities)];
  }

  private extractSeasonalPreferences(reservations: any[]): string[] {
    const seasons: string[] = [];
    reservations.forEach((r: any) => {
      const month = new Date(r.checkIn).getMonth();
      if (month >= 2 && month <= 5) seasons.push('Spring');
      else if (month >= 6 && month <= 8) seasons.push('Summer');
      else if (month >= 9 && month <= 11) seasons.push('Fall');
      else seasons.push('Winter');
    });
    return [...new Set(seasons)];
  }

  private extractGroupSizePreferences(reservations: any[]): { min: number; max: number } {
    const guestCounts = reservations.map((r: any) => r.guestCount || 1);
    return {
      min: Math.min(...guestCounts),
      max: Math.max(...guestCounts)
    };
  }

  private getMostFrequent(arr: string[]): string {
    const counts: { [key: string]: number } = {};
    arr.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }

  private getYearsSinceFirstBooking(reservations: any[]): number {
    if (reservations.length === 0) return 0;
    const firstBooking = new Date(Math.min(...reservations.map((r: any) => new Date(r.createdAt).getTime())));
    const now = new Date();
    return (now.getTime() - firstBooking.getTime()) / (1000 * 60 * 60 * 24 * 365);
  }

  private calculateAverageResponseTime(reservations: any[]): number {
    // This would need to be implemented based on your messaging system
    return 24; // Default 24 hours
  }

  // Get AI-powered guest insights
  async getGuestInsights(guestId: string): Promise<any> {
    const profile = await this.analyzeGuestBehavior(guestId);
    
    return {
      profile,
      insights: {
        guestType: this.classifyGuestType(profile),
        predictedNextBooking: this.predictNextBooking(profile),
        recommendedProperties: await this.getRecommendedProperties(profile),
        pricingStrategy: this.getPricingStrategy(profile),
        communicationStyle: this.getCommunicationStyle(profile)
      }
    };
  }

  private classifyGuestType(profile: GuestProfile): string {
    if (profile.behaviorPatterns.repeatBookingRate > 70) return 'Loyal Guest';
    if (profile.lifetimeValue > 10000) return 'High-Value Guest';
    if (profile.behaviorPatterns.cancellationRate > 20) return 'Risky Guest';
    if (profile.behaviorPatterns.bookingFrequency > 5) return 'Frequent Guest';
    return 'Regular Guest';
  }

  private predictNextBooking(profile: GuestProfile): Date {
    const avgDaysBetweenBookings = 365 / profile.behaviorPatterns.bookingFrequency;
    const nextBooking = new Date(profile.behaviorPatterns.lastBookingDate);
    nextBooking.setDate(nextBooking.getDate() + avgDaysBetweenBookings);
    return nextBooking;
  }

  private async getRecommendedProperties(profile: GuestProfile): Promise<any[]> {
    // This would query your property database based on guest preferences
    return [];
  }

  private getPricingStrategy(profile: GuestProfile): string {
    if (profile.lifetimeValue > 10000) return 'Premium Pricing';
    if (profile.behaviorPatterns.cancellationRate > 20) return 'Higher Deposit Required';
    if (profile.behaviorPatterns.repeatBookingRate > 50) return 'Loyalty Discount';
    return 'Standard Pricing';
  }

  private getCommunicationStyle(profile: GuestProfile): string {
    if (profile.behaviorPatterns.responseTime < 12) return 'Quick Response Required';
    if (profile.behaviorPatterns.reviewScore > 4.5) return 'Detailed Communication';
    if (profile.behaviorPatterns.cancellationRate > 15) return 'Clear Cancellation Policy';
    return 'Standard Communication';
  }
} 