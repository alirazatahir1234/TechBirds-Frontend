import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pagesAPI } from '../../../services/api';
import { Save, ArrowLeft } from 'lucide-react';

const initial = {
  title: '',
  content: '',
  excerpt: '',
  status: 'draft',
  parentId: null,
  menuOrder: 0,
  template: null,
  featuredMediaId: null,
  seoTitle: '',
  seoDescription: '',
  metaJson: '',
  slug: '',
  changeSummary: '',
};

export default function PageForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!isEdit) return;
      try {
        const data = await pagesAPI.getById(id);
        setForm({
          title: data.title || '',
          content: data.content || '',
          excerpt: data.excerpt || '',
          status: data.status || 'draft',
          parentId: data.parentId ?? null,
          menuOrder: data.menuOrder ?? 0,
          template: data.template ?? null,
          featuredMediaId: data.featuredMediaId ?? null,
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
          metaJson: data.metaJson || '',
          slug: data.slug || '',
          changeSummary: '',
        });
      } catch (e) {
        setError(e?.response?.data?.message || e.message || 'Failed to load page');
      }
    };
    load();
  }, [id, isEdit]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form };
      if (payload.metaJson) {
        try { payload.metaJson = JSON.parse(payload.metaJson); } catch { /* keep as string */ }
      }
      if (isEdit) await pagesAPI.update(id, payload);
      else await pagesAPI.create(payload);
      navigate('/admin/pages');
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Page' : 'Create Page'}</h1>
        <button onClick={() => navigate(-1)} className="inline-flex items-center px-3 py-2 border rounded-md"><ArrowLeft className="w-4 h-4 mr-2" /> Back</button>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>}

      <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Content</label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="w-full border rounded px-3 py-2" rows={12} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Excerpt</label>
            <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} className="w-full border rounded px-3 py-2" rows={3} />
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full border rounded px-3 py-2">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Slug (optional)</label>
            <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Parent Id</label>
              <input type="number" value={form.parentId ?? ''} onChange={e => setForm(f => ({ ...f, parentId: e.target.value ? Number(e.target.value) : null }))} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Menu Order</label>
              <input type="number" value={form.menuOrder ?? 0} onChange={e => setForm(f => ({ ...f, menuOrder: Number(e.target.value) }))} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Template</label>
            <input value={form.template ?? ''} onChange={e => setForm(f => ({ ...f, template: e.target.value || null }))} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Featured Media Id</label>
            <input value={form.featuredMediaId ?? ''} onChange={e => setForm(f => ({ ...f, featuredMediaId: e.target.value || null }))} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">SEO Title</label>
            <input value={form.seoTitle} onChange={e => setForm(f => ({ ...f, seoTitle: e.target.value }))} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">SEO Description</label>
            <textarea value={form.seoDescription} onChange={e => setForm(f => ({ ...f, seoDescription: e.target.value }))} className="w-full border rounded px-3 py-2" rows={3} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Meta JSON</label>
            <textarea value={form.metaJson} onChange={e => setForm(f => ({ ...f, metaJson: e.target.value }))} className="w-full border rounded px-3 py-2" rows={4} placeholder='{"key":"value"}' />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Change Summary</label>
            <input value={form.changeSummary} onChange={e => setForm(f => ({ ...f, changeSummary: e.target.value }))} className="w-full border rounded px-3 py-2" placeholder="Describe your change" />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={loading} className="inline-flex items-center px-3 py-2 rounded-md text-white bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" /> {loading ? 'Saving...' : 'Save Page'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
