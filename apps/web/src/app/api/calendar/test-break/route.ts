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

    if (testResult.succ 