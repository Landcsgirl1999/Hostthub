import { NextRequest, NextResponse } from 'next/server';
import { GoogleCalendarService } from '../../../../lib/google-calendar';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const userId = searchParams.get('userId');

  try {

    console.log('🔍 API Request Details:', {
      startDate,
      endDate,
      userId,
      url: request.url
    });

    if (!startDate || !endDate) {
      console.error('❌ Missing required parameters');
      return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 });
    }

    // Initialize Google Calendar service
    console.log('🔄 Initializing Google Calendar service...');
    const googleCalendarService = new GoogleCalendarService();
    
    // Fetch events from Google Calendar
    console.log('📅 Fetching events from Google Calendar...');
    const events = await googleCalendarService.getEvents(startDate, endDate);

    console.log(`✅ Successfully fetched ${events.length} Google Calendar events`);
    
    // Log each event for debugging
    if (events.length > 0) {
      console.log('📋 Events found:');
      events.forEach((event, index) => {
        const eventDate = new Date(event.start);
        console.log(`  ${index + 1}. ${event.summary} - ${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString()}`);
      });
    } else {
      console.log(' No events found in the specified date range');
    }

    return NextResponse.json({
      events: events,
      userId: userId,
      dateRange: { startDate, endDate },
      totalEvents: events.length
    });

  } catch (error) {
    console.error('❌ Error fetching Google Calendar events:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // Return empty events array instead of error to prevent UI issues
    return NextResponse.json({
      events: [],
      userId: userId,
      dateRange: { startDate, endDate },
      error: 'Failed to fetch Google Calendar events',
      errorDetails: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 