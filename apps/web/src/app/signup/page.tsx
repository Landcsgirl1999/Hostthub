'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Building, Apple, Chrome, CheckCircle, ArrowRight, Info } from 'lucide-react';

interface PricingPlan {
  name: string;
  description: string;
  price: number;
  propertyRange: string;
  minProperties: number;
  maxProperties: number;
  features: string[];
  popular: boolean;
}

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pricingModel = searchParams.get('pricing') || 'full-price';
  
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

  // Pricing plans from your pricing page
  const pricingPlans: PricingPlan[] = [
    {
      name: 'Single Property',
      description: 'Perfect for hosts with 1 property',
      price: 50,
      propertyRange: '1 property',
      minProperties: 1,
      maxProperties: 1,
      features: [
        'Calendar sync',
        'Reservation management',
        'Task tracking',
        'Email support',
        'Mobile app access',
        'Basic reporting'
      ],
      popular: false
    },
    {
      name: 'Small Portfolio',
      description: 'Ideal for hosts with 2-5 properties',
      price: 40,
      propertyRange: '2-5 properties',
      minProperties: 2,
      maxProperties: 5,
      features: [
        'Calendar sync',
        'Reservation management',
        'Task tracking',
        'Email support',
        'Mobile app access',
        'Basic reporting',
        'Multi-user access',
        'Advanced analytics'
      ],
      popular: true
    },
    {
      name: 'Growing Portfolio',
      description: 'For hosts with 6-10 properties',
      price: 35,
      propertyRange: '6-10 properties',
      minProperties: 6,
      maxProperties: 10,
      features: [
        'Advanced calendar sync',
        'Multi-user access',
        'Advanced analytics',
        'Priority support',
        'Automated messaging',
        'Expense tracking'
      ],
      popular: false
    },
    {
      name: 'Medium Portfolio',
      description: 'For hosts with 11-20 properties',
      price: 30,
      propertyRange: '11-20 properties',
      minProperties: 11,
      maxProperties: 20,
      features: [
        'Advanced calendar sync',
        'Multi-user access',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'Automated messaging'
      ],
      popular: false
    },
    {
      name: 'Large Portfolio',
      description: 'For hosts with 21-50 properties',
      price: 25,
      propertyRange: '21-50 properties',
      minProperties: 21,
      maxProperties: 50,
      features: [
        'Advanced calendar sync',
        'Unlimited users',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'API access'
      ],
      popular: false
    },
    {
      name: 'Enterprise Portfolio',
      description: 'For hosts with 51-100 properties',
      price: 20,
      propertyRange: '51-100 properties',
      minProperties: 51,
      maxProperties: 100,
      features: [
        'Advanced calendar sync',
        'Unlimited users',
        'Advanced analytics',
        'Priority support',
        'Custom integrations',
        'White-label options'
      ],
      popular: false
    }
  ];

  // Find matching plan based on property count
  const getMatchingPlan = (propertyCount: number) => {
    return pricingPlans.find(
      plan => propertyCount >= plan.minProperties && propertyCount <= plan.maxProperties
    );
  };

  // Always clamp propertyCount between 1 and 100, and default to 1 if invalid
  const propertyCount = Math.max(1, Math.min(100, parseInt(formData.propertyCount) || 1));
  const selectedPlan = getMatchingPlan(propertyCount);
  
  // Calculate pricing based on selected model
  let subtotal = 0;
  let processingFee = 0;
  let totalPrice = 0;
  
  if (pricingModel === 'commission') {
    // $9.99 per property + 8% model
    subtotal = 9.99 * propertyCount;
    processingFee = Math.round(subtotal * 0.03 * 100) / 100; // 3% processing fee
    totalPrice = subtotal + processingFee;
  } else {
    // Full price per property model
    subtotal = selectedPlan ? propertyCount * selectedPlan.price : 0;
    processingFee = Math.round(subtotal * 0.03 * 100) / 100; // 3% processing fee
    totalPrice = subtotal + processingFee;
  }

  // Check if all required fields are filled
  const isAccountFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.phoneNumber.trim() !== '' &&
      formData.propertyCount.trim() !== ''
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'propertyCount'
        ? value.replace(/[^0-9]/g, '').slice(0, 3) // Only allow up to 3 digits
        : value
    });
  };

  // Validate property count for commission model
  const isCommissionModelValid = () => {
    if (pricingModel === 'commission') {
      return propertyCount <= 5;
    }
    return true;
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAccountFormValid()) {
      setError('Please fill in all required fields: Name, Email, Password, Phone Number, and Number of Properties');
      return;
    }

    // Check 5 property limit for users without consultation
    if (propertyCount > 5) {
      setError('You can manage up to 5 properties without a consultation. For portfolios with more than 5 properties, please schedule a consultation with our team to discuss your needs.');
      return;
    }

    if (!isCommissionModelValid()) {
      setError('The $9.99 per property + 8% commission option is only available for portfolios with 1-5 properties. Please select a different pricing model or reduce your property count.');
      return;
    }
    
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
          propertyCount: propertyCount
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
          planId: selectedPlan?.name.toLowerCase().replace(/\s+/g, '-'),
          propertyCount: propertyCount,
          pricePerProperty: pricingModel === 'commission' ? 9.99 : selectedPlan?.price,
          pricingModel: pricingModel,
          subtotal: subtotal,
          processingFee: processingFee,
          totalPrice: totalPrice
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
            {/* Admin Only Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-amber-800">
                    For Property Managers & Self-Managing Homeowners
                  </h3>
                  <div className="mt-2 text-sm text-amber-700">
                    <p>
                      This sign-up is for <strong>property management companies, administrators, and homeowners managing their own properties</strong>.
                    </p>
                    <p className="mt-1">
                      If you're a homeowner or client under a management company, please contact your property manager to create your account.
                    </p>
                    <p className="mt-1">
                      <strong>Note:</strong> You can manage up to 5 properties without a consultation. For portfolios with more than 5 properties, please schedule a consultation with our team.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Create Your Account</h1>
              <p className="text-gray-600">Get started with Hostithub property management</p>
            </div>

            <form onSubmit={handleAccountSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Create a strong password"
                    minLength={8}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your company name (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Properties <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="propertyCount"
                    min="1"
                    max="5"
                    value={formData.propertyCount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Enter number of properties"
                  />
                  <p className="text-xs text-amber-600 mt-1">
                    Maximum 5 properties without consultation. For larger portfolios, please schedule a consultation.
                  </p>
                </div>
              </div>

              {/* Plan Selection Display */}
              {selectedPlan && (
                <div className={`border rounded-lg p-6 ${selectedPlan.popular ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                  {selectedPlan.popular && (
                    <div className="text-center mb-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {pricingModel === 'commission' ? 'Commission Model' : selectedPlan.name}
                      </h3>
                                              <p className="text-gray-600">
                          {pricingModel === 'commission' 
                            ? '$9.99/property/month + 8% of rental income (billed monthly)' 
                            : selectedPlan.description}
                        </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {pricingModel === 'commission' ? '$9.99' : `$${selectedPlan.price}`}
                      </div>
                      <div className="text-sm text-gray-600">
                        {pricingModel === 'commission' ? 'per property/month + 8% commission (billed monthly)' : 'per property/month'}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="space-y-2">
                      {pricingModel === 'commission' ? (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Monthly base fee</span>
                          <span className="text-gray-900">$9.99</span>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">
                            {propertyCount} {propertyCount === 1 ? 'property' : 'properties'} × ${selectedPlan.price}
                          </span>
                          <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 flex items-center">
                          Processing Fee (3%)
                          <Info className="w-4 h-4 ml-1 text-blue-500 cursor-help" />
                        </span>
                        <span className="text-gray-900">${processingFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                        <span className="text-lg font-bold text-gray-900">Total:</span>
                        <span className="text-xl font-bold text-gray-900">${totalPrice.toFixed(2)}/month</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    The 3% processing fee covers secure payment processing and card network fees.
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {selectedPlan.features.slice(0, 6).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!isAccountFormValid()}
                className={`w-full py-3 px-6 rounded-lg font-medium ${
                  isAccountFormValid()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
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
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Need to manage more than 5 properties?</strong>{' '}
                    <Link href="/consultation" className="text-blue-600 hover:text-blue-700 font-medium underline">
                      Schedule a consultation
                    </Link>{' '}
                    with our team to discuss your specific needs and get a custom solution.
                  </p>
                </div>
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
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-gray-700 font-medium">{selectedPlan.name}</p>
                      <p className="text-sm text-gray-600">{selectedPlan.propertyRange}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">${totalPrice.toFixed(2)}/month</p>
                      <p className="text-sm text-gray-600">${selectedPlan.price} per property</p>
                    </div>
                  </div>
                  <div className="space-y-1 mb-3">
                    <div className="text-sm text-gray-700 flex justify-between">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-700 flex justify-between">
                      <span className="flex items-center">
                        Processing Fee (3%)
                                                  <Info className="w-4 h-4 ml-1 text-blue-500 cursor-help" />
                      </span>
                      <span>${processingFee.toFixed(2)}</span>
                    </div>
                    <div className="text-sm text-gray-900 font-bold flex justify-between border-t border-gray-200 pt-2">
                      <span>Total:</span>
                      <span>${totalPrice.toFixed(2)}/month</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 font-medium">💳 Billing Schedule</p>
                    <p className="text-sm text-blue-700">
                      • First charge: {new Date().getDate() > 1 ? 
                        `1st of next month (${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()})` : 
                        'Today (pro-rated for this month)'
                      }
                    </p>
                    <p className="text-sm text-blue-700">
                      • Recurring charges: 1st of every month
                    </p>
                    <p className="text-sm text-blue-700">
                      • Automatic billing from your selected payment method
                    </p>
                    <p className="text-sm text-blue-700">
                      • <strong>Dynamic pricing:</strong> Your monthly price will automatically adjust when you add or remove properties
                    </p>
                    <p className="text-sm text-blue-700">
                      • Price changes are prorated and reflected on your next billing cycle
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {isLoading ? 'Creating Account...' : 'Create Account & Start Billing'}
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupPageContent />
    </Suspense>
  );
} 