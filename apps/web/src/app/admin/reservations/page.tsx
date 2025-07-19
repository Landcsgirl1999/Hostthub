'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, User, Home, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Reservation {
  id: string;
  property: string;
  guest: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  totalAmount: number;
  guests: number;
  reservationId: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    // Mock data for now - replace with API call
    const mockReservations: Reservation[] = [
      {
        id: '1',
        property: 'Beach House #1',
        guest: 'John Smith',
        checkIn: '2024-01-20',
        checkOut: '2024-01-25',
        status: 'confirmed',
        totalAmount: 1350,
        guests: 4,
        reservationId: 'RES-001'
      },
      {
        id: '2',
        property: 'Mountain Cabin',
        guest: 'Sarah Johnson',
        checkIn: '2024-01-22',
        checkOut: '2024-01-28',
        status: 'pending',
        totalAmount: 2100,
        guests: 6,
        reservationId: 'RES-002'
      },
      {
        id: '3',
        property: 'City Apartment',
        guest: 'Mike Wilson',
        checkIn: '2024-01-18',
        checkOut: '2024-01-21',
        status: 'completed',
        totalAmount: 840,
        guests: 2,
        reservationId: 'RES-003'
      },
      {
        id: '4',
        property: 'Lake House',
        guest: 'Emily Davis',
        checkIn: '2024-01-25',
        checkOut: '2024-01-30',
        status: 'cancelled',
        totalAmount: 1650,
        guests: 5,
        reservationId: 'RES-004'
      }
    ];
    
    setReservations(mockReservations);
    setIsLoading(false);
  }, []);

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.reservationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || reservation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600 mt-2">Manage all property bookings and reservations</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl shadow-glow hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reservations..."
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
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reservations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReservations.map((reservation) => (
          <div key={reservation.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6 hover:shadow-glow transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{reservation.property}</h3>
                <p className="text-sm text-gray-600">{reservation.reservationId}</p>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(reservation.status)}
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                  {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{reservation.guest}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{reservation.checkIn} - {reservation.checkOut}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Home className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{reservation.guests} guests</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Amount:</span>
                <span className="font-bold text-gray-900">${reservation.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm">
                View Details
              </button>
              {reservation.status === 'pending' && (
                <button className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-colors text-sm">
                  Confirm
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredReservations.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-900">{reservations.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-glow">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{reservations.filter(r => r.status === 'confirmed').length}</p>
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
              <p className="text-2xl font-bold text-gray-900">{reservations.filter(r => r.status === 'pending').length}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 shadow-glow">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${reservations.reduce((sum, r) => sum + r.totalAmount, 0).toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-glow">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 