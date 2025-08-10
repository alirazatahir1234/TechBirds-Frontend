import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Save, X } from 'lucide-react';
import { adminAPI } from '../../../services/api';

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  
  // Description functionality now enabled - backend has been fixed
  const DESCRIPTION_ENABLED = true;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categories = await adminAPI.getCategories();
      setCategories(categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setError(null);
      
      const createData = {
        name: formData.name.trim(),
        description: (formData.description || '').trim()
      };
      
      const newCategory = await adminAPI.createCategory(createData);
      
      // Backend might return the created category or just a success response
      if (newCategory !== null) {
        await fetchCategories(); // Refresh the list
        setFormData({ name: '', description: '' });
        setIsAddingNew(false);
      }
    } catch (error) {
      console.error('Error creating category:', error);
      console.error('🚨 Full error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      // More specific error message based on response
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Invalid data provided';
        setError(`Bad Request: ${errorMessage}`);
      } else {
        setError('Failed to create category. Please try again.');
      }
    }
  };

  const handleUpdate = async (id) => {
    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setError(null);
      
      const updateData = {
        id: id, // Include the ID in the payload - backend requires this
        name: formData.name.trim(),
        description: (formData.description || '').trim()
      };
      
      const updatedCategory = await adminAPI.updateCategory(id, updateData);
      
      if (updatedCategory !== null) { // Backend returns 204 No Content for successful updates
        await fetchCategories(); // Refresh the list
        setEditingId(null);
        setFormData({ name: '', description: '' });
      }
    } catch (error) {
      console.error('Error updating category:', error);
      console.error('🚨 Full error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      // More specific error message based on response
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Invalid data provided';
        setError(`Bad Request: ${errorMessage}`);
      } else {
        setError('Failed to update category. Please try again.');
      }
    }
  };

  const handleDelete = async (id) => {
    // Find the category to get its details
    const category = categories.find(cat => cat.id === id);
    const categoryName = category?.name || 'this category';
    const postCount = category?.postCount || 0;
    
    // Enhanced confirmation message
    let confirmMessage = `Are you sure you want to delete "${categoryName}"?`;
    if (postCount > 0) {
      confirmMessage += `\n\nWarning: This category has ${postCount} post(s) associated with it. Deleting it may fail due to database constraints.`;
    }
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setError(null);
      await adminAPI.deleteCategory(id);
      await fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error deleting category:', error);
      
      // Handle specific foreign key constraint error
      if (error.response?.status === 500) {
        const errorData = error.response?.data || '';
        const errorMessage = error.message || '';
        
        // Check for foreign key constraint violations
        if ((typeof errorData === 'string' && errorData.includes('foreign key constraint')) ||
            (typeof errorData === 'string' && errorData.includes('FK_posts_categories')) ||
            errorMessage.includes('foreign key') || 
            errorMessage.includes('constraint') ||
            errorMessage.includes('violates foreign key')) {
          setError(`Cannot delete "${categoryName}" because it has posts associated with it. Please reassign or delete the posts first, then try again.`);
        } else {
          setError(`Failed to delete "${categoryName}". Server error occurred. Please try again.`);
        }
      } else if (error.response?.status === 400) {
        setError(`Cannot delete "${categoryName}". This category may be in use.`);
      } else {
        setError(`Failed to delete "${categoryName}". Please try again.`);
      }
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    // Ensure description is properly handled - could be null, undefined, or empty string
    const description = category.description || '';
    setFormData({ 
      name: category.name || '', 
      description: description 
    });
    setIsAddingNew(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setFormData({ name: '', description: '' });
    setError(null);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Categories Manager</h1>
              <p className="mt-2 text-gray-600">Manage article categories for your website</p>
            </div>
            <button
              onClick={() => {
                setIsAddingNew(true);
                setEditingId(null);
                setFormData({ name: '', description: '' });
                setError(null);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  {error.includes('posts associated') && (
                    <div className="mt-3 p-3 bg-red-100 rounded-md">
                      <h4 className="text-sm font-medium text-red-800 mb-2">💡 How to resolve this:</h4>
                      <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                        <li>Go to Posts management and reassign all posts from this category to another category</li>
                        <li>Or delete the posts that use this category</li>
                        <li>Then come back and delete this category</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Add New Category Form */}
        {isAddingNew && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Category</h2>
            <div className={`grid grid-cols-1 gap-4 ${DESCRIPTION_ENABLED ? 'sm:grid-cols-2' : ''}`}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Category Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Enter category name"
                />
              </div>
              {DESCRIPTION_ENABLED && (
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                    placeholder="Enter category description"
                  />
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={cancelEdit}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Category
              </button>
            </div>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Categories ({filteredCategories.length})
            </h2>
          </div>
          
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No categories found</div>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first category to get started'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    {DESCRIPTION_ENABLED && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                    )}
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingId === category.id ? (
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          />
                        ) : (
                          <div>
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          </div>
                        )}
                      </td>
                      {DESCRIPTION_ENABLED && (
                        <td className="px-6 py-4">
                          {editingId === category.id ? (
                            <input
                              type="text"
                              value={formData.description || ''}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
                              placeholder="Enter description"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">
                              {category.description && category.description.trim() !== '' 
                                ? category.description 
                                : <span className="text-gray-400 italic">No description</span>
                              }
                            </div>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingId === category.id ? (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleUpdate(category.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => startEdit(category)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesManager;
