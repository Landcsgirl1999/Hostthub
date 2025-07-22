"use client";

import { useState, useRef, useEffect } from "react";
import {
  Save,
  User,
  Shield,
  Bell,
  CreditCard,
  Globe,
  Database,
  Upload,
  Image as ImageIcon,
  FileText,
  Trash2,
  Plus,
  Check,
  Loader2,
  Mail,
} from "lucide-react";
import NotificationSettings from "../../../components/NotificationSettings";
import SecureBankInfo from "../../../components/SecureBankInfo";


interface BillingInfo {
  propertyCount: number;
  pricingTier: {
    min: number;
    max: number;
    basePrice: number;
  };
  monthlyPrice: number;
  totalMonthlyCost: number;
  lastBillingDate?: string;
  nextBillingDate?: string;
  subscription?: {
    status: string;
    plan?: {
      name: string;
      description: string;
    };
  };
}

const DEFAULT_PRICING_PLAN = {
  name: "Professional Plan",
  price: 99,
  currency: "USD",
  properties: 25,
  users: "Unlimited",
  description: "$99/month • 25 properties • Unlimited users",
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company");
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [company, setCompany] = useState({
    companyName: "Hostit.com",
    logoUrl: "",
    website: "https://hostit.com",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    contactEmail: "support@hostit.com",
    invoiceEmail: "billing@hostit.com",
    supportEmail: "support@hostit.com",
    hostitAccountId: "hostit-123456",
    accountNumber: "",
    taxId: "",
    businessLicense: "",
    timezone: "UTC",
    currency: "USD",
    language: "en",
    invoicePrefix: "INV",
    autoIncrement: true,
  });
  const [billing, setBilling] = useState({
    bankAccountInfo: "",
    autoGenerateInvoices: true,
    lateFeePercentage: 0.05,
    lateFeeAmount: 0,
    taxRate: 0,
    taxIncluded: false,
    taxExemptionNumber: "",
    billingCycle: "monthly",
    billingDay: 1,
    sendInvoiceReminders: true,
    reminderDays: [7, 3, 1],
    sendPaymentConfirmations: true,
  });
  const [integrations, setIntegrations] = useState({
    hostitApiKey: "",
    hostitApiSecret: "",
    hostitWebhookUrl: "",
    hostitNotifications: true,
    stripeEnabled: true,
    stripePublishableKey: "",
    stripeSecretKey: "",
    paypalEnabled: false,
    paypalClientId: "",
    paypalSecret: "",
    googleCalendarEnabled: false,
    googleCalendarId: "",
    googleApiKey: "",
    twilioEnabled: false,
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioPhoneNumber: "",
    sendgridEnabled: false,
    sendgridApiKey: "",
    sendgridFromEmail: "",
    airbnbEnabled: false,
    airbnbApiKey: "",
    airbnbApiSecret: "",
    vrboEnabled: false,
    vrboApiKey: "",
    vrboApiSecret: "",
    bookingComEnabled: false,
    bookingComApiKey: "",
    bookingComApiSecret: "",
  });
  const [invoiceTemplates, setInvoiceTemplates] = useState([
    {
      id: "1",
      name: "Default Invoice",
      description: "Standard invoice template",
      isDefault: true,
      isActive: true,
    },
  ]);
  const [notifications, setNotifications] = useState({});
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templateEdit, setTemplateEdit] = useState<any>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [consent, setConsent] = useState({ marketing: false, analytics: false, communications: false });
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);

  useEffect(() => {
    // Get user from localStorage (same as AdminLayout)
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
    fetchBillingInfo();
  }, []);

  const fetchBillingInfo = async () => {
    try {
      setBillingLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/v1/billing/current', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBillingInfo(data.data);
      } else {
        console.error('Failed to fetch billing info');
      }
    } catch (error) {
      console.error('Error fetching billing info:', error);
    } finally {
      setBillingLoading(false);
    }
  };

  const tabs = [
    { id: "company", name: "Company", icon: User },
    { id: "billing", name: "Billing & Payment", icon: CreditCard },
    { id: "invoices", name: "Invoices", icon: FileText },
    { id: "charges", name: "Charges", icon: CreditCard },
    { id: "integrations", name: "Integrations", icon: Globe },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
    { id: "data", name: "Data & Privacy", icon: Database },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    // TODO: Call backend endpoints for each section
    setTimeout(() => setIsLoading(false), 1200);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleExportData = async () => {
    // TODO: Call backend endpoint to export data and trigger download
    alert('Data export will be available soon.');
  };

  const handleDeleteRequest = async () => {
    if (!window.confirm('Are you sure you want to request deletion of your account and all data? This action is irreversible.')) return;
    // TODO: Call backend endpoint to request deletion
    alert('Your deletion request has been submitted.');
  };

  const handleSaveConsent = async () => {
    // TODO: Call backend endpoint to save consent preferences
    alert('Consent preferences saved.');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your company, billing, integrations, and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-glow hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{isLoading ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
            {/* Company Tab */}
            {activeTab === "company" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Company Profile</h2>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      {logoPreview || company.logoUrl ? (
                        <img
                          src={logoPreview || company.logoUrl}
                          alt="Company Logo"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <ImageIcon className="w-16 h-16 text-gray-300" />
                      )}
                      <button
                        className="absolute bottom-2 right-2 bg-white/80 rounded-full p-2 shadow hover:bg-blue-100"
                        onClick={() => logoInputRef.current?.click()}
                        type="button"
                      >
                        <Upload className="w-5 h-5 text-blue-600" />
                      </button>
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                    </div>
                    <span className="text-xs text-gray-500">Upload your company logo</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        value={company.companyName}
                        onChange={e => setCompany({ ...company, companyName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account ID</label>
                      <input
                        type="text"
                        value={company.hostitAccountId}
                        onChange={e => setCompany({ ...company, hostitAccountId: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                      <input
                        type="email"
                        value={company.contactEmail}
                        onChange={e => setCompany({ ...company, contactEmail: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Email</label>
                      <input
                        type="email"
                        value={company.invoiceEmail}
                        onChange={e => setCompany({ ...company, invoiceEmail: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                      <input
                        type="email"
                        value={company.supportEmail}
                        onChange={e => setCompany({ ...company, supportEmail: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={company.phoneNumber}
                        onChange={e => setCompany({ ...company, phoneNumber: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={company.address}
                        onChange={e => setCompany({ ...company, address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input
                        type="url"
                        value={company.website}
                        onChange={e => setCompany({ ...company, website: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select
                        value={company.language}
                        onChange={e => setCompany({ ...company, language: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                      <input
                        type="text"
                        value={company.timezone}
                        onChange={e => setCompany({ ...company, timezone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                      <input
                        type="text"
                        value={company.currency}
                        onChange={e => setCompany({ ...company, currency: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">Billing & Payment</h2>
                    
                    {/* Billing Summary */}
                    {billingInfo && (
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4">
                            <div className="text-2xl font-bold text-green-700">${billingInfo.totalMonthlyCost}</div>
                            <div className="text-sm text-gray-600">Monthly Total</div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                            <div className="text-2xl font-bold text-blue-700">{billingInfo.propertyCount}</div>
                            <div className="text-sm text-gray-600">Active Properties</div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
                            <div className="text-2xl font-bold text-purple-700">${billingInfo.monthlyPrice}</div>
                            <div className="text-sm text-gray-600">Per Property</div>
                          </div>
                        </div>
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                          <div className="text-sm text-gray-600">
                            <strong>Current Tier:</strong> {billingInfo.pricingTier.min}-{billingInfo.pricingTier.max} properties at ${billingInfo.monthlyPrice}/property
                          </div>
                          {billingInfo.nextBillingDate && (
                            <div className="text-sm text-gray-600 mt-1">
                              <strong>Next Billing:</strong> {new Date(billingInfo.nextBillingDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <h3 className="text-lg font-semibold mb-4 text-blue-800">Payment Methods</h3>
                          <p className="text-blue-700">
                            Payment integration is currently being set up. Please contact support for payment method management.
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                        <input
                          type="number"
                          value={billing.taxRate}
                          onChange={e => setBilling({ ...billing, taxRate: Number(e.target.value) })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Billing Cycle</label>
                        <select
                          value={billing.billingCycle}
                          onChange={e => setBilling({ ...billing, billingCycle: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Billing Day</label>
                        <input
                          type="number"
                          value={billing.billingDay}
                          onChange={e => setBilling({ ...billing, billingDay: Number(e.target.value) })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  {/* Pricing Plan Card */}
                  <div className="w-full md:w-80 flex-shrink-0">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 border border-blue-200 rounded-2xl p-6 shadow-lg flex flex-col items-center">
                      <h3 className="text-lg font-bold text-blue-700 mb-2">Current Plan</h3>
                      {billingLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                          <span className="ml-2 text-blue-600">Loading...</span>
                        </div>
                      ) : billingInfo ? (
                        <>
                          <div className="text-3xl font-extrabold text-blue-800 mb-1">
                            {billingInfo.subscription?.plan?.name || 'Professional Plan'}
                          </div>
                          <div className="text-xl text-blue-600 font-bold mb-2">
                            ${billingInfo.totalMonthlyCost}/mo
                          </div>
                          <div className="text-gray-700 mb-2 text-center">
                            ${billingInfo.monthlyPrice}/property • {billingInfo.propertyCount} properties
                          </div>
                          <div className="flex flex-col gap-1 text-sm text-gray-600">
                            <span>Properties: {billingInfo.propertyCount}</span>
                            <span>Price per property: ${billingInfo.monthlyPrice}</span>
                            <span>Total monthly: ${billingInfo.totalMonthlyCost}</span>
                            {billingInfo.nextBillingDate && (
                              <span>Next billing: {new Date(billingInfo.nextBillingDate).toLocaleDateString()}</span>
                            )}
                          </div>
                          <div className="mt-4 text-xs text-gray-500">
                            Tier: {billingInfo.pricingTier.min}-{billingInfo.pricingTier.max} properties
                          </div>
                          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                            Manage Plan
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="text-3xl font-extrabold text-blue-800 mb-1">{DEFAULT_PRICING_PLAN.name}</div>
                          <div className="text-xl text-blue-600 font-bold mb-2">
                            ${DEFAULT_PRICING_PLAN.price}/mo
                          </div>
                          <div className="text-gray-700 mb-2">{DEFAULT_PRICING_PLAN.description}</div>
                          <div className="flex flex-col gap-1 text-sm text-gray-600">
                            <span>Properties: {DEFAULT_PRICING_PLAN.properties}</span>
                            <span>Users: {DEFAULT_PRICING_PLAN.users}</span>
                          </div>
                          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                            Upgrade Plan
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Integrations Tab */}
            {activeTab === "integrations" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Integrations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Hostithub.com API</h3>
                    <input
                      type="text"
                      placeholder="API Key"
                      value={integrations.hostitApiKey}
                      onChange={e => setIntegrations({ ...integrations, hostitApiKey: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    />
                    <input
                      type="text"
                      placeholder="API Secret"
                      value={integrations.hostitApiSecret}
                      onChange={e => setIntegrations({ ...integrations, hostitApiSecret: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Webhook URL"
                      value={integrations.hostitWebhookUrl}
                      onChange={e => setIntegrations({ ...integrations, hostitWebhookUrl: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Stripe</h3>
                    <input
                      type="text"
                      placeholder="Publishable Key"
                      value={integrations.stripePublishableKey}
                      onChange={e => setIntegrations({ ...integrations, stripePublishableKey: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Secret Key"
                      value={integrations.stripeSecretKey}
                      onChange={e => setIntegrations({ ...integrations, stripeSecretKey: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-2">PayPal</h3>
                    <input
                      type="text"
                      placeholder="Client ID"
                      value={integrations.paypalClientId}
                      onChange={e => setIntegrations({ ...integrations, paypalClientId: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Secret"
                      value={integrations.paypalSecret}
                      onChange={e => setIntegrations({ ...integrations, paypalSecret: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Other Integrations</h3>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={integrations.airbnbEnabled} onChange={e => setIntegrations({ ...integrations, airbnbEnabled: e.target.checked })} /> Airbnb
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={integrations.vrboEnabled} onChange={e => setIntegrations({ ...integrations, vrboEnabled: e.target.checked })} /> VRBO
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={integrations.bookingComEnabled} onChange={e => setIntegrations({ ...integrations, bookingComEnabled: e.target.checked })} /> Booking.com
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={integrations.googleCalendarEnabled} onChange={e => setIntegrations({ ...integrations, googleCalendarEnabled: e.target.checked })} /> Google Calendar
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={integrations.twilioEnabled} onChange={e => setIntegrations({ ...integrations, twilioEnabled: e.target.checked })} /> Twilio
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={integrations.sendgridEnabled} onChange={e => setIntegrations({ ...integrations, sendgridEnabled: e.target.checked })} /> SendGrid
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>
                <NotificationSettings
                  notifications={notifications}
                  onNotificationChange={() => {}}
                  readOnly={false}
                />
              </div>
            )}
            {/* Invoice Templates Tab */}
            {activeTab === "invoices" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Invoice Templates</h2>
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700"
                    onClick={() => setTemplateModalOpen(true)}
                  >
                    <Plus className="w-4 h-4" /> New Template
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {invoiceTemplates.map((tpl) => (
                    <div key={tpl.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 shadow">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">{tpl.name}</span>
                        {tpl.isDefault && <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Default</span>}
                        {!tpl.isActive && <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">Inactive</span>}
                      </div>
                      <div className="text-gray-600 text-sm">{tpl.description}</div>
                      <div className="flex gap-2 mt-2">
                        <button className="text-blue-600 hover:underline text-xs" onClick={() => setTemplateEdit(tpl)}>Edit</button>
                        <button className="text-red-600 hover:underline text-xs flex items-center gap-1"><Trash2 className="w-3 h-3" />Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Modal for create/edit template (not implemented here) */}
              </div>
            )}
            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input type="password" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input type="password" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">Enable</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Invoices Tab */}
            {activeTab === "invoices" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
                  <button
                    onClick={() => window.open('/admin/invoices', '_blank')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-glow hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View All Invoices</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Invoice Statistics */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">Invoice Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Invoices:</span>
                        <span className="font-semibold text-blue-800">24</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending:</span>
                        <span className="font-semibold text-yellow-600">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid:</span>
                        <span className="font-semibold text-green-600">21</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Revenue:</span>
                        <span className="font-semibold text-blue-800">$2,847.50</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>Create New Invoice</span>
                      </button>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Generate Monthly Invoice</span>
                      </button>
                      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Send Payment Reminders</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Invoices */}
                <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Invoices</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'INV-2024-001', amount: 299.99, status: 'Paid', date: '2024-07-15' },
                      { id: 'INV-2024-002', amount: 199.99, status: 'Pending', date: '2024-07-20' },
                      { id: 'INV-2024-003', amount: 399.99, status: 'Paid', date: '2024-07-10' }
                    ].map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{invoice.id}</div>
                          <div className="text-sm text-gray-500">{invoice.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">${invoice.amount}</div>
                          <div className={`text-sm ${invoice.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {invoice.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Charges Tab */}
            {activeTab === "charges" && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Property Charges</h2>
                  <button
                    onClick={() => window.open('/admin/charges', '_blank')}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-xl shadow-glow hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>View All Charges</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Charge Statistics */}
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">Charge Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Charges:</span>
                        <span className="font-semibold text-green-800">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">This Month:</span>
                        <span className="font-semibold text-blue-800">23</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Amount:</span>
                        <span className="font-semibold text-green-800">$4,521.75</span>
                      </div>
                    </div>
                  </div>

                  {/* Charge Types */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4">Charge Types</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subscription:</span>
                        <span className="font-semibold text-purple-800">89</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Setup:</span>
                        <span className="font-semibold text-pink-800">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Overage:</span>
                        <span className="font-semibold text-purple-800">34</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Add-ons:</span>
                        <span className="font-semibold text-pink-800">21</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-4">Payment Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid:</span>
                        <span className="font-semibold text-green-600">142</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending:</span>
                        <span className="font-semibold text-yellow-600">8</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Failed:</span>
                        <span className="font-semibold text-red-600">6</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Charges */}
                <div className="bg-white rounded-xl shadow-soft border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Charges</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'CHG-001', property: 'Beach House', type: 'Subscription', amount: 29.99, status: 'Paid' },
                      { id: 'CHG-002', property: 'Mountain Cabin', type: 'Setup', amount: 99.00, status: 'Pending' },
                      { id: 'CHG-003', property: 'City Apartment', type: 'Overage', amount: 15.50, status: 'Paid' }
                    ].map((charge) => (
                      <div key={charge.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{charge.id}</div>
                          <div className="text-sm text-gray-500">{charge.property} • {charge.type}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">${charge.amount}</div>
                          <div className={`text-sm ${charge.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {charge.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* Data & Privacy Tab */}
            {activeTab === "data" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900">Data & Privacy</h2>
                <div className="space-y-6">
                  {/* Data Export */}
                  <div className="glass-card p-6 rounded-xl shadow-md flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Export</h3>
                    <p className="text-gray-600 mb-2">Download a copy of all your company and user data for compliance or backup.</p>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                      onClick={handleExportData}
                    >
                      Download My Data
                    </button>
                  </div>
                  {/* Data Deletion Request */}
                  <div className="glass-card p-6 rounded-xl shadow-md flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Deletion Request</h3>
                    <p className="text-gray-600 mb-2">Request deletion of your account and all associated data. This action is irreversible and may require admin approval.</p>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition disabled:opacity-60"
                      onClick={handleDeleteRequest}
                      disabled={currentUser?.role === 'SUPER_ADMIN'}
                      title={currentUser?.role === 'SUPER_ADMIN' ? 'Super Admin account cannot be deleted.' : ''}
                    >
                      Request Data Deletion
                    </button>
                    {currentUser?.role === 'SUPER_ADMIN' && (
                      <p className="text-xs text-red-500 mt-1">Super Admin account cannot be deleted for security reasons.</p>
                    )}
                  </div>
                  {/* Privacy Policy */}
                  <div className="glass-card p-6 rounded-xl shadow-md flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy Policy</h3>
                    <p className="text-gray-600 mb-2">Read our <button className="underline text-blue-600 hover:text-blue-800" onClick={() => setShowPrivacyModal(true)}>Privacy Policy</button> to learn how we handle your data.</p>
                  </div>
                  {/* Consent Management */}
                  <div className="glass-card p-6 rounded-xl shadow-md flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Consent Management</h3>
                    <p className="text-gray-600 mb-2">Manage your consents for marketing, analytics, and communications.</p>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={consent.marketing} onChange={() => setConsent(c => ({ ...c, marketing: !c.marketing }))} />
                        <span>Allow marketing emails</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={consent.analytics} onChange={() => setConsent(c => ({ ...c, analytics: !c.analytics }))} />
                        <span>Allow analytics tracking</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={consent.communications} onChange={() => setConsent(c => ({ ...c, communications: !c.communications }))} />
                        <span>Allow product updates & communications</span>
                      </label>
                    </div>
                    <button className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded transition mt-2" onClick={handleSaveConsent}>
                      Save Consent Preferences
                    </button>
                  </div>
                </div>
                {/* Privacy Policy Modal */}
                {showPrivacyModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-lg w-full shadow-lg relative">
                      <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowPrivacyModal(false)}>&times;</button>
                      <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
                      <div className="overflow-y-auto max-h-96 text-gray-700 text-sm">
                        {/* Insert your privacy policy text here or load from a file/URL */}
                        <p>Your privacy is important to us. We collect, use, and store your data in accordance with applicable laws and only for the purposes of providing and improving our services...</p>
                        {/* ...more policy text... */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 