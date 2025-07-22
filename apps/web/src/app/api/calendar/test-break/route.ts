import { NextRequest, NextResponse } from 'next/server';
import { googleCalendarService } from '../../../../lib/google-calendar';

export async function GET(request: NextRequest) {
  try {
    // Test creating a consultation with break
    const testResult = await googleCalendarService.createConsultationEvent({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phone: '555-1234',
      company: 'Test Company',
      propertyCount: '5',
      message: 'This is a test consultation to verify break events work',
      selectedDate: '2024-07-16', // Tomorrow
      selectedTime: '14:00', // 2 PM
      preferredMethod: 'video'
    });

    if (testResult.success) {
      return NextResponse.json({
        success: true,
        message: 'Test consultation created successfully',
        eventId: testResult.eventId
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Failed to create test consultation',
        error: testResult.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Test consultation error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 