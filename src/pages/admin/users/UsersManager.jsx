// Helper to get avatar URL (base64 or fallback)
const getAvatarUrl = (avatar) => {
  if (!avatar) return undefined;
  if (typeof avatar === 'string' && avatar.length > 100 && !avatar.startsWith('http')) {
    return `data:image/png;base64,${avatar}`;
  }
  return avatar;
};
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Filter,
  Calendar,
  Mail,
  Globe,
  User,
  Crown,
  Edit,
  Eye,
  Trash2,
  PenTool,
  FileText,
  Shield
} from 'lucide-react';
import { userAPI } from '../../../services/api';



const UsersManager = () => {
  // Handler for edit button (to be implemented: open modal or navigate to edit page)
  const navigate = useNavigate();
  const handleEditUser = (user) => {
  // Redirect to edit user page, passing user data for editing
  navigate(`/admin/users/${user.id}/edit`, { state: { user } });
  };

  // Handler for delete button
  const handleDeleteUser = async (user) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to delete user "${user.name || `${user.firstName} ${user.lastName}`}"?\n\nThis action cannot be undone.`
    );
    
    if (!isConfirmed) {
      return;
    }

    try {
      setLoading(true);
      
      // Call the DELETE API
      await userAPI.deleteUser(user.id);
      
      // Remove user from local state
      setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
      
      // Show success message
      alert('User deleted successfully!');
      
    } catch (error) {
      
      let errorMessage = 'Failed to delete user.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 403) {
        errorMessage = 'You do not have permission to delete users.';
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  // Remove currentUserRole logic
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userAPI.getUsers();
      
      // Handle the response structure from /api/Users
      if (response && Array.isArray(response)) {
        setUsers(response);
      } else if (response && response.users && Array.isArray(response.users)) {
        setUsers(response.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      setError('Failed to load users. Please try again.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'editor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'author':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'contributor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'subscriber':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'superadmin':
        return <Shield className="h-3 w-3" />;
      case 'admin':
        return <Crown className="h-3 w-3" />;
      case 'editor':
        return <Edit className="h-3 w-3" />;
      case 'author':
        return <PenTool className="h-3 w-3" />;
      case 'contributor':
        return <FileText className="h-3 w-3" />;
      case 'subscriber':
        return <Eye className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.bio?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.specialization?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || 
      user.role?.toLowerCase() === roleFilter.toLowerCase();
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md inline-block">
          <p className="font-medium">Error loading users</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              All Users
            </h1>
            <p className="text-gray-600 mt-1">
              {users.length} total users • {filteredUsers.length} shown
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search users by name, bio, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="all">All Roles</option>
            <option value="subscriber">Subscriber</option>
            <option value="contributor">Contributor</option>
            <option value="author">Author</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
            <option value="superadmin">SuperAdmin</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-600">
            {searchTerm || roleFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'No users are available at the moment'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 flex flex-col justify-between transition-all hover:shadow-xl hover:border-blue-200 group min-h-[320px]">
              {/* Avatar & Name */}
            <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
                <div className="relative">
                  {getAvatarUrl(user.avatar) ? (
                    <img
                      className="h-16 w-16 rounded-full object-cover border-4 border-blue-100 group-hover:border-blue-400 transition-all"
                      src={getAvatarUrl(user.avatar)}
                      alt={user.name || `${user.firstName} ${user.lastName}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900 truncate">
                    {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User'}
                  </h3>
                  {user.specialization && (
                    <p className="text-sm text-blue-600 font-medium mt-1">
                      {user.specialization}
                    </p>
                  )}
                  <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${getRoleColor(user.role)}`}> 
                    {getRoleIcon(user.role)}
                    {user.role || 'User'}
                  </div>
                </div>
              </div>
              {/* User Bio */}
              {user.bio && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 italic line-clamp-2">
                    {user.bio}
                  </p>
                </div>
              )}
              {/* Contact Information */}
            <div className="mt-3 space-y-1">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate font-medium">
                    {user.email ? user.email : (user.name ? user.name : 'Not exist')}
                  </span>
                </div>
                {user.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                    <a
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium truncate"
                    >
                      {user.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
              {/* Stats & Dates */}
            <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
                <div className="flex flex-col items-start">
                  <span className="text-gray-400">Posts</span>
                  <span className="font-bold text-gray-900 text-lg">{user.articleCount || 0}</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-gray-400">Total Views</span>
                  <span className="font-bold text-gray-900 text-lg">{user.totalViews || 0}</span>
                </div>
                <div className="col-span-2 mt-2 flex justify-between text-xs text-gray-500">
                  <span>Joined: {formatDate(user.joinedAt)}</span>
                  {user.lastActive && (
                    <span>Active: {formatDate(user.lastActive)}</span>
                  )}
                </div>
              </div>
              {(user.twitter || user.linkedIn) && (
                <div className="mt-4 flex gap-2">
                  {user.twitter && (
                    <a
                      href={user.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors shadow-sm"
                      title="Twitter"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                  )}
                  {user.linkedIn && (
                    <a
                      href={user.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors shadow-sm"
                      title="LinkedIn"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                </div>
              )}
              {/* Action Buttons at bottom, always visible */}
            <div className="mt-6 flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-full shadow hover:bg-red-700 text-sm font-semibold flex items-center gap-2 transition-all"
                  onClick={() => handleDeleteUser(user)}
                  title="Delete user"
                >
                  <Trash2 className="inline-block h-4 w-4" /> Delete
                </button>
                <button
                  className="px-5 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 text-base font-semibold flex items-center gap-2 transition-all"
                  onClick={() => handleEditUser(user)}
                  title="Edit user profile"
                >
                  <Edit className="inline-block h-5 w-5" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersManager;
