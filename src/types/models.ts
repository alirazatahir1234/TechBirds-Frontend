// ===============================
// TechBirds - Article & Post Models
// TypeScript Definitions
// ===============================

// ===============================
// Core Author Interface
// ===============================
export interface Author {
  id: number;
  firstName?: string;
  lastName?: string;
  name: string;
  fullName?: string;
  email: string;
  bio?: string;
  avatar?: string;
  
  // Professional Info
  specialization?: string;
  role?: 'Author' | 'Editor' | 'Admin' | 'Contributor';
  website?: string;
  twitter?: string;
  linkedin?: string;
  
  // Status & Metadata
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
  updatedAt?: string;
  joinedAt?: string;
  
  // Statistics
  articleCount?: number;
  totalViews?: number;
}

// ===============================
// Category Interface
// ===============================
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  
  // Hierarchy
  parentId?: number;
  parent?: Category;
  children?: Category[];
  
  // Metadata
  postCount: number;
  createdAt: string;
  updatedAt?: string;
  
  // Display Properties
  isActive?: boolean;
  sortOrder?: number;
}

// ===============================
// Article Interface (Public Content)
// ===============================
export interface Article {
  // Core Properties
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  
  // Media & Visual
  imageUrl?: string;
  featuredImage?: string;
  
  // Content Organization
  category: string | Category;
  tags?: string[];
  
  // Author Information
  author: Author;
  
  // Publishing & Status
  publishedAt: string; // ISO string
  updatedAt?: string;
  status: 'published' | 'draft' | 'scheduled';
  
  // Engagement Metrics
  views?: number;
  readTime: number; // in minutes
  likes?: number;
  dislikes?: number;
  
  // Features & Settings
  featured?: boolean;
  allowComments?: boolean;
  
  // SEO & Meta
  metaDescription?: string;
  metaKeywords?: string;
  
  // Computed Properties
  relatedArticles?: Article[];
}

// ===============================
// Post Interface (Admin Content Management)
// ===============================
export interface Post {
  // Core Properties
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  
  // Media & Visual
  featuredImage?: string;
  imageUrl?: string;
  
  // Content Organization
  category: string | Category;
  categoryId?: number;
  tags: string[];
  
  // User Information (Updated for ASP.NET Core Identity system)
  user: string | Author;  // ✨ NEW: Changed from author to user (uses Author type for compatibility)
  userId: number;         // ✨ NEW: Changed from authorId to userId
  
  // Legacy Support (for backward compatibility)
  author?: string | Author; // ❌ DEPRECATED: Use user instead
  authorId?: number;        // ❌ DEPRECATED: Use userId instead
  
  // Publishing & Status
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  publishedAt?: string; // ISO string
  scheduledAt?: string;
  createdAt: string;
  updatedAt?: string;
  
  // Admin Features
  featured: boolean;
  allowComments: boolean;
  sticky?: boolean;
  
  // Engagement Metrics
  views: number;
  comments: number;
  likes?: number;
  
  // SEO & Meta
  metaDescription?: string;
  metaKeywords?: string;
  readTime?: number;
  
  // Admin Properties
  lastEditedBy?: string;
  revisionNumber?: number;
  isDraft?: boolean;
}

// ===============================
// Comment Interface - NEW structure compatible with ASP.NET Core Identity
// ===============================
export interface Comment {
  id: number;
  articleId?: number;    // Optional - for article comments
  postId?: number;       // Optional - for post comments  
  content: string;       // Max 2000 characters
  createdAt: string;
  updatedAt?: string;    // NEW - tracks edits
  isApproved: boolean;   // NEW - moderation support
  user: {                // NEW - full user object instead of authorName
    id: string;
    name: string;
    avatar?: string;
    specialization?: string;
  };
  
  // Legacy Support (DEPRECATED - for backward compatibility only)
  author?: {             // ❌ DEPRECATED: Use user instead
    name: string;
    email: string;
    avatar?: string;
  };
  post?: {               // ❌ DEPRECATED: Use articleId/postId instead
    id: number;
    title: string;
    slug: string;
  };
  status?: 'pending' | 'approved' | 'spam' | 'rejected'; // ❌ DEPRECATED: Use isApproved
  likes?: number;        // ❌ DEPRECATED: Not supported in new API
  dislikes?: number;     // ❌ DEPRECATED: Not supported in new API
  replies?: Comment[];   // ❌ DEPRECATED: Not supported in new API
  ipAddress?: string;    // ❌ DEPRECATED: Not exposed in new API
  userAgent?: string;    // ❌ DEPRECATED: Not exposed in new API
  reported?: boolean;    // ❌ DEPRECATED: Not supported in new API
  parentId?: number;     // ❌ DEPRECATED: Not supported in new API
  isAuthor?: boolean;    // ❌ DEPRECATED: Not supported in new API
}

// Comment creation request
export interface CreateCommentRequest {
  content: string;       // Required, max 2000 chars
  articleId?: number;    // Either articleId OR postId required
  postId?: number;       // Either articleId OR postId required
}

