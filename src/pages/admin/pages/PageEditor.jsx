import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageService from '../../../services/PageService';
import { ArrowLeft, Save, FileText, Tag } from 'lucide-react';

const defaultPage = {
  title: '',
  content: '',
  status: 'draft',
  seoTitle: '',
  seoDescription: '',
  template: 'default'
};

const PageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(defaultPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      PageService.getPage(id)
        .then(data => setPage(data))
        .catch(() => setError('Failed to load page'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setPage(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (id) {
        await PageService.updatePage(id, page);
      } else {
        await PageService.createPage(page);
      }
      navigate('/admin/pages');
    } catch {
      setError('Failed to save page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-gray-600 hover:text-gray-900">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </button>
      <h2 className="text-2xl font-bold mb-6">{id ? 'Edit Page' : 'Add New Page'}</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <label className="block font-medium mb-1">Title</label>
        <input name="title" value={page.title} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Content</label>
        <textarea name="content" value={page.content} onChange={handleChange} rows={10} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Status</label>
        <select name="status" value={page.status} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">SEO Title</label>
        <input name="seoTitle" value={page.seoTitle} onChange={handleChange} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">SEO Description</label>
        <textarea name="seoDescription" value={page.seoDescription} onChange={handleChange} rows={2} className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Template</label>
        <select name="template" value={page.template} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="default">Default</option>
          <option value="landing">Landing</option>
          <option value="contact">Contact</option>
        </select>
      </div>
      <button onClick={handleSave} disabled={loading} className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center">
        <Save className="mr-2 h-4 w-4" /> Save Page
      </button>
    </div>
  );
};

export default PageEditor;
