import { NextRequest, NextResponse } from 'next/server';

// Mock user data for demonstration
const mockUsers = [
  {
    id: 'cmcsfnwpp0002h1b1lipukfqv',
    email: 'Sierra.reynolds@Hostit.com',
    name: 'Sierra Reynolds',
    role: 'SUPER_ADMIN',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2025-07-08T01:42:58Z',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Main St, Burlington, VT',
    birthday: '1990-05-15',
    title: 'Super Administrator',
    photoUrl: '/api/placeholder/150/150',
    preferredContactMethod: 'email',
    emergencyNumber: '+1 (555) 999-8888',
    canCreateUsers: true,
    accessPermissions: ['all'],
    ownedProperties: [],
    propertyAssignments: [],
    permissions: {
      canManageUsers: true,
      canManageProperties: true,
      canViewAnalytics: true,
      canManageBilling: true
    },
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    welcomeEmailSent: true
  },
  {
    id: 'admin-1',
    email: 'admin@example.com',
    name: 'System Admin',
    role: 'ADMIN',
    isActive: true,
    createdAt: '2024-01-15T10:30:00Z',
    lastLogin: '2025-07-08T01:42:58Z',
    phoneNumber: '+1 (555) 123-4567',
    address: '123 Admin St, Burlington, VT',
    birthday: '1980-01-15',
    title: 'System Administrator',
    photoUrl: '/api/placeholder/150/150',
    preferredContactMethod: 'email',
    emergencyNumber: '+1 (555) 999-8888',
    canCreateUsers: true,
    accessPermissions: ['OWNER_MANAGER_PERMISSIONS', 'CONTACT_DATA_ACCESS', 'FINANCIAL_DATA_ACCESS'],
    ownedProperties: [],
    propertyAssignments: [],
    permissions: {
      canManageUsers: true,
      canManageProperties: true,
      canViewAnalytics: true,
      canManageBilling: true
    },
    notifications: {
      email: true,
      sms: true,
      push: true
    },
    welcomeEmailSent: true
  },
  {
    id: 'homeowner-1',
    email: 'john.homeowner@example.com',
    name: 'John Homeowner',
    role: 'HOMEOWNER',
    isActive: true,
    createdAt: '2025-07-08T02:17:40Z',
    lastLogin: '2025-07-08T02:18:10Z',
    phoneNumber: '555-1234',
    address: '456 Oak Ave, Test City, TC',
    birthday: '1985-08-20',
    title: 'Property Owner',
    photoUrl: '/api/placeholder/150/150',
    preferredContactMethod: 'phone',
    emergencyNumber: '+1 (555) 111-2222',
    canCreateUsers: false,
    accessPermissions: ['view_properties', 'manage_own_properties'],
    ownedProperties: [
      { id: 'prop-1', name: 'Sunset Villa', address: '123 Beach Rd' },
      { id: 'prop-2', name: 'Mountain Lodge', address: '456 Peak St' }
    ],
    propertyAssignments: [],
    permissions: {
      canManageUsers: false,
      canManageProperties: true,
      canViewAnalytics: true,
      canManageBilling: false
    },
    notifications: {
      email: true,
      sms: true,
      push: false
    },
    welcomeEmailSent: true
  },
  {
    id: 'cmcmanager001',
    email: 'manager@hostit.com',
    name: 'Property Manager',
    role: 'MANAGER',
    isActive: true,
    createdAt: '2024-06-01T09:00:00Z',
    lastLogin: '2025-07-07T15:30:00Z',
    phoneNumber: '+1 (555) 234-5678',
    address: '789 Manager Blvd, Management City, MC',
    birthday: '1988-12-10',
    title: 'Senior Property Manager',
    photoUrl: '/api/placeholder/150/150',
    preferredContactMethod: 'email',
    emergencyNumber: '+1 (555) 333-4444',
    canCreateUsers: true,
    accessPermissions: ['manage_properties', 'view_analytics', 'manage_tenants'],
    ownedProperties: [],
    propertyAssignments: [
      { id: 'prop-1', name: 'Sunset Villa', role: 'manager' },
      { id: 'prop-3', name: 'Downtown Loft', role: 'manager' }
    ],
    permissions: {
      canManageUsers: true,
      canManageProperties: true,
      canViewAnalytics: true,
      canManageBilling: false
    },
    notifications: {
      email: true,
      sms: true,
      push: true
    },
    welcomeEmailSent: true
  },
  {
    id: 'cmcemployee001',
    email: 'employee@hostit.com',
    name: 'Maintenance Employee',
    role: 'EMPLOYEE',
    isActive: true,
    createdAt: '2024-07-01T08:00:00Z',
    lastLogin: '2025-07-08T00:15:00Z',
    phoneNumber: '+1 (555) 345-6789',
    address: '321 Worker St, Employee Town, ET',
    birthday: '1992-03-25',
    title: 'Maintenance Technician',
    photoUrl: '/api/placeholder/150/150',
    preferredContactMethod: 'sms',
    emergencyNumber: '+1 (555) 555-6666',
    canCreateUsers: false,
    accessPermissions: ['view_assigned_properties', 'update_maintenance'],
    ownedProperties: [],
    propertyAssignments: [
      { id: 'prop-1', name: 'Sunset Villa', role: 'maintenance' },
      { id: 'prop-2', name: 'Mountain Lodge', role: 'maintenance' }
    ],
    permissions: {
      canManageUsers: false,
      canManageProperties: false,
      canViewAnalytics: false,
      canManageBilling: false
    },
    notifications: {
      email: false,
      sms: true,
      push: true
    },
    welcomeEmailSent: true
  },
  {
    id: 'cmccontractor001',
    email: 'contractor@hostit.com',
    name: 'External Contractor',
    role: 'CONTRACTOR',
    isActive: true,
    createdAt: '2024-08-15T14:00:00Z',
    lastLogin: '2025-07-06T11:45:00Z',
    phoneNumber: '+1 (555) 456-7890',
    address: '654 Contractor Way, Contract City, CC',
    birthday: '1980-11-05',
    title: 'Plumbing Contractor',
    photoUrl: '/api/placeholder/150/150',
    preferredContactMethod: 'phone',
    emergencyNumber: '+1 (555) 777-8888',
    canCreateUsers: false,
    accessPermissions: ['view_assigned_work', 'update_work_status'],
    ownedProperties: [],
    propertyAssignments: [
      { id: 'prop-1', name: 'Sunset Villa', role: 'contractor' }
    ],
    permissions: {
      canManageUsers: false,
      canManageProperties: false,
      canViewAnalytics: false,
      canManageBilling: false
    },
    notifications: {
      email: false,
      sms: true,
      push: false
    },
    welcomeEmailSent: true
  }
];

