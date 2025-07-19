'use client';

import { useState } from 'react';
import { StripePaymentForm } from '../../../components/StripePaymentForm';
import { PaymentMethodsManager } from '../../../components/PaymentMethodsManager';

export default function TestStripePage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testPaymentIntent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 5000, // $50.00
          accountId: 'test-account-123',
          description: 'Test payment intent'
        })
      });

      const data = await response.json();
      
      if (data.clientSecret) {
        addTestResult('✅ Payment intent created successfully');
        addTestResult(`   Client Secret: ${data.clientSecret.substring(0, 20)}...`);
      } else {
        addTestResult(`❌ Failed to create payment intent: ${data.error}`);
      }
    } catch (error) {
      addTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testBillingService = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/billing/test-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: 'test-account-123',
          amount: 150.00,
          description: 'Test billing service'
        })
      });

      const data = await response.json();
      addTestResult(`✅ Billing test: ${JSON.stringify(data)}`);
    } catch (error) {
      addTestResult(`❌ Billing test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData: any) => {
    addTestResult(`✅ Payment successful: ${JSON.stringify(paymentData)}`);
  };

  const handlePaymentError = (error: string) => {
    addTestResult(`❌ Payment failed: ${error}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Stripe Integration Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Controls */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              <button
                onClick={testPaymentIntent}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Payment Intent Creation'}
              </button>
              
              <button
                onClick={testBillingService}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test Billing Service'}
              </button>
            </div>
          </div>

          {/* Test Results */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Test Results</h3>
            <div className="bg-white p-4 rounded border max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500">No test results yet. Run some tests above.</p>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono mb-2">
                    {result}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Payment Forms */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test Payment Form</h2>
            <StripePaymentForm
              amount={5000} // $50.00
              accountId="test-account-123"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Payment Methods Manager</h2>
            <PaymentMethodsManager accountId="test-account-123" />
          </div>
        </div>
      </div>

      {/* Test Card Information */}
      <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Stripe Test Cards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Success:</strong> 4242424242424242
          </div>
          <div>
            <strong>Decline:</strong> 4000000000000002
          </div>
          <div>
            <strong>Insufficient Funds:</strong> 4000000000009995
          </div>
          <div>
            <strong>Expired:</strong> 4000000000000069
          </div>
          <div>
            <strong>Incorrect CVC:</strong> 4000000000000127
          </div>
          <div>
            <strong>Processing Error:</strong> 4000000000000119
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Use any future expiry date and any 3-digit CVC for testing.
        </p>
      </div>
    </div>
  );
} 