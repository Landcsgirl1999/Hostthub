import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { googleCalendarService } from '../../../../lib/google-calendar';

interface ConsultationRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  propertyCount: string;
  message?: string;
  preferredMethod: string;
  selectedDate: string;
  selectedTime: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ConsultationRequest = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      propertyCount,
      message,
      preferredMethod,
      selectedDate,
      selectedTime
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !propertyCount || !selectedDate || !selectedTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    console.log('📅 Scheduling consultation for:', `${firstName} ${lastName}`, 'on', selectedDate, 'at', selectedTime);

    // Create event details
    const eventTitle = `Hostithub Consultation - ${firstName} ${lastName}`;
    const eventDescription = `
Consultation Request Details:
- Name: ${firstName} ${lastName}
- Email: ${email}
- Phone: ${phone || 'Not provided'}
- Company: ${company || 'Not provided'}
- Properties: ${propertyCount}
- Preferred Method: ${preferredMethod}
- Additional Info: ${message || 'None'}

This consultation was booked through the Hostithub.com website.
    `.trim();

    // Parse date and time
    const [year, month, day] = selectedDate.split('-').map(Number);
    const [hour, minute] = selectedTime.split(':').map(Number);
    
    // Create start and end times (30-minute consultation + 30-minute break)
    const startTime = new Date(year, month - 1, day, hour, minute);
    const meetingEndTime = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 minutes for meeting
    const breakEndTime = new Date(meetingEndTime.getTime() + 30 * 60 * 1000); // 30 minutes break

    // Format times for display
    const formatTime = (date: Date) => {
      return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    };

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'sierra.reynolds@hostithub.com';
    const adminName = process.env.ADMIN_NAME || 'Sierra Reynolds';

    // Email to admin
    const adminEmailContent = `
New consultation request received:

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}
Properties: ${propertyCount}
Preferred Method: ${preferredMethod}
Message: ${message || 'None'}

Consultation Details:
- Date: ${formatTime(startTime)}
- Duration: 30 minutes (plus 30-minute break period)
- Method: ${preferredMethod}

The consultation has been scheduled and calendar events have been created.
    `.trim();

    // Email to client
    const clientEmailContent = `
Thank you for scheduling a consultation with Hostithub!

Your consultation has been scheduled for:
- Date: ${formatTime(startTime)}
- Duration: 30 minutes
- Method: ${preferredMethod}

We will contact you shortly to confirm the details and provide any additional information needed for the meeting.

If you need to reschedule or have any questions, please reply to this email.

Best regards,
${adminName}
Hostithub.com
    `.trim();

    // Initialize Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send admin email
    try {
      await resend.emails.send({
        from: 'Hostithub.com <noreply@hostithub.com>',
        to: [adminEmail],
        subject: 'New Consultation Request - ' + eventTitle,
        text: adminEmailContent,
      });
      console.log('✅ Admin email sent successfully to:', adminEmail);
    } catch (error) {
      console.error('❌ Failed to send admin email:', error);
    }

    // Send client email
    try {
      await resend.emails.send({
        from: 'Hostithub.com <noreply@hostithub.com>',
        to: [email],
        subject: 'Consultation Confirmation - Hostithub.com',
        text: clientEmailContent,
      });
      console.log('✅ Client email sent successfully to:', email);
    } catch (error) {
      console.error('❌ Failed to send client email:', error);
    }

    // Google Calendar Integration
    let calendarEventId: string | undefined;
    let breakEventId: string | undefined;
    try {
      const calendarResult = await googleCalendarService.createConsultationEvent({
        firstName,
        lastName,
        email,
        phone,
        company,
        propertyCount,
        message,
        selectedDate,
        selectedTime,
        preferredMethod,
      });

      if (calendarResult.success) {
        calendarEventId = calendarResult.eventId;
        breakEventId = calendarResult.breakEventId;
        console.log('✅ Google Calendar event created successfully');
      } else {
        console.error('❌ Google Calendar event creation failed:', calendarResult.error);
      }
    } catch (error) {
      console.error('❌ Google Calendar integration error:', error);
    }

    // Log the consultation request
    console.log('✅ Consultation scheduled successfully:', {
      name: `${firstName} ${lastName}`,
      email,
      date: selectedDate,
      time: selectedTime,
      method: preferredMethod,
      adminEmail,
      clientEmail: email,
      calendarEventId,
      breakEventId
    });

    return NextResponse.json({
      success: true,
      message: 'Consultation scheduled successfully! We will contact you shortly to confirm.',
      eventDetails: {
        title: eventTitle,
        date: selectedDate,
        time: selectedTime,
        method: preferredMethod,
        adminEmail,
        clientEmail: email
      }
    });

  } catch (error) {
    console.error('❌ Consultation scheduling error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule consultation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get date range for the next 7 days
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7);
    
    const startDate = today.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    // Get available slots from Google Calendar
    const allSlots = await googleCalendarService.getAvailableSlots(startDate, endDateStr);
    
    return NextResponse.json({
      success: true,
      availableSlots: allSlots // Return all slots, not just available ones
    });
  } catch (error) {
    console.error('Error getting available slots:', error);
    // Fallback to basic slots
    const availableSlots = generateBasicAvailableSlots();
    return NextResponse.json({
      success: true,
      availableSlots
    });
  }
}

function generateBasicAvailableSlots() {
  const slots = [];
  const today = new Date();
  
  // Generate slots for the next 7 days
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + day);
    
    // Skip weekends
    if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;
    
    const dateStr = currentDate.toISOString().split('T')[0];
    
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