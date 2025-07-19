'use client';

import { useState } from 'react';

export default function TestCalendarPage() {
  const [testDate, setTestDate] = useState('2024-07-16');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testCalendarConnection = async () => {
    setLoading(true);
    try {
      const startDate = testDate;
      const endDate = testDate;
      
      console.log('Testing calendar connection for:', startDate);
      
      const response = await fetch(`/api/calendar/events?startDate=${startDate}&endDate=${endDate}&userId=1`);
      const data = await response.json();
      
      console.log('API Response:', data);
      setResults(data);
      
    } catch (error) {
      console.error('Test failed:', error);
      setResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Google Calendar Connection Test</h1>
      
      <div className="bg-white rounded-lg p-6 shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Test Parameters</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Date (YYYY-MM-DD)
            </label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <button
            onClick={testCalendarConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Calendar Connection'}
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-4">Test Results</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
          
          {results.events && results.events.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Events Found:</h3>
              <ul className="space-y-2">
                {results.events.map((event: any, index: number) => (
                  <li key={index} className="bg-green-50 p-3 rounded-lg">
                    <div className="font-medium">{event.summary}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(event.start).toLocaleString()}
                    </div>
                    {event.hasGoogleMeet && (
                      <div className="text-sm text-blue-600">Has Google Meet</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}