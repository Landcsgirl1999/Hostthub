const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAndUpdateAdmin() {
  try {
    // Find the super admin user
    const admin = await prisma.user.findFirst({
      where: {
        email: 'Sierra.reynolds@Hostit.com'
      }
    });

    if (!admin) {
      console.log('❌ Super admin user not found');
      return;
    }

    console.log('✅ Found super admin user:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Is Active:', admin.isActive);

    // Update password to the requested one
    const newPassword = 'Tigerpie5678!';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: admin.id },
      data: { 
        password: hashedPassword,
        isActive: true
      }
    });

    console.log('✅ Updated super admin password to:', newPassword);
    console.log('✅ Set isActive to true');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndUpdateAdmin(); 