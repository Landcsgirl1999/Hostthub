'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Users, Calendar, ArrowRight, Building2, Clock, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { subMonths, addMonths } from 'date-fns';
import TimeTrackingModal from '../../../components/TimeTrackingModal';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  assignedProperties: string[];
  canTimeTrack?: boolean; // Added for time tracking permission
}

export default function TaskCalendarPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showTimeTrackingModal, setShowTimeTrackingModal] = useState(false);

  // Mock data
  const mockUser: User = {
    id: '1',
    name: 'Sierra Reynolds',
    email: 'sierra.reynolds@hostit.com',
    role: 'SUPER_ADMIN',
    isActive: true,
    assignedProperties: ['beach1', 'beach2', 'mountain', 'ocean', 'penthouse'],
    canTimeTrack: true // Mocking time tracking permission
  };

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      } else {
        // Fallback to mock user for demo
        setCurrentUser(mockUser);
        console.log('✅ Set current user to Sierra Reynolds (SUPER_ADMIN)');
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      // Fallback to mock user
      setCurrentUser(mockUser);
      console.log('✅ Set current user to Sierra Reynolds (SUPER_ADMIN) - fallback');
    }
  };

  // Mock data for TimeTrackingModal
  const mockStaffMembers = [
    { id: '1', name: 'John Doe', email: 'john.doe@hostit.com', role: 'EMPLOYEE', isActive: true, assignedProperties: ['beach1', 'beach2'] },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@hostit.com', role: 'EMPLOYEE', isActive: true, assignedProperties: ['mountain', 'ocean'] },
    { id: '3', name: 'Peter Jones', email: 'peter.jones@hostit.com', role: 'EMPLOYEE', isActive: true, assignedProperties: ['penthouse'] },
  ];

  const mockPropertyTasks = [
    { id: '1', title: 'Clean Beach 1', start: '2023-10-26T09:00:00', end: '2023-10-26T11:00:00', staff: '1' },
    { id: '2', title: 'Maintenance Mountain', start: '2023-10-26T14:00:00', end: '2023-10-26T16:00:00', staff: '2' },
    { id: '3', title: 'Check-in Ocean View', start: '2023-10-26T10:00:00', end: '2023-10-26T11:00:00', staff: '3' },
  ];

  const mockProperties = [
    { id: 'beach1', name: 'Beach House 1' },
    { id: 'beach2', name: 'Beach House 2' },
    { id: 'mountain', name: 'Mountain Lodge' },
    { id: 'ocean', name: 'Ocean View Villa' },
    { id: 'penthouse', name: 'Penthouse Suite' },
  ];

  const canTimeTrack = currentUser?.canTimeTrack || currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';

  // Mock data for TimeTrackingModal
  const mockTimeEntries = [
    { id: '1', taskId: '1', userId: '1', date: '2023-10-26', hours: 2, notes: 'Cleaning' },
    { id: '2', taskId: '2', userId: '2', date: '2023-10-26', hours: 1, notes: 'Maintenance' },
  ];

  useEffect(() => {
    // Set current user immediately for demo
    setCurrentUser(mockUser);
    console.log('✅ Set current user to Sierra Reynolds (SUPER_ADMIN) - immediate');

    // Also try to fetch from API
    fetchCurrentUser();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Time Tracking Button */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Task Calendar</h1>
          
          <div className="flex space-x-3">
            {canTimeTrack && (
              <button
                onClick={() => setShowTimeTrackingModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>Time Tracking</span>
              </button>
            )}
            
            <button
              onClick={() => setShowCreateTaskModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Add Time Tracking Button Here */}
          <div className="flex items-center space-x-3">
            {canTimeTrack && (
              <button
                onClick={() => setShowTimeTrackingModal(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Clock className="w-4 h-4" />
                <span>Time Tracking</span>
              </button>
            )}
            
            <button
              onClick={() => setShowCreateTaskModal(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Calendar Content (Placeholder) */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <p>Calendar view goes here. This is a placeholder.</p>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentUser?.assignedProperties?.length || 5}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Events</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Both calendars are now separated for better organization and focused workflows. 
            Choose the calendar that best fits your current needs.
          </p>
        </div>
      </div>

      {/* Time Tracking Modal */}
      {canTimeTrack && (
        <TimeTrackingModal
          isOpen={showTimeTrackingModal}
          onClose={() => setShowTimeTrackingModal(false)}
          currentUser={currentUser}
          users={mockStaffMembers}
          tasks={mockPropertyTasks}
          properties={mockProperties}
          onTimeEntryUpdate={(entry) => console.log('Updated:', entry)}
          onTimeEntryCreate={(entry) => console.log('Created:', entry)}
        />
      )}
    </div>
  );
}