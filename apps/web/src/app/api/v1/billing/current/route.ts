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
    const verifyResponse = await fetch(`${process.env.API_URL || 'http://localhost:4000'}/api/v1/auth/verify`, {
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
    
    // First get the user's account ID
    const userResponse = await fetch(`${process.env.API_URL || 'http://localhost:4000'}/api/v1/users/${userData.user.userId}`, {
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
    
    // Get user's billing information from backend
    const billingResponse = await fetch(`${process.env.API_URL || 'http://localhost:4000'}/api/v1/billing/account/${accountId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!billingResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch billing information' },
        { status: billingResponse.status }
      );
    }

    const billingData = await billingResponse.json();

    return NextResponse.json({
      success: true,
      data: billingData,
      message: 'Billing information retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching billing information:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 