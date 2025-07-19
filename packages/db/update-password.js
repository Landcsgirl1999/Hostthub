const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function updatePassword() {
  try {
    console.log('🔧 Updating password for Sierra.reynolds@Hostit.com...');
    
    // Find the correct user
    const user = await prisma.user.findFirst({
      where: {
        email: 'Sierra.reynolds@Hostit.com'
      }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('👤 Found user:', user.email, user.name);

    // Hash the new password
    const hashedPassword = await bcrypt.hash('Tigerpie5678!', 12);
    
    // Update the password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    console.log('✅ Password updated successfully!');
    console.log('🔑 New password: Tigerpie5678!');

  } catch (error) {
    console.error('❌ Error updating password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePassword(); 