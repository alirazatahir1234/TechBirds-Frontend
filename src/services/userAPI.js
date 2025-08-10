import axios from 'axios';

// User API for the new ASP.NET Core Identity system
const userAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for adding auth tokens
userAPI.interceptors.request.use(
  (config) => {
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
userAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK') {
      console.error('🔥 Backend connection error - Is your .NET backend running?');
      console.error('Expected URL:', userAPI.defaults.baseURL);
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// New User Management API (replacing Author API)
export const usersAPI = {
  // Get all users (public data only)
  getUsers: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      role: params.role || '',
      status: params.status || '',
      search: params.search || '',
      sortBy: params.sortBy || 'createdAt',
      sortOrder: params.sortOrder || 'desc'
    });
    
    const response = await userAPI.get(`/users?${queryParams}`);
    return response.data;
  },

  // Get user by ID (public data)
  getUserById: async (id) => {
    const response = await userAPI.get(`/users/${id}`);
    return response.data;
  },

  // Get user profile (private data - requires admin role)
  getUserProfile: async (id) => {
    const response = await userAPI.get(`/users/${id}/profile`);
    return response.data;
  },

  // Create new user (admin only)
  createUser: async (userData) => {
    // Map old author fields to new user fields
    const mappedData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      bio: userData.bio || null,
      avatar: userData.avatar || null,
      website: userData.website || null,
      twitter: userData.twitter || null,
      linkedin: userData.linkedin || null,
      specialization: userData.specialization || null,
      isActive: userData.status?.toLowerCase() === 'active',
      // Map role to the new 6-tier system
      role: mapToNewRoleSystem(userData.role)
    };
    
    const response = await userAPI.post('/users', mappedData);
    return response.data;
  },

  // Update user (admin only)
  updateUser: async (id, userData) => {
    const mappedData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      bio: userData.bio || null,
      avatar: userData.avatar || null,
      website: userData.website || null,
      twitter: userData.twitter || null,
      linkedin: userData.linkedin || null,
      specialization: userData.specialization || null,
      isActive: userData.status?.toLowerCase() === 'active',
      role: mapToNewRoleSystem(userData.role)
    };

    // Only include password if provided
    if (userData.password && userData.password.trim()) {
      mappedData.password = userData.password;
    }
    
    const response = await userAPI.put(`/users/${id}`, mappedData);
    return response.data;
  },

  // Delete user (admin only)
  deleteUser: async (id) => {
    const response = await userAPI.delete(`/users/${id}`);
    return response.data;
  },

  // Get user's articles
  getUserArticles: async (userId, params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      status: params.status || 'published'
    });
    
    const response = await userAPI.get(`/users/${userId}/articles?${queryParams}`);
    return response.data;
  },

  // Get user statistics
  getUserStats: async (userId) => {
    const response = await userAPI.get(`/users/${userId}/stats`);
    return response.data;
  },

  // Update user role (admin only)
  updateUserRole: async (userId, role) => {
    const response = await userAPI.patch(`/users/${userId}/role`, { 
      role: mapToNewRoleSystem(role) 
    });
    return response.data;
  },

  // Toggle user status (admin only)
  toggleUserStatus: async (userId, isActive) => {
    const response = await userAPI.patch(`/users/${userId}/status`, { isActive });
    return response.data;
  },

  // Search users
  searchUsers: async (query, filters = {}) => {
    const queryParams = new URLSearchParams({
      q: query,
      role: filters.role || '',
      isActive: filters.isActive !== undefined ? filters.isActive : '',
      page: filters.page || 1,
      pageSize: filters.pageSize || 10
    });
    
    const response = await userAPI.get(`/users/search?${queryParams}`);
    return response.data;
  }
};

// Role System Mapping
// Map old 3-tier system (author, editor, admin) to new 6-tier system
const mapToNewRoleSystem = (oldRole) => {
  const roleMapping = {
    'author': 'Contributor',     // Basic content creation
    'editor': 'Editor',          // Content editing and review
    'admin': 'Administrator',    // Full system access
    'contributor': 'Contributor',
    'reviewer': 'Reviewer',
    'moderator': 'Moderator',
    'administrator': 'Administrator',
    'superadmin': 'SuperAdmin'
  };
  
  return roleMapping[oldRole?.toLowerCase()] || 'Contributor';
};

// Map new roles back to simple display format
const mapFromNewRoleSystem = (newRole) => {
  const displayMapping = {
    'Contributor': 'Author',
    'Reviewer': 'Reviewer', 
    'Moderator': 'Moderator',
    'Editor': 'Editor',
    'Administrator': 'Admin',
    'SuperAdmin': 'Super Admin'
  };
  
  return displayMapping[newRole] || 'Author';
};

// Role hierarchy for permissions checking
export const roleHierarchy = {
  'Contributor': 1,
  'Reviewer': 2,
  'Moderator': 3,
  'Editor': 4,
  'Administrator': 5,
  'SuperAdmin': 6
};

// Check if user has required role level
export const hasMinimumRole = (userRole, requiredRole) => {
  return (roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0);
};

// Enhanced Articles API (updated to use userId instead of authorId)
export const enhancedArticlesAPI = {
  // Get all articles with user data
  getArticles: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      userId: params.userId || '', // Changed from authorId
      categoryId: params.categoryId || '',
      status: params.status || 'published',
      featured: params.featured || '',
      search: params.search || '',
      tags: params.tags || '',
      sortBy: params.sortBy || 'publishedAt',
      sortOrder: params.sortOrder || 'desc'
    });
    
    const response = await userAPI.get(`/articles?${queryParams}`);
    return response.data;
  },

  // Get article by ID with user data
  getArticleById: async (id) => {
    const response = await userAPI.get(`/articles/${id}`);
    return response.data;
  },

  // Create new article
  createArticle: async (articleData) => {
    // Ensure we use userId instead of authorId
    const mappedData = {
      ...articleData,
      userId: articleData.userId || articleData.authorId // Support both for transition
    };
    delete mappedData.authorId; // Remove old field
    
    const response = await userAPI.post('/articles', mappedData);
    return response.data;
  },

  // Update article
  updateArticle: async (id, articleData) => {
    const mappedData = {
      ...articleData,
      userId: articleData.userId || articleData.authorId
    };
    delete mappedData.authorId;
    
    const response = await userAPI.put(`/articles/${id}`, mappedData);
    return response.data;
  }
};

// Backward compatibility wrapper for existing code
export const legacyAuthorAPI = {
  // Wrapper methods to maintain compatibility with existing AuthorsManager
  getAuthors: async () => {
    try {
      const response = await usersAPI.getUsers({ role: 'all' });
      
      // Transform user data to match old author structure
      const authors = response.users ? response.users : response;
      return authors.map(user => ({
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
      console.warn('New users API not available, falling back to old authors API');
      throw error;
    }
  },

  createAuthor: async (authorData) => {
    return await usersAPI.createUser(authorData);
  },

  updateAuthor: async (id, authorData) => {
    return await usersAPI.updateUser(id, authorData);
  },

  deleteAuthor: async (id) => {
    return await usersAPI.deleteUser(id);
  },

  getAuthorById: async (id) => {
    try {
      const user = await usersAPI.getUserById(id);
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
      console.warn('User not found via new API');
      throw error;
    }
  }
};

export default userAPI;
export { mapToNewRoleSystem, mapFromNewRoleSystem };
