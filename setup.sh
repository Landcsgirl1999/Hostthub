#!/bin/bash

echo "🚀 Setting up Hostit - Vacation Rental Management Platform"
echo "=========================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/hostit"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# API URL
API_URL="http://localhost:4000"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# External APIs
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
3000
# Development
NODE_ENV="development"
EOF
    echo "✅ Created .env file. Please update it with your actual values."
else
    echo "✅ .env file already exists"
fi

# Build packages
echo "🔨 Building packages..."
npm run build

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update the .env file with your database and API credentials"
echo "2. Set up a PostgreSQL database"
echo "3. Run database migrations: cd packages/db && npm run db:push"
echo "4. Start development servers: npm run dev"
echo ""
echo "📚 Documentation: README.md"
echo "🌐 Frontend: http://localhost:"
echo "🔌 API: http://localhost:4000" 