import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

// JWT Secret - in production, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'hostit-super-secret-jwt-key-2024';

// Authentication middleware
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }
};

// Role-based access control middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      });
      return;
    }

    next();
  };
};

// Admin-only middleware
export const requireAdmin = requireRole(['SUPER_ADMIN']);

// User creation middleware (SUPER_ADMIN and MANAGER can create users)
export const requireUserCreation = requireRole(['SUPER_ADMIN', 'MANAGER']);

// Super admin only middleware
export const requireSuperAdmin = requireRole(['SUPER_ADMIN']);

// Property manager or higher middleware
export const requireManager = requireRole(['SUPER_ADMIN', 'ADMIN', 'PROPERTY_MANAGER']);

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    } catch (error) {
      // Token is invalid, but we don't fail the request
      console.log('Invalid token in optional auth:', error);
    }
  }

  next();
};

// Rate limiting for authentication endpoints
export const authRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later'
};

// Password validation middleware
export const validatePassword = (req: Request, res: Response, next: NextFunction): void => {
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ error: 'Password is required' });
    return;
  }

  // Password strength requirements
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors: string[] = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  if (errors.length > 0) {
    res.status(400).json({ 
      error: 'Password does not meet security requirements',
      requirements: errors
    });
    return;
  }

  next();
};

// Email validation middleware
export const validateEmail = (req: Request, res: Response, next: NextFunction): void => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'Invalid email format' });
    return;
  }

  next();
};

// Session validation middleware
export const validateSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Valid session required' });
    return;
  }

  try {
    // Here you could add additional session validation logic
    // For example, checking if the user is still active in the database
    // or if their session hasn't been revoked
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Session validation failed' });
    return;
  }
}; 