'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'manager' | 'super-admin';
  status: 'active' | 'inactive' | 'ghosted';
  createdAt: string;
  lastLogin?: string;
  phone?: string;
  properties?: number;
}

export default function SuperAdminUsersPage() {
  console.log('🔄 Component rendering');
  
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 useEffect triggered');
    
    const loadUsers = async () => {
      try {
        console.log('🔄 Loading users...');
        console.log('🔄 Making fetch request to /api/v1/users');
        
        const response = await fetch('/api/v1/users');
        console.log('📊 Response status:', response.status);
        console.log('📊 Response ok:', response.ok);
        
        if (!response.ok) {
          throw new Error(`Failed to load users: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📊 API result:', result);
        console.log('📊 API result.users:', result.users);
        console.log('📊 API result.users type:', typeof result.users);
        console.log('📊 API result.users length:', result.users?.length);
        
        const apiUsers = result.users || [];
        console.log('📊 API returned users:', apiUsers.length);
        console.log('📋 First user:', apiUsers[0]);
        
        // Force a small delay to ensure state updates are processed
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('🔄 Setting users state with:', apiUsers.length, 'users');
        setUsers(apiUsers);
        console.log('🔄 Setting isLoading to false');
        setIsLoading(false);
        
        console.log('✅ Users loaded successfully');
        
      } catch (error) {
        console.error('❌ Error loading users:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setUsers([]);
        setIsLoading(false);
      }
    };

    console.log('🔄 About to call loadUsers');
    loadUsers();
    console.log('🔄 loadUsers called');
  }, []);

  console.log('🔍 Current state:', {
    isLoading,
    usersCount: users.length,
    error
  });

  if (isLoading) {
    console.log('🔄 Showing loading screen...');
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
          <p className="mt-2 text-sm text-gray-500">Users: {users.length}</p>
          <p className="mt-2 text-sm text-gray-500">Loading: {isLoading ? 'true' : 'false'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg text-red-600">Error loading users</p>
          <p className="mt-2 text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  console.log('📋 About to render users table with', users.length, 'users');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HostItHub User Management</h1>
        <p className="text-gray-600">Manage all users in the system</p>
        <p className="text-sm text-gray-500 mt-2">Users loaded: {users.length}</p>
      </div>
      
      {users.length > 0 ? (
        <div className="bg-white rounded-xl shadow-soft border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Properties
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-gray-500">{user.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.properties || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No users found</p>
          <p className="text-gray-500 text-sm mt-2">Users array length: {users.length}</p>
          <p className="text-gray-500 text-sm">Loading state: {isLoading ? 'true' : 'false'}</p>
        </div>
      )}
    </div>
  );
} 