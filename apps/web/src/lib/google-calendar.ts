import { google } from 'googleapis';

interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{ email: string }>;
  reminders?: {
    useDefault: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
  conferenceData?: {
    createRequest: {
      requestId: string;
      conferenceSolutionKey: {
        type: string;
      };
    };
  };
}

export class GoogleCalendarService {
  private calendar: any;
  private calendarId: string;

  constructor() {
    this.calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    this.initializeCalendar();
  }

  private initializeCalendar() {
    try {
      // Use OAuth2 authentication for Application Data API
      const auth = new google.auth.OAuth2(
        process.env.GOOGLE_OAUTH_CLIENT_ID,
        process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        process.env.GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:3003/api/auth/callback/google'
      );

      // For server-side applications, we'll use a refresh token approach
      // In production, you'd store and retrieve the refresh token from your database
      if (process.env.GOOGLE_REFRESH_TOKEN) {
        auth.setCredentials({
          refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });
      }

      this.calendar = google.calendar({ version: 'v3', auth });
      console.log('✅ Google Calendar service initialized with OAuth2');
    } catch (error) {
      console.error('Failed to initialize Google Calendar with OAuth2:', error);
      // Fallback to API key if OAuth is not configured
      try {
        const auth = new google.auth.GoogleAuth({
          apiKey: process.env.GOOGLE_API_KEY,
          scopes: ['https://www.googleapis.com/auth/calendar'],
        });
        this.calendar = google.calendar({ version: 'v3', auth });
        console.log('✅ Google Calendar service initialized with API key (fallback)');
      } catch (fallbackError) {
        console.error('Failed to initialize Google Calendar with fallback:', fallbackError);
      }
    }
  }

