import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 15000, // Increased timeout for backend startup
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    // Check for both admin and regular user tokens (updated for TechBirds API)
    const token = localStorage.getItem('token') || localStorage.getItem('admin_token') || localStorage.getItem('authToken');
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
      localStorage.removeItem('admin_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
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

// Article API functions (now uses posts endpoint)
export const articleAPI = {
  // Get all articles with pagination
  getArticles: async (page = 1, limit = 10, category = '', search = '') => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: limit.toString(),
      status: 'published',
      ...(category && { categoryId: category }),
      ...(search && { search }),
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    
    const response = await api.get(`/posts?${params}`);
    return response.data;
  },

  // Get featured articles
  getFeaturedArticles: async () => {
    const response = await api.get('/posts/featured');
    return response.data;
  },

  // Get trending articles
  getTrendingArticles: async (limit = 5) => {
    const params = new URLSearchParams({
      page: '1',
      pageSize: limit.toString(),
      status: 'published',
      sortBy: 'views',
      sortOrder: 'desc'
    });
    const response = await api.get(`/posts?${params}`);
    return response.data;
  },

  // Get article by ID
  getArticleById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create new article
  createArticle: async (articleData) => {
    // Map authorId to userId for new system compatibility
    const mappedData = {
      title: articleData.title,
      content: articleData.content,
      summary: articleData.summary || articleData.excerpt,
      userId: articleData.userId || articleData.authorId,
      categoryId: articleData.categoryId || articleData.category,
      type: 'article',
      allowComments: articleData.allowComments !== false,
      tags: articleData.tags || '',
      featured: articleData.featured || false
    };
    
    const response = await api.post('/posts', mappedData);
    return response.data;
  },

  // Update article
  updateArticle: async (id, articleData) => {
    // Map authorId to userId for new system compatibility
    const mappedData = {
      title: articleData.title,
      content: articleData.content,
      summary: articleData.summary || articleData.excerpt,
      userId: articleData.userId || articleData.authorId,
      categoryId: articleData.categoryId || articleData.category,
      type: 'article',
      allowComments: articleData.allowComments !== false,
      tags: articleData.tags || '',
      featured: articleData.featured || false
    };
    
    const response = await api.put(`/posts/${id}`, mappedData);
    return response.data;
  },

  // Delete article
  deleteArticle: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

// Posts API functions (short-form content)
export const postsAPI = {
  // Get all posts with filters
  getPosts: async (filters = {}) => {
    const params = new URLSearchParams({
      page: filters.page || 1,
      pageSize: filters.pageSize || 10,
      status: filters.status || 'published',
      type: filters.type || '',
      categoryId: filters.categoryId || '',
      userId: filters.userId || filters.authorId || '', // Support both userId and authorId for transition
      featured: filters.featured || '',
      search: filters.search || '',
      tags: filters.tags || '',
      sortBy: filters.sortBy || 'createdAt',
      sortOrder: filters.sortOrder || 'desc',
    });
    
    const response = await api.get(`/posts?${params}`);
    return response.data;
  },

  // Get single post
  getPostById: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Get featured posts
  getFeaturedPosts: async () => {
    const response = await api.get('/posts/featured');
    return response.data;
  },

  // Get recent posts
  getRecentPosts: async () => {
    const response = await api.get('/posts/recent');
    return response.data;
  },

  // Create draft post
  createDraftPost: async (postData) => {
    const response = await api.post('/posts', {
      title: postData.title,
      content: postData.content,
      summary: postData.summary || postData.excerpt,
      userId: postData.userId || postData.authorId, // Support both for transition
      categoryId: postData.categoryId,
      type: postData.type || 'update',
      allowComments: postData.allowComments !== false,
      tags: postData.tags || '',
    });
    return response.data;
  },

  // Like a post
  likePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Share a post
  sharePost: async (postId) => {
    const response = await api.post(`/posts/${postId}/share`);
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

  // Get category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  // Get articles by category
  getArticlesByCategory: async (categoryId, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: limit.toString(),
      status: 'published',
      categoryId: categoryId,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    const response = await api.get(`/posts?${params}`);
    return response.data;
  },

  // Create category
  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// User API functions (New ASP.NET Core Identity System)
export const userAPI = {
  // Get all users with enhanced filtering and pagination
  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    // Pagination
    if (params.page) queryParams.set('page', params.page);
    if (params.limit) queryParams.set('limit', params.limit);
    
    // Search (searches name, email, bio, specialization)
    if (params.search) queryParams.set('search', params.search);
    
    // Filtering
    if (params.role) queryParams.set('role', params.role);
    if (params.specialization) queryParams.set('specialization', params.specialization);
    
    // Sorting
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);
    
    const response = await api.get(`/users?${queryParams.toString()}`);
    return response.data;
  },

  // Get single user by ID (public profile only, no email exposed)
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Get current authenticated user's full profile (including email)
  getCurrentUserProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update current user's own profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Get articles by user ID
  getArticlesByUser: async (userId, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: limit.toString(),
      status: 'published',
      userId: userId,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    const response = await api.get(`/posts?${params}`);
    return response.data;
  },

  // Create user (admin only)
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Update user (admin only or self-update)
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Update user role (admin only)
  updateUserRole: async (userId, role) => {
    const response = await api.patch(`/users/${userId}/role`, { role });
    return response.data;
  },

  // Toggle user status (admin only)
  toggleUserStatus: async (userId, isActive) => {
    const response = await api.patch(`/users/${userId}/status`, { isActive });
    return response.data;
  },

  // Admin only endpoints
  admin: {
    // Get user activities (admin only)
    getUserActivities: async (userId, params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set('page', params.page);
      if (params.limit) queryParams.set('limit', params.limit);
      if (params.startDate) queryParams.set('startDate', params.startDate);
      if (params.endDate) queryParams.set('endDate', params.endDate);
      
      const response = await api.get(`/users/${userId}/activities?${queryParams.toString()}`);
      return response.data;
    },

    // Get user exceptions (admin only)
    getUserExceptions: async (userId, params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set('page', params.page);
      if (params.limit) queryParams.set('limit', params.limit);
      if (params.startDate) queryParams.set('startDate', params.startDate);
      if (params.endDate) queryParams.set('endDate', params.endDate);
      
      const response = await api.get(`/users/${userId}/exceptions?${queryParams.toString()}`);
      return response.data;
    },

    // Get all user activities (admin only)
    getAllActivities: async (params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set('page', params.page);
      if (params.limit) queryParams.set('limit', params.limit);
      if (params.startDate) queryParams.set('startDate', params.startDate);
      if (params.endDate) queryParams.set('endDate', params.endDate);
      if (params.userId) queryParams.set('userId', params.userId);
      
      const response = await api.get(`/users/activities?${queryParams.toString()}`);
      return response.data;
    },

    // Get all user exceptions (admin only)
    getAllExceptions: async (params = {}) => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set('page', params.page);
      if (params.limit) queryParams.set('limit', params.limit);
      if (params.startDate) queryParams.set('startDate', params.startDate);
      if (params.endDate) queryParams.set('endDate', params.endDate);
      if (params.userId) queryParams.set('userId', params.userId);
      
      const response = await api.get(`/users/exceptions?${queryParams.toString()}`);
      return response.data;
    }
  }
};

