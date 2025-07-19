import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Validation schema for registration
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please provide a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain uppercase, lowercase, number, and special character'),
  phoneNumber: z.string().optional(),
  company: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUserResponse = await fetch(`${process.env.API_URL || 'http://localhost:4000'}/api/v1/auth/check-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: validatedData.email }),
    });

    if (existingUserResponse.ok) {
      const existingData = await existingUserResponse.json();
      if (existingData.exists) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
    }

    // Create user through the backend API
    const response = await fetch(`${process.env.API_URL || 'http://localhost:4000'}/api/v1/auth/public-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
        phoneNumber: validatedData.phoneNumber,
        company: validatedData.company,
        role: 'OWNER', // Default role for public registrations
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to create account' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      message: 'Account created successfully! Please check your email to verify your account.',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 