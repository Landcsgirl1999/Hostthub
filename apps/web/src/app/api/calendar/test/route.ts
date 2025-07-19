import { NextRequest, NextResponse } from 'next/server';
import { googleCalendarService } from '../../../../lib/google-calendar';

export async function GET(request: NextRequest) {
  try {
    const connectionTest = await googleCalendarService.testConnection();
    
    if (connectionTest.success) {
      return NextResponse.json({
        success: true,
        message: 'Google Calendar connection successful',
        calendarInfo: connectionTest.calendarInfo
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Google Calendar connection failed',
        error: connectionTest.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Calendar test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Calendar test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 