import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@hostit/db';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema for consultation requests
const consultationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  propertyCount: z.string().min(1, 'Property count is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  message: z.string().optional()
});

// Helper to create a Google Calendar event
async function createGoogleCalendarEvent(consultation: any) {
  // TODO: Replace with your actual service account JSON path and calendar ID
  const SERVICE_ACCOUNT_KEY_PATH = path.join(__dirname, '../../../google-service-account.json');
  const CALENDAR_ID = 'sierra.reynolds@Hostit.com';

  // Load service account credentials
  const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_KEY_PATH, 'utf8'));

  // TODO: Fix google.auth.JWT instantiation to use correct arguments for your version of googleapis
  const auth = new google.auth.JWT(credentials);
  const calendar = google.calendar({ version: 'v3', auth });

  // Build event
  const event = {
    summary: `Hostit.com Consultation: ${consultation.name}`,
    description: `Email: ${consultation.email}\nPhone: ${consultation.phone || ''}\nCompany: ${consultation.company || ''}\nProperty Count: ${consultation.propertyCount}\nMessage: ${consultation.message || ''}`,
    start: {
      dateTime: new Date(consultation.preferredDate + 'T' + (consultation.preferredTime || '09:00')).toISOString(),
      timeZone: 'America/New_York', // TODO: Make configurable
    },
    end: {
      dateTime: new Date(new Date(consultation.preferredDate + 'T' + (consultation.preferredTime || '09:00')).getTime() + 30 * 60000).toISOString(),
      timeZone: 'America/New_York',
    },
    attendees: [
      { email: consultation.email },
      { email: 'sierra.reynolds@Hostit.com' }, // Sales team notification
    ],
  };

  // Insert event
  await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: event,
  });
}

// Create consultation request
router.post('/', async (req, res) => {
  try {
    // Validate input
    const validatedData = consultationSchema.parse(req.body);

    // Create consultation record
    const consultation = await prisma.consultationRequest.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        company: validatedData.company || null,
        propertyCount: validatedData.propertyCount,
        preferredDate: new Date(validatedData.preferredDate),
        preferredTime: validatedData.preferredTime,
        message: validatedData.message || null,
        status: 'PENDING',
        createdAt: new Date()
      }
    });

    // Google Calendar integration
    try {
      await createGoogleCalendarEvent({
        ...consultation,
        preferredTime: validatedData.preferredTime,
      });
    } catch (calendarErr) {
      console.error('Google Calendar error:', calendarErr);
      // Optionally, continue even if calendar fails
    }

    res.status(201).json({
      success: true,
      message: 'Consultation request submitted successfully',
      data: {
        id: consultation.id,
        status: consultation.status
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }

    console.error('Consultation request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit consultation request'
    });
  }
});

// Get all consultation requests (admin only)
router.get('/', async (req, res) => {
  try {
    // TODO: Add authentication middleware to ensure admin access
    
    const consultations = await prisma.consultationRequest.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: consultations
    });

  } catch (error) {
    console.error('Get consultations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch consultation requests'
    });
  }
});

// Update consultation status (admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const consultation = await prisma.consultationRequest.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    res.json({
      success: true,
      data: consultation
    });

  } catch (error) {
    console.error('Update consultation status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update consultation status'
    });
  }
});

export default router; 