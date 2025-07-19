'use client';

import { useState } from 'react';
import { X, Calendar, User, Home, Clock, FileText } from 'lucide-react';

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

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
  properties: Property[];
  employees: User[];
  currentUser: User | null;
}

export default function CreateTaskModal({ 
  isOpen, 
  onClose, 
  onTaskCreated, 
  properties, 
  employees,
  currentUser 
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'CLEANING', // Changed from PROPERTY_TASK to match enum
    priority: 'MEDIUM', // Changed to uppercase to match enum
    status: 'PENDING', // Changed to uppercase to match enum
    propertyId: '',
    assignedUserId: '',
    dueDate: '',
    dueTime: '',
    estimatedHours: 1,
    category: 'other'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine date and time
      const dueDateTime = formData.dueDate && formData.dueTime 
        ? new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString()
        : new Date().toISOString();

      // Ensure we have a valid propertyId (use first property if none selected)
      const propertyId = formData.propertyId || (properties.length > 0 ? properties[0].id : null);
      
      if (!propertyId) {
        alert('Please select a property for this task.');
        setLoading(false);
        return;
      }

      const taskData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        priority: formData.priority,
        status: formData.status,
        propertyId: propertyId, // Always provide a propertyId
        assignedUserId: formData.assignedUserId || null,
        dueDate: dueDateTime
      };

      console.log('Creating task with data:', taskData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const newTask = await response.json();
        console.log('✅ Task created successfully:', newTask);
        onTaskCreated(newTask);
        onClose();
        // Reset form
        setFormData({
          title: '',
          description: '',
          type: 'CLEANING',
          priority: 'MEDIUM',
          status: 'PENDING',
          propertyId: '',
          assignedUserId: '',
          dueDate: '',
          dueTime: '',
          estimatedHours: 1,
          category: 'other'
        });
      } else {
        const errorData = await response.text();
        console.error('Failed to create task:', response.status, errorData);
        alert(`Failed to create task: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get all available users including super admin
  const getAllUsers = () => {
    const users = [...employees];
    
    // Add super admin if not already in the list
    if (currentUser && !users.find(user => user.id === currentUser.id)) {
      users.unshift(currentUser); // Add super admin at the top
    }
    
    return users;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Create New Task</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter task title"
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter task description"
            />
          </div>

          {/* Task Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Type *
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="CLEANING">Cleaning</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="INSPECTION">Inspection</option>
              <option value="RESTOCKING">Restocking</option>
              <option value="REPAIR">Repair</option>
              <option value="CONSULTATION">Consultation</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority *
            </label>
            <select
              required
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* Property Assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property
            </label>
            <select
              value={formData.propertyId}
              onChange={(e) => handleInputChange('propertyId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">No Property (Admin Task)</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>{property.name}</option>
              ))}
            </select>
          </div>

          {/* Assigned User - Updated to include super admin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To
            </label>
            <select
              value={formData.assignedUserId}
              onChange={(e) => handleInputChange('assignedUserId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Unassigned</option>
              {getAllUsers().map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                  {user.id === currentUser?.id ? ' (You)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Time
              </label>
              <input
                type="time"
                value={formData.dueTime}
                onChange={(e) => handleInputChange('dueTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Estimated Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Hours
            </label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={formData.estimatedHours}
              onChange={(e) => handleInputChange('estimatedHours', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="other">Other</option>
              <option value="cleaning">Cleaning</option>
              <option value="maintenance">Maintenance</option>
              <option value="guest_request">Guest Request</option>
              <option value="inspection">Inspection</option>
              <option value="repair">Repair</option>
              <option value="check_in">Check-in</option>
              <option value="check_out">Check-out</option>
              <option value="landscaping">Landscaping</option>
              <option value="pool_service">Pool Service</option>
              <option value="security">Security</option>
              <option value="amenities">Amenities</option>
              <option value="supplies">Supplies</option>
              <option value="emergency">Emergency</option>
              <option value="preventive">Preventive</option>
              <option value="seasonal">Seasonal</option>
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 