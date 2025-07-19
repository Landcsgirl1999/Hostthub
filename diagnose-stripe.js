#!/usr/bin/env node

const API_BASE = 'http://localhost:3003';

async function diagnoseStripe() {
  console.log('🔍 Diagnosing Stripe Integration Issues\n');

  // Test 1: Basic server health
  try {
    console.log('1️⃣ Testing server health...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    if (healthResponse.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server health check failed');
      return;
    }
  } catch (error) {
    console.log('❌ Cannot connect to server:', error.message);
    return;
  }

  // Test 2: Check if payments route exists
  try {
    console.log('\n2️⃣ Testing payments route...');
    const paymentsResponse = await fetch(`${API_BASE}/api/v1/payments/test`);
    if (paymentsResponse.ok) {
      const data = await paymentsResponse.json();
      console.log('✅ Payments route working');
      console.log('   Database connected:', data.database?.connected);
      console.log('   Stripe key set:', data.stripe?.keySet);
      console.log('   Stripe key length:', data.stripe?.keyLength);
    } else {
      console.log('❌ Payments route not found (404)');
    }
  } catch (error) {
    console.log('❌ Payments route error:', error.message);
  }

  // Test 3: Test payment intent creation
  try {
    console.log('\n3️⃣ Testing payment intent creation...');
    const paymentResponse = await fetch(`${API_BASE}/api/v1/payments/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 5000,
        accountId: 'test-123',
        description: 'Diagnostic test'
      })
    });

    if (paymentResponse.ok) {
      const data = await paymentResponse.json();
      console.log('✅ Payment intent created successfully');
    } else {
      const errorData = await paymentResponse.json();
      console.log('❌ Payment intent failed:', errorData.error);
    }
  } catch (error) {
    console.log('❌ Payment intent error:', error.message);
  }
}

diagnoseStripe(); 