const { PrismaClient } = require('@hostit/db');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdmin() {
  try {
    console.log('🔍 Resetting super admin account...');
    
    // Find the super admin user
    const admin = await prisma.user.findFirst({
      where: {
        email: {
          equals: 'Sierra.reynolds@Hostit.com',
          mode: 'insensitive'
        }
      }
    });

    if (!admin) {
      console.log('❌ Super admin not found, creating new one...');
      
      // Create new super admin
      const hashedPassword = await bcrypt.hash('Tigerpie5678!', 12);
      const newAdmin = await prisma.user.create({
        data: {
          email: 'Sierra.reynolds@Hostit.com',
          name: 'Sierra Reynolds',
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          isActive: true,
          canCreateUsers: true
        }
      });
      
      console.log('✅ New super admin created:', newAdmin.email);
    } else {
      console.log('✅ Found existing admin:', admin.email);
      console.log('Current status:', { isActive: admin.isActive, role: admin.role });
      
      // Update password and ensure active
      const hashedPassword = await bcrypt.hash('Tigerpie5678!', 12);
      const updatedAdmin = await prisma.user.update({
        where: { id: admin.id },
        data: {
          password: hashedPassword,
          isActive: true,
          role: 'SUPER_ADMIN',
          canCreateUsers: true
        }
      });
      
      console.log('✅ Super admin updated and activated');
    }
    
    // Test login
    console.log('🔍 Testing login...');
    const testResponse = await fetch('http://localhost:4000/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'Sierra.reynolds@Hostit.com',
        password: 'Tigerpie5678!'
      })
    });
    
    if (testResponse.ok) {
      const data = await testResponse.json();
      console.log('✅ Login test successful!');
      console.log('User:', data.user);
    } else {
      const error = await testResponse.json();
      console.log('❌ Login test failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin(); 