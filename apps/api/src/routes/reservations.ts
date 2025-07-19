import express from 'express';
import { prisma } from '@hostit/db';

const router = express.Router();

// Get all reservations
router.get('/', async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        property: true,
        assignedUser: true,
        extras: true,
        payments: true
      }
    });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// Get reservation by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      include: {
        property: true,
        assignedUser: true,
        extras: true,
        payments: true,
        messages: true,
        expenses: true
      }
    });
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservation' });
  }
});

// Create new reservation
router.post('/', async (req, res) => {
  try {
    const reservation = await prisma.reservation.create({
      data: req.body,
      include: {
        property: true,
        assignedUser: true
      }
    });
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// Update reservation
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await prisma.reservation.update({
      where: { id },
      data: req.body,
      include: {
        property: true,
        assignedUser: true
      }
    });
    res.json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reservation' });
  }
});

// Delete reservation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.reservation.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
});

export default router; 