'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, User, Home, CheckCircle, AlertCircle, XCircle, Edit, Eye, FileText, X, Users, Briefcase, Sparkles, Wrench } from 'lucide-react';
import CreatePropertyTaskModal from '../../../components/CreatePropertyTaskModal';

interface PropertyTask {
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
  category: 'cleaning' | 'maintenance' | 'inspection' | 'hot_tub' | 'restocking' | 'repair';
  estimatedHours: number;
  actualHours?: number;
  taskType: 'CO_CLEAN' | 'INSPECT' | 'HOT_TUB' | 'MAINTENANCE' | 'RESTOCK' | 'REPAIR';
  propertyAddress?: string;
  notes?: string;
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
}

export default function PropertyTasksPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('month');
  const [propertyTasks, setPropertyTasks] = useState<PropertyTask[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [staffMembers, setStaffMembers] = useState<User[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showTaskDetailsModal, setShowTaskDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<PropertyTask | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data
  useEffect(() => {
    const mockProperties: Property[] = [
      { id: 'hearthstone', name: 'Alpine Hearthstone Retreat', address: '110 Old Town Rd, Stratton, VT' },
      { id: 'stratton_view', name: 'Stratton View Lodge', address: 'Stratton Mountain, VT' },
      { id: 'bromley', name: 'Cozy Bromley Retreat', address: 'Bromley Mountain, VT' },
      { id: 'shadow_peak', name: 'Shadow Peak Chalet', address: 'Shadow Peak, VT' },
      { id: 'tower_house', name: 'The Tower House', address: 'Londonderry, VT' },
      { id: 'drop_point', name: 'Drop Point Cabin', address: 'Drop Point, VT' },
      { id: 'londonderry', name: 'Londonderry Links', address: 'Londonderry, VT' }
    ];

    const mockStaffMembers: User[] = [
      { id: 'candace', name: 'Candace', email: 'candace@hostit.com', role: 'CLEANER', isActive: true, assignedProperties: ['hearthstone', 'bromley', 'stratton_view'] },
      { id: 'jenny', name: 'Jenny Streck', email: 'jenny@hostit.com', role: 'CLEANER', isActive: true, assignedProperties: ['shadow_peak', 'tower_house', 'drop_point'] },
      { id: 'sierra', name: 'Sierra Reyno', email: 'sierra.reyno@hostit.com', role: 'MANAGER', isActive: true, assignedProperties: ['hearthstone', 'bromley', 'stratton_view', 'shadow_peak', 'tower_house', 'drop_point'] },
      { id: 'jacob', name: 'Jacob Hastin', email: 'jacob@hostit.com', role: 'MAINTENANCE', isActive: true, assignedProperties: ['hearthstone', 'bromley', 'stratton_view', 'shadow_peak', 'tower_house', 'drop_point'] },
      { id: 'jennifer', name: 'Jennifer Murj', email: 'jennifer@hostit.com', role: 'CLEANER', isActive: true, assignedProperties: ['tower_house', 'drop_point', 'londonderry'] }
    ];

    const mockPropertyTasks: PropertyTask[] = [
      {
        id: '1',
        title: 'CO-CLEAN - Alpine Hearthstone Retreat',
        description: 'Complete cleaning and preparation for guest arrival',
        status: 'pending',
        priority: 'high',
        assignedTo: 'Candace',
        property: 'Alpine Hearthstone Retreat',
        propertyId: 'hearthstone',
        dueDate: '2025-07-16T11:00:00.000Z',
        createdAt: '2025-07-15',
        category: 'cleaning',
        estimatedHours: 6,
        taskType: 'CO_CLEAN',
        propertyAddress: '110 Old Town Rd, Stratton, VT',
        notes: 'Luxurious 3BR/3BA condo - focus on kitchen and bathrooms'
      },
      {
        id: '2',
        title: 'INSPECT - Stratton View Lodge',
        description: 'Property inspection and maintenance check',
        status: 'pending',
        priority: 'medium',
        assignedTo: 'Sierra Reyno',
        property: 'Stratton View Lodge',
        propertyId: 'stratton_view',
        dueDate: '2025-07-16T13:00:00.000Z',
        createdAt: '2025-07-15',
        category: 'inspection',
        estimatedHours: 2,
        taskType: 'INSPECT',
        propertyAddress: 'Stratton Mountain, VT',
        notes: 'Check HVAC, plumbing, and general property condition'
      },
      {
        id: '3',
        title: 'HOT-TUB - Cozy Bromley Retreat',
        description: 'Hot tub maintenance and cleaning',
        status: 'in_progress',
        priority: 'medium',
        assignedTo: 'Jacob Hastin',
        property: 'Cozy Bromley Retreat',
        propertyId: 'bromley',
        dueDate: '2025-07-16T11:00:00.000Z',
        createdAt: '2025-07-15',
        category: 'maintenance',
        estimatedHours: 1.5,
        taskType: 'HOT_TUB',
        propertyAddress: 'Bromley Mountain, VT',
        notes: 'Clean filters, check chemicals, test temperature'
      },
      {
        id: '4',
        title: 'CO-CLEAN - Shadow Peak Chalet',
        description: 'Post-checkout cleaning and preparation',
        status: 'completed',
        priority: 'high',
        assignedTo: 'Jenny Streck',
        property: 'Shadow Peak Chalet',
        propertyId: 'shadow_peak',
        dueDate: '2025-07-15T11:00:00.000Z',
        createdAt: '2025-07-14',
        category: 'cleaning',
        estimatedHours: 8,
        actualHours: 7.5,
        taskType: 'CO_CLEAN',
        propertyAddress: 'Shadow Peak, VT',
        notes: 'Large property - 4 bedrooms, 3 bathrooms completed'
      }
    ];

    setProperties(mockProperties);
    setStaffMembers(mockStaffMembers);
    setPropertyTasks(mockPropertyTasks);
    setLoading(false);
  }, []);

  // Calendar navigation
  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedProperty(null);
    setSelectedStaff(null);
  };

  const handlePropertyClick = (propertyId: string) => {
    setSelectedProperty(propertyId);
    setSelectedDate(null);
    setSelectedStaff(null);
  };

  const handleStaffClick = (staffId: string) => {
    setSelectedStaff(staffId);
    setSelectedDate(null);
    setSelectedProperty(null);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowCreateTaskModal(true);
  };

  const handleEditTask = (task: PropertyTask) => {
    setSelectedTask(task);
    setShowCreateTaskModal(true);
  };

  const handleTaskStatusChange = (taskId: string, newStatus: PropertyTask['status']) => {
    setPropertyTasks(propertyTasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleTaskPriorityChange = (taskId: string, newPriority: PropertyTask['priority']) => {
    setPropertyTasks(propertyTasks.map(task =>
      task.id === taskId ? { ...task, priority: newPriority } : task
    ));
  };

  const handleTaskAssignedToChange = (taskId: string, newAssignedTo: string) => {
    setPropertyTasks(propertyTasks.map(task =>
      task.id === taskId ? { ...task, assignedTo: newAssignedTo } : task
    ));
  };

  const handleTaskDueDateChange = (taskId: string, newDueDate: string) => {
    setPropertyTasks(propertyTasks.map(task =>
      task.id === taskId ? { ...task, dueDate: newDueDate } : task
    ));
  };

  const handleTaskEstimatedHoursChange = (taskId: string, newEstimatedHours: number) => {
    setPropertyTasks(propertyTasks.map(task =>
      task.id === taskId ? { ...task, estimatedHours: newEstimatedHours } : task
    ));
  };

  const handleTaskActualHoursChange = (taskId: string, newActualHours: number) => {
    setPropertyTasks(propertyTasks.map(task =>
      task.id === taskId ? { ...task, actualHours: newActualHours } : task
    ));
  };

  const handleTaskNotesChange = (taskId: string, newNotes: string) => {
    setPropertyTasks(propertyTasks.map(task =>
      task.id === taskId ? { ...task, notes: newNotes } : task
    ));
  };

  const handleTaskDelete = (taskId: string) => {
    setPropertyTasks(propertyTasks.filter(task => task.id !== taskId));
  };

  const handleTaskSave = (task: PropertyTask) => {
    setPropertyTasks(prevTasks => {
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

  const handleTaskDetailsOpen = (task: PropertyTask) => {
    setSelectedTask(task);
    setShowTaskDetailsModal(true);
  };

  const filteredTasks = propertyTasks.filter(task => {
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
  }, {} as { [key: string]: PropertyTask[] });

  const sortedDates = Object.keys(groupedTasks).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Property Tasks</h1>
        <button
          onClick={handleCreateTask}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="mr-2" /> Create New Task
        </button>
      </div>

      <div className="flex items-center mb-4">
        <button
          onClick={goToPreviousPeriod}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <span className="mx-2 text-lg font-semibold">
          {viewMode === 'week' ? 'Week' : 'Month'}
        </span>
        <button
          onClick={goToNextPeriod}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedDates.map(dateKey => (
          <div key={dateKey} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">{new Date(dateKey).toLocaleDateString()}</h3>
            {groupedTasks[dateKey].map(task => (
              <div
                key={task.id}
                className="bg-gray-100 p-3 rounded-md mb-2 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {task.assignedTo}
                  </span>
                  <span className="text-sm text-gray-600">
                    {task.status}
                  </span>
                  <span className="text-sm text-gray-600">
                    {task.priority}
                  </span>
                  <button
                    onClick={() => handleTaskDetailsOpen(task)}
                    className="p-2 rounded-full hover:bg-gray-200"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEditTask(task)}
                    className="p-2 rounded-full hover:bg-gray-200"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleTaskDelete(task.id)}
                    className="p-2 rounded-full hover:bg-red-200"
                  >
                    <XCircle className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Tasks for {selectedDate.toLocaleDateString()}</h3>
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="bg-gray-100 p-3 rounded-md mb-2 flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-600">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {task.assignedTo}
                </span>
                <span className="text-sm text-gray-600">
                  {task.status}
                </span>
                <span className="text-sm text-gray-600">
                  {task.priority}
                </span>
                <button
                  onClick={() => handleTaskDetailsOpen(task)}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleEditTask(task)}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleTaskDelete(task.id)}
                  className="p-2 rounded-full hover:bg-red-200"
                >
                  <XCircle className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProperty && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Tasks for {properties.find(p => p.id === selectedProperty)?.name}</h3>
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="bg-gray-100 p-3 rounded-md mb-2 flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-600">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {task.assignedTo}
                </span>
                <span className="text-sm text-gray-600">
                  {task.status}
                </span>
                <span className="text-sm text-gray-600">
                  {task.priority}
                </span>
                <button
                  onClick={() => handleTaskDetailsOpen(task)}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleEditTask(task)}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleTaskDelete(task.id)}
                  className="p-2 rounded-full hover:bg-red-200"
                >
                  <XCircle className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedStaff && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-2">Tasks for {staffMembers.find(s => s.id === selectedStaff)?.name}</h3>
          {filteredTasks.map(task => (
            <div
              key={task.id}
              className="bg-gray-100 p-3 rounded-md mb-2 flex justify-between items-center"
            >
              <div>
                <h4 className="font-semibold">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-600">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {task.assignedTo}
                </span>
                <span className="text-sm text-gray-600">
                  {task.status}
                </span>
                <span className="text-sm text-gray-600">
                  {task.priority}
                </span>
                <button
                  onClick={() => handleTaskDetailsOpen(task)}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleEditTask(task)}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleTaskDelete(task.id)}
                  className="p-2 rounded-full hover:bg-red-200"
                >
                  <XCircle className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateTaskModal && (
        <CreatePropertyTaskModal
          isOpen={showCreateTaskModal}
          onClose={handleTaskCancel}
          onTaskCreated={handleTaskSave}
          properties={properties}
          staffMembers={staffMembers}
        />
      )}

      {showTaskDetailsModal && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">{selectedTask.title}</h3>
            <p className="text-sm text-gray-600 mb-2">Description: {selectedTask.description}</p>
            <p className="text-sm text-gray-600 mb-2">
              Due Date: {new Date(selectedTask.dueDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Status: {selectedTask.status}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Priority: {selectedTask.priority}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Assigned To: {selectedTask.assignedTo}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Property: {properties.find(p => p.id === selectedTask.propertyId)?.name}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Notes: {selectedTask.notes || 'No notes'}
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleTaskDetailsClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => handleEditTask(selectedTask)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 