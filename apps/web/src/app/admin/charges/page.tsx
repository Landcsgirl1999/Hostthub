'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Download, 
  Filter,
  Search,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  Building
} from 'lucide-react';
import Link from 'next/link';

interface PropertyCharge {
  id: string;
  amount: number;
  chargeType: 'SUBSCRIPTION' | 'SETUP' | 'OVERAGE' | 'ADDON';
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  description: string;
  createdAt: string;
  propertyId: string;
  property?: {
    name: string;
    address: string;
  };
  metadata?: any;
}

interface ChargeStats {
  total: number;
  pending: number;
  paid: number;
  failed: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  byType: {
    subscription: number;
    setup: number;
    overage: number;
    addon: number;
  };
}

export default function ChargesPage() {
  const [charges, setCharges] = useState<PropertyCharge[]>([]);
  const [stats, setStats] = useState<ChargeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchCharges();
    fetchStats();
  }, []);

  const fetchCharges = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      // For now, we'll use mock data since the API isn't fully implemented
      const mockCharges: PropertyCharge[] = [
        {
          id: 'CHG-001',
          amount: 29.99,
          chargeType: 'SUBSCRIPTION',
          status: 'PAID',
          description: 'Monthly subscription for Beach House',
          createdAt: '2024-07-15T10:00:00Z',
          propertyId: 'prop-1',
          property: {
            name: 'Beach House',
            address: '123 Ocean Drive, Malibu, CA'
          }
        },
        {
          id: 'CHG-002',
          amount: 99.00,
          chargeType: 'SETUP',
          status: 'PENDING',
          description: 'Setup fee for Mountain Cabin',
          createdAt: '2024-07-20T14:30:00Z',
          propertyId: 'prop-2',
          property: {
            name: 'Mountain Cabin',
            address: '456 Pine Ridge, Aspen, CO'
          }
        },
        {
          id: 'CHG-003',
          amount: 15.50,
          chargeType: 'OVERAGE',
          status: 'PAID',
          description: 'Overage charge for City Apartment',
          createdAt: '2024-07-18T09:15:00Z',
          propertyId: 'prop-3',
          property: {
            name: 'City Apartment',
            address: '789 Urban Street, NYC, NY'
          }
        },
        {
          id: 'CHG-004',
          amount: 49.99,
          chargeType: 'ADDON',
          status: 'PAID',
          description: 'Premium support addon',
          createdAt: '2024-07-12T16:45:00Z',
          propertyId: 'prop-1',
          property: {
            name: 'Beach House',
            address: '123 Ocean Drive, Malibu, CA'
          }
        }
      ];

      setCharges(mockCharges);
    } catch (error) {
      console.error('Error fetching charges:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats for now
      const mockStats: ChargeStats = {
        total: 156,
        pending: 8,
        paid: 142,
        failed: 6,
        totalAmount: 4521.75,
        paidAmount: 4123.25,
        pendingAmount: 398.50,
        byType: {
          subscription: 89,
          setup: 12,
          overage: 34,
          addon: 21
        }
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-4 h-4" />;
      case 'PENDING':
        return <Clock className="w-4 h-4" />;
      case 'FAILED':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SUBSCRIPTION':
        return 'bg-blue-100 text-blue-800';
      case 'SETUP':
        return 'bg-purple-100 text-purple-800';
      case 'OVERAGE':
        return 'bg-orange-100 text-orange-800';
      case 'ADDON':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCharges = charges.filter(charge => {
    const matchesSearch = charge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         charge.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         charge.property?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || charge.status === statusFilter;
    const matchesType = typeFilter === 'all' || charge.chargeType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading charges...</p>
        </div>
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
              <h1 className="text-3xl font-bold text-gray-900">Property Charges</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage property-specific charges and billing records
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Charge
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Charges
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.total}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.pending}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Paid
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stats.paid}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Amount
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatCurrency(stats.totalAmount)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search charges..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="FAILED">Failed</option>
                <option value="REFUNDED">Refunded</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="SUBSCRIPTION">Subscription</option>
                <option value="SETUP">Setup</option>
                <option value="OVERAGE">Overage</option>
                <option value="ADDON">Add-on</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Charges List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {filteredCharges.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No charges</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first property charge.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Charge
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredCharges.map((charge) => (
                <li key={charge.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 space-y-2">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(charge.status)}`}>
                          {getStatusIcon(charge.status)}
                          <span className="ml-1">{charge.status}</span>
                        </div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(charge.chargeType)}`}>
                          <Building className="w-3 h-3 mr-1" />
                          <span>{charge.chargeType}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {charge.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          {charge.property?.name} • {formatDate(charge.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(charge.amount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Charge #{charge.id}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {/* TODO: View charge details */}}
                          className="text-gray-400 hover:text-gray-600"
                          title="View Details"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {/* TODO: Download receipt */}}
                          className="text-gray-400 hover:text-gray-600"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Add Charge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Charge</h3>
              <p className="text-sm text-gray-500 mb-4">
                This feature is coming soon! You'll be able to add custom charges for properties.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Close
                </button>
                <button
                  onClick={() => {/* TODO: Implement charge creation */}}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Add Charge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 