'use client';

import { useState } from 'react';

export default function TestPaymentsPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testDiagnostic = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/payments/test');
      const data = await response.json();
      
      if (data.success) {
        addResult('✅ Diagnostic successful');
        addResult(`   Database: ${data.database.connected ? 'Connected' : 'Failed'}`);
        addResult(`   Stripe: ${data.stripe.initialized ? 'Initialized' : 'Not initialized'}`);
        addResult(`   Stripe Key: ${data.stripe.keySet ? 'Set' : 'Missing'}`);
      } else {
        addResult(`❌ Diagnostic failed: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ Diagnostic error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testPaymentIntent = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/v1/payments/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 5000,
          accountId: 'test-account-123',
          description: 'Test payment'
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        addResult('✅ Payment intent created');
        addResult(`   ID: ${data.paymentIntentId}`);
        addResult(`   Amount: $${(data.amount / 100).toFixed(2)}`);
      } else {
        addResult(`❌ Payment intent failed: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ Payment intent error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Payment System Test</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="space-y-4">
            <button
              onClick={testDiagnostic}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Run Diagnostic'}
            </button>
            
            <button
              onClick={testPaymentIntent}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Payment Intent'}
            </button>
          </div>
        </div>

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
    </div>
  );
} 