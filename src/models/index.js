// ===============================
// TechBirds - Article & Post Models
// JavaScript Implementation
// ===============================

/**
 * Author Class - Represents article authors and users
 */
export class Author {
  constructor(data = {}) {
    // Core Properties
    this.id = data.id || null;
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.name = data.name || data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim();
    this.fullName = data.fullName || `${this.firstName} ${this.lastName}`.trim() || this.name;
    this.email = data.email || '';
    this.bio = data.bio || '';
    this.avatar = data.avatar || this.getRandomAvatar();
    
    // Professional Info
    this.specialization = data.specialization || '';
    this.role = data.role || 'Author';
    this.website = data.website || '';
    this.twitter = data.twitter || '';
    this.linkedin = data.linkedin || '';
    
    // Status & Metadata
    this.status = data.status || 'Active';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || null;
    this.joinedAt = data.joinedAt || this.createdAt;
    
    // Statistics
    this.articleCount = data.articleCount || 0;
    this.totalViews = data.totalViews || 0;
  }

  getRandomAvatar() {
    const avatars = [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face'
    ];
    return avatars[Math.floor(Math.random() * avatars.length)];
  }

  getDisplayName() {
    return this.fullName || this.name || `${this.firstName} ${this.lastName}`.trim();
  }

  isActive() {
    return this.status === 'Active';
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      name: this.name,
      fullName: this.fullName,
      email: this.email,
      bio: this.bio,
      avatar: this.avatar,
      specialization: this.specialization,
      role: this.role,
      website: this.website,
      twitter: this.twitter,
      linkedin: this.linkedin,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      articleCount: this.articleCount,
      totalViews: this.totalViews
    };
  }
}

/**
 * Category Class - Represents content categories
 */
export class Category {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.slug = data.slug || this.generateSlug(data.name || '');
    this.description = data.description || '';
    this.color = data.color || '#3B82F6';
    
    // Hierarchy
    this.parentId = data.parentId || null;
    this.parent = data.parent || null;
    this.children = data.children || [];
    
    // Metadata
    this.postCount = data.postCount || 0;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || null;
    
    // Display Properties
    this.isActive = data.isActive !== false; // default true
    this.sortOrder = data.sortOrder || 0;
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      description: this.description,
      color: this.color,
      parentId: this.parentId,
      postCount: this.postCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive,
      sortOrder: this.sortOrder
    };
  }
}

/**
 * Article Class - Represents published articles (public-facing)
 */
export class Article {
  constructor(data = {}) {
    // Core Properties
    this.id = data.id || null;
    this.title = data.title || '';
    this.slug = data.slug || this.generateSlug(data.title || '');
    this.content = data.content || '';
    this.excerpt = data.excerpt || this.generateExcerpt(data.content || '');
    
    // Media & Visual
    this.imageUrl = data.imageUrl || data.featuredImage || null;
    this.featuredImage = data.featuredImage || data.imageUrl || null;
    
    // Content Organization
    this.category = data.category || '';
    this.tags = Array.isArray(data.tags) ? data.tags : [];
    
    // Author Information
    this.author = data.author instanceof Author ? data.author : new Author(data.author || {});
    
    // Publishing & Status
    this.publishedAt = data.publishedAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || null;
    this.status = data.status || 'published';
    
    // Engagement Metrics
    this.views = data.views || 0;
    this.readTime = data.readTime || this.calculateReadTime(this.content);
    this.likes = data.likes || 0;
    this.dislikes = data.dislikes || 0;
    
    // Features & Settings
    this.featured = data.featured || false;
    this.allowComments = data.allowComments !== false; // default true
    
    // SEO & Meta
    this.metaDescription = data.metaDescription || this.excerpt.substring(0, 160);
    this.metaKeywords = data.metaKeywords || this.tags.join(', ');
    
    // Computed Properties
    this.relatedArticles = data.relatedArticles || [];
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  generateExcerpt(content, length = 200) {
    const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML
    return textContent.length > length ? 
      textContent.substring(0, length) + '...' : 
      textContent;
  }

  calculateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute) || 1;
  }

  getFormattedDate(format = 'short') {
    const date = new Date(this.publishedAt);
    if (format === 'short') {
      return date.toLocaleDateString();
    } else if (format === 'long') {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    return date.toISOString();
  }

  isPublished() {
    return this.status === 'published' && new Date(this.publishedAt) <= new Date();
  }

  isFeatured() {
    return this.featured === true;
  }

  getUrl() {
    return `/article/${this.id}`;
  }

  getCategoryUrl() {
    const categorySlug = typeof this.category === 'string' ? 
      this.category.toLowerCase() : 
      this.category.slug;
    return `/category/${categorySlug}`;
  }

  getAuthorUrl() {
    return `/author/${this.author.id}`;
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      content: this.content,
      excerpt: this.excerpt,
      imageUrl: this.imageUrl,
      category: this.category,
      tags: this.tags,
      author: this.author.toJSON ? this.author.toJSON() : this.author,
      publishedAt: this.publishedAt,
      updatedAt: this.updatedAt,
      status: this.status,
      views: this.views,
      readTime: this.readTime,
      likes: this.likes,
      featured: this.featured,
      allowComments: this.allowComments,
      metaDescription: this.metaDescription,
      metaKeywords: this.metaKeywords
    };
  }
}

