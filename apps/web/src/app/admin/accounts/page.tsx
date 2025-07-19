'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Home, 
  MapPin, 
  Star, 
  ChevronRight, 
  Eye, 
  UserCheck,
  Building2,
  ClipboardList,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Download,
  MoreHorizontal
} from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'CONTRACTOR';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLogin: string;
  propertiesAssigned: number;
  tasksCompleted: number;
  tasksPending: number;
}

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  basePrice: number;
  rating: number;
  reviewCount: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  monthlyStats: PropertyMonthlyStats;
  assignedUsers: string[];
}

interface PropertyMonthlyStats {
  totalRevenue: number;
  occupancyRate: number;
  averagePrice: number;
  totalBookings: number;
  totalNights: number;
  maintenanceCosts: number;
  cleaningCosts: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assignedTo: string;
  propertyId: string;
  dueDate: string;
  completedDate?: string;
  estimatedCost: number;
  actualCost?: number;
}

interface Rental {
  id: string;
  propertyId: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  revenue: number;
  commission: number;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  outstandingInvoices: number;
  pendingPayments: number;
  averageOccupancy: number;
  averageDailyRate: number;
}

interface Account {
  id: string;
  name: string;
  type: 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'CONTRACTOR';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  lastActivity: string;
  contactEmail: string;
  contactPhone: string;
  totalProperties: number;
  totalUsers: number;
  totalTasks: number;
  totalRentals: number;
  financialSummary: FinancialSummary;
  users: User[];
  properties: Property[];
  tasks: Task[];
  rentals: Rental[];
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detailed'>('list');
  const [filters, setFilters] = useState({
    role: 'ALL',
    status: 'ALL',
    search: ''
  });

  useEffect(() => {
    loadAccountsData();
  }, []);

  useEffect(() => {
    filterAccounts();
  }, [accounts, filters]);

