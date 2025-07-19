'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, User, Home, Clock, CheckCircle, AlertCircle, XCircle, Edit, Trash2, Eye, BarChart3, Users, Building2, Timer, FileText, Share2, Settings, EyeOff, Globe, Lock, Unlock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import CreateTaskModal from '../../../components/CreateTaskModal';
import TaskSharingModal from '../../../components/TaskSharingModal';
import TimeTrackingModal from '../../../components/TimeTrackingModal';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  assignedById: string;
  property: string;
  propertyId: string;
  dueDate: string;
  createdAt: string;
  category: 'cleaning' | 'maintenance' | 'guest_request' | 'inspection' | 'repair' | 'check_in' | 'check_out' | 'other';
  estimatedHours: number;
  actualHours?: number;
  notes?: string;
  timeEntries: TimeEntry[];
  checkInDate?: string;
  checkOutDate?: string;
  guestName?: string;
  // Sharing properties
  isShared: boolean;
  sharedWith: string[];
  sharePermissions: 'view' | 'edit' | 'full';
  accountId: string;
}

interface Property {
  id: string;
  name: string;
  address: string;
  accountId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'CONTRACTOR' | 'EMPLOYEE' | 'OWNER';
  isActive: boolean;
  assignedProperties: string[];
  accountId: string;
  canTimeTrack?: boolean; // Added for time tracking permission
}

interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  clockIn: string;
  clockOut?: string;
  duration?: number;
  notes: string;
}

interface Account {
  id: string;
  name: string;
  isActive: boolean;
  properties: Property[];
  users: User[];
  tasks: Task[];
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showTimeTrackingModal, setShowTimeTrackingModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [showSharingModal, setShowSharingModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [assignedToFilter, setAssignedToFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [currentTimeEntry, setCurrentTimeEntry] = useState<TimeEntry | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [showAccountSelector, setShowAccountSelector] = useState(false);

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        setUser(user);
      } else {
        // Fallback to mock user for demo
        const mockUser: User = {
          id: '1',
          name: 'Sierra Reynolds',
          email: 'sierra.reynolds@hostit.com',
          role: 'SUPER_ADMIN',
          isActive: true,
          assignedProperties: ['beach1', 'beach2', 'mountain', 'ocean', 'penthouse'],
          accountId: 'account-1'
        };
        setUser(mockUser);
        console.log('✅ Set current user to Sierra Reynolds (SUPER_ADMIN)');
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      // Fallback to mock user
      const mockUser: User = {
        id: '1',
        name: 'Sierra Reynolds',
        email: 'sierra.reynolds@hostit.com',
        role: 'SUPER_ADMIN',
        isActive: true,
        assignedProperties: ['beach1', 'beach2', 'mountain', 'ocean', 'penthouse'],
        accountId: 'account-1'
      };
      setUser(mockUser);
      console.log('✅ Set current user to Sierra Reynolds (SUPER_ADMIN) - fallback');
    }
  };

