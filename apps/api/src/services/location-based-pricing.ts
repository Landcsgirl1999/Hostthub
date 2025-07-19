import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

export interface LocationFactors {
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  neighborhood: string;
  proximityToAttractions: number; // 0-100 score
  proximityToTransportation: number; // 0-100 score
  safetyScore: number; // 0-100 score
  walkabilityScore: number; // 0-100 score
}

export interface HolidayEvent {
  name: string;
  date: Date;
  type: 'holiday' | 'local_event' | 'sports_event' | 'conference' | 'festival';
  impact: 'high' | 'medium' | 'low';
  multiplier: number;
  description: string;
}

export interface SeasonalPattern {
  peakSeason: {
    startMonth: number;
    endMonth: number;
    multiplier: number;
  };
  shoulderSeason: {
    startMonth: number;
    endMonth: number;
    multiplier: number;
  };
  offSeason: {
    startMonth: number;
    endMonth: number;
    multiplier: number;
  };
}

export class LocationBasedPricingService {
  // Get location-based pricing factors
  async getLocationFactors(propertyId: string): Promise<LocationFactors> {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: {
        city: true,
        state: true,
        country: true,
        latitude: true,
        longitude: true,
        address: true
      }
    });

    if (!property) {
      throw new Error('Property not found');
    }

    // Calculate proximity scores based on location
    const proximityToAttractions = await this.calculateAttractionProximity(
      property.latitude, 
      property.longitude, 
      property.city
    );

    const proximityToTransportation = await this.calculateTransportationProximity(
      property.latitude, 
      property.longitude, 
      property.city
    );

    const safetyScore = await this.getSafetyScore(property.city, property.state);
    const walkabilityScore = await this.getWalkabilityScore(property.latitude, property.longitude);

    return {
      city: property.city,
      state: property.state,
      country: property.country,
      latitude: property.latitude,
      longitude: property.longitude,
      neighborhood: await this.getNeighborhood(property.latitude, property.longitude),
      proximityToAttractions,
      proximityToTransportation,
      safetyScore,
      walkabilityScore
    };
  }

  // Get holidays and events for a location and date range
  async getHolidaysAndEvents(
    city: string, 
    state: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<HolidayEvent[]> {
    const events: HolidayEvent[] = [];

    // Get national holidays
    const nationalHolidays = await this.getNationalHolidays(startDate, endDate);
    events.push(...nationalHolidays);

    // Get local events from various APIs
    const localEvents = await this.getLocalEvents(city, state, startDate, endDate);
    events.push(...localEvents);

    // Get sports events
    const sportsEvents = await this.getSportsEvents(city, state, startDate, endDate);
    events.push(...sportsEvents);

    // Get conferences and conventions
    const conferences = await this.getConferences(city, state, startDate, endDate);
    events.push(...conferences);

    return events;
  }

  // Calculate location-based price multiplier
  async calculateLocationMultiplier(propertyId: string, date: Date): Promise<number> {
    const locationFactors = await this.getLocationFactors(propertyId);
    const events = await this.getHolidaysAndEvents(
      locationFactors.city, 
      locationFactors.state, 
      date, 
      date
    );

    let multiplier = 1.0;

    // Base location multiplier based on neighborhood and amenities
    const baseLocationMultiplier = this.calculateBaseLocationMultiplier(locationFactors);
    multiplier *= baseLocationMultiplier;

    // Event multiplier
    const eventMultiplier = this.calculateEventMultiplier(events, date);
    multiplier *= eventMultiplier;

    // Seasonal multiplier based on location
    const seasonalMultiplier = this.calculateLocationSeasonalMultiplier(locationFactors, date);
    multiplier *= seasonalMultiplier;

    // Weather multiplier
    const weatherMultiplier = await this.calculateWeatherMultiplier(locationFactors, date);
    multiplier *= weatherMultiplier;

    return multiplier;
  }

  // Calculate base location multiplier
  private calculateBaseLocationMultiplier(factors: LocationFactors): number {
    let multiplier = 1.0;

    // Proximity to attractions (0-100 score)
    if (factors.proximityToAttractions >= 80) multiplier *= 1.3;
    else if (factors.proximityToAttractions >= 60) multiplier *= 1.2;
    else if (factors.proximityToAttractions >= 40) multiplier *= 1.1;
    else if (factors.proximityToAttractions <= 20) multiplier *= 0.9;

    // Proximity to transportation
    if (factors.proximityToTransportation >= 80) multiplier *= 1.2;
    else if (factors.proximityToTransportation >= 60) multiplier *= 1.1;
    else if (factors.proximityToTransportation <= 30) multiplier *= 0.95;

    // Safety score
    if (factors.safetyScore >= 80) multiplier *= 1.15;
    else if (factors.safetyScore <= 40) multiplier *= 0.9;

    // Walkability score
    if (factors.walkabilityScore >= 80) multiplier *= 1.1;
    else if (factors.walkabilityScore <= 30) multiplier *= 0.95;

    return multiplier;
  }

  // Calculate event multiplier
  private calculateEventMultiplier(events: HolidayEvent[], date: Date): number {
    let multiplier = 1.0;
    
    for (const event of events) {
      if (this.isDateInEventRange(event, date)) {
        switch (event.impact) {
          case 'high':
            multiplier *= event.multiplier;
            break;
          case 'medium':
            multiplier *= (event.multiplier + 1) / 2;
            break;
          case 'low':
            multiplier *= 1 + (event.multiplier - 1) * 0.3;
            break;
        }
      }
    }

    return multiplier;
  }

  // Calculate location-specific seasonal multiplier
  private calculateLocationSeasonalMultiplier(factors: LocationFactors, date: Date): number {
    const month = date.getMonth() + 1;
    const seasonalPattern = this.getSeasonalPattern(factors.city, factors.state);

    if (this.isInSeason(month, seasonalPattern.peakSeason)) {
      return seasonalPattern.peakSeason.multiplier;
    } else if (this.isInSeason(month, seasonalPattern.shoulderSeason)) {
      return seasonalPattern.shoulderSeason.multiplier;
    } else {
      return seasonalPattern.offSeason.multiplier;
    }
  }

  // Get seasonal pattern for specific location
  private getSeasonalPattern(city: string, state: string): SeasonalPattern {
    // Location-specific seasonal patterns
    const patterns: { [key: string]: SeasonalPattern } = {
      // Beach destinations
      'Miami': {
        peakSeason: { startMonth: 12, endMonth: 4, multiplier: 1.4 },
        shoulderSeason: { startMonth: 5, endMonth: 6, multiplier: 1.2 },
        offSeason: { startMonth: 7, endMonth: 11, multiplier: 0.8 }
      },
      'Los Angeles': {
        peakSeason: { startMonth: 6, endMonth: 9, multiplier: 1.3 },
        shoulderSeason: { startMonth: 3, endMonth: 5, multiplier: 1.1 },
        offSeason: { startMonth: 10, endMonth: 2, multiplier: 0.9 }
      },
      // Mountain destinations
      'Denver': {
        peakSeason: { startMonth: 12, endMonth: 3, multiplier: 1.5 },
        shoulderSeason: { startMonth: 6, endMonth: 9, multiplier: 1.2 },
        offSeason: { startMonth: 4, endMonth: 5, multiplier: 0.8 }
      },
      // Business cities
      'New York': {
        peakSeason: { startMonth: 9, endMonth: 11, multiplier: 1.3 },
        shoulderSeason: { startMonth: 3, endMonth: 6, multiplier: 1.1 },
        offSeason: { startMonth: 7, endMonth: 8, multiplier: 0.9 }
      }
    };

    return patterns[city] || {
      peakSeason: { startMonth: 6, endMonth: 8, multiplier: 1.2 },
      shoulderSeason: { startMonth: 3, endMonth: 5, multiplier: 1.0 },
      offSeason: { startMonth: 9, endMonth: 2, multiplier: 0.8 }
    };
  }

  // Helper methods for API integrations
  private async calculateAttractionProximity(lat: number, lng: number, city: string): Promise<number> {
    // This would integrate with Google Places API or similar
    // For now, return mock data based on city
    const attractionScores: { [key: string]: number } = {
      'Miami': 85,
      'Los Angeles': 90,
      'New York': 95,
      'Denver': 70,
      'Austin': 75
    };
    
    return attractionScores[city] || 60;
  }

  private async calculateTransportationProximity(lat: number, lng: number, city: string): Promise<number> {
    // This would integrate with transit APIs
    const transitScores: { [key: string]: number } = {
      'New York': 95,
      'Los Angeles': 70,
      'Miami': 65,
      'Denver': 75,
      'Austin': 60
    };
    
    return transitScores[city] || 50;
  }

  private async getSafetyScore(city: string, state: string): Promise<number> {
    // This would integrate with crime data APIs
    const safetyScores: { [key: string]: number } = {
      'Miami': 75,
      'Los Angeles': 70,
      'New York': 80,
      'Denver': 85,
      'Austin': 80
    };
    
    return safetyScores[city] || 70;
  }

  private async getWalkabilityScore(lat: number, lng: number): Promise<number> {
    // This would integrate with Walk Score API
    return 70 + Math.random() * 20; // Mock data
  }

  private async getNeighborhood(lat: number, lng: number): Promise<string> {
    // This would integrate with Google Geocoding API
    return 'Downtown';
  }

  private async getNationalHolidays(startDate: Date, endDate: Date): Promise<HolidayEvent[]> {
    // This would integrate with a holidays API
    const holidays: HolidayEvent[] = [
      {
        name: 'New Year\'s Day',
        date: new Date(new Date().getFullYear(), 0, 1),
        type: 'holiday',
        impact: 'medium',
        multiplier: 1.2,
        description: 'National holiday'
      },
      {
        name: 'Independence Day',
        date: new Date(new Date().getFullYear(), 6, 4),
        type: 'holiday',
        impact: 'high',
        multiplier: 1.4,
        description: 'National holiday'
      }
    ];

    return holidays.filter(h => h.date >= startDate && h.date <= endDate);
  }

  private async getLocalEvents(city: string, state: string, startDate: Date, endDate: Date): Promise<HolidayEvent[]> {
    // This would integrate with Eventbrite, Ticketmaster, etc.
    const localEvents: { [key: string]: HolidayEvent[] } = {
      'Miami': [
        {
          name: 'Miami Art Week',
          date: new Date(new Date().getFullYear(), 11, 1),
          type: 'festival',
          impact: 'high',
          multiplier: 1.5,
          description: 'Major art festival'
        }
      ],
      'Austin': [
        {
          name: 'SXSW',
          date: new Date(new Date().getFullYear(), 2, 10),
          type: 'conference',
          impact: 'high',
          multiplier: 1.6,
          description: 'Major tech conference'
        }
      ]
    };

    return localEvents[city] || [];
  }

  private async getSportsEvents(city: string, state: string, startDate: Date, endDate: Date): Promise<HolidayEvent[]> {
    // This would integrate with sports APIs
    return [];
  }

  private async getConferences(city: string, state: string, startDate: Date, endDate: Date): Promise<HolidayEvent[]> {
    // This would integrate with conference APIs
    return [];
  }

  private async calculateWeatherMultiplier(factors: LocationFactors, date: Date): Promise<number> {
    // This would integrate with weather APIs
    const weatherData = await this.getWeatherData(factors.city, date);
    
    if (weatherData.temperature >= 70 && weatherData.temperature <= 85) {
      return 1.1; // Perfect weather
    } else if (weatherData.temperature < 40 || weatherData.temperature > 95) {
      return 0.9; // Extreme weather
    }
    
    return 1.0;
  }

  private async getWeatherData(city: string, date: Date) {
    // Mock weather data - would integrate with OpenWeatherMap or similar
    return {
      temperature: 75,
      conditions: 'sunny',
      precipitation: 0
    };
  }

  private isDateInEventRange(event: HolidayEvent, date: Date): boolean {
    const eventDate = new Date(event.date);
    const diffTime = Math.abs(date.getTime() - eventDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Event affects pricing for 3 days before and after
    return diffDays <= 3;
  }

  private isInSeason(month: number, season: { startMonth: number; endMonth: number }): boolean {
    if (season.startMonth <= season.endMonth) {
      return month >= season.startMonth && month <= season.endMonth;
    } else {
      // Handles seasons that span across year end
      return month >= season.startMonth || month <= season.endMonth;
    }
  }
} 