'use client';

import { useState, useEffect } from 'react';
import { X, Building, Trash2, User, Shield, Briefcase, Wrench, Users, Plus, Home } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface PropertyAssignment {
  id: string;
  userId: string;
  propertyId: string;
  role: string;
  isActive: boolean;
  user: User;
  property: Property;
}

interface PropertyAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function PropertyAssignmentModal({ isOpen, onClose, user }: PropertyAssignmentModalProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [assignments, setAssignments] = useState<PropertyAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [assignmentRole, setAssignmentRole] = useState('MANAGER');

  useEffect(() => {
    if (isOpen && user) {
      fetchProperties();
      fetchAssignments();
    }
  }, [isOpen, user]);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/v1/properties', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProperties(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const fetchAssignments = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/v1/property-assignments/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userAssignments = data.assignments.filter(
          (assignment: PropertyAssignment) => assignment.userId === user.id
        );
        setAssignments(userAssignments);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleAssignProperty = async () => {
    if (!user || !selectedProperty) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/v1/property-assignments/assign', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          propertyId: selectedProperty,
          role: assignmentRole,
        }),
      });

      if (response.ok) {
        setSelectedProperty('');
        setAssignmentRole('MANAGER');
        fetchAssignments();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to assign property');
      }
    } catch (error) {
      console.error('Error assigning property:', error);
      alert('Failed to assign property');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/v1/property-assignments/assign/${assignmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchAssignments();
      } else {
        alert('Failed to remove assignment');
      }
    } catch (error) {
      console.error('Error removing assignment:', error);
      alert('Failed to remove assignment');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Shield className="w-4 h-4 text-purple-600" />;
      case 'ADMIN':
        return <User className="w-4 h-4 text-blue-600" />;
      case 'HOMEOWNER':
        return <Home className="w-4 h-4 text-indigo-600" />;
      case 'MANAGER':
        return <Briefcase className="w-4 h-4 text-green-600" />;
      case 'EMPLOYEE':
        return <Users className="w-4 h-4 text-orange-600" />;
      case 'CONTRACTOR':
        return <Wrench className="w-4 h-4 text-red-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800';
      case 'HOMEOWNER':
        return 'bg-indigo-100 text-indigo-800';
      case 'MANAGER':
        return 'bg-green-100 text-green-800';
      case 'EMPLOYEE':
        return 'bg-orange-100 text-orange-800';
      case 'CONTRACTOR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailableRoles = () => {
    // Get current user role from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentRole = currentUser.role || 'EMPLOYEE';

    // Define role hierarchy and assignment permissions
    const rolePermissions: { [key: string]: string[] } = {
      'SUPER_ADMIN': ['SUPER_ADMIN', 'ADMIN', 'HOMEOWNER', 'MANAGER', 'EMPLOYEE', 'CONTRACTOR'],
      'ADMIN': ['HOMEOWNER', 'MANAGER', 'EMPLOYEE', 'CONTRACTOR'],
      'HOMEOWNER': ['MANAGER', 'EMPLOYEE', 'CONTRACTOR'],
      'MANAGER': ['EMPLOYEE', 'CONTRACTOR'],
      'EMPLOYEE': [],
      'CONTRACTOR': []
    };

    return rolePermissions[currentRole] || [];
  };

  if (!isOpen || !user) return null;

  const availableRoles = getAvailableRoles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Property Assignments</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage property assignments for {user.name} ({user.email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Assignments */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Building className="w-4 h-4 mr-2" />
              Current Assignments
            </h4>
            {assignments.length > 0 ? (
              <div className="space-y-2">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 text-blue-600 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {assignment.property.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {assignment.property.address}, {assignment.property.city}, {assignment.property.state}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded flex items-center ${getRoleColor(assignment.role)}`}>
                        {getRoleIcon(assignment.role)}
                        <span className="ml-1">{assignment.role}</span>
                      </span>
                      <button
                        onClick={() => handleRemoveAssignment(assignment.id)}
                        className="text-red-600 hover:text-red-800 p-1 transition-colors"
                        title="Remove assignment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Building className="mx-auto w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm">No properties assigned</p>
              </div>
            )}
          </div>

          {/* Add New Assignment */}
          {availableRoles.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Assign New Property
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Property
                  </label>
                  <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select a property</option>
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Assignment Role
                  </label>
                  <select
                    value={assignmentRole}
                    onChange={(e) => setAssignmentRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleAssignProperty}
                    disabled={!selectedProperty || isLoading}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {isLoading ? 'Assigning...' : 'Assign Property'}
                  </button>
                </div>
              </div>
              
              {/* Role Description */}
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <h5 className="text-xs font-medium text-blue-900 mb-2">Role Permissions:</h5>
                <div className="text-xs text-blue-800 space-y-1">
                  <div className="flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    <strong>SUPER_ADMIN:</strong> Full system access
                  </div>
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    <strong>ADMIN:</strong> Property owner with management rights
                  </div>
                  <div className="flex items-center">
                    <Home className="w-3 h-3 mr-1" />
                    <strong>HOMEOWNER:</strong> Homeowner with limited access
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-3 h-3 mr-1" />
                    <strong>MANAGER:</strong> Property management and staff oversight
                  </div>
                  <div className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    <strong>EMPLOYEE:</strong> Property operations and maintenance
                  </div>
                  <div className="flex items-center">
                    <Wrench className="w-3 h-3 mr-1" />
                    <strong>CONTRACTOR:</strong> Specialized services and tasks
                  </div>
                </div>
              </div>
            </div>
          )}

          {availableRoles.length === 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="text-center py-4 text-gray-500">
                <Shield className="mx-auto w-8 h-8 text-gray-300 mb-2" />
                <p className="text-sm">You don't have permission to assign properties</p>
                <p className="text-xs text-gray-400 mt-1">Contact your administrator for property assignment permissions</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 