// Legacy Author API (for backward compatibility)
// This will be gradually phased out as components migrate to userAPI
export const authorAPI = {
  // Get all authors (maps to users with author-like roles)
  getAuthors: async () => {
    try {
      // Try new users endpoint first
      const response = await userAPI.getUsers({ role: 'all' });
      const users = response.users ? response.users : response;
      
      // Transform user data to match old author structure
      return users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        website: user.website,
        twitter: user.twitter,
        linkedin: user.linkedin,
        specialization: user.specialization,
        status: user.isActive ? 'active' : 'inactive',
        role: mapFromNewRoleSystem(user.role),
        postsCount: user.postsCount || 0,
        totalViews: user.totalViews || 0,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));
    } catch (error) {
      // Fallback to old authors endpoint if available
      console.warn('New users API not available, attempting old authors API');
      try {
        const response = await api.get('/authors');
        return response.data;
      } catch (fallbackError) {
        console.error('Both new users API and old authors API failed');
        throw error; // Throw the original error
      }
    }
  },

  // Get author by ID
  getAuthorById: async (id) => {
    try {
      const user = await userAPI.getUserById(id);
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        website: user.website,
        twitter: user.twitter,
        linkedin: user.linkedin,
        specialization: user.specialization,
        status: user.isActive ? 'active' : 'inactive',
        role: mapFromNewRoleSystem(user.role),
        postsCount: user.postsCount || 0,
        totalViews: user.totalViews || 0,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      // Fallback to old authors endpoint
      try {
        const response = await api.get(`/authors/${id}`);
        return response.data;
      } catch (fallbackError) {
        throw error;
      }
    }
  },

  // Get articles by author
  getArticlesByAuthor: async (authorId, page = 1, limit = 10) => {
    return await userAPI.getArticlesByUser(authorId, page, limit);
  },

  // Create author
  createAuthor: async (authorData) => {
    // Map old author data to new user data structure
    const userData = {
      firstName: authorData.firstName,
      lastName: authorData.lastName,
      email: authorData.email,
      password: authorData.password,
      bio: authorData.bio || null,
      avatar: authorData.avatar || null,
      website: authorData.website || null,
      twitter: authorData.twitter || null,
      linkedin: authorData.linkedin || null,
      specialization: authorData.specialization || null,
      isActive: authorData.status?.toLowerCase() === 'active',
      role: mapToNewRoleSystem(authorData.role)
    };
    
    return await userAPI.createUser(userData);
  },

  // Update author
  updateAuthor: async (id, authorData) => {
    const userData = {
      firstName: authorData.firstName,
      lastName: authorData.lastName,
      email: authorData.email,
      bio: authorData.bio || null,
      avatar: authorData.avatar || null,
      website: authorData.website || null,
      twitter: authorData.twitter || null,
      linkedin: authorData.linkedin || null,
      specialization: authorData.specialization || null,
      isActive: authorData.status?.toLowerCase() === 'active',
      role: mapToNewRoleSystem(authorData.role)
    };

    // Only include password if provided
    if (authorData.password && authorData.password.trim()) {
      userData.password = authorData.password;
    }
    
    return await userAPI.updateUser(id, userData);
  },

  // Delete author
  deleteAuthor: async (id) => {
    return await userAPI.deleteUser(id);
  },
};

