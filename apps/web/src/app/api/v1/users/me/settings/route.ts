import { NextRequest, NextResponse } from 'next/server';

// GET /api/v1/users/me/settings - Get current user's settings
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    // Proxy the request to the backend API
    const response = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/v1/users/me/settings`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('User settings proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch user settings' }, { status: 500 });
  }
}

// PUT /api/v1/users/me/settings - Update current user's settings
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const body = await request.json();

    // Proxy the request to the backend API
    const response = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/v1/users/me/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('User settings update proxy error:', error);
    return NextResponse.json({ error: 'Failed to update user settings' }, { status: 500 });
  }
} 