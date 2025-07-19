import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function getNextAccountNumber(userRole: string): Promise<number> {
  // Check if this is the first super admin
  if (userRole === 'SUPER_ADMIN') {
    const existingSuperAdmin = await prisma.account.findFirst({
      where: { accountNumber: 1 }
    });
    if (!existingSuperAdmin) {
      return 1; // First super admin gets account number 1
    }
  }
  
  // For all other users, get the next number from sequence
  const result = await prisma.$queryRaw`SELECT nextval('regular_account_number_seq') as next_number`;
  return (result as any)[0].next_number;
}

async function main() {
  console.log('🌱 Seeding database...');

  // Create default account with account number 1 for super admin
  const defaultAccount = await prisma.account.create({
    data: {
      accountNumber: 1, // Super admin gets account number 1
      name: 'Hostit.com',
      description: 'Default account for Hostit.com platform',
      isActive: true
    }
  });

  console.log('✅ Default account created successfully with account number:', defaultAccount.accountNumber);

  // Create master admin user
  const masterAdmin = {
    email: 'Sierra.reynolds@Hostit.com',
    name: 'Sierra Reynolds',
    role: 'SUPER_ADMIN' as const,
    password: await bcrypt.hash('Tigerpie5678!', 12),
    isActive: true,
    emailVerified: true,
    canCreateUsers: true,
    accountId: defaultAccount.id,
    phoneNumber: '555-555-5555',
    address: '123 Main St, Anytown, USA',
    birthday: new Date('1990-01-01'),
    title: 'Founder & CEO',
    lastLogin: new Date(),
    photoUrl: 'https://hostit.com/images/sierra.jpg',
    preferredContactMethod: 'EMAIL' as const,
    emergencyNumber: '555-555-0000',
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
    ] as any
  };

  const createdMasterAdmin = await prisma.user.upsert({
    where: { email: masterAdmin.email },
    update: {
      name: masterAdmin.name,
      role: masterAdmin.role,
      isActive: masterAdmin.isActive,
      emailVerified: masterAdmin.emailVerified,
      canCreateUsers: masterAdmin.canCreateUsers,
      accountId: masterAdmin.accountId,
      phoneNumber: masterAdmin.phoneNumber,
      address: masterAdmin.address,
      birthday: masterAdmin.birthday,
      title: masterAdmin.title,
      lastLogin: masterAdmin.lastLogin,
      photoUrl: masterAdmin.photoUrl,
      preferredContactMethod: masterAdmin.preferredContactMethod,
      emergencyNumber: masterAdmin.emergencyNumber,
      accessPermissions: masterAdmin.accessPermissions
    },
    create: masterAdmin
  });

  console.log('✅ Master admin user created successfully');

  // Create comprehensive permissions for master admin
  const permissionCategories = [
    'LISTINGS', 'RESERVATIONS', 'OWNER_STAYS', 'BOOKING_ENGINE', 
    'FINANCIAL_REPORTING', 'ANALYTICS', 'RENTAL_ACTIVITY', 'OCCUPANCY_REPORT',
    'EXPENSES_EXTRAS', 'OWNER_STATEMENTS', 'CHANNEL_MANAGER', 'TASK_MANAGER',
    'INTEGRATIONS', 'AUTOMATIONS', 'MESSAGES', 'GUEST_INVOICING', 'REVIEWS',
    'GUESTBOOK', 'SMART_LOCK_CODES', 'SAFELY_INSURANCE', 'NOTIFICATION_SETTINGS'
  ];

  const permissionLevels = ['VIEW', 'MODIFY', 'CREATE', 'DELETE'];

  // Create all permissions for master admin
  for (const category of permissionCategories) {
    for (const level of permissionLevels) {
      await prisma.userPermission.upsert({
        where: {
          userId_category_permission: {
            userId: createdMasterAdmin.id,
            category: category as any,
            permission: level as any
          }
        },
        update: {},
        create: {
          userId: createdMasterAdmin.id,
          category: category as any,
          permission: level as any
        }
      });
    }
  }

  console.log('✅ Master admin permissions created successfully');

  // Create comprehensive notification settings for master admin
  const notificationEvents = [
    'NEW_RESERVATION', 'NEW_OWNER_STAY', 'OWNER_STAY_MODIFIED', 
    'RESERVATION_CANCELLED', 'NEW_INQUIRY', 'RESERVATION_PENDING',
    'AIRBNB_ALTERATION_REQUEST', 'RENTAL_AGREEMENT_SIGNED',
    // Payment notifications
    'ADD_CARD_SUCCESS', 'ADD_CARD_FAILED', 'CHARGE_SUCCESS', 'CHARGE_FAILED',
    'REFUND_SUCCESS', 'REFUND_FAILED', 'PRE_AUTH_SUCCESS', 'PRE_AUTH_FAILED'
  ];

  const notificationChannels = ['RESERVATION_DASHBOARD', 'MOBILE_APP', 'EMAIL'];

  // Create all notification settings for master admin
  for (const event of notificationEvents) {
    for (const channel of notificationChannels) {
      await prisma.userNotification.upsert({
        where: {
          userId_event_channel: {
            userId: createdMasterAdmin.id,
            event: event as any,
            channel: channel as any
          }
        },
        update: {},
        create: {
          userId: createdMasterAdmin.id,
          event: event as any,
          channel: channel as any,
          isEnabled: true
        }
      });
    }
  }

  console.log('✅ Master admin notification settings created successfully');

  // Create subscription plans based on property count
  const plans = [
    {
      name: 'Single Property',
      description: 'Perfect for hosts with 1 property',
      basePrice: 50.00,
      currency: 'USD',
      interval: 'MONTHLY' as const,
      minProperties: 1,
      maxProperties: 1,
      maxUsers: 1,
      features: [
        'Calendar sync',
        'Reservation management',
        'Task tracking',
        'Email support',
        'Mobile app access',
        'Basic reporting'
      ],
      isActive: true,
      isPopular: false
    },
    {
      name: 'Small Portfolio',
      description: 'Ideal for hosts with 2-5 properties',
      basePrice: 40.00,
      currency: 'USD',
      interval: 'MONTHLY' as const,
      minProperties: 2,
      maxProperties: 5,
      maxUsers: 2,
      features: [
        'Calendar sync',
        'Reservation management',
        'Task tracking',
        'Email support',
        'Mobile app access',
        'Basic reporting',
        'Multi-user access'
      ],
      isActive: true,
      isPopular: true
    },
    {
      name: 'Growing Portfolio',
      description: 'For hosts with 6-10 properties',
      basePrice: 35.00,
      currency: 'USD',
      interval: 'MONTHLY' as const,
      minProperties: 6,
      maxProperties: 10,
      maxUsers: 3,
      features: [
        'Advanced calendar sync',
        'Multi-user access',
        'Advanced analytics',
        'Priority support',
        'Automated messaging',
        'Expense tracking',
        'Advanced reporting'
      ],
      isActive: true,
      isPopular: false
    },
    {
      name: 'Medium Portfolio',
      description: 'For hosts with 11-20 properties',
      basePrice: 30.00,
      currency: 'USD',
      interval: 'MONTHLY' as const,
      minProperties: 11,
      maxProperties: 20,
      maxUsers: 5,
      features: [
        'Advanced calendar sync',
        'Multi-user access',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'Automated messaging',
        'Expense tracking',
        'Advanced reporting',
        'API access'
      ],
      isActive: true,
      isPopular: false
    },
    {
      name: 'Large Portfolio',
      description: 'For hosts with 21-50 properties',
      basePrice: 25.00,
      currency: 'USD',
      interval: 'MONTHLY' as const,
      minProperties: 21,
      maxProperties: 50,
      maxUsers: 10,
      features: [
        'Advanced calendar sync',
        'Unlimited users',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'Automated messaging',
        'Expense tracking',
        'Advanced reporting',
        'API access',
        'Dedicated support'
      ],
      isActive: true,
      isPopular: false
    },
    {
      name: 'Enterprise Portfolio',
      description: 'For hosts with 51-100 properties',
      basePrice: 20.00,
      currency: 'USD',
      interval: 'MONTHLY' as const,
      minProperties: 51,
      maxProperties: 100,
      maxUsers: -1, // Unlimited
      features: [
        'Advanced calendar sync',
        'Unlimited users',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'Automated messaging',
        'Expense tracking',
        'Advanced reporting',
        'API access',
        'Dedicated account manager',
        'White-label options'
      ],
      isActive: true,
      isPopular: false
    }
  ];

  // Insert all plans (monthly only)
  for (const plan of plans) {
    await prisma.subscriptionPlan.create({
      data: plan
    });
  }

  console.log('✅ Subscription plans seeded successfully');

  // Create sample users for testing
  const sampleUsers = [
    {
      email: 'demo@hostit.com',
      name: 'Demo User',
      role: 'ADMIN' as const,
      password: await bcrypt.hash('DemoPassword123!', 12),
      isActive: true,
      emailVerified: true
    },
    {
      email: 'homeowner@hostit.com',
      name: 'John Homeowner',
      role: 'USER' as const,
      password: await bcrypt.hash('HomeownerPassword123!', 12),
      isActive: true,
      emailVerified: true
    },
    {
      email: 'manager@hostit.com',
      name: 'Property Manager',
      role: 'MANAGER' as const,
      password: await bcrypt.hash('ManagerPassword123!', 12),
      isActive: true,
      emailVerified: true
    }
  ];

  for (const user of sampleUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user
    });
  }

  console.log('✅ Sample users created successfully');

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 