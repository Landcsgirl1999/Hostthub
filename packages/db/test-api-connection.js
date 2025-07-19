const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testApiConnection() {
  try {
    console.log('🔍 Testing API database connection...');
    
    // Test the exact same query the API uses
    const user = await prisma.user.findUnique({
      where: { email: 'Sierra.reynolds@Hostit.com' }
    });

    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('✅ User details:', {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive
      });
    } else {
      console.log('❌ No user found with email: Sierra.reynolds@Hostit.com');
      
      // Let's check what users exist
      const allUsers = await prisma.user.findMany({
        select: { email: true, name: true, role: true }
      });
      
      console.log('📋 All users in database:', allUsers);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testApiConnection(); 