'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Home, 
  Users, 
  Zap, 
  Star, 
  Award,
  ArrowRight,
  Calendar,
  DollarSign,
  Shield,
  Bot,
  Coffee
} from 'lucide-react';
import { getCopyrightText } from '../../lib/utils';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('story');

  const stats = [
    { icon: Home, value: '50+', label: 'Properties Managed' },
    { icon: Users, value: '1000+', label: 'Happy Guests' },
    { icon: Star, value: '4.9', label: 'Average Rating' },
    { icon: Calendar, value: '95%', label: 'Occupancy Rate' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Family First',
                  description: 'We understand the challenges of balancing family life with running a business. That\'s why we built Hostithub to make property management easier, not harder.'
    },
    {
      icon: Zap,
      title: 'Simplicity',
      description: 'No more paying for integrations that should be included. Everything you need is built right into the platform from day one.'
    },
    {
      icon: Shield,
      title: 'Trust & Reliability',
      description: 'We\'re property managers ourselves, so we know what you need. Our platform is built by hosts, for hosts.'
    },
    {
      icon: Bot,
      title: 'AI-Powered',
      description: 'Our AI assistant is like having an extra team member who never sleeps, helping you manage your properties more efficiently.'
    }
  ];

  const team = [
    {
      name: 'Sierra Reynolds',
      role: 'Founder & CEO',
      bio: 'Mom of two boys, property management expert, and passionate about making hosting easier for everyone. When I\'m not managing properties or coding, you\'ll find me chasing my kids around Southern Vermont.',
      funFact: 'Can make a mean cup of coffee and fix a leaky faucet at the same time!'
    },
    {
      name: 'Jacob Hastings',
      role: 'Co-Founder & CTO',
              bio: 'Father of our two amazing boys and the technical genius behind Hostithub. When he\'s not coding or managing properties, you\'ll find him building something in the garage or teaching the kids about technology.',
      funFact: 'Can debug code while changing diapers - multitasking at its finest!'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4 mr-2" />
            Built by Property Managers, for Property Managers
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Meet the Team Behind Hostithub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're not just another software company. We're property managers who got tired of 
            paying for features that should be included. So we built something better.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20">
                <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 p-1">
            <button
              onClick={() => setActiveTab('story')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'story'
                  ? 'bg-blue-600 text-white shadow-glow'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Our Story
            </button>
            <button
              onClick={() => setActiveTab('values')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'values'
                  ? 'bg-blue-600 text-white shadow-glow'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Our Values
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'team'
                  ? 'bg-blue-600 text-white shadow-glow'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Meet the Team
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-16">
          {activeTab === 'story' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8 mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">How It All Started</h2>
                <div className="prose prose-lg max-w-none">
                                     <p className="text-gray-600 mb-6">
                     Hi, I'm <strong>Sierra Reynolds</strong> - mom of two amazing boys, owner of Reynolds Pro Management LLC, 
                     and founder of Hostithub.com. Alongside my partner <strong>Jacob Hastings</strong>, father of our two boys, 
                     we're building something special. Our life is pretty much what you'd expect from parents running a vacation rental 
                     business in Southern Vermont: chaotic, rewarding, and always interesting!
                   </p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">The Problem We Solved</h3>
                    <p className="text-gray-700">
                      Like many of you, we were frustrated with property management software that nickel-and-dimed us 
                      for every feature. Want calendar sync? That'll be extra. Need dynamic pricing? Another fee. 
                      Guest communication tools? You guessed it - more money.
                    </p>
                  </div>

                                     <p className="text-gray-600 mb-6">
                     One day, after the umpteenth time paying for an "integration" that should have been included, 
                     we had enough. We were juggling property management, raising two boys, and dealing with software 
                     that made our lives harder instead of easier.
                   </p>

                                     <p className="text-gray-600 mb-6">
                     That's when the idea for Hostithub was born. What if we built a platform that included everything 
                     property managers actually need, right from the start? No hidden fees, no surprise charges, 
                     just one comprehensive solution that actually works. Jacob, being the tech wizard he is, 
                     dove into the coding while I focused on the business side and property management expertise.
                   </p>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Our AI Friend</h3>
                    <p className="text-gray-700">
                      We also wanted to make hosting more convenient for everyone. That's why we built our AI assistant 
                      - think of it as your virtual property management partner who never sleeps, never complains, 
                      and always has your back.
                    </p>
                  </div>

                  <p className="text-gray-600">
                    Today, Hostithub is helping property managers across the country focus on what they love - hosting 
                    amazing guests and building their businesses - instead of fighting with software. We're still 
                    a small team, we still love what we do, and we're still committed to making hosting convenient 
                    for everyone.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Join the Revolution?</h3>
                <p className="text-gray-600 mb-6">
                  Stop paying for features that should be included. Start managing your properties the smart way.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/demo"
                    className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                  >
                    <span>See Hostithub in Action</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/consultation"
                    className="inline-flex items-center space-x-2 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
                  >
                    <span>Book a Free Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'values' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'team' && (
            <div className="max-w-4xl mx-auto">
              {team.map((member, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 p-8">
                  <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                    <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                      SR
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                      <p className="text-blue-600 font-semibold mb-4">{member.role}</p>
                      <p className="text-gray-600 mb-4">{member.bio}</p>
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                        <p className="text-gray-700 font-medium">
                          <Coffee className="w-4 h-4 inline mr-2" />
                          Fun Fact: {member.funFact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Why Choose Hostit */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Choose Hostithub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Hidden Fees</h3>
              <p className="text-blue-100">
                Everything you need is included. No surprise charges, no nickel-and-diming.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-blue-100">
                Our AI assistant helps you manage properties more efficiently, 24/7.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Built by Hosts</h3>
              <p className="text-blue-100">
                We understand your challenges because we face them too.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Connect</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Have questions about Hostithub? Want to share your property management story? 
            We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/help"
              className="inline-flex items-center space-x-2 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-600 hover:text-white transition-all duration-200"
            >
              <span>Visit Help Center</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
} 