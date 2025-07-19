import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = request.headers.get('authorization');

    if (!token) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    // Forward the request to the backend API
    const response = await fetch(`${process.env.BACKEND_URL || 'http://localhost:4000'}/api/v1/auth/impersonate`, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Impersonation error:', error);
    return NextResponse.json(
      { error: 'Failed to impersonate user' },
      { status: 500 }
    );
  }
} 