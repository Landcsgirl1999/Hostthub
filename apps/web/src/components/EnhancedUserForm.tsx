'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Shield, 
  Settings, 
  Plus, 
  X, 
  Upload,
  Camera,
  Trash2,
  Bell,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';
import AddressAutocomplete from './AddressAutocomplete';

interface UserFormData {
  // Basic Info
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  address: string;
  birthday: string;
  title: string;
  role: string;
  isActive: boolean;
  canCreateUsers: boolean;
  
  // Contact & Preferences
  preferredContactMethod: string;
  emergencyNumber: string;
  photoUrl: string;
  
  // Access Permissions
  accessPermissions: string[];
  
  // Property Assignments
  propertyAssignments: string[];
  
  // Detailed Permissions (CRUD matrix)
  permissions: {
    [category: string]: {
      view: boolean;
      modify: boolean;
      create: boolean;
      delete: boolean;
    };
  };
  
  // Notification Settings
  notifications: {
    [event: string]: {
      dashboard: boolean;
      mobile: boolean;
      email: boolean;
    };
  };
}

interface EnhancedUserFormProps {
  user?: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  isEditing?: boolean;
}

const PERMISSION_CATEGORIES = [
  'LISTINGS', 'RESERVATIONS', 'OWNER_STAYS', 'BOOKING_ENGINE', 
  'FINANCIAL_REPORTING', 'ANALYTICS', 'RENTAL_ACTIVITY', 'OCCUPANCY_REPORT',
  'EXPENSES_EXTRAS', 'OWNER_STATEMENTS', 'CHANNEL_MANAGER', 'TASK_MANAGER',
  'INTEGRATIONS', 'AUTOMATIONS', 'MESSAGES', 'GUEST_INVOICING', 'REVIEWS',
  'GUESTBOOK', 'SMART_LOCK_CODES', 'SAFELY_INSURANCE', 'NOTIFICATION_SETTINGS'
];

const NOTIFICATION_EVENTS = [
  'NEW_RESERVATION', 'NEW_OWNER_STAY', 'OWNER_STAY_MODIFIED', 'RESERVATION_CANCELLED',
  'NEW_INQUIRY', 'RESERVATION_PENDING', 'AIRBNB_ALTERATION_REQUEST', 'RENTAL_AGREEMENT_SIGNED',
  'ADD_CARD_SUCCESS', 'ADD_CARD_FAILED', 'CHARGE_SUCCESS', 'CHARGE_FAILED',
  'REFUND_SUCCESS', 'REFUND_FAILED', 'PRE_AUTH_SUCCESS', 'PRE_AUTH_FAILED'
];

const ACCESS_PERMISSIONS = [
  'OWNER_MANAGER_PERMISSIONS', 'CONTACT_DATA_ACCESS', 'FINANCIAL_DATA_ACCESS',
  'NIGHTLY_CALENDAR_ACCESS', 'INQUIRIES_BOOKING_ACCESS', 'CANCELLED_RESERVATIONS_ACCESS',
  'NEW_LISTINGS_ACCESS', 'GUEST_NOTES_ACCESS', 'HOST_NOTES_ACCESS'
];

