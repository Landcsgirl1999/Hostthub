import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('🔍 Web app login attempt:', {
      email: body.email,
      passwordLength: body.password?.length
    });
    
    // Use the working simple-login endpoint
    const apiResponse = await fetch('http://localhost:3001/simple-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await apiResponse.json();
    
    if (!apiResponse.ok) {
      console.error('❌ API login failed:', data);
      return NextResponse.json(data, { status: apiResponse.status });
    }
    
    console.log('✅ Login successful');
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json(
      { error: 'Sign in failed' },
      { status: 500 }
    );
  }
} 