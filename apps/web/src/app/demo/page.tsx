'use client';

import { useState } from 'react';
import { 
  Home, 
  Calendar, 
  DollarSign, 
  Settings, 
  BarChart3, 
  MessageSquare,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';
import { getCopyrightText } from '../../lib/utils';

interface DemoStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  duration: number;
}

export default function DemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullDemo, setShowFullDemo] = useState(false);

  const demoSteps: DemoStep[] = [
    {
      id: 'dashboard',
      title: 'Dashboard Overview',
      description: 'Get a bird\'s eye view of your entire portfolio',
      icon: <Home className="w-6 h-6" />,
      duration: 30,
      content: (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">$12,450</div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-gray-600">Occupancy</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">24</div>
              <div className="text-sm text-gray-600">Active Bookings</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">4.9★</div>
              <div className="text-sm text-gray-600">Guest Rating</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Beach House #1</span>
              <span className="text-green-600">✓ Checked In</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Mountain Cabin</span>
              <span className="text-blue-600">🔄 Cleaning</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">City Apartment</span>
              <span className="text-purple-600">📅 Available</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'calendar',
      title: 'Smart Calendar Sync',
      description: 'Never double-book again with intelligent calendar management',
      icon: <Calendar className="w-6 h-6" />,
      duration: 25,
      content: (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Multi-Platform Calendar</h3>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => {
              const day = i + 1;
              const isBooked = [5, 6, 7, 12, 13, 14, 19, 20, 21].includes(day);
              const isToday = day === 15;
              return (
                <div
                  key={day}
                  className={`p-2 text-center text-sm rounded ${
                    isToday ? 'bg-blue-500 text-white' :
                    isBooked ? 'bg-red-100 text-red-700' :
                    'hover:bg-gray-50'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Booked (Airbnb, VRBO, Direct)</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              <span>Available</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'pricing',
      title: 'AI Dynamic Pricing',
      description: 'Maximize revenue with intelligent pricing algorithms',
      icon: <DollarSign className="w-6 h-6" />,
      duration: 35,
      content: (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Dynamic Pricing Analysis</h3>
            <div className="flex items-center space-x-2 text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">+23% Revenue</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium">Weekend Rate</div>
                <div className="text-sm text-gray-600">High demand detected</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">$450</div>
                <div className="text-sm text-green-600">+$75</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium">Weekday Rate</div>
                <div className="text-sm text-gray-600">Standard pricing</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-gray-600">$350</div>
                <div className="text-sm text-gray-500">Base rate</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <div className="font-medium">Holiday Rate</div>
                <div className="text-sm text-gray-600">Peak season pricing</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-orange-600">$550</div>
                <div className="text-sm text-green-600">+$175</div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">AI detected 15% demand increase - prices automatically adjusted</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'tasks',
      title: 'Automated Task Management',
      description: 'Streamline operations with intelligent task automation',
      icon: <Settings className="w-6 h-6" />,
      duration: 30,
      content: (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Today's Tasks</h3>
            <div className="text-sm text-gray-600">8 of 12 completed</div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <div className="font-medium">Guest Check-in: Beach House #1</div>
                <div className="text-sm text-gray-600">Completed by Sarah • 2:30 PM</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium">Deep Clean: Mountain Cabin</div>
                <div className="text-sm text-gray-600">In progress • Mike Chen</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
              <div className="flex-1">
                <div className="font-medium">HVAC Maintenance: City Apartment</div>
                <div className="text-sm text-gray-600">Scheduled • Tomorrow 10 AM</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <div className="font-medium text-gray-500">Guest Check-out: Ocean Villa</div>
                <div className="text-sm text-gray-500">Pending • Friday 11 AM</div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 text-purple-700">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">3 tasks auto-assigned based on team availability</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Make data-driven decisions with comprehensive insights',
      icon: <BarChart3 className="w-6 h-6" />,
      duration: 25,
      content: (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Performance Analytics</h3>
            <div className="text-sm text-gray-600">Last 30 days</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$45,230</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-xs text-green-600">+12% vs last month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">92%</div>
              <div className="text-sm text-gray-600">Occupancy Rate</div>
              <div className="text-xs text-blue-600">+5% vs last month</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Airbnb</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <span className="text-sm font-medium">65%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">VRBO</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm font-medium">25%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Direct</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <span className="text-sm font-medium">10%</span>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-700">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Direct bookings increased 40% this month</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'communication',
      title: 'Guest Communication',
      description: 'Delight guests with automated, personalized messaging',
      icon: <MessageSquare className="w-6 h-6" />,
      duration: 20,
      content: (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Smart Messaging</h3>
            <div className="text-sm text-green-600">98% response rate</div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                G
              </div>
              <div className="flex-1">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm">Hi! We're excited for our stay tomorrow. What time is check-in?</p>
                  <p className="text-xs text-gray-500 mt-1">2:15 PM</p>
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-3 justify-end">
              <div className="flex-1">
                <div className="bg-green-50 p-3 rounded-lg text-right">
                  <p className="text-sm">Welcome! Check-in is at 3 PM. I'll send you the door code 30 minutes before arrival. Looking forward to hosting you! 🏠</p>
                  <p className="text-xs text-gray-500 mt-1">2:16 PM • Auto-reply</p>
                </div>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                H
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                G
              </div>
              <div className="flex-1">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm">Perfect! Thank you so much 😊</p>
                  <p className="text-xs text-gray-500 mt-1">2:17 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 text-purple-700">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Auto-reply sent • Guest satisfaction score: 5/5</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsPlaying(false);
      setShowFullDemo(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = demoSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Interactive Demo</h1>
              <p className="text-gray-600 mt-1">Experience Hostithub in action</p>
            </div>
            <div className="flex items-center space-x-4">
              {!isPlaying && !showFullDemo && (
                <button
                  onClick={startDemo}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Start Demo
                </button>
              )}
              {showFullDemo && (
                <button
                  onClick={() => setShowFullDemo(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close Demo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isPlaying && !showFullDemo ? (
          // Demo Overview
          <div className="text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                See Hostithub in Action
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Watch how our platform transforms property management with intelligent automation, 
                real-time insights, and seamless guest experiences.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {demoSteps.map((step, index) => (
                  <div key={step.id} className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                    <div className="text-xs text-gray-500 mt-2">{step.duration}s</div>
                  </div>
                ))}
              </div>
              <button
                onClick={startDemo}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Start Interactive Demo
              </button>
            </div>
          </div>
        ) : showFullDemo ? (
          // Full Demo View
          <div className="space-y-8">
            {demoSteps.map((step, index) => (
              <div key={step.id} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                {step.content}
              </div>
            ))}
          </div>
        ) : (
          // Interactive Demo
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Demo Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {currentStepData.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{currentStepData.title}</h3>
                      <p className="text-sm text-gray-600">{currentStepData.description}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Step {currentStep + 1} of {demoSteps.length}
                  </div>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-6">
                {currentStepData.content}
              </div>

              {/* Demo Navigation */}
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="flex space-x-2">
                    {demoSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={nextStep}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {currentStep === demoSteps.length - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">{getCopyrightText()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 