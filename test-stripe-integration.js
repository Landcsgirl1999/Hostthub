#!/usr/bin/env node

/**
 * Test script for Stripe integration
 * This tests the actual Stripe API with test credentials
 */

const API_BASE = 'http://localhost:3003';

async function testStripeIntegration() {
  console.log('🧪 Testing Stripe Integration on port 3003\n');

  // First, test if server is running
  try {
    const healthResponse = await fetch(`${API_BASE}/health`);
    if (!healthResponse.ok) {
      throw new Error(`Server not responding (${healthResponse.status})`);
    }
    console.log('✅ API server is running on port 3003');
  } catch (error) {
    console.error('❌ Cannot connect to API server:', error.message);
    console.log('\n🔧 Please start the API server first:');
    console.log('   cd apps/api && npm run dev');
    console.log('   (Make sure it\'s running on port 3003)');
    return;
  }

  try {
    // Test 1: Create payment intent
    console.log('\n1️⃣ Testing payment intent creation...');
    const paymentIntentResponse = await fetch(`${API_BASE}/api/v1/payments/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 5000, // $50.00
        accountId: 'test-account-123',
        description: 'Test payment for Stripe integration'
      })
    });
    
    if (!paymentIntentResponse.ok) {
      const errorData = await paymentIntentResponse.json();
      console.log('❌ Payment intent creation failed:', errorData);
    } else {
      const paymentIntentData = await paymentIntentResponse.json();
      console.log('✅ Payment intent created successfully');
      console.log('   Client Secret:', paymentIntentData.clientSecret?.substring(0, 20) + '...');
      console.log('   Payment Intent ID:', paymentIntentData.paymentIntentId);
    }

    // Test 2: Test billing service
    console.log('\n2️⃣ Testing billing service...');
    const billingResponse = await fetch(`${API_BASE}/api/v1/billing/test-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accountId: 'test-account-123',
        amount: 150.00,
        description: 'Test monthly billing for 3 properties'
      })
    });
    
    if (!billingResponse.ok) {
      const errorData = await billingResponse.json();
      console.log('❌ Billing test failed:', errorData);
    } else {
      const billingData = await billingResponse.json();
      console.log('✅ Billing test result: