import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  ThumbsUp, 
  ThumbsDown,
  Reply,
  Trash2,
  Flag,
  CheckCircle,
  X,
  User,
  Calendar,
  ExternalLink,
  Eye,
  MoreVertical
} from 'lucide-react';

const CommentsManager = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComments, setSelectedComments] = useState([]);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  // Mock data - Replace with actual API calls
  useEffect(() => {
    const mockComments = [
      {
        id: 1,
        content: "Great article! The insights about AI development are really valuable. I particularly liked the section about machine learning applications.",
        author: {
          name: "John Doe",
          email: "john.doe@example.com",
          avatar: null
        },
        post: {
          id: 1,
          title: "The Future of Artificial Intelligence in Tech Industry",
          slug: "future-ai-tech-industry"
        },
        status: "approved",
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z",
        likes: 12,
        dislikes: 1,
        replies: [
          {
            id: 11,
            content: "Thanks for the feedback! Glad you found it useful.",
            author: {
              name: "Admin",
              email: "admin@techbirds.com",
              avatar: null
            },
            createdAt: "2024-01-15T11:00:00Z",
            isAuthor: true
          }
        ],
        reported: false,
        ip: "192.168.1.1"
      },
      {
        id: 2,
        content: "This is spam content with promotional links.",
        author: {
          name: "Spammer",
          email: "spam@example.com",
          avatar: null
        },
        post: {
          id: 2,
          title: "Startup Funding Trends in 2024",
          slug: "startup-funding-trends-2024"
        },
        status: "pending",
        createdAt: "2024-01-14T16:45:00Z",
        updatedAt: "2024-01-14T16:45:00Z",
        likes: 0,
        dislikes: 5,
        replies: [],
        reported: true,
        ip: "10.0.0.1"
      },
      {
        id: 3,
        content: "Interesting perspective on cybersecurity. However, I think there are some additional considerations regarding zero-trust architecture that weren't covered.",
        author: {
          name: "Sarah Wilson",
          email: "sarah.wilson@example.com",
          avatar: null
        },
        post: {
          id: 3,
          title: "Cybersecurity Best Practices for Small Businesses",
          slug: "cybersecurity-best-practices"
        },
        status: "approved",
        createdAt: "2024-01-13T09:15:00Z",
        updatedAt: "2024-01-13T09:15:00Z",
        likes: 8,
        dislikes: 0,
        replies: [],
        reported: false,
        ip: "172.16.0.1"
      }
    ];
    
    setTimeout(() => {
      setComments(mockComments);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredComments = comments.filter(comment => {
    const matchesSearch = 
      comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comment.post.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: comments.length,
    approved: comments.filter(c => c.status === 'approved').length,
    pending: comments.filter(c => c.status === 'pending').length,
    spam: comments.filter(c => c.status === 'spam').length
  };

  const handleCommentAction = (commentId, action) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { ...comment, status: action, updatedAt: new Date().toISOString() }
        : comment
    ));
  };

  const handleBulkAction = (action) => {
    setComments(prev => prev.map(comment => 
      selectedComments.includes(comment.id)
        ? { ...comment, status: action, updatedAt: new Date().toISOString() }
        : comment
    ));
    setSelectedComments([]);
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    setShowReplyModal(true);
  };

  const toggleCommentSelection = (commentId) => {
    setSelectedComments(prev => 
      prev.includes(commentId)
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    );
  };

  const ReplyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Reply to Comment</h3>
            <button
              onClick={() => setShowReplyModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {replyingTo && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900">{replyingTo.author.name}</div>
              <div className="text-sm text-gray-600 mt-1">{replyingTo.content}</div>
            </div>
          )}

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Reply
              </label>
              <textarea
                rows={4}
                placeholder="Write your reply..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowReplyModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                <Reply className="mr-2 h-4 w-4" />
                Send Reply
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
          <p className="text-gray-600">Moderate and manage user comments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Comments</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Approved</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Eye className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Review</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Flag className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Spam</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.spam}</p>
            </div>
          </div>
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
                placeholder="Search comments, authors, or posts..."
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
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="spam">Spam</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedComments.length > 0 && (
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">
              {selectedComments.length} comment(s) selected
            </span>
            <button
              onClick={() => handleBulkAction('approved')}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Approve
            </button>
            <button
              onClick={() => handleBulkAction('pending')}
              className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
            >
              Pending
            </button>
            <button
              onClick={() => handleBulkAction('spam')}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Mark as Spam
            </button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6">
              {/* Comment Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment.id)}
                    onChange={() => toggleCommentSelection(comment.id)}
                    className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">{comment.author.name}</h4>
                      <span className="text-sm text-gray-500">{comment.author.email}</span>
                      {comment.reported && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          <Flag className="mr-1 h-3 w-3" />
                          Reported
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                      <span>IP: {comment.ip}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    comment.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : comment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {comment.status}
                  </span>
                </div>
              </div>

              {/* Post Reference */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-500">Comment on:</span>
                    <h5 className="text-sm font-medium text-gray-900">{comment.post.title}</h5>
                  </div>
                  <a
                    href={`/post/${comment.post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Comment Content */}
              <div className="mt-4">
                <p className="text-gray-900">{comment.content}</p>
              </div>

              {/* Comment Stats and Actions */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <ThumbsUp className="mr-1 h-3 w-3" />
                    {comment.likes}
                  </span>
                  <span className="flex items-center">
                    <ThumbsDown className="mr-1 h-3 w-3" />
                    {comment.dislikes}
                  </span>
                  {comment.replies.length > 0 && (
                    <span className="flex items-center">
                      <Reply className="mr-1 h-3 w-3" />
                      {comment.replies.length} replies
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {comment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleCommentAction(comment.id, 'approved')}
                        className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleCommentAction(comment.id, 'spam')}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        Spam
                      </button>
                    </>
                  )}
                  
                  {comment.status === 'approved' && (
                    <>
                      <button
                        onClick={() => handleReply(comment)}
                        className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => handleCommentAction(comment.id, 'pending')}
                        className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                      >
                        Unapprove
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="mt-4 pl-8 border-l-2 border-gray-200">
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Replies:</h6>
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-gray-50 p-3 rounded-lg mb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{reply.author.name}</span>
                          {reply.isAuthor && (
                            <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded">
                              Author
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredComments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No comments found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'No comments have been posted yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {showReplyModal && <ReplyModal />}
    </div>
  );
};

export default CommentsManager;
