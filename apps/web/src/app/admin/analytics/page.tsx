'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AnalyticsData {
  action: string;
  data: any;
  timestamp: string;
  sessionId: string;
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const response = await fetch('/api/analytics/track');
      const result = await response.json();
      
      // For now, we'll use localStorage data since the API is just logging
      const localData = localStorage.getItem('hostit_ai_data');
      if (localData) {
        setAnalyticsData(JSON.parse(localData));
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionCounts = () => {
    const counts: { [key: string]: number } = {};
    analyticsData.forEach(item => {
      counts[item.action] = (counts[item.action] || 0) + 1;
    });
    return Object.entries(counts).map(([action, count]) => ({ action, count }));
  };

  const getPageVisits = () => {
    const pageVisits = analyticsData.filter(item => item.action === 'page_visit');
    const counts: { [key: string]: number } = {};
    pageVisits.forEach(item => {
      const page = item.data.page || 'unknown';
      counts[page] = (counts[page] || 0) + 1;
    });
    return Object.entries(counts).map(([page, count]) => ({ page, count }));
  };

  const getUniqueSessions = () => {
    const sessions = new Set(analyticsData.map(item => item.sessionId));
    return sessions.size;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track user behavior and AI interactions for platform optimization</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Total Events</h3>
            <p className="text-3xl font-bold text-blue-600">{analyticsData.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Unique Sessions</h3>
            <p className="text-3xl font-bold text-green-600">{getUniqueSessions()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">AI Chat Interactions</h3>
            <p className="text-3xl font-bold text-purple-600">
              {analyticsData.filter(item => item.action.includes('ai_chat')).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Pricing Calculator Uses</h3>
            <p className="text-3xl font-bold text-orange-600">
              {analyticsData.filter(item => item.action === 'pricing_calculator_used').length}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Action Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">User Actions Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getActionCounts()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="action" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Page Visits */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Page Visits</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getPageVisits()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ page, percent }) => `${page} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {getPageVisits().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Raw Data Table */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-gray-900">Recent Events</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.slice(-10).reverse().map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.action}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <pre className="text-xs overflow-hidden">
                        {JSON.stringify(item.data, null, 2)}
                      </pre>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.sessionId.slice(-8)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 