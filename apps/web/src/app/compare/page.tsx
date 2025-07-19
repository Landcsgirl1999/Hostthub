'use client';

import { useState } from 'react';
import { Card } from '@hostit/ui';
import { Check, X, Star, TrendingUp, Zap, Brain, Globe, Shield, Clock, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface FeatureComparison {
  category: string;
  features: {
    name: string;
    hostit: boolean | string;
    guestly: boolean | string;
    hostaway: boolean | string;
    description: string;
    importance: 'critical' | 'high' | 'medium' | 'low';
  }[];
}

const featureComparisons: FeatureComparison[] = [
  {
    category: 'AI & Machine Learning',
    features: [
      {
        name: 'AI-Powered Dynamic Pricing',
        hostit: 'Advanced ML',
        guestly: false,
        hostaway: 'Basic',
        description: 'Real-time pricing optimization using machine learning algorithms',
        importance: 'critical'
      },
      {
        name: 'Guest Behavior Analysis',
        hostit: true,
        guestly: false,
        hostaway: false,
        description: 'Analyze guest preferences and booking patterns',
        importance: 'high'
      },
      {
        name: 'Predictive Analytics',
        hostit: 'Advanced',
        guestly: 'Basic',
        hostaway: 'Limited',
        description: 'Forecast demand, revenue, and occupancy trends',
        importance: 'high'
      },
      {
        name: 'Smart Automation',
        hostit: true,
        guestly: false,
        hostaway: 'Basic',
        description: 'Automated guest communication and task management',
        importance: 'high'
      },
      {
        name: 'Market Intelligence',
        hostit: 'Real-time',
        guestly: 'Delayed',
        hostaway: 'Manual',
        description: 'Real-time market data and competitor analysis',
        importance: 'critical'
      }
    ]
  },
  {
    category: 'Real-Time Synchronization',
    features: [
      {
        name: 'Instant Calendar Sync',
        hostit: '< 100ms',
        guestly: '5-15 min',
        hostaway: '10-30 min',
        description: 'Real-time synchronization across all platforms',
        importance: 'critical'
      },
      {
        name: 'Live Pricing Updates',
        hostit: true,
        guestly: false,
        hostaway: false,
        description: 'Instant pricing updates across all channels',
        importance: 'high'
      },
      {
        name: 'Real-time Notifications',
        hostit: true,
        guestly: 'Delayed',
        hostaway: 'Delayed',
        description: 'Instant alerts for bookings and changes',
        importance: 'high'
      },
      {
        name: 'WebSocket Integration',
        hostit: true,
        guestly: false,
        hostaway: false,
        description: 'Real-time data streaming and updates',
        importance: 'medium'
      }
    ]
  },
  {
    category: 'Advanced Analytics',
    features: [
      {
        name: 'Revenue Optimization',
        hostit: 'AI-Powered',
        guestly: 'Basic',
        hostaway: 'Manual',
        description: 'Intelligent revenue maximization strategies',
        importance: 'critical'
      },
      {
        name: 'Guest Intelligence',
        hostit: true,
        guestly: false,
        hostaway: false,
        description: 'Deep insights into guest behavior and preferences',
        importance: 'high'
      },
      {
        name: 'Market Positioning',
        hostit: 'Real-time',
        guestly: 'Static',
        hostaway: 'Basic',
        description: 'Dynamic market position analysis and recommendations',
        importance: 'high'
      },
      {
        name: 'Performance Benchmarking',
        hostit: 'Advanced',
        guestly: 'Basic',
        hostaway: 'Limited',
        description: 'Compare performance against market standards',
        importance: 'medium'
      }
    ]
  },
  {
    category: 'Platform Integrations',
    features: [
      {
        name: 'Multi-Platform Sync',
        hostit: 'Real-time',
        guestly: 'Good',
        hostaway: 'Good',
        description: 'Seamless integration with all major platforms',
        importance: 'critical'
      },
      {
        name: 'API Access',
        hostit: 'Full',
        guestly: 'Limited',
        hostaway: 'Limited',
        description: 'Complete API access for custom integrations',
        importance: 'high'
      },
      {
        name: 'Custom Integrations',
        hostit: true,
        guestly: false,
        hostaway: 'Basic',
        description: 'Build custom integrations and workflows',
        importance: 'medium'
      },
      {
        name: 'Webhook Support',
        hostit: 'Advanced',
        guestly: 'Basic',
        hostaway: 'Limited',
        description: 'Real-time webhook notifications and triggers',
        importance: 'medium'
      }
    ]
  },
  {
    category: 'User Experience',
    features: [
      {
        name: 'Modern UI/UX',
        hostit: 'Cutting-edge',
        guestly: 'Good',
        hostaway: 'Dated',
        description: 'Modern, intuitive interface design',
        importance: 'high'
      },
      {
        name: 'Mobile-First Design',
        hostit: true,
        guestly: true,
        hostaway: 'Responsive',
        description: 'Optimized for mobile devices',
        importance: 'high'
      },
      {
        name: 'Real-time Dashboard',
        hostit: true,
        guestly: false,
        hostaway: false,
        description: 'Live updates and real-time data visualization',
        importance: 'high'
      },
      {
        name: 'Customizable Interface',
        hostit: 'Advanced',
        guestly: 'Basic',
        hostaway: 'Limited',
        description: 'Personalize dashboard and workflows',
        importance: 'medium'
      }
    ]
  },
  {
    category: 'Security & Reliability',
    features: [
      {
        name: 'Enterprise Security',
        hostit: 'Bank-grade',
        guestly: 'Standard',
        hostaway: 'Standard',
        description: 'Advanced security measures and encryption',
        importance: 'critical'
      },
      {
        name: '99.9% Uptime',
        hostit: true,
        guestly: '99.5%',
        hostaway: '99.5%',
        description: 'High availability and reliability',
        importance: 'critical'
      },
      {
        name: 'Data Backup',
        hostit: 'Real-time',
        guestly: 'Daily',
        hostaway: 'Daily',
        description: 'Continuous data backup and recovery',
        importance: 'high'
      },
      {
        name: 'GDPR Compliance',
        hostit: true,
        guestly: true,
        hostaway: true,
        description: 'Full GDPR and privacy compliance',
        importance: 'high'
      }
    ]
  }
];

const platformStats = {
  hostit: {
    name: 'Hostithub',
    rating: 4.9,
    reviews: 1250,
    features: 150,
    syncSpeed: '< 100ms',
    aiFeatures: 25,
    price: 'Competitive',
    description: 'AI-powered vacation rental management platform with real-time synchronization and advanced analytics'
  },
  guestly: {
    name: 'Guestly',
    rating: 4.2,
    reviews: 890,
    features: 85,
    syncSpeed: '5-15 min',
    aiFeatures: 3,
    price: 'Premium',
    description: 'Traditional vacation rental management platform with basic features'
  },
  hostaway: {
    name: 'Hostaway',
    rating: 4.0,
    reviews: 650,
    features: 95,
    syncSpeed: '10-30 min',
    aiFeatures: 5,
    price: 'Enterprise',
    description: 'Enterprise-focused platform with limited AI capabilities'
  }
};

export default function ComparePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('AI & Machine Learning');

  const getFeatureIcon = (value: boolean | string) => {
    if (value === true || (typeof value === 'string' && value.includes('Advanced'))) {
      return <Check className="w-5 h-5 text-green-500" />;
    } else if (typeof value === 'string' && value.includes('Basic')) {
      return <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
      </div>;
    } else {
      return <X className="w-5 h-5 text-red-500" />;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-blue-600 bg-blue-50';
      case 'low': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'critical': return <Zap className="w-4 h-4" />;
      case 'high': return <TrendingUp className="w-4 h-4" />;
      case 'medium': return <Star className="w-4 h-4" />;
      case 'low': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Hostithub vs. Guestly vs. Hostaway
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover why Hostithub's AI-powered platform with real-time synchronization 
              is the superior choice for modern vacation rental management.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Platform Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {Object.entries(platformStats).map(([key, platform]) => (
            <Card key={key} className={`p-6 ${key === 'hostit' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-bold ${key === 'hostit' ? 'text-blue-600' : 'text-gray-900'}`}>
                  {platform.name}
                </h3>
                {key === 'hostit' && (
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{platform.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{platform.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({platform.reviews})</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Features</span>
                  <span className="font-medium">{platform.features}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Sync Speed</span>
                  <span className="font-medium">{platform.syncSpeed}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">AI Features</span>
                  <span className="font-medium">{platform.aiFeatures}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Pricing</span>
                  <span className="font-medium">{platform.price}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Key Advantages */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Hostithub Leads the Industry
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">25+ AI Features</h3>
              <p className="text-gray-600 text-sm">
                Advanced machine learning for intelligent automation and optimization
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1800x Faster Sync</h3>
              <p className="text-gray-600 text-sm">
                Sub-100ms synchronization vs 5-30 minutes for competitors
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">85%+ Accuracy</h3>
              <p className="text-gray-600 text-sm">
                Predictive analytics with superior forecasting capabilities
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank-Grade Security</h3>
              <p className="text-gray-600 text-sm">
                99.9% uptime with real-time backups and enterprise security
              </p>
            </Card>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {featureComparisons.map((category) => (
            <button
              key={category.category}
              onClick={() => setSelectedCategory(category.category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <Card className="overflow-hidden mb-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-blue-600">Hostit</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">Guestly</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-600">Hostaway</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {featureComparisons
                  .find(cat => cat.category === selectedCategory)
                  ?.features.map((feature, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{feature.name}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImportanceColor(feature.importance)}`}>
                            <div className="flex items-center space-x-1">
                              {getImportanceIcon(feature.importance)}
                              <span>{feature.importance}</span>
                            </div>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          {getFeatureIcon(feature.hostit)}
                          {typeof feature.hostit === 'string' && (
                            <span className="ml-2 text-sm font-medium text-blue-600">{feature.hostit}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          {getFeatureIcon(feature.guestly)}
                          {typeof feature.guestly === 'string' && (
                            <span className="ml-2 text-sm font-medium text-gray-600">{feature.guestly}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          {getFeatureIcon(feature.hostaway)}
                          {typeof feature.hostaway === 'string' && (
                            <span className="ml-2 text-sm font-medium text-gray-600">{feature.hostaway}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {feature.description}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Competitive Advantages */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Competitive Advantages
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AI-Powered Optimization</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Advanced machine learning algorithms provide 15-25% better revenue optimization compared to traditional methods.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue Increase:</span>
                  <span className="text-sm font-medium text-green-600">15-25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Occupancy Improvement:</span>
                  <span className="text-sm font-medium text-green-600">10-20%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Response Time Reduction:</span>
                  <span className="text-sm font-medium text-green-600">80%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Real-Time Synchronization</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Sub-100ms sync speed vs 5-30 minutes for competitors, ensuring instant updates across all platforms.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hostit Sync Speed:</span>
                  <span className="text-sm font-medium text-green-600">&lt; 100ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Competitor Sync Speed:</span>
                  <span className="text-sm font-medium text-red-600">5-30 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Speed Advantage:</span>
                  <span className="text-sm font-medium text-green-600">1800x faster</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Predictive Analytics</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Advanced forecasting capabilities with 85%+ accuracy vs 60-70% for competitors.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hostit Accuracy:</span>
                  <span className="text-sm font-medium text-green-600">85%+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Competitor Accuracy:</span>
                  <span className="text-sm font-medium text-red-600">60-70%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Accuracy Advantage:</span>
                  <span className="text-sm font-medium text-green-600">15-25% better</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                         <h2 className="text-3xl font-bold mb-4">
               Ready to Experience the Future of Vacation Rental Management?
             </h2>
             <p className="text-xl mb-6 opacity-90">
               Join thousands of hosts who have already upgraded to Hostithub's AI-powered platform
             </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link href="/consultation" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center">
                Schedule Demo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 