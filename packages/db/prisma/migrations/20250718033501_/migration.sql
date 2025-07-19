-- CreateEnum
CREATE TYPE "PreferredContactMethod" AS ENUM ('EMAIL', 'PHONE', 'SMS');

-- CreateEnum
CREATE TYPE "AccessPermission" AS ENUM ('OWNER_MANAGER_PERMISSIONS', 'CONTACT_DATA_ACCESS', 'FINANCIAL_DATA_ACCESS', 'NIGHTLY_CALENDAR_ACCESS', 'INQUIRIES_BOOKING_ACCESS', 'CANCELLED_RESERVATIONS_ACCESS', 'NEW_LISTINGS_ACCESS', 'GUEST_NOTES_ACCESS', 'HOST_NOTES_ACCESS');

-- CreateEnum
CREATE TYPE "PermissionLevel" AS ENUM ('VIEW', 'MODIFY', 'CREATE', 'DELETE');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('RESERVATION_DASHBOARD', 'MOBILE_APP', 'EMAIL');

-- CreateEnum
CREATE TYPE "NotificationEvent" AS ENUM ('NEW_RESERVATION', 'NEW_OWNER_STAY', 'OWNER_STAY_MODIFIED', 'RESERVATION_CANCELLED', 'NEW_INQUIRY', 'RESERVATION_PENDING', 'AIRBNB_ALTERATION_REQUEST', 'RENTAL_AGREEMENT_SIGNED', 'ADD_CARD_SUCCESS', 'ADD_CARD_FAILED', 'CHARGE_SUCCESS', 'CHARGE_FAILED', 'REFUND_SUCCESS', 'REFUND_FAILED', 'PRE_AUTH_SUCCESS', 'PRE_AUTH_FAILED');

-- CreateEnum
CREATE TYPE "PermissionCategory" AS ENUM ('LISTINGS', 'RESERVATIONS', 'OWNER_STAYS', 'BOOKING_ENGINE', 'FINANCIAL_REPORTING', 'ANALYTICS', 'RENTAL_ACTIVITY', 'OCCUPANCY_REPORT', 'EXPENSES_EXTRAS', 'OWNER_STATEMENTS', 'CHANNEL_MANAGER', 'TASK_MANAGER', 'INTEGRATIONS', 'AUTOMATIONS', 'MESSAGES', 'GUEST_INVOICING', 'REVIEWS', 'GUESTBOOK', 'SMART_LOCK_CODES', 'SAFELY_INSURANCE', 'NOTIFICATION_SETTINGS');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'HOMEOWNER', 'MANAGER', 'EMPLOYEE', 'CONTRACTOR');

-- CreateEnum
CREATE TYPE "BillingInterval" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'PAST_DUE', 'UNPAID', 'TRIAL');

-- CreateEnum
CREATE TYPE "PropertyChargeType" AS ENUM ('ADDITIONAL_PROPERTY', 'PLAN_UPGRADE', 'PLAN_DOWNGRADE');

