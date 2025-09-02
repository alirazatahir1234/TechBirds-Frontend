import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Save, Plus, X, Edit, Copy, Trash2, ArrowDown, ArrowUp, Settings, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../../services/api';

/**
 * PageBuilder component for constructing dynamic page layouts in admin
 */
const PageBuilder = ({ pageId, initialPageData = null }) => {
  const [page, setPage] = useState({
    title: '',
    slug: '',
    template: 'default',
    status: 'draft',
    sections: []
  });
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [availablePosts, setAvailablePosts] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSectionIndex, setEditingSectionIndex] = useState(null);
  const [editingSectionData, setEditingSectionData] = useState(null);
  
  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, categoriesData, tagsData] = await Promise.all([
          adminAPI.getPosts(),
          adminAPI.getCategories(),
          adminAPI.getTags()
        ]);
        
        setAvailablePosts(postsData.posts || postsData);
        setAvailableCategories(categoriesData);
        setAvailableTags(tagsData);
        
        // If editing an existing page, load its data
        if (pageId) {
          const pageData = await adminAPI.getPageById(pageId);
          setPage(pageData);
        } else if (initialPageData) {
          setPage(initialPageData);
        }
      } catch (err) {
        setError('Failed to load initial data. Please try again.');
      }
    };
    
    fetchData();
  }, [pageId, initialPageData]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'title' && !page.slug) {
      // Auto-generate slug from title
      setPage({
        ...page,
        title: value,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      });
    } else {
      setPage({
        ...page,
        [name]: value
      });
    }
  };
  
  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const sections = [...page.sections];
    const [movedSection] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, movedSection);
    
    setPage({
      ...page,
      sections
    });
  };
  
  // Handle adding a new section
  const addSection = (sectionType) => {
    // Create a default section based on type
    let newSection = {
      type: sectionType,
      props: {}
    };
    
    switch (sectionType) {
      case 'hero':
        newSection.props = {
          title: '',
          subtitle: '',
          posts: [],
          layout: 'standard',
          showExcerpt: true,
          showAuthor: true,
          showDate: true,
          maxPosts: 2
        };
        break;
        
      case 'featured-posts':
        newSection.props = {
          title: 'Featured Articles',
          subtitle: '',
          posts: [],
          layout: 'default',
          limit: 3,
          showImage: true,
          showExcerpt: true
        };
        break;
        
      case 'post-grid':
        newSection.props = {
          title: 'Latest Articles',
          subtitle: '',
          posts: [],
          columns: 3,
          limit: 6,
          showViewMore: true,
          sortBy: 'date'
        };
        break;
        
      case 'post-list':
        newSection.props = {
          title: 'Recent News',
          subtitle: '',
          posts: [],
          layout: 'standard',
          limit: 5
        };
        break;
        
      case 'category':
        newSection.props = {
          title: 'Category Name',
          subtitle: '',
          categoryId: null,
          categoryName: '',
          posts: [],
          layout: 'grid',
          limit: 4
        };
        break;
        
      case 'sidebar':
        newSection.props = {
          widgets: [
            {
              type: 'trending',
              title: 'Trending Now',
              posts: []
            },
            {
              type: 'newsletter',
              title: 'Stay Updated',
              description: 'Get the latest news delivered to your inbox'
            }
          ]
        };
        
        // For two-column template, specify which column the sidebar belongs to
        if (page.template === 'two-column') {
          newSection.column = 'right';
        }
        break;
        
      default:
        break;
    }
    
    setEditingSectionData(newSection);
    setEditingSectionIndex(null);
    setShowSectionModal(true);
  };
  
  // Handle editing an existing section
  const editSection = (index) => {
    setEditingSectionData({ ...page.sections[index] });
    setEditingSectionIndex(index);
    setShowSectionModal(true);
  };
  
  // Handle duplicating a section
  const duplicateSection = (index) => {
    const sections = [...page.sections];
    const duplicatedSection = JSON.parse(JSON.stringify(sections[index]));
    sections.splice(index + 1, 0, duplicatedSection);
    
    setPage({
      ...page,
      sections
    });
  };
  
  // Handle removing a section
  const removeSection = (index) => {
    const sections = [...page.sections];
    sections.splice(index, 1);
    
    setPage({
      ...page,
      sections
    });
  };
  
  // Handle moving a section up or down
  const moveSection = (index, direction) => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === page.sections.length - 1)) {
      return;
    }
    
    const sections = [...page.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    const [movedSection] = sections.splice(index, 1);
    sections.splice(newIndex, 0, movedSection);
    
    setPage({
      ...page,
      sections
    });
  };
  
  // Handle saving the section being edited
  const saveSectionData = () => {
    const sections = [...page.sections];
    
    if (editingSectionIndex !== null) {
      // Update existing section
      sections[editingSectionIndex] = editingSectionData;
    } else {
      // Add new section
      sections.push(editingSectionData);
    }
    
    setPage({
      ...page,
      sections
    });
    
    setShowSectionModal(false);
    setEditingSectionData(null);
    setEditingSectionIndex(null);
  };
  
  // Handle saving the entire page
  const savePage = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      if (!page.title) {
        setError('Page title is required');
        setSaving(false);
        return;
      }
      
      if (!page.slug) {
        setError('Page slug is required');
        setSaving(false);
        return;
      }
      
      // Save to API
      if (pageId) {
        await adminAPI.updatePage(pageId, page);
        setSuccess('Page updated successfully!');
      } else {
        const result = await adminAPI.createPage(page);
        setSuccess('Page created successfully!');
        
        // If we want to redirect to edit page after creation
        // history.push(`/admin/pages/edit/${result.id}`);
      }
    } catch (err) {
      setError(`Failed to save page: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };
  
  // Get section title for display
  const getSectionTitle = (section) => {
    switch (section.type) {
      case 'hero':
        return 'Hero Section';
      case 'featured-posts':
        return section.props.title || 'Featured Posts';
      case 'post-grid':
        return section.props.title || 'Post Grid';
      case 'post-list':
        return section.props.title || 'Post List';
      case 'category':
        return section.props.title || section.props.categoryName || 'Category';
      case 'sidebar':
        return 'Sidebar Widgets';
      default:
        return 'Section';
    }
  };
  
  return (
    <div className="page-builder">
      {/* Page Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Page Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Title
            </label>
            <input
              type="text"
              name="title"
              value={page.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-green"
              placeholder="Enter page title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Slug
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-2">/</span>
              <input
                type="text"
                name="slug"
                value={page.slug}
                onChange={handleInputChange}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-green"
                placeholder="page-slug"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Template
            </label>
            <select
              name="template"
              value={page.template}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-green"
            >
              <option value="default">Default Template</option>
              <option value="homepage">Homepage Template</option>
              <option value="full-width">Full Width Template</option>
              <option value="two-column">Two Column Template</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={page.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tech-green"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Sections Builder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Page Content</h2>
          <div className="flex space-x-2">
            <Link
              to={`/preview/page/${page.slug}`}
              target="_blank"
              className="btn-secondary flex items-center"
            >
              <Eye size={16} className="mr-2" />
              Preview
            </Link>
            <button
              className="btn-primary flex items-center"
              onClick={() => setShowSectionModal(true)}
            >
              <Plus size={16} className="mr-2" />
              Add Section
            </button>
          </div>
        </div>
        
        {/* Sections List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections-list">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {page.sections.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No sections added yet. Click "Add Section" to get started.</p>
                  </div>
                ) : (
                  page.sections.map((section, index) => (
                    <Draggable key={`section-${index}`} draggableId={`section-${index}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="section-item bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div 
                            className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-200"
                            {...provided.dragHandleProps}
                          >
                            <div className="flex items-center">
                              <span className="font-medium">{getSectionTitle(section)}</span>
                              <span className="ml-2 px-2 py-1 bg-gray-200 text-xs rounded">
                                {section.type}
                              </span>
                              {section.column && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-xs text-green-800 rounded">
                                  {section.column} column
                                </span>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              <button
                                className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                onClick={() => moveSection(index, 'up')}
                                disabled={index === 0}
                              >
                                <ArrowUp size={16} />
                              </button>
                              <button
                                className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                onClick={() => moveSection(index, 'down')}
                                disabled={index === page.sections.length - 1}
                              >
                                <ArrowDown size={16} />
                              </button>
                              <button
                                className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                onClick={() => editSection(index)}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="p-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                onClick={() => duplicateSection(index)}
                              >
                                <Copy size={16} />
                              </button>
                              <button
                                className="p-1 text-gray-500 hover:text-red-600 transition-colors duration-200"
                                onClick={() => removeSection(index)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            {/* Section Preview Summary */}
                            <div className="text-sm text-gray-600">
                              {section.type === 'hero' && (
                                <div>
                                  <p><strong>Layout:</strong> {section.props.layout}</p>
                                  <p><strong>Posts:</strong> {section.props.posts?.length || 0} selected</p>
                                </div>
                              )}
                              
                              {section.type === 'featured-posts' && (
                                <div>
                                  <p><strong>Title:</strong> {section.props.title}</p>
                                  <p><strong>Layout:</strong> {section.props.layout}</p>
                                  <p><strong>Posts:</strong> {section.props.posts?.length || 0} selected</p>
                                </div>
                              )}
                              
                              {section.type === 'post-grid' && (
                                <div>
                                  <p><strong>Title:</strong> {section.props.title}</p>
                                  <p><strong>Columns:</strong> {section.props.columns}</p>
                                  <p><strong>Posts:</strong> {section.props.posts?.length || 0} selected (Limit: {section.props.limit})</p>
                                </div>
                              )}
                              
                              {section.type === 'post-list' && (
                                <div>
                                  <p><strong>Title:</strong> {section.props.title}</p>
                                  <p><strong>Layout:</strong> {section.props.layout}</p>
                                  <p><strong>Posts:</strong> {section.props.posts?.length || 0} selected (Limit: {section.props.limit})</p>
                                </div>
                              )}
                              
                              {section.type === 'category' && (
                                <div>
                                  <p><strong>Category:</strong> {section.props.categoryName || 'Not selected'}</p>
                                  <p><strong>Layout:</strong> {section.props.layout}</p>
                                  <p><strong>Posts:</strong> {section.props.posts?.length || 0} selected (Limit: {section.props.limit})</p>
                                </div>
                              )}
                              
                              {section.type === 'sidebar' && (
                                <div>
                                  <p><strong>Widgets:</strong> {section.props.widgets?.length || 0}</p>
                                  <ul className="list-disc ml-5 mt-1">
                                    {section.props.widgets?.map((widget, widgetIndex) => (
                                      <li key={widgetIndex}>{widget.type}: {widget.title}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button className="btn-secondary">
          Cancel
        </button>
        <button
          className="btn-primary flex items-center"
          onClick={savePage}
          disabled={saving}
        >
          {saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save Page
            </>
          )}
        </button>
      </div>
      
      {/* Error/Success Messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      {/* Add/Edit Section Modal */}
      {showSectionModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold">
                {editingSectionIndex !== null ? 'Edit Section' : 'Add Section'}
              </h3>
              <button
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => {
                  setShowSectionModal(false);
                  setEditingSectionData(null);
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {!editingSectionData ? (
                // Section Type Selection
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <button
                    className="section-type-btn p-4 border border-gray-200 rounded-lg hover:border-tech-green hover:bg-green-50 text-center"
                    onClick={() => addSection('hero')}
                  >
                    <div className="h-24 bg-gray-100 mb-3 rounded flex items-center justify-center">
                      Hero Section
                    </div>
                    <span className="font-medium">Hero Banner</span>
                  </button>
                  
                  <button
                    className="section-type-btn p-4 border border-gray-200 rounded-lg hover:border-tech-green hover:bg-green-50 text-center"
                    onClick={() => addSection('featured-posts')}
                  >
                    <div className="h-24 bg-gray-100 mb-3 rounded flex items-center justify-center">
                      Featured Posts
                    </div>
                    <span className="font-medium">Featured Articles</span>
                  </button>
                  
                  <button
                    className="section-type-btn p-4 border border-gray-200 rounded-lg hover:border-tech-green hover:bg-green-50 text-center"
                    onClick={() => addSection('post-grid')}
                  >
                    <div className="h-24 bg-gray-100 mb-3 rounded flex items-center justify-center">
                      Post Grid
                    </div>
                    <span className="font-medium">Posts Grid</span>
                  </button>
                  
                  <button
                    className="section-type-btn p-4 border border-gray-200 rounded-lg hover:border-tech-green hover:bg-green-50 text-center"
                    onClick={() => addSection('post-list')}
                  >
                    <div className="h-24 bg-gray-100 mb-3 rounded flex items-center justify-center">
                      Post List
                    </div>
                    <span className="font-medium">Posts List</span>
                  </button>
                  
                  <button
                    className="section-type-btn p-4 border border-gray-200 rounded-lg hover:border-tech-green hover:bg-green-50 text-center"
                    onClick={() => addSection('category')}
                  >
                    <div className="h-24 bg-gray-100 mb-3 rounded flex items-center justify-center">
                      Category Section
                    </div>
                    <span className="font-medium">Category Posts</span>
                  </button>
                  
                  <button
                    className="section-type-btn p-4 border border-gray-200 rounded-lg hover:border-tech-green hover:bg-green-50 text-center"
                    onClick={() => addSection('sidebar')}
                  >
                    <div className="h-24 bg-gray-100 mb-3 rounded flex items-center justify-center">
                      Sidebar
                    </div>
                    <span className="font-medium">Sidebar Widgets</span>
                  </button>
                </div>
              ) : (
                // Section Editor
                <div className="section-editor">
                  {/* Common Section Properties */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Section Settings</h4>
                    
                    {/* These are the section specific settings */}
                    {/* Implementation details for each section type would go here */}
                    {/* For brevity, I've omitted the full implementation of each section editor */}
                    {/* This would include form fields specific to each section type */}
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <p className="text-gray-500 text-sm">
                        Editor for {editingSectionData.type} would be implemented here with all the specific fields for that section type.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {editingSectionData && (
              <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowSectionModal(false);
                    setEditingSectionData(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={saveSectionData}
                >
                  Save Section
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageBuilder;
