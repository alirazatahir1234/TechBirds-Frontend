import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Mail, 
  TrendingUp, 
  Activity,
  Calendar,
  Eye
} from 'lucide-react';
import BackendStatus from '../../components/BackendStatus';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalCategories: 0,
    totalComments: 0,
    totalSubscribers: 0,
    recentPosts: [],
    recentComments: []
  });

  useEffect(() => {
    // Mock data for now - will be replaced with real API calls
    setStats({
      totalPosts: 42,
      totalCategories: 8,
      totalComments: 156,
      totalSubscribers: 1248,
      recentPosts: [
        { id: 1, title: 'Latest Tech Trends 2024', author: 'John Doe', date: '2024-01-15', views: 234 },
        { id: 2, title: 'AI Revolution in Healthcare', author: 'Jane Smith', date: '2024-01-14', views: 189 },
        { id: 3, title: 'Blockchain Future', author: 'Mike Johnson', date: '2024-01-13', views: 156 }
      ],
      recentComments: [
        { id: 1, author: 'Alice Brown', post: 'Latest Tech Trends 2024', content: 'Great insights!', date: '2024-01-15' },
        { id: 2, author: 'Bob Wilson', post: 'AI Revolution in Healthcare', content: 'Very informative article', date: '2024-01-14' },
        { id: 3, author: 'Carol Davis', post: 'Blockchain Future', content: 'Looking forward to more', date: '2024-01-13' }
      ]
    });
  }, []);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's what's happening with your website.
        </p>
      </div>

      {/* Backend Status */}
      <BackendStatus />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          title="Total Posts"
          value={stats.totalPosts}
          color="bg-blue-500"
        />
        <StatCard
          icon={Users}
          title="Categories"
          value={stats.totalCategories}
          color="bg-green-500"
        />
        <StatCard
          icon={MessageSquare}
          title="Comments"
          value={stats.totalComments}
          color="bg-yellow-500"
        />
        <StatCard
          icon={Mail}
          title="Subscribers"
          value={stats.totalSubscribers}
          color="bg-purple-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Posts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{post.title}</h4>
                    <p className="text-sm text-gray-500">
                      by {post.author} • {new Date(post.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="h-4 w-4 mr-1" />
                    {post.views}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Comments */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Comments</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentComments.map((comment) => (
                <div key={comment.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{comment.author}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{comment.content}</p>
                  <p className="text-xs text-gray-500">on "{comment.post}"</p>
                </div>
              ))}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              <FileText className="h-5 w-5 mr-2" />
              Create New Post
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Users className="h-5 w-5 mr-2" />
              Manage Categories
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <MessageSquare className="h-5 w-5 mr-2" />
              Moderate Comments
            </button>
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
