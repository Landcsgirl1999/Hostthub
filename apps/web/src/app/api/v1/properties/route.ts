import { NextRequest, NextResponse } from 'next/server';

// Mock property data for demonstration
const mockProperties = [
  {
    id: 'prop-1',
    name: 'Sunset Villa',
    address: '123 Beach Rd, Malibu, CA',
    type: 'Villa',
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2800,
    status: 'Active',
    ownerId: 'cmctwh1h90002prjx1p5sjdss',
    managerId: 'cmcmanager001',
    monthlyRent: 4500,
    lastMaintenance: '2025-06-15',
    nextMaintenance: '2025-08-15',
    occupancyRate: 95,
    rating: 4.8,
    amenities: ['Pool', 'Garden', 'Parking', 'WiFi'],
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2025-07-01T14:30:00Z'
  },
  {
    id: 'prop-2',
    name: 'Mountain Lodge',
    address: '456 Peak St, Aspen, CO',
    type: 'Cabin',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 2200,
    status: 'Active',
    ownerId: 'cmctwh1h90002prjx1p5sjdss',
    managerId: null,
    monthlyRent: 3200,
    lastMaintenance: '2025-05-20',
    nextMaintenance: '2025-09-20',
    occupancyRate: 88,
    rating: 4.6,
    amenities: ['Fireplace', 'Deck', 'Mountain View', 'Kitchen'],
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2025-06-15T09:15:00Z'
  },
  {
    id: 'prop-3',
    name: 'Downtown Loft',
    address: '789 Urban Ave, New York, NY',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 1200,
    status: 'Active',
    ownerId: 'cmcsfnwpp0002h1b1lipukfqv',
    managerId: 'cmcmanager001',
    monthlyRent: 3800,
    lastMaintenance: '2025-07-01',
    nextMaintenance: '2025-10-01',
    occupancyRate: 92,
    rating: 4.7,
    amenities: ['Gym', 'Doorman', 'Balcony', 'Modern Appliances'],
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    createdAt: '2024-03-20T12:00:00Z',
    updatedAt: '2025-07-05T16:45:00Z'
  },
  {
    id: 'prop-4',
    name: 'Riverside Cottage',
    address: '321 River Rd, Portland, OR',
    type: 'Cottage',
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 1500,
    status: 'Maintenance',
    ownerId: 'cmcsfnwpp0002h1b1lipukfqv',
    managerId: null,
    monthlyRent: 2800,
    lastMaintenance: '2025-07-08',
    nextMaintenance: '2025-08-08',
    occupancyRate: 0,
    rating: 4.5,
    amenities: ['River View', 'Garden', 'Fire Pit', 'Bike Storage'],
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    createdAt: '2024-04-05T14:00:00Z',
    updatedAt: '2025-07-08T08:00:00Z'
  },
  {
    id: 'prop-5',
    name: 'Beachfront Condo',
    address: '654 Ocean Blvd, Miami, FL',
    type: 'Condo',
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1800,
    status: 'Active',
    ownerId: 'cmctwh1h90002prjx1p5sjdss',
    managerId: 'cmcmanager001',
    monthlyRent: 5200,
    lastMaintenance: '2025-06-10',
    nextMaintenance: '2025-09-10',
    occupancyRate: 98,
    rating: 4.9,
    amenities: ['Beach Access', 'Pool', 'Gym', 'Ocean View'],
    images: ['/api/placeholder/400/300', '/api/placeholder/400/300'],
    createdAt: '2024-05-12T09:00:00Z',
    updatedAt: '2025-06-25T11:20:00Z'
  }
];

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
    
    // Check if user has permission to view properties
    if (!['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OWNER', 'EMPLOYEE', 'CONTRACTOR'].includes(userData.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Filter properties based on user role
    let filteredProperties = mockProperties;
    
    if (userData.user.role === 'OWNER') {
      // Owners can only see their own properties
      filteredProperties = mockProperties.filter(prop => prop.ownerId === userData.user.id);
    } else if (userData.user.role === 'EMPLOYEE' || userData.user.role === 'CONTRACTOR') {
      // Employees and contractors can only see assigned properties
      const assignedPropertyIds = ['prop-1', 'prop-2']; // Mock assigned properties
      filteredProperties = mockProperties.filter(prop => assignedPropertyIds.includes(prop.id));
    }
    // SUPER_ADMIN, ADMIN, and MANAGER can see all properties

    return NextResponse.json({
      success: true,
      data: filteredProperties,
      total: filteredProperties.length,
      message: 'Properties retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    
    // Check if user has permission to create properties
    if (!['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'OWNER'].includes(userData.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.address || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, address, type' },
        { status: 400 }
      );
    }

    // Create new property (mock implementation)
    const newProperty = {
      id: `prop-${Date.now()}`,
      ...body,
      status: 'Active',
      ownerId: userData.user.role === 'OWNER' ? userData.user.id : body.ownerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      occupancyRate: 0,
      rating: 0,
      amenities: body.amenities || [],
      images: body.images || []
    };

    return NextResponse.json({
      success: true,
      data: newProperty,
      message: 'Property created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 