'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserCheck, LogOut } from 'lucide-react';

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedUser, setImpersonatedUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    const impersonationToken = localStorage.getItem('impersonationToken');
    const impersonatedUserData = localStorage.getItem('impersonatedUser');
    
    if (!userData || !token) {
      router.push('/sign-in');
      return;
    }

    const userObj = JSON.parse(userData);
    if (userObj.role !== 'SUPER_ADMIN') {
      router.push('/sign-in');
      return;
    }

    // Check if we're impersonating someone
    if (impersonationToken && impersonatedUserData) {
      setIsImpersonating(true);
      setImpersonatedUser(JSON.parse(impersonatedUserData));
    }

    setUser(userObj);
    setIsLoading(false);
  }, [router]);

  // Determine active tab based on current pathname
  useEffect(() => {
    if (pathname === '/dashboard/super-admin') {
      setActiveTab('overview');
    } else if (pathname === '/dashboard/super-admin/users') {
      setActiveTab('users');
    } else if (pathname.includes('/admin/properties')) {
      setActiveTab('properties');
    } else if (pathname.includes('/admin/analytics')) {
      setActiveTab('analytics');
    } else if (pathname.includes('/admin/billing')) {
      setActiveTab('billing');
    } else if (pathname.includes('/admin/settings')) {
      setActiveTab('system');
    } else if (pathname.includes('/admin/reports')) {
      setActiveTab('reports');
    }
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stopImpersonation = () => {
    localStorage.removeItem('impersonationToken');
    localStorage.removeItem('impersonatedUser');
    setIsImpersonating(false);
    setImpersonatedUser(null);
    // Refresh the page to reset the state
    window.location.reload();
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: '📊', path: '/dashboard/super-admin' },
    { id: 'users', label: 'Users', icon: '👥', path: '/dashboard/super-admin/users' },
    { id: 'properties', label: 'Properties', icon: '🏠', path: '/admin/properties' },
    { id: 'analytics', label: 'Analytics', icon: '📈', path: '/admin/analytics' },
    { id: 'billing', label: 'Billing', icon: '💰', path: '/admin/billing' },
    { id: 'system', label: 'System', icon: '⚙️', path: '/admin/settings' },
    { id: 'reports', label: 'Reports', icon: '📋', path: '/admin/reports' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Sidebar - Always Visible */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md border-r border-blue-100">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                HostItHub
              </span>
            </div>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-semibold text-lg">
                  {isImpersonating ? impersonatedUser?.name?.charAt(0) : user?.name?.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {isImpersonating ? impersonatedUser?.name : user?.name}
                </p>
                <p className="text-xs text-blue-600">
                  {isImpersonating ? `Impersonating ${impersonatedUser?.role}` : 'Super Admin'}
                </p>
                {isImpersonating && (
                  <p className="text-xs text-orange-600 mt-1">As {user?.name}</p>
                )}
              </div>
            </div>
            {isImpersonating && (
              <button
                onClick={stopImpersonation}
                className="mt-3 w-full flex items-center justify-center space-x-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
              >
                <UserCheck className="w-4 h-4" />
                <span>Stop Impersonation</span>
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.path !== pathname) {
                    router.push(item.path);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-blue-100">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">System Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Users</span>
                  <span className="text-sm font-semibold text-blue-600">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Properties</span>
                  <span className="text-sm font-semibold text-green-600">892</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Revenue</span>
                  <span className="text-sm font-semibold text-purple-600">$2.4M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="p-4 border-t border-blue-100">
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
        <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">H</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      HostItHub
                    </h1>
                    <span className="text-sm text-blue-600 font-medium">Super Admin Dashboard</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Impersonation Indicator */}
                {isImpersonating && (
                  <div className="flex items-center space-x-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg border border-orange-200">
                    <UserCheck className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      Impersonating {impersonatedUser?.name}
                    </span>
                    <button
                      onClick={stopImpersonation}
                      className="ml-2 text-orange-600 hover:text-orange-800"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users, properties, analytics..."
                    className="w-80 pl-12 pr-4 py-3 bg-white/70 backdrop-blur-sm border border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                  <svg className="absolute left-4 top-3.5 h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Notifications */}
                <button className="relative p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-2xl transition-all duration-300 group">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.83 2.83A4 4 0 016.34 2h11.32a4 4 0 013.51 2.83L22 8H2l2.83-5.17z" />
                  </svg>
                  <span className="absolute top-2 right-2 block h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-blue-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">System Notifications</h3>
                      <div className="space-y-2">
                        <div className="p-3 bg-blue-50 rounded-xl">
                          <p className="text-sm text-gray-700">New user registration requires approval</p>
                          <p className="text-xs text-blue-600">5 minutes ago</p>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-xl">
                          <p className="text-sm text-gray-700">System maintenance scheduled</p>
                          <p className="text-xs text-orange-600">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-blue-50 transition-all duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{user?.name?.charAt(0)}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-blue-600">Super Admin</p>
                    </div>
                    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-blue-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <div className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">{user?.name?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user?.name}</p>
                          <p className="text-sm text-blue-600">{user?.email}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Profile</span>
                        </button>
                        <button 
                          onClick={() => router.push('/dashboard/super-admin/settings')}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>Settings</span>
                        </button>
                        <hr className="border-gray-200" />
                        <button 
                          onClick={() => {
                            localStorage.removeItem('authToken');
                            localStorage.removeItem('user');
                            router.push('/sign-in');
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
} 