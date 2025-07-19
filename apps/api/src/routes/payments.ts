import { Router } from 'express';

const router = Router();

// Super simple test endpoint
router.get('/test', (req, res) => {
  console.log('🔍 Test endpoint called');
  try {
    res.json({
      success: true,
      message: 'Payments route is working',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT
      }
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Simple echo endpoint
router.post('/echo', (req, res) => {
  console.log('🔍 Echo endpoint called with:', req.body);
  res.json({
    success: true,
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

export default router; 