/**
 * Post Class - Represents admin-managed posts (content management)
 */
export class Post {
  constructor(data = {}) {
    // Core Properties
    this.id = data.id || null;
    this.title = data.title || '';
    this.slug = data.slug || this.generateSlug(data.title || '');
    this.content = data.content || '';
    this.excerpt = data.excerpt || this.generateExcerpt(data.content || '');
    
    // Media & Visual
    this.featuredImage = data.featuredImage || data.imageUrl || null;
    this.imageUrl = data.imageUrl || data.featuredImage || null;
    
    // Content Organization
    this.category = data.category || '';
    this.categoryId = data.categoryId || null;
    this.tags = Array.isArray(data.tags) ? data.tags : [];
    
    // User Information (Updated for ASP.NET Core Identity)
    this.user = data.user || data.author || '';           // ✨ NEW: Support both user and author
    this.userId = data.userId || data.authorId || null;   // ✨ NEW: Support both userId and authorId
    
    // Legacy Support (for backward compatibility)
    this.author = data.author || data.user || '';         // ❌ DEPRECATED: Use user instead
    this.authorId = data.authorId || data.userId || null; // ❌ DEPRECATED: Use userId instead
    
    // Publishing & Status
    this.status = data.status || 'draft';
    this.publishedAt = data.publishedAt || null;
    this.scheduledAt = data.scheduledAt || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || null;
    
    // Admin Features
    this.featured = data.featured || false;
    this.allowComments = data.allowComments !== false; // default true
    this.sticky = data.sticky || false;
    
    // Engagement Metrics
    this.views = data.views || 0;
    this.comments = data.comments || 0;
    this.likes = data.likes || 0;
    
    // SEO & Meta
    this.metaDescription = data.metaDescription || '';
    this.metaKeywords = data.metaKeywords || '';
    this.readTime = data.readTime || this.calculateReadTime(this.content);
    
    // Admin Properties
    this.lastEditedBy = data.lastEditedBy || null;
    this.revisionNumber = data.revisionNumber || 1;
    this.isDraft = this.status === 'draft';
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  generateExcerpt(content, length = 200) {
    const textContent = content.replace(/<[^>]*>/g, ''); // Strip HTML
    return textContent.length > length ? 
      textContent.substring(0, length) + '...' : 
      textContent;
  }

  calculateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute) || 1;
  }

  // Status Management Methods
  publish() {
    this.status = 'published';
    this.publishedAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
    this.isDraft = false;
    return this;
  }

  saveDraft() {
    this.status = 'draft';
    this.updatedAt = new Date().toISOString();
    this.isDraft = true;
    return this;
  }

  schedule(publishDate) {
    this.status = 'scheduled';
    this.scheduledAt = publishDate;
    this.updatedAt = new Date().toISOString();
    this.isDraft = false;
    return this;
  }

  archive() {
    this.status = 'archived';
    this.updatedAt = new Date().toISOString();
    return this;
  }

  // Convert Post to Article for public consumption
  toArticle() {
    return new Article({
      id: this.id,
      title: this.title,
      slug: this.slug,
      content: this.content,
      excerpt: this.excerpt,
      imageUrl: this.featuredImage,
      category: this.category,
      tags: this.tags,
      author: this.author,
      publishedAt: this.publishedAt,
      updatedAt: this.updatedAt,
      status: this.status,
      views: this.views,
      readTime: this.readTime,
      likes: this.likes,
      featured: this.featured,
      allowComments: this.allowComments,
      metaDescription: this.metaDescription,
      metaKeywords: this.metaKeywords
    });
  }

  // Check if post can be published
  canPublish() {
    return this.title.trim() && 
           this.content.trim() && 
           this.categoryId && 
           (this.userId || this.authorId); // ✨ Support both userId and authorId
  }

  // Get status badge color for UI
  getStatusColor() {
    const colors = {
      'draft': 'yellow',
      'published': 'green',
      'scheduled': 'blue',
      'archived': 'gray'
    };
    return colors[this.status] || 'gray';
  }

  // Get formatted publish date
  getFormattedPublishDate() {
    if (!this.publishedAt) return 'Not published';
    return new Date(this.publishedAt).toLocaleDateString();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      slug: this.slug,
      content: this.content,
      excerpt: this.excerpt,
      featuredImage: this.featuredImage,
      category: this.category,
      categoryId: this.categoryId,
      tags: this.tags,
      
      // User information (new system)
      user: this.user,           // ✨ NEW: Using user instead of author
      userId: this.userId,       // ✨ NEW: Using userId instead of authorId
      
      // Legacy support (for backward compatibility)
      author: this.author,       // ❌ DEPRECATED: Use user instead
      authorId: this.authorId,   // ❌ DEPRECATED: Use userId instead
      
      status: this.status,
      publishedAt: this.publishedAt,
      scheduledAt: this.scheduledAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      featured: this.featured,
      allowComments: this.allowComments,
      sticky: this.sticky,
      views: this.views,
      comments: this.comments,
      likes: this.likes,
      metaDescription: this.metaDescription,
      metaKeywords: this.metaKeywords,
      readTime: this.readTime,
      lastEditedBy: this.lastEditedBy,
      revisionNumber: this.revisionNumber
    };
  }
}

