import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify token with backend
    const verifyResponse = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/v1/auth/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!verifyResponse.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userData = await verifyResponse.json();
    
    // Get user's account ID
    const userResponse = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/v1/users/${userData.user.userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user information' },
        { status: userResponse.status }
      );
    }

    const userInfo = await userResponse.json();
    const accountId = userInfo.data?.accountId;

    if (!accountId) {
      return NextResponse.json(
        { error: 'User not associated with an account' },
        { status: 400 }
      );
    }
    
    // Get invoices for the account
    const invoicesResponse = await fetch(`${process.env.API_URL || 'http://localhost:3001'}/api/v1/invoices/account/${accountId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!invoicesResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch invoices' },
        { status: invoicesResponse.status }
      );
    }

    const invoicesData = await invoicesResponse.json();

    return NextResponse.json(invoicesData);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
} 