import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';

export default function UserRoles() {
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRoles([
        {
          id: 1,
          name: 'Super Admin',
          description: 'Full access to all system features and settings',
          userCount: 2,
          permissions: ['read', 'write', 'delete', 'admin'],
          color: 'red',
          createdAt: '2024-01-15',
          status: 'active'
        },
        {
          id: 2,
          name: 'Editor',
          description: 'Can create, edit, and publish articles',
          userCount: 5,
          permissions: ['read', 'write', 'publish'],
          color: 'blue',
          createdAt: '2024-01-15',
          status: 'active'
        },
        {
          id: 3,
          name: 'User',
          description: 'Can create and edit their own articles',
          userCount: 12,
          permissions: ['read', 'write'],
          color: 'green',
          createdAt: '2024-01-15',
          status: 'active'
        },
        {
          id: 4,
          name: 'Contributor',
          description: 'Can submit articles for review',
          userCount: 8,
          permissions: ['read', 'submit'],
          color: 'yellow',
          createdAt: '2024-01-15',
          status: 'active'
        },
        {
          id: 5,
          name: 'Reviewer',
          description: 'Can review and approve submitted content',
          userCount: 3,
          permissions: ['read', 'review', 'approve'],
          color: 'purple',
          createdAt: '2024-01-15',
          status: 'inactive'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || role.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getPermissionBadgeColor = (permission) => {
    const colors = {
      'read': 'bg-gray-100 text-gray-800',
      'write': 'bg-blue-100 text-blue-800',
      'delete': 'bg-red-100 text-red-800',
      'admin': 'bg-purple-100 text-purple-800',
      'publish': 'bg-green-100 text-green-800',
      'submit': 'bg-yellow-100 text-yellow-800',
      'review': 'bg-indigo-100 text-indigo-800',
      'approve': 'bg-emerald-100 text-emerald-800'
    };
    return colors[permission] || 'bg-gray-100 text-gray-800';
  };

  const getRoleColor = (color) => {
    const colors = {
      'red': 'bg-red-500',
      'blue': 'bg-blue-500',
      'green': 'bg-green-500',
      'yellow': 'bg-yellow-500',
      'purple': 'bg-purple-500'
    };
    return colors[color] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Roles</h1>
          <p className="mt-2 text-gray-600">
            Manage user roles and permissions for your team members.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Role
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getRoleColor(role.color)}`}></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="h-3 w-3" />
                      {role.userCount} users
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">{role.description}</p>

              {/* Status */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  role.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {role.status}
                </span>
                <span className="text-xs text-gray-500">
                  Created {new Date(role.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Permissions */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions</h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map((permission) => (
                    <span
                      key={permission}
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getPermissionBadgeColor(permission)}`}
                    >
                      {permission}
                    </span>
                  ))}
                  {role.permissions.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      +{role.permissions.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                  <Edit3 className="h-3 w-3" />
                  Edit
                </button>
                <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRoles.length === 0 && (
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by creating your first role.'
            }
          </p>
          {(!searchQuery && filterStatus === 'all') && (
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create Role
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Role Modal - Placeholder */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Role</h3>
            <p className="text-gray-600 mb-4">
              Role creation functionality will be implemented here.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
