const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    console.log('🔧 Creating super admin user...');
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'sierra.reynolds@hostit.com' }
    });

    if (existingUser) {
      console.log('✅ Super admin user already exists');
      console.log('👤 User details:', {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role,
        isActive: existingUser.isActive
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    // Create super admin user
    const superAdmin = await prisma.user.create({
      data: {
        email: 'sierra.reynolds@hostit.com',
        name: 'Sierra Reynolds',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isActive: true,
        canCreateUsers: true,
        phoneNumber: '+1 (555) 123-4567',
        address: '123 Main St, Burlington, VT',
        title: 'Super Administrator',
        preferredContactMethod: 'EMAIL',
        accessPermissions: [
          'OWNER_MANAGER_PERMISSIONS',
          'CONTACT_DATA_ACCESS',
          'FINANCIAL_DATA_ACCESS',
          'NIGHTLY_CALENDAR_ACCESS',
          'INQUIRIES_BOOKING_ACCESS',
          'CANCELLED_RESERVATIONS_ACCESS',
          'NEW_LISTINGS_ACCESS',
          'GUEST_NOTES_ACCESS',
          'HOST_NOTES_ACCESS'
        ]
      }
    });

    console.log('✅ Super admin user created successfully!');
    console.log('👤 User details:', {
      id: superAdmin.id,
      email: superAdmin.email,
      name: superAdmin.name,
      role: superAdmin.role,
      isActive: superAdmin.isActive
    });
    console.log('🔑 Password: password123');

  } catch (error) {
    console.error('❌ Error creating super admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin(); 