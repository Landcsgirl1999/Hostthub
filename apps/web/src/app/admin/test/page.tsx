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

export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">✅ Admin Test Page</h1>
        <p className="text-blue-700">Admin layout is working correctly!</p>
      </div>
    </div>
  );
} 