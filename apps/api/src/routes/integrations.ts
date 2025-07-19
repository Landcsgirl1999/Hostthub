import express from 'express';
import { prisma } from '@hostit/db';

const router = express.Router();

// Get all integrations for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const integrations = await prisma.platformIntegration.findMany({
      where: { userId: userId as string },
      include: {
        platform: true,
        properties: {
          include: {
            property: true
          }
        }
      }
    });
    
    res.json(integrations);
  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
});

// Connect to a new platform
router.post('/connect', async (req, res) => {
  try {
    const { userId, platformId, apiKey, apiSecret, accessToken, refreshToken, settings } = req.body;
    
    if (!userId || !platformId) {
      return res.status(400).json({ error: 'userId and platformId are required' });
    }

    // Check if integration already exists
    const existingIntegration = await prisma.platformIntegration.findFirst({
      where: {
        userId,
        platformId
      }
    });

    if (existingIntegration) {
      return res.status(400).json({ error: 'Integration already exists for this platform' });
    }

    const integration = await prisma.platformIntegration.create({
      data: {
        userId,
        platformId,
        apiKey: apiKey || null,
        apiSecret: apiSecret || null,
        accessToken: accessToken || null,
        refreshToken: refreshToken || null,
        settings: settings || {},
        status: 'CONNECTED',
        lastSync: new Date()
      },
      include: {
        platform: true
      }
    });
    
    res.status(201).json(integration);
  } catch (error) {
    console.error('Error connecting platform:', error);
    res.status(500).json({ error: 'Failed to connect platform' });
  }
});

// Disconnect from a platform
router.delete('/disconnect/:integrationId', async (req, res) => {
  try {
    const { integrationId } = req.params;
    
    await prisma.platformIntegration.delete({
      where: { id: integrationId }
    });
    
    res.json({ message: 'Integration disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting platform:', error);
    res.status(500).json({ error: 'Failed to disconnect platform' });
  }
});

// Sync listings from a platform
router.post('/sync/:integrationId', async (req, res) => {
  try {
    const { integrationId } = req.params;
    
    const integration = await prisma.platformIntegration.findUnique({
      where: { id: integrationId },
      include: { platform: true }
    });
    
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    // Update last sync time
    await prisma.platformIntegration.update({
      where: { id: integrationId },
      data: { lastSync: new Date() }
    });

    // Here you would implement the actual sync logic for each platform
    // This is a placeholder for the sync functionality
    res.json({ 
      message: `Syncing ${integration.platform.name} listings...`,
      integrationId,
      platform: integration.platform.name
    });
  } catch (error) {
    console.error('Error syncing platform:', error);
    res.status(500).json({ error: 'Failed to sync platform' });
  }
});

// Get available platforms
router.get('/platforms', async (req, res) => {
  try {
    const platforms = await prisma.externalPlatform.findMany({
      orderBy: { name: 'asc' }
    });
    
    res.json(platforms);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({ error: 'Failed to fetch platforms' });
  }
});

// Get integration status
router.get('/status/:integrationId', async (req, res) => {
  try {
    const { integrationId } = req.params;
    
    const integration = await prisma.platformIntegration.findUnique({
      where: { id: integrationId },
      include: {
        platform: true,
        properties: {
          include: {
            property: true
          }
        }
      }
    });
    
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }
    
    res.json(integration);
  } catch (error) {
    console.error('Error fetching integration status:', error);
    res.status(500).json({ error: 'Failed to fetch integration status' });
  }
});

export default router; 