import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Globe, 
  Twitter, 
  Linkedin,
  Eye,
  EyeOff,
  Upload,
  X
} from 'lucide-react';
import { userAPI } from '../../../services/api';

export default function UserForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const editUser = location.state?.user;

  const [formData, setFormData] = useState({
    firstName: editUser?.firstName || '',
    lastName: editUser?.lastName || '',
    email: editUser?.email || '',
    password: '',
    confirmPassword: '',
    bio: editUser?.bio || '',
    specialization: editUser?.specialization || '',
    role: editUser?.role || 'User',
    status: editUser?.isActive ? 'Active' : 'Inactive',
    website: editUser?.website || '',
    twitter: editUser?.twitter || '',
    linkedin: editUser?.linkedin || '',
    avatar: editUser?.avatar || null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(editUser?.avatar ? (typeof editUser.avatar === 'string' ? `data:image/png;base64,${editUser.avatar}` : null) : null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to convert file to base64
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: null }));
    setAvatarPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Only validate password if creating or changing password
    if (!editUser || formData.password) {
      const password = formData.password;
      const passwordErrors = [];
      if (password !== formData.confirmPassword) {
        passwordErrors.push('Passwords do not match!');
      }
      if (!/[A-Z]/.test(password)) {
        passwordErrors.push('Password must have at least one uppercase letter.');
      }
      if (!/[a-z]/.test(password)) {
        passwordErrors.push('Password must have at least one lowercase letter.');
      }
      if (!/[0-9]/.test(password)) {
        passwordErrors.push('Password must have at least one digit.');
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        passwordErrors.push('Password must have at least one special character.');
      }
      if (password.length < 8) {
        passwordErrors.push('Password must be at least 8 characters long.');
      }
      if (passwordErrors.length > 0) {
        alert(passwordErrors.join('\n'));
        return;
      }
    }

    setIsLoading(true);
    try {
      let avatarBase64 = null;
      if (formData.avatar && typeof formData.avatar !== 'string') {
        avatarBase64 = await toBase64(formData.avatar);
      } else if (typeof formData.avatar === 'string') {
        avatarBase64 = formData.avatar;
      }

      // Transform the data to match backend expectations
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password || undefined,
        bio: formData.bio || null,
        specialization: formData.specialization || null,
        role: formData.role,
        isActive: formData.status?.toLowerCase() === 'active',
        website: formData.website || null,
        twitter: formData.twitter || null,
        linkedin: formData.linkedin || null,
        avatar: avatarBase64
      };
      if (editUser) {
        // Update user
        await userAPI.updateUser(editUser.id, userData);
        toast.success('User updated successfully!');
      } else {
        // Create user
        await userAPI.createUser(userData);
        toast.success('User created successfully!');
      }
      setTimeout(() => {
        navigate('/admin/users');
      }, 1500);
    } catch (error) {
      if (error.response) {
        alert(`Failed to save user: ${JSON.stringify(error.response.data)}`);
      } else {
        alert(`Failed to save user: ${error.message}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link
            to="/admin/users"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{editUser ? 'Edit User' : 'Add New User'}</h1>
        <p className="text-gray-600">{editUser ? 'Update user details and save changes.' : 'Create a new user account for your team.'}</p>
      </div>
      {/* Form */}
      <div className="bg-white rounded-lg shadow">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Upload */}
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
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
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
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
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
          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editUser}
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!editUser}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          {/* Role and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="User">User</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
                <option value="Contributor">Contributor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleInputChange}
              placeholder="e.g., Artificial Intelligence, Blockchain, Mobile Development"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              placeholder="Tell us about this user..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Social Links</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="linkedin.com/in/username"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Link
              to="/admin/users"
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  {editUser ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {editUser ? 'Save Changes' : 'Create User'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