  const loadAccountsData = async () => {
    // Mock data - replace with API call
    const mockAccounts: Account[] = [
      {
        id: 'account-1',
        name: 'Reynolds Property Management',
        type: 'ADMIN',
        status: 'ACTIVE',
        createdAt: '2024-01-15',
        lastActivity: '2025-07-08T02:00:00Z',
        contactEmail: 'sierra@reynolds.com',
        contactPhone: '+1 (555) 123-4567',
        totalProperties: 3,
        totalUsers: 5,
        totalTasks: 12,
        totalRentals: 8,
        financialSummary: {
          totalRevenue: 12500,
          totalExpenses: 3200,
          netProfit: 9300,
          outstandingInvoices: 1500,
          pendingPayments: 800,
          averageOccupancy: 78.5,
          averageDailyRate: 425
        },
        users: [
          {
            id: 'user-1',
            name: 'Sierra Reynolds',
            email: 'sierra@reynolds.com',
            role: 'ADMIN',
            status: 'ACTIVE',
            lastLogin: '2025-07-08T01:45:00Z',
            propertiesAssigned: 3,
            tasksCompleted: 45,
            tasksPending: 3
          },
          {
            id: 'user-2',
            name: 'Mike Johnson',
            email: 'mike@reynolds.com',
            role: 'MANAGER',
            status: 'ACTIVE',
            lastLogin: '2025-07-07T18:30:00Z',
            propertiesAssigned: 2,
            tasksCompleted: 32,
            tasksPending: 5
          },
          {
            id: 'user-3',
            name: 'Sarah Chen',
            email: 'sarah@reynolds.com',
            role: 'EMPLOYEE',
            status: 'ACTIVE',
            lastLogin: '2025-07-08T00:15:00Z',
            propertiesAssigned: 1,
            tasksCompleted: 28,
            tasksPending: 2
          }
        ],
        properties: [
          {
            id: 'prop-1',
            name: 'Beach House #1',
            address: '123 Ocean Drive',
            city: 'Malibu',
            state: 'CA',
            type: 'House',
            bedrooms: 4,
            bathrooms: 3,
            maxGuests: 8,
            basePrice: 450,
            rating: 4.8,
            reviewCount: 127,
            status: 'ACTIVE',
            assignedUsers: ['user-1', 'user-2'],
            monthlyStats: {
              totalRevenue: 4500,
              occupancyRate: 85,
              averagePrice: 425,
              totalBookings: 12,
              totalNights: 24,
              maintenanceCosts: 300,
              cleaningCosts: 450
            }
          },
          {
            id: 'prop-2',
            name: 'Mountain Cabin',
            address: '456 Pine Ridge',
            city: 'Aspen',
            state: 'CO',
            type: 'Cabin',
            bedrooms: 3,
            bathrooms: 2,
            maxGuests: 6,
            basePrice: 350,
            rating: 4.6,
            reviewCount: 89,
            status: 'ACTIVE',
            assignedUsers: ['user-1', 'user-3'],
            monthlyStats: {
              totalRevenue: 3800,
              occupancyRate: 72,
              averagePrice: 380,
              totalBookings: 10,
              totalNights: 20,
              maintenanceCosts: 200,
              cleaningCosts: 320
            }
          },
          {
            id: 'prop-3',
            name: 'City Apartment',
            address: '789 Downtown Ave',
            city: 'New York',
            state: 'NY',
            type: 'Apartment',
            bedrooms: 2,
            bathrooms: 1,
            maxGuests: 4,
            basePrice: 280,
            rating: 4.4,
            reviewCount: 156,
            status: 'MAINTENANCE',
            assignedUsers: ['user-2'],
            monthlyStats: {
              totalRevenue: 4200,
              occupancyRate: 78,
              averagePrice: 320,
              totalBookings: 13,
              totalNights: 26,
              maintenanceCosts: 800,
              cleaningCosts: 280
            }
          }
        ],
        tasks: [
          {
            id: 'task-1',
            title: 'Fix HVAC System',
            description: 'Air conditioning not working properly in Beach House',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            assignedTo: 'user-2',
            propertyId: 'prop-1',
            dueDate: '2025-07-10',
            estimatedCost: 500,
            actualCost: 450
          },
          {
            id: 'task-2',
            title: 'Deep Clean Kitchen',
            description: 'Thorough cleaning after last guest departure',
            status: 'COMPLETED',
            priority: 'MEDIUM',
            assignedTo: 'user-3',
            propertyId: 'prop-2',
            dueDate: '2025-07-08',
            completedDate: '2025-07-08',
            estimatedCost: 150,
            actualCost: 150
          },
          {
            id: 'task-3',
            title: 'Replace Light Bulbs',
            description: 'Replace all burnt out light bulbs in City Apartment',
            status: 'PENDING',
            priority: 'LOW',
            assignedTo: 'user-1',
            propertyId: 'prop-3',
            dueDate: '2025-07-12',
            estimatedCost: 50
          }
        ],
        rentals: [
          {
            id: 'rental-1',
            propertyId: 'prop-1',
            guestName: 'John Smith',
            checkIn: '2025-07-08',
            checkOut: '2025-07-12',
            totalAmount: 1700,
            status: 'CHECKED_IN',
            revenue: 1700,
            commission: 170
          },
          {
            id: 'rental-2',
            propertyId: 'prop-2',
            guestName: 'Emily Davis',
            checkIn: '2025-07-10',
            checkOut: '2025-07-15',
            totalAmount: 1750,
            status: 'CONFIRMED',
            revenue: 1750,
            commission: 175
          }
        ]
      },
      {
        id: 'account-2',
        name: 'Mountain View Properties',
        type: 'MANAGER',
        status: 'ACTIVE',
        createdAt: '2024-03-20',
        lastActivity: '2025-07-07T22:30:00Z',
        contactEmail: 'david@mountainview.com',
        contactPhone: '+1 (555) 987-6543',
        totalProperties: 2,
        totalUsers: 3,
        totalTasks: 8,
        totalRentals: 5,
        financialSummary: {
          totalRevenue: 8200,
          totalExpenses: 2100,
          netProfit: 6100,
          outstandingInvoices: 900,
          pendingPayments: 600,
          averageOccupancy: 82.3,
          averageDailyRate: 380
        },
        users: [
          {
            id: 'user-4',
            name: 'David Wilson',
            email: 'david@mountainview.com',
            role: 'MANAGER',
            status: 'ACTIVE',
            lastLogin: '2025-07-07T22:30:00Z',
            propertiesAssigned: 2,
            tasksCompleted: 38,
            tasksPending: 4
          },
          {
            id: 'user-5',
            name: 'Lisa Rodriguez',
            email: 'lisa@mountainview.com',
            role: 'EMPLOYEE',
            status: 'ACTIVE',
            lastLogin: '2025-07-07T20:15:00Z',
            propertiesAssigned: 1,
            tasksCompleted: 25,
            tasksPending: 3
          }
        ],
        properties: [
          {
            id: 'prop-4',
            name: 'Ski Lodge',
            address: '321 Mountain Pass',
            city: 'Vail',
            state: 'CO',
            type: 'Lodge',
            bedrooms: 6,
            bathrooms: 4,
            maxGuests: 12,
            basePrice: 650,
            rating: 4.9,
            reviewCount: 203,
            status: 'ACTIVE',
            assignedUsers: ['user-4', 'user-5'],
            monthlyStats: {
              totalRevenue: 5200,
              occupancyRate: 88,
              averagePrice: 580,
              totalBookings: 9,
              totalNights: 18,
              maintenanceCosts: 400,
              cleaningCosts: 600
            }
          },
          {
            id: 'prop-5',
            name: 'Riverside Cottage',
            address: '654 River Road',
            city: 'Boulder',
            state: 'CO',
            type: 'Cottage',
            bedrooms: 2,
            bathrooms: 1,
            maxGuests: 4,
            basePrice: 220,
            rating: 4.7,
            reviewCount: 95,
            status: 'ACTIVE',
            assignedUsers: ['user-4'],
            monthlyStats: {
              totalRevenue: 3000,
              occupancyRate: 76,
              averagePrice: 240,
              totalBookings: 12,
              totalNights: 25,
              maintenanceCosts: 150,
              cleaningCosts: 240
            }
          }
        ],
        tasks: [
          {
            id: 'task-4',
            title: 'Snow Removal',
            description: 'Clear driveway and walkways after snowstorm',
            status: 'COMPLETED',
            priority: 'HIGH',
            assignedTo: 'user-5',
            propertyId: 'prop-4',
            dueDate: '2025-07-07',
            completedDate: '2025-07-07',
            estimatedCost: 200,
            actualCost: 180
          }
        ],
        rentals: [
          {
            id: 'rental-3',
            propertyId: 'prop-4',
            guestName: 'Robert Johnson',
            checkIn: '2025-07-09',
            checkOut: '2025-07-16',
            totalAmount: 4550,
            status: 'CONFIRMED',
            revenue: 4550,
            commission: 455
          }
        ]
      }
    ];

    setAccounts(mockAccounts);
    setIsLoading(false);
  };

