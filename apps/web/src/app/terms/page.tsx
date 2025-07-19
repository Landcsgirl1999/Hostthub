'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Hostithub.com ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                Hostithub.com provides property management software and services including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Calendar synchronization and management</li>
                <li>Reservation management and booking systems</li>
                <li>Task tracking and property maintenance</li>
                <li>Multi-user access and team management</li>
                <li>Reporting and analytics</li>
                <li>Payment processing and billing management</li>
                <li>API access and integrations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h2>
              <p className="text-gray-700 mb-4">
                To access certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information to keep it accurate and current</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Billing and Payment Terms</h2>
              <p className="text-gray-700 mb-4">
                <strong>4.1 Pricing Structure:</strong> Our pricing is based on the number of properties you manage. Pricing tiers are as follows:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Single Property: $50/month</li>
                <li>Small Portfolio (2-5 properties): $40 per property/month</li>
                <li>Growing Portfolio (6-10 properties): $35 per property/month</li>
                <li>Medium Portfolio (11-20 properties): $30 per property/month</li>
                <li>Large Portfolio (21-50 properties): $25 per property/month</li>
                <li>Enterprise Portfolio (51-100 properties): $20 per property/month</li>
              </ul>
              
              <p className="text-gray-700 mb-4">
                <strong>4.2 Billing Cycle:</strong> Billing occurs on the 1st of each month. Your first charge will be prorated based on your signup date.
              </p>
              
              <p className="text-gray-700 mb-4">
                <strong>4.3 Dynamic Pricing:</strong> Your monthly bill will automatically adjust when you add or remove properties. Price changes are prorated and reflected on your next billing cycle.
              </p>
              
              <p className="text-gray-700 mb-4">
                <strong>4.4 Processing Fees:</strong> A 3% processing fee is applied to all transactions to cover secure payment processing and card network fees.
              </p>
              
              <p className="text-gray-700 mb-4">
                <strong>4.5 Payment Methods:</strong> We accept credit cards, debit cards, bank transfers, Apple Pay, and Google Pay. All payments are processed securely through our payment partners.
              </p>
              
              <p className="text-gray-700 mb-4">
                <strong>4.6 Late Payments:</strong> Accounts with overdue payments may be suspended or terminated. We reserve the right to charge late fees and collection costs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use Policy</h2>
              <p className="text-gray-700 mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use the Service for any illegal or unauthorized purpose</li>
                <li>Share account credentials with unauthorized users</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data and Privacy</h2>
              <p className="text-gray-700 mb-4">
                <strong>6.1 Data Ownership:</strong> You retain ownership of all data you input into the Service. We process and store your data in accordance with our Privacy Policy.
              </p>
              
              <p className="text-gray-700 mb-4">
                <strong>6.2 Data Security:</strong> We implement industry-standard security measures to protect your data. However, no method of transmission over the internet is 100% secure.
              </p>
              
              <p className="text-gray-700 mb-4">
                <strong>6.3 Data Backup:</strong> While we maintain regular backups, you are responsible for maintaining your own backups of critical data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Service Availability and Support</h2>
              <p className="text-gray-700 mb-4">
                <strong>7.1 Uptime:</strong> We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. Scheduled maintenance will be announced in advance.
              </p>
              
              <p className="text-gray-700 mb-4">
                <strong>7.2 Support:</strong> Support is provided based on your plan tier. Enterprise customers receive priority support and dedicated assistance.
              </p>
              
              <p className="text-gray-700 mb-4">
                <strong>7.3 Updates:</strong> We may update the Service from time to time. Updates will be communicated through the platform or email notifications.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                <strong>8.1 Our Rights:</strong> The Service and its original content, features, and functionality are owned by Hostithub.com and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              
              <p className="text-gray-700 mb-4">
                <strong>8.2 Your Rights:</strong> You retain ownership of content you create using our Service. You grant us a limited license to use your content solely for providing the Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                <strong>9.1 Disclaimer:</strong> THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
              </p>
              
              <p className="text-gray-700 mb-4">
                <strong>9.2 Limitation:</strong> IN NO EVENT SHALL HOSTITHUB.COM BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
              
              <p className="text-gray-700 mb-4">
                <strong>9.3 Maximum Liability:</strong> OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM THE USE OF THE SERVICE SHALL NOT EXCEED THE AMOUNT PAID BY YOU FOR THE SERVICE IN THE 12 MONTHS PRECEDING THE CLAIM.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to defend, indemnify, and hold harmless Hostithub.com and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Any content you submit to the Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Termination</h2>
              <p className="text-gray-700 mb-4">
                <strong>11.1 Termination by You:</strong> You may cancel your account at any time through your account settings or by contacting support.
              </p>
              
              <p className="text-gray-700 mb-4">
                <strong>11.2 Termination by Us:</strong> We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>
              
              <p className="text-gray-700 mb-4">
                <strong>11.3 Effect of Termination:</strong> Upon termination, your right to use the Service will cease immediately. We will retain your data for 30 days after termination, after which it may be permanently deleted.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@hostithub.com<br />
                  <strong>Address:</strong> [Your Business Address]<br />
                  <strong>Phone:</strong> [Your Phone Number]
                </p>
              </div>
            </section>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-600">
                By using Hostithub.com, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 