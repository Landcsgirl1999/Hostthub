const { PrismaClient } = require('@hostit/db');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function debugDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: 'Sierra.reynolds@Hostit.com' }
    });
    
    if (user) {
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
      
    } else {
      console.log('❌ User not found, creating...');
      
      const hashedPassword = await bcrypt.hash('Tigerpie5678!', 12);
      
      const newUser = await prisma.user.create({
        data: {
          email: 'Sierra.reynolds@Hostit.com',
          name: 'Sierra Reynolds',
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          isActive: true
        }
      });
      
      console.log('✅ User created:', newUser.email);
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugDatabase(); 