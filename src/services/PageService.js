import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const PageService = {
  getPages: async (params = {}) => {
    const res = await axios.get(`${API_BASE}/pages`, { params });
    return res.data;
  },
  getPage: async (id) => {
    const res = await axios.get(`${API_BASE}/pages/${id}`);
    return res.data;
  },
  createPage: async (page) => {
    const res = await axios.post(`${API_BASE}/pages`, page);
    return res.data;
  },
  updatePage: async (id, page) => {
    const res = await axios.put(`${API_BASE}/pages/${id}`, page);
    return res.data;
  },
  deletePage: async (id) => {
    const res = await axios.delete(`${API_BASE}/pages/${id}`);
    return res.data;
  },
  bulkDelete: async (ids) => {
    const res = await axios.post(`${API_BASE}/pages/bulk-delete`, { ids });
    return res.data;
  }
};

export default PageService;
