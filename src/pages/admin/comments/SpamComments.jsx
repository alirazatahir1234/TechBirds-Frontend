import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  Trash2, 
  Eye, 
  RotateCcw,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  MessageSquare,
  User,
  Calendar,
  MoreHorizontal
} from 'lucide-react';

export default function SpamComments() {
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterReason, setFilterReason] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComments, setSelectedComments] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setComments([
        {
          id: 1,
          content: "🔥🔥🔥 AMAZING DEALS! Click here for FREE MONEY!!! 💰💰💰 www.suspicious-site.com/free-money",
          author: {
            name: "SpamBot123",
            email: "spam@malicious.com",
            avatar: null,
            isRegistered: false
          },
          article: {
            id: 1,
            title: "The Future of Artificial Intelligence in 2024",
            slug: "future-ai-2024"
          },
          submittedAt: "2024-08-04T10:30:00Z",
          detectedAt: "2024-08-04T10:31:00Z",
          spamReason: "Suspicious links",
          confidence: 95,
          ipAddress: "192.168.1.100",
          detectionMethod: "Automated",
          likes: 0
        },
        {
          id: 2,
          content: "Buy cheap medications online! No prescription needed! Visit our website now for huge discounts!",
          author: {
            name: "PharmaBoy",
            email: "pharma@spam.com",
            avatar: null,
            isRegistered: false
          },
          article: {
            id: 2,
            title: "Top 10 Programming Languages to Learn",
            slug: "top-programming-languages"
          },
          submittedAt: "2024-08-04T09:15:00Z",
          detectedAt: "2024-08-04T09:20:00Z",
          spamReason: "Pharmaceutical spam",
          confidence: 88,
          ipAddress: "192.168.1.101",
          detectionMethod: "User report",
          likes: 0
        },
        {
          id: 3,
          content: "This comment has been duplicated multiple times across different articles with the same content.",
          author: {
            name: "DuplicateUser",
            email: "duplicate@example.com",
            avatar: null,
            isRegistered: false
          },
          article: {
            id: 3,
            title: "React vs Vue: A Developer's Perspective",
            slug: "react-vs-vue"
          },
          submittedAt: "2024-08-04T08:45:00Z",
          detectedAt: "2024-08-04T08:50:00Z",
          spamReason: "Duplicate content",
          confidence: 92,
          ipAddress: "192.168.1.102",
          detectionMethod: "Automated",
          likes: 0
        },
        {
          id: 4,
          content: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation",
          author: {
            name: "TestBot",
            email: "test@bot.com",
            avatar: null,
            isRegistered: false
          },
          article: {
            id: 4,
            title: "Understanding Machine Learning Basics",
            slug: "machine-learning-basics"
          },
          submittedAt: "2024-08-04T07:20:00Z",
          detectedAt: "2024-08-04T07:25:00Z",
          spamReason: "Lorem ipsum text",
          confidence: 99,
          ipAddress: "192.168.1.103",
          detectionMethod: "Automated",
          likes: 0
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.author.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterReason === 'all' || comment.spamReason.toLowerCase().includes(filterReason.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const handleSelectComment = (commentId) => {
    setSelectedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedComments.length === filteredComments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(filteredComments.map(comment => comment.id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedComments.length === 0) return;
    
    if (confirm(`Permanently delete ${selectedComments.length} spam comment(s)?`)) {
      setComments(prev => prev.filter(comment => !selectedComments.includes(comment.id)));
      setSelectedComments([]);
      alert(`${selectedComments.length} spam comment(s) deleted successfully!`);
    }
  };

  const handleBulkRestore = () => {
    if (selectedComments.length === 0) return;
    
    if (confirm(`Restore ${selectedComments.length} comment(s) and mark as legitimate?`)) {
      setComments(prev => prev.filter(comment => !selectedComments.includes(comment.id)));
      setSelectedComments([]);
      alert(`${selectedComments.length} comment(s) restored successfully!`);
    }
  };

  const handleDeleteComment = (commentId) => {
    if (confirm('Permanently delete this spam comment?')) {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      alert('Spam comment deleted successfully!');
    }
  };

  const handleRestoreComment = (commentId) => {
    if (confirm('Restore this comment and mark as legitimate?')) {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      alert('Comment restored successfully!');
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-red-600 bg-red-100';
    if (confidence >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
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
          <h1 className="text-2xl font-bold text-gray-900">Spam Comments</h1>
          <p className="mt-2 text-gray-600">
            Manage comments that have been marked as spam by the system or users.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              <Shield className="mr-1 h-4 w-4" />
              {filteredComments.length} spam
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Left side - Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search spam comments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter by Spam Reason */}
            <div className="sm:w-48">
              <select
                value={filterReason}
                onChange={(e) => setFilterReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Reasons</option>
                <option value="suspicious">Suspicious links</option>
                <option value="pharmaceutical">Pharmaceutical</option>
                <option value="duplicate">Duplicate content</option>
                <option value="lorem">Lorem ipsum</option>
              </select>
            </div>
          </div>

          {/* Right side - Bulk Actions */}
          {selectedComments.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedComments.length} selected
              </span>
              <button
                onClick={handleBulkRestore}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Restore
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Select All */}
        {filteredComments.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedComments.length === filteredComments.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-600">
                Select all {filteredComments.length} comment{filteredComments.length !== 1 ? 's' : ''}
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg shadow-sm border border-red-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment.id)}
                    onChange={() => handleSelectComment(comment.id)}
                    className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-red-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{comment.author.name}</span>
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            SPAM
                          </span>
                        </div>
                      </div>
                      
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(comment.confidence)}`}>
                        {comment.confidence}% confidence
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {getTimeAgo(comment.detectedAt)}
                      </span>
                      <span>{comment.author.email}</span>
                      <span>IP: {comment.ipAddress}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {comment.detectionMethod}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Spam Details */}
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Spam Reason:</span>
                  <span className="text-sm text-red-700">{comment.spamReason}</span>
                </div>
                <div className="text-xs text-red-600">
                  Detected on {new Date(comment.detectedAt).toLocaleString()}
                </div>
              </div>

              {/* Comment Content */}
              <div className="mb-4">
                <div className="p-3 bg-gray-50 border-l-4 border-red-400 rounded-r">
                  <p className="text-gray-700 italic">{comment.content}</p>
                </div>
              </div>

              {/* Article Reference */}
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Comment on:</span>
                  <Link 
                    to={`/article/${comment.article.slug}`}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    {comment.article.title}
                  </Link>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Submitted {getTimeAgo(comment.submittedAt)}</span>
                  <Link 
                    to={`/admin/comments/${comment.id}`}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Link>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                  <button
                    onClick={() => handleRestoreComment(comment.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restore
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredComments.length === 0 && (
        <div className="text-center py-12">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No spam comments</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || filterReason !== 'all' 
              ? 'No spam comments match your current filters.' 
              : 'Great! No spam comments detected.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
