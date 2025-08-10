import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  Tag,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react';
import { adminAPI } from '../../../services/api';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  });

  // Fetch posts and categories from API
  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [currentPage, statusFilter, categoryFilter, searchTerm]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters - match backend API specification
      const params = {
        Page: currentPage, // Backend expects 'Page' not 'page'
        PageSize: pagination.limit, // Backend expects 'PageSize' not 'limit'
        ...(searchTerm && { Search: searchTerm }), // Backend expects 'Search'
        ...(statusFilter !== 'all' && { Status: statusFilter }), // Backend expects 'Status'
        ...(categoryFilter !== 'all' && { CategoryId: categoryFilter }) // Backend expects 'CategoryId'
      };
      
      const response = await adminAPI.getPosts(params);
      
      // Handle different response structures
      if (response.posts && Array.isArray(response.posts)) {
        // New backend structure with posts array
        setPosts(response.posts || []);
        setPagination({
          total: response.totalCount || 0,
          totalPages: response.totalPages || 0,
          currentPage: response.page || 1,
          limit: response.pageSize || 10
        });
      } else if (response.articles && response.pagination) {
        // Paginated response with articles
        setPosts(response.articles || []);
        setPagination(response.pagination);
      } else if (Array.isArray(response)) {
        // Simple array response
        setPosts(response);
        setPagination(prev => ({ ...prev, total: response.length }));
      } else if (response.data && Array.isArray(response.data)) {
        // Data wrapper with array
        setPosts(response.data);
        setPagination(prev => ({ ...prev, total: response.data.length }));
      } else {
        // Single response object or unknown structure
        setPosts(response ? [response] : []);
        setPagination(prev => ({ ...prev, total: response ? 1 : 0 }));
      }
    } catch (error) {
      console.error('❌ PostsList: Error fetching posts:', error.message);
      setError(`Failed to load posts: ${error.message}`);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await adminAPI.getCategories();
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Don't show error for categories as it's not critical
    }
  };

  const filteredPosts = posts || []; // Filtering is now done server-side, ensure posts is always an array

  const handleBulkAction = async (action) => {
    try {
      setError(null);
      
      if (action === 'delete') {
        if (!window.confirm(`Are you sure you want to delete ${selectedPosts.length} post(s)?`)) {
          return;
        }
        
        // Delete posts one by one
        for (const postId of selectedPosts) {
          await adminAPI.deletePost(postId);
        }
        
        setSelectedPosts([]);
        await fetchPosts(); // Refresh the list
      } else {
        // Handle status updates (publish, draft, etc.)
        for (const postId of selectedPosts) {
          const post = posts.find(p => p.id === postId);
          if (post) {
            await adminAPI.updatePost(postId, { ...post, status: action });
          }
        }
        
        setSelectedPosts([]);
        await fetchPosts(); // Refresh the list
      }
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      setError(`Failed to ${action} selected posts. Please try again.`);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setError(null);
      await adminAPI.deletePost(postId);
      await fetchPosts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again.');
    }
  };

  const togglePostSelection = (postId) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Handle page changes
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Handle search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchPosts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-600">Manage your blog posts and articles</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={fetchPosts}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled={loading}
          >
            {loading ? '🔄' : '🔄'} Refresh
          </button>
          <Link
            to="/admin/posts/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Post
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug Info - Temporary */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2">🔍 Debug Info</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <p><strong>Posts Count:</strong> {filteredPosts.length}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
          <p><strong>Status Filter:</strong> {statusFilter}</p>
          <p><strong>Category Filter:</strong> {categoryFilter}</p>
          <p><strong>Search Term:</strong> "{searchTerm}"</p>
          {filteredPosts.length > 0 && (
            <>
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="font-medium text-yellow-800">🔍 User Info Analysis (New Identity System):</p>
                {filteredPosts.slice(0, 3).map((post, idx) => (
                  <div key={idx} className="mt-1 text-xs">
                    <strong>Post {idx + 1}:</strong> UserID: {post.userId || post.authorId || 'N/A'}, 
                    UserName: "{post.user?.firstName || post.author?.name || post.authorName || 'Unknown'}"
                  </div>
                ))}
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer font-medium text-blue-800">📋 View Full Posts Data ({filteredPosts.length} posts)</summary>
                <pre className="mt-2 bg-white p-2 rounded border text-xs overflow-auto max-h-40">
                  {JSON.stringify(filteredPosts.slice(0, 3), null, 2)}
                </pre>
              </details>
            </>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">
              {selectedPosts.length} post(s) selected
            </span>
            <button
              onClick={() => handleBulkAction('publish')}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Publish
            </button>
            <button
              onClick={() => handleBulkAction('draft')}
              className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
            >
              Move to Draft
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Posts Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedPosts.length === filteredPosts.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPosts(filteredPosts.map(post => post.id));
                    } else {
                      setSelectedPosts([]);
                    }
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stats
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPosts.filter(post => post && post.id).map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={() => togglePostSelection(post.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {post.title}
                        {post.featured && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {post.summary || post.excerpt || (post.content?.substring(0, 100) + '...') || 'No summary available'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {post.author?.name || post.authorName || 'Unknown Author'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Tag className="mr-1 h-3 w-3" />
                    {post.category?.name || post.categoryName || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    post.status === 'published' 
                      ? 'bg-green-100 text-green-800' 
                      : post.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status ? (post.status.charAt(0).toUpperCase() + post.status.slice(1)) : 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {formatDate(post.publishedAt || post.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Eye className="mr-1 h-3 w-3" />
                      {post.viewCount || post.views || 0}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">💬</span>
                      {post.commentsCount || post.comments || 0}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/admin/posts/${post.id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit post"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <Link
                      to={`/post/${post.slug || post.id}`}
                      target="_blank"
                      className="text-green-600 hover:text-green-900"
                      title="View post"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete post"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new post.
              </p>
              <div className="mt-6">
                <Link
                  to="/admin/posts/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Post
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredPosts.length > 0 && pagination.totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow">
          <div className="flex-1 flex justify-between sm:hidden">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= pagination.totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{((currentPage - 1) * pagination.limit) + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * pagination.limit, pagination.total)}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === pageNum
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsList;
