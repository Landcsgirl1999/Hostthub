'use client';

import { useState } from 'react';

export default function TestLoginPage() {
  const [email, setEmail] = useState('Sierra.reynolds@Hostit.com');
  const [password, setPassword] = useState('Tigerpie5678!');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testDirectAPI = async () => {
    setLoading(true);
    setResult('Testing direct API...');

    try {
      const response = await fetch('http://localhost:3003/simple-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Direct API Success!\nUser: ${data.user.name}\nRole: ${data.user.role}\nToken: ${data.token.substring(0, 20)}...`);
      } else {
        setResult(`❌ Direct API Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Direct API Network Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testWebAppAPI = async () => {
    setLoading(true);
    setResult('Testing web app API...');

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Web App API Success!\nUser: ${data.user.name}\nRole: ${data.user.role}\nToken: ${data.token.substring(0, 20)}...`);
      } else {
        setResult(`❌ Web App API Error: ${data.error}`);
      }
    } catch (error) {
      setResult(`❌ Web App API Network Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Test Login</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="space-y-2">
            <button
              onClick={testDirectAPI}
              disabled={loading}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Test Direct API
            </button>
            
            <button
              onClick={testWebAppAPI}
              disabled={loading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Test Web App API
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-medium mb-2">Result:</h3>
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        </div>
      </div>
    </div>
  );
} 