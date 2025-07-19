import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// Login endpoint
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    console.log('🔍 Login attempt for:', email);

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    // Find user by email (case-insensitive)
    const user = await prisma.user.findFirst({
      where: { 
        email: {
          equals: email,
          mode: 'insensitive'
        }
      },
      include: {
        account: true
      }
    });

    if (!user) {
      console.log('❌ User not found:', email);
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password || '');
    
    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', email);
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        accountId: user.accountId
      },
      process.env.JWT_SECRET || 'hostit-super-secret-jwt-key-2024',
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for:', email);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        accountId: user.accountId
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token endpoint
router.post('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    
    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hostit-super-secret-jwt-key-2024');
    
    res.json({
      valid: true,
      user: decoded
    });
  } catch (error) {
    console.error('❌ Token verification failed:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout endpoint
router.post('/logout', (req: Request, res: Response): void => {
  // In a real app, you might want to blacklist the token
  res.json({ success: true, message: 'Logged out successfully' });
});

// In the registration endpoint
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role = 'ADMIN' } = req.body;
    
    // Create account first
    const account = await prisma.account.create({
      data: {
        name: `${name}'s Account`,
        description: `Account for ${name}`,
        isActive: true
      }
    });
    
    // Create user with the new account
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(password, 12),
        role,
        accountId: account.id,
        isActive: true
      }
    });
    
    res.json({
      success: true,
      message: 'Account created successfully',
      accountNumber: account.accountNumber,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router; 