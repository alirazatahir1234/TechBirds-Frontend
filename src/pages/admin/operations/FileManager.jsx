import React, { useState, useEffect } from 'react';
import { 
  FolderOpen, 
  Upload, 
  Search, 
  Grid3X3, 
  List, 
  Image, 
  FileText, 
  Film, 
  Music, 
  Archive,
  Download,
  Trash2,
  Edit3,
  Eye,
  MoreHorizontal,
  Plus,
  Filter,
  ArrowUpDown,
  Calendar,
  HardDrive
} from 'lucide-react';

// This component has been deprecated. Media Library replaces File Manager.
export default function FileManager() {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFolders([
        { id: 1, name: 'images', type: 'folder', size: null, created: '2024-07-15', items: 45 },
        { id: 2, name: 'documents', type: 'folder', size: null, created: '2024-07-10', items: 23 },
        { id: 3, name: 'videos', type: 'folder', size: null, created: '2024-07-05', items: 12 },
        { id: 4, name: 'uploads', type: 'folder', size: null, created: '2024-08-01', items: 67 }
      ]);

      setFiles([
        { id: 5, name: 'article-hero-ai.jpg', type: 'image', size: '2.3 MB', created: '2024-08-04', url: '/uploads/article-hero-ai.jpg' },
        { id: 6, name: 'tech-trends-2024.pdf', type: 'document', size: '1.8 MB', created: '2024-08-03', url: '/uploads/tech-trends-2024.pdf' },
        { id: 7, name: 'demo-video.mp4', type: 'video', size: '15.2 MB', created: '2024-08-02', url: '/uploads/demo-video.mp4' },
        { id: 8, name: 'logo-techbirds.png', type: 'image', size: '156 KB', created: '2024-08-01', url: '/uploads/logo-techbirds.png' },
        { id: 9, name: 'backup-20240804.zip', type: 'archive', size: '45.7 MB', created: '2024-08-04', url: '/uploads/backup-20240804.zip' },
        { id: 10, name: 'presentation.pptx', type: 'document', size: '3.2 MB', created: '2024-07-30', url: '/uploads/presentation.pptx' },
        { id: 11, name: 'screenshot-dashboard.png', type: 'image', size: '890 KB', created: '2024-07-28', url: '/uploads/screenshot-dashboard.png' },
        { id: 12, name: 'audio-podcast.mp3', type: 'audio', size: '12.4 MB', created: '2024-07-25', url: '/uploads/audio-podcast.mp3' }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [currentPath]);

  const allItems = [...folders, ...files];

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'folder' && item.type === 'folder') ||
                         (filterType === 'image' && item.type === 'image') ||
                         (filterType === 'document' && item.type === 'document') ||
                         (filterType === 'video' && item.type === 'video') ||
                         (filterType === 'audio' && item.type === 'audio') ||
                         (filterType === 'archive' && item.type === 'archive');
    return matchesSearch && matchesFilter;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'date') return new Date(b.created) - new Date(a.created);
    if (sortBy === 'size') {
      if (!a.size && !b.size) return 0;
      if (!a.size) return -1;
      if (!b.size) return 1;
      return parseFloat(b.size) - parseFloat(a.size);
    }
    return 0;
  });

  const getFileIcon = (type) => {
    switch (type) {
      case 'folder': return FolderOpen;
      case 'image': return Image;
      case 'document': return FileText;
      case 'video': return Film;
      case 'audio': return Music;
      case 'archive': return Archive;
      default: return FileText;
    }
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'folder': return 'text-blue-600 bg-blue-100';
      case 'image': return 'text-green-600 bg-green-100';
      case 'document': return 'text-red-600 bg-red-100';
      case 'video': return 'text-purple-600 bg-purple-100';
      case 'audio': return 'text-orange-600 bg-orange-100';
      case 'archive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleItemSelect = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === sortedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedItems.map(item => item.id));
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress(null), 1000);
          alert(`${files.length} file(s) uploaded successfully!`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    
    if (confirm(`Delete ${selectedItems.length} selected item(s)?`)) {
      setFiles(prev => prev.filter(file => !selectedItems.includes(file.id)));
      setFolders(prev => prev.filter(folder => !selectedItems.includes(folder.id)));
      setSelectedItems([]);
      alert(`${selectedItems.length} item(s) deleted successfully!`);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
          <p className="mt-2 text-gray-600">
            Manage your website assets and uploaded files.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer transition-colors">
            <Upload className="h-4 w-4" />
            Upload Files
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar"
            />
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadProgress !== null && (
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Uploading files...</span>
            <span className="text-sm text-gray-500">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-200" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <FolderOpen className="h-4 w-4" />
        <span>Home</span>
        {currentPath !== '/' && (
          <>
            <span>/</span>
            <span className="text-gray-900 font-medium">{currentPath.slice(1)}</span>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Left controls */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files and folders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="folder">Folders</option>
                <option value="image">Images</option>
                <option value="document">Documents</option>
                <option value="video">Videos</option>
                <option value="audio">Audio</option>
                <option value="archive">Archives</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="date">Sort by Date</option>
                <option value="size">Sort by Size</option>
              </select>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete ({selectedItems.length})
              </button>
            )}

            <div className="flex items-center bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Select All */}
        {sortedItems.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedItems.length === sortedItems.length}
                onChange={handleSelectAll}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-600">
                Select all {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''}
              </span>
            </label>
          </div>
        )}
      </div>

      {/* File Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sortedItems.map((item) => {
            const Icon = getFileIcon(item.type);
            const colorClass = getFileTypeColor(item.type);
            
            return (
              <div 
                key={item.id} 
                className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleItemSelect(item.id)}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleItemSelect(item.id)}
                    className="absolute top-0 right-0 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${colorClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.type === 'folder' ? `${item.items} items` : item.size}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(item.created).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === sortedItems.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedItems.map((item) => {
                const Icon = getFileIcon(item.type);
                const colorClass = getFileTypeColor(item.type);
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleItemSelect(item.id)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center ${colorClass}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.type === 'folder' ? `${item.items} items` : item.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.created).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        {item.type !== 'folder' && (
                          <button className="text-green-600 hover:text-green-700">
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-700">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-700">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {sortedItems.length === 0 && (
        <div className="text-center py-12">
          <HardDrive className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No files found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || filterType !== 'all' 
              ? 'No files match your current filters.' 
              : 'Get started by uploading your first file.'
            }
          </p>
        </div>
      )}

      {/* Storage Info */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HardDrive className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Storage Usage</p>
              <p className="text-xs text-gray-500">2.4 GB of 10 GB used</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '24%' }}></div>
            </div>
            <span className="text-sm text-gray-600">24%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
