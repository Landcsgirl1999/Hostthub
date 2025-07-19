import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { planId, propertyCount } = await request.json();
    
    // Get user token
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Calculate billing cycle dates
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // If we're past the 1st of the month, start billing next month
    let billingStartDate: Date;
    if (now.getDate() > 1) {
      // Start billing on the 1st of next month
      billingStartDate = new Date(currentYear, currentMonth + 1, 1);
    } else {
      // Start billing today (1st of current month)
      billingStartDate = new Date(currentYear, currentMonth, 1);
    }

    // Create subscription through backend API
    const response = await fetch(`${process.env.API_URL || 'http://localhost:4000'}/api/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        planId,
        propertyCount: parseInt(propertyCount),
        autoCharge: true,
        billingCycle: 'monthly',
        billingDay: 1, // Always bill on the 1st
        billingStartDate: billingStartDate.toISOString(),
        nextBillingDate: billingStartDate.toISOString()
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.error }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
} 