  // Mock data
  useEffect(() => {
    fetchCurrentUser();

    const mockAccounts: Account[] = [
      {
        id: 'account-1',
        name: 'Reynolds Property Management',
        isActive: true,
        properties: [
          { id: 'beach1', name: 'Beach House #1', address: '123 Beach Blvd, Malibu, CA', accountId: 'account-1' },
          { id: 'beach2', name: 'Beach House #2', address: '456 Ocean Dr, Malibu, CA', accountId: 'account-1' },
          { id: 'mountain', name: 'Mountain Cabin', address: '789 Pine Rd, Big Bear, CA', accountId: 'account-1' },
          { id: 'ocean', name: 'Ocean View Villa', address: '321 Coastal Hwy, Laguna, CA', accountId: 'account-1' },
          { id: 'penthouse', name: 'Luxury Penthouse', address: '555 Downtown Ave, LA, CA', accountId: 'account-1' }
        ],
        users: [
          { id: '2', name: 'Sarah Johnson', email: 'sarah@hostit.com', role: 'EMPLOYEE', isActive: true, assignedProperties: ['beach1', 'beach2'], accountId: 'account-1' },
          { id: '3', name: 'Mike Chen', email: 'mike@hostit.com', role: 'CONTRACTOR', isActive: true, assignedProperties: ['mountain', 'ocean'], accountId: 'account-1' },
          { id: '4', name: 'Lisa Rodriguez', email: 'lisa@hostit.com', role: 'EMPLOYEE', isActive: true, assignedProperties: ['ocean', 'penthouse'], accountId: 'account-1' },
          { id: '5', name: 'David Wilson', email: 'david@hostit.com', role: 'CONTRACTOR', isActive: true, assignedProperties: ['beach1', 'penthouse'], accountId: 'account-1' },
          { id: '6', name: 'Emma Thompson', email: 'emma@hostit.com', role: 'MANAGER', isActive: true, assignedProperties: ['beach1', 'beach2', 'mountain', 'ocean', 'penthouse'], accountId: 'account-1' }
        ],
        tasks: [
          {
            id: '1',
            title: 'Pre-Check-in Cleaning',
            description: 'Deep clean and prepare property for guest arrival',
            status: 'pending',
            priority: 'high',
            assignedTo: 'Sarah Johnson',
            assignedById: '1',
            property: 'Beach House #1',
            propertyId: 'beach1',
            dueDate: '2024-01-14',
            createdAt: '2024-01-10',
            category: 'check_in',
            estimatedHours: 3,
            checkInDate: '2024-01-15',
            guestName: 'John Smith',
            timeEntries: [],
            isShared: false,
            sharedWith: [],
            sharePermissions: 'view',
            accountId: 'account-1'
          },
          {
            id: '2',
            title: 'HVAC Maintenance',
            description: 'Annual HVAC system inspection',
            status: 'in_progress',
            priority: 'medium',
            assignedTo: 'Mike Chen',
            assignedById: '1',
            property: 'Mountain Cabin',
            propertyId: 'mountain',
            dueDate: '2024-01-17',
            createdAt: '2024-01-08',
            category: 'maintenance',
            estimatedHours: 2,
            timeEntries: [],
            isShared: true,
            sharedWith: ['owner@mountaincabin.com'],
            sharePermissions: 'view',
            accountId: 'account-1'
          }
        ]
      },
      {
        id: 'account-2',
        name: 'Coastal Properties LLC',
        isActive: true,
        properties: [
          { id: 'coastal1', name: 'Coastal Villa', address: '100 Coastal Dr, San Diego, CA', accountId: 'account-2' },
          { id: 'coastal2', name: 'Oceanfront Condo', address: '200 Beach Way, San Diego, CA', accountId: 'account-2' }
        ],
        users: [
          { id: '7', name: 'Alex Martinez', email: 'alex@coastal.com', role: 'MANAGER', isActive: true, assignedProperties: ['coastal1', 'coastal2'], accountId: 'account-2' },
          { id: '8', name: 'Maria Garcia', email: 'maria@coastal.com', role: 'EMPLOYEE', isActive: true, assignedProperties: ['coastal1'], accountId: 'account-2' }
        ],
        tasks: [
          {
            id: '3',
            title: 'Pool Maintenance',
            description: 'Weekly pool cleaning and chemical balance',
            status: 'completed',
            priority: 'medium',
            assignedTo: 'Maria Garcia',
            assignedById: '7',
            property: 'Coastal Villa',
            propertyId: 'coastal1',
            dueDate: '2024-01-12',
            createdAt: '2024-01-10',
            category: 'maintenance',
            estimatedHours: 1.5,
            actualHours: 1.5,
            timeEntries: [],
            isShared: false,
            sharedWith: [],
            sharePermissions: 'view',
            accountId: 'account-2'
          }
        ]
      }
    ];

    setAccounts(mockAccounts);
    
    // Set default account for super admin
    if (user?.role === 'SUPER_ADMIN') {
      setSelectedAccount('account-1');
      setProperties(mockAccounts[0].properties);
      setEmployees(mockAccounts[0].users);
      setTasks(mockAccounts[0].tasks);
    } else {
      // For other users, find their account
      const userAccount = mockAccounts.find(account => 
        account.users.some(u => u.id === user?.id)
      );
      if (userAccount) {
        setSelectedAccount(userAccount.id);
        setProperties(userAccount.properties);
        setEmployees(userAccount.users);
        setTasks(userAccount.tasks);
      }
    }
    
    setLoading(false);
  }, [user]);

