import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { sanitizeSensitiveData, maskSensitiveData } from '../config/security';

// Rate limiting for different endpoints
export const createRateLimit = (windowMs: number, max: number) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Specific rate limits
export const authRateLimit = createRateLimit(15 * 60 * 1000, 5); // 5 attempts per 15 minutes
export const apiRateLimit = createRateLimit(15 * 60 * 1000, 100); // 100 requests per 15 minutes
export const subscriptionRateLimit = createRateLimit(15 * 60 * 1000, 10); // 10 requests per 15 minutes

// Input validation middleware
export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User registration validation
export const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  validateInput
];

// User login validation
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validateInput
];

// Property validation
export const validateProperty = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Property name must be between 1 and 100 characters'),
  body('address')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Address must be between 5 and 200 characters'),
  body('city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('zipCode')
    .trim()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Please provide a valid ZIP code'),
  body('maxGuests')
    .isInt({ min: 1, max: 50 })
    .withMessage('Maximum guests must be between 1 and 50'),
  body('bedrooms')
    .isInt({ min: 0, max: 20 })
    .withMessage('Bedrooms must be between 0 and 20'),
  body('bathrooms')
    .isFloat({ min: 0.5, max: 20 })
    .withMessage('Bathrooms must be between 0.5 and 20'),
  validateInput
];

// Reservation validation
export const validateReservation = [
  body('guestName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Guest name must be between 2 and 100 characters'),
  body('guestEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid guest email address'),
  body('checkIn')
    .isISO8601()
    .withMessage('Check-in date must be a valid date'),
  body('checkOut')
    .isISO8601()
    .withMessage('Check-out date must be a valid date'),
  body('guests')
    .isInt({ min: 1, max: 50 })
    .withMessage('Number of guests must be between 1 and 50'),
  body('totalAmount')
    .isFloat({ min: 0 })
    .withMessage('Total amount must be a positive number'),
  validateInput
];

// Subscription validation
export const validateSubscription = [
  body('planId')
    .isUUID()
    .withMessage('Please provide a valid plan ID'),
  body('trialDays')
    .optional()
    .isInt({ min: 0, max: 30 })
    .withMessage('Trial days must be between 0 and 30'),
  validateInput
];

// Enhanced security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.stripe.com https://api.paypal.com; frame-src 'self' https://js.stripe.com https://www.paypal.com;"
  );

  // HTTP Strict Transport Security
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // X-Content-Type-Options
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // X-Frame-Options
  res.setHeader('X-Frame-Options', 'DENY');

  // X-XSS-Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  );

  // Remove server information
  res.removeHeader('X-Powered-By');

  next();
};

// Sensitive data logging middleware
export const secureLogging = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body for logging
  const sanitizedBody = sanitizeSensitiveData(req.body);
  
  // Log request with sensitive data removed
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: sanitizedBody,
    query: req.query,
    params: req.params
  });

  next();
};

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeSensitiveData(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeSensitiveData(req.query);
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitizeSensitiveData(req.params);
  }

  next();
};

// Sensitive data response middleware
export const secureResponse = (req: Request, res: Response, next: NextFunction) => {
  // Store original send function
  const originalSend = res.send;

  // Override send function to mask sensitive data
  res.send = function(data: any) {
    if (typeof data === 'string') {
      try {
        const parsed = JSON.parse(data);
        const masked = maskSensitiveData(parsed);
        return originalSend.call(this, JSON.stringify(masked));
      } catch {
        // If not JSON, send as is
        return originalSend.call(this, data);
      }
    } else if (typeof data === 'object') {
      const masked = maskSensitiveData(data);
      return originalSend.call(this, masked);
    }

    return originalSend.call(this, data);
  };

  next();
};

// Request size limiting middleware
export const requestSizeLimit = (req: Request, res: Response, next: NextFunction) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const contentLength = parseInt(req.get('Content-Length') || '0');

  if (contentLength > maxSize) {
    return res.status(413).json({ error: 'Request entity too large' });
  }

  next();
};

// Rate limiting for sensitive endpoints
export const sensitiveEndpointRateLimit = (req: Request, res: Response, next: NextFunction) => {
  const sensitiveEndpoints = [
    '/api/v1/auth/login',
    '/api/v1/auth/register',
    '/api/v1/settings/billing',
    '/api/v1/users'
  ];

  if (sensitiveEndpoints.includes(req.path)) {
    // Implement stricter rate limiting for sensitive endpoints
    // This would integrate with your existing rate limiting system
    console.log(`Sensitive endpoint accessed: ${req.path} from ${req.ip}`);
  }

  next();
};

// Audit logging for sensitive operations
export const auditLog = (operation: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId || 'anonymous';
    const timestamp = new Date().toISOString();
    const ip = req.ip;
    const userAgent = req.get('User-Agent');

    console.log(`AUDIT: ${timestamp} - User ${userId} performed ${operation} from ${ip}`, {
      operation,
      userId,
      ip,
      userAgent,
      path: req.path,
      method: req.method,
      timestamp
    });

    next();
  };
};

// Data validation middleware
export const validateSensitiveData = (req: Request, res: Response, next: NextFunction) => {
  const sensitiveFields = ['password', 'token', 'secret', 'key', 'bankAccountInfo', 'cardNumber', 'cvv', 'ssn'];

  // Check for sensitive data in request body
  if (req.body) {
    for (const field of sensitiveFields) {
      if (req.body[field]) {
        // Log attempt to access sensitive field (without the actual data)
        console.log(`Sensitive field access attempt: ${field} by user ${req.user?.userId || 'anonymous'}`);
      }
    }
  }

  next();
};

// Session security middleware
export const sessionSecurity = (req: Request, res: Response, next: NextFunction) => {
  // Check for secure session
  if (req.user) {
    // Validate session token
    const tokenAge = Date.now() - ((req.user as any).iat || 0) * 1000;
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (tokenAge > maxAge) {
      return res.status(401).json({ error: 'Session expired' });
    }
  }

  next();
};

// CORS security middleware
export const corsSecurity = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://hostit.com',
    'https://www.hostit.com'
  ];

  const origin = req.get('Origin');
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};

// CORS configuration
export const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count']
};

// Request logging for security monitoring
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.id || 'anonymous'
    };

    // Log suspicious activities
    if (res.statusCode >= 400) {
      console.warn('Security Warning:', logData);
    }

    // Log all requests for monitoring
    console.log('API Request:', logData);
  });

  next();
}; 

// Export all middleware
export const securityMiddleware = {
  securityHeaders,
  secureLogging,
  sanitizeInput,
  secureResponse,
  requestSizeLimit,
  sensitiveEndpointRateLimit,
  auditLog,
  validateSensitiveData,
  sessionSecurity,
  corsSecurity
}; 