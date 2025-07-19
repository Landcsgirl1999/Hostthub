#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@hostit.com' }
    });

    if (existingUser) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create account first
    const account = await prisma.account.create({
      data: {
        name: 'HostIt Admin Account',
        isActive: true,
        isOnHold: false
      }
    });

    console.log('✅ Account created:', account.id);

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: 'admin@hostit.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
        accountId: account.id
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('   Email: admin@hostit.com');
    console.log('   Password: admin123');
    console.log('   User ID:', user.id);
    console.log('   Account ID:', account.id);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 