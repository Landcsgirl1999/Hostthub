'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetTokenPage() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const getTokenFromAPI = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:3001/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'sierra.reynolds@hostit.com' }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setMessage('Token retrieved successfully!');
      } else {
        setMessage('Failed to get token from API');
      }
    } catch (error) {
      setMessage('Error getting token: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToken = () => {
    if (token) {
      localStorage.setItem('token', token);
      setMessage('Token saved to localStorage!');
    }
  };

  const goToTestUsers = () => {
    router.push('/test-users');
  };

  const goToDashboard = () => {
    router.push('/dashboard/super-admin/users');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Set Authentication Token</h1>
        
        <div className="space-y-4">
          <button
            onClick={getTokenFromAPI}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? 'Getting Token...' : 'Get Token from API'}
          </button>

          {token && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Token:
              </label>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                rows={3}
                placeholder="JWT token will appear here..."
              />
              <button
                onClick={saveToken}
                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Token to localStorage
              </button>
            </div>
          )}

          {message && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              {message}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Test Pages:</h3>
            <div className="space-y-2">
              <button
                onClick={goToTestUsers}
                className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Go to Test Users Page
              </button>
              <button
                onClick={goToDashboard}
                className="w-full bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Go to Super Admin Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 