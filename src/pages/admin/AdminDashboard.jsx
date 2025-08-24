import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Mail, 
  TrendingUp, 
  Activity,
  Calendar,
  Eye,
  Settings,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { postsAPI, userAPI, categoryAPI, adminAPI, statsAPI } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalViews: 0,
    recentArticles: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch data from multiple endpoints
      const [postsResponse, usersResponse, categoriesResponse] = await Promise.allSettled([
        postsAPI.getPosts({ page: 1, pageSize: 1 }),
        userAPI.getUsers({ page: 1, limit: 1 }),
        categoryAPI.getCategories()
      ]);

      // Debug response structure
      console.log('🔍 API Responses:', { postsResponse, usersResponse, categoriesResponse });

      // Process responses
      const postsData = postsResponse.status === 'fulfilled' ? postsResponse.value : [];
      const usersData = usersResponse.status === 'fulfilled' ? usersResponse.value : [];
      const categoriesData = categoriesResponse.status === 'fulfilled' ? categoriesResponse.value : [];

      // Try to get site stats if available
      let siteStats = { totalViews: 0 };
      try {
        siteStats = await statsAPI.getSiteStats();
      } catch (statsError) {
        console.warn('Site stats not available:', statsError.message);
      }

      // Update state with real data
      setStats({
        totalArticles: postsData.pagination?.total || postsData.posts?.length || 0,
        totalUsers: Array.isArray(usersData) ? usersData.length : usersData.total || 0,
        totalCategories: Array.isArray(categoriesData) ? categoriesData.length : categoriesData.total || 0,
        totalViews: siteStats.totalViews || 0,
        recentArticles: postsData.posts?.slice(0, 5) || [],
        recentActivity: [] // Will be populated when we have activity tracking
      });

      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please check if your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color, trend, isLoading = false }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
            )}
            {trend && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                trend.type === 'up' ? 'bg-green-100 text-green-800' : 
                trend.type === 'down' ? 'bg-red-100 text-red-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {trend.type === 'up' && <TrendingUp className="h-3 w-3 inline mr-1" />}
                {trend.value}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">
            Welcome back! Here's what's happening with your website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
              <div className="mt-2">
                <button
                  onClick={fetchDashboardData}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          title="Total Posts"
          value={stats.totalArticles}
          color="bg-blue-500"
          isLoading={loading}
        />
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.totalUsers}
          color="bg-green-500"
          isLoading={loading}
        />
        <StatCard
          icon={Activity}
          title="Categories"
          value={stats.totalCategories}
          color="bg-purple-500"
          isLoading={loading}
        />
        <StatCard
          icon={Eye}
          title="Total Views"
          value={stats.totalViews}
          color="bg-orange-500"
          isLoading={loading}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Articles</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : stats.recentArticles.length > 0 ? (
              <div className="space-y-4">
                {stats.recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                        {article.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        by {article.user?.firstName} {article.user?.lastName} • {' '}
                        {new Date(article.createdAt || article.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      {article.views || 0}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No articles found</p>
                <p className="text-sm text-gray-400">Create your first article to get started</p>
              </div>
            )}
          </div>
        </div>

        {/* System Information */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">System Information</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Backend Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Version</span>
                <span className="text-sm text-gray-900">v1.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-sm text-gray-900">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <a 
              href="/admin/posts/create"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              <FileText className="h-5 w-5 mr-2" />
              Create New Article
            </a>
            <a 
              href="/admin/users/create"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              Add New User
            </a>
            <a 
              href="/admin/categories"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Activity className="h-5 w-5 mr-2" />
              Manage Categories
            </a>
          </div>
        </div>
      </div>

      {/* Activity Chart Placeholder */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Website Activity</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Activity chart will be implemented with real data</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
