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

    // Mock all properties data across all accounts
    const allProperties = [
      {
        id: 'prop-1',
        name: 'Sunset Villa',
        address: '123 Beach Rd, Malibu, CA',
        owner: 'Sierra Reynolds',
        company: 'Reynolds Properties',
        status: 'Active',
        monthlyRevenue: 4500,
        occupancyRate: 95,
        rating: 4.8,
        lastBooking: '2025-07-07',
        nextBooking: '2025-07-12',
        type: 'Villa',
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2800,
        amenities: ['Pool', 'Garden', 'Parking', 'WiFi'],
        createdAt: '2024-01-10T08:00:00Z'
      },
      {
        id: 'prop-2',
        name: 'Mountain Lodge',
        address: '456 Peak St, Aspen, CO',
        owner: 'Jacob Hastings',
        company: 'Hastings Holdings',
        status: 'Active',
        monthlyRevenue: 3800,
        occupancyRate: 88,
        rating: 4.6,
        lastBooking: '2025-07-06',
        nextBooking: '2025-07-15',
        type: 'Cabin',
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 2200,
        amenities: ['Fireplace', 'Hot Tub', 'Ski Storage', 'WiFi'],
        createdAt: '2024-02-15T10:30:00Z'
      },
      {
        id: 'prop-3',
        name: 'Downtown Loft',
        address: '789 Urban Ave, NYC, NY',
        owner: 'Property Manager',
        company: 'Urban Rentals LLC',
        status: 'Maintenance',
        monthlyRevenue: 3200,
        occupancyRate: 75,
        rating: 4.4,
        lastBooking: '2025-07-05',
        nextBooking: '2025-07-20',
        type: 'Apartment',
        bedrooms: 2,
        bathrooms: 1,
        squareFeet: 1200,
        amenities: ['Gym', 'Rooftop', 'Doorman', 'WiFi'],
        createdAt: '2024-03-20T14:15:00Z'
      },
      {
        id: 'prop-4',
        name: 'Lakeside Cottage',
        address: '321 Lake Dr, Tahoe, CA',
        owner: 'Emily Davis',
        company: 'Davis Properties',
        status: 'Active',
        monthlyRevenue: 5200,
        occupancyRate: 92,
        rating: 4.9,
        lastBooking: '2025-07-08',
        nextBooking: '2025-07-10',
        type: 'Cottage',
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 1800,
        amenities: ['Lake View', 'Deck', 'Fireplace', 'WiFi'],
        createdAt: '2024-01-25T09:45:00Z'
      },
      {
        id: 'prop-5',
        name: 'Beach House',
        address: '555 Ocean Blvd, Miami, FL',
        owner: 'Sierra Reynolds',
        company: 'Reynolds Properties',
        status: 'Active',
        monthlyRevenue: 4800,
        occupancyRate: 90,
        rating: 4.7,
        lastBooking: '2025-07-09',
        nextBooking: '2025-07-14',
        type: 'House',
        bedrooms: 4,
        bathrooms: 3,
        squareFeet: 2400,
        amenities: ['Beach Access', 'Pool', 'BBQ', 'WiFi'],
        createdAt: '2024-04-10T11:20:00Z'
      },
      {
        id: 'prop-6',
        name: 'City Apartment',
        address: '777 Downtown St, Chicago, IL',
        owner: 'Jacob Hastings',
        company: 'Hastings Holdings',
        status: 'Active',
        monthlyRevenue: 2800,
        occupancyRate: 82,
        rating: 4.3,
        lastBooking: '2025-07-04',
        nextBooking: '2025-07-16',
        type: 'Apartment',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 800,
        amenities: ['Gym', 'Parking', 'Concierge', 'WiFi'],
        createdAt: '2024-05-05T16:30:00Z'
      },
      {
        id: 'prop-7',
        name: 'Desert Oasis',
        address: '888 Palm Springs Rd, Palm Springs, CA',
        owner: 'Property Manager',
        company: 'Urban Rentals LLC',
        status: 'Inactive',
        monthlyRevenue: 0,
        occupancyRate: 0,
        rating: 4.2,
        lastBooking: '2025-06-15',
        nextBooking: null,
        type: 'Villa',
        bedrooms: 3,
        bathrooms: 2,
        squareFeet: 2000,
        amenities: ['Pool', 'Garden', 'Mountain View', 'WiFi'],
        createdAt: '2024-06-12T13:45:00Z'
      },
      {
        id: 'prop-8',
        name: 'Ski Chalet',
        address: '999 Mountain Pass, Vail, CO',
        owner: 'Emily Davis',
        company: 'Davis Properties',
        status: 'Active',
        monthlyRevenue: 6500,
        occupancyRate: 98,
        rating: 4.9,
        lastBooking: '2025-07-10',
        nextBooking: '2025-07-13',
        type: 'Chalet',
        bedrooms: 5,
        bathrooms: 4,
        squareFeet: 3200,
        amenities: ['Ski-in/Ski-out', 'Hot Tub', 'Fireplace', 'WiFi'],
        createdAt: '2024-02-28T08:15:00Z'
      }
    ];

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const company = searchParams.get('company') || 'all';

    // Filter properties based on search and filters
    let filteredProperties = allProperties;

    if (search) {
      filteredProperties = filteredProperties.filter(property =>
        property.name.toLowerCase().includes(search.toLowerCase()) ||
        property.address.toLowerCase().includes(search.toLowerCase()) ||
        property.owner.toLowerCase().includes(search.toLowerCase()) ||
        property.company.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (status !== 'all') {
      filteredProperties = filteredProperties.filter(property =>
        property.status.toLowerCase() === status.toLowerCase()
      );
    }

    if (company !== 'all') {
      filteredProperties = filteredProperties.filter(property =>
        property.company.toLowerCase() === company.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        properties: filteredProperties,
        total: filteredProperties.length,
        summary: {
          totalProperties: allProperties.length,
          activeProperties: allProperties.filter(p => p.status === 'Active').length,
          totalRevenue: allProperties.reduce((sum, p) => sum + p.monthlyRevenue, 0),
          averageOccupancy: allProperties.reduce((sum, p) => sum + p.occupancyRate, 0) / allProperties.length,
          averageRating: allProperties.reduce((sum, p) => sum + p.rating, 0) / allProperties.length
        }
      },
      message: 'Properties retrieved successfully'
    });

  } catch (error) {
    console.error('Properties error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
} 