// Comment update request
export interface UpdateCommentRequest {
  content: string;       // Required, max 2000 chars
}

// ===============================
// Newsletter Interfaces
// ===============================
export interface NewsletterSubscriber {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  
  // Subscription Info
  status: 'active' | 'unsubscribed' | 'bounced';
  subscribedAt: string;
  unsubscribedAt?: string;
  
  // Preferences
  categories?: string[];
  frequency?: 'daily' | 'weekly' | 'monthly';
  
  // Metadata
  source?: string;
  ipAddress?: string;
  confirmationToken?: string;
  confirmed: boolean;
}

export interface Campaign {
  id: number;
  title: string;
  subject: string;
  content: string;
  
  // Campaign Info
  type: 'newsletter' | 'announcement' | 'digest';
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled';
  
  // Scheduling
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
  
  // Analytics
  recipientCount: number;
  openCount: number;
  clickCount: number;
  unsubscribeCount: number;
  
  // Content
  articles?: Article[];
  template?: string;
}

// ===============================
// API Response Interfaces
// ===============================
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface ArticleListResponse {
  articles: Article[];
  pagination: PaginationMeta;
}

export interface PostListResponse {
  posts: Post[];
  pagination: PaginationMeta;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

// ===============================
// Form Data Interfaces
// ===============================
export interface CreateArticleRequest {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  categoryId: number;
  tags?: string[];
  featured?: boolean;
  allowComments?: boolean;
  status?: 'draft' | 'published' | 'scheduled';
  publishedAt?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  id: number;
}

export interface CreateAuthorRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  specialization?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  role?: string;
  status?: string;
}

export interface UpdateAuthorRequest extends Partial<CreateAuthorRequest> {
  id: number;
  password?: string; // Optional for updates
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  color?: string;
  parentId?: number;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: number;
}

// ===============================
// Search & Filter Interfaces
// ===============================
export interface ArticleFilters {
  category?: string;
  author?: string;
  tags?: string[];
  status?: string;
  featured?: boolean;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface SearchParams {
  query: string;
  filters?: ArticleFilters;
  pagination?: {
    page: number;
    limit: number;
  };
  sort?: {
    field: 'publishedAt' | 'views' | 'title' | 'createdAt';
    order: 'asc' | 'desc';
  };
}

export interface SearchResponse {
  articles: Article[];
  totalResults: number;
  searchTime: number;
  suggestions?: string[];
  pagination: PaginationMeta;
}

// ===============================
// Statistics Interfaces
// ===============================
export interface ArticleStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  scheduledArticles: number;
  totalViews: number;
  totalComments: number;
  popularArticles: Article[];
  recentArticles: Article[];
}

export interface AuthorStats {
  totalAuthors: number;
  activeAuthors: number;
  topAuthors: Author[];
  authorPerformance: {
    userId: number;      // ✨ NEW: Changed from authorId to userId
    authorId?: number;   // ❌ DEPRECATED: For backward compatibility
    articleCount: number;
    totalViews: number;
    avgViews: number;
  }[];
}

export interface DashboardStats {
  articles: ArticleStats;
  authors: AuthorStats;
  categories: {
    totalCategories: number;
    categoryDistribution: {
      category: string;
      postCount: number;
      percentage: number;
    }[];
  };
  newsletter: {
    totalSubscribers: number;
    recentSubscribers: NewsletterSubscriber[];
    campaignStats: {
      sent: number;
      scheduled: number;
      drafts: number;
    };
  };
}

// ===============================
// Utility Types
// ===============================
export type ArticleStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type UserRole = 'Author' | 'Editor' | 'Admin' | 'Contributor';
export type UserStatus = 'Active' | 'Inactive' | 'Suspended';
export type CommentStatus = 'pending' | 'approved' | 'spam' | 'rejected';

// ===============================
// Database Entity Interfaces (for backend)
// ===============================
export interface PostEntity {
  Id: number;
  Title: string;
  Slug: string;
  Content: string;
  Excerpt?: string;
  FeaturedImage?: string;
  CategoryId?: number;
  UserId: number;       // ✨ NEW: Changed from AuthorId to UserId
  AuthorId?: number;    // ❌ DEPRECATED: For backward compatibility
  Status: string;
  Featured: boolean;
  AllowComments: boolean;
  ViewCount: number;
  PublishedAt?: Date;
  CreatedAt: Date;
  UpdatedAt?: Date;
  MetaDescription?: string;
  MetaKeywords?: string;
  ReadTime?: number;
}

export interface AuthorEntity {
  Id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Password: string;
  Bio?: string;
  Avatar?: string;
  Specialization?: string;
  Website?: string;
  Twitter?: string;
  LinkedIn?: string;
  Status: string;
  Role: string;
  CreatedAt: Date;
  UpdatedAt?: Date;
}

export interface CategoryEntity {
  Id: number;
  Name: string;
  Slug: string;
  Description?: string;
  Color: string;
  ParentId?: number;
  PostCount: number;
  CreatedAt: Date;
  UpdatedAt?: Date;
}

// ===============================
// Export all interfaces (no need for explicit export type)
// ===============================
