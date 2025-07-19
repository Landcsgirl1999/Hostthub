import express from 'express';
import { prisma } from '@hostit/db';

const router = express.Router();

// Get all calendars
router.get('/', async (req, res) => {
  try {
    const calendars = await prisma.calendar.findMany({
      include: {
        property: true,
        events: true
      }
    });
    res.json(calendars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calendars' });
  }
});

// Get calendar by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const calendar = await prisma.calendar.findUnique({
      where: { id },
      include: {
        property: true,
        events: true
      }
    });
    
    if (!calendar) {
      return res.status(404).json({ error: 'Calendar not found' });
    }
    
    res.json(calendar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch calendar' });
  }
});

// Create new calendar
router.post('/', async (req, res) => {
  try {
    const calendar = await prisma.calendar.create({
      data: req.body,
      include: {
        property: true
      }
    });
    res.status(201).json(calendar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create calendar' });
  }
});

// Update calendar
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const calendar = await prisma.calendar.update({
      where: { id },
      data: req.body,
      include: {
        property: true
      }
    });
    res.json(calendar);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update calendar' });
  }
});

// Delete calendar
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.calendar.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete calendar' });
  }
});

// Sync calendar events from iCal URL
router.post('/:id/sync', async (req, res) => {
  try {
    const { id } = req.params;
    const calendar = await prisma.calendar.findUnique({
      where: { id }
    });
    
    if (!calendar) {
      return res.status(404).json({ error: 'Calendar not found' });
    }
    
    // TODO: Implement iCal sync logic
    // This would fetch the iCal URL and parse events
    // Then create/update CalendarEvent records
    
    res.json({ message: 'Calendar sync initiated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync calendar' });
  }
});

export default router; 