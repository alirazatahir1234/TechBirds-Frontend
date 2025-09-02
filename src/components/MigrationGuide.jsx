import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  RefreshCw,
  Database
} from 'lucide-react';

// Migration Guide Component - Shows how to use the new User API
export default function MigrationGuide() {
  const [migrationStatus, setMigrationStatus] = useState('pending');
  const [oldSystemData, setOldSystemData] = useState(null);
  const [newSystemData, setNewSystemData] = useState(null);

  const migrationSteps = [
    {
      id: 1,
      title: 'API Endpoints Migration',
      description: 'Replace /api/authors/* endpoints with /api/users/*',
      oldCode: 'GET /api/authors',
      newCode: 'GET /api/users',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Data Model Updates',
      description: 'Articles now reference userId instead of authorId',
      oldCode: '{ authorId: "123", author: {...} }',
      newCode: '{ userId: "123", user: {...} }',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Enhanced User Fields',
      description: 'New user fields: FirstName, LastName, social links, specialization',
      oldCode: '{ name: "John Doe" }',
      newCode: '{ firstName: "John", lastName: "Doe", website: "...", twitter: "..." }',
      status: 'completed'
    },
    {
      id: 4,
      title: 'Role System Upgrade',
      description: 'Migrate from 3-tier to 6-tier role hierarchy',
      oldCode: 'author | editor | admin',
      newCode: 'Contributor | Reviewer | Moderator | Editor | Administrator | SuperAdmin',
      status: 'completed'
    },
    {
      id: 5,
      title: 'Security Enhancements',
      description: 'Separate public/private DTOs, email protection',
      oldCode: 'PublicUserDTO { email: "user@example.com" }',
      newCode: 'PublicUserDTO { /* email hidden */ }',
      status: 'completed'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Database className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Frontend Integration Guide</h1>
        <p className="mt-4 text-xl text-gray-600">
          Migration from Authors API to ASP.NET Core Identity User System
        </p>
      </div>

      {/* Breaking Changes Alert */}
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Breaking Changes Summary</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Complete removal of Authors API (/api/authors/*)</li>
                <li>Migration to unified ASP.NET Core Identity system</li>
                <li>New 6-tier role hierarchy</li>
                <li>Enhanced user profiles with social links</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Migration Progress */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            Migration Status: Complete
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {migrationSteps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{step.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{step.description}</p>
                  
                  {/* Code Example */}
                  <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-red-600 uppercase tracking-wide">Before (Old)</label>
                      <div className="mt-1 bg-red-50 border border-red-200 rounded p-3">
                        <code className="text-sm text-red-800">{step.oldCode}</code>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-green-600 uppercase tracking-wide">After (New)</label>
                      <div className="mt-1 bg-green-50 border border-green-200 rounded p-3">
                        <code className="text-sm text-green-800">{step.newCode}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API Usage Examples */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">New API Usage Examples</h2>
        </div>
        <div className="p-6 space-y-6">
          
          {/* Users API */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Users API</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Get All Users</label>
                <div className="mt-1 bg-white border rounded p-3">
                  <code className="text-sm text-gray-800">
                    {`import { userAPI } from '../services/api';

// Get all users (public data only)
const users = await userAPI.getUsers({
  page: 1,
  pageSize: 10,
  role: 'Contributor',
  status: 'active'
});`}
                  </code>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Create User</label>
                <div className="mt-1 bg-white border rounded p-3">
                  <code className="text-sm text-gray-800">
                    {`// Create new user with enhanced fields
const newUser = await userAPI.createUser({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'SecurePass123!',
  bio: 'Tech journalist...',
  website: 'https://johndoe.com',
  twitter: '@johndoe',
  linkedin: 'johndoe',
  specialization: 'AI & Machine Learning',
  role: 'Contributor'
});`}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Role-Based Access Control */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Role-Based Access Control</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Permission Checking</label>
              <div className="mt-1 bg-white border rounded p-3">
                <code className="text-sm text-gray-800">
                  {`import { hasMinimumRole, UserRole } from '../types/userTypes';

// Check if user can edit content
const canEdit = hasMinimumRole(user.role, UserRole.Editor);

// Role hierarchy (1-6):
// 1. Contributor - Basic content creation
// 2. Reviewer - Content review and feedback  
// 3. Moderator - Content moderation
// 4. Editor - Content editing and publishing
// 5. Administrator - System administration
// 6. SuperAdmin - Full system access`}
                </code>
              </div>
            </div>
          </div>

          {/* Article Updates */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Article Management</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Articles with User Data</label>
              <div className="mt-1 bg-white border rounded p-3">
                <code className="text-sm text-gray-800">
                  {`// Articles now reference userId instead of authorId
const article = await enhancedArticlesAPI.getArticleById(123);
// Response: { 
//   id: "123", 
//   title: "...", 
//   userId: "user-456", 
//   user: { firstName: "John", lastName: "Doe", /* no email */ }
// }`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Checklist */}
      <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Implementation Checklist</h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[
              'Update all API calls from /api/authors to /api/users',
              'Replace authorId references with userId in articles/posts',
              'Implement new user profile fields (firstName, lastName, social links)',
              'Add role-based access control using 6-tier system',
              'Update component displays to show user data instead of author data',
              'Enhance error handling for better user experience',
              'Test email privacy (emails should not appear in public endpoints)',
              'Verify role permissions work correctly',
              'Update search and filtering to use new user fields',
              'Test backward compatibility where needed'
            ].map((task, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Migration Complete</h3>
            <p className="mt-2 text-sm text-blue-700">
              Your TechBirds frontend has been successfully updated to use the new ASP.NET Core Identity system. 
              All API endpoints have been migrated and backward compatibility has been maintained where possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example Component showing the new API usage
export const UserManagementExample = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Using the new users API
      const response = await userAPI.getUsers({
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      setUsers(response.users || response);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">User Management (New API)</h2>
      
      {loading ? (
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading users...</span>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map(user => (
            <div key={user.id} className="p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                  <div className="text-sm text-gray-500">
                    {user.specialization || 'General'} • {user.postsCount} posts
                  </div>
                  {/* Note: Email is not shown in public API */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
