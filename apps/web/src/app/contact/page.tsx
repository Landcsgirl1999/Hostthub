'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Send,
  Calendar,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { getCopyrightText } from '../../lib/utils';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md border-b border-white/20 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Hostithub.com</h1>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/pricing" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Pricing
              </Link>
              <Link href="/demo" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Demo
              </Link>
              <Link href="/consultation" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Consultation
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link
                href="/help"
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Help Center
              </Link>
              <Link
                href="/sign-in"
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help you succeed with your vacation rental business. 
            Send emails anytime, call during business hours, or get instant help from our AI assistant.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                    <p className="text-gray-600 mb-3">
                      Send emails anytime - we'll respond within 24 hours
                    </p>
                    <a 
                      href="mailto:support@hostithub.com" 
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      support@hostithub.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
                    <p className="text-gray-600 mb-3">
                      Speak directly with our support team during business hours
                    </p>
                    <a 
                      href="tel:1-800-HOSTITHUB" 
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      1-800-HOSTITHUB
                    </a>
                  </div>
                </div>

                {/* Consultation */}
                <div className="flex items-start space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Free Consultation</h3>
                    <p className="text-gray-600 mb-3">
                      Schedule a personalized consultation to discuss your specific needs
                    </p>
                    <Link 
                      href="/consultation" 
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <span>Book Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Live Support Hours</h3>
                    <p className="text-gray-600 mb-2">
                      <strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Saturday:</strong> 10:00 AM - 4:00 PM EST
                    </p>
                    <p className="text-gray-600 mb-3">
                      <strong>Sunday:</strong> Closed
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      🤖 AI Support available 24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
              <h3 className="font-semibold text-xl mb-4">Quick Links</h3>
              <div className="space-y-3">
                <Link href="/help" className="flex items-center space-x-2 hover:text-blue-100 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Help Center</span>
                </Link>
                <Link href="/demo" className="flex items-center space-x-2 hover:text-blue-100 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                  <span>Request Demo</span>
                </Link>
                <Link href="/pricing" className="flex items-center space-x-2 hover:text-blue-100 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                  <span>View Pricing</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general-inquiry">General Inquiry</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="billing-question">Billing Question</option>
                    <option value="feature-request">Feature Request</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">How quickly do you respond?</h3>
              <p className="text-gray-600">
                Our AI assistant is available 24/7 for instant help. For live support, we respond within 24 hours during business days. 
                For urgent technical issues, we prioritize responses and aim to get back to you within 4 hours.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Do you offer phone support?</h3>
              <p className="text-gray-600">
                Yes! We offer phone support during business hours. You can reach us at 1-800-HOSTITHUB 
                Monday through Friday, 9 AM to 6 PM EST.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Can I schedule a demo?</h3>
              <p className="text-gray-600">
                Absolutely! We offer personalized demos to show you how Hostithub can work for your specific needs. 
                Schedule a free consultation to get started.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What if I need emergency support?</h3>
              <p className="text-gray-600">
                For critical issues affecting your business, we provide emergency support. 
                Contact us immediately and we'll prioritize your case.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Is AI support available after hours?</h3>
              <p className="text-gray-600">
                Yes! Our AI assistant is available 24/7 to help with common questions, troubleshooting, 
                and basic support. For complex issues requiring human assistance, we'll follow up during business hours.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Hostit</span>
              </div>
              <p className="text-gray-600 text-sm">
                The complete AI platform for vacation rental success.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/pricing" className="hover:text-blue-600">Pricing</Link></li>
                <li><Link href="/demo" className="hover:text-blue-600">Demo</Link></li>
                <li><Link href="/help" className="hover:text-blue-600">Help Center</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/consultation" className="hover:text-blue-600">Consultation</Link></li>
                <li><Link href="mailto:support@hostit.com" className="hover:text-blue-600">Email Support</Link></li>
                <li><Link href="/help" className="hover:text-blue-600">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
                <li><Link href="/privacy" className="hover:text-blue-600">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-600">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>{getCopyrightText()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 