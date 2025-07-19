"use client";

import { useState, useRef } from 'react';
import { Eye, EyeOff, Lock, Shield, AlertCircle, CheckCircle } from 'lucide-react';

interface BankInfo {
  accountNumber: string;
  routingNumber: string;
  accountType: string;
  bankName: string;
  accountHolderName: string;
}

interface SecureBankInfoProps {
  value?: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, errors: string[]) => void;
  disabled?: boolean;
  required?: boolean;
}

export default function SecureBankInfo({
  value,
  onChange,
  onValidationChange,
  disabled = false,
  required = false
}: SecureBankInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);
  const [bankInfo, setBankInfo] = useState<BankInfo>({
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking',
    bankName: '',
    accountHolderName: ''
  });

  const passwordRef = useRef<HTMLInputElement>(null);

  // Parse existing bank info if available
  const parseExistingInfo = () => {
    if (value && !isEditing) {
      try {
        const parsed = JSON.parse(value);
        setBankInfo(parsed);
      } catch (error) {
        console.error('Failed to parse bank info:', error);
      }
    }
  };

  // Validate bank information
  const validateBankInfo = (info: BankInfo): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (required || info.accountNumber || info.routingNumber) {
      if (!info.accountNumber.trim()) {
        errors.push('Account number is required');
      } else if (!/^\d{8,17}$/.test(info.accountNumber.replace(/\s/g, ''))) {
        errors.push('Account number must be 8-17 digits');
      }

      if (!info.routingNumber.trim()) {
        errors.push('Routing number is required');
      } else if (!/^\d{9}$/.test(info.routingNumber.replace(/\s/g, ''))) {
        errors.push('Routing number must be exactly 9 digits');
      }

      if (!info.bankName.trim()) {
        errors.push('Bank name is required');
      }

      if (!info.accountHolderName.trim()) {
        errors.push('Account holder name is required');
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  // Handle bank info changes
  const handleBankInfoChange = (field: keyof BankInfo, value: string) => {
    const updatedInfo = { ...bankInfo, [field]: value };
    setBankInfo(updatedInfo);

    const validation = validateBankInfo(updatedInfo);
    setValidationErrors(validation.errors);
    setIsValid(validation.isValid);

    if (validation.isValid) {
      onChange(JSON.stringify(updatedInfo));
    } else {
      onChange('');
    }

    onValidationChange?.(validation.isValid, validation.errors);
  };

  // Format account number for display
  const formatAccountNumber = (accountNumber: string): string => {
    const cleaned = accountNumber.replace(/\s/g, '');
    if (cleaned.length <= 4) return cleaned;
    return '****' + cleaned.slice(-4);
  };

  // Format routing number for display
  const formatRoutingNumber = (routingNumber: string): string => {
    const cleaned = routingNumber.replace(/\s/g, '');
    if (cleaned.length <= 4) return cleaned;
    return '****' + cleaned.slice(-4);
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (!disabled) {
      setIsEditing(!isEditing);
      if (!isEditing) {
        parseExistingInfo();
      }
    }
  };

  // Handle save
  const handleSave = () => {
    const validation = validateBankInfo(bankInfo);
    if (validation.isValid) {
      setIsEditing(false);
      onChange(JSON.stringify(bankInfo));
    } else {
      setValidationErrors(validation.errors);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    parseExistingInfo();
    setValidationErrors([]);
  };

  return (
    <div className="space-y-4">
      {/* Security Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Secure Bank Information</h3>
            <p className="text-sm text-gray-600">Your information is encrypted and secure</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-600 font-medium">Encrypted</span>
        </div>
      </div>

      {/* Display Mode */}
      {!isEditing && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-gray-900">
                  {bankInfo.accountNumber ? formatAccountNumber(bankInfo.accountNumber) : 'Not provided'}
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-1">Routing Number</label>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-gray-900">
                  {bankInfo.routingNumber ? formatRoutingNumber(bankInfo.routingNumber) : 'Not provided'}
                </span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <span className="text-gray-900">{bankInfo.bankName || 'Not provided'}</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <span className="text-gray-900 capitalize">{bankInfo.accountType || 'Not provided'}</span>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
              <span className="text-gray-900">{bankInfo.accountHolderName || 'Not provided'}</span>
            </div>
          </div>
          
          {!disabled && (
            <button
              onClick={handleEditToggle}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Edit Bank Information</span>
            </button>
          )}
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
              <input
                type="text"
                value={bankInfo.accountNumber}
                onChange={(e) => handleBankInfoChange('accountNumber', e.target.value)}
                placeholder="Enter account number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={17}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number *</label>
              <input
                type="text"
                value={bankInfo.routingNumber}
                onChange={(e) => handleBankInfoChange('routingNumber', e.target.value)}
                placeholder="Enter routing number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={9}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
              <input
                type="text"
                value={bankInfo.bankName}
                onChange={(e) => handleBankInfoChange('bankName', e.target.value)}
                placeholder="Enter bank name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Type *</label>
              <select
                value={bankInfo.accountType}
                onChange={(e) => handleBankInfoChange('accountType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="checking">Checking</option>
                <option value="savings">Savings</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
              <input
                type="text"
                value={bankInfo.accountHolderName}
                onChange={(e) => handleBankInfoChange('accountHolderName', e.target.value)}
                placeholder="Enter account holder name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Please fix the following errors:</h4>
                  <ul className="mt-2 text-sm text-red-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {isValid && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Bank information is valid and secure</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              disabled={!isValid}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Save Securely</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 