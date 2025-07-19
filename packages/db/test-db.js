const { PrismaClient } = require('@prisma/client');

async function testDatabase() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔗 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check users table
    const users = await prisma.user.findMany();
    console.log(`📊 Found ${users.length} users in database`);
    
    if (users.length > 0) {
      console.log('👥 Users:');
      users.forEach(user => {
        console.log(`  - ${user.email} (${user.role})`);
      });
    } else {
      console.log('⚠️  No users found in database');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase(); 