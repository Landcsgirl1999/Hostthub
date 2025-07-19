import express from 'express';
import { prisma } from '@hostit/db';

const router = express.Router();

// Test endpoint for debugging
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Time tracking API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      clockIn: 'POST /api/v1/time-entries/clock-in',
      clockOut: 'POST /api/v1/time-entries/clock-out',
      getEntries: 'GET /api/v1/time-entries',
      getActive: 'GET /api/v1/time-entries/active/:userId'
    }
  });
});

// Get all time entries (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { userId, taskId, startDate, endDate, status } = req.query;
    const where: any = {};
    
    if (userId) where.userId = userId as string;
    if (taskId) where.taskId = taskId as string;
    if (status) where.endTime = status === 'active' ? null : { not: null };
    
    // Enhanced date filtering with start and end dates
    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) {
        const start = new Date(startDate as string);
        start.setHours(0, 0, 0, 0);
        where.startTime.gte = start;
      }
      if (endDate) {
        const end = new Date(endDate as string);
        end.setHours(23, 59, 59, 999);
        where.startTime.lte = end;
      }
    }

    const entries = await prisma.timeEntry.findMany({
      where,
      include: { 
        user: { select: { id: true, name: true, email: true } },
        task: { select: { id: true, title: true } }
      },
      orderBy: { startTime: 'desc' }
    });
    
    res.json(entries);
  } catch (error) {
    console.error('Error fetching time entries:', error);
    res.status(500).json({ error: 'Failed to fetch time entries' });
  }
});

// Clock in (create a new time entry)
router.post('/clock-in', async (req, res) => {
  try {
    const { userId, taskId, notes } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Check if user already has an active time entry
    const activeEntry = await prisma.timeEntry.findFirst({
      where: { 
        userId,
        endTime: null
      }
    });

    if (activeEntry) {
      return res.status(400).json({ error: 'User already has an active time entry' });
    }

    const entry = await prisma.timeEntry.create({
      data: {
        userId,
        taskId: taskId || null,
        startTime: new Date(),
        notes: notes || null,
      },
      include: { 
        user: { select: { id: true, name: true, email: true } },
        task: { select: { id: true, title: true } }
      }
    });
    
    res.status(201).json(entry);
  } catch (error) {
    console.error('Error clocking in:', error);
    res.status(500).json({ error: 'Failed to clock in' });
  }
});

// Clock out (update an existing time entry)
router.post('/clock-out', async (req, res) => {
  try {
    const { entryId, notes } = req.body;
    
    if (!entryId) {
      return res.status(400).json({ error: 'entryId is required' });
    }

    const entry = await prisma.timeEntry.update({
      where: { id: entryId },
      data: {
        endTime: new Date(),
        notes: notes || null,
      },
      include: { 
        user: { select: { id: true, name: true, email: true } },
        task: { select: { id: true, title: true } }
      }
    });
    
    res.json(entry);
  } catch (error) {
    console.error('Error clocking out:', error);
    res.status(500).json({ error: 'Failed to clock out' });
  }
});

// Get active time entries for a user
router.get('/active/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const activeEntries = await prisma.timeEntry.findMany({
      where: { 
        userId,
        endTime: null
      },
      include: { 
        user: { select: { id: true, name: true, email: true } },
        task: { select: { id: true, title: true } }
      }
    });
    
    res.json(activeEntries);
  } catch (error) {
    console.error('Error fetching active entries:', error);
    res.status(500).json({ error: 'Failed to fetch active entries' });
  }
});

export default router; 