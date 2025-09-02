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
      // Network errors are handled silently
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
      // Endpoint not found
    }
    
    if (error.response?.status >= 500) {
      // Server errors are handled silently
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
      try {
        const response = await api.get('/authors');
        return response.data;
      } catch (fallbackError) {
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
    const updatedAuthorData = {
      ...authorData,
      password: authorData.password ? '[HIDDEN]' : undefined,
      avatar: authorData.avatar?.substring(0, 100) + (authorData.avatar?.length > 100 ? '...' : '')
    };

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

      // Make API call
      const response = await axios.put(`/authors/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update author: ${error.message}`);
    }
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
      const response = await api.get('/admin/auth/me');
      return response.data;
    } catch (error) {
      
      // Fallback to other possible endpoints
      const fallbackEndpoints = ['/auth/me', '/api/auth/me', '/admin/me', '/user/profile'];
      
      for (const endpoint of fallbackEndpoints) {
        try {
          const response = await api.get(endpoint);
          return response.data;
        } catch (error) {
          continue;
        }
      }
      
      // If all endpoints fail, throw error
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
      
      
      // Use ADMIN registration endpoint since we're creating users with specific roles
      const response = await api.post('/admin/auth/register', userData);
      return response.data;
    } catch (error) {
      // Log the error details for debugging
      console.error('Error in createAuthor:', {
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
    };
  },

  updateAuthor: async (id, authorData) => {
    const updatedAuthorData = {
      ...authorData,
      password: authorData.password ? '[HIDDEN]' : undefined,
      avatar: authorData.avatar?.substring(0, 100) + (authorData.avatar?.length > 100 ? '...' : '')
    };

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

      // Make API call
      const response = await axios.put(`/authors/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to update author: ${error.message}`);
    }
  },

  deleteAuthor: async (id) => {
    try {
      const response = await userAPI.deleteUser(id);
      return response;
    } catch (error) {
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
      const response = await api.get(`/authors/${id}`);
      return response.data;
    }
  },

  getAuthorPosts: async (id, params = {}) => {
    try {
      return await userAPI.getArticlesByUser(id, params.page, params.limit);
    } catch (error) {
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
      // Fallback to updating the full author
      try {
        const author = await adminAPI.getAuthorById(id);
        const updatedAuthor = { ...author, status };
        const response = await adminAPI.updateAuthor(id, updatedAuthor);
        return response;
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  },

  // Articles management (using posts endpoints)
  getPosts: async (params = {}) => {
    try {
      const response = await api.get('/posts', { params });
      return {
        status: response.status,
        dataType: Array.isArray(response.data) ? 'Array' : typeof response.data,
        length: Array.isArray(response.data) ? response.data.length : 'N/A',
        firstItem: Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : 'N/A'
      };
    } catch (error) {
      try {
        const response = await api.get('/admin/posts', { params });
        return {
          status: response.status,
          dataType: Array.isArray(response.data) ? 'Array' : typeof response.data,
          length: Array.isArray(response.data) ? response.data.length : 'N/A'
        };
      } catch (adminError) {
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
      
      if (error.response?.status === 404) {
        // Try admin posts endpoint as fallback
        try {
          const response = await api.post('/admin/posts', mappedData);
          return response.data;
        } catch (adminError) {
          throw adminError;
        }
      }
      throw error;
    }
  },

  updatePost: async (id, postData) => {
    
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
      const response = await api.put(`/posts/${id}`, mappedData);
      return response.data;
    } catch (error) {
      
      if (error.response?.status === 404) {
        try {
          const response = await api.put(`/admin/posts/${id}`, mappedData);
          return response.data;
        } catch (adminError) {
          throw adminError;
        }
      } else if (error.response?.status === 405) {
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
    try {
      const response = await api.get(`/posts/${id}`);
      return {
        status: response.status,
        dataType: typeof response.data,
        hasData: !!response.data,
        postId: response.data?.id,
        postTitle: response.data?.title
      };
    } catch (error) {
      if (error.response?.status === 404) {
        try {
          const response = await api.get(`/admin/posts/${id}`);
          return {
            status: response.status,
            dataType: typeof response.data,
            hasData: !!response.data,
            postId: response.data?.id,
            postTitle: response.data?.title
          };
        } catch (adminError) {
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
      // If tags endpoint doesn't exist, try to extract unique tags from existing posts
      try {
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
        return extractedTags;
      } catch (postsError) {
        // Return empty array instead of throwing error
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

  // Bulk category import
  bulkImportCategories: async (categories) => {
    try {
      const response = await api.post('/admin/categories/bulk', {
        categories: categories
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Dashboard stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
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
      throw new Error('File upload not implemented yet');
    }
  },
};

// Pages API functions
export const pagesAPI = {
  // Create page (auth required)
  create: async (data) => {
    const body = { ...data };
    if (body.metaJson && typeof body.metaJson === 'object') {
      body.metaJson = JSON.stringify(body.metaJson);
    }
    // If slug omitted, backend will auto-generate
    const res = await api.post('/Pages', body);
    return res.data;
  },

  // Update page (auth required)
  update: async (id, data) => {
    const body = { ...data };
    if (body.metaJson && typeof body.metaJson === 'object') {
      body.metaJson = JSON.stringify(body.metaJson);
    }
    const res = await api.put(`/Pages/${id}`, body);
    return res.data;
  },

  // Get page by id (public)
  getById: async (id) => {
    const res = await api.get(`/Pages/${id}`);
    return res.data;
  },

  // Get page by slug (public)
  getBySlug: async (slug) => {
    const res = await api.get(`/Pages/slug/${encodeURIComponent(slug)}`);
    return res.data;
  },

  // List pages (public)
  list: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit);
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);
    if (params.parentId) query.set('parentId', params.parentId);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    const res = await api.get(`/Pages?${query.toString()}`);
    return res.data;
  },

  // Delete (soft) (auth: Editor+)
  softDelete: async (id) => {
    const res = await api.delete(`/Pages/${id}`);
    return res.data;
  },

  // Delete (hard) (auth: Admin+)
  hardDelete: async (id) => {
    const res = await api.delete(`/Pages/${id}/hard`);
    return res.data;
  },

  // Revisions (auth: Author+)
  listRevisions: async (id) => {
    const res = await api.get(`/Pages/${id}/revisions`);
    return res.data;
  },

  restoreRevision: async (id, revisionId) => {
    const res = await api.post(`/Pages/${id}/restore/${revisionId}`);
    return res.data;
  },
};

// Media API functions
export const mediaAPI = {
  // Upload media with metadata
  upload: async ({ file, title, altText, caption, description }) => {
    if (!file) throw new Error('File is required');

    // Try multiple endpoints with different data formats
    const uploadAttempts = [
      // Attempt 1: Exact format matching the curl command
      {
        endpoint: '/Media',
        prepareData: () => {
          const formData = new FormData();
          formData.append('FileUpload', file);
          formData.append('Title', title || 'string');
          formData.append('AltText', altText || 'string');
          formData.append('Caption', caption || 'string');
          formData.append('Description', description || 'string');
          return formData;
        }
      },
      // Attempt 2: Alternative with lowercase field names
      {
        endpoint: '/media',
        prepareData: () => {
          const formData = new FormData();
          formData.append('FileUpload', file);
          formData.append('title', title || 'string');
          formData.append('altText', altText || 'string');
          formData.append('caption', caption || 'string');
          formData.append('description', description || 'string');
          return formData;
        }
      },
      // Attempt 3: Original format with all metadata
      {
        endpoint: '/media/upload',
        prepareData: () => {
          const formData = new FormData();
          formData.append('file', file);
          if (title) formData.append('title', title);
          if (altText) formData.append('altText', altText);
          if (caption) formData.append('caption', caption);
          if (description) formData.append('description', description);
          return formData;
        }
      },
      // Attempt 4: RESTful endpoint with metadata
      {
        endpoint: '/media',
        prepareData: () => {
          const formData = new FormData();
          formData.append('file', file);
          if (title) formData.append('title', title);
          if (altText) formData.append('altText', altText);
          if (caption) formData.append('caption', caption);
          if (description) formData.append('description', description);
          return formData;
        }
      },
      // Attempt 5: Simple file upload only
      {
        endpoint: '/media',
        prepareData: () => {
          const formData = new FormData();
          formData.append('file', file);
          return formData;
        }
      },
      // Attempt 6: Simple upload endpoint
      {
        endpoint: '/upload',
        prepareData: () => {
          const formData = new FormData();
          formData.append('file', file);
          return formData;
        }
      }
    ];
    
    let lastError = null;
    
    for (const attempt of uploadAttempts) {
      try {
        const formData = attempt.prepareData();
        
        const response = await api.post(attempt.endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        return response.data;
        
      } catch (error) {
        lastError = error;
        
        // If it's a 405 Method Not Allowed, try the next endpoint
        if (error.response?.status === 405) {
          continue;
        }
        
        // If it's a 400 Bad Request, try next format (might be wrong field names)
        if (error.response?.status === 400) {
          continue;
        }
        
        // For authentication errors (401, 403), stop trying
        if (error.response?.status === 401 || error.response?.status === 403) {
          break;
        }
      }
    }
    
    // If all attempts failed, throw the last error
    throw lastError;
  },

  // List media with filters/pagination
  list: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.set('page', params.page);
    if (params.limit) query.set('limit', params.limit);
    if (params.mimeType) query.set('mimeType', params.mimeType);
    if (params.search) query.set('search', params.search);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);
    if (params.uploadedByUserId) query.set('uploadedByUserId', params.uploadedByUserId);

    const response = await api.get(`/media?${query.toString()}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/media/${id}`);
    return response.data;
  },

  updateMetadata: async (id, metadata) => {
    const allowed = ['title', 'altText', 'caption', 'description'];
    const body = {};
    allowed.forEach(k => {
      if (metadata[k] !== undefined) body[k] = metadata[k];
    });
    const response = await api.put(`/media/${id}`, body);
    return response.data;
  },

  softDelete: async (id) => {
    const response = await api.delete(`/media/${id}`);
    return response.data;
  },

  hardDelete: async (id) => {
    const response = await api.delete(`/media/${id}/hard`);
    return response.data;
  },

  // Helpers for building absolute/preview URLs
  absoluteUrl: (pathOrUrl) => {
    try {
      const base = import.meta.env.VITE_API_BASE_URL || '';
      const origin = new URL(base, window.location.origin).origin;
      return new URL(pathOrUrl, origin).href;
    } catch {
      return pathOrUrl;
    }
  },

  thumbnailUrl: (id, item) => {
    try {
      const base = import.meta.env.VITE_API_BASE_URL || '';
      const origin = new URL(base, window.location.origin).origin;
      if (item?.thumbnailUrl) return new URL(item.thumbnailUrl, origin).href;
      return `${origin}/api/media/${id}/thumbnail`;
    } catch {
      return item?.thumbnailUrl || '';
    }
  },

  fileUrl: (id) => {
    try {
      const base = import.meta.env.VITE_API_BASE_URL || '';
      const origin = new URL(base, window.location.origin).origin;
      return `${origin}/api/media/${id}/file`;
    } catch {
      return `/api/media/${id}/file`;
    }
  },
};

export default api;

// Additional convenience functions for the main api object
api.getPageBySlug = async (slug) => {
  try {
    return await pagesAPI.getBySlug(slug);
  } catch (error) {
    // If pages API doesn't work, create mock data for development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Pages API not available, using mock data for development');
      return {
        id: 1,
        title: `Dynamic Page: ${slug}`,
        slug: slug,
        template: 'homepage',
        status: 'published',
        sections: [
          {
            type: 'hero',
            props: {
              title: 'Welcome to Our Dynamic Page',
              subtitle: 'This is a demo page created with our CMS system',
              posts: []
            }
          },
          {
            type: 'featured-posts',
            props: {
              title: 'Featured Content',
              posts: []
            }
          }
        ]
      };
    }
    throw error;
  }
};

api.getPosts = async (page = 1, limit = 10, filters = {}) => {
  return await postsAPI.getPosts({ page, pageSize: limit, ...filters });
};

api.getPostById = async (id) => {
  return await postsAPI.getPostById(id);
};

api.getPostsByCategory = async (categoryId, page = 1, limit = 10) => {
  return await postsAPI.getPosts({ categoryId, page, pageSize: limit });
};

api.getTrendingArticles = async (limit = 5) => {
  return await postsAPI.getPosts({ pageSize: limit, sortBy: 'views', sortOrder: 'desc' });
};

api.getCategories = async () => {
  return await categoryAPI.getCategories();
};

api.getTags = async () => {
  return await adminAPI.getTags();
};

// Export role mapping functions for use in components
export { mapToNewRoleSystem, mapFromNewRoleSystem };