// Transform mock users to match frontend expected format
const transformUsers = (users: any[]) => {
  return users.map(user => {
    // Map roles correctly
    let mappedRole: 'user' | 'admin' | 'manager' | 'super-admin';
    switch (user.role) {
      case 'SUPER_ADMIN':
        mappedRole = 'super-admin';
        break;
      case 'ADMIN':
        mappedRole = 'admin';
        break;
      case 'MANAGER':
        mappedRole = 'manager';
        break;
      case 'HOMEOWNER':
      case 'EMPLOYEE':
      case 'CONTRACTOR':
        mappedRole = 'user';
        break;
      default:
        mappedRole = 'user';
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.name.split(' ')[0] || '',
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      role: mappedRole,
      status: user.isActive ? 'active' : 'inactive',
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      phone: user.phoneNumber,
      properties: user.ownedProperties?.length || 0,
      accountData: {
        properties: user.ownedProperties || [],
        tasks: [],
        payments: [],
        recentActivity: []
      }
    };
  });
};

export async function GET(request: NextRequest) {
  try {
    console.log('📊 API: Loading users...');
    
    // For now, return mock data without authentication check
    const transformedUsers = transformUsers(mockUsers);
    
    console.log(`✅ API: Returning ${transformedUsers.length} users`);
    
    return NextResponse.json({
      success: true,
      users: transformedUsers,
      total: transformedUsers.length
    });
    
  } catch (error) {
    console.error('❌ API: Error loading users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load users',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For now, just return success without actually creating
    console.log('📝 API: Creating user:', body);
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully (mock)',
      user: {
        id: 'new-user-' + Date.now(),
        ...body
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ API: Error creating user:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 