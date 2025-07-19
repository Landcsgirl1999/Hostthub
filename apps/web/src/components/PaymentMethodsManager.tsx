"use client";

import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Building2, 
  Plus, 
  Trash2, 
  Edit, 
  Star, 
  StarOff,
  Shield,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'CARD' | 'BANK_ACCOUNT' | 'PAYPAL';
  isDefault: boolean;
  isActive: boolean;
  nickname?: string;
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
  displayInfo: {
    lastFourDigits: string;
    cardBrand?: string;
    bankName?: string;
    accountType?: string;
    expiryMonth?: string;
    expiryYear?: string;
  };
}

interface PaymentMethodsManagerProps {
  onPaymentMethodChange?: (paymentMethods: PaymentMethod[]) => void;
}

export default function PaymentMethodsManager({ onPaymentMethodChange }: PaymentMethodsManagerProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddBank, setShowAddBank] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Card form state
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    nickname: ''
  });

  // Bank form state
  const [bankForm, setBankForm] = useState({
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
    bankName: '',
    accountType: 'checking',
    nickname: ''
  });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/v1/payment-methods', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.paymentMethods);
        onPaymentMethodChange?.(data.paymentMethods);
      } else {
        setError('Failed to load payment methods');
      }
    } catch (error) {
      setError('Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  };

  const addCardPaymentMethod = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/v1/payment-methods/card', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardForm),
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(prev => [...prev, data.paymentMethod]);
        onPaymentMethodChange?.([...paymentMethods, data.paymentMethod]);
        setSuccess('Card added successfully');
        setShowAddCard(false);
        setCardForm({
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cvv: '',
          cardholderName: '',
          nickname: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add card');
      }
    } catch (error) {
      setError('Failed to add card');
    } finally {
      setProcessing(false);
    }
  };

  const addBankPaymentMethod = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/v1/payment-methods/bank-account', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bankForm),
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(prev => [...prev, data.paymentMethod]);
        onPaymentMethodChange?.([...paymentMethods, data.paymentMethod]);
        setSuccess('Bank account added successfully');
        setShowAddBank(false);
        setBankForm({
          accountNumber: '',
          routingNumber: '',
          accountHolderName: '',
          bankName: '',
          accountType: 'checking',
          nickname: ''
        });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add bank account');
      }
    } catch (error) {
      setError('Failed to add bank account');
    } finally {
      setProcessing(false);
    }
  };

  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/v1/payment-methods/${paymentMethodId}/default`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPaymentMethods(prev => 
          prev.map(pm => ({
            ...pm,
            isDefault: pm.id === paymentMethodId
          }))
        );
        setSuccess('Default payment method updated');
      } else {
        setError('Failed to update default payment method');
      }
    } catch (error) {
      setError('Failed to update default payment method');
    }
  };

  const deletePaymentMethod = async (paymentMethodId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/v1/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));
        onPaymentMethodChange?.(paymentMethods.filter(pm => pm.id !== paymentMethodId));
        setSuccess('Payment method deleted successfully');
      } else {
        setError('Failed to delete payment method');
      }
    } catch (error) {
      setError('Failed to delete payment method');
    }
  };

  const formatCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const getCardIcon = (cardBrand?: string) => {
    switch (cardBrand?.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      case 'discover':
        return '💳';
      default:
        return '💳';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-600">Loading payment methods...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
          <p className="text-gray-600">Manage your payment methods for automatic monthly billing</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddCard(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Card</span>
          </button>
          <button
            onClick={() => setShowAddBank(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Building2 className="w-4 h-4" />
            <span>Add Bank</span>
          </button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800">{success}</span>
          </div>
        </div>
      )}

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
          <p className="text-gray-600 mb-4">Add a payment method to enable automatic monthly billing</p>
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => setShowAddCard(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Add Card
            </button>
            <button
              onClick={() => setShowAddBank(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
            >
              Add Bank Account
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-6 border rounded-xl ${
                method.isDefault ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {method.type === 'CARD' ? (
                      <span className="text-2xl">{getCardIcon(method.displayInfo.cardBrand)}</span>
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {method.nickname || 
                          (method.type === 'CARD' 
                            ? `${method.displayInfo.cardBrand?.toUpperCase()} ending in ${method.displayInfo.lastFourDigits}`
                            : `${method.displayInfo.bankName} ending in ${method.displayInfo.lastFourDigits}`
                          )
                        }
                      </h3>
                      {method.isDefault && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {method.type === 'CARD' ? (
                        `•••• •••• •••• ${method.displayInfo.lastFourDigits} • Expires ${method.displayInfo.expiryMonth}/${method.displayInfo.expiryYear}`
                      ) : (
                        `••••${method.displayInfo.lastFourDigits} • ${method.displayInfo.bankName} • ${method.displayInfo.accountType}`
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => setDefaultPaymentMethod(method.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Set as default"
                    >
                      <StarOff className="w-4 h-4" />
                    </button>
                  )}
                  {method.isDefault && (
                    <button
                      className="p-2 text-blue-600"
                      title="Default payment method"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deletePaymentMethod(method.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete payment method"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Credit Card</h3>
              <button
                onClick={() => setShowAddCard(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  value={formatCardNumber(cardForm.cardNumber)}
                  onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value.replace(/\s/g, '') })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    value={cardForm.expiryMonth}
                    onChange={(e) => setCardForm({ ...cardForm, expiryMonth: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">MM</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month.toString().padStart(2, '0')}>
                        {month.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={cardForm.expiryYear}
                    onChange={(e) => setCardForm({ ...cardForm, expiryYear: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">YYYY</option>
                    {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  value={cardForm.cardholderName}
                  onChange={(e) => setCardForm({ ...cardForm, cardholderName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nickname (Optional)</label>
                <input
                  type="text"
                  value={cardForm.nickname}
                  onChange={(e) => setCardForm({ ...cardForm, nickname: e.target.value })}
                  placeholder="My Business Card"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddCard(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addCardPaymentMethod}
                disabled={processing || !cardForm.cardNumber || !cardForm.expiryMonth || !cardForm.expiryYear || !cardForm.cardholderName}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>Add Card Securely</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bank Account Modal */}
      {showAddBank && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Bank Account</h3>
              <button
                onClick={() => setShowAddBank(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                  placeholder="1234567890"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number</label>
                <input
                  type="text"
                  value={bankForm.routingNumber}
                  onChange={(e) => setBankForm({ ...bankForm, routingNumber: e.target.value })}
                  placeholder="123456789"
                  maxLength={9}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                <input
                  type="text"
                  value={bankForm.accountHolderName}
                  onChange={(e) => setBankForm({ ...bankForm, accountHolderName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                <input
                  type="text"
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  placeholder="Chase Bank"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <select
                  value={bankForm.accountType}
                  onChange={(e) => setBankForm({ ...bankForm, accountType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="business">Business</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nickname (Optional)</label>
                <input
                  type="text"
                  value={bankForm.nickname}
                  onChange={(e) => setBankForm({ ...bankForm, nickname: e.target.value })}
                  placeholder="My Business Account"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddBank(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addBankPaymentMethod}
                disabled={processing || !bankForm.accountNumber || !bankForm.routingNumber || !bankForm.accountHolderName || !bankForm.bankName}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Add Bank Account Securely</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 