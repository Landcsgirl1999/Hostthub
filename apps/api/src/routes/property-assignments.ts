import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all property assignments for the current user
router.get('/my-assignments', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const assignments = await prisma.propertyAssignment.findMany({
      where: {
        userId,
        isActive: true
      },
      include: {
        property: {
          select: {
            id: true,
            name: true,
            address: true,
            city: true,
            state: true,
            isActive: true
          }
        }
      }
    });

    res.json({ assignments });
  } catch (error) {
    console.error('❌ Property assignments fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get users for properties assigned to the current user
router.get('/assigned-properties/users', authenticateToken, async (req, res) => {
  try {
    const userId = req.user!.userId;

    // Get the current user's role
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If SUPER_ADMIN, return all users
    if (currentUser.role === 'SUPER_ADMIN') {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastLogin: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return res.json({ users });
    }

    // For other roles, get users from assigned properties
    const assignments = await prisma.propertyAssignment.findMany({
      where: {
        userId,
        isActive: true
      },
      include: {
        property: {
          include: {
            owner: {
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isActive: true,
                createdAt: true,
                lastLogin: true
              }
            },
            reservations: {
              include: {
                assignedUser: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    lastLogin: true
                  }
                }
              }
            },
            tasks: {
              include: {
                assignedUser: {
                  select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isActive: true,
                    createdAt: true,
                    lastLogin: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Collect unique users from assigned properties
    const userMap = new Map();

    assignments.forEach((assignment: any) => {
      // Add property owner
      if (assignment.property.owner) {
        userMap.set(assignment.property.owner.id, assignment.property.owner);
      }

      // Add users from reservations
      assignment.property.reservations.forEach((reservation: any) => {
        if (reservation.assignedUser) {
          userMap.set(reservation.assignedUser.id, reservation.assignedUser);
        }
      });

      // Add users from tasks
      assignment.property.tasks.forEach((task: any) => {
        if (task.assignedUser) {
          userMap.set(task.assignedUser.id, task.assignedUser);
        }
      });
    });

    const users = Array.from(userMap.values());

    res.json({ users });
  } catch (error) {
    console.error('❌ Assigned properties users fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Assign a user to a property (Enhanced for all user categories)
router.post('/assign', authenticateToken, async (req, res) => {
  try {
    const { userId, propertyId, role } = req.body;
    const currentUserId = req.user!.userId;
    const currentUserRole = req.user!.role;

    // Validate required fields
    if (!userId || !propertyId || !role) {
      return res.status(400).json({ error: 'User ID, Property ID, and role are required' });
    }

    // Validate assignment role
    const validAssignmentRoles = ['SUPER_ADMIN', 'OWNER', 'MANAGER', 'EMPLOYEE', 'CONTRACTOR'];
    if (!validAssignmentRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid assignment role' });
    }

    // Get current user and target user
    const [currentUser, targetUser, property] = await Promise.all([
      prisma.user.findUnique({ where: { id: currentUserId }, select: { role: true } }),
      prisma.user.findUnique({ where: { id: userId }, select: { role: true, isActive: true } }),
      prisma.property.findUnique({ where: { id: propertyId }, select: { id: true, ownerId: true } })
    ]);

    if (!currentUser || !targetUser || !property) {
      return res.status(404).json({ error: 'User or property not found' });
    }

    if (!targetUser.isActive) {
      return res.status(400).json({ error: 'Cannot assign inactive user to property' });
    }

    // Role-based access control for property assignments
    const canAssign = await checkAssignmentPermissions(currentUser.role, targetUser.role, property.ownerId, currentUserId);
    if (!canAssign) {
      return res.status(403).json({ 
        error: 'Insufficient permissions to assign this user to the property',
        currentRole: currentUser.role,
        targetRole: targetUser.role
      });
    }

    // Check if assignment already exists
    const existingAssignment = await prisma.propertyAssignment.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId
        }
      }
    });

    if (existingAssignment) {
      return res.status(400).json({ error: 'User is already assigned to this property' });
    }

    // Create assignment
    const assignment = await prisma.propertyAssignment.create({
      data: {
        userId,
        propertyId,
        role
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        },
        property: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    });

    console.log('✅ Property assignment created:', assignment.id);

    res.status(201).json({
      message: 'Property assignment created successfully',
      assignment
    });
  } catch (error) {
    console.error('❌ Property assignment creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove a property assignment (Enhanced for all user categories)
router.delete('/assign/:assignmentId', authenticateToken, async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const currentUserId = req.user!.userId;
    const currentUserRole = req.user!.role;

    const assignment = await prisma.propertyAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        user: { select: { role: true } },
        property: { select: { ownerId: true } }
      }
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Property assignment not found' });
    }

    // Check permissions to remove assignment
    const canRemove = await checkAssignmentPermissions(
      currentUserRole, 
      assignment.user.role, 
      assignment.property.ownerId, 
      currentUserId
    );

    if (!canRemove) {
      return res.status(403).json({ 
        error: 'Insufficient permissions to remove this property assignment',
        currentRole: currentUserRole,
        targetRole: assignment.user.role
      });
    }

    await prisma.propertyAssignment.delete({
      where: { id: assignmentId }
    });

    console.log('✅ Property assignment removed:', assignmentId);

    res.json({ message: 'Property assignment removed successfully' });
  } catch (error) {
    console.error('❌ Property assignment removal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all property assignments (Enhanced for role-based access)
router.get('/all', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user!.userId;
    const currentUserRole = req.user!.role;

    let assignments;

    if (currentUserRole === 'SUPER_ADMIN') {
      // SUPER_ADMIN can see all assignments
      assignments = await prisma.propertyAssignment.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true
            }
          },
          property: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              state: true
            }
          }
        },
        orderBy: { assignedAt: 'desc' }
      });
    } else {
      // Other roles can only see assignments for properties they manage
      const userAssignments = await prisma.propertyAssignment.findMany({
        where: { userId: currentUserId, isActive: true },
        select: { propertyId: true }
      });

      const managedPropertyIds = userAssignments.map(a => a.propertyId);

      assignments = await prisma.propertyAssignment.findMany({
        where: {
          propertyId: { in: managedPropertyIds }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true
            }
          },
          property: {
            select: {
              id: true,
              name: true,
              address: true,
              city: true,
              state: true
            }
          }
        },
        orderBy: { assignedAt: 'desc' }
      });
    }

    res.json({ assignments });
  } catch (error) {
    console.error('❌ All property assignments fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to check assignment permissions
async function checkAssignmentPermissions(
  currentUserRole: string, 
  targetUserRole: string, 
  propertyOwnerId: string, 
  currentUserId: string
): Promise<boolean> {
  // SUPER_ADMIN can assign anyone to any property
  if (currentUserRole === 'SUPER_ADMIN') {
    return true;
  }

  // OWNER can assign users to their own properties
  if (currentUserRole === 'OWNER') {
    // Check if the current user owns the property
    const property = await prisma.property.findUnique({
      where: { id: propertyOwnerId },
      select: { ownerId: true }
    });
    
    if (property && property.ownerId === currentUserId) {
      // OWNER can assign MANAGER, EMPLOYEE, CONTRACTOR to their properties
      return ['MANAGER', 'EMPLOYEE', 'CONTRACTOR'].includes(targetUserRole);
    }
  }

  // MANAGER can assign EMPLOYEE and CONTRACTOR to properties they manage
  if (currentUserRole === 'MANAGER') {
    // Check if the current user is assigned to the property as a MANAGER
    const assignment = await prisma.propertyAssignment.findUnique({
      where: {
        userId_propertyId: {
          userId: currentUserId,
          propertyId: propertyOwnerId
        }
      },
      select: { role: true }
    });

    if (assignment && assignment.role === 'MANAGER') {
      return ['EMPLOYEE', 'CONTRACTOR'].includes(targetUserRole);
    }
  }

  // EMPLOYEE and CONTRACTOR cannot assign users
  return false;
}

export default router; 