'use client';

import { useState } from 'react';
import { 
  Bell, 
  Smartphone, 
  Mail, 
  Monitor, 
  Check,
  X,
  Settings,
  Download,
  CreditCard,
  Calendar,
  AlertTriangle,
  MessageSquare,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface NotificationSettingsProps {
  notifications: {
    [event: string]: {
      dashboard: boolean;
      mobile: boolean;
      email: boolean;
    };
  };
  onNotificationChange: (event: string, channel: string, value: boolean) => void;
  onBulkUpdate?: (event: string, channel: string, value: boolean) => void;
  readOnly?: boolean;
}

const NOTIFICATION_EVENTS = [
  // Reservation Events
  { 
    key: 'NEW_RESERVATION', 
    label: 'New Reservation', 
    icon: Calendar, 
    category: 'Reservations',
    description: 'When a new reservation is created'
  },
  { 
    key: 'NEW_OWNER_STAY', 
    label: 'New Owner Stay', 
    icon: Calendar, 
    category: 'Reservations',
    description: 'When an owner books a stay'
  },
  { 
    key: 'OWNER_STAY_MODIFIED', 
    label: 'Owner Stay Modified', 
    icon: Calendar, 
    category: 'Reservations',
    description: 'When an owner stay is updated'
  },
  { 
    key: 'RESERVATION_CANCELLED', 
    label: 'Reservation Cancelled', 
    icon: X, 
    category: 'Reservations',
    description: 'When a reservation is cancelled'
  },
  { 
    key: 'NEW_INQUIRY', 
    label: 'New Inquiry', 
    icon: MessageSquare, 
    category: 'Reservations',
    description: 'When a guest sends an inquiry'
  },
  { 
    key: 'RESERVATION_PENDING', 
    label: 'Reservation Pending', 
    icon: AlertTriangle, 
    category: 'Reservations',
    description: 'When a reservation needs approval'
  },
  { 
    key: 'AIRBNB_ALTERATION_REQUEST', 
    label: 'Airbnb Alteration Request', 
    icon: Calendar, 
    category: 'Reservations',
    description: 'When Airbnb requests a change'
  },
  { 
    key: 'RENTAL_AGREEMENT_SIGNED', 
    label: 'Rental Agreement Signed', 
    icon: Check, 
    category: 'Reservations',
    description: 'When a rental agreement is signed'
  },
  
  // Payment Events
  { 
    key: 'ADD_CARD_SUCCESS', 
    label: 'Add Card Success', 
    icon: CreditCard, 
    category: 'Payments',
    description: 'When a payment method is successfully added'
  },
  { 
    key: 'ADD_CARD_FAILED', 
    label: 'Add Card Failed', 
    icon: CreditCard, 
    category: 'Payments',
    description: 'When adding a payment method fails'
  },
  { 
    key: 'CHARGE_SUCCESS', 
    label: 'Charge Success', 
    icon: CreditCard, 
    category: 'Payments',
    description: 'When a payment is successfully processed'
  },
  { 
    key: 'CHARGE_FAILED', 
    label: 'Charge Failed', 
    icon: CreditCard, 
    category: 'Payments',
    description: 'When a payment fails'
  },
  { 
    key: 'REFUND_SUCCESS', 
    label: 'Refund Success', 
    icon: CreditCard, 
    category: 'Payments',
    description: 'When a refund is successfully processed'
  },
  { 
    key: 'REFUND_FAILED', 
    label: 'Refund Failed', 
    icon: CreditCard, 
    category: 'Payments',
    description: 'When a refund fails'
  },
  { 
    key: 'PRE_AUTH_SUCCESS', 
    label: 'Pre-Auth Success', 
    icon: CreditCard, 
    category: 'Payments',
    description: 'When a pre-authorization succeeds'
  },
  { 
    key: 'PRE_AUTH_FAILED', 
    label: 'Pre-Auth Failed', 
    icon: CreditCard, 
    category: 'Payments',
    description: 'When a pre-authorization fails'
  }
];

const NOTIFICATION_CHANNELS = [
  { key: 'email', label: 'Email', icon: Mail, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  { key: 'dashboard', label: 'Dashboard', icon: Monitor, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { key: 'mobile', label: 'Mobile App', icon: Smartphone, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
];

export default function NotificationSettings({ 
  notifications, 
  onNotificationChange, 
  onBulkUpdate,
  readOnly = false 
}: NotificationSettingsProps) {
  const [expandedChannels, setExpandedChannels] = useState<Set<string>>(new Set(['email', 'dashboard', 'mobile']));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleBulkUpdate = (channel: string, value: boolean) => {
    if (!onBulkUpdate) return;
    
    NOTIFICATION_EVENTS.forEach(event => {
      onBulkUpdate(event.key, channel, value);
    });
  };

  const toggleChannelExpansion = (channelKey: string) => {
    const newExpanded = new Set(expandedChannels);
    if (newExpanded.has(channelKey)) {
      newExpanded.delete(channelKey);
    } else {
      newExpanded.add(channelKey);
    }
    setExpandedChannels(newExpanded);
  };

  const exportToCSV = () => {
    const headers = ['Channel', 'Event', 'Category', 'Enabled'];
    const rows: string[][] = [];
    
    NOTIFICATION_CHANNELS.forEach(channel => {
      NOTIFICATION_EVENTS.forEach(event => {
        rows.push([
          channel.label,
          event.label,
          event.category,
          notifications[event.key]?.[channel.key] ? 'Yes' : 'No'
        ]);
      });
    });

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notification-settings.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredEvents = NOTIFICATION_EVENTS.filter(event => 
    selectedCategory === 'all' || event.category === selectedCategory
  );

  const categories = ['all', ...Array.from(new Set(NOTIFICATION_EVENTS.map(e => e.category)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
        </div>
        
        {!readOnly && (
          <div className="flex items-center space-x-2">
            <button
              onClick={exportToCSV}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="w-3 h-3 mr-1" />
              Export CSV
            </button>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Filter by category:</span>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Notification Channels */}
      <div className="space-y-4">
        {NOTIFICATION_CHANNELS.map((channel) => {
          const channelEvents = filteredEvents.filter(event => 
            notifications[event.key]?.[channel.key]
          );
          const totalEvents = filteredEvents.length;
          const enabledCount = channelEvents.length;
          
          return (
            <div key={channel.key} className={`border rounded-lg overflow-hidden ${channel.borderColor}`}>
              {/* Channel Header */}
              <div className={`${channel.bgColor} px-4 py-3 border-b ${channel.borderColor}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleChannelExpansion(channel.key)}
                      className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                    >
                      {expandedChannels.has(channel.key) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <channel.icon className={`w-5 h-5 ${channel.color}`} />
                      <span className="font-medium text-gray-900">{channel.label}</span>
                    </button>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{enabledCount} of {totalEvents} enabled</span>
                      <div className="w-16 bg-gray-200 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full transition-all ${channel.color.replace('text-', 'bg-')}`}
                          style={{ width: `${(enabledCount / totalEvents) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {!readOnly && onBulkUpdate && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBulkUpdate(channel.key, true)}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        Enable All
                      </button>
                      <button
                        onClick={() => handleBulkUpdate(channel.key, false)}
                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        Disable All
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Channel Events */}
              {expandedChannels.has(channel.key) && (
                <div className="bg-white">
                  <div className="divide-y divide-gray-200">
                    {filteredEvents.map((event) => (
                      <div key={event.key} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <event.icon className="w-4 h-4 text-gray-500" />
                            <div>
                              <div className="font-medium text-gray-900">{event.label}</div>
                              <div className="text-xs text-gray-500">{event.description}</div>
                              <div className="text-xs text-gray-400">{event.category}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {readOnly ? (
                              <div className="flex items-center justify-center">
                                {notifications[event.key]?.[channel.key] ? (
                                  <Check className="w-4 h-4 text-green-600" />
                                ) : (
                                  <X className="w-4 h-4 text-red-600" />
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => onNotificationChange(event.key, channel.key, !notifications[event.key]?.[channel.key])}
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                                  notifications[event.key]?.[channel.key]
                                    ? `bg-green-100 border-green-500 text-green-600`
                                    : 'bg-gray-100 border-gray-300 text-gray-400 hover:border-gray-400'
                                }`}
                              >
                                {notifications[event.key]?.[channel.key] && <Check className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {NOTIFICATION_CHANNELS.map((channel) => {
            const count = NOTIFICATION_EVENTS.filter(
              event => notifications[event.key]?.[channel.key]
            ).length;
            const total = NOTIFICATION_EVENTS.length;
            
            return (
              <div key={channel.key} className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <channel.icon className={`w-4 h-4 ${channel.color}`} />
                  <span className="text-sm font-medium text-gray-900">{channel.label}</span>
                </div>
                <div className="text-lg font-bold text-gray-900">{count}</div>
                <div className="text-xs text-gray-500">of {total} events</div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all ${channel.color.replace('text-', 'bg-')}`}
                    style={{ width: `${(count / total) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-3">Notification Summary by Category</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from(new Set(NOTIFICATION_EVENTS.map(e => e.category))).map(category => {
            const categoryEvents = NOTIFICATION_EVENTS.filter(e => e.category === category);
            const enabledCount = categoryEvents.filter(event => 
              notifications[event.key]?.dashboard || 
              notifications[event.key]?.mobile || 
              notifications[event.key]?.email
            ).length;
            
            return (
              <div key={category} className="flex items-center justify-between p-2 bg-white rounded border">
                <span className="text-sm font-medium text-gray-900">{category}</span>
                <span className="text-sm text-gray-500">
                  {enabledCount} of {categoryEvents.length} enabled
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 