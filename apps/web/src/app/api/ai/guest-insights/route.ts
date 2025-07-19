import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get('guestId');

    if (!guestId) {
      return NextResponse.json({ error: 'Guest ID is required' }, { status: 400 });
    }

    // This would integrate with your GuestIntelligenceService
    // For now, return mock data
    const guestInsights = {
      guestId,
      profile: {
        id: guestId,
        email: 'guest@example.com',
        preferences: {
          propertyTypes: ['HOUSE', 'CABIN'],
          amenities: ['wifi', 'parking', 'kitchen'],
          locations: ['Mountain View, CA', 'Lake Tahoe, NV'],
          priceRange: { min: 150, max: 300 },
          stayDuration: { min: 2, max: 7 },
          bookingAdvance: 45,
          seasonalPreferences: ['Summer', 'Fall'],
          groupSize: { min: 2, max: 6 }
        },
        behaviorPatterns: {
          bookingFrequency: 3.2,
          cancellationRate: 8.5,
          reviewScore: 4.7,
          responseTime: 18,
          repeatBookingRate: 65,
          lastBookingDate: new Date('2024-01-15'),
          totalBookings: 12,
          averageStayDuration: 4.2,
          preferredCheckInDay: 'Friday',
          preferredCheckOutDay: 'Sunday'
        },
        lifetimeValue: 8500,
        riskScore: 25,
        recommendations: [
          'Consider properties with mountain views',
          'Book 45 days in advance for best availability',
          'Preferred price range: $150-$300 per night',
          'Popular locations: Mountain View, Lake Tahoe'
        ]
      },
      insights: {
        guestType: 'Loyal Guest',
        predictedNextBooking: new Date('2024-03-15'),
        recommendedProperties: [
          {
            id: 'prop1',
            name: 'Mountain View Cabin',
            matchScore: 95,
            reasons: ['Matches preferred location', 'Within price range', 'Has preferred amenities']
          }
        ],
        pricingStrategy: 'Loyalty Discount',
        communicationStyle: 'Detailed Communication'
      }
    };

    return NextResponse.json(guestInsights);
  } catch (error) {
    console.error('Error fetching guest insights:', error);
    return NextResponse.json({ error: 'Failed to fetch guest insights' }, { status: 500 });
  }
} 