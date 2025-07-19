'use client';

import { useState } from 'react';
import { 
  Shield, 
  Eye, 
  Edit, 
  Plus, 
  Trash2, 
  Check,
  X,
  Settings,
  Download,
  Upload
} from 'lucide-react';

interface PermissionMatrixProps {
  permissions: {
    [category: string]: {
      view: boolean;
      modify: boolean;
      create: boolean;
      delete: boolean;
    };
  };
  onPermissionChange: (category: string, permission: string, value: boolean) => void;
  onBulkUpdate?: (category: string, permission: string, value: boolean) => void;
  readOnly?: boolean;
}

const PERMISSION_CATEGORIES = [
  'LISTINGS', 'RESERVATIONS', 'OWNER_STAYS', 'BOOKING_ENGINE', 
  'FINANCIAL_REPORTING', 'ANALYTICS', 'RENTAL_ACTIVITY', 'OCCUPANCY_REPORT',
  'EXPENSES_EXTRAS', 'OWNER_STATEMENTS', 'CHANNEL_MANAGER', 'TASK_MANAGER',
  'INTEGRATIONS', 'AUTOMATIONS', 'MESSAGES', 'GUEST_INVOICING', 'REVIEWS',
  'GUESTBOOK', 'SMART_LOCK_CODES', 'SAFELY_INSURANCE', 'NOTIFICATION_SETTINGS'
];

const PERMISSION_LEVELS = [
  { key: 'view', label: 'View', icon: Eye, color: 'text-blue-600' },
  { key: 'modify', label: 'Modify', icon: Edit, color: 'text-yellow-600' },
  { key: 'create', label: 'Create', icon: Plus, color: 'text-green-600' },
  { key: 'delete', label: 'Delete', icon: Trash2, color: 'text-red-600' }
];

export default function PermissionsMatrix({ 
  permissions, 
  onPermissionChange, 
  onBulkUpdate,
  readOnly = false 
}: PermissionMatrixProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<string | null>(null);

  const handleBulkUpdate = (category: string, permission: string) => {
    if (!onBulkUpdate) return;
    
    const currentValue = permissions[category]?.[permission] || false;
    onBulkUpdate(category, permission, !currentValue);
  };

  const exportToCSV = () => {
    const headers = ['Category', 'View', 'Modify', 'Create', 'Delete'];
    const rows = PERMISSION_CATEGORIES.map(category => [
      category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      permissions[category]?.view ? 'Yes' : 'No',
      permissions[category]?.modify ? 'Yes' : 'No',
      permissions[category]?.create ? 'Yes' : 'No',
      permissions[category]?.delete ? 'Yes' : 'No'
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'permissions-matrix.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: any } = {
      LISTINGS: '🏠',
      RESERVATIONS: '📅',
      OWNER_STAYS: '👤',
      BOOKING_ENGINE: '🔧',
      FINANCIAL_REPORTING: '💰',
      ANALYTICS: '📊',
      RENTAL_ACTIVITY: '📈',
      OCCUPANCY_REPORT: '📋',
      EXPENSES_EXTRAS: '💸',
      OWNER_STATEMENTS: '📄',
      CHANNEL_MANAGER: '🔗',
      TASK_MANAGER: '✅',
      INTEGRATIONS: '🔌',
      AUTOMATIONS: '🤖',
      MESSAGES: '💬',
      GUEST_INVOICING: '🧾',
      REVIEWS: '⭐',
      GUESTBOOK: '📝',
      SMART_LOCK_CODES: '🔐',
      SAFELY_INSURANCE: '🛡️',
      NOTIFICATION_SETTINGS: '🔔'
    };
    return iconMap[category] || '📁';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Permissions Matrix</h3>
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

      {/* Matrix Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Category
                </th>
                {PERMISSION_LEVELS.map((level) => (
                  <th key={level.key} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    <div className="flex items-center justify-center space-x-1">
                      <level.icon className="w-3 h-3" />
                      <span>{level.label}</span>
                    </div>
                  </th>
                ))}
                {!readOnly && onBulkUpdate && (
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bulk Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {PERMISSION_CATEGORIES.map((category) => (
                <tr 
                  key={category}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedCategory === category ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getCategoryIcon(category)}</span>
                      <span>
                        {category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </td>
                  
                  {PERMISSION_LEVELS.map((level) => (
                    <td key={level.key} className="px-4 py-3 text-center border-r border-gray-200">
                      {readOnly ? (
                        <div className="flex items-center justify-center">
                          {permissions[category]?.[level.key] ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPermissionChange(category, level.key, !permissions[category]?.[level.key]);
                          }}
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all ${
                            permissions[category]?.[level.key]
                              ? 'bg-green-100 border-green-500 text-green-600'
                              : 'bg-gray-100 border-gray-300 text-gray-400 hover:border-gray-400'
                          }`}
                        >
                          {permissions[category]?.[level.key] && <Check className="w-3 h-3" />}
                        </button>
                      )}
                    </td>
                  ))}
                  
                  {!readOnly && onBulkUpdate && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        {PERMISSION_LEVELS.map((level) => (
                          <button
                            key={level.key}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBulkUpdate(category, level.key);
                            }}
                            className={`p-1 rounded transition-colors ${
                              permissions[category]?.[level.key]
                                ? 'text-green-600 hover:bg-green-100'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={`Toggle ${level.label} for all categories`}
                          >
                            <level.icon className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PERMISSION_LEVELS.map((level) => {
            const count = PERMISSION_CATEGORIES.filter(
              category => permissions[category]?.[level.key]
            ).length;
            const total = PERMISSION_CATEGORIES.length;
            
            return (
              <div key={level.key} className="text-center">
                <div className="flex items-center justify-center space-x-1 mb-1">
                  <level.icon className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-900">{level.label}</span>
                </div>
                <div className="text-lg font-bold text-gray-900">{count}</div>
                <div className="text-xs text-gray-500">of {total} categories</div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-blue-600 h-1 rounded-full transition-all"
                    style={{ width: `${(count / total) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Permission Levels</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {PERMISSION_LEVELS.map((level) => (
            <div key={level.key} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${level.color.replace('text-', 'bg-')}`}></div>
              <span className="text-gray-700">{level.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 