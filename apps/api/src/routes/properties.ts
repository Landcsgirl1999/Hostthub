import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireManager } from '../middleware/auth';
import { priceSyncJob } from '../services/price-sync-job';

const router = express.Router();
const prisma = new PrismaClient();

// Get all properties (with ownership check)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: { ownerId: req.user!.userId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get property by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const property = await prisma.property.findFirst({
      where: {
        id: req.params.id,
        ownerId: req.user!.userId
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create new property
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      city,
      state,
      zipCode,
      country,
      propertyType,
      bedrooms,
      bathrooms,
      maxGuests,
      basePrice,
      cleaningFee,
      serviceFee,
      amenities,
      images,
      minimumStay
    } = req.body;

    const property = await prisma.property.create({
      data: {
        name,
        description,
        address,
        city,
        state,
        zipCode,
        country,
        propertyType,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        maxGuests: parseInt(maxGuests),
        basePrice: parseFloat(basePrice),
        cleaningFee: cleaningFee ? parseFloat(cleaningFee) : null,
        serviceFee: serviceFee ? parseFloat(serviceFee) : null,
        amenities: amenities || [],
        images: images || [],
        minimumStay: minimumStay ? parseInt(minimumStay) : 1,
        ownerId: req.user!.userId
      }
    });

    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      address,
      city,
      state,
      zipCode,
      country,
      propertyType,
      bedrooms,
      bathrooms,
      maxGuests,
      basePrice,
      cleaningFee,
      serviceFee,
      amenities,
      images,
      minimumStay
    } = req.body;

    const property = await prisma.property.update({
      where: {
        id: req.params.id
      },
      data: {
        name,
        description,
        address,
        city,
        state,
        zipCode,
        country,
        propertyType,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        maxGuests: parseInt(maxGuests),
        basePrice: parseFloat(basePrice),
        cleaningFee: cleaningFee ? parseFloat(cleaningFee) : null,
        serviceFee: serviceFee ? parseFloat(serviceFee) : null,
        amenities: amenities || [],
        images: images || [],
        minimumStay: minimumStay ? parseInt(minimumStay) : 1
      }
    });

    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await prisma.property.delete({
      where: {
        id: req.params.id
      }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Get calendar demand data for a property
router.get('/:id/calendar-demand', authenticateToken, async (req, res) => {
  try {
    const { year, month } = req.query;
    const propertyId = req.params.id;

    // Validate property ownership
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        ownerId: req.user!.userId
      }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Calculate date range for the month
    const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
    const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);

    // Get daily prices for the month
    const dailyPrices = await prisma.dailyPrice.findMany({
      where: {
        propertyId,
        date: {
          gte: startDate.toISOString().split('T')[0],
          lte: endDate.toISOString().split('T')[0]
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Calculate average base price
    const averageBasePrice = property.basePrice;

    // Format response for calendar
    const calendarData = dailyPrices.map(price => ({
      date: price.date,
      basePrice: price.basePrice,
      finalPrice: price.finalPrice,
      demandLevel: price.demandLevel,
      demandScore: price.demandScore,
      appliedRules: price.appliedRules,
      marketFactors: price.marketFactors,
      confidence: price.confidence
    }));

    res.json({
      propertyId,
      year: parseInt(year as string),
      month: parseInt(month as string),
      averageBasePrice,
      dailyPrices: calendarData
    });

  } catch (error) {
    console.error('Error fetching calendar demand:', error);
    res.status(500).json({ error: 'Failed to fetch calendar demand data' });
  }
});

// Manual trigger for price sync
router.post('/:id/sync-prices', authenticateToken, async (req, res) => {
  try {
    const propertyId = req.params.id;

    // Validate property ownership
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        ownerId: req.user!.userId
      }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Trigger price sync for this property
    await priceSyncJob.runPriceSync();

    res.json({ 
      message: 'Price sync triggered successfully',
      propertyId,
      status: 'running'
    });

  } catch (error) {
    console.error('Error triggering price sync:', error);
    res.status(500).json({ error: 'Failed to trigger price sync' });
  }
});

// Get price sync job status
router.get('/price-sync/status', authenticateToken, async (req, res) => {
  try {
    const status = priceSyncJob.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Error fetching price sync status:', error);
    res.status(500).json({ error: 'Failed to fetch price sync status' });
  }
});

export default router; 