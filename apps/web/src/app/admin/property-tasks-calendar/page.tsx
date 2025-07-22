'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Home, CheckCircle, AlertCircle, XCircle, Edit, Eye, FileText, X, Wrench, Sparkles, Calendar, Clock } from 'lucide-react';
import CreateTaskModal from '../../../components/CreateTaskModal';
import TimeTrackingModal from '../../../components/TimeTrackingModal';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isSameMonth, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';

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
  category: string;
  estimatedHours: number;
  type?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestName?: string;
  actualHours?: number;
}

interface Property {
  id: string;
  name: string;
  address: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  assignedProperties: string[];
  canTimeTrack?: boolean; // Added for time tracking permission
}

interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  type: string;
}

export default function PropertyTasksCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTimeTrackingModal, setShowTimeTrackingModal] = useState(false);

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      } else {
        // Fallback to mock user for demo
        const mockUser: User = {
          id: '1',
          name: 'Sierra Reynolds',
          email: 'sierra.reynolds@hostit.com',
          role: 'SUPER_ADMIN',
          isActive: true,
          assignedProperties: ['beach1', 'beach2', 'mountain', 'ocean', 'penthouse'],
          canTimeTrack: true // Mock for demo
        };
        setCurrentUser(mockUser);
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
        canTimeTrack: true // Mock for demo
      };
      setCurrentUser(mockUser);
      console.log('✅ Set current user to Sierra Reynolds (SUPER_ADMIN) - fallback');
    }
  };

  // Mock data
  useEffect(() => {
    // Set current user immediately for demo
    const mockUser: User = {
      id: '1',
      name: 'Sierra Reynolds',
      email: 'sierra.reynolds@hostit.com',
      role: 'SUPER_ADMIN',
      isActive: true,
      assignedProperties: ['beach1', 'beach2', 'mountain', 'ocean', 'penthouse'],
      canTimeTrack: true // Mock for demo
    };
    setCurrentUser(mockUser);
    console.log('✅ Set current user to Sierra Reynolds (SUPER_ADMIN) - immediate');

    // Also try to fetch from API
    fetchCurrentUser();

    const mockProperties: Property[] = [
      { id: 'beach1', name: 'Beach House #1', address: '123 Beach Blvd, Malibu, CA' },
      { id: 'beach2', name: 'Beach House #2', address: '456 Ocean Dr, Malibu, CA' },
      { id: 'mountain', name: 'Mountain Cabin', address: '789 Pine Rd, Big Bear, CA' },
      { id: 'ocean', name: 'Ocean View Villa', address: '321 Coastal Hwy, Laguna, CA' },
      { id: 'penthouse', name: 'Luxury Penthouse', address: '555 Downtown Ave, LA, CA' }
    ];

    const mockEmployees: User[] = [
      { id: '2', name: 'Sarah Johnson', email: 'sarah@hostit.com', role: 'EMPLOYEE', isActive: true, assignedProperties: ['beach1', 'beach2'] },
      { id: '3', name: 'Mike Chen', email: 'mike@hostit.com', role: 'CONTRACTOR', isActive: true, assignedProperties: ['mountain', 'ocean'] },
      { id: '4', name: 'Lisa Rodriguez', email: 'lisa@hostit.com', role: 'EMPLOYEE', isActive: true, assignedProperties: ['ocean', 'penthouse'] },
      { id: '5', name: 'David Wilson', email: 'david@hostit.com', role: 'CONTRACTOR', isActive: true, assignedProperties: ['beach1', 'penthouse'] },
      { id: '6', name: 'Emma Thompson', email: 'emma@hostit.com', role: 'MANAGER', isActive: true, assignedProperties: ['beach1', 'beach2', 'mountain', 'ocean', 'penthouse'] }
    ];

    const mockBookings: Booking[] = [
      {
        id: '1',
        propertyId: 'beach1',
        propertyName: 'Beach House #1',
        guestName: 'John Smith',
        checkInDate: '2024-01-15',
        checkOutDate: '2024-01-20',
        status: 'confirmed',
        type: 'guest'
      },
      {
        id: '2',
        propertyId: 'ocean',
        propertyName: 'Ocean View Villa',
        guestName: 'Mary Johnson',
        checkInDate: '2024-01-10',
        checkOutDate: '2024-01-12',
        status: 'confirmed',
        type: 'guest'
      },
      {
        id: '3',
        propertyId: 'mountain',
        propertyName: 'Mountain Cabin',
        guestName: 'Sierra Reynolds',
        checkInDate: '2024-01-18',
        checkOutDate: '2024-01-25',
        status: 'confirmed',
        type: 'owner_stay'
      }
    ];

    const mockTasks: Task[] = [
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
        checkInDate: '2024-01-15',
        guestName: 'John Smith',
        type: 'property_task'
      },
      {
        id: '2',
        title: 'Post-Check-out Cleaning',
        description: 'Complete cleaning after guest departure',
        status: 'pending',
        priority: 'high',
        assignedTo: 'Lisa Rodriguez',
        property: 'Ocean View Villa',
        propertyId: 'ocean',
        dueDate: '2024-01-12',
        createdAt: '2024-01-10',
        category: 'check_out',
        estimatedHours: 2.5,
        checkOutDate: '2024-01-12',
        guestName: 'Mary Johnson',
        type: 'property_task'
      },
      {
        id: '3',
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
        type: 'property_task'
      },
      {
        id: '4',
        title: 'Guest Welcome Package',
        description: 'Prepare welcome basket and amenities',
        status: 'completed',
        priority: 'medium',
        assignedTo: 'Emma Thompson',
        property: 'Beach House #1',
        propertyId: 'beach1',
        dueDate: '2024-01-14',
        createdAt: '2024-01-10',
        category: 'check_in',
        estimatedHours: 1,
        actualHours: 1,
        checkInDate: '2024-01-15',
        guestName: 'John Smith',
        type: 'property_task'
      }
    ];

    setProperties(mockProperties);
    setEmployees(mockEmployees);
    setBookings(mockBookings);
    setTasks(mockTasks);
    setLoading(false);
  }, []);

  // Filter data based on user role
  const getFilteredProperties = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'SUPER_ADMIN') return properties;
    return properties.filter(property => 
      currentUser.assignedProperties.includes(property.id)
    );
  };

  const getFilteredTasks = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'SUPER_ADMIN') return tasks;
    return tasks.filter(task => 
      currentUser.assignedProperties.includes(task.propertyId)
    );
  };

  const getFilteredBookings = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'SUPER_ADMIN') return bookings;
    return bookings.filter(booking => 
      currentUser.assignedProperties.includes(booking.propertyId)
    );
  };

  // Navigation functions
  const goToPreviousPeriod = () => {
    if (viewMode === 'week') {
      setCurrentDate(prev => subWeeks(prev, 1));
    } else {
      setCurrentDate(prev => subMonths(prev, 1));
    }
  };

  const goToNextPeriod = () => {
    if (viewMode === 'week') {
      setCurrentDate(prev => addWeeks(prev, 1));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get dates for current view
  const getScrollableDays = (date: Date, view: 'week' | 'month') => {
    if (view === 'week') {
      const start = startOfWeek(date, { weekStartsOn: 0 });
      const days = [];
      for (let i = 0; i < 7; i++) {
        days.push(addDays(start, i));
      }
      return days;
    } else {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      const days = [];
      let current = start;
      while (current <= end) {
        days.push(current);
        current = addDays(current, 1);
      }
      return days;
    }
  };

  const scrollableDays = getScrollableDays(currentDate, viewMode);

  // Helper functions
  const getTasksForDate = (date: Date) => {
    return getFilteredTasks().filter(task => 
      isSameDay(new Date(task.dueDate), date)
    );
  };

  const getBookingsForDate = (date: Date) => {
    return getFilteredBookings().filter(booking => 
      isSameDay(new Date(booking.checkInDate), date) || 
      isSameDay(new Date(booking.checkOutDate), date)
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getBookingColor = (type: string) => {
    switch (type) {
      case 'guest': return 'bg-blue-500';
      case 'owner_stay': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
    setShowCreateTaskModal(false);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetailsModal(true);
  };

  const handleDateClick = (date: Date, propertyName: string) => {
    // Handle date click - could open task creation modal
    console.log('Date clicked:', date, 'for property:', propertyName);
  };

  const renderCalendar = () => {
    if (viewMode === 'week') {
      return (
        <div className="relative w-full">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ maxHeight: '70vh' }}>
            <div className="min-w-full">
              {/* Sticky Header Row */}
              <div className="grid gap-1 mb-6 sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm" 
                   style={{ 
                     gridTemplateColumns: `minmax(200px, 1fr) repeat(${scrollableDays.length}, minmax(80px, 1fr))` 
                   }}>
                <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl flex items-center space-x-3 sticky left-0 z-20 group-hover:from-orange-100 group-hover:to-red-100 transition-all duration-200 border-r border-gray-100 shadow-sm">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-sm"></div>
                  <span className="font-semibold text-gray-800">Properties</span>
                </div>
                {scrollableDays.map((day, index) => (
                  <div
                    key={index}
                    className="p-3 text-center border-r border-gray-50 last:border-r-0 hover:bg-gray-50/50 transition-colors duration-200"
                  >
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                      {format(day, 'EEE')}
                    </div>
                    <div className={`text-lg font-bold mt-1 ${
                      isSameDay(day, new Date()) 
                        ? 'text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-full w-8 h-8 flex items-center justify-center mx-auto shadow-lg' 
                        : 'text-gray-800'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {format(day, 'MMM')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Property Rows */}
              {getFilteredProperties().map((property, propertyIndex) => (
                <div key={property.id} className="group mb-2">
                  <div className="grid gap-1" 
                       style={{ 
                         gridTemplateColumns: `minmax(200px, 1fr) repeat(${scrollableDays.length}, minmax(80px, 1fr))` 
                       }}>
                    {/* Property Name Column - Sticky */}
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl flex items-center space-x-3 sticky left-0 z-20 group-hover:from-orange-50 group-hover:to-red-50 transition-all duration-200 border-r border-gray-100 shadow-sm">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-sm"></div>
                      <div>
                        <div className="font-semibold text-gray-800">{property.name}</div>
                        <div className="text-xs text-gray-500">{property.address}</div>
                      </div>
                    </div>

                    {/* Date Columns */}
                    {scrollableDays.map((day, dayIndex) => {
                      const dayTasks = getTasksForDate(day).filter(task => task.propertyId === property.id);
                      const dayBookings = getBookingsForDate(day).filter(booking => booking.propertyId === property.id);

                      return (
                        <div
                          key={dayIndex}
                          className="relative h-20 p-2 border-r border-gray-50 last:border-r-0 transition-all duration-200 cursor-pointer rounded-lg mx-1 hover:bg-gray-50/30"
                          onClick={() => handleDateClick(day, property.name)}
                        >
                          {/* Date Number */}
                          <div className={`absolute top-2 left-2 text-xs font-semibold ${
                            isSameDay(day, new Date()) 
                              ? 'text-orange-600 font-bold' 
                              : 'text-gray-600'
                          }`}>
                            {format(day, 'd')}
                          </div>

                          {/* Tasks */}
                          <div className="absolute top-6 left-1 right-1 space-y-1">
                            {dayTasks.slice(0, 2).map((task, taskIndex) => (
                              <div
                                key={task.id}
                                className={`px-2 py-1 rounded-lg text-xs font-medium text-white cursor-pointer transition-all duration-200 hover:scale-105 shadow-md ${
                                  task.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                                  task.status === 'in_progress' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                                  task.status === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                                  'bg-gradient-to-r from-red-500 to-pink-600'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskClick(task);
                                }}
                                title={`${task.title} - ${task.assignedTo} (${task.priority})`}
                              >
                                <div className="flex items-center space-x-1">
                                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                  <span className="truncate">{task.title}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Bookings */}
                          <div className="absolute bottom-1 left-1 right-1">
                            {dayBookings.slice(0, 1).map((booking, bookingIndex) => (
                              <div
                                key={booking.id}
                                className={`px-2 py-1 rounded-lg text-xs font-medium text-white cursor-pointer transition-all duration-200 hover:scale-105 shadow-md ${
                                  getBookingColor(booking.type)
                                }`}
                                title={`${booking.guestName} - ${booking.type}`}
                              >
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 rounded-full bg-white/50"></div>
                                  <span className="truncate">{booking.guestName}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Task count indicator */}
                          {dayTasks.length > 2 && (
                            <div className="absolute top-1 right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              +{dayTasks.length - 2}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      // Monthly view - traditional calendar grid
      const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeks = [];
      for (let i = 0; i < scrollableDays.length; i += 7) {
        weeks.push(scrollableDays.slice(i, i + 7));
      }

      return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-px bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            {weekDays.map((day, index) => (
              <div key={index} className="p-4 text-center bg-white">
                <div className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{day}</div>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-100">
            {scrollableDays.map((day, index) => {
              if (!day) {
                return (
                  <div key={index} className="h-40 bg-gray-50"></div>
                );
              }

              const dayTasks = getFilteredTasks().filter(task => 
                isSameDay(new Date(task.dueDate), day)
              );

              return (
                <div
                  key={index}
                  className={`relative h-40 p-3 bg-white hover:bg-gray-50/80 transition-all duration-200 cursor-pointer group ${
                    isSameDay(day, new Date()) ? 'ring-2 ring-orange-500 ring-inset bg-orange-50/50' : ''
                  }`}
                  onClick={() => handleDateClick(day, '')}
                >
                  {/* Date number */}
                  <div className={`text-sm font-bold mb-2 ${
                    isSameDay(day, new Date()) 
                      ? 'text-orange-600' 
                      : 'text-gray-800'
                  }`}>
                    {format(day, 'd')}
                  </div>

                  {/* Tasks */}
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((task, taskIndex) => (
                      <div
                        key={task.id}
                        className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer transition-all duration-200 hover:scale-105 shadow-sm relative ${
                          task.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                          task.status === 'in_progress' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                          task.status === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-amber-600' :
                          'bg-gradient-to-r from-red-500 to-pink-600'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskClick(task);
                        }}
                        title={`${task.title} - ${task.assignedTo} (${task.priority})`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                          <div className="flex-1 min-w-0">
                            <div className="truncate font-semibold text-white">
                              {task.title}
                            </div>
                            <div className="text-xs opacity-90">
                              {task.property} • {task.assignedTo}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Task count indicator */}
                  {dayTasks.length > 3 && (
                    <div className="absolute bottom-1 right-1 bg-orange-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      +{dayTasks.length - 3}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const canTimeTrack = currentUser?.canTimeTrack || currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Property Tasks Calendar</h1>
          <p className="text-gray-600">Manage and schedule property maintenance tasks</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateTaskModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Task</span>
          </button>

          {/* NEW TIME TRACKING BUTTON */}
          {canTimeTrack && (
            <button
              onClick={() => setShowTimeTrackingModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Time Tracking</span>
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center space-x-4">
          <button
            onClick={goToPreviousPeriod}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Today
          </button>
          
          <button
            onClick={goToNextPeriod}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-800">
            {viewMode === 'week' 
              ? `${format(scrollableDays[0], 'MMM d')} - ${format(scrollableDays[6], 'MMM d, yyyy')}`
              : format(currentDate, 'MMMM yyyy')
            }
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'week'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'month'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Month
            </button>
          </div>

          <button
            onClick={() => setShowCreateTaskModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Unscheduled Tasks Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <span>Unscheduled Tasks</span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">Tasks without assigned due dates</p>
        </div>
        <div className="p-6">
          {getFilteredTasks().filter(task => !task.dueDate).length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600">All tasks are scheduled!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {getFilteredTasks()
                .filter(task => !task.dueDate)
                .slice(0, 5)
                .map(task => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                      <div>
                        <div className="font-medium text-gray-800">{task.title}</div>
                        <div className="text-sm text-gray-600">{task.property} • {task.assignedTo}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        {renderCalendar()}
      </div>

      {/* Modals */}
      {showCreateTaskModal && (
        <CreateTaskModal
          isOpen={showCreateTaskModal}
          onClose={() => setShowCreateTaskModal(false)}
          onTaskCreated={handleTaskCreated}
          properties={getFilteredProperties()}
          employees={employees}
          currentUser={currentUser}
        />
      )}

      {/* Task Details Modal */}
      {showTaskDetailsModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">Task Details</h3>
                <button
                  onClick={() => setShowTaskDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">{selectedTask.title}</h4>
                <p className="text-gray-600">{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTask.status === 'completed' ? 'bg-green-100 text-green-800' :
                      selectedTask.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      selectedTask.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedTask.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Priority</label>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedTask.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      selectedTask.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      selectedTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Property</label>
                  <p className="mt-1 text-gray-800">{selectedTask.property}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Assigned To</label>
                  <p className="mt-1 text-gray-800">{selectedTask.assignedTo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Due Date</label>
                  <p className="mt-1 text-gray-800">{selectedTask.dueDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estimated Hours</label>
                  <p className="mt-1 text-gray-800">{selectedTask.estimatedHours}h</p>
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
          currentUser={currentUser}
          users={employees}
          tasks={tasks}
          properties={properties}
          onTimeEntryUpdate={(entry) => {
            console.log('Time entry updated:', entry);
            // Optionally refresh tasks or update UI
          }}
          onTimeEntryCreate={(entry) => {
            console.log('New time entry:', entry);
            // Optionally refresh tasks or update UI
          }}
        />
      )}
    </div>
  );
} 