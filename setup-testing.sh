#!/bin/bash

echo "�� Setting up testing environment for port 3003..."

# Check if API server is running
echo "1️⃣ Checking if API server is running on port 3003..."
if curl -s http://localhost:3003/health > /dev/null; then
    echo "✅ API server is running on port 3003"
else
    echo "❌ API server is not running on port 3003"
    echo "   Please start the API server:"
    echo "   cd apps/api && npm run dev"
    echo "   (Make sure it's configured for port 3003)"
    exit 1
fi

# Check if web server is running
echo "2️⃣ Checking if web server is running..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Web server is running on port 3000"
else
    echo "⚠️  Web server is not running on port 3000"
    echo "   You can start it with: cd apps/web && npm run dev"
fi

echo "3️⃣ Running connection test..."
node test-server-connection.js

echo "4️⃣ Running Stripe integration test..."
node test-stripe-integration.js

echo "🎉 Testing setup complete!"
echo ""
echo "📋 Available test URLs:"
echo "   API Health: http://localhost:3003/health"
echo "   Web App: http://localhost:3000"
echo "   Stripe Test: http://localhost:3000/test-stripe" 