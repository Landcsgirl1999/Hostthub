'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Payment {
  id: string;
  property: string;
  guest: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  method: string;
  reservationId: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Mock data for now - replace with API call
    const mockPayments: Payment[] = [
      {
        id: '1',
        property: 'Beach House #1',
        guest: 'John Smith',
        amount: 1350,
        status: 'completed',
        date: '2024-01-15',
        method: 'Credit Card',
        reservationId: 'RES-001'
      },
      {
        id: '2',
        property: 'Mountain Cabin',
        guest: 'Sarah Johnson',
        amount: 2100,
        status: 'pending',
        date: '2024-01-14',
        method: 'PayPal',
        reservationId: 'RES-002'
      },
      {
        id: '3',
        property: 'City Apartment',
        guest: 'Mike Wilson',
        amount: 840,
        status: 'failed',
        date: '2024-01-13',
        method: 'Credit Card',
        reservationId: 'RES-003'
      },
      {
        id: '4',
        property: 'Lake House',
        guest: 'Emily Davis',
        amount: 1650,
        status: 'completed',
        date: '2024-01-12',
        method: 'Bank Transfer',
        reservationId: 'RES-004'
      }
    ];
    
    setPayments(mockPayments);
    setIsLoading(false);
  }, []);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reservationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-2">Track and manage all payment transactions</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-200 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl shadow-glow hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Payment ID</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Property</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Guest</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Amount</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Method</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">#{payment.id}</p>
                      <p className="text-sm text-gray-600">{payment.reservationId}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{payment.property}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{payment.guest}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-gray-900">${payment.amount.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(payment.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-900">{payment.method}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-gray-900">{payment.date}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {payment.status === 'pending' && (
                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">$5,940</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-glow">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">$2,100</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-glow">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">$840</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-glow">
              <XCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">75%</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-glow">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 