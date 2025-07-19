const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3003;

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Hostit API'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hostit API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      test: '/test'
    }
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint working!' });
});

// Simple login endpoint
app.post('/simple-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔍 Login attempt for:', email);
    
    // For now, accept any credentials for testing
    res.json({
      message: 'Login successful (test mode)',
      user: {
        email: email,
        role: 'SUPER_ADMIN'
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`�� Health check: http://localhost:${PORT}/health`);
}); 