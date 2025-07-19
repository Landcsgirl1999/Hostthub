const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testUser() {
  try {
    console.log('🔍 Testing user authentication...');
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: 'Sierra.reynolds@Hostit.com' }
    });

    if (!user) {
      console.log('❌ User not found in database');
      return;
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive
    });

    // Test password
    const testPassword = 'Tigerpie5678!';
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    console.log('🔐 Password test:', isValid ? '✅ Valid' : '❌ Invalid');
    
    if (!isValid) {
      console.log('💡 Trying to hash the password again...');
      const newHash = await bcrypt.hash(testPassword, 12);
      console.log('New hash:', newHash);
      console.log('Current hash:', user.password);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUser(); 