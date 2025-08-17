import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { pagesAPI } from '../../../services/api';
import { PlusCircle, Search, Edit2, Trash, Trash2, RefreshCw } from 'lucide-react';

const defaultFilters = {
  page: 1,
  limit: 20,
  search: '',
  status: '', // draft|published|private
  parentId: '',
  sortBy: 'created', // created|updated|title|menu
  sortOrder: 'desc',
};

export default function PagesList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(defaultFilters);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await pagesAPI.list(filters);
      if (Array.isArray(res)) {
        setItems(res);
        setMeta({ page: filters.page, limit: filters.limit, total: res.length, totalPages: 1 });
      } else {
        const items = res.items || res.pages || res.data || [];
        const pagination = res.pagination || { page: filters.page, limit: filters.limit, total: res.total || items.length, totalPages: res.totalPages || 1 };
        setItems(items);
        setMeta(pagination);
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filters.page, filters.limit, filters.search, filters.status, filters.parentId, filters.sortBy, filters.sortOrder]);

  const changePage = (delta) => setFilters(f => ({ ...f, page: Math.max(1, f.page + delta) }));
  const onSearch = (e) => setFilters(f => ({ ...f, page: 1, search: e.target.value }));

  const doSoftDelete = async (id) => {
    if (!confirm('Move this page to Trash?')) return;
    try { setLoading(true); await pagesAPI.softDelete(id); await load(); } catch (e) { setError(e?.response?.data?.message || e.message); } finally { setLoading(false); }
  };
  const doHardDelete = async (id) => {
    if (!confirm('Permanently delete this page? This cannot be undone.')) return;
    try { setLoading(true); await pagesAPI.hardDelete(id); await load(); } catch (e) { setError(e?.response?.data?.message || e.message); } finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pages</h1>
        <Link to="/admin/pages/create" className="inline-flex items-center px-3 py-2 rounded-md text-white bg-green-600 hover:bg-green-700">
          <PlusCircle className="w-4 h-4 mr-2" /> New Page
        </Link>
      </div>

      <div className="bg-white p-4 rounded-md border">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input value={filters.search} onChange={onSearch} placeholder="Search title or slug..." className="w-full pl-9 pr-3 py-2 border rounded-md" />
          </div>
          <select value={filters.status} onChange={e => setFilters(f => ({ ...f, page: 1, status: e.target.value }))} className="border rounded-md px-3 py-2">
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="private">Private</option>
          </select>
          <select value={filters.sortBy} onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))} className="border rounded-md px-3 py-2">
            <option value="created">Sort: Created</option>
            <option value="updated">Sort: Updated</option>
            <option value="title">Sort: Title</option>
            <option value="menu">Sort: Menu</option>
          </select>
          <select value={filters.sortOrder} onChange={e => setFilters(f => ({ ...f, sortOrder: e.target.value }))} className="border rounded-md px-3 py-2">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
          <div className="flex items-center gap-2">
            <button onClick={load} className="inline-flex items-center px-3 py-2 border rounded-md bg-white hover:bg-gray-50">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded">{error}</div>}

      <div className="bg-white border rounded-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="text-left px-4 py-2">Title</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Slug</th>
              <th className="text-left px-4 py-2">Updated</th>
              <th className="text-right px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-2">
                  <Link to={`/admin/pages/${p.id}/edit`} className="text-green-700 hover:underline font-medium">{p.title}</Link>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{p.status}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{p.slug}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{new Date(p.updatedAt || p.createdAt || Date.now()).toLocaleString()}</td>
                <td className="px-4 py-2 text-right space-x-2">
                  <Link to={`/admin/pages/${p.id}/edit`} className="inline-flex items-center px-2 py-1 border rounded text-sm"><Edit2 className="w-4 h-4 mr-1" /> Edit</Link>
                  <button onClick={() => doSoftDelete(p.id)} className="inline-flex items-center px-2 py-1 border rounded text-sm"><Trash className="w-4 h-4 mr-1" /> Trash</button>
                  <button onClick={() => doHardDelete(p.id)} className="inline-flex items-center px-2 py-1 border rounded text-sm text-red-600"><Trash2 className="w-4 h-4 mr-1" /> Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !loading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No pages found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">Page {meta.page} / {meta.totalPages} • Total {meta.total}</div>
        <div className="space-x-2">
          <button disabled={filters.page <= 1} onClick={() => changePage(-1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          <button onClick={() => changePage(1)} className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
