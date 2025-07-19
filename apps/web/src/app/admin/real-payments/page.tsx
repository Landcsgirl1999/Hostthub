'use client';

import { useState } from 'react';
import { RealStripePayment } from '../../../components/RealStripePayment';

export default function RealPaymentsPage() {
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [selectedAmount, setSelectedAmount] = useState(5000); // $50.00
  const [accountId, setAccountId] = useState('');

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData);
    
    // Add to payment history
    setPaymentHistory(prev => [paymentData, ...prev]);
    
    // Show success message
    alert(`Payment successful! Amount: $${(paymentData.amount / 100).toFixed(2)}`);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    alert(`Payment failed: ${error}`);
  };

  const presetAmounts = [
    { value: 2500, label: '$25.00' },
    { value: 5000, label: '$50.00' },
    { value: 10000, label: '$100.00' },
    { value: 25000, label: '$250.00' },
    { value: 50000, label: '$500.00' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Real Stripe Payments</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>
            
            {/* Account ID Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account ID
              </label>
              <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                placeholder="Enter account ID"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount
              </label>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount.value}
                    type="button"
                    onClick={() => setSelectedAmount(amount.value)}
                    className={`py-2 px-3 rounded-md text-sm font-medium ${
                      selectedAmount === amount.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {amount.label}
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <input
                  type="number"
                  value={selectedAmount / 100}
                  onChange={(e) => setSelectedAmount(Math.round(parseFloat(e.target.value) * 100))}
                  step="0.01"
                  min="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Or enter custom amount"
                />
              </div>
            </div>

            {/* Payment Form */}
            {accountId && (
              <RealStripePayment
                amount={selectedAmount}
                accountId={accountId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}
          </div>
        </div>

        {/* Payment History */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            
            {paymentHistory.length === 0 ? (
              <p className="text-gray-500">No payments yet. Make a payment to see history.</p>
            ) : (
              <div className="space-y-3">
                {paymentHistory.map((payment, index) => (
                  <div key={index} className="bg-white p-4 rounded-md border">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-green-600">
                          ${(payment.amount / 100).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          ID: {payment.paymentIntentId}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        Success
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test Card Information */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Test Cards (for testing)</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Success:</strong> 4242424242424242</div>
              <div><strong>Decline:</strong> 4000000000000002</div>
              <div><strong>Insufficient Funds:</strong> 4000000000009995</div>
              <div><strong>Expired:</strong> 4000000000000069</div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Use any future expiry date and any 3-digit CVC for testing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 