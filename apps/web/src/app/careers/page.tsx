'use client';

import { useState } from 'react';
import { Upload, MapPin, Clock, Users, TrendingUp, Heart, Zap, Shield } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  whyHostit: string;
  resume: File | null;
  newsletter: boolean;
}

export default function CareersPage() {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    whyHostit: '',
    resume: null,
    newsletter: false
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    setShowApplicationModal(false);
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      experience: '',
      whyHostit: '',
      resume: null,
      newsletter: false
    });
  };

  const openPositions = [
    {
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Join our engineering team to build scalable solutions for vacation rental management.',
      requirements: ['React/Next.js', 'Node.js', 'PostgreSQL', '5+ years experience']
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help our customers succeed and grow their vacation rental businesses.',
      requirements: ['Customer service', 'Property management', 'Communication skills', '2+ years experience']
    },
    {
      title: 'Sales Representative',
      department: 'Sales',
      location: 'Remote',
      type: 'Full-time',
      description: 'Drive growth by acquiring new vacation rental property owners and managers.',
      requirements: ['Sales experience', 'Property management knowledge', 'Communication skills', '1+ years experience']
    }
  ];

  const benefits = [
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Flexible Hours',
      description: 'Work when you\'re most productive with flexible scheduling'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Career Growth',
      description: 'Professional development and advancement opportunities'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Team Culture',
      description: 'Collaborative environment with regular team events'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Remote Work',
      description: 'Work from anywhere with our distributed team'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Job Security',
      description: 'Stable employment with long-term growth potential'
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: '401k Match',
      description: 'Competitive 401k matching program for your future'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Join Our Mission
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Help us revolutionize vacation rental management and create amazing experiences for hosts and guests worldwide.
            </p>
            <button
              onClick={() => setShowApplicationModal(true)}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              View Open Positions
            </button>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Work With Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're building a team of passionate individuals who want to make a difference in the vacation rental industry.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to join our team? Check out our current openings and find the perfect role for you.
            </p>
          </div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {position.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {position.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{position.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {position.requirements.map((req, reqIndex) => (
                        <span key={reqIndex} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <button
                      onClick={() => setShowApplicationModal(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Apply for Position</h2>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position *</label>
                  <select
                    required
                    value={formData.position}
                    onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a position</option>
                    {openPositions.map((pos, index) => (
                      <option key={index} value={pos.title}>{pos.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                  <select
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select experience level</option>
                    <option value="0-1">0-1 years</option>
                    <option value="2-3">2-3 years</option>
                    <option value="4-5">4-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why Hostit? *</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.whyHostit}
                    onChange={(e) => setFormData(prev => ({ ...prev, whyHostit: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us why you'd like to join our team and what excites you about our mission..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV *</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="resume-upload"
                          className="relative cursor-pointer bg-blue-50 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="resume-upload"
                            name="resume-upload"
                            type="file"
                            required
                            className="sr-only"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX, or TXT up to 10MB
                      </p>
                      {formData.resume && (
                        <p className="text-sm text-green-600 font-medium">
                          ✓ {formData.resume.name} selected
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="newsletter"
                    checked={formData.newsletter}
                    onChange={(e) => setFormData(prev => ({ ...prev, newsletter: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
                    Keep me updated about future opportunities at Hostit
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 