  const filterAccounts = () => {
    let filtered = accounts;

    if (filters.role !== 'ALL') {
      filtered = filtered.filter(account => account.type === filters.role);
    }

    if (filters.status !== 'ALL') {
      filtered = filtered.filter(account => account.status === filters.status);
    }

    if (filters.search) {
      filtered = filtered.filter(account => 
        account.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        account.contactEmail.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredAccounts(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'IN_PROGRESS': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'OVERDUE': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account Management</h1>
          <p className="text-gray-600 mt-2">Manage all active admin, manager, employee, and contractor accounts</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-soft border border-white/20 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="CONTRACTOR">Contractor</option>
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="space-y-6">
        {filteredAccounts.map((account) => (
          <div key={account.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-soft border border-white/20 overflow-hidden">
            {/* Account Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{account.name}</h2>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                      {account.status}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {account.type}
                    </span>
                  </div>
                  <p className="text-gray-600">{account.contactEmail} • {account.contactPhone}</p>
                  <p className="text-sm text-gray-500">Created: {formatDate(account.createdAt)} • Last Activity: {formatDateTime(account.lastActivity)}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedAccount(selectedAccount === account.id ? null : account.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{selectedAccount === account.id ? 'Hide Details' : 'View Details'}</span>
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-600">Properties</p>
                  <p className="text-lg font-bold text-blue-900">{account.totalProperties}</p>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <UserCheck className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-sm text-green-600">Users</p>
                  <p className="text-lg font-bold text-green-900">{account.totalUsers}</p>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <ClipboardList className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-sm text-purple-600">Tasks</p>
                  <p className="text-lg font-bold text-purple-900">{account.totalTasks}</p>
                </div>
                
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-sm text-orange-600">Rentals</p>
                  <p className="text-lg font-bold text-orange-900">{account.totalRentals}</p>
                </div>
              </div>
            </div>

            {/* Detailed View */}
            {selectedAccount === account.id && (
              <div className="p-6 space-y-8">
                {/* Financial Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Financial Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-green-600">Total Revenue</p>
                      <p className="text-xl font-bold text-green-900">${account.financialSummary.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-sm text-red-600">Total Expenses</p>
                      <p className="text-xl font-bold text-red-900">${account.financialSummary.totalExpenses.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-sm text-blue-600">Net Profit</p>
                      <p className="text-xl font-bold text-blue-900">${account.financialSummary.netProfit.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-purple-600">Avg Occupancy</p>
                      <p className="text-xl font-bold text-purple-900">{account.financialSummary.averageOccupancy}%</p>
                    </div>
                  </div>
                </div>

                {/* Users */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Users ({account.users.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Name</th>
                          <th className="text-left py-2">Role</th>
                          <th className="text-left py-2">Status</th>
                          <th className="text-left py-2">Last Login</th>
                          <th className="text-left py-2">Properties</th>
                          <th className="text-left py-2">Tasks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {account.users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100">
                            <td className="py-2">
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-gray-500">{user.email}</p>
                              </div>
                            </td>
                            <td className="py-2">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {user.role}
                              </span>
                            </td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-2 text-gray-600">{formatDateTime(user.lastLogin)}</td>
                            <td className="py-2 text-gray-600">{user.propertiesAssigned}</td>
                            <td className="py-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-green-600">{user.tasksCompleted} completed</span>
                                <span className="text-orange-600">{user.tasksPending} pending</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Properties */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Home className="w-5 h-5 mr-2" />
                    Properties ({account.properties.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {account.properties.map((property) => (
                      <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{property.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                            {property.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{property.address}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Revenue</p>
                            <p className="font-semibold">${property.monthlyStats.totalRevenue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Occupancy</p>
                            <p className="font-semibold">{property.monthlyStats.occupancyRate}%</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Bookings</p>
                            <p className="font-semibold">{property.monthlyStats.totalBookings}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Rating</p>
                            <p className="font-semibold">{property.rating} ⭐</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ClipboardList className="w-5 h-5 mr-2" />
                    Tasks ({account.tasks.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Task</th>
                          <th className="text-left py-2">Status</th>
                          <th className="text-left py-2">Priority</th>
                          <th className="text-left py-2">Assigned To</th>
                          <th className="text-left py-2">Due Date</th>
                          <th className="text-left py-2">Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {account.tasks.map((task) => (
                          <tr key={task.id} className="border-b border-gray-100">
                            <td className="py-2">
                              <div>
                                <p className="font-medium text-gray-900">{task.title}</p>
                                <p className="text-gray-500 text-xs">{task.description}</p>
                              </div>
                            </td>
                            <td className="py-2">
                              <div className="flex items-center space-x-1">
                                {getTaskStatusIcon(task.status)}
                                <span className="text-sm">{task.status}</span>
                              </div>
                            </td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                            </td>
                            <td className="py-2 text-gray-600">
                              {account.users.find(u => u.id === task.assignedTo)?.name || 'Unknown'}
                            </td>
                            <td className="py-2 text-gray-600">{formatDate(task.dueDate)}</td>
                            <td className="py-2 text-gray-600">
                              ${task.actualCost || task.estimatedCost}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Rentals */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Recent Rentals ({account.rentals.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2">Guest</th>
                          <th className="text-left py-2">Property</th>
                          <th className="text-left py-2">Dates</th>
                          <th className="text-left py-2">Status</th>
                          <th className="text-left py-2">Revenue</th>
                          <th className="text-left py-2">Commission</th>
                        </tr>
                      </thead>
                      <tbody>
                        {account.rentals.map((rental) => (
                          <tr key={rental.id} className="border-b border-gray-100">
                            <td className="py-2 font-medium text-gray-900">{rental.guestName}</td>
                            <td className="py-2 text-gray-600">
                              {account.properties.find(p => p.id === rental.propertyId)?.name || 'Unknown'}
                            </td>
                            <td className="py-2 text-gray-600">
                              {formatDate(rental.checkIn)} - {formatDate(rental.checkOut)}
                            </td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rental.status)}`}>
                                {rental.status}
                              </span>
                            </td>
                            <td className="py-2 font-semibold text-green-600">${rental.revenue.toLocaleString()}</td>
                            <td className="py-2 text-gray-600">${rental.commission.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-soft border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{filteredAccounts.length}</p>
            <p className="text-sm text-gray-600">Total Accounts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {filteredAccounts.filter(a => a.status === 'ACTIVE').length}
            </p>
            <p className="text-sm text-gray-600">Active Accounts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {filteredAccounts.reduce((sum, a) => sum + a.totalProperties, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Properties</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              ${filteredAccounts.reduce((sum, a) => sum + a.financialSummary.totalRevenue, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
} 