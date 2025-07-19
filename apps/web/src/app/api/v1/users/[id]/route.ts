import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    // Check if user has permission to view users
    if (!['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(userData.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;

    // Get user from backend
    const userResponse = await fetch(`${process.env.API_URL || 'http://localhost:4000'}/api/v1/users/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = await userResponse.json();

    return NextResponse.json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    // Check if user has permission to update users
    if (!['SUPER_ADMIN', 'ADMIN'].includes(userData.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    const { id } = await params;

    // Update user via backend
    const updateResponse = await fetch(`${process.env.API_URL || 'http://localhost:4000'}/api/v1/users/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to update user' },
        { status: updateResponse.status }
      );
    }

    const updatedUser = await updateResponse.json();

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    // Check if user has permission to delete users
    if (!['SUPER_ADMIN'].includes(userData.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const { id } = await params;

    // Prevent self-deletion
    if (id === userData.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user via backend
    const deleteResponse = await fetch(`${process.env.API_URL || 'http://localhost:4000'}/api/v1/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to delete user' },
        { status: deleteResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 