// Role System Mapping Functions
const mapToNewRoleSystem = (oldRole) => {
  const roleMapping = {
    // Map to standard ASP.NET Core Identity roles that should exist
    'author': 'User',           // Use 'User' instead of 'Contributor'
    'editor': 'Editor',         // Keep 'Editor' if seeded
    'admin': 'Administrator',   // Use 'Administrator' or 'Admin'
    'contributor': 'User',      // Use 'User' as basic role
    'reviewer': 'User',         // Use 'User' as fallback
    'moderator': 'Moderator',   // Keep if seeded
    'administrator': 'Administrator',
    'superadmin': 'Administrator'  // Map to Administrator for now
  };
  return roleMapping[oldRole?.toLowerCase()] || 'User';
};

const mapFromNewRoleSystem = (newRole) => {
  const displayMapping = {
    'User': 'User',             // Display 'User' role as 'User' in UI
    'Editor': 'Editor',
    'Moderator': 'Moderator', 
    'Administrator': 'Admin',
    'Admin': 'Admin'            // Handle both Administrator and Admin
  };
  return displayMapping[newRole] || 'User';
};

// Newsletter API functions
export const newsletterAPI = {
  // Subscribe to newsletter
  subscribe: async (email) => {
    const response = await api.post('/newsletter/subscribe', { email });
    return response.data;
  },
};

// Search API functions  
export const searchAPI = {
  // Global search
  globalSearch: async (query, filters = {}) => {
    const params = new URLSearchParams({
      search: query,
      type: filters.type || 'article', // Default to article type posts
      page: filters.page || 1,
      pageSize: filters.pageSize || 10,
      status: 'published'
    });
    const response = await api.get(`/posts?${params}`);
    return response.data;
  },

  // Search articles (legacy)
  searchArticles: async (query, page = 1, limit = 10) => {
    return this.globalSearch(query, { type: 'article', page, pageSize: limit });
  },
};

