'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Building, Apple, Chrome, CheckCircle, ArrowRight } from 'lucide-react';

interface BillingPlan {
  id: string;
  name: string;
  price: number;
  properties: number;
  features: string[];
}

export default function SignUpPage() {
  const [step, setStep] = useState<'account' | 'billing'>('account');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Account form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    company: '',
    propertyCount: '1'
  });

  // Billing form
  const [billingForm, setBillingForm] = useState({
    paymentMethod: 'card' as 'card' | 'bank' | 'apple' | 'google',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
    bankName: '',
    accountType: 'checking'
  });

  const [selectedPlan, setSelectedPlan] = useState<BillingPlan | null>(null);
  const router = useRouter();

  // Billing plans based on property count
  const billingPlans: BillingPlan[] = [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: 29,
      properties: 1,
      features: ['Basic property management', 'Calendar sync', 'Guest messaging', 'Basic reporting']
    },
    {
      id: 'professional',
      name: 'Professional Plan',
      price: 49,
      properties: 5,
      features: ['Advanced property management', 'Multi-calendar sync', 'Automated messaging', 'Advanced reporting', 'Task management']
    },
    {
      id: 'business',
      name: 'Business Plan',
      price: 99,
      properties: 15,
      features: ['Enterprise features', 'API access', 'Custom integrations', 'Priority support', 'White-label options']
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 199,
      properties: 50,
      features: ['Unlimited properties', 'Custom development', 'Dedicated support', 'Advanced analytics', 'Multi-account management']
    }
  ];

  // Auto-select plan based on property count
  const updateSelectedPlan = (propertyCount: string) => {
    const count = parseInt(propertyCount);
    const plan = billingPlans.find(p => p.properties >= count) || billingPlans[billingPlans.length - 1];
    setSelectedPlan(plan);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Update selected plan when property count changes
    if (name === 'propertyCount') {
      updateSelectedPlan(value);
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('billing');
  };

  const handleBillingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // First, create the user account
      const accountResponse = await fetch('/api/v1/auth/public-register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          company: formData.company,
          propertyCount: formData.propertyCount
        }),
      });

      const accountData = await accountResponse.json();

      if (!accountResponse.ok) {
        throw new Error(accountData.error || 'Account creation failed');
      }

      // Store the token for billing setup
      if (accountData.token) {
        localStorage.setItem('token', accountData.token);
      }

      // Add payment method
      const paymentResponse = await fetch('/api/v1/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accountData.token}`
        },
        body: JSON.stringify({
          type: billingForm.paymentMethod,
          ...(billingForm.paymentMethod === 'card' ? {
            cardNumber: billingForm.cardNumber,
            expiryMonth: billingForm.expiryMonth,
            expiryYear: billingForm.expiryYear,
            cvv: billingForm.cvv,
            cardholderName: billingForm.cardholderName
          } : {
            accountNumber: billingForm.accountNumber,
            routingNumber: billingForm.routingNumber,
            accountHolderName: billingForm.accountHolderName,
            bankName: billingForm.bankName,
            accountType: billingForm.accountType
          })
        }),
      });

      if (!paymentResponse.ok) {
        throw new Error('Failed to add payment method');
      }

      // Create subscription
      const subscriptionResponse = await fetch('/api/v1/billing/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accountData.token}`
        },
        body: JSON.stringify({
          planId: selectedPlan?.id,
          propertyCount: parseInt(formData.propertyCount)
        }),
      });

      if (!subscriptionResponse.ok) {
        throw new Error('Failed to create subscription');
      }

      setSuccess('Account created successfully! Redirecting to dashboard...');
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/admin');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Account creation failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize selected plan
  useState(() => {
    updateSelectedPlan(formData.propertyCount);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center ${step === 'account' ? 'text-blue-600' : 'text-green-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'account' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Account</span>
            </div>
            <ArrowRight className="text-gray-400" />
            <div className={`flex items-center ${step === 'billing' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'billing' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Billing</span>
            </div>
          </div>
        </div>

        {/* Step 1: Account Creation */}
        {step === 'account' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Your Account</h1>
              <p className="text-gray-600">Get started with Hostithub property management</p>
            </div>

            <form onSubmit={handleAccountSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Properties</label>
                  <select
                    name="propertyCount"
                    value={formData.propertyCount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="1">1 Property</option>
                    <option value="2">2 Properties</option>
                    <option value="3">3 Properties</option>
                    <option value="4">4 Properties</option>
                    <option value="5">5 Properties</option>
                    <option value="10">6-10 Properties</option>
                    <option value="15">11-15 Properties</option>
                    <option value="25">16-25 Properties</option>
                    <option value="50">26-50 Properties</option>
                    <option value="100">50+ Properties</option>
                  </select>
                </div>
              </div>

              {selectedPlan && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Selected Plan: {selectedPlan.name}</h3>
                  <p className="text-blue-700 text-sm">${selectedPlan.price}/month for up to {selectedPlan.properties} properties</p>
                  <ul className="text-blue-700 text-sm mt-2 space-y-1">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium"
              >
                Continue to Billing
              </button>

              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link href="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Billing Setup */}
        {step === 'billing' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Set Up Billing</h1>
              <p className="text-gray-600">Choose your preferred payment method</p>
            </div>

            <form onSubmit={handleBillingSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">Payment Method</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    type="button"
                    onClick={() => setBillingForm({...billingForm, paymentMethod: 'card'})}
                    className={`p-4 border rounded-lg text-center ${billingForm.paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  >
                    <CreditCard className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <span className="text-sm font-medium">Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingForm({...billingForm, paymentMethod: 'bank'})}
                    className={`p-4 border rounded-lg text-center ${billingForm.paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  >
                    <Building className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <span className="text-sm font-medium">Bank Account</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingForm({...billingForm, paymentMethod: 'apple'})}
                    className={`p-4 border rounded-lg text-center ${billingForm.paymentMethod === 'apple' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  >
                    <Apple className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <span className="text-sm font-medium">Apple Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingForm({...billingForm, paymentMethod: 'google'})}
                    className={`p-4 border rounded-lg text-center ${billingForm.paymentMethod === 'google' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                  >
                    <Chrome className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                    <span className="text-sm font-medium">Google Pay</span>
                  </button>
                </div>
              </div>

              {/* Card Details */}
              {billingForm.paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      value={billingForm.cardNumber}
                      onChange={(e) => setBillingForm({...billingForm, cardNumber: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                      <input
                        type="text"
                        value={billingForm.expiryMonth}
                        onChange={(e) => setBillingForm({...billingForm, expiryMonth: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="MM"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                      <input
                        type="text"
                        value={billingForm.expiryYear}
                        onChange={(e) => setBillingForm({...billingForm, expiryYear: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="YYYY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        value={billingForm.cvv}
                        onChange={(e) => setBillingForm({...billingForm, cvv: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      value={billingForm.cardholderName}
                      onChange={(e) => setBillingForm({...billingForm, cardholderName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Bank Account Details */}
              {billingForm.paymentMethod === 'bank' && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                      <input
                        type="text"
                        value={billingForm.accountNumber}
                        onChange={(e) => setBillingForm({...billingForm, accountNumber: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
                      <input
                        type="text"
                        value={billingForm.routingNumber}
                        onChange={(e) => setBillingForm({...billingForm, routingNumber: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                      <input
                        type="text"
                        value={billingForm.accountHolderName}
                        onChange={(e) => setBillingForm({...billingForm, accountHolderName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                      <input
                        type="text"
                        value={billingForm.bankName}
                        onChange={(e) => setBillingForm({...billingForm, bankName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                    <select
                      value={billingForm.accountType}
                      onChange={(e) => setBillingForm({...billingForm, accountType: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Apple Pay / Google Pay */}
              {(billingForm.paymentMethod === 'apple' || billingForm.paymentMethod === 'google') && (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    {billingForm.paymentMethod === 'apple' ? 'Apple Pay' : 'Google Pay'} will be processed securely through our payment system.
                  </p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      You'll be redirected to complete the payment after account setup.
                    </p>
                  </div>
                </div>
              )}

              {/* Plan Summary */}
              {selectedPlan && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Plan Summary</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-700">{selectedPlan.name}</p>
                      <p className="text-sm text-gray-600">Up to {selectedPlan.properties} properties</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">${selectedPlan.price}/month</p>
                      <p className="text-sm text-gray-600">Billed monthly</p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {isLoading ? 'Creating Account...' : 'Create Account & Start Free Trial'}
              </button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Error and Success Messages */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{success}</p>
          </div>
        )}
      </div>
    </div>
  );
} 