  async createConsultationEvent(consultationData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    propertyCount: string;
    message?: string;
    selectedDate: string;
    selectedTime: string;
    preferredMethod: string;
  }): Promise<{ success: boolean; eventId?: string; breakEventId?: string; error?: string }> {
    try {
      if (!this.calendar) {
        throw new Error('Calendar not initialized');
      }

      // Parse date and time
      const [year, month, day] = consultationData.selectedDate.split('-').map(Number);
      const [hour, minute] = consultationData.selectedTime.split(':').map(Number);
      
      // Create start and end times (30-minute consultation + 30-minute break = 1 hour total)
      const startTime = new Date(year, month - 1, day, hour, minute);
      const meetingEndTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 minutes for meeting
      const totalEndTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour total (meeting + break)

      console.log(`Creating consultation event:`);
      console.log(`  Meeting: ${startTime.toISOString()} - ${meetingEndTime.toISOString()} (30 min)`);
      console.log(`  Break: ${meetingEndTime.toISOString()} - ${totalEndTime.toISOString()} (30 min)`);
      console.log(`  Total blocked time: ${startTime.toISOString()} - ${totalEndTime.toISOString()} (1 hour)`);

      const adminEmail = process.env.ADMIN_EMAIL || 'sierra.reynolds@hostithub.com';

      // Create the consultation meeting event (30 minutes)
      const meetingEvent: CalendarEvent = {
        summary: `Hostithub Consultation - ${consultationData.firstName} ${consultationData.lastName}`,
        description: `
Consultation Request Details:
- Name: ${consultationData.firstName} ${consultationData.lastName}
- Email: ${consultationData.email}
- Phone: ${consultationData.phone || 'Not provided'}
- Company: ${consultationData.company || 'Not provided'}
- Properties: ${consultationData.propertyCount}
- Preferred Method: ${consultationData.preferredMethod}
- Additional Info: ${consultationData.message || 'None'}

This consultation was booked through the Hostithub.com website.
        `.trim(),
        start: {
          dateTime: startTime.toISOString(),
          timeZone: process.env.TIMEZONE || 'America/New_York',
        },
        end: {
          dateTime: meetingEndTime.toISOString(),
          timeZone: process.env.TIMEZONE || 'America/New_York',
        },
        attendees: [
          { email: consultationData.email },
          { email: adminEmail },
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours
            { method: 'popup', minutes: 15 }, // 15 minutes
          ],
        },
      };

      // Add Google Meet for video consultations
      if (consultationData.preferredMethod === 'video') {
        meetingEvent.conferenceData = {
          createRequest: {
            requestId: `consultation-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        };
      }

      // Create the meeting event
      const meetingResponse = await this.calendar.events.insert({
        calendarId: this.calendarId,
        requestBody: meetingEvent,
        conferenceDataVersion: consultationData.preferredMethod === 'video' ? 1 : 0,
        sendUpdates: 'all', // Send invitations to attendees
      });

      console.log('✅ Consultation meeting event created:', meetingResponse.data.id);

      // Create the break event (30 minutes, only for admin)
      const breakEvent: CalendarEvent = {
        summary: `Break - After ${consultationData.firstName} ${consultationData.lastName} Consultation`,
        description: `
Break period after consultation with ${consultationData.firstName} ${consultationData.lastName}.

Use this time for:
- Follow-up notes and documentation
- Preparation for next meeting
- Administrative tasks
- Brief rest period
        `.trim(),
        start: {
          dateTime: meetingEndTime.toISOString(),
          timeZone: process.env.TIMEZONE || 'America/New_York',
        },
        end: {
          dateTime: totalEndTime.toISOString(),
          timeZone: process.env.TIMEZONE || 'America/New_York',
        },
        attendees: [
          { email: adminEmail }, // Only admin gets the break event
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'popup', minutes: 5 }, // 5 minutes before break starts
          ],
        },
      };

      // Create the break event
      const breakResponse = await this.calendar.events.insert({
        calendarId: this.calendarId,
        requestBody: breakEvent,
        sendUpdates: 'none', // Don't send updates for break events
      });

      console.log('✅ Break event created:', breakResponse.data.id);

      return {
        success: true,
        eventId: meetingResponse.data.id,
        breakEventId: breakResponse.data.id
      };

    } catch (error) {
      console.error('❌ Failed to create consultation event:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getEvents(startDate: string, endDate: string): Promise<Array<{
    id: string;
    summary: string;
    description: string;
    start: string;
    end: string;
    attendees: Array<{ email: string }>;
    conferenceData?: any;
    htmlLink?: string;
  }>> {
    try {
      if (!this.calendar) {
        throw new Error('Calendar not initialized');
      }

      const response = await this.calendar.events.list({
        calendarId: this.calendarId,
        timeMin: new Date(startDate).toISOString(),
        timeMax: new Date(endDate).toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 100,
      });

      const events = response.data.items || [];
      
      return events.map((event: any) => ({
        id: event.id,
        summary: event.summary || 'No Title',
        description: event.description || '',
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        attendees: event.attendees || [],
        conferenceData: event.conferenceData,
        htmlLink: event.htmlLink,
      }));
    } catch (error) {
      console.error('❌ Failed to fetch Google Calendar events:', error);
      return [];
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string; calendarInfo?: any }> {
    try {
      if (!this.calendar) {
        return { success: false, error: 'Calendar not initialized' };
      }

      // Test calendar access
      const response = await this.calendar.calendars.get({
        calendarId: this.calendarId,
      });

      console.log('✅ Google Calendar connection test successful');
      return {
        success: true,
        calendarInfo: {
          id: response.data.id,
          summary: response.data.summary,
          timeZone: response.data.timeZone,
          accessRole: response.data.accessRole
        }
      };
    } catch (error) {
      console.error('❌ Google Calendar connection test failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getAvailableSlots(startDate: string, endDate: string): Promise<Array<{ date: string; time: string; available: boolean; reason?: string }>> {
    try {
      if (!this.calendar) {
        console.warn('Calendar not initialized, using fallback slots');
        return this.generateFallbackSlots(startDate, endDate);
      }

      // Test connection first
      const connectionTest = await this.testConnection();
      if (!connectionTest.success) {
        console.warn('Google Calendar connection failed, using fallback slots:', connectionTest.error);
        return this.generateFallbackSlots(startDate, endDate);
      }

      console.log('✅ Google Calendar connection verified');

      // Get existing events from Google Calendar
      const existingEvents = await this.getEvents(startDate, endDate);
      console.log(`Found ${existingEvents.length} existing events in Google Calendar`);
      
      // Log all events for debugging
      existingEvents.forEach((event, index) => {
        console.log(`Event ${index + 1}: "${event.summary}" - ${event.start} to ${event.end}`);
      });

      // Generate all possible time slots
      const allSlots = this.generateAllTimeSlots(startDate, endDate);
      
      // Check each slot against existing events
      const availableSlots = allSlots.map(slot => {
        const slotStart = new Date(`${slot.date}T${slot.time}:00`);
        const slotEnd = new Date(slotStart.getTime() + 30 * 60 * 1000); // 30 minutes for meeting
        
        console.log(`\nChecking slot ${slot.date} ${slot.time}: ${slotStart.toISOString()} - ${slotEnd.toISOString()}`);
        
        // Check if this slot conflicts with any existing event
        const conflictingEvent = existingEvents.find(event => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          
          console.log(`  Comparing with: "${event.summary}" - ${eventStart.toISOString()} to ${eventEnd.toISOString()}`);
          
          // Check if this is a consultation event
          const isConsultationEvent = event.summary && event.summary.includes('Hostithub Consultation');
          
          // Check if this is a break event (multiple possible patterns)
          const isBreakEvent = event.summary && (
            event.summary.includes('Break - After') ||
            event.summary.includes('Break') ||
            event.summary.toLowerCase().includes('break')
          );
          
          console.log(`  Event type: ${isConsultationEvent ? 'Consultation' : isBreakEvent ? 'Break' : 'Other'}`);
          
          // Check for conflict - if any part of the 30-minute slot overlaps with any event, it's blocked
          const hasConflict = (slotStart < eventEnd && slotEnd > eventStart);
          
          if (hasConflict) {
            console.log(`  CONFLICT FOUND: ${slot.date} ${slot.time} conflicts with "${event.summary}"`);
          }
          
          return hasConflict;
        });

        if (conflictingEvent) {
          console.log(`  RESULT: ${slot.date} ${slot.time} - UNAVAILABLE (conflicts with "${conflictingEvent.summary}")`);
          return {
            ...slot,
            available: false,
            reason: 'Unavailable'
          };
        }

        console.log(`  RESULT: ${slot.date} ${slot.time} - AVAILABLE`);
        return {
          ...slot,
          available: true
        };
      });

      console.log(`\nFinal result: ${availableSlots.length} slots, ${availableSlots.filter(s => s.available).length} available`);
      return availableSlots;

    } catch (error) {
      console.error('Error getting available slots from Google Calendar:', error);
      console.log('Falling back to basic slots');
      return this.generateFallbackSlots(startDate, endDate);
    }
  }

  private generateAllTimeSlots(startDate: string, endDate: string): Array<{ date: string; time: string }> {
    const slots = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Generate slots for each day in the range
    for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
      // Skip weekends
      if (day.getDay() === 0 || day.getDay() === 6) continue;
      
      const dateStr = day.toISOString().split('T')[0];
      
      // Generate 30-minute time slots from 9 AM to 5 PM
      const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00'
      ];

      for (const timeStr of timeSlots) {
        slots.push({
          date: dateStr,
          time: timeStr
        });
      }
    }
    
    return slots;
  }

  private generateFallbackSlots(startDate: string, endDate: string): Array<{ date: string; time: string; available: boolean }> {
    const slots = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Generate slots for each day in the range
    for (let day = start; day <= end; day.setDate(day.getDate() + 1)) {
      // Skip weekends
      if (day.getDay() === 0 || day.getDay() === 6) continue;
      
      const dateStr = day.toISOString().split('T')[0];
      
      // Generate 30-minute time slots from 9 AM to 5 PM
      const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00'
      ];

      for (const timeStr of timeSlots) {
        slots.push({
          date: dateStr,
          time: timeStr,
          available: true
        });
      }
    }
    
    return slots;
  }
}

export const googleCalendarService = new GoogleCalendarService(); 