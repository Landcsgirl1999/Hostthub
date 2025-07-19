'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  MessageCircle, 
  BookOpen, 
  Video, 
  Phone, 
  Mail, 
  Clock, 
  Star,
  ChevronRight,
  ChevronDown,
  Lightbulb,
  Settings,
  Calendar,
  CreditCard,
  Users,
  Building2,
  FileText,
  Zap,
  Brain,
  Bot
} from 'lucide-react';
import { getCopyrightText } from '../../lib/utils';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
}

interface HelpArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  readTime: number;
  lastUpdated: string;
}

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'all', name: 'All Topics', icon: BookOpen, count: 0 },
    { id: 'getting-started', name: 'Getting Started', icon: Zap, count: 12 },
    { id: 'pricing', name: 'Pricing & Billing', icon: CreditCard, count: 8 },
    { id: 'calendar', name: 'Calendar Management', icon: Calendar, count: 15 },
    { id: 'properties', name: 'Property Management', icon: Building2, count: 20 },
    { id: 'users', name: 'User Management', icon: Users, count: 10 },
    { id: 'tasks', name: 'Task Management', icon: FileText, count: 18 },
    { id: 'ai', name: 'AI Features', icon: Brain, count: 25 }
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How does AI dynamic pricing work?',
      answer: 'Our AI analyzes market data, local events, seasonal trends, and competitor pricing to automatically adjust your rates. It considers factors like demand, weather, holidays, and local attractions to maximize your revenue while staying competitive.',
      category: 'ai',
      tags: ['pricing', 'ai', 'revenue'],
      helpful: 45,
      notHelpful: 2
    },
    {
      id: '2',
      question: 'Can I sync my calendar with multiple platforms?',
              answer: 'Yes! HostItHub automatically syncs with Airbnb, VRBO, Booking.com, and your direct booking platform. Our smart calendar prevents double bookings and updates availability in real-time across all platforms.',
      category: 'calendar',
      tags: ['calendar', 'sync', 'airbnb', 'vrbo'],
      helpful: 38,
      notHelpful: 1
    },
    {
      id: '3',
      question: 'How do I set up automated cleaning schedules?',
      answer: 'Go to the Task Management section, create a new cleaning task, set the frequency (after each guest, weekly, etc.), assign it to your cleaning team, and our AI will automatically schedule it based on your bookings.',
      category: 'tasks',
      tags: ['cleaning', 'automation', 'scheduling'],
      helpful: 52,
      notHelpful: 3
    },
    {
      id: '4',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For enterprise customers, we also offer custom payment terms.',
      category: 'pricing',
      tags: ['payment', 'billing', 'credit-cards'],
      helpful: 29,
      notHelpful: 1
    },
    {
      id: '5',
      question: 'How secure is my guest data?',
      answer: 'We use enterprise-grade encryption and comply with GDPR, CCPA, and other privacy regulations. All data is encrypted in transit and at rest, and we never share your guest information with third parties.',
      category: 'getting-started',
      tags: ['security', 'privacy', 'gdpr'],
      helpful: 41,
      notHelpful: 0
    }
  ];

  const helpArticles: HelpArticle[] = [
    {
      id: '1',
      title: 'Complete Setup Guide: From Zero to First Booking',
              content: 'Step-by-step guide to setting up your HostItHub account, adding properties, configuring pricing, and getting your first booking.',
      category: 'getting-started',
      tags: ['setup', 'onboarding', 'first-booking'],
      readTime: 8,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      title: 'AI Dynamic Pricing: Advanced Configuration',
      content: 'Learn how to fine-tune your AI pricing strategy, set minimum and maximum rates, and understand the factors that influence pricing decisions.',
      category: 'ai',
      tags: ['ai-pricing', 'configuration', 'advanced'],
      readTime: 12,
      lastUpdated: '2024-01-10'
    },
    {
      id: '3',
      title: 'Multi-Platform Calendar Sync: Best Practices',
      content: 'How to effectively manage your calendar across multiple booking platforms, prevent conflicts, and maintain consistency.',
      category: 'calendar',
      tags: ['calendar-sync', 'multi-platform', 'best-practices'],
      readTime: 10,
      lastUpdated: '2024-01-08'
    }
  ];

  const filteredFAQs = faqs.filter(faq => 
    (selectedCategory === 'all' || faq.category === selectedCategory) &&
    (searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleAIChat = async (question: string) => {
    setIsLoading(true);
    try {
      // Simulate AI response (in production, this would call your AI service)
      const responses = [
        `Based on your question about "${question}", here's what I can help you with...`,
        `Great question! Let me provide you with the most relevant information about "${question}"...`,
        `I understand you're asking about "${question}". Here's a comprehensive answer...`
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setAiResponse(randomResponse);
    } catch (error) {
      setAiResponse('Sorry, I encountered an error. Please try again or contact our support team.');
    } finally {
      setIsLoading(false);
    }
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
                <h1 className="text-2xl font-bold text-gray-900">HostItHub.com</h1>
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
                href="/sign-in"
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium hover:shadow-glow transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium mb-6">
            <Bot className="w-4 h-4 mr-2" />
            AI-Powered Help Center
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How can we help you today?
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get instant answers from our AI assistant, browse helpful articles, or connect with our support team.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles, FAQs, or ask a question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:shadow-glow transition-all duration-200"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Ask AI Assistant</span>
            </button>
            <Link
              href="/demo"
              className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all duration-200"
            >
              <Video className="w-5 h-5" />
              <span>Watch Demo</span>
            </Link>
            <Link
              href="/consultation"
              className="flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-all duration-200"
            >
              <Phone className="w-5 h-5" />
              <span>Book Consultation</span>
            </Link>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'border-blue-500 bg-blue-50 shadow-glow'
                    : 'border-gray-200 bg-white/80 backdrop-blur-sm hover:border-blue-300 hover:shadow-soft'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} articles</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* AI Chat Modal */}
        {isAIChatOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                      <p className="text-sm text-gray-500">Ask me anything about HostItHub</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAIChatOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6 max-h-96 overflow-y-auto">
                {aiResponse ? (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-800">{aiResponse}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">Hi! I'm your AI assistant. How can I help you today?</p>
                    <div className="space-y-2">
                      {[
                        "How do I set up dynamic pricing?",
                        "Can I sync with Airbnb?",
                        "How does the AI task manager work?",
                        "What payment methods do you accept?"
                      ].map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleAIChat(question)}
                          className="block w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {isLoading && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span>AI is thinking...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 mb-4">{faq.answer}</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-600">
                      <span>👍</span>
                      <span>{faq.helpful}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-600">
                      <span>👎</span>
                      <span>{faq.notHelpful}</span>
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    {faq.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Help Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Helpful Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpArticles.map((article) => (
              <Link
                key={article.id}
                href={`/help/${article.id}`}
                className="block bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 hover:shadow-soft transition-all duration-200 hover:border-blue-300"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-500">{article.readTime} min read</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">{article.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{article.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Our support team is here to help you succeed. Get in touch and we'll get back to you within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/consultation"
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-full font-medium hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Book a Consultation</span>
            </Link>
            <Link
              href="mailto:support@hostithub.com"
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-white text-white rounded-full font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email Support</span>
            </Link>
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
                <span className="text-xl font-bold text-gray-900">HostItHub</span>
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
                <li><Link href="mailto:support@hostithub.com" className="hover:text-blue-600">Email Support</Link></li>
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