  // Filter tasks based on user role and assigned properties
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Role-based filtering
    if (user?.role === 'EMPLOYEE' || user?.role === 'CONTRACTOR') {
      // Employees and contractors only see tasks assigned to them
      filtered = filtered.filter(task => task.assignedTo === user.name);
    } else if (user?.role === 'MANAGER') {
      // Managers see tasks for their assigned properties
      filtered = filtered.filter(task => 
        user.assignedProperties.includes(task.propertyId)
      );
    }
    // Admins see all tasks for their account

    // Apply other filters
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.property.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }

    if (propertyFilter !== 'all') {
      filtered = filtered.filter(task => task.propertyId === propertyFilter);
    }

    if (assignedToFilter !== 'all') {
      filtered = filtered.filter(task => task.assignedTo === assignedToFilter);
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const handleCreateTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    setShowCreateModal(false);
  };

  const handleEditTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
    setShowEditModal(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleClockIn = (taskId: string) => {
    const newTimeEntry: TimeEntry = {
      id: Date.now().toString(),
      taskId,
      userId: user!.id,
      userName: user!.name,
      clockIn: new Date().toISOString(),
      clockOut: undefined,
      duration: undefined,
      notes: ''
    };

    setCurrentTimeEntry(newTimeEntry);
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, timeEntries: [...task.timeEntries, newTimeEntry] }
        : task
    ));
  };

  const handleClockOut = (taskId: string, timeEntryId: string) => {
    const clockOutTime = new Date();
    
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? {
            ...task,
            timeEntries: task.timeEntries.map(entry => 
              entry.id === timeEntryId 
                ? {
                    ...entry,
                    clockOut: clockOutTime.toISOString(),
                    duration: Math.round((clockOutTime.getTime() - new Date(entry.clockIn).getTime()) / 60000)
                  }
                : entry
            )
          }
        : task
    ));

    setCurrentTimeEntry(null);
  };

  const handleShareTask = (shareData: { email: string; permissions: 'view' | 'edit' | 'full' }) => {
    if (!selectedTask) return;
    
    setTasks(tasks.map(task => 
      task.id === selectedTask.id 
        ? {
            ...task,
            isShared: true,
            sharedWith: [...task.sharedWith, shareData.email],
            sharePermissions: shareData.permissions
          }
        : task
    ));
    setShowSharingModal(false);
  };

  const handleAccountChange = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setSelectedAccount(accountId);
      setProperties(account.properties);
      setEmployees(account.users);
      setTasks(account.tasks);
    }
  };

  const canAssignTasks = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const canViewReports = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const canTimeTrack = user?.role === 'EMPLOYEE' || user?.role === 'CONTRACTOR';
  const canShareTasks = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const stats = {
    total: filteredTasks.length,
    pending: filteredTasks.filter(t => t.status === 'pending').length,
    inProgress: filteredTasks.filter(t => t.status === 'in_progress').length,
    completed: filteredTasks.filter(t => t.status === 'completed').length,
    urgent: filteredTasks.filter(t => t.priority === 'urgent').length,
    totalHours: filteredTasks.reduce((sum, task) => sum + (task.actualHours || 0), 0),
    shared: filteredTasks.filter(t => t.isShared).length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Account Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Manager</h1>
          <p className="text-gray-600">
            {user?.role === 'EMPLOYEE' || user?.role === 'CONTRACTOR' 
              ? 'View and manage your assigned tasks' 
              : 'Manage and track property maintenance tasks'
            }
          </p>
        </div>
        
        {/* Account Selector for Super Admin */}
        {user?.role === 'SUPER_ADMIN' && (
          <div className="relative">
            <button
              onClick={() => setShowAccountSelector(!showAccountSelector)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span>{accounts.find(acc => acc.id === selectedAccount)?.name || 'Select Account'}</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showAccountSelector ? 'rotate-90' : ''}`} />
            </button>
            
            {showAccountSelector && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
                {accounts.map(account => (
                  <button
                    key={account.id}
                    onClick={() => {
                      handleAccountChange(account.id);
                      setShowAccountSelector(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedAccount === account.id 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{account.name}</div>
                    <div className="text-xs text-gray-500">
                      {account.properties.length} properties • {account.tasks.length} tasks
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Calendar View
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          {canViewReports && (
            <button
              onClick={() => setShowReportsModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <BarChart3 className="w-4 h-4" />
              Reports
            </button>
          )}
          {canAssignTasks && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create Task
            </button>
          )}
          {canTimeTrack && (
            <button
              onClick={() => setShowTimeTrackingModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Clock className="w-5 h-5" />
              Time Tracking
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="cleaning">Cleaning</option>
              <option value="maintenance">Maintenance</option>
              <option value="guest_request">Guest Request</option>
              <option value="inspection">Inspection</option>
              <option value="repair">Repair</option>
              <option value="check_in">Check-in</option>
              <option value="check_out">Check-out</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          {user?.role !== 'EMPLOYEE' && user?.role !== 'CONTRACTOR' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>
              <select
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Properties</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>{property.name}</option>
                ))}
              </select>
            </div>
          )}
          
          {user?.role !== 'EMPLOYEE' && user?.role !== 'CONTRACTOR' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
              <select
                value={assignedToFilter}
                onChange={(e) => setAssignedToFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Staff</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.name}>{employee.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Task List */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sharing</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500">{task.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(task.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{task.property}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{task.assignedTo}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {task.isShared ? (
                          <div className="flex items-center space-x-1">
                            <Globe className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600">Shared</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <Lock className="w-4 h-4 text-gray-400" />
                            <span className="text-xs text-gray-500">Private</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTask(task);
                            setShowViewModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canAssignTasks && (
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setShowEditModal(true);
                            }}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {canShareTasks && (
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setShowSharingModal(true);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        )}
                        {canAssignTasks && (
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
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
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
            <p className="text-gray-600 mb-4">Switch to calendar view to see tasks by date</p>
            <Link
              href="/admin/property-tasks-calendar"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Open Calendar View
            </Link>
          </div>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateTaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onTaskCreated={handleCreateTask}
          properties={properties}
          employees={employees}
          currentUser={user}
        />
      )}

      {showSharingModal && (
        <TaskSharingModal
          isOpen={showSharingModal}
          onClose={() => setShowSharingModal(false)}
          onShare={handleShareTask}
          task={selectedTask}
        />
      )}

      {showTimeTrackingModal && (
        <TimeTrackingModal
          isOpen={showTimeTrackingModal}
          onClose={() => setShowTimeTrackingModal(false)}
          currentUser={user}
          users={employees}
          tasks={tasks}
          properties={properties}
          onTimeEntryUpdate={(entry) => {
            // Handle time entry updates
            console.log('Time entry updated:', entry);
          }}
          onTimeEntryCreate={(entry) => {
            // Handle new time entries
            console.log('New time entry:', entry);
          }}
        />
      )}

      {/* Add other modals here for editing, viewing, etc. */}
    </div>
  );
} 