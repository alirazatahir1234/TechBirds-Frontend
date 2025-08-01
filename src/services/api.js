import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001/api',
  timeout: 15000, // Increased timeout for backend startup
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Handle SSL certificate issues in development
  ...(import.meta.env.DEV && {
    httpsAgent: false,
  }),
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error scenarios
    if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      console.error('🔥 Backend connection error - Is your .NET backend running?');
      console.error('Expected URL:', api.defaults.baseURL);
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 404) {
      console.warn('API endpoint not found:', error.config?.url);
    }
    
    if (error.response?.status === 500) {
      console.error('Backend server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Article API functions
export const articleAPI = {
  // Get all articles with pagination
  getArticles: async (page = 1, limit = 10, category = '', search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
      ...(search && { search }),
    });
    
    const response = await api.get(`/articles?${params}`);
    return response.data;
  },

  // Get featured articles
  getFeaturedArticles: async () => {
    const response = await api.get('/articles/featured');
    return response.data;
  },

  // Get article by ID
  getArticleById: async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },

  // Get articles by category
  getArticlesByCategory: async (category, page = 1, limit = 10) => {
    const response = await api.get(`/articles/category/${category}?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Get trending articles
  getTrendingArticles: async (limit = 5) => {
    const response = await api.get(`/articles/trending?limit=${limit}`);
    return response.data;
  },

  // Search articles
  searchArticles: async (query, page = 1, limit = 10) => {
    const response = await api.get(`/articles/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    return response.data;
  },
};

// Category API functions
export const categoryAPI = {
  // Get all categories
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },
};

// Author API functions
export const authorAPI = {
  // Get all authors
  getAuthors: async () => {
    const response = await api.get('/authors');
    return response.data;
  },

  // Get author by ID
  getAuthorById: async (id) => {
    const response = await api.get(`/authors/${id}`);
    return response.data;
  },

  // Get articles by author
  getArticlesByAuthor: async (authorId, page = 1, limit = 10) => {
    const response = await api.get(`/authors/${authorId}/articles?page=${page}&limit=${limit}`);
    return response.data;
  },
};

// Newsletter API functions
export const newsletterAPI = {
  // Subscribe to newsletter
  subscribe: async (email) => {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
  },

  // Unsubscribe from newsletter
  unsubscribe: async (email) => {
    const response = await api.post('/newsletter/unsubscribe', { email });
    return response.data;
  },
};

// Statistics API functions
export const statsAPI = {
  // Get site statistics
  getSiteStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },

  // Track article view
  trackArticleView: async (articleId) => {
    const response = await api.post(`/stats/articles/${articleId}/view`);
    return response.data;
  },
};

// Admin API functions
export const adminAPI = {
  // Authentication
  login: async (credentials) => {
    const response = await api.post('/admin/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/admin/auth/register', userData);
    return response.data;
  },

  getCurrentAdmin: async () => {
    const response = await api.get('/admin/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/admin/auth/logout');
    return response.data;
  },

  // Posts management
  getPosts: async (params = {}) => {
    const response = await api.get('/admin/posts', { params });
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/admin/posts', postData);
    return response.data;
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/admin/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/admin/posts/${id}`);
    return response.data;
  },

  // Categories management
  getCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/admin/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  // Comments management
  getComments: async (params = {}) => {
    const response = await api.get('/admin/comments', { params });
    return response.data;
  },

  updateCommentStatus: async (id, status) => {
    const response = await api.patch(`/admin/comments/${id}/status`, { status });
    return response.data;
  },

  deleteComment: async (id) => {
    const response = await api.delete(`/admin/comments/${id}`);
    return response.data;
  },

  replyToComment: async (id, replyData) => {
    const response = await api.post(`/admin/comments/${id}/reply`, replyData);
    return response.data;
  },

  // Newsletter management
  getSubscribers: async (params = {}) => {
    const response = await api.get('/admin/newsletter/subscribers', { params });
    return response.data;
  },

  createCampaign: async (campaignData) => {
    const response = await api.post('/admin/newsletter/campaigns', campaignData);
    return response.data;
  },

  getCampaigns: async () => {
    const response = await api.get('/admin/newsletter/campaigns');
    return response.data;
  },

  sendCampaign: async (id) => {
    const response = await api.post(`/admin/newsletter/campaigns/${id}/send`);
    return response.data;
  },

  // Dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // File upload
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