/**
 * Comment Class - Represents article comments
 */
export class Comment {
  constructor(data = {}) {
    this.id = data.id || null;
    this.content = data.content || '';
    
    // Author Info
    this.author = {
      name: data.author?.name || '',
      email: data.author?.email || '',
      avatar: data.author?.avatar || null
    };
    
    // Post Association
    this.post = {
      id: data.post?.id || null,
      title: data.post?.title || '',
      slug: data.post?.slug || ''
    };
    
    // Status & Moderation
    this.status = data.status || 'pending';
    
    // Engagement
    this.likes = data.likes || 0;
    this.dislikes = data.dislikes || 0;
    this.replies = data.replies || [];
    
    // Metadata
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || null;
    this.ipAddress = data.ipAddress || null;
    this.userAgent = data.userAgent || null;
    this.reported = data.reported || false;
    
    // Hierarchy
    this.parentId = data.parentId || null;
    this.isAuthor = data.isAuthor || false;
  }

  approve() {
    this.status = 'approved';
    this.updatedAt = new Date().toISOString();
    return this;
  }

  reject() {
    this.status = 'rejected';
    this.updatedAt = new Date().toISOString();
    return this;
  }

  markAsSpam() {
    this.status = 'spam';
    this.updatedAt = new Date().toISOString();
    return this;
  }

  isApproved() {
    return this.status === 'approved';
  }

  isPending() {
    return this.status === 'pending';
  }

  getFormattedDate() {
    return new Date(this.createdAt).toLocaleDateString();
  }

  toJSON() {
    return {
      id: this.id,
      content: this.content,
      author: this.author,
      post: this.post,
      status: this.status,
      likes: this.likes,
      dislikes: this.dislikes,
      replies: this.replies,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      ipAddress: this.ipAddress,
      reported: this.reported,
      parentId: this.parentId,
      isAuthor: this.isAuthor
    };
  }
}

/**
 * Utility Functions
 */
export const ArticleUtils = {
  // Create Article from API response
  fromApiResponse(apiData) {
    return new Article(apiData);
  },

  // Create array of Articles from API response
  fromApiResponseArray(apiDataArray) {
    return apiDataArray.map(data => new Article(data));
  },

  // Validate article data
  validate(articleData) {
    const errors = [];
    
    if (!articleData.title?.trim()) {
      errors.push("Title is required");
    }
    
    if (!articleData.content?.trim()) {
      errors.push("Content is required");
    }
    
    if (!articleData.category) {
      errors.push("Category is required");
    }
    
    if (!articleData.author) {
      errors.push("Author is required");
    }
    
    return errors;
  },

  // Generate SEO-friendly slug
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  },

  // Calculate estimated read time
  calculateReadTime(content, wordsPerMinute = 200) {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  },

  // Format date for display
  formatDate(dateString, format = 'short') {
    const date = new Date(dateString);
    if (format === 'short') {
      return date.toLocaleDateString();
    } else if (format === 'long') {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } else if (format === 'relative') {
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
      return `${Math.ceil(diffDays / 365)} years ago`;
    }
    return date.toISOString();
  }
};

export const PostUtils = {
  // Create Post from API response
  fromApiResponse(apiData) {
    return new Post(apiData);
  },

  // Create array of Posts from API response
  fromApiResponseArray(apiDataArray) {
    return apiDataArray.map(data => new Post(data));
  },

  // Validate post data
  validate(postData) {
    const errors = [];
    
    if (!postData.title?.trim()) {
      errors.push("Title is required");
    }
    
    if (!postData.content?.trim()) {
      errors.push("Content is required");
    }
    
    if (!postData.categoryId) {
      errors.push("Category is required");
    }
    
    if (!postData.userId && !postData.authorId) {
      errors.push("User is required"); // ✨ Updated: Check both userId and authorId
    }
    
    return errors;
  },

  // Get posts by status
  filterByStatus(posts, status) {
    return posts.filter(post => post.status === status);
  },

  // Get featured posts
  getFeatured(posts) {
    return posts.filter(post => post.featured);
  },

  // Sort posts by date
  sortByDate(posts, order = 'desc') {
    return posts.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt);
      const dateB = new Date(b.publishedAt || b.createdAt);
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }
};

// Export default object with all models
export default {
  Article,
  Post,
  Author,
  Category,
  Comment,
  ArticleUtils,
  PostUtils
};