// Comments API functions
export const commentsAPI = {
  // Get article comments (no auth required)
  getArticleComments: async (articleId) => {
    const response = await api.get(`/posts/${articleId}/comments`);
    return response.data;
  },

  // Get post comments (no auth required)
  getPostComments: async (postId) => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  // Create comment (auth required)
  createComment: async (commentData) => {
    // Validate content length
    if (!commentData.content || commentData.content.trim().length === 0) {
      throw new Error('Comment content is required');
    }
    if (commentData.content.length > 2000) {
      throw new Error('Comment cannot exceed 2000 characters');
    }

    const requestData = {
      content: commentData.content.trim(),
    };

    // Either articleId OR postId, both map to postId in the new system
    if (commentData.articleId || commentData.postId) {
      requestData.postId = commentData.postId || commentData.articleId;
    } else {
      throw new Error('Either articleId or postId is required');
    }
    
    const response = await api.post('/comments', requestData);
    return response.data;
  },

  // Update comment (auth required)
  updateComment: async (commentId, content) => {
    // Validate content length
    if (!content || content.trim().length === 0) {
      throw new Error('Comment content is required');
    }
    if (content.length > 2000) {
      throw new Error('Comment cannot exceed 2000 characters');
    }

    const response = await api.put(`/comments/${commentId}`, {
      content: content.trim()
    });
    return response.data;
  },

  // Delete comment (auth required)
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  // Check if user can edit comment
  canEditComment: (comment, currentUser) => {
    if (!currentUser || !comment) return false;
    
    // User owns the comment OR user is admin/editor
    return comment.user?.id === currentUser.id || 
           currentUser.roles?.some(r => ['Admin', 'Editor', 'SuperAdmin', 'Administrator'].includes(r));
  },

  // Validate comment content
  validateComment: (content) => {
    if (!content || content.trim().length === 0) {
      return "Comment content is required";
    }
    if (content.length > 2000) {
      return "Comment cannot exceed 2000 characters";
    }
    return null;
  }
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
    const response = await api.post(`/posts/${articleId}/view`);
    return response.data;
  },
};

