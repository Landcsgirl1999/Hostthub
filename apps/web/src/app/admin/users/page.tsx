'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield,
  User,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Phone,
  MapPin,
  Camera,
  Bell,
  Settings,
  Building,
  Check,
  AlertCircle,
  Clock,
  Play,
  Square,
  Pause,
  RotateCcw,
  BarChart3,
  Users,
  Eye,
  Download,
  Timer
} from 'lucide-react';
import PropertyAssignmentModal from '../../../components/PropertyAssignmentModal';
import EnhancedUserForm from '../../../components/EnhancedUserForm';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  phoneNumber?: string;
  address?: string;
  birthday?: string;
  title?: string;
  photoUrl?: string;
  preferredContactMethod?: string;
  emergencyNumber?: string;
  canCreateUsers?: boolean;
  accessPermissions?: string[];
  ownedProperties?: any[];
  propertyAssignments?: any[];
  permissions?: any;
  notifications?: any;
  welcomeEmailSent?: boolean;
  canTimeTrack?: boolean; // Added for time tracking
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [showPropertyAssignmentModal, setShowPropertyAssignmentModal] = useState(false);
  const [impersonation, setImpersonation] = useState<{ user: User; adminToken: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found in localStorage');
        setError('No authentication token found');
        return;
      }

      console.log('Fetching users with token...');
      const response = await fetch('/api/v1/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response data:', errorData);
        throw new Error(errorData.error || 'Failed to fetch users');
      }

      const data = await response.json();
      console.log('Users data:', data);
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      setShowCreateModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error instanceof Error ? error.message : 'Failed to create user');
    }
  };

  const handleUpdateUser = async (formData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !selectedUser) return;

      const response = await fetch(`/api/v1/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error instanceof Error ? error.message : 'Failed to update user');
    }
  };

  const handleUpdateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/v1/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      setError('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  const handleResendWelcomeEmail = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/v1/users/${userId}/resend-welcome-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend welcome email');
      }

      fetchUsers(); // Refresh users to update welcomeEmailSent status
      alert('Welcome email resent successfully!');
    } catch (error) {
      console.error('Error resending welcome email:', error);
      setError(error instanceof Error ? error.message : 'Failed to resend welcome email');
    }
  };

  // Impersonation logic
  const handleImpersonate = async (user: User) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    if (user.id === getCurrentUserId()) {
      alert('You cannot impersonate yourself.');
      return;
    }
    try {
      const response = await fetch('/api/v1/auth/impersonate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to impersonate user');
      }
      const data = await response.json();
      // Store the admin token in sessionStorage
      sessionStorage.setItem('adminToken', token);
      // Swap the token to the impersonated user's token
      localStorage.setItem('token', data.token);
      setImpersonation({ user, adminToken: token });
      // Optionally reload or redirect
      router.refresh();
    } catch (error) {
      alert('Failed to impersonate user.');
      console.error('Impersonation error:', error);
    }
  };

  // Return to admin logic
  const handleReturnToAdmin = () => {
    const adminToken = sessionStorage.getItem('adminToken');
    if (adminToken) {
      localStorage.setItem('token', adminToken);
      sessionStorage.removeItem('adminToken');
      setImpersonation(null);
      router.refresh();
    } else {
      alert('No admin session found. Please log in again.');
      router.push('/login');
    }
  };

  // Helper to get current user ID from token
  function getCurrentUserId() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId;
    } catch {
      return null;
    }
  }

  // Add this function to handle time tracking toggle
  const handleTimeTrackingToggle = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/api/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add your auth token here
        },
        body: JSON.stringify({
          canTimeTrack: !currentStatus
        }),
      });

      if (response.ok) {
        // Refresh users list or update the specific user
        // You can either refetch all users or update the local state
        const updatedUsers = users.map(user => 
          user.id === userId 
            ? { ...user, canTimeTrack: !currentStatus }
            : user
        );
        setUsers(updatedUsers);
      } else {
        alert('Failed to update time tracking permission');
      }
    } catch (error) {
      console.error('Error updating time tracking permission:', error);
      alert('Error updating time tracking permission');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'OWNER':
        return <Shield className="w-4 h-4 text-orange-600" />;
      case 'MANAGER':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'EMPLOYEE':
        return <User className="w-4 h-4 text-green-600" />;
      case 'CONTRACTOR':
        return <User className="w-4 h-4 text-purple-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (role) {
      case 'SUPER_ADMIN':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'OWNER':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'MANAGER':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'EMPLOYEE':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'CONTRACTOR':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    return isActive 
      ? `${baseClasses} bg-green-100 text-green-800`
      : `${baseClasses} bg-red-100 text-red-800`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Impersonation Banner */}
      {impersonation && (
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-900 px-4 py-3 rounded flex items-center justify-between">
          <span>
            <b>Impersonating:</b> {impersonation.user.name} ({impersonation.user.email})
          </span>
          <button
            onClick={handleReturnToAdmin}
            className="ml-4 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Return to Admin
          </button>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage user accounts, roles, permissions, and property assignments
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="OWNER">Owner</option>
              <option value="MANAGER">Manager</option>
              <option value="EMPLOYEE">Employee</option>
              <option value="CONTRACTOR">Contractor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'No name'}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                        {user.title && (
                          <div className="text-xs text-gray-400">{user.title}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {user.phoneNumber && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {user.phoneNumber}
                        </div>
                      )}
                      {user.address && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-32">{user.address}</span>
                        </div>
                      )}
                      {user.emergencyNumber && (
                        <div className="text-xs text-red-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          Emergency: {user.emergencyNumber}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        {getRoleIcon(user.role)}
                        <span className={getRoleBadge(user.role)}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={getStatusBadge(user.isActive)}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {user.canCreateUsers && (
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          Can Create Users
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                      {user.lastLogin && (
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Last Login: {new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      )}
                      {user.birthday && (
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Birthday: {new Date(user.birthday).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Status toggle button - hidden for SUPER_ADMIN */}
                      {user.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleUpdateUserStatus(user.id, !user.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isActive 
                              ? 'text-red-600 hover:bg-red-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={user.isActive ? 'Deactivate user' : 'Activate user'}
                        >
                          {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowEditModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      {/* Delete button - hidden for SUPER_ADMIN */}
                      {user.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      
                      {/* Protection indicator for SUPER_ADMIN */}
                      {user.role === 'SUPER_ADMIN' && (
                        <div className="flex items-center space-x-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                          <Shield className="w-3 h-3" />
                          <span>Protected</span>
                        </div>
                      )}
                      {/* Impersonate button - only show if not self */}
                      {user.id !== getCurrentUserId() && (
                        <button
                          onClick={() => handleImpersonate(user)}
                          className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Impersonate user"
                        >
                          <User className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating a new user'}
            </p>
          </div>
        )}
      </div>

      {/* Property Assignments Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Property Assignments</h3>
          <p className="mt-1 text-sm text-gray-600">
            Manage which properties each user can access and edit
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {user.photoUrl ? (
                      <img
                        src={user.photoUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-xs">
                          {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name || 'No name'}
                      </div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                  </div>
                  <span className={getStatusBadge(user.isActive)}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    <strong>Profile:</strong>
                  </div>
                  {user.photoUrl ? (
                    <div className="flex items-center space-x-2">
                      <img 
                        src={user.photoUrl} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-xs text-gray-700">Photo uploaded</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-xs text-gray-500">No photo</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    <strong>Welcome Email:</strong>
                  </div>
                  <div className="flex items-center space-x-2">
                    {user.welcomeEmailSent ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <Check className="w-3 h-3" />
                        <span className="text-xs">Sent</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-orange-600">
                        <AlertCircle className="w-3 h-3" />
                        <span className="text-xs">Pending</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleResendWelcomeEmail(user.id)}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Resend
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    <strong>Assigned Properties:</strong>
                  </div>
                  {user.propertyAssignments && user.propertyAssignments.length > 0 ? (
                    <div className="space-y-1">
                      {user.propertyAssignments.map((assignment: any) => (
                        <div key={assignment.propertyId} className="flex items-center justify-between text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          <span>{assignment.property?.name || assignment.propertyId}</span>
                          <span className="text-blue-600 font-medium">
                            {assignment.role || 'ASSIGNED'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 italic">
                      No properties assigned
                    </div>
                  )}
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowPropertyAssignmentModal(true);
                    }}
                  >
                    <Building className="w-3 h-3 mr-1" />
                    Manage Assignments
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced User Form Modals */}
      <EnhancedUserForm
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateUser}
        isEditing={false}
      />

      <EnhancedUserForm
        user={selectedUser}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUpdateUser}
        isEditing={true}
      />

      {/* Property Assignment Modal */}
      <PropertyAssignmentModal
        isOpen={showPropertyAssignmentModal}
        onClose={() => setShowPropertyAssignmentModal(false)}
        user={selectedUser}
      />
    </div>
  );
} 