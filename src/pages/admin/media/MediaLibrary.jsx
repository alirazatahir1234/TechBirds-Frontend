import React, { useEffect, useMemo, useRef, useState } from 'react';
import { mediaAPI } from '../../../services/api';
import { Upload, Search, Image as ImageIcon, FileText, Music, Trash2, Trash, Edit2, RefreshCw, Grid, List, X, Info } from 'lucide-react';

const mimeToIcon = (mime) => {
  if (!mime) return FileText;
  if (mime.startsWith('image/')) return ImageIcon;
  if (mime.startsWith('audio/')) return Music;
  return FileText;
};

const humanFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  const thresh = 1024;
  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }
  const units = ['KB', 'MB', 'GB', 'TB'];
  let u = -1;
  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(1) + ' ' + units[u];
};

const defaultFilters = { page: 1, limit: 24, search: '', mimeType: '', sortBy: 'created', sortOrder: 'desc' };

export default function MediaLibrary() {
  const [filters, setFilters] = useState(defaultFilters);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 24, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('grid');
  const [selected, setSelected] = useState(null);
  const fileInputRef = useRef(null);

  const fetchMedia = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await mediaAPI.list(filters);
      // Support various shapes: array or {items, pagination}
      if (Array.isArray(res)) {
        setItems(res);
        setPagination({ page: filters.page, limit: filters.limit, total: res.length });
      } else {
        setItems(res.items || res.media || res.data || []);
        setPagination(res.pagination || { page: filters.page, limit: filters.limit, total: res.total || (res.items?.length || 0) });
      }
    } catch (e) {
      console.error('Failed to fetch media', e);
      setError(e?.response?.data?.message || e.message || 'Failed to fetch media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedia(); }, [filters.page, filters.limit, filters.mimeType, filters.search, filters.sortBy, filters.sortOrder]);

  const onUploadClick = () => fileInputRef.current?.click();

  const onFilesSelected = async (ev) => {
    const file = ev.target.files?.[0];
    if (!file) return;
    
 
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      
      const result = await mediaAPI.upload({ 
        file, 
        title: file.name, 
        altText: file.name, 
        caption: '', 
        description: '' 
      });
     
      // Reset input to allow re-uploading same file
      ev.target.value = '';
      await fetchMedia();
      
    } catch (e) {
      console.error('Upload failed - Full error:', e);
      console.error('Error response:', e.response?.data);
      console.error('Error status:', e.response?.status);
      
      let errorMessage = 'Upload failed';
      
      if (e.response?.status === 405) {
        errorMessage = 'Upload endpoint not supported. The backend may not have media upload functionality implemented.';
      } else if (e.response?.status === 400) {
        const backendMessage = e.response?.data?.message || e.response?.data?.error || JSON.stringify(e.response?.data);
        errorMessage = `Bad request: ${backendMessage}. The backend expects different data format.`;
      } else if (e.response?.status === 413) {
        errorMessage = 'File too large. Please select a smaller file.';
      } else if (e.response?.status === 415) {
        errorMessage = 'Unsupported file type. Please select a valid image file.';
      } else if (e.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (e.response?.status === 403) {
        errorMessage = 'Permission denied. You may not have permission to upload files.';
      } else if (e.response?.data?.message) {
        errorMessage = e.response.data.message;
      } else if (e.message) {
        errorMessage = e.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const doUpdateMetadata = async (id, data) => {
    try {
      setLoading(true);
      await mediaAPI.updateMetadata(id, data);
      await fetchMedia();
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const doSoftDelete = async (id) => {
    if (!confirm('Move this media to Trash?')) return;
    try {
      setLoading(true);
      await mediaAPI.softDelete(id);
      await fetchMedia();
      if (selected?.id === id) setSelected(null);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const doHardDelete = async (id) => {
    if (!confirm('Permanently delete this media? This cannot be undone.')) return;
    try {
      setLoading(true);
      await mediaAPI.hardDelete(id);
      await fetchMedia();
      if (selected?.id === id) setSelected(null);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = (e) => {
    setFilters((f) => ({ ...f, page: 1, search: e.target.value }));
  };

  const onMimeFilter = (e) => setFilters((f) => ({ ...f, page: 1, mimeType: e.target.value }));
  const onSortBy = (e) => setFilters((f) => ({ ...f, sortBy: e.target.value }));
  const onSortOrder = (e) => setFilters((f) => ({ ...f, sortOrder: e.target.value }));

  const changePage = (delta) => setFilters((f) => ({ ...f, page: Math.max(1, f.page + delta) }));

  const renderCard = (m) => {
    const Icon = mimeToIcon(m.mimeType);
    const isImage = (m.mimeType || '').startsWith('image/');
    const thumb = mediaAPI.thumbnailUrl(m.id, m);
    const url = isImage && m.mimeType === 'image/svg+xml' ? mediaAPI.absoluteUrl(m.url) : mediaAPI.fileUrl(m.id);

    return (
      <div key={m.id} className={`border rounded-lg p-3 bg-white hover:shadow-md transition relative ${selected?.id === m.id ? 'ring-2 ring-green-500' : ''}`}
           onClick={() => setSelected(m)}>
        <div className="aspect-square bg-gray-50 rounded flex items-center justify-center overflow-hidden">
          {isImage ? (
            <img src={thumb} alt={m.altText || m.title || ''} className="object-cover w-full h-full" loading="lazy" />
          ) : (
            <Icon className="w-10 h-10 text-gray-400" />
          )}
        </div>
        <div className="mt-2">
          <div className="text-sm font-medium truncate" title={m.title || m.fileName}>{m.title || m.fileName || 'Untitled'}</div>
          <div className="text-xs text-gray-500 truncate" title={m.mimeType}>{m.mimeType}</div>
          <div className="text-xs text-gray-400">{humanFileSize(m.size)}</div>
        </div>
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 hover:opacity-100 transition">
          <button title="Edit metadata" className="p-1 rounded bg-white border hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); setSelected(m); }}>
            <Edit2 className="w-4 h-4" />
          </button>
          <button title="Trash" className="p-1 rounded bg-white border hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); doSoftDelete(m.id); }}>
            <Trash className="w-4 h-4 text-yellow-600" />
          </button>
          <button title="Delete permanently" className="p-1 rounded bg-white border hover:bg-gray-50" onClick={(e) => { e.stopPropagation(); doHardDelete(m.id); }}>
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <div className="flex items-center gap-2">
          <button className={`px-3 py-2 border rounded-md ${view === 'grid' ? 'bg-green-600 text-white' : 'bg-white'}`} onClick={() => setView('grid')}><Grid className="w-4 h-4" /></button>
          <button className={`px-3 py-2 border rounded-md ${view === 'list' ? 'bg-green-600 text-white' : 'bg-white'}`} onClick={() => setView('list')}><List className="w-4 h-4" /></button>
          <button onClick={fetchMedia} className="inline-flex items-center px-3 py-2 border rounded-md bg-white hover:bg-gray-50">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button onClick={onUploadClick} className="inline-flex items-center px-3 py-2 border rounded-md text-white bg-green-600 hover:bg-green-700">
            <Upload className="w-4 h-4 mr-2" /> Upload
          </button>
          <input ref={fileInputRef} type="file" accept="image/*,application/pdf,video/*,audio/*,.zip" className="hidden" onChange={onFilesSelected} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-md border mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input type="text" value={filters.search} onChange={onSearch} placeholder="Search title, alt, caption..." className="w-full pl-9 pr-3 py-2 border rounded-md" />
          </div>
          <select value={filters.mimeType} onChange={onMimeFilter} className="border rounded-md px-3 py-2">
            <option value="">All Types</option>
            <option value="image/">Images</option>
            <option value="video/">Videos</option>
            <option value="audio/">Audio</option>
            <option value="application/pdf">PDF</option>
            <option value="application/zip">ZIP</option>
          </select>
          <select value={filters.sortBy} onChange={onSortBy} className="border rounded-md px-3 py-2">
            <option value="created">Created</option>
            <option value="title">Title</option>
          </select>
          <select value={filters.sortOrder} onChange={onSortOrder} className="border rounded-md px-3 py-2">
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {loading && (
        <div className="mb-4 p-3 rounded border bg-white inline-flex items-center"><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Loading...</div>
      )}

      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map(renderCard)}
          {items.length === 0 && !loading && (
            <div className="col-span-full text-center text-gray-500 py-12">No media found</div>
          )}
        </div>
      ) : (
        <div className="bg-white border rounded-md divide-y">
          <div className="grid grid-cols-12 text-xs text-gray-500 px-3 py-2">
            <div className="col-span-5">File</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>
          {items.map((m) => {
            const Icon = mimeToIcon(m.mimeType);
            const thumb = mediaAPI.thumbnailUrl(m.id, m);
            const fileUrl = mediaAPI.fileUrl(m.id);
            return (
              <div key={m.id} className="grid grid-cols-12 items-center px-3 py-2 text-sm">
                <div className="col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                    {m.mimeType?.startsWith('image/') ? (
                      <img src={thumb} alt={m.altText || m.title || ''} className="object-cover w-full h-full" loading="lazy" />
                    ) : (
                      <Icon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="truncate">
                    <div className="font-medium truncate" title={m.title || m.fileName}>{m.title || m.fileName || 'Untitled'}</div>
                    <div className="text-xs text-gray-500 truncate" title={fileUrl}>{fileUrl}</div>
                  </div>
                </div>
                <div className="col-span-2 text-gray-500 truncate">{m.mimeType}</div>
                <div className="col-span-2 text-gray-500">{humanFileSize(m.size)}</div>
                <div className="col-span-3 text-right space-x-2">
                  <button className="px-2 py-1 border rounded" onClick={() => setSelected(m)}>Edit</button>
                  <button className="px-2 py-1 border rounded" onClick={() => doSoftDelete(m.id)}>Trash</button>
                  <button className="px-2 py-1 border rounded text-red-600" onClick={() => doHardDelete(m.id)}>Delete</button>
                </div>
              </div>
            );
          })}
          {items.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-6">No media found</div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500">Page {pagination.page} • {pagination.total} total</div>
        <div className="space-x-2">
          <button className="px-3 py-1 border rounded disabled:opacity-50" disabled={filters.page <= 1} onClick={() => changePage(-1)}>Prev</button>
          <button className="px-3 py-1 border rounded" onClick={() => changePage(1)}>Next</button>
        </div>
      </div>

      {/* Edit drawer */}
      {selected && (
        <EditMediaDrawer item={selected} onClose={() => setSelected(null)} onSave={doUpdateMetadata} onSoftDelete={doSoftDelete} onHardDelete={doHardDelete} />)
      }
    </div>
  );
}

function EditMediaDrawer({ item, onClose, onSave, onSoftDelete, onHardDelete }) {
  const [form, setForm] = useState({ title: item.title || '', altText: item.altText || '', caption: item.caption || '', description: item.description || '' });
  const isImage = (item.mimeType || '').startsWith('image/');
  const isVideo = (item.mimeType || '').startsWith('video/');
  const isAudio = (item.mimeType || '').startsWith('audio/');
  const isPdf = item.mimeType === 'application/pdf';
  const thumb = mediaAPI.thumbnailUrl(item.id, item);
  const fileUrl = mediaAPI.fileUrl(item.id);

  const onSubmit = (e) => {
    e.preventDefault();
    onSave(item.id, form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
      <div className="w-full max-w-md bg-white h-full shadow-xl flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2"><Info className="w-4 h-4 text-gray-400" /><h2 className="font-semibold">Edit Media</h2></div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          <div className="aspect-video bg-gray-50 rounded flex items-center justify-center overflow-hidden">
            {isImage && (
              <img src={thumb} alt={form.altText} className="object-contain w-full h-full" />
            )}
            {!isImage && isVideo && (
              <video src={fileUrl} poster={thumb} controls className="w-full h-full" style={{ background: '#000' }}>
                Your browser does not support the video tag.
              </video>
            )}
            {!isImage && !isVideo && isAudio && (
              <audio src={fileUrl} controls className="w-full">
                Your browser does not support the audio element.
              </audio>
            )}
            {!isImage && !isVideo && !isAudio && isPdf && (
              <iframe title={form.title || 'PDF Preview'} src={`${fileUrl}#toolbar=1`} className="w-full h-full" style={{ border: 'none' }} />
            )}
            {!isImage && !isVideo && !isAudio && !isPdf && (
              <img src={thumb} alt={form.altText || form.title || 'File preview'} className="object-contain w-full h-full" />
            )}
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Alt Text</label>
              <input value={form.altText} onChange={(e) => setForm((f) => ({ ...f, altText: e.target.value }))} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Caption</label>
              <input value={form.caption} onChange={(e) => setForm((f) => ({ ...f, caption: e.target.value }))} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full border rounded px-3 py-2" rows={4} />
            </div>
            <div className="flex justify-between pt-2">
              <button type="button" onClick={() => onSoftDelete(item.id)} className="px-3 py-2 border rounded">Trash</button>
              <div className="space-x-2">
                <button type="button" onClick={() => onHardDelete(item.id)} className="px-3 py-2 border rounded text-red-600">Delete</button>
                <button type="submit" className="px-3 py-2 border rounded bg-green-600 text-white">Save</button>
              </div>
            </div>
          </form>

          <div className="text-xs text-gray-500 pt-4 border-t">
          <div><span className="text-gray-400">Type:</span> {item.mimeType}</div>
          <div><span className="text-gray-400">Size:</span> {humanFileSize(item.size)}</div>
          <div><span className="text-gray-400">Uploaded:</span> {new Date(item.createdAt || item.created || Date.now()).toLocaleString()}</div>
          <div><span className="text-gray-400">File URL:</span> <a className="text-blue-600" href={fileUrl} target="_blank" rel="noreferrer">Open</a></div>
          </div>
        </div>
      </div>
    </div>
  );
}
