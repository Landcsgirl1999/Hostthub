'use client';

import { StripePaymentForm } from '../../../components/StripePaymentForm';
import { PaymentMethodsManager } from '../../../components/PaymentMethodsManager';

export default function BillingPage() {
  const accountId = 'your-account-id'; // Get from context/auth

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData);
    // Handle success (redirect, show confirmation, etc.)
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
    // Handle error (show error message, etc.)
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Billing & Payments</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>
          <StripePaymentForm
            amount={5000} // $50.00 in cents
            accountId={accountId}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
        
        <div>
          <PaymentMethodsManager accountId={accountId} />
        </div>
      </div>
    </div>
  );
} 