#!/usr/bin/env node

/**
 * Simple test to check if the API server is running on port 3003
 */

const API_BASE = 'http://localhost:3003';

async function testServerConnection() {
  console.log('�� Testing API server connection on port 3003...\n');

  try {
    // Test 1: Basic health check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Server is running:', healthData);
    } else {
      console.log('❌ Health check failed:', healthResponse.status);
    }
    console.log('');

    // Test 2: Root endpoint
    console.log('2️⃣ Testing root endpoint...');
    const rootResponse = await fetch(`${API_BASE}/`);
    
    if (rootResponse.ok) {
      const rootData = await rootResponse.json();
      console.log('✅ Root endpoint working:', rootData.message);
    } else {
      console.log('❌ Root endpoint failed:', rootResponse.status);
    }
    console.log('');

    // Test 3: Test database connection
    console.log('3️⃣ Testing database connection...');
    const dbResponse = await fetch(`${API_BASE}/test-db`);
    
    if (dbResponse.ok) {
      const dbData = await dbResponse.json();
      console.log('✅ Database connection:', dbData);
    } else {
      console.log('❌ Database test failed:', dbResponse.status);
    }
    console.log('');

    console.log('🎉 Server connection test completed!');

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the API server is running on port 3003');
    console.log('2. Check if port 3003 is available');
    console.log('3. Verify your .env file has the correct database URL');
    console.log('4. Check the server logs for any errors');
  }
}

// Run the test
testServerConnection(); 