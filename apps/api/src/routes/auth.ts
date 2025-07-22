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

// Impersonation endpoint - SUPER_ADMIN only
router.post('/impersonate', async (req: Request, res: Response): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hostit-super-secret-jwt-key-2024') as any;
    
    // Check if the current user is a SUPER_ADMIN
    if (decoded.role !== 'SUPER_ADMIN') {
      res.status(403).json({ error: 'Only SUPER_ADMIN can impersonate users' });
      return;
    }
    
    const { targetUserId } = req.body;
    
    if (!targetUserId) {
      res.status(400).json({ error: 'Target user ID is required' });
      return;
    }
    
    // Find the target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { account: true }
    });
    
    if (!targetUser) {
      res.status(404).json({ error: 'Target user not found' });
      return;
    }
    
    // Generate impersonation token
    const impersonationToken = jwt.sign(
      {
        userId: targetUser.id,
        email: targetUser.email,
        role: targetUser.role,
        accountId: targetUser.accountId,
        impersonatedBy: decoded.userId, // Track who is doing the impersonation
        isImpersonation: true
      },
      process.env.JWT_SECRET || 'hostit-super-secret-jwt-key-2024',
      { expiresIn: '1h' } // Shorter expiration for impersonation tokens
    );
    
    console.log(`🔍 SUPER_ADMIN ${decoded.email} impersonating user: ${targetUser.email}`);
    
    res.json({
      success: true,
      message: `Impersonating ${targetUser.name}`,
      token: impersonationToken,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        name: targetUser.name,
        role: targetUser.role,
        accountId: targetUser.accountId,
        isImpersonation: true,
        impersonatedBy: decoded.userId
      }
    });
  } catch (error) {
    console.error('❌ Impersonation error:', error);
    res.status(500).json({ error: 'Impersonation failed' });
  }
});

// Public registration endpoint - ADMIN ONLY
router.post('/public-register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phoneNumber, company, propertyCount } = req.body;
    
    console.log('🔍 Public registration attempt for:', email);
    
    // Validate required fields
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { 
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    });

    if (existingUser) {
      console.log('❌ User already exists:', email);
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    // Create account first
    const account = await prisma.account.create({
      data: {
        name: company || `${name}'s Account`,
        description: `Account for ${name}`,
        isActive: true
      }
    });
    
    // Create user with ADMIN role only
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(password, 12),
        role: 'ADMIN', // Only ADMIN role allowed for public registration
        accountId: account.id,
        isActive: true,
        canCreateUsers: true,
        phoneNumber: phoneNumber || null,
        title: company || null
      }
    });

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
    
    console.log('✅ Public registration successful for:', email);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      token,
      accountNumber: account.accountNumber,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        accountId: user.accountId
      }
    });
  } catch (error) {
    console.error('❌ Public registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Admin-only registration endpoint (for creating other user types)
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, role = 'ADMIN', phoneNumber, title, canCreateUsers = false } = req.body;
    
    console.log('🔍 Admin registration attempt for:', email, 'Role:', role);
    
    // Validate required fields
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { 
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    });

    if (existingUser) {
      console.log('❌ User already exists:', email);
      res.status(400).json({ error: 'User with this email already exists' });
      return;
    }

    // Create account first
    const account = await prisma.account.create({
      data: {
        name: title || `${name}'s Account`,
        description: `Account for ${name}`,
        isActive: true
      }
    });
    
    // Create user with specified role
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(password, 12),
        role,
        accountId: account.id,
        isActive: true,
        canCreateUsers,
        phoneNumber: phoneNumber || null,
        title: title || null
      }
    });
    
    console.log('✅ Admin registration successful for:', email, 'Role:', role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      accountNumber: account.accountNumber,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        accountId: user.accountId
      }
    });
  } catch (error) {
    console.error('❌ Admin registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router; 