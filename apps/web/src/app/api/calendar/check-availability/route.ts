import { NextRequest, NextResponse } from 'next/server';
import { googleCalendarService } from '../../../../lib/google-calendar';

export async function POST(request: NextRequest) {
  try {
    const { startDate, endDate } = await request.json();

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    console.log('🔍 Checking availability from', startDate, 'to', endDate);

    const availableSlots = await googleCalendarService.getAvailableSlots(startDate, endDate);

    console.log('✅ Found', availableSlots.length, 'slots,', 
      availableSlots.filter(slot => slot.available).length, 'available');

    return NextResponse.json({
      success: true,
      availableSlots
    });

  } catch (error) {
    console.error('❌ Availability check error:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
} 