import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare,
  User,
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react';

export default function PendingComments() {
  const [comments, setComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComments, setSelectedComments] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setComments([
        {
          id: 1,
          content: "This is a really insightful article about AI trends. I particularly found the section about machine learning applications fascinating. Would love to see more content like this!",
          author: {
            name: "John Doe",
            email: "john.doe@example.com",
            avatar: null,
            isRegistered: true
          },
          article: {
            id: 1,
            title: "The Future of Artificial Intelligence in 2024",
            slug: "future-ai-2024"
          },
          submittedAt: "2024-08-04T10:30:00Z",
          status: "pending",
          type: "normal",
          flagReason: null,
          parentCommentId: null,
          likes: 0,
          ipAddress: "192.168.1.1"
        },
        {
          id: 2,
          content: "Great article! But I think you missed discussing the ethical implications of AI development.",
          author: {
            name: "Jane Smith",
            email: "jane.smith@example.com",
            avatar: null,
            isRegistered: false
          },
          article: {
            id: 1,
            title: "The Future of Artificial Intelligence in 2024",
            slug: "future-ai-2024"
          },
          submittedAt: "2024-08-04T09:15:00Z",
          status: "pending",
          type: "normal",
          flagReason: null,
          parentCommentId: null,
          likes: 2,
          ipAddress: "192.168.1.2"
        },
        {
          id: 3,
          content: "This content seems suspicious and might be spam. Please check the links.",
          author: {
            name: "Suspicious User",
            email: "spam@example.com",
            avatar: null,
            isRegistered: false
          },
          article: {
            id: 2,
            title: "Top 10 Programming Languages to Learn",
            slug: "top-programming-languages"
          },
          submittedAt: "2024-08-04T08:45:00Z",
          status: "pending",
          type: "flagged",
          flagReason: "Potential spam",
          parentCommentId: null,
          likes: 0,
          ipAddress: "192.168.1.3"
        },
        {
          id: 4,
          content: "I completely agree with the previous comment. This framework has changed my development workflow significantly.",
          author: {
            name: "Mike Johnson",
            email: "mike.j@example.com",
            avatar: null,
            isRegistered: true
          },
          article: {
            id: 3,
            title: "React vs Vue: A Developer's Perspective",
            slug: "react-vs-vue"
          },
          submittedAt: "2024-08-04T07:20:00Z",
          status: "pending",
          type: "reply",
          flagReason: null,
          parentCommentId: 1,
          likes: 1,
          ipAddress: "192.168.1.4"
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || comment.type === filterType;
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

  const handleBulkApprove = () => {
    if (selectedComments.length === 0) return;
    
    if (confirm(`Approve ${selectedComments.length} comment(s)?`)) {
      setComments(prev => prev.filter(comment => !selectedComments.includes(comment.id)));
      setSelectedComments([]);
      alert(`${selectedComments.length} comment(s) approved successfully!`);
    }
  };

  const handleBulkReject = () => {
    if (selectedComments.length === 0) return;
    
    if (confirm(`Reject ${selectedComments.length} comment(s)?`)) {
      setComments(prev => prev.filter(comment => !selectedComments.includes(comment.id)));
      setSelectedComments([]);
      alert(`${selectedComments.length} comment(s) rejected successfully!`);
    }
  };

  const handleApproveComment = (commentId) => {
    if (confirm('Approve this comment?')) {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      alert('Comment approved successfully!');
    }
  };

  const handleRejectComment = (commentId) => {
    if (confirm('Reject this comment?')) {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      alert('Comment rejected successfully!');
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
          <h1 className="text-2xl font-bold text-gray-900">Pending Comments</h1>
          <p className="mt-2 text-gray-600">
            Review and moderate comments awaiting approval.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              <Clock className="mr-1 h-4 w-4" />
              {filteredComments.length} pending
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
                  placeholder="Search comments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="sm:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="normal">Normal</option>
                <option value="reply">Replies</option>
                <option value="flagged">Flagged</option>
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
                onClick={handleBulkApprove}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </button>
              <button
                onClick={handleBulkReject}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Reject
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
          <div key={comment.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
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
                        <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{comment.author.name}</span>
                          {comment.author.isRegistered && (
                            <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Registered
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {comment.type === 'flagged' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Flagged
                        </span>
                      )}
                      
                      {comment.type === 'reply' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Reply
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {getTimeAgo(comment.submittedAt)}
                      </span>
                      <span>{comment.author.email}</span>
                      <span>IP: {comment.ipAddress}</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Comment Content */}
              <div className="mb-4">
                <p className="text-gray-800 leading-relaxed">{comment.content}</p>
                
                {comment.flagReason && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">Flag Reason:</span>
                      <span className="text-sm text-red-700">{comment.flagReason}</span>
                    </div>
                  </div>
                )}
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
                  <span>{comment.likes} likes</span>
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
                    onClick={() => handleRejectComment(comment.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApproveComment(comment.id)}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-green-700 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
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
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pending comments</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || filterType !== 'all' 
              ? 'No comments match your current filters.' 
              : 'All comments have been reviewed.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
