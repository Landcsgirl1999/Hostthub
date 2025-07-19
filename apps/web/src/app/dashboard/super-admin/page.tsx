'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    
    if (!userData || !token) {
      router.push('/sign-in');
      return;
    }

    const userObj = JSON.parse(userData);
    if (userObj.role !== 'SUPER_ADMIN') {
      router.push('/sign-in');
      return;
    }

    setUser(userObj);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HostItHub Super Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">🏠</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Properties</p>
              <p className="text-2xl font-bold text-gray-900">892</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$2.4M</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600">+15% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-blue-600">Live data</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-soft border border-white/20 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">👤</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">New user registration</p>
              <p className="text-xs text-gray-600">John Doe registered as a new homeowner</p>
            </div>
            <span className="text-xs text-blue-600">2 minutes ago</span>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🏠</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Property added</p>
              <p className="text-xs text-gray-600">Sunset Villa was added to the system</p>
            </div>
            <span className="text-xs text-green-600">15 minutes ago</span>
          </div>

          <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">💰</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Payment received</p>
              <p className="text-xs text-gray-600">Monthly subscription payment from Premium Plan</p>
            </div>
            <span className="text-xs text-purple-600">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
} 