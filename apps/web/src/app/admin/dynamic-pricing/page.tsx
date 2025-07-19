'use client';

import { useState, useEffect } from 'react';

interface PricingStats {
  totalRevenue: number;
  averagePrice: number;
  occupancyRate: number;
  priceOptimization: number;
}

interface PropertyPricing {
  id: string;
  name: string;
  location: string;
  currentPrice: number;
  recommendedPrice: number;
  minPrice: number;
  occupancy: number;
  revenue: number;
  status: string;
}

export default function DynamicPricingPage() {
  const [stats, setStats] = useState<PricingStats>({
    totalRevenue: 0,
    averagePrice: 0,
    occupancyRate: 0,
    priceOptimization: 0
  });

  const [properties, setProperties] = useState<PropertyPricing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalRevenue: 156800,
        averagePrice: 189.00,
        occupancyRate: 78.5,
        priceOptimization: 92.3
      });

      setProperties([
        {
          id: '1',
          name: 'Beachfront Villa',
          location: 'Malibu, CA',
          currentPrice: 299,
          recommendedPrice: 325,
          minPrice: 250,
          occupancy: 85,
          revenue: 45600,
          status: 'underpriced'
        },
        {
          id: '2',
          name: 'Downtown Loft',
          location: 'Los Angeles, CA',
          currentPrice: 189,
          recommendedPrice: 175,
          minPrice: 150,
          occupancy: 72,
          revenue: 34200,
          status: 'overpriced'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized': return 'bg-green-100 text-green-800';
      case 'underpriced': return 'bg-blue-100 text-blue-800';
      case 'overpriced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dynamic pricing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dynamic Pricing</h1>
              <p className="text-gray-600">AI-powered pricing optimization for maximum revenue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average ADR</p>
                <p className="text-2xl font-bold text-gray-900">${stats.averagePrice.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Price Optimization</p>
                <p className="text-2xl font-bold text-gray-900">{stats.priceOptimization}%</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Property Pricing Analysis</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recommended
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Occupancy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{property.name}</div>
                        <div className="text-sm text-gray-500">{property.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${property.currentPrice}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${property.recommendedPrice}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${property.minPrice}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.occupancy}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${property.revenue.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.status)}`}>
                        {property.status}
                      </span>
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