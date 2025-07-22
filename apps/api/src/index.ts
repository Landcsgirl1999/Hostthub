import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Import routes
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import invoicesRoutes from './routes/invoices';
// import analyticsRoutes from './routes/analytics';
// import billingRoutes from './routes/billing';
// import calendarRoutes from './routes/calendar';
// import consultationsRoutes from './routes/consultations';
// import integrationsRoutes from './routes/integrations';
// import paymentMethodsRoutes from './routes/payment-methods';
// import paymentsRoutes from './routes/payments';
// import propertiesRoutes from './routes/properties';
// import propertyAssignmentsRoutes from './routes/property-assignments';
// import reservationsRoutes from './routes/reservations';
// import settingsRoutes from './routes/settings';
// import subscriptionsRoutes from './routes/subscriptions';
// import tasksRoutes from './routes/tasks';
// import timeTrackingRoutes from './routes/time-tracking';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Simple login endpoint for testing
app.post('/simple-login', async (req: express.Request, res: express.Response) => {
  try {
    const { email } = req.body;
    console.log('🔍 Simple login attempt for:', email);
    
    console.log('🔗 Connecting to database...');
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    });
    
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // For testing, accept any password
    console.log('🔐 Checking password...');
    const isValidPassword = true; // bcrypt.compareSync(password, user.password);
    console.log('🔐 Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
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
      success: true, 
      token, 
              user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
    });
    return;
  } catch (error) {
    console.error('❌ Simple login error:', error);
    res.status(500).json({ error: 'Login failed' });
    return;
  }
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/invoices', invoicesRoutes);
// app.use('/api/v1/analytics', analyticsRoutes);
// app.use('/api/v1/billing', billingRoutes);
// app.use('/api/v1/calendar', calendarRoutes);
// app.use('/api/v1/consultations', consultationsRoutes);
// app.use('/api/v1/integrations', integrationsRoutes);
// app.use('/api/v1/payment-methods', paymentMethodsRoutes);
// app.use('/api/v1/payments', paymentsRoutes);
// app.use('/api/v1/properties', propertiesRoutes);
// app.use('/api/v1/property-assignments', propertyAssignmentsRoutes);
// app.use('/api/v1/reservations', reservationsRoutes);
// app.use('/api/v1/settings', settingsRoutes);
// app.use('/api/v1/subscriptions', subscriptionsRoutes);
// app.use('/api/v1/tasks', tasksRoutes);
// app.use('/api/v1/time-tracking', timeTrackingRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HostItHub API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
}); 