'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  PieChart,
  LineChart,
  Activity,
  Target,
  Building2,
  Filter,
  Download,
  Share2,
  Eye,
  Settings,
  Zap,
  Calendar,
  Users,
  Star,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface PortfolioStats {
  totalProperties: number;
  totalRevenue: number;
  averageOccupancy: number;
  averageADR: number;
  averageRevPAR: number;
  totalBookings: number;
  marketShare: number;
  priceOptimization: number;
  revenueGrowth: number;
  occupancyGrowth: number;
  adrGrowth: number;
  revparGrowth: number;
}

interface PropertyPerformance {
  id: string;
  name: string;
  revenue: number;
  occupancy: number;
  adr: number;
  revPAR: number;
  bookings: number;
  rating: number;
  status: 'performing' | 'underperforming' | 'excellent';
  growth: number;
}

export default function PortfolioAnalyticsPage() {
  const [stats, setStats] = useState<PortfolioStats>({
    totalProperties: 0,
    totalRevenue: 0,
    averageOccupancy: 0,
    averageADR: 0,
    averageRevPAR: 0,
    totalBookings: 0,
    marketShare: 0,
    priceOptimization: 0,
    revenueGrowth: 0,
    occupancyGrowth: 0,
    adrGrowth: 0,
    revparGrowth: 0
  });

  const [properties, setProperties] = useState<PropertyPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setStats({
        totalProperties: 12,
        totalRevenue: 156800,
        averageOccupancy: 78.5,
        averageADR: 189.00,
        averageRevPAR: 148.35,
        totalBookings: 829,
        marketShare: 15.2,
        priceOptimization: 92.3,
        revenueGrowth: 12.5,
        occupancyGrowth: 5.8,
        adrGrowth: 3.7,
        revparGrowth: 15.2
      });

      setProperties([
        {
          id: '1',
          name: 'Beachfront Villa',
          revenue: 45600,
          occupancy: 85,
          adr: 299,
          revPAR: 254.15,
          bookings: 152,
          rating: 4.8,
          status: 'excellent',
          growth: 18.5
        },
        {
          id: '2',
          name: 'Downtown Loft',
          revenue: 34200,
          occupancy: 72,
          adr: 189,
          revPAR: 136.08,
          bookings: 181,
          rating: 4.6,
          status: 'performing',
          growth: 8.2
        },
        {
          id: '3',
          name: 'Mountain Cabin',
          revenue: 28900,
          occupancy: 68,
          adr: 159,
          revPAR: 108.12,
          bookings: 182,
          rating: 4.7,
          status: 'performing',
          growth: 12.1
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, change, subtitle, icon: Icon, color = 'blue' }: any) => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' && title.includes('Revenue') ? `$${value.toLocaleString()}` : value}
            {typeof value === 'number' && title.includes('ADR') ? `$${value}` : ''}
            {typeof value === 'number' && title.includes('RevPAR') ? `$${value}` : ''}
            {typeof value === 'number' && title.includes('Occupancy') ? `${value}%` : ''}
            {typeof value === 'number' && title.includes('Share') ? `${value}%` : ''}
            {typeof value === 'number' && title.includes('Optimization') ? `${value}%` : ''}
            {typeof value === 'number' && title.includes('Properties') ? value : ''}
            {typeof value === 'number' && title.includes('Bookings') ? value.toLocaleString() : ''}
          </p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {change && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ml-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}% from last period
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl 