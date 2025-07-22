'use client';

import { useState } from 'react';
import { X, Calendar, User, Home, Clock, FileText, Sparkles, Eye, Wrench, AlertCircle } from 'lucide-react';

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

interface CreatePropertyTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: PropertyTask) => void;
  properties: Property[];
  staffMembers: User[];
  currentUser?: User | null;
}

export default function CreatePropertyTaskModal({ 
  isOpen, 
  onClose, 
  onTaskCreated, 
  properties, 
  staffMembers,
  currentUser 
}: CreatePropertyTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    taskType: 'CO_CLEAN',
    priority: 'medium',
    status: 'pending',
    propertyId: '',
    assignedUserId: '',
    dueDate: '',
    dueTime: '',
    estimatedHours: 4,
    category: 'cleaning',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const taskTypeOptions = [
    { value: 'CO_CLEAN', label: 'CO-CLEAN', icon: <Sparkles className="w-4 h-4" />, description: 'Complete cleaning and preparation' },
    { value: 'INSPECT', label: 'INSPECT', icon: <Eye className="w-4 h-4" />, description: 'Property inspection and maintenance check' },
    { value: 'HOT_TUB', label: 'HOT-TUB', icon: <Wrench className="w-4 h-4" />, description: 'Hot tub maintenance and cleaning' },
    { value: 'MAINTENANCE', label: 'MAINTENANCE', icon: <Wrench className="w-4 h-4" />, description: 'General maintenance tasks' },
    { value: 'RESTOCK', label: 'RESTOCK', icon: <FileText className="w-4 h-4" />, description: 'Restock supplies and amenities' },
    { value: 'REPAIR', label: 'REPAIR', icon: <AlertCircle className="w-4 h-4" />, description: 'Repair and fix issues' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedProperty = properties.find(p => p.id === formData.propertyId);
      const selectedStaff = staffMembers.find(s => s.id === formData.assignedUserId);
      
      const dueDateTime = formData.dueDate && formData.dueTime 
        ? new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString()
        : new Date().toISOString();

      const taskData = {
        title: formData.title || `${taskTypeOptions.find(t => t.value === formData.taskType)?.label} - ${selectedProperty?.name}`,
        description: formData.description,
        taskType: formData.taskType,
        priority: formData.priority.toUpperCase(),
        status: formData.status.toUpperCase(),
        propertyId: formData.propertyId,
        assignedUserId: formData.assignedUserId,
        dueDate: dueDateTime,
        estimatedHours: formData.estimatedHours,
        category: formData.category,
        notes: formData.notes,
        propertyAddress: selectedProperty?.address
      };

      console.log('Creating property task with data:', taskData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const newTask = await response.json();
        console.log('Property task created successfully:', newTask);
        onTaskCreated(newTask);
        onClose();
        // Reset form
        setFormData({
          title: '',
          description: '',
          taskType: 'CO_CLEAN',
          priority: 'medium',
          status: 'pending',
          propertyId: '',
          assignedUserId: '',
          dueDate: '',
          dueTime: '',
          estimatedHours: 4,
          category: 'cleaning',
          notes: ''
        });
      } else {
        const errorData = await response.text();
        console.error('Failed to create property task:', response.status, errorData);
        alert(`Failed to create property task: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error creating property task:', error);
      alert('Error creating property task. Please try again.');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Create Property Task</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {taskTypeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleInputChange('taskType', option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.taskType === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {option.icon}
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <div className="text-xs text-gray-600">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Property Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property *
            </label>
            <select
              required
              value={formData.propertyId}
              onChange={(e) => handleInputChange('propertyId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Property</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>{property.name}</option>
              ))}
            </select>
          </div>

          {/* Assigned Staff */}
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
              {staffMembers.map(staff => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} ({staff.role})
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
              min="0.25"
              step="0.25"
              value={formData.estimatedHours}
              onChange={(e) => handleInputChange('estimatedHours', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Additional notes or special instructions..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Property Task</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 