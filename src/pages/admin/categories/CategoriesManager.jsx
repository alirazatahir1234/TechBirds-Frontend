import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, Save, X, Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react';
import { adminAPI } from '../../../services/api';
import * as XLSX from 'xlsx';

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  
  // Excel import states and refs
  const [bulkImporting, setBulkImporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showExcelDropdown, setShowExcelDropdown] = useState(false);
  
  // Excel import ref
  const fileInputRef = useRef(null);
  
  // Description functionality now enabled - backend has been fixed
  const DESCRIPTION_ENABLED = true;

  useEffect(() => {
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExcelDropdown && !event.target.closest('.excel-dropdown-container')) {
        setShowExcelDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExcelDropdown]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categories = await adminAPI.getCategories();
      setCategories(categories || []);
    } catch (error) {
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

  // Excel template download
  const downloadExcelTemplate = () => {
    const templateData = [
      { Name: 'Technology', Description: 'Latest tech news and innovations' },
      { Name: 'Business', Description: 'Business insights and market trends' },
      { Name: 'Health', Description: 'Health and wellness articles' },
      { Name: 'Sports', Description: 'Sports news and updates' },
      { Name: 'Entertainment', Description: 'Entertainment and celebrity news' }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 20 }, // Name column
      { wch: 40 }  // Description column
    ];
    
    // Add header styling (basic)
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "CCCCCC" } }
      };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories Template');
    
    // Download the file
    XLSX.writeFile(workbook, 'categories_template.xlsx');
  };

  // Excel file import
  const handleExcelImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setBulkImporting(true);
    setError(null);
    setSuccessMessage('');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          setError('The Excel file appears to be empty or has no valid data');
          setBulkImporting(false);
          return;
        }

        // Map the data to our category format
        const categoriesToImport = jsonData.map((row, index) => {
          // Support multiple column name formats
          const name = row.Name || row.name || row.CATEGORY || row.Category || 
                      row['Category Name'] || row['category name'] || '';
          const description = row.Description || row.description || row.DESC || 
                            row.Desc || row['Category Description'] || 
                            row['category description'] || '';

          if (!name || !name.toString().trim()) {
            throw new Error(`Row ${index + 2} is missing a category name`);
          }

          return {
            name: name.toString().trim(),
            description: description ? description.toString().trim() : ''
          };
        });

        // Call the API - ensure data format matches backend expectation
        const result = await adminAPI.bulkImportCategories(categoriesToImport);
        
        // Success
        setSuccessMessage(`Successfully imported ${categoriesToImport.length} categories from Excel file!`);
        
        // Refresh the categories list
        await fetchCategories();
        
      } catch (error) {
        
        let errorMessage = 'Failed to import Excel file.';
        if (error.response?.status === 403) {
          errorMessage = 'Access denied (403). Please check your authentication or admin permissions.';
        } else if (error.message.includes('Row')) {
          errorMessage = error.message;
        } else if (error.response?.status === 400) {
          const errorData = error.response?.data?.message || error.response?.data?.error || 'Invalid data provided';
          errorMessage = `Bad Request: ${errorData}`;
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        if (error.response?.status === 403) {
          setError('Access denied (403). Please check your authentication or admin permissions.');
        }
        
        setError(errorMessage);
      } finally {
        setBulkImporting(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Export current categories to Excel
  const exportCategoriesToExcel = () => {
    if (categories.length === 0) {
      setError('No categories to export');
      return;
    }

    const exportData = categories.map(category => ({
      Name: category.name,
      Description: category.description || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    worksheet['!cols'] = [
      { wch: 20 }, // Name column
      { wch: 40 }  // Description column
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');
    
    const fileName = `categories_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    setSuccessMessage(`Exported ${categories.length} categories to ${fileName}`);
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
            <div className="flex space-x-3">
              {/* Excel Operations Dropdown */}
              <div className="relative excel-dropdown-container">
                <button
                  onClick={() => setShowExcelDropdown(!showExcelDropdown)}
                  className="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel Operations
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
                
                {showExcelDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => {
                          downloadExcelTemplate();
                          setShowExcelDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <Download className="h-4 w-4 mr-3 text-green-500" />
                        Download Template
                      </button>
                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                          setShowExcelDropdown(false);
                        }}
                        disabled={bulkImporting}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        role="menuitem"
                      >
                        {bulkImporting ? (
                          <>
                            <div className="animate-spin h-4 w-4 mr-3 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                            Importing...
                          </>
                        ) : (
                          <>
                            <FileSpreadsheet className="h-4 w-4 mr-3 text-blue-500" />
                            Import from Excel
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          exportCategoriesToExcel();
                          setShowExcelDropdown(false);
                        }}
                        disabled={categories.length === 0}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                        role="menuitem"
                      >
                        <Download className="h-4 w-4 mr-3 text-purple-500" />
                        Export to Excel
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Add Category Button */}
              <button
                onClick={() => {
                  setIsAddingNew(true);
                  setEditingId(null);
                  setFormData({ name: '', description: '' });
                  setError(null);
                  setSuccessMessage('');
                  setShowExcelDropdown(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>
          
          {/* Hidden file input for Excel import */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleExcelImport}
            style={{ display: 'none' }}
          />
        </div>



        {/* Success Message */}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>{successMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Success</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>{successMessage}</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