-- CreateEnum
CREATE TYPE "PropertyChargeStatus" AS ENUM ('PENDING', 'BILLED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('AIRBNB', 'VRBO', 'BOOKING_COM', 'DIRECT', 'OTHER');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH', 'STRIPE', 'PAYPAL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('CLEANING', 'MAINTENANCE', 'INSPECTION', 'RESTOCKING', 'REPAIR', 'CONSULTATION', 'OTHER');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('EMAIL', 'SMS', 'IN_APP', 'AUTOMATED');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('DRAFT', 'SENT', 'DELIVERED', 'READ', 'FAILED');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('CLEANING', 'MAINTENANCE', 'REPAIRS', 'SUPPLIES', 'UTILITIES', 'INSURANCE', 'PROPERTY_MANAGEMENT', 'MARKETING', 'OTHER');

-- CreateEnum
CREATE TYPE "PricingRuleType" AS ENUM ('SEASONAL', 'WEEKEND', 'HOLIDAY', 'EVENT', 'OCCUPANCY', 'COMPETITOR', 'WEATHER', 'DEMAND', 'LEAD_TIME', 'GUEST_COUNT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('HOUSE', 'APARTMENT', 'CONDO', 'VILLA', 'CABIN', 'TOWNHOUSE', 'LOFT', 'STUDIO', 'PENTHOUSE', 'COTTAGE', 'BUNGALOW', 'OTHER');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('MULTIPLIER', 'FIXED_AMOUNT', 'PERCENTAGE', 'MINIMUM', 'MAXIMUM');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CARD', 'BANK_ACCOUNT', 'PAYPAL');

-- CreateEnum
CREATE TYPE "IntegrationStatus" AS ENUM ('PENDING', 'CONNECTED', 'DISCONNECTED', 'ERROR', 'SYNCING');

-- CreateEnum
CREATE TYPE "PropertySyncStatus" AS ENUM ('PENDING', 'SYNCED', 'SYNCING', 'ERROR', 'DISCONNECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOnHold" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "canCreateUsers" BOOLEAN NOT NULL DEFAULT false,
    "phoneNumber" TEXT,
    "address" TEXT,
    "birthday" TIMESTAMP(3),
    "title" TEXT,
    "lastLogin" TIMESTAMP(3),
    "photoUrl" TEXT,
    "preferredContactMethod" "PreferredContactMethod" DEFAULT 'EMAIL',
    "emergencyNumber" TEXT,
    "accessPermissions" "AccessPermission"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT,
    "createdById" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" TEXT NOT NULL,
    "category" "PermissionCategory" NOT NULL,
    "permission" "PermissionLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_notifications" (
    "id" TEXT NOT NULL,
    "event" "NotificationEvent" NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOnHold" BOOLEAN NOT NULL DEFAULT false,
    "stripeCustomerId" TEXT,
    "lastBillingDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_settings" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "logoUrl" TEXT,
    "website" TEXT,
    "phoneNumber" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "country" TEXT,
    "contactEmail" TEXT NOT NULL,
    "invoiceEmail" TEXT,
    "supportEmail" TEXT,
    "hostitAccountId" TEXT,
    "accountNumber" TEXT,
    "taxId" TEXT,
    "businessLicense" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "language" TEXT NOT NULL DEFAULT 'en',
    "invoicePrefix" TEXT DEFAULT 'INV',
    "invoiceNumber" INTEGER NOT NULL DEFAULT 1,
    "autoIncrement" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_settings" (
    "id" TEXT NOT NULL,
    "bankAccountInfo" JSONB,
    "autoGenerateInvoices" BOOLEAN NOT NULL DEFAULT true,
    "lateFeePercentage" DECIMAL(65,30) NOT NULL DEFAULT 0.05,
    "lateFeeAmount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "taxRate" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "taxIncluded" BOOLEAN NOT NULL DEFAULT false,
    "taxExemptionNumber" TEXT,
    "billingCycle" TEXT NOT NULL DEFAULT 'monthly',
    "billingDay" INTEGER NOT NULL DEFAULT 1,
    "sendInvoiceReminders" BOOLEAN NOT NULL DEFAULT true,
    "reminderDays" INTEGER[] DEFAULT ARRAY[7, 3, 1]::INTEGER[],
    "sendPaymentConfirmations" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "billing_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integration_settings" (
    "id" TEXT NOT NULL,
    "hostitApiKey" TEXT,
    "hostitApiSecret" TEXT,
    "hostitWebhookUrl" TEXT,
    "hostitNotifications" BOOLEAN NOT NULL DEFAULT true,
    "stripeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "stripePublishableKey" TEXT,
    "stripeSecretKey" TEXT,
    "paypalEnabled" BOOLEAN NOT NULL DEFAULT false,
    "paypalClientId" TEXT,
    "paypalSecret" TEXT,
    "googleCalendarEnabled" BOOLEAN NOT NULL DEFAULT false,
    "googleCalendarId" TEXT,
    "googleApiKey" TEXT,
    "twilioEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twilioAccountSid" TEXT,
    "twilioAuthToken" TEXT,
    "twilioPhoneNumber" TEXT,
    "sendgridEnabled" BOOLEAN NOT NULL DEFAULT false,
    "sendgridApiKey" TEXT,
    "sendgridFromEmail" TEXT,
    "airbnbEnabled" BOOLEAN NOT NULL DEFAULT false,
    "airbnbApiKey" TEXT,
    "airbnbApiSecret" TEXT,
    "vrboEnabled" BOOLEAN NOT NULL DEFAULT false,
    "vrboApiKey" TEXT,
    "vrboApiSecret" TEXT,
    "bookingComEnabled" BOOLEAN NOT NULL DEFAULT false,
    "bookingComApiKey" TEXT,
    "bookingComApiSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "integration_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "headerHtml" TEXT,
    "footerHtml" TEXT,
    "cssStyles" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "invoice_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "interval" "BillingInterval" NOT NULL,
    "minProperties" INTEGER NOT NULL,
    "maxProperties" INTEGER NOT NULL,
    "maxUsers" INTEGER NOT NULL,
    "features" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscription_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_subscriptions" (
    "id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "trialEndsAt" TIMESTAMP(3),
    "billingCycleStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "billingCycleEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,

    CONSTRAINT "user_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "billing_records" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "BillingStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "invoiceUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "paymentMethodId" TEXT,

    CONSTRAINT "billing_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_charges" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "chargeType" "PropertyChargeType" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "daysCharged" INTEGER NOT NULL,
    "status" "PropertyChargeStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "billingRecordId" TEXT,

    CONSTRAINT "property_charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "propertyType" "PropertyType" NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "maxGuests" INTEGER NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "cleaningFee" DOUBLE PRECISION,
    "serviceFee" DOUBLE PRECISION,
    "amenities" TEXT[],
    "images" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOnHold" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "minimumStay" INTEGER NOT NULL DEFAULT 1,
    "ownerId" TEXT NOT NULL,
    "accountId" TEXT,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "property_assignments" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "property_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendars" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "calendars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calendar_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "calendarId" TEXT NOT NULL,

    CONSTRAINT "calendar_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "guestPhone" TEXT,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'CONFIRMED',
    "platform" "Platform" NOT NULL,
    "platformId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,
    "assignedUserId" TEXT,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_extras" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reservationId" TEXT NOT NULL,

    CONSTRAINT "reservation_extras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reservationId" TEXT NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "TaskType" NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,
    "assignedUserId" TEXT,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "time_entries" (
    "id" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT,

    CONSTRAINT "time_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'EMAIL',
    "status" "MessageStatus" NOT NULL DEFAULT 'DRAFT',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "senderId" TEXT NOT NULL,
    "reservationId" TEXT,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(65,30) NOT NULL,
    "category" "ExpenseCategory" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "receipt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reservationId" TEXT,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photos" TEXT[],
    "basePrice" DECIMAL(65,30) NOT NULL,
    "platform" "Platform" NOT NULL,
    "platformId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "guestName" TEXT,
    "platform" "Platform" NOT NULL,
    "platformId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultation_requests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "propertyCount" TEXT NOT NULL,
    "preferredDate" TIMESTAMP(3) NOT NULL,
    "preferredTime" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dynamic_pricing_configs" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "minPrice" DOUBLE PRECISION NOT NULL,
    "maxPrice" DOUBLE PRECISION NOT NULL,
    "baseMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "competitorTracking" BOOLEAN NOT NULL DEFAULT true,
    "marketTrendAnalysis" BOOLEAN NOT NULL DEFAULT true,
    "demandForecasting" BOOLEAN NOT NULL DEFAULT true,
    "peakSeasonMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.5,
    "offSeasonMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "shoulderSeasonMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.1,
    "weekendMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.2,
    "weekdayMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 0.9,
    "eventMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "holidayMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.8,
    "occupancyThreshold" INTEGER NOT NULL DEFAULT 80,
    "highOccupancyMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.3,
    "lowOccupancyMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "lastMinuteDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0.8,
    "earlyBirdMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.1,
    "updateFrequency" TEXT NOT NULL DEFAULT 'daily',
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dynamic_pricing_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_rules" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "ruleType" "PricingRuleType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "dayOfWeek" INTEGER,
    "minStay" INTEGER,
    "maxStay" INTEGER,
    "guestCount" INTEGER,
    "priceType" "PriceType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "minPrice" DOUBLE PRECISION,
    "maxPrice" DOUBLE PRECISION,
    "weatherCondition" TEXT,
    "eventNearby" TEXT,
    "competitorPriceRange" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pricing_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_data" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "averagePrice" DOUBLE PRECISION NOT NULL,
    "medianPrice" DOUBLE PRECISION NOT NULL,
    "priceRange" TEXT NOT NULL,
    "occupancyRate" DOUBLE PRECISION NOT NULL,
    "demandScore" DOUBLE PRECISION NOT NULL,
    "supplyScore" DOUBLE PRECISION NOT NULL,
    "competitorCount" INTEGER NOT NULL,
    "competitorAvgPrice" DOUBLE PRECISION NOT NULL,
    "marketShare" DOUBLE PRECISION NOT NULL,
    "priceTrend" DOUBLE PRECISION NOT NULL,
    "demandTrend" DOUBLE PRECISION NOT NULL,
    "seasonalityScore" DOUBLE PRECISION NOT NULL,
    "weatherData" JSONB,
    "eventData" JSONB,
    "economicIndicators" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seasonal_adjustments" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "seasonName" TEXT NOT NULL,
    "startMonth" INTEGER NOT NULL,
    "endMonth" INTEGER NOT NULL,
    "startDay" INTEGER,
    "endDay" INTEGER,
    "multiplier" DOUBLE PRECISION NOT NULL,
    "minPrice" DOUBLE PRECISION,
    "maxPrice" DOUBLE PRECISION,
    "weatherImpact" DOUBLE PRECISION,
    "tourismFactor" DOUBLE PRECISION,
    "localEvents" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seasonal_adjustments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "amenity_multipliers" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "amenityId" TEXT NOT NULL,
    "amenityName" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "minStayRequired" INTEGER,
    "guestCountRequired" INTEGER,
    "seasonalOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "amenity_multipliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competitor_prices" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "competitorName" TEXT NOT NULL,
    "competitorUrl" TEXT,
    "competitorType" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "availability" BOOLEAN NOT NULL,
    "amenities" TEXT[],
    "priceDifference" DOUBLE PRECISION NOT NULL,
    "marketPosition" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "competitor_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_history" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "appliedRules" JSONB NOT NULL,
    "marketFactors" JSONB NOT NULL,
    "occupancyRate" DOUBLE PRECISION,
    "competitorAvgPrice" DOUBLE PRECISION,
    "bookingProbability" DOUBLE PRECISION,
    "revenueOptimization" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pricing_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_prices" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    "demandLevel" TEXT NOT NULL,
    "demandScore" DOUBLE PRECISION NOT NULL,
    "appliedRules" TEXT[],
    "marketFactors" JSONB,
    "confidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "type" "PaymentMethodType" NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "nickname" TEXT,
    "lastUsed" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,
    "stripePaymentMethodId" TEXT,
    "stripeCustomerId" TEXT,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card_details" (
    "id" TEXT NOT NULL,
    "encryptedCardNumber" TEXT NOT NULL,
    "encryptedExpiryMonth" TEXT NOT NULL,
    "encryptedExpiryYear" TEXT NOT NULL,
    "encryptedCvv" TEXT,
    "cardholderName" TEXT NOT NULL,
    "lastFourDigits" TEXT NOT NULL,
    "cardBrand" TEXT NOT NULL,
    "expiryMonth" TEXT NOT NULL,
    "expiryYear" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentMethodId" TEXT NOT NULL,

    CONSTRAINT "card_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_account_details" (
    "id" TEXT NOT NULL,
    "encryptedAccountNumber" TEXT NOT NULL,
    "encryptedRoutingNumber" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "lastFourDigits" TEXT NOT NULL,
    "routingNumberLastFour" TEXT NOT NULL,
    "bankNameDisplay" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentMethodId" TEXT NOT NULL,

    CONSTRAINT "bank_account_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "external_platforms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "apiEndpoint" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "external_platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_integrations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "apiKey" TEXT,
    "apiSecret" TEXT,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "status" "IntegrationStatus" NOT NULL DEFAULT 'PENDING',
    "lastSync" TIMESTAMP(3),
    "syncFrequency" INTEGER NOT NULL DEFAULT 3600,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_properties" (
    "id" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "integrationId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "externalUrl" TEXT,
    "status" "PropertySyncStatus" NOT NULL DEFAULT 'PENDING',
    "lastSync" TIMESTAMP(3),
    "syncSettings" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_userId_category_permission_key" ON "user_permissions"("userId", "category", "permission");

-- CreateIndex
CREATE UNIQUE INDEX "user_notifications_userId_event_channel_key" ON "user_notifications"("userId", "event", "channel");

-- CreateIndex
CREATE UNIQUE INDEX "company_settings_accountId_key" ON "company_settings"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "billing_settings_accountId_key" ON "billing_settings"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "integration_settings_accountId_key" ON "integration_settings"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plans_name_interval_key" ON "subscription_plans"("name", "interval");

-- CreateIndex
CREATE UNIQUE INDEX "property_assignments_userId_propertyId_key" ON "property_assignments"("userId", "propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "dynamic_pricing_configs_propertyId_key" ON "dynamic_pricing_configs"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "market_data_propertyId_date_location_key" ON "market_data"("propertyId", "date", "location");

-- CreateIndex
CREATE UNIQUE INDEX "amenity_multipliers_propertyId_amenityId_key" ON "amenity_multipliers"("propertyId", "amenityId");

-- CreateIndex
CREATE UNIQUE INDEX "competitor_prices_propertyId_competitorName_date_key" ON "competitor_prices"("propertyId", "competitorName", "date");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_history_propertyId_date_key" ON "pricing_history"("propertyId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_prices_propertyId_date_key" ON "daily_prices"("propertyId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "card_details_paymentMethodId_key" ON "card_details"("paymentMethodId");

-- CreateIndex
CREATE UNIQUE INDEX "bank_account_details_paymentMethodId_key" ON "bank_account_details"("paymentMethodId");

-- CreateIndex
CREATE UNIQUE INDEX "external_platforms_name_key" ON "external_platforms"("name");

-- CreateIndex
CREATE UNIQUE INDEX "platform_integrations_userId_platformId_key" ON "platform_integrations"("userId", "platformId");

-- CreateIndex
CREATE UNIQUE INDEX "platform_properties_platformId_externalId_key" ON "platform_properties"("platformId", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "platform_properties_integrationId_propertyId_key" ON "platform_properties"("integrationId", "propertyId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_settings" ADD CONSTRAINT "company_settings_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_settings" ADD CONSTRAINT "billing_settings_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integration_settings" ADD CONSTRAINT "integration_settings_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_templates" ADD CONSTRAINT "invoice_templates_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscriptions" ADD CONSTRAINT "user_subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_records" ADD CONSTRAINT "billing_records_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "user_subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_records" ADD CONSTRAINT "billing_records_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_charges" ADD CONSTRAINT "property_charges_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_charges" ADD CONSTRAINT "property_charges_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "user_subscriptions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_charges" ADD CONSTRAINT "property_charges_billingRecordId_fkey" FOREIGN KEY ("billingRecordId") REFERENCES "billing_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_assignments" ADD CONSTRAINT "property_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "property_assignments" ADD CONSTRAINT "property_assignments_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendars" ADD CONSTRAINT "calendars_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calendar_events" ADD CONSTRAINT "calendar_events_calendarId_fkey" FOREIGN KEY ("calendarId") REFERENCES "calendars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_extras" ADD CONSTRAINT "reservation_extras_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD CONSTRAINT "listings_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dynamic_pricing_configs" ADD CONSTRAINT "dynamic_pricing_configs_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pricing_rules" ADD CONSTRAINT "pricing_rules_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "market_data" ADD CONSTRAINT "market_data_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seasonal_adjustments" ADD CONSTRAINT "seasonal_adjustments_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "amenity_multipliers" ADD CONSTRAINT "amenity_multipliers_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competitor_prices" ADD CONSTRAINT "competitor_prices_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_prices" ADD CONSTRAINT "daily_prices_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "card_details" ADD CONSTRAINT "card_details_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_account_details" ADD CONSTRAINT "bank_account_details_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_integrations" ADD CONSTRAINT "platform_integrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_integrations" ADD CONSTRAINT "platform_integrations_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "external_platforms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_properties" ADD CONSTRAINT "platform_properties_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "external_platforms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_properties" ADD CONSTRAINT "platform_properties_integrationId_fkey" FOREIGN KEY ("integrationId") REFERENCES "platform_integrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "platform_properties" ADD CONSTRAINT "platform_properties_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
