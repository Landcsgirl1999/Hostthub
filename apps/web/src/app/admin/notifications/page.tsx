'use client';

import { useState, useEffect } from 'react';
import { Bell, Settings, CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  category: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Mock data for now - replace with API call
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        title: 'Payment Received',
        message: 'Payment of $1,350 has been received for Beach House #1 reservation.',
        date: '2024-01-15 10:30',
        isRead: false,
        category: 'payments'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Maintenance Required',
        message: 'Hot water issue reported at Mountain Cabin. Maintenance team has been notified.',
        date: '2024-01-15 09:15',
        isRead: false,
        category: 'maintenance'
      },
      {
        id: '3',
        type: 'info',
        title: 'New Review',
        message: 'New 5-star review received for City Apartment from John Smith.',
        date: '2024-01-14 16:45',
        isRead: true,
        category: 'reviews'
      },
      {
        id: '4',
        type: 'error',
        title: 'Booking Cancelled',
        message: 'Reservation for Lake House has been cancelled by guest.',
        date: '2024-01-14 14:20',
        isRead: true,
        category: 'bookings'
      },
      {
        id: '5',
        type: 'success',
        title: 'Task Completed',
        message: 'Cleaning task for Beach House #1 has been marked as completed.',
        date: '2024-01-14 12:30',
        isRead: true,
        category: 'tasks'
      }
    ];
    
    setNotifications(mockNotifications);
    setIsLoading(false);
  }, []);

  const filteredNotifications = notifications.filter(notification => {
    return filterCategory === 'all' || notification.category === filterCategory;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <X className="w-5 h-5 text-red-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50/50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50/50';
      case 'error':
        return 'border-l-red-500 bg-red-50/50';
      case 'info':
        return 'border-l-blue-500 bg-blue-50/50';
      default:
        return 'border-l-gray-500 bg-gray-50/50';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">Stay updated with important alerts and updates</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={markAllAsRead}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Mark all as read
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow-glow hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      {showSettings && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Email Notifications</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">New bookings</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Payment confirmations</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Maintenance alerts</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Guest reviews</span>
                </label>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Push Notifications</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Urgent alerts</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Task updates</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">System updates</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter by:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="payments">Payments</option>
            <option value="bookings">Bookings</option>
            <option value="maintenance">Maintenance</option>
            <option value="reviews">Reviews</option>
            <option value="tasks">Tasks</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6 border-l-4 ${getNotificationColor(notification.type)} ${
              !notification.isRead ? 'ring-2 ring-blue-200' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{notification.date}</span>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {notification.category}
                  </span>
                  {!notification.isRead && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">You're all caught up! Check back later for new updates.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 shadow-glow">
              <Bell className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unread</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => !n.isRead).length}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-glow">
              <Bell className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.date.includes('2024-01-15')).length}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-glow">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.type === 'error' || n.type === 'warning').length}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-glow">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 