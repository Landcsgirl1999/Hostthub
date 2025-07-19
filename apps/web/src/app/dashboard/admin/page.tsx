'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true); // Always true for permanent sidebar
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (!userData || !token) {
      router.push('/sign-in');
      return;
    }

    const userObj = JSON.parse(userData);
    if (userObj.role !== 'ADMIN') {
      router.push('/sign-in');
      return;
    }

    setUser(userObj);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: '📊', path: '/dashboard/admin' },
    { id: 'properties', label: 'Properties', icon: '🏠', path: '/admin/properties' },
    { id: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
    { id: 'tasks', label: 'Tasks', icon: '✅', path: '/admin/tasks' },
    { id: 'calendar', label: 'Calendar', icon: '📅', path: '/admin/calendar' },
    { id: 'analytics', label: 'Analytics', icon: '📈', path: '/admin/analytics' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/admin/settings' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Sidebar - Always Visible */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md border-r border-green-100">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-green-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                HostIt
              </span>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-green-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-lg">{user?.name?.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-green-600">Admin</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.path !== '/dashboard/admin') {
                    router.push(item.path);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-green-100">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Properties</span>
                  <span className="text-sm font-semibold text-green-600">45</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Users</span>
                  <span className="text-sm font-semibold text-blue-600">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Revenue</span>
                  <span className="text-sm font-semibold text-purple-600">$156K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="p-4 border-t border-green-100">
            <button
              onClick={() => {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                router.push('/sign-in');
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Modern Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">H</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      HostIt
                    </h1>
                    <span className="text-sm text-green-600 font-medium">Admin Dashboard</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search properties, users, tasks..."
                    className="w-80 pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-green-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                  <svg className="absolute left-4 top-3.5 h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Notifications */}
                <button className="relative p-3 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-2xl transition-all duration-300 group">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.83 2.83A4 4 0 016.34 2h11.32a4 4 0 013.51 2.83L22 8H2l2.83-5.17z" />
                  </svg>
                  <span className="absolute top-2 right-2 block h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                </button>

                {/* Help */}
                <button className="p-3 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-2xl transition-all duration-300">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-3 p-3 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-2xl transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-semibold">{user?.name?.charAt(0)}</span>
                    </div>
                    <span className="font-medium">{user?.name}</span>
                    <svg className="h-4 w-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-green-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">{user?.name?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-sm text-green-600">Admin</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <a href="#" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-green-50 rounded-xl transition-colors">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Profile Settings</span>
                        </a>
                        <a href="#" className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-green-50 rounded-xl transition-colors">
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Account Settings</span>
                        </a>
                        <hr className="my-2 border-green-100" />
                        <button
                          onClick={() => {
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('user');
                            router.push('/sign-in');
                          }}
                          className="flex items-center space-x-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full text-left"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 🎯</h2>
                  <p className="text-green-100 text-lg">Manage your properties and team efficiently</p>
                </div>
                <div className="text-right">
                  <p className="text-green-100">Today's Date</p>
                  <p className="text-2xl font-bold">{new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Managed Properties</p>
                      <p className="text-3xl font-bold text-gray-900">45</p>
                      <p className="text-green-600 text-sm font-medium">+5 this month</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Team Members</p>
                      <p className="text-3xl font-bold text-gray-900">23</p>
                      <p className="text-blue-600 text-sm font-medium">+2 this week</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Monthly Revenue</p>
                      <p className="text-3xl font-bold text-gray-900">$156K</p>
                      <p className="text-green-600 text-sm font-medium">+15% vs last month</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                  <button className="text-green-600 hover:text-green-700 font-medium">View All</button>
                </div>
                <div className="space-y-4">
                  {[
                    { action: 'New property added', property: 'Luxury Villa #123', time: '2 hours ago', type: 'success' },
                    { action: 'User registration', user: 'john.doe@example.com', time: '4 hours ago', type: 'info' },
                    { action: 'Maintenance completed', property: 'Downtown Condo', time: '6 hours ago', type: 'success' },
                    { action: 'Payment received', amount: '$2,450.00', time: '1 day ago', type: 'success' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.type === 'success' ? 'bg-green-500' :
                        activity.type === 'warning' ? 'bg-orange-500' :
                        'bg-blue-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.property || activity.user || activity.amount}</p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                    Add Property
                  </button>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                    Invite User
                  </button>
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                    Create Task
                  </button>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                    Generate Report
                  </button>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
                <div className="space-y-4">
                  {[
                    { event: 'Property Inspection', date: 'Tomorrow, 10:00 AM', property: 'Sunset Villa' },
                    { event: 'Team Meeting', date: 'Dec 20, 2:00 PM', property: 'Office' },
                    { event: 'Maintenance Visit', date: 'Dec 22, 9:00 AM', property: 'Downtown Condo' }
                  ].map((event, index) => (
                    <div key={index} className="p-4 bg-green-50 rounded-xl border border-green-200">
                      <p className="font-medium text-gray-900">{event.event}</p>
                      <p className="text-sm text-green-600">{event.date}</p>
                      <p className="text-sm text-gray-600">{event.property}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather Widget */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Weather</h3>
                <div className="text-center">
                  <div className="text-4xl mb-2">☀️</div>
                  <p className="text-3xl font-bold">72°F</p>
                  <p className="text-blue-100">Sunny</p>
                  <p className="text-sm text-blue-200 mt-2">Perfect for property viewings!</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 