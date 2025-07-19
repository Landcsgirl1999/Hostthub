#!/usr/bin/env node

const API_BASE = 'http://localhost:3003';

async function detailedDiagnostic() {
  console.log('🔍 Detailed Diagnostic\n');

  // Test 1: Basic server connectivity
  try {
    console.log('1️⃣ Testing server connectivity...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    console.log('   Health response status:', healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('   ✅ Server is running:', healthData);
    } else {
      console.log('   ❌ Health check failed');
      return;
    }
  } catch (error) {
    console.log('   ❌ Cannot connect to server:', error.message);
    return;
  }

  // Test 2: Check if payments route exists
  try {
    console.log('\n2️⃣ Testing payments route existence...');
    const paymentsResponse = await fetch(`${API_BASE}/api/v1/payments/test`);
    console.log('   Payments response status:', paymentsResponse.status);
    
    if (paymentsResponse.ok) {
      const data = await paymentsResponse.json();
      console.log('   ✅ Payments route working');
      console.log('   Data:', JSON.stringify(data, null, 2));
    } else {
      const errorText = await paymentsResponse.text();
      console.log('   ❌ Payments route failed:', paymentsResponse.status);
      console.log('   Error response:', errorText);
    }
  } catch (error) {
    console.log('   ❌ Payments route error:', error.message);
    console.log('   Error details:', error);
  }

  // Test 3: Check server logs
  console.log('\n3️⃣ Check your server logs for errors...');
  console.log('   Look for any error messages in the terminal where your API server is running');
}

detailedDiagnostic(); 