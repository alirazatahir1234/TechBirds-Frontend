
import React, { useState, useEffect } from 'react';
import { FileText, PlusCircle, Edit3, Trash2, Filter, ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageService from '../../../services/PageService';

const PagesList = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [filter, setFilter] = useState('all');

  React.useEffect(() => {
    const fetchPages = async () => {
      setLoading(true);
      try {
        const data = await PageService.getPages({ search, filter });
        setPages(data.pages || []);
        setError(null);
      } catch (err) {
        setError('Failed to fetch pages');
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, [search, filter]);

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    setLoading(true);
    try {
      await PageService.bulkDelete(selected);
      setPages(pages.filter(page => !selected.includes(page.id)));
      setSelected([]);
    } catch {
      setError('Bulk delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-7 h-7 text-blue-600" />
        <h2 className="text-2xl font-bold">All Pages</h2>
        <Link to="/admin/pages/create" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Page
        </Link>
      </div>
      <div className="flex items-center mb-4 gap-2">
        <div className="relative w-64">
          <input
            type="text"
            className="w-full pl-10 pr-3 py-2 border rounded-md"
            placeholder="Search pages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400"><Search className="h-4 w-4" /></span>
        </div>
        <button className="flex items-center px-3 py-2 border rounded-md" onClick={() => setFilter(filter === 'all' ? 'published' : 'all')}>
          <Filter className="mr-2 h-4 w-4" />
          {filter === 'all' ? 'All' : 'Published'}
          <ChevronDown className="ml-2 h-3 w-3" />
        </button>
        <button
          className="ml-auto px-4 py-2 bg-red-600 text-white rounded-md disabled:opacity-50"
          disabled={selected.length === 0}
          onClick={handleBulkDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Bulk Delete
        </button>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr>
              <th className="px-4 py-2"><input type="checkbox" checked={selected.length === pages.length && pages.length > 0} onChange={e => setSelected(e.target.checked ? pages.map(p => p.id) : [])} /></th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Last Updated</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(page => (
              <tr key={page.id} className="border-t">
                <td className="px-4 py-2"><input type="checkbox" checked={selected.includes(page.id)} onChange={e => setSelected(e.target.checked ? [...selected, page.id] : selected.filter(id => id !== page.id))} /></td>
                <td className="px-4 py-2">{page.title}</td>
                <td className="px-4 py-2">{page.status}</td>
                <td className="px-4 py-2">{new Date(page.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Link to={`/admin/pages/edit/${page.id}`} className="text-blue-600 hover:underline"><Edit3 className="h-4 w-4" /></Link>
                  <button className="text-red-600" onClick={() => PageService.deletePage(page.id)}><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PagesList;
