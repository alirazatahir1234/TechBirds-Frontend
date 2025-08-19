import React, { useState } from 'react';
import { FileText, Eye, Save, Loader2 } from 'lucide-react';

const PageForm = ({ initialData, onSave, loading, error }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');

  const handleContentChange = (e) => setContent(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, slug, content, status });
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6 gap-2">
          <FileText className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-bold">{initialData ? 'Edit Page' : 'Add New Page'}</h2>
        </div>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Title</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter page title"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Slug</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="page-slug"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Content</label>
            {/* Replace with a real rich text editor for production */}
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 h-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={content}
              onChange={handleContentChange}
              placeholder="Write your page content here..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Status</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              <Save className="w-5 h-5" />
              {initialData ? 'Update Page' : 'Publish Page'}
            </button>
            <button
              type="button"
              className="flex items-center gap-2 bg-gray-200 text-gray-700 px-5 py-2 rounded hover:bg-gray-300"
              onClick={() => setStatus('draft')}
            >
              <Save className="w-5 h-5" />
              Save Draft
            </button>
            <button
              type="button"
              className="flex items-center gap-2 bg-green-200 text-green-700 px-5 py-2 rounded hover:bg-green-300"
              onClick={() => window.open(`/pages/preview/${slug || 'new'}`, '_blank')}
            >
              <Eye className="w-5 h-5" />
              Preview
            </button>
          </div>
          {loading && (
            <div className="flex items-center gap-2 mt-4 text-blue-500">
              <Loader2 className="animate-spin w-5 h-5" />
              Saving...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PageForm;