// Admin API functions
export const adminAPI = {
  // Admin Authentication - Using correct admin endpoints
  login: async (credentials) => {
    const response = await api.post('/admin/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/admin/auth/register', userData);
    return response.data;
  },

  getCurrentAdmin: async () => {
    // Use the correct admin endpoint first
    try {
      console.log('🔍 Trying admin auth endpoint: /admin/auth/me');
      const response = await api.get('/admin/auth/me');
      console.log('✅ getCurrentAdmin successful with /admin/auth/me:', response.data);
      return response.data;
    } catch (error) {
      console.log('❌ /admin/auth/me failed:', error.response?.status);
      
      // Fallback to other possible endpoints
      const fallbackEndpoints = ['/auth/me', '/api/auth/me', '/admin/me', '/user/profile'];
      
      for (const endpoint of fallbackEndpoints) {
        try {
          console.log(`🔍 Trying fallback endpoint: ${endpoint}`);
          const response = await api.get(endpoint);
          console.log(`✅ getCurrentAdmin successful with ${endpoint}:`, response.data);
          return response.data;
        } catch (error) {
          console.log(`❌ ${endpoint} failed:`, error.response?.status);
          continue;
        }
      }
      
      // If all endpoints fail, throw error
      console.warn('⚠️ No getCurrentAdmin endpoint available');
      throw new Error('Authentication endpoints not available');
    }
  },

  getCurrentUser: async () => {
    // Alias for getCurrentAdmin for consistency
    return await adminAPI.getCurrentAdmin();
  },

  logout: async () => {
    try {
      const response = await api.post('/admin/auth/logout');
      return response.data;
    } catch (error) {
      console.warn('Admin logout endpoint not available, clearing local storage');
    } finally {
      // Clear all possible tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('authToken');
      return { success: true };
    }
  },

  // Authors management (using the new user system with backward compatibility)
  getAuthors: async (params = {}) => {
    try {
      // Try new users endpoint first
      const response = await userAPI.getUsers(params);
      return response;
    } catch (error) {
      console.warn('New users API not available, falling back to legacy authors API');
      const response = await api.get('/authors', { params });
      return response.data;
    }
  },

  createAuthor: async (authorData) => {
    try {
      // Map to new user structure
      const userData = {
        firstName: authorData.firstName,
        lastName: authorData.lastName,
        email: authorData.email,
        password: authorData.password,
        bio: authorData.bio || null,
        avatar: authorData.avatar || null,
        website: authorData.website || null,
        twitter: authorData.twitter || null,
        linkedin: authorData.linkedin || null,
        specialization: authorData.specialization || null,
        isActive: authorData.status?.toLowerCase() === 'active',
        role: mapToNewRoleSystem(authorData.role || 'author')
      };
      
      console.log('🔄 Creating user via ADMIN auth/register endpoint:', userData);
      console.log('📡 POST /admin/auth/register with data:', JSON.stringify(userData, null, 2));
      
      // Use ADMIN registration endpoint since we're creating users with specific roles
      const response = await api.post('/admin/auth/register', userData);
      console.log('✅ User created successfully via admin endpoint:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create user via admin/auth/register:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        requestData: error.config?.data
      });
      
      // More detailed error message for the user
      let userMessage = 'Failed to create user: ';
      if (error.response?.status === 500) {
        if (error.response?.data?.includes?.('Role') && error.response?.data?.includes?.('does not exist')) {
          // Extract the role name from the error
          const roleMatch = error.response.data.match(/Role (\w+) does not exist/);
          const missingRole = roleMatch ? roleMatch[1] : 'specified role';
          userMessage += `The role "${missingRole}" does not exist in the system. Please contact your administrator to set up the required roles in ASP.NET Core Identity.`;
        } else {
          userMessage += 'Server error occurred. Please check the backend logs.';
        }
      } else if (error.response?.data?.message) {
        userMessage += error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle ASP.NET Core validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join(', ');
        userMessage += errorMessages;
      } else {
        userMessage += error.message;
      }
      
      const enhancedError = new Error(userMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  },

  updateAuthor: async (id, authorData) => {
    console.log('🔄 API: Updating author', id, 'with data:', {
      ...authorData,
      password: authorData.password ? '[HIDDEN]' : undefined,
      avatar: authorData.avatar?.substring(0, 100) + (authorData.avatar?.length > 100 ? '...' : '')
    });
    
    try {
      // Map to new user structure
      const userData = {
        firstName: authorData.firstName,
        lastName: authorData.lastName,
        email: authorData.email,
        bio: authorData.bio || null,
        avatar: authorData.avatar || null,
        website: authorData.website || null,
        twitter: authorData.twitter || null,
        linkedin: authorData.linkedin || null,
        specialization: authorData.specialization || null,
        isActive: authorData.status?.toLowerCase() === 'active',
        role: mapToNewRoleSystem(authorData.role || 'author')
      };

      // Only include password if provided
      if (authorData.password && authorData.password.trim()) {
        userData.password = authorData.password;
      }
      
      const response = await userAPI.updateUser(id, userData);
      console.log('✅ API: Author updated successfully via new user API:', response);
      return response;
    } catch (error) {
      console.warn('New users API not available, falling back to legacy authors API');
      
      try {
        const response = await api.put(`/authors/${id}`, authorData);
        console.log('✅ API: Author updated successfully via legacy API:', response.data);
        return response.data;
      } catch (fallbackError) {
        console.error('❌ API: Both new and legacy author update failed:', {
          newAPIError: error.response?.data,
          legacyAPIError: fallbackError.response?.data
        });
        throw fallbackError;
      }
    }
  },

  deleteAuthor: async (id) => {
    try {
      const response = await userAPI.deleteUser(id);
      return response;
    } catch (error) {
      console.warn('New users API not available, falling back to legacy authors API');
      const response = await api.delete(`/authors/${id}`);
      return response.data;
    }
  },

  getAuthorById: async (id) => {
    try {
      const user = await userAPI.getUserById(id);
      // Transform to match expected author structure
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar,
        website: user.website,
        twitter: user.twitter,
        linkedin: user.linkedin,
        specialization: user.specialization,
        status: user.isActive ? 'active' : 'inactive',
        role: mapFromNewRoleSystem(user.role),
        postsCount: user.postsCount || 0,
        totalViews: user.totalViews || 0,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      console.warn('New users API not available, falling back to legacy authors API');
      const response = await api.get(`/authors/${id}`);
      return response.data;
    }
  },

  getAuthorPosts: async (id, params = {}) => {
    try {
      return await userAPI.getArticlesByUser(id, params.page, params.limit);
    } catch (error) {
      console.warn('New users API not available, falling back to legacy authors API');
      const response = await api.get(`/authors/${id}/posts`, { params });
      return response.data;
    }
  },

  updateAuthorStatus: async (id, status) => {
    try {
      const isActive = status?.toLowerCase() === 'active';
      const response = await userAPI.toggleUserStatus(id, isActive);
      return response;
    } catch (error) {
      console.warn('New users API not available, falling back to legacy method');
      // Fallback to updating the full author
      try {
        const author = await adminAPI.getAuthorById(id);
        const updatedAuthor = { ...author, status };
        const response = await adminAPI.updateAuthor(id, updatedAuthor);
        return response;
      } catch (fallbackError) {
        console.error('Both new and legacy status update methods failed');
        throw fallbackError;
      }
    }
  },

  // Articles management (using posts endpoints)
  getPosts: async (params = {}) => {
    console.log('🔍 AdminAPI.getPosts called with params:', params);
    
    // Use posts endpoint directly
    try {
      console.log('📡 Trying /posts endpoint...');
      const response = await api.get('/posts', { params });
      console.log('✅ Posts response received:', {
        status: response.status,
        dataType: Array.isArray(response.data) ? 'Array' : typeof response.data,
        length: Array.isArray(response.data) ? response.data.length : 'N/A',
        firstItem: Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : 'N/A'
      });
      return response.data;
    } catch (error) {
      console.error('❌ Posts endpoint failed:', error.response?.status, error.message);
      
      // Fallback to admin/posts if available
      try {
        console.log('🔄 Trying /admin/posts endpoint as fallback...');
        const response = await api.get('/admin/posts', { params });
        console.log('✅ Admin posts response received:', {
          status: response.status,
          dataType: Array.isArray(response.data) ? 'Array' : typeof response.data,
          length: Array.isArray(response.data) ? response.data.length : 'N/A'
        });
        return response.data;
      } catch (adminError) {
        console.error('❌ Both endpoints failed. Admin posts error:', adminError.message);
        throw adminError;
      }
    }
  },

  createPost: async (postData) => {
    // Validate required fields before sending
    if (!postData.title || !postData.content) {
      throw new Error('Title and content are required');
    }
    
    if (!postData.userId && !postData.authorId) {
      throw new Error('User ID is required');
    }
    
    // Map authorId to userId for new system compatibility
    const mappedData = {
      title: postData.title,
      content: postData.content,
      summary: postData.summary || postData.excerpt,
      userId: postData.userId || postData.authorId,
      categoryId: postData.categoryId || postData.category,
      type: postData.type || 'article',
      allowComments: postData.allowComments !== false,
      tags: postData.tags || '',
      featured: postData.featured || false
    };
    
    // Try posts endpoint first, then admin posts
    try {
      const response = await api.post('/posts', mappedData);
      return response.data;
    } catch (error) {
      console.error('Posts creation failed, trying admin posts endpoint');
      
      if (error.response?.status === 404) {
        // Try admin posts endpoint as fallback
        try {
          const response = await api.post('/admin/posts', mappedData);
          return response.data;
        } catch (adminError) {
          console.error('Both posts and admin posts creation failed');
          throw adminError;
        }
      }
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    console.log('🔄 AdminAPI.updatePost called with:', { id, postData });
    
    // Map authorId to userId for new system compatibility
    const mappedData = {
      title: postData.title,
      content: postData.content,
      summary: postData.summary || postData.excerpt,
      userId: postData.userId || postData.authorId,
      categoryId: postData.categoryId || postData.category,
      type: postData.type || 'article',
      allowComments: postData.allowComments !== false,
      tags: postData.tags || '',
      featured: postData.featured || false
    };
    
    try {
      console.log('📡 Trying PUT /posts/{id} endpoint...');
      const response = await api.put(`/posts/${id}`, mappedData);
      console.log('✅ Update post response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Posts PUT failed:', error.response?.status, error.message);
      
      if (error.response?.status === 404) {
        try {
          console.log('🔄 Trying PUT /admin/posts/{id} endpoint as fallback...');
          const response = await api.put(`/admin/posts/${id}`, mappedData);
          console.log('✅ Update admin posts response:', response.data);
          return response.data;
        } catch (adminError) {
          console.error('❌ Admin posts PUT also failed:', adminError.response?.status, adminError.message);
          throw adminError;
        }
      } else if (error.response?.status === 405) {
        console.error('❌ PUT method not allowed - backend does not support updating posts');
        throw error;
      }
      
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      const response = await api.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        // Try admin posts endpoint
        const response = await api.delete(`/admin/posts/${id}`);
        return response.data;
      }
      throw error;
    }
  },

  getPostById: async (id) => {
    console.log('🔍 AdminAPI.getPostById called with ID:', id);
    
    try {
      console.log('📡 Trying /posts/{id} endpoint...');
      const response = await api.get(`/posts/${id}`);
      console.log('✅ Post response received:', {
        status: response.status,
        dataType: typeof response.data,
        hasData: !!response.data,
        postId: response.data?.id,
        postTitle: response.data?.title
      });
      return response.data;
    } catch (error) {
      console.error('❌ Posts/{id} endpoint failed:', error.response?.status, error.message);
      
      if (error.response?.status === 404) {
        try {
          console.log('🔄 Trying /admin/posts/{id} endpoint as fallback...');
          const response = await api.get(`/admin/posts/${id}`);
          console.log('✅ Admin posts response received:', {
            status: response.status,
            dataType: typeof response.data,
            hasData: !!response.data,
            postId: response.data?.id,
            postTitle: response.data?.title
          });
          return response.data;
        } catch (adminError) {
          console.error('❌ Admin posts/{id} endpoint also failed:', adminError.response?.status, adminError.message);
          throw adminError;
        }
      }
      throw error;
    }
  },

  getTags: async () => {
    try {
      const response = await api.get('/admin/tags');
      return response.data;
    } catch (error) {
      console.warn('Tags endpoint not available yet:', error.message);
      // If tags endpoint doesn't exist, try to extract unique tags from existing posts
      try {
        console.log('🔄 Extracting tags from existing posts...');
        const posts = await adminAPI.getPosts({ limit: 1000 });
        const allTags = new Set();
        
        if (Array.isArray(posts)) {
          posts.forEach(post => {
            if (post.tags) {
              const tagArray = Array.isArray(post.tags) ? post.tags : post.tags.split(',').map(t => t.trim());
              tagArray.forEach(tag => tag && allTags.add(tag));
            }
          });
        } else if (posts.posts && Array.isArray(posts.posts)) {
          posts.posts.forEach(post => {
            if (post.tags) {
              const tagArray = Array.isArray(post.tags) ? post.tags : post.tags.split(',').map(t => t.trim());
              tagArray.forEach(tag => tag && allTags.add(tag));
            }
          });
        }
        
        const extractedTags = Array.from(allTags).filter(tag => tag.length > 0);
        console.log('✅ Extracted tags from posts:', extractedTags);
        return extractedTags;
      } catch (postsError) {
        console.warn('Could not extract tags from posts:', postsError.message);
        // Return empty array instead of throwing error
        console.log('📝 Using empty tags array - /admin/tags endpoint not implemented');
        return [];
      }
    }
  },

  // Categories management (using the main category endpoints)
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.warn('Dashboard stats endpoint not available yet');
      // Return mock data for now
      return {
        totalArticles: 0,
        totalAuthors: 0,
        totalCategories: 0,
        totalViews: 0
      };
    }
  },

  // File upload - placeholder for future implementation
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.warn('File upload endpoint not available yet');
      throw new Error('File upload not implemented yet');
    }
  },
};

export default api;

// Export role mapping functions for use in components
export { mapToNewRoleSystem, mapFromNewRoleSystem };
