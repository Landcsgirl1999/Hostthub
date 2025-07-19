const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixUserRoles() {
  try {
    console.log('🔍 Checking for users with OWNER role using raw SQL...');
    
    // Use raw SQL to find users with OWNER role
    const usersWithOwnerRole = await prisma.$queryRaw`
      SELECT id, email, role::text as role
      FROM "User" 
      WHERE role::text = 'OWNER'
    `;

    console.log(`Found ${usersWithOwnerRole.length} users with OWNER role:`);
    usersWithOwnerRole.forEach(user => {
      console.log(`- ${user.email} (ID: ${user.id})`);
    });

    if (usersWithOwnerRole.length > 0) {
      console.log('🔄 Updating users from OWNER to HOMEOWNER role...');
      
      const updateResult = await prisma.$executeRaw`
        UPDATE "User" 
        SET role = 'HOMEOWNER'::text::"UserRole"
        WHERE role::text = 'OWNER'
      `;

      console.log(`✅ Updated ${updateResult} users successfully`);
    } else {
      console.log('✅ No users with OWNER role found');
    }

    console.log('🎉 User role fix completed!');
  } catch (error) {
    console.error('❌ Error fixing user roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserRoles(); 