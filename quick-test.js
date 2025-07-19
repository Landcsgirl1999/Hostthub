#!/usr/bin/env node

const API_BASE = 'http://localhost:3003';

async function quickTest() {
  console.log('🔍 Quick API Test\n');
  
  const tests = [
    { name: 'Health Check', url: '/health', method: 'GET' },
    { name: 'Pricing Tiers', url: '/api/v1/billing/pricing-tiers', method: 'GET' },
    { name: 'Payment Intent', url: '/api/v1/payments/create-payment-intent', method: 'POST', body: { amount: 5000, accountId: 'test-123', description: 'test' } }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}...`);
      
      const options = {
        method: test.method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (test.body) {
        options.body = JSON.stringify(test.body);
      }
      
      const response = await fetch(`${API_BASE}${test.url}`, options);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${test.name}: OK`);
        if (test.name === 'Health Check') {
          console.log(`   Status: ${data.status}`);
        }
      } else {
        console.log(`❌ ${test.name}: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
    }
    console.log('');
  }
}

quickTest(); 