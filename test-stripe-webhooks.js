#!/usr/bin/env node

/**
 * Test script for Stripe webhooks
 * This simulates webhook events to test your webhook handler
 */

const API_BASE = 'http://localhost:3003';

// Simulate webhook events
const webhookEvents = [
  {
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: 'pi_test_1234567890',
        amount: 5000,
        currency: 'usd',
        status: 'succeeded',
        metadata: {
          accountId: 'test-account-123',
          hostitPayment: 'true'
        }
      }
    }
  },
  {
    type: 'payment_intent.payment_failed',
    data: {
      object: {
        id: 'pi_test_1234567891',
        amount: 5000,
        currency: 'usd',
        status: 'requires_payment_method',
        last_payment_error: {
          message: 'Your card was declined.'
        },
        metadata: {
          accountId: 'test-account-123',
          hostitPayment: 'true'
        }
      }
    }
  }
];

async function testWebhooks() {
  console.log(' Testing Stripe Webhooks on port 3003\n');

  for (const event of webhookEvents) {
    try {
      console.log(`Testing webhook: ${event.type}`);
      
      const response = await fetch(`${API_BASE}/api/v1/payments/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Stripe-Signature': 'test_signature' // In real implementation, this would be a valid signature
        },
        body: JSON.stringify(event)
      });

      const result = await response.json();
      console.log(`✅ Webhook ${event.type} processed:`, result);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Webhook ${event.type} failed:`, error.message);
    }
  }
}

// Run webhook tests
testWebhooks();