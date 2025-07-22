'use client';

import { useState, useEffect } from 'react';
import { X, Clock, Play, Square, Pause, RotateCcw, BarChart3, Users, Settings, Eye, Download, Filter, Calendar, MapPin, Timer } from 'lucide-react';

interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  taskId?: string;
  taskTitle?: string;
  propertyId?: string;
  propertyName?: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  notes?: string;
  status: 'active' | 'paused' | 'completed';
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  canTimeTrack?: boolean;
  assignedProperties: string[];
}

interface TimeTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  users: User[];
  tasks: any[];
  properties: any[];
  onTimeEntryUpdate: (entry: TimeEntry) => void;
  onTimeEntryCreate: (entry: TimeEntry) => void;
}

// Use relative URL for local development
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function TimeTrackingModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  users, 
  tasks, 
  properties,
  onTimeEntryUpdate,
  onTimeEntryCreate
}: TimeTrackingModalProps) {
  const [activeEntries, setActiveEntries] = useState<TimeEntry[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>(currentUser?.id || '');
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [viewMode, setViewMode] = useState<'clock' | 'reports'>('clock');
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0]);
  const [userFilter, setUserFilter] = useState<string>('all');
  const [propertyFilter, setPropertyFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startDateFilter, setStartDateFilter] = useState<string>('');
  const [endDateFilter, setEndDateFilter] = useState<string>('');

  // Check if user can time track
  const canTimeTrack = currentUser?.canTimeTrack || 
    currentUser?.role === 'SUPER_ADMIN' || 
    currentUser?.role === 'ADMIN' ||
    currentUser?.role === 'HOMEOWNER';

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch time entries on mount and when filters change
  useEffect(() => {
    if (!canTimeTrack) return;
    
    const fetchTimeEntries = async () => {
      try {
        const params = new URLSearchParams();
        if (userFilter !== 'all') params.append('userId', userFilter);
        if (startDateFilter) params.append('startDate', startDateFilter);
        if (endDateFilter) params.append('endDate', endDateFilter);
        
        const response = await fetch(`${API_URL}/api/v1/time-entries?${params}`);
        if (response.ok) {
          const data = await response.json();
          setTimeEntries(data);
          
          // Set active entries (those without endTime)
          const active = data.filter((entry: TimeEntry) => !entry.endTime);
          setActiveEntries(active);
        }
      } catch (error) {
        console.error('Error fetching time entries:', error);
      }
    };

    fetchTimeEntries();
  }, [canTimeTrack, userFilter, startDateFilter, endDateFilter]);

  // Add a test function to check API connectivity
  const testAPIConnection = async () => {
    try {
      console.log('🔍 Testing API connection to:', API_URL);
      const response = await fetch(`${API_URL}/health`);
      console.log('✅ API health check response:', response.status);
      return response.ok;
    } catch (error) {
      console.error('❌ API connection failed:', error);
      return false;
    }
  };

  const handleClockIn = async () => {
    if (!selectedUser || !canTimeTrack) {
      alert('Please select a user and ensure you have time tracking permissions');
      return;
    }

    setIsLoading(true);
    try {
      // Test API connection first
      const isAPIAvailable = await testAPIConnection();
      if (!isAPIAvailable) {
        throw new Error('API server is not available. Please check if the server is running on port 3003.');
      }

      console.log('🚀 Attempting to clock in for user:', selectedUser);
      console.log('📡 API URL:', `${API_URL}/api/v1/time-entries/clock-in`);
      
      const requestBody = {
        userId: selectedUser,
        taskId: selectedTask || null,
        notes: notes || null
      };
      
      console.log('📦 Request body:', requestBody);

      const response = await fetch(`${API_URL}/api/v1/time-entries/clock-in`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Clock in response status:', response.status);
      console.log('📡 Clock in response headers:', response.headers);
      
      if (!response.ok) {
        let errorMessage = 'Failed to clock in';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('Could not parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      const newEntry = await response.json();
      console.log('✅ Clock in success:', newEntry);
      
      // Add user name and task title for display
      const user = users.find(u => u.id === selectedUser);
      const task = tasks.find(t => t.id === selectedTask);
      
      const enhancedEntry: TimeEntry = {
        ...newEntry,
        userName: user?.name || '',
        taskTitle: task?.title || '',
        status: 'active',
      };

      onTimeEntryCreate(enhancedEntry);
      setActiveEntries([...activeEntries, enhancedEntry]);
      setTimeEntries([enhancedEntry, ...timeEntries]);
      
      // Reset form
      setNotes('');
      setSelectedTask('');
      setSelectedProperty('');
      
      alert('Successfully clocked in!');
    } catch (error) {
      console.error('❌ Error clocking in:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error clocking in: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockOut = async (entryId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/time-entries/clock-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entryId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to clock out');
      }

      const updatedEntry = await response.json();
      
      // Calculate duration
      const startTime = new Date(updatedEntry.startTime);
      const endTime = new Date(updatedEntry.endTime);
      const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

      const enhancedEntry: TimeEntry = {
        ...updatedEntry,
        duration,
        status: 'completed'
      };

      onTimeEntryUpdate(enhancedEntry);
      setActiveEntries(activeEntries.filter(e => e.id !== entryId));
      setTimeEntries(timeEntries.map(e => e.id === entryId ? enhancedEntry : e));
    } catch (error) {
      console.error('Error clocking out:', error);
      alert('Error clocking out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async (entryId: string) => {
    const entry = activeEntries.find(e => e.id === entryId);
    if (!entry) return;

    const updatedEntry: TimeEntry = {
      ...entry,
      status: 'paused',
      updatedAt: new Date().toISOString()
    };

    onTimeEntryUpdate(updatedEntry);
    setActiveEntries(activeEntries.map(e => e.id === entryId ? updatedEntry : e));
  };

  const handleResume = async (entryId: string) => {
    const entry = activeEntries.find(e => e.id === entryId);
    if (!entry) return;

    const updatedEntry: TimeEntry = {
      ...entry,
      status: 'active',
      updatedAt: new Date().toISOString()
    };

    onTimeEntryUpdate(updatedEntry);
    setActiveEntries(activeEntries.map(e => e.id === entryId ? updatedEntry : e));
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      });
    });
  };

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getCurrentDuration = (entry: TimeEntry): number => {
    if (entry.endTime && entry.duration) {
      return entry.duration;
    }
    
    const startTime = new Date(entry.startTime).getTime();
    const currentTime = new Date().getTime();
    return Math.round((currentTime - startTime) / 60000);
  };

  const filteredEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.startTime).toISOString().split('T')[0];
    const matchesStartDate = startDateFilter ? entryDate >= startDateFilter : true;
    const matchesEndDate = endDateFilter ? entryDate <= endDateFilter : true;
    const matchesUser = userFilter === 'all' || entry.userId === userFilter;
    const matchesProperty = propertyFilter === 'all' || entry.propertyId === propertyFilter;
    return matchesStartDate && matchesEndDate && matchesUser && matchesProperty;
  });

  const totalHours = filteredEntries.reduce((sum, entry) => {
    return sum + (entry.duration || getCurrentDuration(entry));
  }, 0);

  if (!isOpen || !canTimeTrack) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Time Tracking</h3>
                <p className="text-sm text-gray-600">Smart clock in/out with location tracking</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode('clock')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'clock'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Clock In/Out
            </button>
            <button
              onClick={() => setViewMode('reports')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'reports'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Time Reports
            </button>
          </div>
        </div>

        {/* Clock In/Out View */}
        {viewMode === 'clock' && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Clock In Form */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Clock In</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={!canTimeTrack}
                    >
                      <option value="">Select Employee</option>
                      {users.filter(user => user.canTimeTrack || user.role === 'EMPLOYEE' || user.role === 'CONTRACTOR').map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Task (Optional)</label>
                    <select
                      value={selectedTask}
                      onChange={(e) => setSelectedTask(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">No Task</option>
                      {tasks.map(task => (
                        <option key={task.id} value={task.id}>{task.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property (Optional)</label>
                    <select
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">No Property</option>
                      {properties.map(property => (
                        <option key={property.id} value={property.id}>{property.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add any notes about this time entry..."
                    />
                  </div>

                  <button
                    onClick={handleClockIn}
                    disabled={isLoading || !selectedUser || !canTimeTrack}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Clocking In...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Clock In</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Active Time Entries */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Active Time Entries</h4>
                
                {activeEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No active time entries</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeEntries.map(entry => (
                      <div key={entry.id} className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-gray-900">{entry.userName}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDuration(getCurrentDuration(entry))}
                          </div>
                        </div>
                        
                        {entry.taskTitle && (
                          <p className="text-sm text-gray-600 mb-1">{entry.taskTitle}</p>
                        )}
                        
                        {entry.propertyName && (
                          <p className="text-sm text-gray-600 mb-2 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {entry.propertyName}
                          </p>
                        )}

                        <div className="flex items-center space-x-2">
                          {entry.status === 'active' ? (
                            <>
                              <button
                                onClick={() => handlePause(entry.id)}
                                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md text-sm hover:bg-yellow-200 transition-colors flex items-center space-x-1"
                              >
                                <Pause className="w-3 h-3" />
                                <span>Pause</span>
                              </button>
                              <button
                                onClick={() => handleClockOut(entry.id)}
                                className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors flex items-center space-x-1"
                              >
                                <Square className="w-3 h-3" />
                                <span>Clock Out</span>
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleResume(entry.id)}
                              className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors flex items-center space-x-1"
                            >
                              <Play className="w-3 h-3" />
                              <span>Resume</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Time Reports View */}
        {viewMode === 'reports' && (
          <div className="p-6">
            {/* Enhanced Filters */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDateFilter}
                    onChange={(e) => setStartDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDateFilter}
                    onChange={(e) => setEndDateFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Employees</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name}</option>
                    ))}
                  </select>
                </div>
                
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
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setStartDateFilter('');
                      setEndDateFilter('');
                      setUserFilter('all');
                      setPropertyFilter('all');
                    }}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
              
              {/* Quick Date Presets */}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0];
                    setStartDateFilter(today);
                    setEndDateFilter(today);
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const weekAgo = new Date(today);
                    weekAgo.setDate(today.getDate() - 7);
                    setStartDateFilter(weekAgo.toISOString().split('T')[0]);
                    setEndDateFilter(today.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Last 7 Days
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(today.getMonth() - 1);
                    setStartDateFilter(monthAgo.toISOString().split('T')[0]);
                    setEndDateFilter(today.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Last 30 Days
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    setStartDateFilter(startOfMonth.toISOString().split('T')[0]);
                    setEndDateFilter(today.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  This Month
                </button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Hours</p>
                    <p className="text-2xl font-bold text-gray-900">{formatDuration(totalHours)}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Timer className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Entries</p>
                    <p className="text-2xl font-bold text-green-600">{activeEntries.length}</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Play className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Today</p>
                    <p className="text-2xl font-bold text-purple-600">{filteredEntries.filter(e => e.status === 'completed').length}</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Square className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Hours/Day</p>
                    <p className="text-2xl font-bold text-orange-600">8.5h</p>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Time Entries Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                                {entry.userName.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{entry.userName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {entry.taskTitle || 'No Task'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {entry.propertyName || 'No Property'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(entry.startTime).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {entry.endTime ? new Date(entry.endTime).toLocaleTimeString() : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatDuration(getCurrentDuration(entry))}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            entry.status === 'active' ? 'bg-green-100 text-green-800' :
                            entry.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {entry.status === 'active' && (
                              <button
                                onClick={() => handleClockOut(entry.id)}
                                className="text-red-600 hover:text-red-900"
                                title="Clock Out"
                              >
                                <Square className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredEntries.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No time entries found for the selected filters</p>
                </div>
              )}
            </div>

            {/* Export Button */}
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 