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
    
    // Check if user is super admin
    if (userData.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Access denied. Super admin required.' }, { status: 403 });
    }

    // Mock comprehensive dashboard stats
    const dashboardStats = {
      totalProperties: 156,
      totalUsers: 89,
      activeReservations: 342,
      monthlyRevenue: 125000,
      pendingTasks: 23,
      totalCompanies: 12,
      occupancyRate: 87.5,
      averageRating: 4.6,
      revenueByCompany: [
        { company: 'Reynolds Properties', revenue: 45000, properties: 23 },
        { company: 'Hastings Holdings', revenue: 32000, properties: 18 },
        { company: 'Urban Rentals LLC', revenue: 28000, properties: 15 },
        { company: 'Davis Properties', revenue: 20000, properties: 12 }
      ],
      topPerformingProperties: [
        { name: 'Sunset Villa', revenue: 4500, occupancy: 95, rating: 4.8 },
        { name: 'Lakeside Cottage', revenue: 5200, occupancy: 92, rating: 4.9 },
        { name: 'Mountain Lodge', revenue: 3800, occupancy: 88, rating: 4.6 },
        { name: 'Downtown Loft', revenue: 3200, occupancy: 75, rating: 4.4 }
      ],
      recentActivity: [
        { type: 'reservation', message: 'New reservation for Sunset Villa - $1,350', time: '2 minutes ago', company: 'Reynolds Properties', amount: 1350 },
        { type: 'payment', message: 'Payment received for Mountain Lodge - $1,140', time: '15 minutes ago', company: 'Hastings Holdings', amount: 1140 },
        { type: 'maintenance', message: 'Maintenance completed at Downtown Loft', time: '1 hour ago', company: 'Urban Rentals LLC', amount: 0 },
        { type: 'review', message: 'New 5-star review for Lakeside Cottage', time: '2 hours ago', company: 'Davis Properties', amount: 0 }
      ],
      monthlyTrends: {
        revenue: [115000, 118000, 122000, 125000],
        reservations: [310, 325, 335, 342],
        properties: [148, 152, 154, 156]
      }
    };

    return NextResponse.json({
      success: true,
      data: dashboardStats,
      message: 'Dashboard stats retrieved successfully'
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 