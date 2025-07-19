import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPlatforms() {
  console.log('🌐 Seeding external platforms...');

  const platforms = [
    {
      name: 'airbnb',
      displayName: 'Airbnb',
      description: 'Connect your Airbnb listings for seamless management',
      logoUrl: '/platforms/airbnb-logo.png',
      apiEndpoint: 'https://api.airbnb.com/v2',
      isActive: true
    },
    {
      name: 'vrbo',
      displayName: 'VRBO',
      description: 'Sync your VRBO properties for unified management',
      logoUrl: '/platforms/vrbo-logo.png',
      apiEndpoint: 'https://api.vrbo.com/v1',
      isActive: true
    },
    {
      name: 'booking.com',
      displayName: 'Booking.com',
      description: 'Integrate your Booking.com listings',
      logoUrl: '/platforms/booking-logo.png',
      apiEndpoint: 'https://distribution-xml.booking.com/2.4',
      isActive: true
    },
    {
      name: 'houfy',
      displayName: 'Houfy',
      description: 'Connect your Houfy vacation rental listings',
      logoUrl: '/platforms/houfy-logo.png',
      apiEndpoint: 'https://api.houfy.com/v1',
      isActive: true
    },
    {
      name: 'glamping',
      displayName: 'Glamping Hub',
      description: 'Sync your glamping and unique accommodations',
      logoUrl: '/platforms/glamping-logo.png',
      apiEndpoint: 'https://api.glampinghub.com/v1',
      isActive: true
    },
    {
      name: 'expedia',
      displayName: 'Expedia',
      description: 'Connect your Expedia vacation rental listings',
      logoUrl: '/platforms/expedia-logo.png',
      apiEndpoint: 'https://api.ean.com/v3',
      isActive: true
    },
    {
      name: 'tripadvisor',
      displayName: 'TripAdvisor',
      description: 'Sync your TripAdvisor vacation rental properties',
      logoUrl: '/platforms/tripadvisor-logo.png',
      apiEndpoint: 'https://api-tripadvisor.content.tripadvisor.com',
      isActive: true
    },
    {
      name: 'homeaway',
      displayName: 'HomeAway',
      description: 'Connect your HomeAway listings (now part of VRBO)',
      logoUrl: '/platforms/homeaway-logo.png',
      apiEndpoint: 'https://api.homeaway.com/v1',
      isActive: false // Deprecated, now part of VRBO
    }
  ];

  for (const platform of platforms) {
    await prisma.externalPlatform.upsert({
      where: { name: platform.name },
      update: platform,
      create: platform
    });
    console.log(`✅ Added/Updated platform: ${platform.displayName}`);
  }

  console.log('🎉 External platforms seeded successfully!');
}

async function main() {
  try {
    await seedPlatforms();
  } catch (error) {
    console.error('❌ Error seeding platforms:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 