'use client';

import { useState, useEffect } from 'react';
import { Button } from '@hostit/ui';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { getCopyrightText } from '../../lib/utils';

interface PricingPlan {
  name: string;
  description: string;
  propertyRange: string;
  price: number;
  cta: string;
  popular?: boolean;
  features: string[];
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    description: 'Perfect for small property managers',
    propertyRange: '1-5 properties',
    price: 9.99,
    cta: 'Get Started',
    features: [
      'Smart calendar management',
      'Guest communication hub',
      'Advanced analytics',
      'Task management',
      'Payment processing',
      'Dynamic pricing',
      'Multi-channel sync',
      'Team collaboration',
      'Advanced reporting',
      'Bulk operations',
      'Custom integrations',
      'White-label options',
      'API access',
      'Priority support',
      'Enterprise security',
      '8% of rental income'
    ]
  },
  {
    name: 'Growth',
    description: 'Ideal for single property owners',
    propertyRange: '1 property',
    price: 50,
    cta: 'Get Started',
    features: [
      'Smart calendar management',
      'Guest communication hub',
      'Advanced analytics',
      'Task management',
      'Payment processing',
      'Dynamic pricing',
      'Multi-channel sync',
      'Team collaboration',
      'Advanced reporting',
      'Bulk operations',
      'Custom integrations',
      'White-label options',
      'API access',
      'Priority support',
      'Enterprise security'
    ]
  },
  {
    name: 'Professional',
    description: 'Perfect for small property portfolios',
    propertyRange: '2-5 properties',
    price: 40,
    cta: 'Get Started',
    popular: true,
    features: [
      'Smart calendar management',
      'Guest communication hub',
      'Advanced analytics',
      'Task management',
      'Payment processing',
      'Dynamic pricing',
      'Multi-channel sync',
      'Team collaboration',
      'Advanced reporting',
      'Bulk operations',
      'Custom integrations',
      'White-label options',
      'API access',
      'Priority support',
      'Enterprise security'
    ]
  },
  {
    name: 'Business',
    description: 'For growing property management businesses',
    propertyRange: '6-10 properties',
    price: 35,
    cta: 'Contact Sales',
    features: [
      'Smart calendar management',
      'Guest communication hub',
      'Advanced analytics',
      'Task management',
      'Payment processing',
      'Dynamic pricing',
      'Multi-channel sync',
      'Team collaboration',
      'Advanced reporting',
      'Bulk operations',
      'Custom integrations',
      'White-label options',
      'API access',
      'Priority support',
      'Enterprise security'
    ]
  },
  {
    name: 'Scale',
    description: 'For established property management companies',
    propertyRange: '11-20 properties',
    price: 30,
    cta: 'Contact Sales',
    features: [
      'Smart calendar management',
      'Guest communication hub',
      'Advanced analytics',
      'Task management',
      'Payment processing',
      'Dynamic pricing',
      'Multi-channel sync',
      'Team collaboration',
      'Advanced reporting',
      'Bulk operations',
      'Custom integrations',
      'White-label options',
      'API access',
      'Priority support',
      'Enterprise security'
    ]
  },
  {
    name: 'Enterprise',
    description: 'For large property management operations',
    propertyRange: '21-50 properties',
    price: 25,
    cta: 'Contact Sales',
    features: [
      'Smart calendar management',
      'Guest communication hub',
      'Advanced analytics',
      'Task management',
      'Payment processing',
      'Dynamic pricing',
      'Multi-channel sync',
      'Team collaboration',
      'Advanced reporting',
      'Bulk operations',
      'Custom integrations',
      'White-label options',
      'API access',
      'Priority support',
      'Enterprise security'
    ]
  },
  {
    name: 'Premier',
    description: 'For major property management enterprises',
    propertyRange: '51-150 properties',
    price: 20,
    cta: 'Contact Sales',
    features: [
      'Smart calendar management',
      'Guest communication hub',
      'Advanced analytics',
      'Task management',
      'Payment processing',
      'Dynamic pricing',
      'Multi-channel sync',
      'Team collaboration',
      'Advanced reporting',
      'Bulk operations',
      'Custom integrations',
      'White-label options',
      'API access',
      'Priority support',
      'Enterprise security'
    ]
  },
  {
    name: 'Custom',
    description: 'Custom solutions for large enterprises',
    propertyRange: '150+ properties',
    price: 0,
    cta: 'Contact Sales',
    features: [
      'Smart calendar management',
      'Guest communication hub',
      'Advanced analytics',
      'Task management',
      'Payment processing',
      'Dynamic pricing',
      'Multi-channel sync',
      'Team collaboration',
      'Advanced reporting',
      'Bulk operations',
      'Custom integrations',
      'White-label options',
      'API access',
      'Priority support',
      'Enterprise security',
      'Custom development',
      'Dedicated infrastructure',
      '24/7 dedicated support'
    ]
  }
];

