import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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
    
    // Check if user has permission to update user status
    if (!['SUPER_ADMIN', 'ADMIN'].includes(userData.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (typeof body.isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing or invalid isActive field' },
        { status: 400 }
      );
    }

    // Prevent self-deactivation
    if (params.id === userData.user.id && !body.isActive) {
      return NextResponse.json(
        { error: 'Cannot deactivate your own account' },
        { status: 400 }
      );
    }

    // Update user status via backend
    const statusResponse = await fetch(`${process.env.API_URL || 'http://localhost:4000'}/api/v1/auth/users/${params.id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive: body.isActive }),
    });

    if (!statusResponse.ok) {
      const errorData = await statusResponse.json();
      return NextResponse.json(
        { error: errorData.message || 'Failed to update user status' },
        { status: statusResponse.status }
      );
    }

    const updatedUser = await statusResponse.json();

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: `User ${body.isActive ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 