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
    category: '',
    tags: [],
    status: 'draft',
    publishedAt: '',
    featured: false,
    allowComments: true,
    metaDescription: '',
    metaKeywords: ''
  });

  const [categories] = useState([
    'Technology',
    'Startups',
    'Security',
    'AI & Machine Learning',
    'Mobile Development',
    'Web Development',
    'Cloud Computing'
  ]);

  const [availableTags] = useState([
    'React', 'JavaScript', 'AI', 'Blockchain', 'Cybersecurity', 
    'Cloud', 'Mobile', 'Startup', 'Funding', 'Innovation'
  ]);

  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isEditing) {
      // Load post data for editing
      const mockPost = {
        id: 1,
        title: "The Future of Artificial Intelligence in Tech Industry",
        slug: "future-ai-tech-industry",
        content: `# The Future of AI in Tech

Artificial Intelligence is revolutionizing the technology industry at an unprecedented pace. From machine learning algorithms to neural networks, AI is reshaping how we approach problem-solving and innovation.

## Key Areas of Impact

### 1. Automation and Efficiency
AI-powered automation is streamlining processes across various sectors, reducing human error and increasing productivity.

### 2. Data Analysis and Insights
Advanced analytics powered by AI are providing deeper insights into user behavior and market trends.

### 3. Personalization
AI enables highly personalized user experiences, from content recommendations to customized interfaces.

## The Road Ahead

As we move forward, the integration of AI into everyday technology will become even more seamless and powerful. Companies that embrace this transformation will lead the way in innovation.`,
        excerpt: "Exploring how AI is reshaping the technology landscape and what it means for developers and businesses.",
        featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        category: "Technology",
        tags: ["AI", "Technology", "Innovation"],
        status: "published",
        publishedAt: "2024-01-15T10:30:00",
        featured: true,
        allowComments: true,
        metaDescription: "Discover how artificial intelligence is transforming the tech industry and what the future holds.",
        metaKeywords: "AI, artificial intelligence, technology, innovation, machine learning"
      };
      
      setFormData(mockPost);
      setImagePreview(mockPost.featuredImage);
    }
  }, [isEditing, id]);

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
    setSaving(true);
    
    const postData = {
      ...formData,
      status,
      publishedAt: status === 'published' ? new Date().toISOString() : formData.publishedAt
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving post:', postData);
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error saving post:', error);
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

            {/* Excerpt */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                placeholder="Brief description of the post..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
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
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
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
