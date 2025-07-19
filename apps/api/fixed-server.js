const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Basic middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Hostit API'
  });
});

// Test database connection endpoint
app.get('/test-db', async (req, res) => {
  try {
    const { PrismaClient } = require('@hostit/db');
    const testPrisma = new PrismaClient();
    
    const user = await testPrisma.user.findUnique({
      where: { email: 'Sierra.reynolds@Hostit.com' }
    });
    
    await testPrisma.$disconnect();
    
    res.json({
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
      userFound: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      } : null
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ error: message });
  }
});

// Simple login endpoint
app.post('/simple-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔍 Simple login attempt for:', email);
    
    const { PrismaClient } = require('@hostit/db');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const testPrisma = new PrismaClient();
    
    const user = await testPrisma.user.findUnique({
      where: { email }
    });
    
    console.log('�� User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      await testPrisma.$disconnect();
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password || '');
    console.log('🔐 Password valid:', isValidPassword);
    
    await testPrisma.$disconnect();
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'hostit-super-secret-jwt-key-2024',
      { expiresIn: '24h' }
    );
    
    console.log('🎉 Simple login successful for:', email);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Simple login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hostit API is running!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      testDb: '/test-db',
      simpleLogin: '/simple-login'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Fixed server running on port ${PORT}`);
  console.log(`�� Health check: http://localhost:${PORT}/health`);
}); 