'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Settings, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Save, 
  Eye, 
  EyeOff,
  Camera,
  Upload,
  Trash2,
  Plus,
  X,
  Check,
  AlertCircle,
  Lock,
  Key,
  Smartphone,
  Monitor,
  Download,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import NotificationSettings from '../../../../components/NotificationSettings';

interface UserSettings {
  // Basic Info
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthday: string;
  title: string;
  photoUrl: string;
  
  // Contact & Preferences
  preferredContactMethod: 'EMAIL' | 'PHONE' | 'SMS';
  emergencyNumber: string;
  timezone: string;
  language: string;
  
  // Security
  password: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
  twoFactorSecret: string;
  
  // Notifications
  notifications: {
    [event: string]: {
      dashboard: boolean;
      mobile: boolean;
      email: boolean;
    };
  };
  
  // Permissions
  accessPermissions: string[];
  permissions: {
    [category: string]: {
      view: boolean;
      modify: boolean;
      create: boolean;
      delete: boolean;
    };
  };
}

const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '中文' }
];

const PERMISSION_CATEGORIES = [
  'LISTINGS', 'RESERVATIONS', 'OWNER_STAYS', 'BOOKING_ENGINE', 
  'FINANCIAL_REPORTING', 'ANALYTICS', 'RENTAL_ACTIVITY', 'OCCUPANCY_REPORT',
  'EXPENSES_EXTRAS', 'OWNER_STATEMENTS', 'CHANNEL_MANAGER', 'TASK_MANAGER',
  'INTEGRATIONS', 'AUTOMATIONS', 'MESSAGES', 'GUEST_INVOICING', 'REVIEWS',
  'GUESTBOOK', 'SMART_LOCK_CODES', 'SAFELY_INSURANCE', 'NOTIFICATION_SETTINGS'
];

const ACCESS_PERMISSIONS = [
  'OWNER_MANAGER_PERMISSIONS', 'CONTACT_DATA_ACCESS', 'FINANCIAL_DATA_ACCESS',
  'NIGHTLY_CALENDAR_ACCESS', 'INQUIRIES_BOOKING_ACCESS', 'CANCELLED_RESERVATIONS_ACCESS',
  'NEW_LISTINGS_ACCESS', 'GUEST_NOTES_ACCESS', 'HOST_NOTES_ACCESS'
];

export default function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    birthday: '',
    title: '',
    photoUrl: '',
    preferredContactMethod: 'EMAIL',
    emergencyNumber: '',
    timezone: 'America/New_York',
    language: 'en',
    password: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    twoFactorSecret: '',
    notifications: {},
    accessPermissions: [],
    permissions: {}
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setSettings(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        birthday: user.birthday || '',
        title: user.title || '',
        photoUrl: user.photoUrl || '',
        preferredContactMethod: user.preferredContactMethod || 'EMAIL',
        emergencyNumber: user.emergencyNumber || '',
        timezone: user.timezone || 'America/New_York',
        language: user.language || 'en',
        twoFactorEnabled: user.twoFactorEnabled || false,
        accessPermissions: user.accessPermissions || [],
        permissions: user.permissions || {}
      }));
    }
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/v1/users/me/settings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          ...data.settings
        }));
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token');

      const response = await fetch('/api/v1/users/me/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        // Update local storage with new user data
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          const updatedUser = { ...user, ...settings };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
        }
        
        alert('Settings saved successfully!');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (event: string, channel: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [event]: {
          ...prev.notifications[event],
          [channel]: value
        }
      }
    }));
  };

  const handleBulkNotificationUpdate = (event: string, channel: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [event]: {
          ...prev.notifications[event],
          [channel]: value
        }
      }
    }));
  };

  const handlePermissionChange = (category: string, permission: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [category]: {
          ...prev.permissions[category],
          [permission]: value
        }
      }
    }));
  };

  const handleAccessPermissionChange = (permission: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      accessPermissions: value 
        ? [...prev.accessPermissions, permission]
        : prev.accessPermissions.filter(p => p !== permission)
    }));
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'permissions', name: 'Permissions', icon: Lock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft border border-white/20 p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-soft border border-white/20 p-8">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3">
                    <User className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  </div>

                  {/* Profile Photo */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        {settings.name ? settings.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{settings.name}</h3>
                      <p className="text-gray-600">{settings.email}</p>
                      <p className="text-sm text-gray-500">{settings.title}</p>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={settings.phoneNumber}
                        onChange={(e) => setSettings(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={settings.title}
                        onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your job title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Birthday
                      </label>
                      <input
                        type="date"
                        value={settings.birthday}
                        onChange={(e) => setSettings(prev => ({ ...prev, birthday: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
                  </div>

                  <NotificationSettings
                    notifications={settings.notifications}
                    onNotificationChange={handleNotificationChange}
                    onBulkUpdate={handleBulkNotificationUpdate}
                    readOnly={false}
                  />
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
                  </div>

                  {/* Password Change */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={settings.password}
                            onChange={(e) => setSettings(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={settings.newPassword}
                            onChange={(e) => setSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={settings.confirmPassword}
                            onChange={(e) => setSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {settings.newPassword && settings.confirmPassword && (
                      <div className={`p-4 rounded-xl ${
                        settings.newPassword === settings.confirmPassword 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {settings.newPassword === settings.confirmPassword ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className={`text-sm font-medium ${
                            settings.newPassword === settings.confirmPassword ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {settings.newPassword === settings.confirmPassword 
                              ? 'Passwords match!' 
                              : 'Passwords do not match'
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Key className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          settings.twoFactorEnabled
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {settings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Preferences</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Contact Method
                      </label>
                      <select
                        value={settings.preferredContactMethod}
                        onChange={(e) => setSettings(prev => ({ ...prev, preferredContactMethod: e.target.value as any }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="EMAIL">Email</option>
                        <option value="PHONE">Phone</option>
                        <option value="SMS">SMS</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact Number
                      </label>
                      <input
                        type="tel"
                        value={settings.emergencyNumber}
                        onChange={(e) => setSettings(prev => ({ ...prev, emergencyNumber: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter emergency contact"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {TIMEZONES.map(tz => (
                          <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {LANGUAGES.map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Permissions Tab */}
              {activeTab === 'permissions' && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Access Permissions</h2>
                  </div>

                  {/* Access Permissions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Access Permissions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ACCESS_PERMISSIONS.map(permission => (
                        <label key={permission} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                          <input
                            type="checkbox"
                            checked={settings.accessPermissions.includes(permission)}
                            onChange={(e) => handleAccessPermissionChange(permission, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            {permission.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Permissions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Detailed Permissions</h3>
                    <div className="space-y-4">
                      {PERMISSION_CATEGORIES.map(category => (
                        <div key={category} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-3">
                            {category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </h4>
                          <div className="grid grid-cols-4 gap-4">
                            {['view', 'modify', 'create', 'delete'].map(permission => (
                              <label key={permission} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={settings.permissions[category]?.[permission] || false}
                                  onChange={(e) => handlePermissionChange(category, permission, e.target.checked)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700 capitalize">{permission}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-8 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 