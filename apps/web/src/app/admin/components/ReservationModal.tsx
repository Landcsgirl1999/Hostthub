'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, User, Phone, Mail, Home, Users, Clock, DollarSign, Globe, FileText, Eye, EyeOff } from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  startDate: Date | null;
  endDate: Date | null;
  propertyName: string;
  onSubmit: (reservation: any) => void;
  userRole?: string; // Add user role prop
}

type ReservationType = 'inquiry' | 'owner_stay' | 'maintenance' | 'friends_family' | 'guest';

interface ReservationForm {
  reservationId: string;
  type: ReservationType;
  status: string;
  listingName: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  guestName: string;
  guestCount: number;
  petCount: number;
  email: string;
  phone: string;
  address: string;
  requests: string;
  currency: string;
  language: string;
  cancellationPolicy: string;
  totalAmount: number;
  notes: string;
  doorCode: string;
}

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' }
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' }
];

const CANCELLATION_POLICIES = [
  'Flexible - Full refund 1 day prior to arrival',
  'Moderate - Full refund 5 days prior to arrival',
  'Strict - Full refund 7 days prior to arrival',
  'Super Strict - Full refund 14 days prior to arrival',
  'Non-refundable - No refund available',
  'Custom Policy'
];

export default function ReservationModal({ 
  isOpen, 
  onClose, 
  startDate, 
  endDate, 
  propertyName, 
  onSubmit,
  userRole = 'USER' // Default to USER if not provided
}: ReservationModalProps) {
  const [form, setForm] = useState<ReservationForm>({
    reservationId: '',
    type: 'inquiry',
    status: 'confirmed',
    listingName: propertyName,
    checkInDate: startDate ? startDate.toISOString().split('T')[0] : '',
    checkOutDate: endDate ? endDate.toISOString().split('T')[0] : '',
    checkInTime: '15:00',
    checkOutTime: '11:00',
    guestName: '',
    guestCount: 1,
    petCount: 0,
    email: '',
    phone: '',
    address: '',
    requests: '',
    currency: 'USD',
    language: 'en',
    cancellationPolicy: CANCELLATION_POLICIES[0],
    totalAmount: 0,
    notes: '',
    doorCode: ''
  });

  const [customCancellationPolicy, setCustomCancellationPolicy] = useState('');

  // Function to determine if door code should be visible
  const shouldShowDoorCode = () => {
    // Homeowners (SUPER_ADMIN, ADMIN) can always see door codes
    if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
      return true;
    }

    // For guests and friends/family, check if it's within 48 hours of check-in
    if (form.type === 'guest' || form.type === 'friends_family') {
      if (!form.checkInDate) return false;
      
      const checkInDate = new Date(form.checkInDate);
      const now = new Date();
      const timeDifference = checkInDate.getTime() - now.getTime();
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      
      return hoursDifference <= 48;
    }

    // For other reservation types, don't show door code
    return false;
  };

  // Function to get door code visibility message
  const getDoorCodeMessage = () => {
    if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
      return 'Access code for the property door lock';
    }

    if (form.type === 'guest' || form.type === 'friends_family') {
      if (!form.checkInDate) {
        return 'Door code will be available 48 hours before check-in';
      }
      
      const checkInDate = new Date(form.checkInDate);
      const now = new Date();
      const timeDifference = checkInDate.getTime() - now.getTime();
      const hoursDifference = timeDifference / (1000 * 60 * 60);
      
      if (hoursDifference <= 48) {
        return 'Access code for the property door lock';
      } else {
        const daysRemaining = Math.ceil(hoursDifference / 24);
        return `Door code will be available in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`;
      }
    }

    return 'Door code not available for this reservation type';
  };

  useEffect(() => {
    if (isOpen) {
      // Generate a unique reservation ID
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substr(2, 5).toUpperCase();
      setForm(prev => ({
        ...prev,
        reservationId: `RES-${timestamp.slice(-6)}-${random}`,
        listingName: propertyName,
        checkInDate: startDate ? startDate.toISOString().split('T')[0] : '',
        checkOutDate: endDate ? endDate.toISOString().split('T')[0] : ''
      }));
    }
  }, [isOpen, startDate, endDate, propertyName]);

  const handleInputChange = (field: keyof ReservationForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const getRequiredFields = () => {
    // Base required fields for all reservation types
    const baseRequiredFields = ['listingName', 'checkInDate', 'checkOutDate'];
    
    switch (form.type) {
      case 'owner_stay':
        return [...baseRequiredFields, 'guestCount', 'guestName'];
      case 'friends_family':
        return [...baseRequiredFields, 'checkInTime', 'checkOutTime', 'guestName', 'phone', 'email', 'guestCount', 'petCount'];
      case 'guest':
        return [...baseRequiredFields, 'guestName', 'phone', 'email', 'guestCount', 'address', 'petCount', 'checkInTime', 'checkOutTime'];
      case 'inquiry':
        return [...baseRequiredFields, 'guestName'];
      case 'maintenance':
        return [...baseRequiredFields, 'guestName'];
      default:
        return [...baseRequiredFields, 'guestName'];
    }
  };

  const isFormValid = () => {
    const requiredFields = getRequiredFields();
    return requiredFields.every(field => {
      const value = form[field as keyof ReservationForm];
      return value !== '' && value !== 0;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const finalCancellationPolicy = form.cancellationPolicy === 'Custom Policy' 
      ? customCancellationPolicy 
      : form.cancellationPolicy;

    const reservation = {
      ...form,
      cancellationPolicy: finalCancellationPolicy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(reservation);
    onClose();
  };

  const getReservationTypeInfo = () => {
    switch (form.type) {
      case 'owner_stay':
        return {
          title: 'Owner Stay',
          description: 'Reservation for property owner or family',
          color: 'bg-purple-100 text-purple-800'
        };
      case 'friends_family':
        return {
          title: 'Friends & Family',
          description: 'Reservation for friends or family members',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'guest':
        return {
          title: 'Guest Reservation',
          description: 'Regular guest reservation',
          color: 'bg-green-100 text-green-800'
        };
      case 'inquiry':
        return {
          title: 'Inquiry',
          description: 'Guest inquiry - not confirmed',
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'maintenance':
        return {
          title: 'Maintenance',
          description: 'Property maintenance or repair',
          color: 'bg-red-100 text-red-800'
        };
      default:
        return {
          title: 'Inquiry',
          description: 'Guest inquiry - not confirmed',
          color: 'bg-yellow-100 text-yellow-800'
        };
    }
  };

  if (!isOpen) return null;

  const typeInfo = getReservationTypeInfo();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Reservation</h2>
            <p className="text-gray-600 mt-1">Property: {propertyName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Reservation Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['inquiry', 'owner_stay', 'maintenance', 'friends_family', 'guest'] as ReservationType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleInputChange('type', type)}
                className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                  form.type === type
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm capitalize">
                  {type.replace('_', ' ')}
                </div>
              </button>
            ))}
          </div>

          {/* Reservation Type Info */}
          <div className={`p-4 rounded-xl ${typeInfo.color}`}>
            <h3 className="font-semibold">{typeInfo.title}</h3>
            <p className="text-sm opacity-80">{typeInfo.description}</p>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reservation ID
              </label>
              <input
                type="text"
                value={form.reservationId}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
                <option value="no_show">No Show</option>
              </select>
            </div>
          </div>

          {/* Property and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listing Name *
              </label>
              <input
                type="text"
                value={form.listingName}
                onChange={(e) => handleInputChange('listingName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date *
                </label>
                <input
                  type="date"
                  value={form.checkInDate}
                  onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date *
                </label>
                <input
                  type="date"
                  value={form.checkOutDate}
                  onChange={(e) => handleInputChange('checkOutDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Check-in/Check-out Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-in Time
              </label>
              <input
                type="time"
                value={form.checkInTime}
                onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check-out Time
              </label>
              <input
                type="time"
                value={form.checkOutTime}
                onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Guest Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guest Name *
              </label>
              <input
                type="text"
                value={form.guestName}
                onChange={(e) => handleInputChange('guestName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Email
                {(form.type === 'friends_family' || form.type === 'guest') && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required={form.type === 'friends_family' || form.type === 'guest'}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
                {(form.type === 'friends_family' || form.type === 'guest') && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required={form.type === 'friends_family' || form.type === 'guest'}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Guest Count<span className="text-red-500">*</span></label>
              <input
                type="number"
                name="guestCount"
                min={1}
                value={form.guestCount}
                onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-1">Pet Count</label>
              <input
                type="number"
                name="petCount"
                min={0}
                value={form.petCount}
                onChange={(e) => handleInputChange('petCount', parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Address (for guest reservations) */}
          {form.type === 'guest' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                value={form.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}

          {/* Total Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Amount
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.totalAmount}
                onChange={(e) => handleInputChange('totalAmount', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute right-3 top-2 text-gray-500">
                {CURRENCIES.find(c => c.code === form.currency)?.symbol}
              </div>
            </div>
          </div>

          {/* Currency and Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={form.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {CURRENCIES.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={form.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {LANGUAGES.map(language => (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cancellation Policy
            </label>
            <select
              value={form.cancellationPolicy}
              onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {CANCELLATION_POLICIES.map(policy => (
                <option key={policy} value={policy}>
                  {policy}
                </option>
              ))}
            </select>
            
            {form.cancellationPolicy === 'Custom Policy' && (
              <textarea
                value={customCancellationPolicy}
                onChange={(e) => setCustomCancellationPolicy(e.target.value)}
                placeholder="Enter custom cancellation policy..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mt-2"
              />
            )}
          </div>

          {/* Door Code */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Door Code</label>
            {shouldShowDoorCode() ? (
              <div>
                <input
                  type="text"
                  name="doorCode"
                  value={form.doorCode}
                  onChange={(e) => handleInputChange('doorCode', e.target.value)}
                  placeholder="Enter property access code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">{getDoorCodeMessage()}</p>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="password"
                  value="••••••••"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
                <div className="absolute right-3 top-2 text-gray-400">
                  <EyeOff className="w-5 h-5" />
                </div>
                <p className="text-sm text-gray-500 mt-1">{getDoorCodeMessage()}</p>
              </div>
            )}
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests
            </label>
            <textarea
              value={form.requests}
              onChange={(e) => handleInputChange('requests', e.target.value)}
              placeholder="Any special requests or notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Internal notes..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 