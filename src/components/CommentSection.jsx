import React, { useState, useEffect } from 'react';
import { User, MessageCircle, Edit3, Trash2, Send, AlertCircle } from 'lucide-react';
import { commentsAPI } from '../services/api';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const CommentSection = ({ articleId, postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  
  const { user: currentUser, isAuthenticated } = useAdminAuth();

  // Load comments on component mount
  useEffect(() => {
    loadComments();
  }, [articleId, postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      let data;
      
      if (articleId) {
        data = await commentsAPI.getArticleComments(articleId);
      } else if (postId) {
        data = await commentsAPI.getPostComments(postId);
      } else {
        throw new Error('Either articleId or postId is required');
      }
      
      setComments(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load comments. Please try again.');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // Validate comment content
  const validateContent = (content) => {
    return commentsAPI.validateComment(content);
  };

  // Handle new comment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please login to post a comment.');
      return;
    }

    const validation = validateContent(newComment);
    if (validation) {
      setError(validation);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const commentData = {
        content: newComment.trim()
      };
      
      if (articleId) {
        commentData.articleId = articleId;
      } else if (postId) {
        commentData.postId = postId;
      }

      const newCommentResponse = await commentsAPI.createComment(commentData);
      
      // Add new comment to the list
      setComments(prevComments => [...prevComments, newCommentResponse]);
      setNewComment('');
    } catch (err) {
      setError(err.message || 'Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit comment
  const handleEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // Handle save edit
  const handleSaveEdit = async (commentId) => {
    const validation = validateContent(editContent);
    if (validation) {
      setError(validation);
      return;
    }

    try {
      setError(null);
      await commentsAPI.updateComment(commentId, editContent);
      
      // Update comment in the list
      setComments(prevComments =>
        prevComments.map(comment =>
          comment.id === commentId
            ? { ...comment, content: editContent, updatedAt: new Date().toISOString() }
            : comment
        )
      );
      
      setEditingId(null);
      setEditContent('');
    } catch (err) {
      setError(err.message || 'Failed to update comment. Please try again.');
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
    setError(null);
  };

  // Handle delete comment
  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      setError(null);
      await commentsAPI.deleteComment(commentId);
      
      // Remove comment from the list
      setComments(prevComments =>
        prevComments.filter(comment => comment.id !== commentId)
      );
    } catch (err) {
      setError(err.message || 'Failed to delete comment. Please try again.');
    }
  };

  // Check if user can edit comment
  const canEdit = (comment) => {
    return commentsAPI.canEditComment(comment, currentUser);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="comments-section mt-12">
      <div className="flex items-center mb-6">
        <MessageCircle className="h-6 w-6 text-gray-600 mr-2" />
        <h3 className="text-xl font-bold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Comment Form - Only show if user is logged in */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4">
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.name || 'User'}
                  </p>
                  {currentUser?.specialization && (
                    <p className="text-xs text-gray-500">{currentUser.specialization}</p>
                  )}
                </div>
              </div>
              
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                maxLength={2000}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                disabled={submitting}
              />
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">
                  {newComment.length}/2000 characters
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {submitting ? 'Posting...' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-600">
            <a href="/admin/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
              Sign in
            </a>{' '}
            to join the conversation
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
          <p className="text-gray-500">Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4">
                {/* Comment Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {comment.user?.avatar ? (
                          <img
                            src={comment.user.avatar}
                            alt={comment.user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {comment.user?.name || comment.author?.name || 'Anonymous'}
                      </p>
                      {comment.user?.specialization && (
                        <p className="text-xs text-gray-500">{comment.user.specialization}</p>
                      )}
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                        {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                          <span className="ml-1">(edited)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  {/* Edit/Delete Actions */}
                  {canEdit(comment) && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(comment)}
                        className="text-gray-400 hover:text-indigo-600 p-1"
                        title="Edit comment"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Delete comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Comment Content */}
                {editingId === comment.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      maxLength={2000}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {editContent.length}/2000 characters
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(comment.id)}
                          disabled={!editContent.trim()}
                          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-900 whitespace-pre-wrap">
                    {comment.content}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
