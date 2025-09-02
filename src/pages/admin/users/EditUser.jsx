import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft, Save, User, Mail, Globe, Twitter, Linkedin, Eye, EyeOff, X } from 'lucide-react';
import axios from 'axios';
import api from '../../../services/api';

export default function EditUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state?.user;

  // Add validation to ensure user data exists
  useEffect(() => {
    if (!user || !user.id) {
      toast.error('No user data provided. Redirecting to users list.');
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    name: user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    bio: user?.bio || '',
    avatar: user?.avatar || '',
    website: user?.website || '',
    twitter: user?.twitter || '',
    linkedIn: user?.linkedIn || user?.linkedin || '', // Handle both possible field names
    specialization: user?.specialization || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'User',
    isActive: user?.isActive ?? true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar ? (typeof user.avatar === 'string' ? `data:image/png;base64,${user.avatar}` : null) : null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: '' }));
    setAvatarPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      alert('User data is missing. Please go back and try again.');
      return;
    }
    
    setIsLoading(true);
    try {
      let avatarBase64 = '';
      if (formData.avatar && typeof formData.avatar !== 'string') {
        avatarBase64 = await toBase64(formData.avatar);
      } else if (typeof formData.avatar === 'string') {
        avatarBase64 = formData.avatar;
      }
      
      // Prepare payload according to your backend requirements
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        name: formData.name || `${formData.firstName} ${formData.lastName}`.trim(),
        bio: formData.bio || null,
        avatar: avatarBase64 || '',
        website: formData.website || null,
        twitter: formData.twitter || null,
        linkedIn: formData.linkedIn || null,
        specialization: formData.specialization || null,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive
      };
      
      // Only include password if provided
      if (formData.password && formData.password.trim() !== '') {
        payload.password = formData.password;
      }
      
      // Check for authentication token
      let token = localStorage.getItem('token') || 
                  localStorage.getItem('admin_token') || 
                  localStorage.getItem('authToken');
      
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        navigate('/admin/login');
        return;
      }

      // Try multiple endpoints in case the backend API structure varies
      const endpoints = [
        `/users/${user.id}/profile`,
        `/users/${user.id}`,
        `/admin/users/${user.id}`
      ];
      
      let lastError = null;
      let success = false;
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.put(endpoint, payload, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });

          // If we get here, the request was successful
          alert('User updated successfully!');
          navigate('/admin/users');
          success = true;
          break;

        } catch (error) {
          lastError = error;
          
          // If it's a 405 Method Not Allowed, try the next endpoint
          if (error.response?.status === 405) {
            continue;
          }
          
          // For other errors (like 401, 403, 400), don't continue trying
          break;
        }
      }
      
      if (!success) {
        if (lastError?.response?.data) {
          setErrors(lastError.response.data);
          alert(`Failed to update user: ${JSON.stringify(lastError.response.data)}`);
        } else if (lastError?.response?.status) {
          alert(`Failed to update user: HTTP ${lastError.response.status}: ${lastError.response.statusText}`);
        } else if (lastError?.message) {
          alert(`Failed to update user: ${lastError.message}`);
        } else {
          alert('Failed to update user: Unknown error');
        }
      }

    } catch (error) {
      if (error.response?.data) {
        setErrors(error.response.data);
        alert(`Error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert(`Network error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster position="top-right" />
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/users')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
        <p className="text-gray-600">Update user details and save changes.</p>
      </div>
      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              {avatarPreview ? (
                <div className="relative">
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <label className="block">
                <span className="sr-only">Choose avatar</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="User">User</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
                <option value="Author">Author</option>
                <option value="Contributor">Contributor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm">Active</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              placeholder="e.g., Artificial Intelligence, Blockchain, Mobile Development"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              placeholder="Tell us about this user..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="@username"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="linkedIn"
                    value={formData.linkedIn}
                    onChange={handleInputChange}
                    placeholder="linkedin.com/in/username"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
