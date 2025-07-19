'use client';

import { useState, useEffect } from 'react';

export default function TestUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔄 Test component: useEffect running');
    
    const loadUsers = async () => {
      try {
        console.log('🔄 Test component: Loading users...');
        const response = await fetch('/api/v1/users');
        
        if (!response.ok) {
          throw new Error(`Failed to load users: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('📊 Test component: API result:', result);
        
        setUsers(result.users || []);
        setIsLoading(false);
        
        console.log('✅ Test component: Users loaded successfully');
        
      } catch (error) {
        console.error('❌ Test component: Error loading users:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  console.log('🔍 Test component: Render state:', { isLoading, usersCount: users.length, error });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
          <p className="mt-2 text-sm text-gray-500">Users: {users.length}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">Error loading users</p>
          <p className="mt-2 text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Test Users Page</h1>
      <p className="mb-4">Users loaded: {users.length}</p>
      
      {users.length > 0 ? (
        <div className="bg-white rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Users:</h2>
          <ul className="space-y-2">
            {users.map((user: any) => (
              <li key={user.id} className="border-b pb-2">
                <strong>{user.firstName} {user.lastName}</strong> - {user.email} ({user.role})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-600">No users found</p>
      )}
    </div>
  );
} 