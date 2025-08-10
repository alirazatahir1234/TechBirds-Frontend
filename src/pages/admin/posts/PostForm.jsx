import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, 
  Eye, 
  Upload, 
  X, 
  Plus, 
  Calendar,
  Globe,
  Lock,
  Clock,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  Quote,
  Code
} from 'lucide-react';
import { adminAPI } from '../../../services/api';

const PostForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    categoryId: '',
    tags: [],
    status: 'draft',
    publishedAt: '',
    featured: false,
    allowComments: true,
    metaDescription: '',
    metaKeywords: ''
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);

  const [newTag, setNewTag] = useState('');
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // Fetch categories and post data
  useEffect(() => {
    const loadData = async () => {
      console.log('🚀 PostForm useEffect triggered:', { isEditing, id });
      
      // Always fetch categories and tags
      await fetchCategories();
      await fetchAvailableTags();
      
      // Only fetch post data if editing
      if (isEditing && id) {
        await fetchPost();
      } else if (isEditing && !id) {
        console.warn('⚠️ Edit mode but no ID provided');
        setError('No post ID provided for editing');
      }
    };
    
    loadData();
  }, [isEditing, id]);

  const fetchCategories = async () => {
    try {
      console.log('🔍 Fetching categories...');
      const categoriesData = await adminAPI.getCategories();
      console.log('✅ Categories received:', categoriesData);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      setError('Failed to load categories');
    }
  };

  const fetchAvailableTags = async () => {
    try {
      console.log('🔍 Fetching available tags...');
      // Fetch tags from API - this could be a separate endpoint or extracted from existing posts
      const tagsData = await adminAPI.getTags();
      console.log('✅ Tags received:', tagsData);
      
      if (Array.isArray(tagsData) && tagsData.length > 0) {
        setAvailableTags(tagsData);
      } else {
        console.log('📝 Using fallback tags (API returned empty or non-array)');
        // Fallback to common tech tags if API doesn't return any tags
        setAvailableTags([
          'React', 'JavaScript', 'AI', 'Blockchain', 'Cybersecurity', 
          'Cloud', 'Mobile', 'Startup', 'Funding', 'Innovation'
        ]);
      }
    } catch (error) {
      console.error('❌ Error fetching tags:', error);
      console.log('📝 Using fallback tags due to error');
      // Use fallback tags if API call fails
      setAvailableTags([
        'React', 'JavaScript', 'AI', 'Blockchain', 'Cybersecurity', 
        'Cloud', 'Mobile', 'Startup', 'Funding', 'Innovation'
      ]);
    }
  };

  const fetchPost = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching post with ID:', id);
      
      const post = await adminAPI.getPostById(id);
      console.log('✅ Post data received:', post);
      
      // Map the API response to form data structure
      const mappedData = {
        title: post.title || '',
        slug: post.slug || '',
        content: post.content || '',
        excerpt: post.summary || post.excerpt || '', // Handle both summary and excerpt
        featuredImage: post.imageUrl || post.featuredImage || '',
        categoryId: post.categoryId || post.category?.id || '',
        tags: post.tags ? (Array.isArray(post.tags) ? post.tags : post.tags.split(',').map(tag => tag.trim())) : [],
        status: post.status || 'draft',
        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
        featured: post.featured || false,
        allowComments: post.allowComments !== false,
        metaDescription: post.metaDescription || '',
        metaKeywords: post.metaKeywords || ''
      };
      
      console.log('📝 Mapped form data:', mappedData);
      setFormData(mappedData);
      
      // Set image preview if available
      const imageUrl = post.imageUrl || post.featuredImage || '';
      setImagePreview(imageUrl);
      console.log('🖼️ Image preview set to:', imageUrl);
      
    } catch (error) {
      console.error('❌ Error fetching post:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      setError(`Failed to load post: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData(prev => ({ ...prev, featuredImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (status = 'draft') => {
    // Validate required fields
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    setSaving(true);
    setError(null);
    
    try {
      // Get current user info for userId (optional - let backend handle if not available)
      let currentUser;
      try {
        currentUser = await adminAPI.getCurrentUser();
        console.log('✅ Current user found:', currentUser);
      } catch (userError) {
        console.warn('Could not fetch current user, letting backend assign user:', userError.message);
      }

      // Match backend structure exactly - use summary instead of excerpt, imageUrl instead of featuredImage
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        summary: formData.excerpt.trim() || null, // Backend expects 'summary' not 'excerpt'
        imageUrl: formData.featuredImage || null, // Backend expects 'imageUrl' not 'featuredImage'
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null, // Ensure proper integer or null
        tags: Array.isArray(formData.tags) && formData.tags.length > 0 
          ? formData.tags.join(',') 
          : null, // Convert array to comma-separated string or null if empty
        type: 'update', // Backend expects type field
        status: status || 'draft', // Ensure status is never undefined
        featured: Boolean(formData.featured), // Ensure boolean
        allowComments: Boolean(formData.allowComments), // Ensure boolean
        externalUrl: formData.externalUrl?.trim() || null,
        externalSource: formData.externalSource?.trim() || null,
        publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : null
        // Remove fields not expected by backend: slug, metaDescription, metaKeywords
        // Remove authorId - now using userId with new Identity system
      };

      // Only include userId if we have a real user (not the mock fallback)
      if (currentUser && currentUser.email !== 'test@techbirds.com') {
        const userId = parseInt(currentUser.id);
        if (isNaN(userId) || userId <= 0) {
          console.error('❌ Invalid user ID:', currentUser.id);
          setError('❌ Invalid user session. Please log in again.');
          return;
        }
        postData.userId = userId; // ✨ NEW: Using userId instead of authorId
        console.log('📝 Using authenticated user:', { name: currentUser.name, id: userId });
      } else {
        console.log('📝 No valid user found - backend will need to assign user from authentication context');
        // Don't include userId - let backend handle it
      }

      // Validate data before sending
      if (!postData.title || postData.title.length > 200) {
        setError('❌ Title is required and must be less than 200 characters');
        return;
      }
      if (!postData.content || postData.content.length > 50000) {
        setError('❌ Content is required and must be less than 50,000 characters');
        return;
      }
      if (postData.summary && postData.summary.length > 500) {
        setError('❌ Summary must be less than 500 characters');
        return;
      }

      console.log('📝 Sending post data:', postData);

      // Create a clean copy with only non-null values to avoid potential backend issues
      const cleanPostData = Object.fromEntries(
        Object.entries(postData).filter(([key, value]) => value !== null && value !== '' && value !== undefined)
      );
      
      console.log('🧹 Clean post data (nulls removed):', cleanPostData);

      let result;
      if (isEditing) {
        console.log('🔄 Updating existing post with ID:', id);
        result = await adminAPI.updatePost(id, cleanPostData);
      } else {
        console.log('✨ Creating new post');
        result = await adminAPI.createPost(cleanPostData);
      }

      console.log('✅ Post saved successfully:', result);
      navigate('/admin/posts');
    } catch (error) {
      console.error('❌ Post save failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      // Handle specific error messages
      if (error.response?.status === 405) {
        if (isEditing) {
          setError('❌ Backend API Missing: The PUT /api/admin/posts/{id} endpoint is not implemented. Your frontend is ready - please ask your backend developer to add this endpoint to update posts.');
        } else {
          setError('❌ Backend API Missing: The POST /api/admin/posts endpoint is not implemented. Your frontend is ready - please ask your backend developer to add this endpoint to save posts.');
        }
      } else if (error.response?.status === 400) {
        const errorData = error.response?.data;
        let errorMessage = 'Bad Request: Invalid data provided';
        
        // Handle specific backend validation errors
        if (typeof errorData === 'string') {
          if (errorData.includes('Author with ID') && errorData.includes('not found')) {
            errorMessage = `❌ Author Error: ${errorData}\n\n💡 The user ID being used doesn't exist in the database. This usually means there's an authentication issue.`;
          } else if (errorData.includes('Author with ID') && errorData.includes('not active')) {
            errorMessage = `❌ Author Error: ${errorData}\n\n💡 Your user account is inactive. Please contact an administrator.`;
          } else if (errorData.includes('Author ID is required')) {
            errorMessage = `❌ Author Error: ${errorData}\n\n💡 No user ID provided. Please log in again to refresh your session.`;
          } else {
            errorMessage = `Bad Request: ${errorData}`;
          }
        } else if (errorData?.message) {
          if (errorData.message.includes('Author with ID') && errorData.message.includes('not found')) {
            errorMessage = `❌ Author Error: ${errorData.message}\n\n💡 The user ID being used doesn't exist in the database. This usually means there's an authentication issue.`;
          } else if (errorData.message.includes('Author with ID') && errorData.message.includes('not active')) {
            errorMessage = `❌ Author Error: ${errorData.message}\n\n💡 Your user account is inactive. Please contact an administrator.`;
          } else if (errorData.message.includes('Author ID is required')) {
            errorMessage = `❌ Author Error: ${errorData.message}\n\n💡 No user ID provided. Please log in again to refresh your session.`;
          } else {
            errorMessage = `Bad Request: ${errorData.message}`;
          }
        } else if (errorData?.error) {
          errorMessage = `Bad Request: ${errorData.error}`;
        } else if (errorData?.errors) {
          // Handle validation errors array
          const errors = Array.isArray(errorData.errors) 
            ? errorData.errors.join(', ') 
            : JSON.stringify(errorData.errors);
          errorMessage = `Validation Error: ${errors}`;
        }
        
        setError(`${errorMessage}\n\nTip: Make sure you have selected a valid category and all required fields are filled.`);
      } else if (error.response?.status === 401) {
        setError('❌ Authentication Error: Please login as an admin to create posts.');
      } else if (error.response?.status === 403) {
        setError('❌ Access Denied: You do not have permission to create posts.');
      } else if (error.response?.status === 500) {
        const errorData = error.response?.data;
        let errorDetails = '';
        
        if (errorData?.message) {
          errorDetails = errorData.message;
        }
        if (errorData?.error && errorData.error !== errorData.message) {
          errorDetails += errorDetails ? ` Details: ${errorData.error}` : errorData.error;
        }
        
        // Check if 500 error might be related to author validation that wasn't caught as 400
        if (errorDetails.toLowerCase().includes('author') && errorDetails.toLowerCase().includes('not found')) {
          setError(`❌ Author Validation Error: ${errorDetails}\n\n🔧 This indicates an authentication issue. Please log out and log back in to refresh your session.`);
        } else {
          setError(`❌ Server Error: ${errorDetails || 'The backend server encountered an error.'}\n\n🔧 This is likely a backend database issue. The frontend data is correct, but the backend cannot save it to the database.`);
        }
      } else {
        setError(`❌ Failed to save post: ${error.message}\n\nPlease check the browser console for more details.`);
      }
    } finally {
      setSaving(false);
    }
  };

  const insertMarkdown = (syntax) => {
    const textarea = document.getElementById('content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let insertText = '';
    switch (syntax) {
      case 'bold':
        insertText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        insertText = `*${selectedText || 'italic text'}*`;
        break;
      case 'link':
        insertText = `[${selectedText || 'link text'}](url)`;
        break;
      case 'code':
        insertText = `\`${selectedText || 'code'}\``;
        break;
      case 'quote':
        insertText = `> ${selectedText || 'quote'}`;
        break;
      case 'list':
        insertText = `- ${selectedText || 'list item'}`;
        break;
      default:
        insertText = selectedText;
    }

    const newContent = 
      textarea.value.substring(0, start) + 
      insertText + 
      textarea.value.substring(end);
    
    setFormData(prev => ({ ...prev, content: newContent }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Post' : 'Create New Post'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update your post content' : 'Create and publish a new blog post'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/admin/posts')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            <Globe className="mr-2 h-4 w-4" />
            {saving ? 'Publishing...' : 'Publish'}
          </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Post Content</h3>
            
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter post title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Slug */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md">
                  /post/
                </span>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary *
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                placeholder="Brief summary of the post..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              
              {/* Toolbar */}
              <div className="border border-gray-300 rounded-t-md bg-gray-50 p-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => insertMarkdown('bold')}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('italic')}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('link')}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                  title="Link"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('code')}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                  title="Code"
                >
                  <Code className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('quote')}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                  title="Quote"
                >
                  <Quote className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('list')}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                  title="List"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={15}
                placeholder="Write your post content in Markdown..."
                className="w-full px-3 py-2 border border-gray-300 border-t-0 rounded-b-md focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Supports Markdown formatting. Use the toolbar buttons for quick formatting.
              </p>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Brief description for search engines (150-160 characters)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.metaDescription.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleInputChange}
                  placeholder="keyword1, keyword2, keyword3..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Publish Settings</h3>
            
            <div className="space-y-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              {/* Publish Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date
                </label>
                <input
                  type="datetime-local"
                  name="publishedAt"
                  value={formData.publishedAt ? formData.publishedAt.slice(0, 16) : ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                  Featured Post
                </label>
              </div>

              {/* Allow Comments */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowComments"
                  name="allowComments"
                  checked={formData.allowComments}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="allowComments" className="ml-2 block text-sm text-gray-700">
                  Allow Comments
                </label>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Featured Image</h3>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
                <button
                  onClick={() => {
                    setImagePreview('');
                    setFormData(prev => ({ ...prev, featuredImage: '' }));
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload an image
                    </span>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category</h3>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tags</h3>
            
            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {tag}
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add New Tag */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
              <button
                onClick={handleTagAdd}
                className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Suggested Tags */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Suggested:</p>
              <div className="flex flex-wrap gap-1">
                {availableTags
                  .filter(tag => !formData.tags.includes(tag))
                  .slice(0, 6)
                  .map(tag => (
                  <button
                    key={tag}
                    onClick={() => setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
