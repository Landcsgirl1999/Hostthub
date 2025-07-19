import React from 'react';
import { Shield, Lock, Eye, Users, Database, Mail, Phone, MapPin } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="h-6 w-6 text-blue-600 mr-3" />
              Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              HostIt ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our property management platform and related services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Database className="h-6 w-6 text-blue-600 mr-3" />
              Information We Collect
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Name, email address, and phone number</li>
                  <li>Property addresses and details</li>
                  <li>Payment and billing information</li>
                  <li>Account credentials and preferences</li>
                  <li>Communication history and support tickets</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Usage Information</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent</li>
                  <li>Features used and interactions</li>
                  <li>Error logs and performance data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Property Data</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Property listings and descriptions</li>
                  <li>Pricing information and availability</li>
                  <li>Booking and reservation data</li>
                  <li>Guest information and reviews</li>
                  <li>Maintenance and task records</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Eye className="h-6 w-6 text-blue-600 mr-3" />
              How We Use Your Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Service Provision</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Process bookings and reservations</li>
                  <li>• Manage property listings</li>
                  <li>• Handle payments and billing</li>
                  <li>• Provide customer support</li>
                  <li>• Send important notifications</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Improvement & Analytics</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Analyze usage patterns</li>
                  <li>• Improve our services</li>
                  <li>• Develop new features</li>
                  <li>• Personalize user experience</li>
                  <li>• Ensure platform security</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="h-6 w-6 text-blue-600 mr-3" />
              Information Sharing
            </h2>
            
            <div className="bg-yellow-50 p-6 rounded-lg mb-6">
              <p className="text-gray-700 font-medium">
                We do not sell, trade, or rent your personal information to third parties for marketing purposes.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Service Providers</h3>
                <p className="text-gray-700">
                  We may share information with trusted third-party service providers who assist us in operating our platform, such as payment processors, hosting providers, and analytics services.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Legal Requirements</h3>
                <p className="text-gray-700">
                  We may disclose information when required by law, court order, or government request, or to protect our rights, property, or safety.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Business Transfers</h3>
                <p className="text-gray-700">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              Data Security
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Security Measures</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>Secure data centers and infrastructure</li>
                  <li>Regular security audits and updates</li>
                  <li>Access controls and authentication</li>
                  <li>Data backup and recovery procedures</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Your Responsibilities</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Keep your account credentials secure</li>
                  <li>Use strong, unique passwords</li>
                  <li>Enable two-factor authentication</li>
                  <li>Log out from shared devices</li>
                  <li>Report suspicious activity immediately</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Privacy Rights</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Access & Control</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Access your personal information</li>
                  <li>• Update or correct your data</li>
                  <li>• Delete your account and data</li>
                  <li>• Export your data</li>
                  <li>• Opt-out of marketing communications</li>
                </ul>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Cookies & Tracking</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Manage cookie preferences</li>
                  <li>• Control tracking settings</li>
                  <li>• Opt-out of analytics</li>
                  <li>• Clear browser data</li>
                  <li>• Use browser privacy modes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal, regulatory, or legitimate business purposes.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Some information may be retained in backup systems for a limited period to ensure data integrity and recovery capabilities.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          {/* International Transfers */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Important:</strong> Please review this policy periodically to stay informed about how we protect your information.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Contact Us</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">Email</h3>
                <p className="text-gray-700">privacy@hostit.com</p>
              </div>
              
              <div className="text-center">
                <Phone className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-700">+1 (555) 123-4567</p>
              </div>
              
              <div className="text-center">
                <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900 mb-2">Address</h3>
                <p className="text-gray-700">123 HostIt Street<br />Property City, PC 12345</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact us.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 