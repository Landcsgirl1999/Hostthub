import express from 'express';
import { prisma } from '@hostit/db';

const router = express.Router();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        property: true,
        assignedUser: true,
        timeEntries: true
      }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get task by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        property: true,
        assignedUser: true,
        timeEntries: true
      }
    });
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create new task
router.post('/', async (req, res) => {
  try {
    const task = await prisma.task.create({
      data: req.body,
      include: {
        property: true,
        assignedUser: true
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.update({
      where: { id },
      data: req.body,
      include: {
        property: true,
        assignedUser: true
      }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router; 