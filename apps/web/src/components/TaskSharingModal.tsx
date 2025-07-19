'use client';

import { useState } from 'react';
import { X, Share2, Mail, Lock, Eye, Edit, Settings, Users, Globe, UserCheck, AlertCircle } from 'lucide-react';

interface TaskSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (shareData: { email: string; permissions: 'view' | 'edit' | 'full' }) => void;
  task: {
    id: string;
    title: string;
    property: string;
    isShared: boolean;
    sharedWith: string[];
    sharePermissions: 'view' | 'edit' | 'full';
  } | null;
}

export default function TaskSharingModal({ isOpen, onClose, onShare, task }: TaskSharingModalProps) {
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState<'view' | 'edit' | 'full'>('view');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !task) return null;

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter an email address');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await onShare({ email, permissions });
      setEmail('');
      setPermissions('view');
    } catch (error) {
      setError('Failed to share task');
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionIcon = (perm: 'view' | 'edit' | 'full') => {
    switch (perm) {
      case 'view': return <Eye className="w-4 h-4" />;
      case 'edit': return <Edit className="w-4 h-4" />;
      case 'full': return <Settings className="w-4 h-4" />;
    }
  };

  const getPermissionLabel = (perm: 'view' | 'edit' | 'full') => {
    switch (perm) {
      case 'view': return 'View Only';
      case 'edit': return 'Can Edit';
      case 'full': return 'Full Access';
    }
  };

  const getPermissionDescription = (perm: 'view' | 'edit' | 'full') => {
    switch (perm) {
      case 'view': return 'Can view task details and progress';
      case 'edit': return 'Can view and update task status';
      case 'full': return 'Can view, edit, and manage task completely';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Share2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Share Task</h3>
                <p className="text-sm text-gray-600">Share this task with homeowners or employees</p>
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

        {/* Task Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>{task.property}</span>
              </div>
              <div className="flex items-center space-x-1">
                {task.isShared ? (
                  <>
                    <UserCheck className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Shared with {task.sharedWith.length} people</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500">Private</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Current Sharing Status */}
        {task.isShared && task.sharedWith.length > 0 && (
          <div className="p-6 border-b border-gray-100">
            <h4 className="font-medium text-gray-900 mb-3">Currently Shared With</h4>
            <div className="space-y-2">
              {task.sharedWith.map((email, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPermissionIcon(task.sharePermissions)}
                    <span className="text-xs text-gray-500">
                      {getPermissionLabel(task.sharePermissions)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share Form */}
        <div className="p-6">
          <form onSubmit={handleShare} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address to share with"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This person will receive an email with access to view this task
              </p>
            </div>

            {/* Permissions Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Permission Level
              </label>
              <div className="space-y-3">
                {(['view', 'edit', 'full'] as const).map((perm) => (
                  <label
                    key={perm}
                    className={`flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      permissions === perm
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="permissions"
                      value={perm}
                      checked={permissions === perm}
                      onChange={(e) => setPermissions(e.target.value as 'view' | 'edit' | 'full')}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getPermissionIcon(perm)}
                        <span className="font-medium text-gray-900">
                          {getPermissionLabel(perm)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {getPermissionDescription(perm)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !email}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sharing...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share Task</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-1">Sharing Guidelines</p>
              <ul className="space-y-1">
                <li>• Homeowners can view tasks for their properties</li>
                <li>• Employees can update task status and add notes</li>
                <li>• Shared tasks will appear in their task dashboard</li>
                <li>• You can revoke access at any time</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 