import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Plus, Trash2, Eye } from 'lucide-react';

const DynamicPageForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    template: 'default',
    status: 'draft',
    sections: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Template options
  const templateOptions = [
    { value: 'default', label: 'Default Layout' },
    { value: 'homepage', label: 'Homepage Layout' },
    { value: 'full-width', label: 'Full Width' },
    { value: 'two-column', label: 'Two Column' }
  ];

  // Section type options
  const sectionTypes = [
    { value: 'hero', label: 'Hero Banner', description: 'Large banner with featured content' },
    { value: 'featured-posts', label: 'Featured Posts', description: 'Highlighted articles section' },
    { value: 'post-grid', label: 'Post Grid', description: 'Articles in grid layout' },
    { value: 'post-list', label: 'Post List', description: 'Articles in list format' },
    { value: 'category', label: 'Category Section', description: 'Posts from specific category' },
    { value: 'sidebar', label: 'Sidebar', description: 'Widgets and sidebar content' }
  ];

  // Load page data if editing
  useEffect(() => {
    if (isEdit) {
      // Mock data for now - replace with actual API call
      const mockPage = {
        id: 1,
        title: 'Sample Dynamic Page',
        slug: 'sample-page',
        template: 'homepage',
        status: 'draft',
        sections: [
          {
            type: 'hero',
            props: {
              title: 'Welcome to TechBirds',
              subtitle: 'Your source for latest tech news',
              limit: 3
            }
          },
          {
            type: 'featured-posts',
            props: {
              title: 'Featured Stories',
              limit: 6
            }
          }
        ]
      };
      setFormData(mockPage);
    }
  }, [isEdit, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const addSection = () => {
    const newSection = {
      type: 'post-grid',
      props: {
        title: 'New Section',
        limit: 6
      }
    };
    
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index 
          ? { 
              ...section, 
              [field]: field === 'type' ? value : section[field],
              props: field === 'type' ? { title: 'Section Title', limit: 6 } : {
                ...section.props,
                [field]: value
              }
            }
          : section
      )
    }));
  };

  const removeSection = (index) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Mock API call - replace with actual implementation
      console.log('Saving page:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/admin/dynamic-pages');
    } catch (err) {
      setError('Failed to save page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // Open preview in new tab
    window.open(`/page/${formData.slug}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {isEdit ? 'Edit Dynamic Page' : 'Create New Dynamic Page'}
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Build your page using customizable sections and templates.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Page Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Enter page title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="page-url-slug"
              />
              <p className="mt-1 text-xs text-gray-500">URL: /page/{formData.slug}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template
              </label>
              <select
                name="template"
                value={formData.template}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                {templateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        </div>

        {/* Page Sections */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Page Sections</h3>
            <button
              type="button"
              onClick={addSection}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Section
            </button>
          </div>

          {formData.sections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No sections added yet. Click "Add Section" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.sections.map((section, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-800">
                      Section {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section Type
                      </label>
                      <select
                        value={section.type}
                        onChange={(e) => updateSection(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      >
                        {sectionTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        {sectionTypes.find(t => t.value === section.type)?.description}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={section.props.title || ''}
                        onChange={(e) => updateSection(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="Section title"
                      />
                    </div>

                    {(['post-grid', 'post-list', 'featured-posts', 'category'].includes(section.type)) && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Number of Posts
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={section.props.limit || 6}
                          onChange={(e) => updateSection(index, 'limit', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    )}

                    {section.type === 'category' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category ID
                        </label>
                        <input
                          type="number"
                          value={section.props.categoryId || ''}
                          onChange={(e) => updateSection(index, 'categoryId', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          placeholder="Category ID"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/admin/dynamic-pages')}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <div className="flex items-center space-x-3">
            {formData.slug && (
              <button
                type="button"
                onClick={handlePreview}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : (isEdit ? 'Update Page' : 'Create Page')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DynamicPageForm;
