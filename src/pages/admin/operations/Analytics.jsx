import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw
} from 'lucide-react';

export default function Analytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days');
  const [analytics, setAnalytics] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalytics({
        overview: {
          totalPageviews: 45672,
          uniqueVisitors: 12840,
          totalArticles: 156,
          totalComments: 2340,
          bounceRate: 34.5,
          avgSessionDuration: '3m 42s'
        },
        trends: {
          pageviews: { value: 45672, change: 12.5, trend: 'up' },
          visitors: { value: 12840, change: -2.3, trend: 'down' },
          articles: { value: 156, change: 8.7, trend: 'up' },
          comments: { value: 2340, change: 15.2, trend: 'up' }
        },
        topArticles: [
          { id: 1, title: 'The Future of AI in 2024', views: 3420, comments: 45 },
          { id: 2, title: 'React vs Vue: Complete Guide', views: 2890, comments: 32 },
          { id: 3, title: 'Understanding Machine Learning', views: 2654, comments: 28 },
          { id: 4, title: 'CSS Grid vs Flexbox', views: 2340, comments: 19 },
          { id: 5, title: 'JavaScript ES2024 Features', views: 2156, comments: 24 }
        ],
        deviceStats: {
          desktop: 45.2,
          mobile: 38.7,
          tablet: 16.1
        },
        trafficSources: {
          organic: 42.3,
          direct: 28.9,
          social: 18.4,
          referral: 10.4
        },
        recentActivity: [
          { type: 'article', action: 'published', title: 'New AI Trends Article', time: '2 hours ago' },
          { type: 'comment', action: 'approved', title: 'Comment on React Guide', time: '3 hours ago' },
          { type: 'user', action: 'registered', title: 'New user signup', time: '4 hours ago' },
          { type: 'article', action: 'updated', title: 'Updated Vue.js Tutorial', time: '6 hours ago' }
        ]
      });
      setIsLoading(false);
    }, 1500);
  }, [dateRange]);

  const refreshData = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">
            Track your website performance and user engagement.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pageviews</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalPageviews.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+{analytics.trends.pageviews.change}%</span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.uniqueVisitors.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-sm text-red-600 font-medium">{analytics.trends.visitors.change}%</span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalArticles}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+{analytics.trends.articles.change}%</span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Comments</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalComments.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600 font-medium">+{analytics.trends.comments.change}%</span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Articles */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Articles</h3>
          <div className="space-y-4">
            {analytics.topArticles.map((article, index) => (
              <div key={article.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded text-xs font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{article.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {article.views.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {article.comments}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Usage</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Desktop</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${analytics.deviceStats.desktop}%` }}></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{analytics.deviceStats.desktop}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900">Mobile</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: `${analytics.deviceStats.mobile}%` }}></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{analytics.deviceStats.mobile}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tablet className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">Tablet</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${analytics.deviceStats.tablet}%` }}></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{analytics.deviceStats.tablet}%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Organic Search</span>
              </div>
              <span className="text-sm text-gray-600">{analytics.trafficSources.organic}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Direct</span>
              </div>
              <span className="text-sm text-gray-600">{analytics.trafficSources.direct}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Social Media</span>
              </div>
              <span className="text-sm text-gray-600">{analytics.trafficSources.social}%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Referral</span>
              </div>
              <span className="text-sm text-gray-600">{analytics.trafficSources.referral}%</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'article' ? 'bg-blue-500' :
                  activity.type === 'comment' ? 'bg-green-500' :
                  activity.type === 'user' ? 'bg-purple-500' : 'bg-gray-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.action}</span> - {activity.title}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Summary Stats */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{analytics.overview.bounceRate}%</p>
            <p className="text-sm text-gray-600">Bounce Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{analytics.overview.avgSessionDuration}</p>
            <p className="text-sm text-gray-600">Avg. Session Duration</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{(analytics.overview.totalPageviews / analytics.overview.uniqueVisitors).toFixed(1)}</p>
            <p className="text-sm text-gray-600">Pages per Session</p>
          </div>
        </div>
      </div>
    </div>
  );
}
