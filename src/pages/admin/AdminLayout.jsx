import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  FolderOpen, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown,
  Bell,
  Search,
  User,
  PlusCircle,
  Home,
  List,
  Mail,
  Tag,
  Edit3,
  UserPlus,
  BookOpen,
  Activity,
  Cog
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { postsAPI, userAPI, categoryAPI } from '../../services/api';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminUser, logout, loading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [stats, setStats] = useState([
    { name: 'Total Articles', value: '0', change: '0%', changeType: 'neutral' },
    { name: 'Total Users', value: '0', change: '0%', changeType: 'neutral' },
    { name: 'Categories', value: '0', change: '0%', changeType: 'neutral' },
    { name: 'Total Views', value: '0', change: '0%', changeType: 'neutral' }
  ]);

  // Fetch real stats for dashboard
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postsRes, usersRes, categoriesRes] = await Promise.allSettled([
          postsAPI.getPosts({ page: 1, pageSize: 1 }), // Get minimal data for count
          userAPI.getUsers({ page: 1, limit: 1 }),  // Get minimal data for count
          categoryAPI.getCategories()    // No parameters needed
        ]);

        const postsData = postsRes.status === 'fulfilled' ? postsRes.value : [];
        const usersData = usersRes.status === 'fulfilled' ? usersRes.value : [];

        setStats([
          { 
            name: 'Total Articles', 
            value: (postsData.pagination?.total || postsData.posts?.length || 0).toLocaleString(), 
            change: '+0%', 
            changeType: 'neutral' 
          },
          { 
            name: 'Total Users', 
            value: (Array.isArray(usersData) ? usersData.length : usersData.total || 0).toLocaleString(), 
            change: '+0%', 
            changeType: 'neutral' 
          },
          { 
            name: 'Categories', 
            value: (Array.isArray(categoriesData) ? categoriesData.length : categoriesData.total || 0).toLocaleString(), 
            change: '+0%', 
            changeType: 'neutral' 
          },
          { 
            name: 'Total Views', 
            value: '0', // This will be updated when view tracking is implemented
            change: '+0%', 
            changeType: 'neutral' 
          }
        ]);
      } catch (error) {
        console.warn('Could not fetch stats:', error);
        // Keep default values on error
      }
    };

    fetchStats();
  }, []);

  // Check authentication on component mount and when adminUser changes
  useEffect(() => {
    if (!loading && !adminUser) {
      navigate('/admin/login');
    }
  }, [adminUser, loading, navigate]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render admin layout if user is not authenticated
  if (!adminUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      current: location.pathname === '/admin/dashboard'
    },
    {
      name: 'Content',
      icon: BookOpen,
      children: [
        { name: 'All Posts', href: '/admin/posts', icon: List },
        { name: 'Add New Post', href: '/admin/posts/create', icon: PlusCircle },
        { name: 'Pages', href: '/admin/pages', icon: FileText },
        { name: 'Add New Page', href: '/admin/pages/create', icon: PlusCircle },
        { name: 'Tags', href: '/admin/tags', icon: Tag }
      ]
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: FolderOpen,
      current: location.pathname === '/admin/categories'
    },
    {
      name: 'Users',
      icon: Users,
      children: [
        { name: 'All Users', href: '/admin/users', icon: Users },
        { name: 'Add New User', href: '/admin/users/create', icon: UserPlus },
        { name: 'User Roles', href: '/admin/users/roles', icon: Settings }
      ]
    },
    {
      name: 'Comments',
      icon: MessageSquare,
      children: [
        { name: 'All Comments', href: '/admin/comments', icon: MessageSquare },
        { name: 'Pending Approval', href: '/admin/comments/pending', icon: Bell },
        { name: 'Spam Comments', href: '/admin/comments/spam', icon: X }
      ]
    },
    {
      name: 'Operations',
      icon: Activity,
      children: [
        { name: 'Newsletter', href: '/admin/newsletter', icon: Mail },
        { name: 'Analytics', href: '/admin/analytics', icon: Activity },
        { name: 'Media Library', href: '/admin/media', icon: FolderOpen },
        { name: 'System Health', href: '/admin/health', icon: Cog }
      ]
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname.startsWith('/admin/settings')
    }
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 flex z-40 md:hidden`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <SidebarContent navigation={navigation} />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <SidebarContent navigation={navigation} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    className="block w-full h-full pl-10 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent"
                    placeholder="Search articles, users, comments..."
                    type="search"
                  />
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="ml-3 text-gray-700 text-sm font-medium">{adminUser?.firstName}</span>
                    <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                  </button>
                </div>
                {dropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        to="/"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Home className="mr-3 h-4 w-4" />
                        View Website
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {location.pathname === '/admin/dashboard' ? (
            <DashboardContent stats={stats} />
          ) : (
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <Outlet />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Sidebar Content Component
const SidebarContent = ({ navigation }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});

  // Auto-expand items that contain the current route
  useEffect(() => {
    const newExpandedItems = {};
    navigation.forEach(item => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => 
          location.pathname.startsWith(child.href)
        );
        if (hasActiveChild) {
          newExpandedItems[item.name] = true;
        }
      }
    });
    setExpandedItems(prev => ({ ...prev, ...newExpandedItems }));
  }, [location.pathname, navigation]);

  const toggleExpanded = (name) => {
    setExpandedItems(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const isChildActive = (childHref) => {
    return location.pathname === childHref || location.pathname.startsWith(childHref + '/');
  };

  return (
    <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">TB</span>
            </div>
            <span className="ml-2 text-xl font-bold text-gray-900">TechBirds</span>
          </div>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      item.children.some(child => isChildActive(child.href))
                        ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${
                      item.children.some(child => isChildActive(child.href))
                        ? 'text-green-500'
                        : 'text-gray-400'
                    }`} />
                    {item.name}
                    <ChevronDown className={`ml-auto h-4 w-4 transform transition-transform ${
                      expandedItems[item.name] ? 'rotate-180' : ''
                    }`} />
                  </button>
                  {expandedItems[item.name] && (
                    <div className="ml-8 space-y-1 mt-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                            isChildActive(child.href)
                              ? 'bg-green-100 text-green-700 border-l-2 border-green-500'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <child.icon className={`mr-3 h-4 w-4 ${
                            isChildActive(child.href) ? 'text-green-500' : 'text-gray-400'
                          }`} />
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    item.current
                      ? 'bg-green-100 text-green-700 border-l-4 border-green-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${
                    item.current ? 'text-green-500' : 'text-gray-400'
                  }`} />
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = ({ stats }) => {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Page header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              to="/admin/posts/create"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Article
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item, index) => {
              const icons = [BookOpen, Users, MessageSquare, Mail];
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
              const IconComponent = icons[index];
              const colorClass = colors[index];
              
              return (
                <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 ${colorClass} rounded-md flex items-center justify-center`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">{item.value}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <span className={`font-medium ${item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change}
                      </span>
                      <span className="text-gray-500"> from last month</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
              <div className="mt-5">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {[
                      { type: 'article', content: 'New article "AI Revolution in Tech" published', time: '2h ago', icon: BookOpen, color: 'bg-blue-400' },
                      { type: 'user', content: 'New user "Jane Smith" added to the team', time: '4h ago', icon: UserPlus, color: 'bg-green-400' },
                      { type: 'comment', content: '3 new comments pending moderation', time: '6h ago', icon: MessageSquare, color: 'bg-yellow-400' },
                      { type: 'operation', content: 'Newsletter sent to 12,840 subscribers', time: '1d ago', icon: Mail, color: 'bg-purple-400' }
                    ].map((item, index) => (
                      <li key={index}>
                        <div className="relative pb-8">
                          {index !== 3 && (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full ${item.color} flex items-center justify-center ring-8 ring-white`}>
                                <item.icon className="h-4 w-4 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className="text-sm text-gray-500">{item.content}</p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <time>{item.time}</time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
