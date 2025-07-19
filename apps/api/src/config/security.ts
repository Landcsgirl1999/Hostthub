import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

export const securityConfig = {
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },

  // Password Configuration
  password: {
    saltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS || '12'),
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8'),
    requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
    requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
    requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS !== 'false',
    requireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL_CHARS !== 'false'
  },

  // Rate Limiting Configuration
  rateLimit: {
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_AUTH_MAX || '5')
    },
    api: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_API_MAX || '100')
    },
    subscription: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_SUBSCRIPTION_MAX || '10')
    }
  },

  // CORS Configuration
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count']
  },

  // Security Headers Configuration
  headers: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'self'", "https://www.youtube.com"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
  },

  // Database Configuration
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
  },

  // Environment Configuration
  environment: {
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test'
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableSecurityLogs: process.env.ENABLE_SECURITY_LOGS !== 'false'
  }
};

// Validation functions
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const config = securityConfig.password;

  if (password.length < config.minLength) {
    errors.push(`Password must be at least ${config.minLength} characters long`);
  }

  if (config.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (config.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (config.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (config.requireSpecialChars && !/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Security utility functions
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const generateSecureToken = (): string => {
  return require('crypto').randomBytes(32).toString('hex');
};

// Enhanced encryption utilities for sensitive data
export const encryptionConfig = {
  algorithm: 'aes-256-gcm',
  keyLength: 32,
  ivLength: 16,
  tagLength: 16,
  saltLength: 64,
  iterations: 100000,
};

// Generate a secure encryption key from environment variable
export const getEncryptionKey = (): Buffer => {
  const key = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || 'default-encryption-key';
  return Buffer.from(key.padEnd(32, '0').slice(0, 32));
};

// Enhanced encryption function with authenticated encryption
export const encryptSensitiveData = (text: string, context?: string): string => {
  if (!text) return '';
  
  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(encryptionConfig.ivLength);
    const salt = crypto.randomBytes(encryptionConfig.saltLength);
    
    // Derive key using PBKDF2
    const derivedKey = crypto.pbkdf2Sync(key, salt, encryptionConfig.iterations, encryptionConfig.keyLength, 'sha256');
    
    // Create cipher with authenticated encryption
    const cipher = crypto.createCipheriv(encryptionConfig.algorithm, derivedKey, iv) as any;
    
    // Add context as additional authenticated data if provided
    if (context) {
      cipher.setAAD(Buffer.from(context));
    }
    
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    
    // Get authentication tag
    const tag = cipher.getAuthTag();
    
    // Combine all components: salt:iv:tag:encrypted
    return `${salt.toString('hex')}:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt sensitive data');
  }
};

// Enhanced decryption function with authentication
export const decryptSensitiveData = (encryptedText: string, context?: string): string => {
  if (!encryptedText) return '';
  
  try {
    const key = getEncryptionKey();
    const parts = encryptedText.split(':');
    
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted data format');
    }
    
    const [saltHex, ivHex, tagHex, encryptedHex] = parts;
    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    
    // Derive key using PBKDF2
    const derivedKey = crypto.pbkdf2Sync(key, salt, encryptionConfig.iterations, encryptionConfig.keyLength, 'sha256');
    
    // Create decipher with authenticated decryption
    const decipher = crypto.createDecipheriv(encryptionConfig.algorithm, derivedKey, iv) as any;
    decipher.setAuthTag(tag);
    
    // Add context as additional authenticated data if provided
    if (context) {
      decipher.setAAD(Buffer.from(context));
    }
    
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt sensitive data');
  }
};

// Secure data masking for display
export const maskSensitiveData = (data: any, fields: string[] = ['password', 'token', 'secret', 'key', 'account', 'routing']): any => {
  if (typeof data === 'object' && data !== null) {
    const masked = { ...data };
    
    for (const field of fields) {
      if (masked[field] && typeof masked[field] === 'string') {
        const value = masked[field];
        if (value.length > 4) {
          masked[field] = '****' + value.slice(-4);
        } else {
          masked[field] = '****';
        }
      }
    }
    
    return masked;
  }
  return data;
};

// Secure data validation
export const validateSensitiveData = (data: any, requiredFields: string[] = []): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check required fields
  for (const field of requiredFields) {
    if (!data[field] || data[field].trim() === '') {
      errors.push(`${field} is required`);
    }
  }
  
  // Validate bank account information
  if (data.bankAccountInfo) {
    const bankInfo = typeof data.bankAccountInfo === 'string' ? JSON.parse(data.bankAccountInfo) : data.bankAccountInfo;
    
    if (bankInfo.accountNumber && !/^\d{8,17}$/.test(bankInfo.accountNumber.replace(/\s/g, ''))) {
      errors.push('Invalid account number format');
    }
    
    if (bankInfo.routingNumber && !/^\d{9}$/.test(bankInfo.routingNumber.replace(/\s/g, ''))) {
      errors.push('Invalid routing number format');
    }
  }
  
  // Validate credit card information
  if (data.cardNumber && !/^\d{13,19}$/.test(data.cardNumber.replace(/\s/g, ''))) {
    errors.push('Invalid card number format');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Secure data sanitization
export const sanitizeSensitiveData = (data: any): any => {
  if (typeof data === 'object' && data !== null) {
    const sanitized = { ...data };
    
    // Remove sensitive fields from logs
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'cardNumber', 'cvv', 'ssn'];
    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        delete sanitized[field];
      }
    }
    
    return sanitized;
  }
  return data;
}; 