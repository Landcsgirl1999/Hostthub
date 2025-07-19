const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupDuplicateUsers() {
  try {
    console.log('🧹 Cleaning up duplicate users...');
    
    // Find all users with similar emails
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: 'sierra.reynolds',
          mode: 'insensitive'
        }
      }
    });

    console.log('Found users with sierra.reynolds:', users.map(u => ({ id: u.id, email: u.email, name: u.name })));

    if (users.length > 1) {
      // Keep the one with the correct email case (Sierra.reynolds@Hostit.com)
      const correctUser = users.find(u => u.email === 'Sierra.reynolds@Hostit.com');
      const duplicateUser = users.find(u => u.email === 'sierra.reynolds@hostit.com');

      if (correctUser && duplicateUser) {
        console.log('🗑️ Deleting duplicate user:', duplicateUser.email);
        await prisma.user.delete({
          where: { id: duplicateUser.id }
        });
        console.log('✅ Duplicate user deleted');
      }
    }

    // Verify the remaining user
    const remainingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: 'Sierra.reynolds@Hostit.com',
          mode: 'insensitive'
        }
      }
    });

    if (remainingUser) {
      console.log('✅ Correct user found:', {
        id: remainingUser.id,
        email: remainingUser.email,
        name: remainingUser.name,
        role: remainingUser.role
      });
    } else {
      console.log('❌ No user found with Sierra.reynolds@Hostit.com');
    }

  } catch (error) {
    console.error('❌ Error cleaning up users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDuplicateUsers(); 