export default function EnhancedUserForm({ user, isOpen, onClose, onSubmit, isEditing = false }: EnhancedUserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    birthday: '',
    title: '',
    role: 'ADMIN',
    isActive: true,
    canCreateUsers: false,
    preferredContactMethod: 'EMAIL',
    emergencyNumber: '',
    photoUrl: '',
    accessPermissions: [],
    propertyAssignments: [],
    permissions: {},
    notifications: {}
  });

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user && isEditing) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
        title: user.title || '',
        role: user.role || 'ADMIN',
        isActive: user.isActive ?? true,
        canCreateUsers: user.canCreateUsers ?? false,
        preferredContactMethod: user.preferredContactMethod || 'EMAIL',
        emergencyNumber: user.emergencyNumber || '',
        photoUrl: user.photoUrl || '',
        accessPermissions: user.accessPermissions || [],
        propertyAssignments: user.propertyAssignments?.map((pa: any) => pa.propertyId) || [],
        permissions: user.permissions || {},
        notifications: user.notifications || {}
      });
    }
    fetchProperties();
  }, [user, isEditing]);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/v1/properties', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (category: string, permission: string, value: boolean) => {
    setFormData(prev => ({
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

  const handleNotificationChange = (event: string, channel: string, value: boolean) => {
    setFormData(prev => ({
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

  const handleAccessPermissionChange = (permission: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      accessPermissions: checked 
        ? [...prev.accessPermissions, permission]
        : prev.accessPermissions.filter(p => p !== permission)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Remove password field if empty string
      const submitData = { ...formData };
      if (submitData.password === '') {
        delete submitData.password;
      }
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Photo upload handlers
  const handlePhotoUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setPhotoFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Upload to server
      const formData = new FormData();
      formData.append('photo', file);

      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/auth/upload-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(prev => ({ ...prev, photoUrl: result.photoUrl }));
        console.log('✅ Photo uploaded successfully');
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
        setPhotoFile(null);
        setPhotoPreview('');
      }
    } catch (error) {
      console.error('❌ Photo upload error:', error);
      alert('Failed to upload photo. Please try again.');
      setPhotoFile(null);
      setPhotoPreview('');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handlePhotoRemove = () => {
    setPhotoFile(null);
    setPhotoPreview('');
    setFormData(prev => ({ ...prev, photoUrl: '' }));
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'contact', label: 'Contact & Preferences', icon: Mail },
    { id: 'permissions', label: 'Access Permissions', icon: Shield },
    { id: 'detailed', label: 'Detailed Permissions', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Shield },
    { id: 'properties', label: 'Property Assignments', icon: MapPin }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Edit User' : 'Create New User'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                {/* Profile Picture Section */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Camera className="w-5 h-5 mr-2" />
                    Profile Picture
                  </h3>
                  
                  <div className="flex items-center space-x-6">
                    {/* Current Photo Preview */}
                    <div className="relative">
                      {(photoPreview || formData.photoUrl) ? (
                        <div className="relative">
                          <img
                            src={photoPreview || formData.photoUrl}
                            alt="Profile preview"
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={handlePhotoRemove}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                          <Camera className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Upload Area */}
                    <div className="flex-1">
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          isUploading 
                            ? 'border-blue-300 bg-blue-50' 
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                        onDrop={handlePhotoDrop}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        {isUploading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="text-blue-600">Uploading...</span>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 mb-2">
                              Drag and drop an image here, or click to select
                            </p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePhotoUpload(file);
                              }}
                              className="hidden"
                              id="photo-upload"
                            />
                            <label
                              htmlFor="photo-upload"
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
                            >
                              Choose File
                            </label>
                            <p className="text-xs text-gray-500 mt-2">
                              Max size: 5MB. Supported: JPEG, PNG, GIF, WebP
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {isEditing ? 'New Password (leave blank to keep current)' : 'Password *'}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required={!isEditing}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title/Position
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Birthday
                        </label>
                        <input
                          type="date"
                          value={formData.birthday}
                          onChange={(e) => handleInputChange('birthday', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <AddressAutocomplete
                        value={formData.address}
                        onChange={(address) => handleInputChange('address', address)}
                        placeholder="Enter address..."
                        onAddressSelect={(addressData) => {
                          console.log('Selected address:', addressData);
                          // You can store additional address components if needed
                          handleInputChange('address', addressData.fullAddress);
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role *
                        </label>
                        <select
                          required
                          value={formData.role}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          disabled={isEditing && user?.role === 'SUPER_ADMIN'}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            isEditing && user?.role === 'SUPER_ADMIN' ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="HOMEOWNER">Homeowner</option>
                          <option value="MANAGER">Manager</option>
                          <option value="EMPLOYEE">Employee</option>
                          <option value="CONTRACTOR">Contractor</option>
                          <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                        {isEditing && user?.role === 'SUPER_ADMIN' && (
                          <p className="text-xs text-orange-600 mt-1">
                            ⚠️ Super Admin role cannot be changed
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={formData.isActive ? 'active' : 'inactive'}
                          onChange={(e) => handleInputChange('isActive', e.target.value === 'active')}
                          disabled={isEditing && user?.role === 'SUPER_ADMIN'}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            isEditing && user?.role === 'SUPER_ADMIN' ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                        {isEditing && user?.role === 'SUPER_ADMIN' && (
                          <p className="text-xs text-orange-600 mt-1">
                            ⚠️ Super Admin cannot be deactivated
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.canCreateUsers}
                          onChange={(e) => handleInputChange('canCreateUsers', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Can create new users for their account
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Contact & Preferences Tab */}
                {activeTab === 'contact' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Contact Method
                        </label>
                        <select
                          value={formData.preferredContactMethod}
                          onChange={(e) => handleInputChange('preferredContactMethod', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="EMAIL">Email</option>
                          <option value="PHONE">Phone</option>
                          <option value="SMS">SMS</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Emergency Contact Number
                        </label>
                        <input
                          type="tel"
                          value={formData.emergencyNumber}
                          onChange={(e) => handleInputChange('emergencyNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Photo URL
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="url"
                          value={formData.photoUrl}
                          onChange={(e) => handleInputChange('photoUrl', e.target.value)}
                          placeholder="https://example.com/photo.jpg"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {formData.photoUrl && (
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                            <img
                              src={formData.photoUrl}
                              alt="Profile"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Access Permissions Tab */}
                {activeTab === 'permissions' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium text-blue-800">Access Permissions</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            These permissions control what the user can access and view in the system.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ACCESS_PERMISSIONS.map((permission) => (
                        <label key={permission} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={formData.accessPermissions.includes(permission)}
                            onChange={(e) => handleAccessPermissionChange(permission, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">
                            {permission.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Permissions Tab */}
                {activeTab === 'detailed' && (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">Detailed Permissions Matrix</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Control specific CRUD permissions for each category. This provides granular control over user capabilities.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Category
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              View
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Modify
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Create
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                              Delete
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {PERMISSION_CATEGORIES.map((category) => (
                            <tr key={category}>
                              <td className="px-4 py-2 text-sm font-medium text-gray-900 border-r">
                                {category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                              </td>
                              {['view', 'modify', 'create', 'delete'].map((permission) => (
                                <td key={permission} className="px-4 py-2 text-center border-r">
                                  <input
                                    type="checkbox"
                                    checked={formData.permissions[category]?.[permission] || false}
                                    onChange={(e) => handlePermissionChange(category, permission, e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <Bell className="w-5 h-5 text-green-600 mt-0.5 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium text-green-800">Notification Settings</h4>
                          <p className="text-sm text-green-700 mt-1">
                            Configure how and when the user receives notifications for various events.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {NOTIFICATION_EVENTS.map((event) => (
                        <div key={event} className="border border-gray-200 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-gray-900 mb-3">
                            {event.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </h5>
                          <div className="grid grid-cols-3 gap-4">
                            {['dashboard', 'mobile', 'email'].map((channel) => (
                              <label key={channel} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={formData.notifications[event]?.[channel] || false}
                                  onChange={(e) => handleNotificationChange(event, channel, e.target.checked)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700 capitalize">
                                  {channel}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Property Assignments Tab */}
                {activeTab === 'properties' && (
                  <div className="space-y-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <MapPin className="w-5 h-5 text-purple-600 mt-0.5 mr-2" />
                        <div>
                          <h4 className="text-sm font-medium text-purple-800">Property Assignments</h4>
                          <p className="text-sm text-purple-700 mt-1">
                            Select which properties this user can access and manage.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {properties.map((property) => (
                        <label key={property.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={formData.propertyAssignments.includes(property.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleInputChange('propertyAssignments', [...formData.propertyAssignments, property.id]);
                              } else {
                                handleInputChange('propertyAssignments', formData.propertyAssignments.filter(id => id !== property.id));
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{property.name}</div>
                            <div className="text-xs text-gray-500">{property.address}</div>
                          </div>
                        </label>
                      ))}
                    </div>

                    {properties.length === 0 && (
                      <div className="text-center py-8">
                        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No properties available</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Create some properties first to assign them to users.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Check className="w-4 h-4 mr-2" />
                  )}
                  {isEditing ? 'Update User' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 