export default function PricingPage() {
  const [propertyCount, setPropertyCount] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('Starter');
  const [calculatedPrice, setCalculatedPrice] = useState(9.99);

  useEffect(() => {
    // Set initial values
    setPropertyCount(1);
    setSelectedPlan('Growth');
    setCalculatedPrice(50);
    
    // Track page view
    trackUserBehavior('page_view', {
      fromPage: 'pricing',
      propertyCount,
      selectedPlan
    });
  }, []);

  const trackUserBehavior = async (action: string, data: any) => {
    try {
      const sessionId = getSessionId();
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          data: {
            ...data,
            sessionId,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
          }
        }),
      });

      if (!response.ok) {
        console.error('Failed to track user behavior');
      }
    } catch (error) {
      console.error('Error tracking user behavior:', error);
    }
  };

  const getSessionId = () => {
    let sessionId = localStorage.getItem('hostithub_session_id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('hostithub_session_id', sessionId);
    }
    return sessionId;
  };

  const calculatePrice = (count: number) => {
    if (count === 1) return 50; // Growth plan: 1 property
    if (count <= 5) return 40; // Professional plan: 2-5 properties
    if (count <= 10) return 35; // Business plan: 6-10 properties
    if (count <= 20) return 30; // Scale plan: 11-20 properties
    if (count <= 50) return 25; // Enterprise plan: 21-50 properties
    if (count <= 150) return 20; // Premier plan: 51-150 properties
    return 0; // Custom pricing for 150+ properties
  };

  const handlePropertyCountChange = (value: string) => {
    const count = parseInt(value) || 0;
    setPropertyCount(count);
    
    if (count > 0) {
      const price = calculatePrice(count);
      setCalculatedPrice(price);
      
      if (count === 1) setSelectedPlan('Growth');
      else if (count <= 5) setSelectedPlan('Professional');
      else if (count <= 10) setSelectedPlan('Business');
      else if (count <= 20) setSelectedPlan('Scale');
      else if (count <= 50) setSelectedPlan('Enterprise');
      else if (count <= 150) setSelectedPlan('Premier');
      else setSelectedPlan('Custom');
    }
  };

  const handleConsultationClick = () => {
    trackUserBehavior('consultation_clicked', {
      fromPage: 'pricing',
      propertyCount,
      selectedPlan
    });
  };

  const handleSignUpClick = () => {
    trackUserBehavior('signup_clicked', {
      fromPage: 'pricing',
      propertyCount,
      selectedPlan
    });
  };

  const totalMonthlyCost = propertyCount * calculatedPrice;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                Hostithub.com
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sign-in" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link href="/signup" className="text-gray-600 hover:text-gray-900">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your vacation rental business. Book a free consultation to discuss your needs and get personalized pricing.
          </p>
          
          {/* Pricing Calculator */}
          <div className="mt-12 max-w-md mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculate Your Price</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Properties
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={propertyCount}
                    onChange={(e) => handlePropertyCountChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter property count"
                  />
                </div>
                
                {propertyCount > 0 && (
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">Your plan:</p>
                    <p className="text-lg font-semibold text-blue-600">{selectedPlan}</p>
                    
                    {selectedPlan === 'Custom' ? (
                      <div className="border-t pt-4">
                        <p className="text-sm text-gray-600">Pricing:</p>
                        <p className="text-2xl font-bold text-blue-600">Contact Us</p>
                        <p className="text-xs text-gray-500">Custom pricing for large portfolios</p>
                      </div>
                    ) : (
                      <>
                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-600">Price per property:</p>
                          <p className="text-2xl font-bold text-blue-600">${calculatedPrice}</p>
                          <p className="text-xs text-gray-500">per month + 3% processing fee</p>
                        </div>
                        
                        {propertyCount > 1 && (
                          <div className="border-t pt-4">
                            <p className="text-sm text-gray-600">Total monthly cost:</p>
                            <p className="text-3xl font-bold text-green-600">${totalMonthlyCost}</p>
                            <p className="text-xs text-gray-500">for {propertyCount} properties + 3% processing fee</p>
                          </div>
                        )}
                      </>
                    )}
                    
                    <div className="pt-4 space-y-3">
                      {(selectedPlan === 'Starter' || selectedPlan === 'Growth' || selectedPlan === 'Professional') && propertyCount <= 5 ? (
                        <>
                          <Button 
                            onClick={() => {
                              handleSignUpClick();
                              window.location.href = '/signup?pricing=full-price';
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Get Started - Full Price
                          </Button>
                          <Button 
                            onClick={() => {
                              handleSignUpClick();
                              window.location.href = '/signup?pricing=commission';
                            }}
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Get Started - $9.99/property + 8%
                          </Button>
                          <Button 
                            onClick={() => {
                              handleConsultationClick();
                              window.location.href = '/consultation';
                            }}
                            variant="outline"
                            className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            Schedule Consultation
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={() => {
                            handleConsultationClick();
                            window.location.href = '/consultation';
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Contact Sales
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                plan.popular
                  ? 'border-blue-500 scale-105'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-gray-600">{plan.description}</p>
                  <p className="mt-1 text-sm text-blue-600 font-medium">{plan.propertyRange}</p>
                  
                  <div className="mt-6">
                    {plan.name === 'Starter' ? (
                      <>
                        <span className="text-4xl font-bold text-gray-900">
                          ${plan.price}
                        </span>
                        <span className="text-gray-600">
                          /month
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          + 8% of rental income (billed monthly)<br/>
                          <span className="text-xs text-blue-600">Only available for 1-5 properties</span>
                        </p>
                      </>
                    ) : plan.name === 'Custom' ? (
                      <>
                        <span className="text-4xl font-bold text-gray-900">
                          Contact Us
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          Custom pricing
                        </p>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-gray-900">
                          ${plan.price}
                        </span>
                        <span className="text-gray-600">
                          /month
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          per property + 3% processing fee
                        </p>
                      </>
                    )}
                  </div>

                  {(plan.name === 'Starter' || plan.name === 'Growth' || plan.name === 'Professional') && 
                   (plan.name === 'Starter' || (plan.name === 'Growth' && plan.propertyRange === '1 property') || (plan.name === 'Professional' && plan.propertyRange === '2-5 properties')) ? (
                    <div className="mt-6 space-y-3">
                      <Button
                        onClick={() => {
                          handleSignUpClick();
                          window.location.href = '/signup?pricing=full-price';
                        }}
                        className={`w-full ${
                          plan.popular
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-900 hover:bg-gray-800 text-white'
                        }`}
                      >
                        Get Started - Full Price
                      </Button>
                      <Button
                        onClick={() => {
                          handleSignUpClick();
                          window.location.href = '/signup?pricing=commission';
                        }}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Get Started - $9.99/property + 8%
                      </Button>
                      <Button
                        onClick={() => {
                          handleConsultationClick();
                          window.location.href = '/consultation';
                        }}
                        variant="outline"
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        Schedule Consultation
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        handleConsultationClick();
                        window.location.href = '/consultation';
                      }}
                      className={`mt-6 w-full ${
                        plan.popular
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      Contact Sales
                    </Button>
                  )}
                </div>

                {/* Features */}
                <div className="mt-8">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <h4 className="text-lg font-semibold text-gray-900">All features included</h4>
                      <svg 
                        className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <ul className="mt-4 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does property-based pricing work?
              </h3>
              <p className="text-gray-600">
                You pay per property based on your total portfolio size. The more properties you have, the lower the per-property rate.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do I get started?
              </h3>
              <p className="text-gray-600">
                Book a free consultation with our sales team to discuss your needs, see a demo, and get personalized pricing for your portfolio.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers. Payment terms are discussed during your consultation.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Absolutely! Cancel your subscription anytime from your account settings with no penalties.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How does the 8% commission billing work?
              </h3>
              <p className="text-gray-600">
                The 8% rental income commission is calculated and billed on the first day of each month based on the previous month's rental activity. This option is only available for portfolios with 1-5 properties.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is my data secure?
              </h3>
              <p className="text-gray-600">
                Yes! We use bank-level encryption and security measures to protect your data.
              </p>
            </div>
          </div>
        </div>

        {/* Large Portfolio Note */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Have more than 150 properties?
            </h3>
            <p className="text-lg text-gray-600 mb-6">
              We offer custom pricing for large property management companies and enterprise clients.
            </p>
            <Button 
              onClick={() => window.location.href = '/consultation'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Contact Sales Team
            </Button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to streamline your vacation rental business?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of successful hosts who trust Hostithub.com to manage their properties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/consultation'}
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg"
              >
                Book Free Consultation
              </Button>
              <Button 
                onClick={() => window.location.href = '/consultation'}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Hostithub.com</h3>
              <p className="text-gray-400">
                The complete vacation rental management platform for modern hosts.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>{getCopyrightText()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 