// API methods for page management
export const pageAPI = {
  /**
   * Get all pages
   */
  getPages: async (page = 1, pageSize = 10, status = null) => {
    try {
      const params = { page, pageSize };
      if (status) params.status = status;
      
      const response = await api.get('/pages', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching pages:', error);
      
      // For development, return mock data if API fails
      return {
        pages: [
          {
            id: 1,
            title: 'Homepage',
            slug: 'homepage',
            template: 'homepage',
            status: 'published',
            createdAt: '2025-08-15T10:30:00Z',
            updatedAt: '2025-08-15T10:30:00Z'
          },
          {
            id: 2,
            title: 'About Us',
            slug: 'about',
            template: 'default',
            status: 'published',
            createdAt: '2025-08-14T09:15:00Z',
            updatedAt: '2025-08-14T09:15:00Z'
          }
        ],
        total: 2,
        totalPages: 1,
        currentPage: 1
      };
    }
  },
  
  /**
   * Get page by ID
   */
  getPageById: async (id) => {
    try {
      const response = await api.get(`/pages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching page with ID ${id}:`, error);
      
      // For development, return mock data if API fails
      return {
        id: parseInt(id),
        title: 'Sample Page',
        slug: 'sample-page',
        template: 'default',
        status: 'published',
        sections: [
          {
            type: 'hero',
            props: {
              title: '',
              subtitle: '',
              posts: [],
              layout: 'standard',
              showExcerpt: true,
              showAuthor: true,
              showDate: true,
              maxPosts: 2
            }
          },
          {
            type: 'post-grid',
            props: {
              title: 'Latest Articles',
              subtitle: '',
              posts: [],
              columns: 3,
              limit: 6,
              showViewMore: true,
              sortBy: 'date'
            }
          }
        ],
        createdAt: '2025-08-15T10:30:00Z',
        updatedAt: '2025-08-15T10:30:00Z'
      };
    }
  },
  
  /**
   * Get page by slug
   */
  getPageBySlug: async (slug) => {
    try {
      const response = await api.get(`/pages/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching page with slug ${slug}:`, error);
      
      // For development, return mock data if API fails
      if (slug === 'homepage') {
        return {
          id: 1,
          title: 'Homepage',
          slug: 'homepage',
          template: 'homepage',
          status: 'published',
          sections: [
            {
              type: 'hero',
              props: {
                title: '',
                subtitle: '',
                posts: [],
                layout: 'standard',
                showExcerpt: true,
                showAuthor: true,
                showDate: true,
                maxPosts: 2
              }
            },
            {
              type: 'featured-posts',
              props: {
                title: 'Featured Articles',
                subtitle: '',
                posts: [],
                layout: 'default',
                limit: 3,
                showImage: true,
                showExcerpt: true
              }
            },
            {
              type: 'post-grid',
              props: {
                title: 'Latest Articles',
                subtitle: '',
                posts: [],
                columns: 3,
                limit: 6,
                showViewMore: true,
                sortBy: 'date'
              }
            },
            {
              type: 'sidebar',
              props: {
                widgets: [
                  {
                    type: 'trending',
                    title: 'Trending Now',
                    posts: []
                  },
                  {
                    type: 'newsletter',
                    title: 'Stay Updated',
                    description: 'Get the latest news delivered to your inbox'
                  }
                ]
              }
            }
          ],
          createdAt: '2025-08-15T10:30:00Z',
          updatedAt: '2025-08-15T10:30:00Z'
        };
      }
      
      throw error;
    }
  },
  
  /**
   * Create new page
   */
  createPage: async (pageData) => {
    try {
      const response = await api.post('/pages', pageData);
      return response.data;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  },
  
  /**
   * Update page
   */
  updatePage: async (id, pageData) => {
    try {
      const response = await api.put(`/pages/${id}`, pageData);
      return response.data;
    } catch (error) {
      console.error(`Error updating page with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete page
   */
  deletePage: async (id) => {
    try {
      const response = await api.delete(`/pages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting page with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Set page status (publish or unpublish)
   */
  setPageStatus: async (id, status) => {
    try {
      const response = await api.patch(`/pages/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating page status for ID ${id}:`, error);
      throw error;
    }
  }
};

// Update adminAPI to include page management methods
export const adminAPI = {
  ...adminAPI, // Keep existing methods
  
  // Pages
  getPages: pageAPI.getPages,
  getPageById: pageAPI.getPageById,
  getPageBySlug: pageAPI.getPageBySlug,
  createPage: pageAPI.createPage,
  updatePage: pageAPI.updatePage,
  deletePage: pageAPI.deletePage,
  setPageStatus: pageAPI.setPageStatus
};

// Public API
export const api = {
  ...api, // Keep existing methods
  
  // Pages
  getPageBySlug: pageAPI.getPageBySlug
};
