import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2,
  Eye,
  Camera,
  CheckCircle,
  AlertTriangle,
  X,
  Shield,
  Star,
  UserCheck
} from 'lucide-react';
import { adminAPI } from '../../../services/api';

// Enhanced Users Manager (formerly AuthorsManager)
// Now uses the new ASP.NET Core Identity system with backward compatibility
export default function EnhancedUsersManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    bio: '',
    avatar: '',
    website: '',
    twitter: '',
    linkedin: '',
    specialization: '',
    status: 'active',
    role: 'author'
  });

  // New 6-tier role system mapping
  const roleOptions = [
    { value: 'contributor', label: 'Contributor', level: 1, description: 'Basic content creation' },
    { value: 'reviewer', label: 'Reviewer', level: 2, description: 'Content review and feedback' },
    { value: 'moderator', label: 'Moderator', level: 3, description: 'Content moderation' },
    { value: 'editor', label: 'Editor', level: 4, description: 'Content editing and publishing' },
    { value: 'admin', label: 'Administrator', level: 5, description: 'System administration' },
    { value: 'superadmin', label: 'Super Admin', level: 6, description: 'Full system access' }
  ];

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    const roleLevel = roleOptions.find(r => r.value === role?.toLowerCase())?.level || 1;
    
    switch (roleLevel) {
      case 1: return 'bg-gray-100 text-gray-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-green-100 text-green-800';
      case 5: return 'bg-purple-100 text-purple-800';
      case 6: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Role icon
  const getRoleIcon = (role) => {
    const roleLevel = roleOptions.find(r => r.value === role?.toLowerCase())?.level || 1;
    
    switch (roleLevel) {
      case 1: return <Edit className="h-3 w-3" />;
      case 2: return <Eye className="h-3 w-3" />;
      case 3: return <Shield className="h-3 w-3" />;
      case 4: return <UserCheck className="h-3 w-3" />;
      case 5: return <Star className="h-3 w-3" />;
      case 6: return <CheckCircle className="h-3 w-3" />;
      default: return <Edit className="h-3 w-3" />;
    }
  };

  // Random avatar generator function
  const getRandomAvatar = () => {
    const avatars = [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the enhanced admin API that supports both new and old systems
      const response = await adminAPI.getAuthors();
      setUsers(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. The system may be transitioning between APIs.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('First name, last name, email, and password are required');
      return;
    }

    try {
      setError(null);
      
      const createData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        bio: formData.bio?.trim() || null,
        avatar: formData.avatar?.trim() || getRandomAvatar(),
        website: formData.website?.trim() || null,
        twitter: formData.twitter?.trim() || null,
        linkedin: formData.linkedin?.trim() || null,
        specialization: formData.specialization?.trim() || null,
        status: formData.status.charAt(0).toUpperCase() + formData.status.slice(1).toLowerCase(),
        role: formData.role.charAt(0).toUpperCase() + formData.role.slice(1).toLowerCase()
      };
      
      const newUser = await adminAPI.createAuthor(createData);
      
      if (newUser) {
        await fetchUsers();
        resetForm();
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data || 'Invalid data provided';
        setError(`Validation Error: ${errorMessage}`);
      } else {
        setError('Failed to create user. Please try again.');
      }
    }
  };

  const handleUpdate = async (id) => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setError('First name, last name, and email are required');
      return;
    }

    try {
      setError(null);
      
      let avatarUrl = formData.avatar?.trim() || getRandomAvatar();
      
      // If avatar looks like base64 data (very long string), use random avatar instead
      if (avatarUrl && avatarUrl.length > 500) {
        console.warn('Avatar data too long, using random avatar instead');
        avatarUrl = getRandomAvatar();
      }
      
      const updateData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        bio: formData.bio?.trim() || "",
        avatar: avatarUrl,
        website: formData.website?.trim() || "",
        twitter: formData.twitter?.trim() || "",
        linkedin: formData.linkedin?.trim() || "",
        specialization: formData.specialization?.trim() || "",
        status: formData.status.charAt(0).toUpperCase() + formData.status.slice(1),
        role: formData.role.charAt(0).toUpperCase() + formData.role.slice(1)
      };

      // Only include password if user provided one
      if (formData.password && formData.password.trim()) {
        updateData.password = formData.password.trim();
      }
      
      console.log('🔄 Updating user with enhanced data:', {
        ...updateData,
        avatar: updateData.avatar?.substring(0, 100) + (updateData.avatar?.length > 100 ? '...' : '')
      });
      
      const updatedUser = await adminAPI.updateAuthor(id, updateData);
      
      if (updatedUser) {
        await fetchUsers();
        setEditingId(null);
        resetForm();
      }
    } catch (error) {
      console.error('❌ Error updating user:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data || 'Invalid data provided';
        setError(`Validation Error: ${errorMessage}`);
      } else if (error.response?.status === 404) {
        setError('User not found. It may have been deleted.');
      } else {
        setError('Failed to update user. Please try again.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await adminAPI.deleteAuthor(id);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      bio: '',
      avatar: '',
      website: '',
      twitter: '',
      linkedin: '',
      specialization: '',
      status: 'active',
      role: 'contributor' // Default to lowest role level
    });
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '',
      bio: user.bio || '',
      avatar: user.avatar || '',
      website: user.website || '',
      twitter: user.twitter || '',
      linkedin: user.linkedin || '',
      specialization: user.specialization || '',
      status: (user.status || 'active').toLowerCase(),
      role: (user.role || 'contributor').toLowerCase()
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status?.toLowerCase() === filterStatus;
    const matchesRole = filterRole === 'all' || user.role?.toLowerCase() === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">
            Manage user accounts and permissions for your website. Now using enhanced ASP.NET Core Identity.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingId('new');
          }}
          className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search users by name, email, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="all">All Roles</option>
          {roleOptions.map(role => (
            <option key={role.value} value={role.value}>{role.label}</option>
          ))}
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role & Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const roleInfo = roleOptions.find(r => r.value === user.role?.toLowerCase()) || roleOptions[0];
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || getRandomAvatar()}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = getRandomAvatar();
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {/* Social Links */}
                          {(user.website || user.twitter || user.linkedin) && (
                            <div className="flex items-center gap-2 mt-1">
                              {user.website && (
                                <a href={user.website} target="_blank" rel="noopener noreferrer" 
                                   className="text-xs text-blue-600 hover:text-blue-800">Website</a>
                              )}
                              {user.twitter && (
                                <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer"
                                   className="text-xs text-blue-600 hover:text-blue-800">Twitter</a>
                              )}
                              {user.linkedin && (
                                <a href={`https://linkedin.com/in/${user.linkedin}`} target="_blank" rel="noopener noreferrer"
                                   className="text-xs text-blue-600 hover:text-blue-800">LinkedIn</a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status?.toLowerCase() === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {getRoleIcon(user.role)}
                          {roleInfo.label}
                        </span>
                        <span className="text-xs text-gray-500">L{roleInfo.level}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{roleInfo.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.specialization || 'General'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div>{user.postsCount || 0} posts</div>
                        <div className="text-xs">{user.totalViews || 0} views</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(user)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm || filterStatus !== 'all' || filterRole !== 'all' 
                      ? 'No users found matching your criteria.' 
                      : 'No users found. Create your first user!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Create/Edit Form Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingId === 'new' ? 'Create New User' : 'Edit User'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Using enhanced ASP.NET Core Identity system with 6-tier role hierarchy
              </p>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email * <span className="text-xs text-gray-500">(Protected - not visible in public API)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              {editingId === 'new' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role & Permission Level
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    {roleOptions.map(role => (
                      <option key={role.value} value={role.value}>
                        L{role.level}: {role.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {roleOptions.find(r => r.value === formData.role)?.description}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                  placeholder="e.g., AI, Blockchain, Web Development, Data Science"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>

              {/* Enhanced Social Links */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Social Links</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      placeholder="https://yourwebsite.com"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Twitter</label>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                      placeholder="username (without @)"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">LinkedIn</label>
                    <input
                      type="text"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                      placeholder="linkedin-profile-name"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setEditingId(null);
                  resetForm();
                  setError(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingId === 'new') {
                    handleCreate();
                  } else {
                    handleUpdate(editingId);
                  }
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {editingId === 'new' ? 'Create User' : 'Update User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
