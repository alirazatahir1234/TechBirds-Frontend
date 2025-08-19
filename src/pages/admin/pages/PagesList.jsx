import React, { useState } from 'react';
import { Pencil, Trash2, FileText, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const defaultSorts = [
  { value: 'title', label: 'Title' },
  { value: 'date', label: 'Date' },
  { value: 'status', label: 'Status' },
];

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
];

const PagesList = ({ pages, onEdit, onDelete, loading, error }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const pageSize = 10;

  // Filter, sort, and paginate
  let filtered = pages || [];
  if (search) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.slug && p.slug.toLowerCase().includes(search.toLowerCase()))
    );
  }
  if (status) {
    filtered = filtered.filter(p => p.status === status);
  }
  filtered = filtered.sort((a, b) => {
    if (sort === 'title') {
      return sortOrder === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    if (sort === 'date') {
      const da = new Date(a.date || a.updatedAt || a.createdAt || 0);
      const db = new Date(b.date || b.updatedAt || b.createdAt || 0);
      return sortOrder === 'asc' ? da - db : db - da;
    }
    if (sort === 'status') {
      return sortOrder === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Bulk actions
  const toggleSelect = id => {
    setSelected(sel => sel.includes(id) ? sel.filter(i => i !== id) : [...sel, id]);
  };
  const selectAll = () => {
    setSelected(paged.map(p => p.id));
  };
  const clearSelected = () => setSelected([]);
  const bulkDelete = () => {
    if (window.confirm('Delete selected pages?')) {
      selected.forEach(id => onDelete({ id }));
      clearSelected();
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="w-7 h-7 text-blue-600" />
        <h2 className="text-2xl font-bold">Pages</h2>
      </div>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            className="pl-9 pr-3 py-2 border rounded-md w-64"
            placeholder="Search title or slug..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select
          className="border rounded-md px-3 py-2"
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          className="border rounded-md px-3 py-2"
          value={sort}
          onChange={e => setSort(e.target.value)}
        >
          {defaultSorts.map(opt => (
            <option key={opt.value} value={opt.value}>Sort: {opt.label}</option>
          ))}
        </select>
        <select
          className="border rounded-md px-3 py-2"
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <button
          className="px-3 py-2 border rounded-md bg-gray-100 hover:bg-gray-200"
          onClick={selectAll}
          disabled={paged.length === 0}
        >Select All</button>
        <button
          className="px-3 py-2 border rounded-md bg-gray-100 hover:bg-gray-200"
          onClick={clearSelected}
          disabled={selected.length === 0}
        >Clear</button>
        <button
          className="px-3 py-2 border rounded-md bg-red-600 text-white hover:bg-red-700"
          onClick={bulkDelete}
          disabled={selected.length === 0}
        >Delete Selected</button>
      </div>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {loading ? (
        <div className="text-blue-500">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">
                  <input
                    type="checkbox"
                    checked={paged.length > 0 && paged.every(p => selected.includes(p.id))}
                    onChange={e => e.target.checked ? selectAll() : clearSelected()}
                  />
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Title</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Author</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length > 0 ? (
                paged.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selected.includes(item.id)}
                        onChange={() => toggleSelect(item.id)}
                      />
                    </td>
                    <td className="px-4 py-2 font-medium">{item.title}</td>
                    <td className="px-4 py-2">{item.author || '-'}</td>
                    <td className="px-4 py-2">{item.date ? new Date(item.date).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="p-2 rounded hover:bg-blue-100"
                        title="Edit"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        className="p-2 rounded hover:bg-red-100"
                        title="Delete"
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No pages found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">Page {page} / {totalPages} • Total {filtered.length}</div>
        <div className="space-x-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50 flex items-center gap-1"
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <button
            className="px-3 py-1 border rounded flex items-center gap-1"
            disabled={page >= totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PagesList;
