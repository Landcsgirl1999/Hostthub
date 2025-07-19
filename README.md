# HostItHub - Vacation Rental Management Platform

A comprehensive vacation rental management platform built with Next.js, Express, and PostgreSQL.

## 🏗️ Architecture

```
hostithub/
├── apps/
│   ├── web/         # Next.js frontend
│   └── api/         # Express backend
│
├── packages/
│   ├── db/          # Prisma ORM + PostgreSQL
│   ├── ui/          # Shared React UI components
│   └── config/      # Shared configs (eslint, tailwind, tsconfig, etc)
```

## 🚀 Features

### Core Management
- **Calendar Integration**: iCal sync with Airbnb, VRBO, and other platforms
- **Reservation Overview**: Check-ins, check-outs, and status tracking
- **Guest Management**: Profiles, communications, and data tracking
- **Property Management**: Listings, amenities, and platform integrations

### Communication & Automation
- **Shared Inbox**: Team communication and guest messaging
- **Automated Messaging**: Pre/post-stay communications
- **Review Management**: Aggregated reviews from multiple platforms

### Operations
- **Task Manager**: Maintenance, housekeeping, and inspections (Operto-style)
- **Employee Portal**: Scheduling, time tracking, and task assignments
- **Owner Portal**: Property management and financial statements

### Financial & Analytics
- **Reservation Tracking**: Income, expenses, and extras
- **Dynamic Pricing**: Integration with PriceLabs, BeyondPricing
- **Accounting**: QuickBooks/Xero integration or built-in accounting
- **Analytics**: Occupancy reports and rental activity

### Integrations
- **Insurance**: Safely integration
- **Smart Locks**: August, Schlage, and other lock systems
- **Payment Processing**: Stripe integration
- **Booking Engines**: Custom widgets per account

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- PostgreSQL
- npm or pnpm

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd hostithub
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database and API keys
```

4. **Set up the database**
```bash
cd packages/db
npm run db:generate
npm run db:push
```

5. **Start development servers**
```bash
npm run dev
```

## 📦 Available Scripts

- `npm run dev` - Start all development servers
- `npm run build` - Build all applications
- `npm run lint` - Run linting across all packages
- `npm run test` - Run tests across all packages
- `npm run clean` - Clean all build outputs

## 🔧 Development

### Apps
- **Web App** (`apps/web`): Next.js frontend with Tailwind CSS
- **API** (`apps/api`): Express backend with Prisma ORM

### Packages
- **Database** (`packages/db`): Prisma schema and database utilities
- **UI Components** (`packages/ui`): Shared React components
- **Config** (`packages/config`): Shared ESLint, TypeScript, and other configs

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hostithub"

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# External APIs
STRIPE_SECRET_KEY="sk_test_..."
AIRBNB_API_KEY="your-airbnb-api-key"
VRBO_API_KEY="your-vrbo-api-key"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 🤝 Contributing 
fork the repsoitory
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 