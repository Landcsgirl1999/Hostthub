'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Home, CheckCircle, AlertCircle, XCircle, Edit, Eye, FileText, X, Wrench, Sparkles, Calendar, Share2, Users, Building2, Globe, Lock, Clock } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isSameMonth, addWeeks, subWeeks, addMonths, subMonths, eachDayOfInterval } from 'date-fns';
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
  property: string;
  propertyId: string;
  dueDate: string;
  createdAt: string;
  category: 'cleaning' | 'maintenance' | 'guest_request' | 'inspection' | 'repair' | 'check_in' | 'check_out' | 'other';
  estimatedHours: number;
  actualHours?: number;
  notes?: string;
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

interface Account {
  id: string;
  name: string;
  isActive: boolean;
  properties: Property[];
  users: User[];
  tasks: Task[];
}

export default function AccountTaskCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('month');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [staffMembers, setStaffMembers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [showSharingModal, setShowSharingModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [showTimeTrackingModal, setShowTimeTrackingModal] = useState(false);

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
          accountId: 'account-1',
          canTimeTrack: true // Mock for demo
        };
        setUser(mockUser);
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
        accountId: 'account-1',
        canTimeTrack: true // Mock for demo
      };
      setUser(mockUser);
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
            property: 'Beach House #1',
            propertyId: 'beach1',
            dueDate: '2024-01-14',
            createdAt: '2024-01-10',
            category: 'check_in',
            estimatedHours: 3,
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
            property: 'Mountain Cabin',
            propertyId: 'mountain',
            dueDate: '2024-01-17',
            createdAt: '2024-01-08',
            category: 'maintenance',
            estimatedHours: 2,
            isShared: true,
            sharedWith: ['owner@mountaincabin.com'],
            sharePermissions: 'view',
            accountId: 'account-1'
          },
          {
            id: '3',
            title: 'Pool Maintenance',
            description: 'Weekly pool cleaning and chemical balance',
            status: 'completed',
            priority: 'medium',
            assignedTo: 'Lisa Rodriguez',
            property: 'Ocean View Villa',
            propertyId: 'ocean',
            dueDate: '2024-01-12',
            createdAt: '2024-01-10',
            category: 'maintenance',
            estimatedHours: 1.5,
            actualHours: 1.5,
            isShared: false,
            sharedWith: [],
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
            id: '4',
            title: 'Deep Cleaning',
            description: 'Post-guest deep cleaning',
            status: 'pending',
            priority: 'high',
            assignedTo: 'Maria Garcia',
            property: 'Coastal Villa',
            propertyId: 'coastal1',
            dueDate: '2024-01-15',
            createdAt: '2024-01-12',
            category: 'cleaning',
            estimatedHours: 4,
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
      setStaffMembers(mockAccounts[0].users);
      setTasks(mockAccounts[0].tasks);
    } else {
      // For other users, find their account
      const userAccount = mockAccounts.find(account => 
        account.users.some(u => u.id === user?.id)
      );
      if (userAccount) {
        setSelectedAccount(userAccount.id);
        setProperties(userAccount.properties);
        setStaffMembers(userAccount.users);
        setTasks(userAccount.tasks);
      }
    }
    
    setLoading(false);
  }, [user]);

  const handleAccountChange = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setSelectedAccount(accountId);
      setProperties(account.properties);
      setStaffMembers(account.users);
      setTasks(account.tasks);
    }
  };

  const handleCreateTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    setShowCreateTaskModal(false);
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

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleTaskPriorityChange = (taskId: string, newPriority: Task['priority']) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, priority: newPriority } : task
    ));
  };

  const handleTaskAssignedToChange = (taskId: string, newAssignedTo: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, assignedTo: newAssignedTo } : task
    ));
  };

  const handleTaskDueDateChange = (taskId: string, newDueDate: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, dueDate: newDueDate } : task
    ));
  };

  const handleTaskEstimatedHoursChange = (taskId: string, newEstimatedHours: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, estimatedHours: newEstimatedHours } : task
    ));
  };

  const handleTaskActualHoursChange = (taskId: string, newActualHours: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, actualHours: newActualHours } : task
    ));
  };

  const handleTaskNotesChange = (taskId: string, newNotes: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, notes: newNotes } : task
    ));
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleTaskSave = (task: Task) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(t =>
        t.id === task.id ? task : t
      );
      if (!updatedTasks.some(t => t.id === task.id)) {
        updatedTasks.push(task);
      }
      return updatedTasks;
    });
    setShowCreateTaskModal(false);
    setSelectedTask(null);
  };

  const handleTaskCancel = () => {
    setShowCreateTaskModal(false);
    setSelectedTask(null);
  };

  const handleTaskDetailsClose = () => {
    setShowTaskDetailsModal(false);
    setSelectedTask(null);
  };

  const handleTaskDetailsOpen = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetailsModal(true);
  };

  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const isDateMatch = selectedDate ? taskDate.toDateString() === selectedDate.toDateString() : true;
    const isPropertyMatch = selectedProperty ? task.propertyId === selectedProperty : true;
    const isStaffMatch = selectedStaff ? task.assignedTo === selectedStaff : true;
    return isDateMatch && isPropertyMatch && isStaffMatch;
  });

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const dateKey = task.dueDate.split('T')[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(task);
    return acc;
  }, {} as { [key: string]: Task[] });

  const sortedDates = Object.keys(groupedTasks).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

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
      case 'in_progress': return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'pending': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'high': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'medium': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const canAssignTasks = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const canShareTasks = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const canTimeTrack = user?.canTimeTrack || user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Task Calendar</h1>
          <p className="text-gray-600">
            Manage and track tasks across all properties for each account
          </p>
        </div>
        
        {/* Account Selector for Super Admin */}
        {user?.role === 'SUPER_ADMIN' && (
          <div className="relative">
            <select
              value={selectedAccount || ''}
              onChange={(e) => handleAccountChange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.properties.length} properties)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Account Info */}
      {selectedAccount && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {accounts.find(acc => acc.id === selectedAccount)?.name}
              </h3>
              <p className="text-sm text-gray-600">Active Account</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{properties.length}</p>
              <p className="text-sm text-gray-600">Properties</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{tasks.length}</p>
              <p className="text-sm text-gray-600">Total Tasks</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{staffMembers.length}</p>
              <p className="text-sm text-gray-600">Staff Members</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Month View
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (viewMode === 'week') {
                  setCurrentDate(subWeeks(currentDate, 1));
                } else {
                  setCurrentDate(subMonths(currentDate, 1));
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-900">
              {viewMode === 'week' 
                ? `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`
                : format(currentDate, 'MMMM yyyy')
              }
            </span>
            <button
              onClick={() => {
                if (viewMode === 'week') {
                  setCurrentDate(addWeeks(currentDate, 1));
                } else {
                  setCurrentDate(addMonths(currentDate, 1));
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {canShareTasks && (
            <button
              onClick={() => setShowSharingModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Calendar
            </button>
          )}
          {canAssignTasks && (
            <button
              onClick={() => setShowCreateTaskModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Task
            </button>
          )}
          {canTimeTrack && (
            <button
              onClick={() => setShowTimeTrackingModal(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Time Tracking
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>
            <select
              value={selectedProperty || ''}
              onChange={(e) => setSelectedProperty(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Properties</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>{property.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Staff Member</label>
            <select
              value={selectedStaff || ''}
              onChange={(e) => setSelectedStaff(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Staff</option>
              {staffMembers.map(staff => (
                <option key={staff.id} value={staff.name}>{staff.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left font-medium">Property</th>
                {viewMode === 'week' ? (
                  // Week view - show 7 days
                  eachDayOfInterval({
                    start: startOfWeek(currentDate),
                    end: endOfWeek(currentDate)
                  }).map(day => (
                    <th key={day.toISOString()} className="px-4 py-4 text-center font-medium">
                      <div className="text-sm">{format(day, 'EEE')}</div>
                      <div className="text-lg">{format(day, 'd')}</div>
                    </th>
                  ))
                ) : (
                  // Month view - show 7 columns for days of week
                  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <th key={day} className="px-4 py-4 text-center font-medium">
                      {day}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {properties.map(property => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 bg-gray-50 sticky left-0 z-10">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <div className="font-medium text-gray-900">{property.name}</div>
                        <div className="text-sm text-gray-500">{property.address}</div>
                      </div>
                    </div>
                  </td>
                  {viewMode === 'week' ? (
                    // Week view cells
                    eachDayOfInterval({
                      start: startOfWeek(currentDate),
                      end: endOfWeek(currentDate)
                    }).map(day => {
                      const dayTasks = tasks.filter(task => 
                        task.propertyId === property.id && 
                        isSameDay(new Date(task.dueDate), day)
                      );
                      
                      return (
                        <td key={day.toISOString()} className="px-2 py-2 border-l border-gray-200 min-w-[120px]">
                          {dayTasks.map(task => (
                            <div
                              key={task.id}
                              className="mb-2 p-2 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow"
                              style={{
                                borderLeftColor: task.priority === 'urgent' ? '#dc2626' : 
                                               task.priority === 'high' ? '#ea580c' : 
                                               task.priority === 'medium' ? '#ca8a04' : '#16a34a',
                                backgroundColor: task.status === 'completed' ? '#f0fdf4' :
                                               task.status === 'in_progress' ? '#eff6ff' :
                                               task.status === 'pending' ? '#fefce8' : '#fef2f2'
                              }}
                              onClick={() => handleTaskDetailsOpen(task)}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(task.status)}
                                  {getPriorityIcon(task.priority)}
                                </div>
                                {task.isShared && (
                                  <Globe className="w-3 h-3 text-green-600" />
                                )}
                              </div>
                              <div className="text-xs font-medium text-gray-900 truncate">
                                {task.title}
                              </div>
                              <div className="text-xs text-gray-600">
                                {task.assignedTo}
                              </div>
                            </div>
                          ))}
                        </td>
                      );
                    })
                  ) : (
                    // Month view cells - simplified for space
                    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                      <td key={day} className="px-2 py-2 border-l border-gray-200 min-w-[120px]">
                        <div className="text-xs text-gray-500 mb-1">{day}</div>
                        <div className="space-y-1">
                          {tasks
                            .filter(task => task.propertyId === property.id)
                            .slice(0, 2) // Show max 2 tasks per cell in month view
                            .map(task => (
                              <div
                                key={task.id}
                                className="p-1 rounded text-xs cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleTaskDetailsOpen(task)}
                              >
                                <div className="flex items-center space-x-1">
                                  {getStatusIcon(task.status)}
                                  <span className="truncate">{task.title}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </td>
                    ))
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {tasks.filter(t => t.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => t.status === 'in_progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {tasks.filter(t => t.isShared).length}
            </div>
            <div className="text-sm text-gray-600">Shared</div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateTaskModal && (
        <CreateTaskModal
          isOpen={showCreateTaskModal}
          onClose={() => setShowCreateTaskModal(false)}
          onTaskCreated={handleCreateTask}
          properties={properties}
          employees={staffMembers}
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

      {/* Task Details Modal */}
      {showTaskDetailsModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Task Details</h3>
                <button
                  onClick={handleTaskDetailsClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{selectedTask.title}</h4>
                <p className="text-gray-600">{selectedTask.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedTask.status}
                    onChange={(e) => handleTaskStatusChange(selectedTask.id, e.target.value as Task['status'])}
                    className={`w-full px-3 py-2 rounded-lg border ${getStatusColor(selectedTask.status)}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={selectedTask.priority}
                    onChange={(e) => handleTaskPriorityChange(selectedTask.id, e.target.value as Task['priority'])}
                    className={`w-full px-3 py-2 rounded-lg border ${getPriorityColor(selectedTask.priority)}`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <select
                    value={selectedTask.assignedTo}
                    onChange={(e) => handleTaskAssignedToChange(selectedTask.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {staffMembers.map(staff => (
                      <option key={staff.id} value={staff.name}>{staff.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={selectedTask.dueDate}
                    onChange={(e) => handleTaskDueDateChange(selectedTask.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sharing:</span>
                    {selectedTask.isShared ? (
                      <div className="flex items-center space-x-1">
                        <Globe className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">Shared</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Lock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Private</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {canShareTasks && (
                    <button
                      onClick={() => {
                        setShowTaskDetailsModal(false);
                        setShowSharingModal(true);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  )}
                  <button
                    onClick={handleTaskDetailsClose}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Tracking Modal */}
      {canTimeTrack && (
        <TimeTrackingModal
          isOpen={showTimeTrackingModal}
          onClose={() => setShowTimeTrackingModal(false)}
          currentUser={user}
          users={staffMembers}
          tasks={tasks}
          properties={properties}
          onTimeEntryUpdate={(entry) => console.log('Updated:', entry)}
          onTimeEntryCreate={(entry) => console.log('Created:', entry)}
        />
      )}
    </div>
  );
} 