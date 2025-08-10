// TypeScript interfaces for the new ASP.NET Core Identity-based system
// These interfaces document the new data models from your backend integration guide

// New User Data Models (replacing Author models)
export interface PublicUserDTO {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  specialization?: string;
  postsCount: number;
  totalViews: number;
  joinedAt: string; // ISO date string
}

export interface PrivateUserDTO extends PublicUserDTO {
  email: string; // Only visible to admins
  isActive: boolean;
  role: UserRole;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// New 6-Tier Role System
export enum UserRole {
  Contributor = 'Contributor',     // Level 1: Basic content creation
  Reviewer = 'Reviewer',           // Level 2: Content review and feedback
  Moderator = 'Moderator',         // Level 3: Content moderation
  Editor = 'Editor',               // Level 4: Content editing and publishing
  Administrator = 'Administrator', // Level 5: System administration
  SuperAdmin = 'SuperAdmin'        // Level 6: Full system access
}

// Role Permissions Interface
export interface RolePermissions {
  canCreateContent: boolean;
  canEditOwnContent: boolean;
  canEditOtherContent: boolean;
  canDeleteOwnContent: boolean;
  canDeleteOtherContent: boolean;
  canModerateComments: boolean;
  canManageUsers: boolean;
  canManageSystem: boolean;
  canViewAnalytics: boolean;
  canManageRoles: boolean;
}

// User Statistics
export interface UserStats {
  articleCount: number;
  postCount: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  commentsReceived: number;
  averageRating: number;
  lastActivityAt: string;
}

// Enhanced Article Model (now references userId instead of authorId)
export interface ArticleDTO {
  id: string;
  title: string;
  content: string;
  summary?: string;
  slug: string;
  featuredImage?: string;
  status: ContentStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  
  // NEW: References user instead of author
  userId: string;
  user: PublicUserDTO; // Populated user data (no email)
  
  // Category and engagement
  categoryId: string;
  category: CategoryDTO;
  tags: string[];
  viewCount: number;
  likeCount: number;
  shareCount: number;
  commentCount: number;
  
  // SEO and metadata
  metaTitle?: string;
  metaDescription?: string;
  allowComments: boolean;
  isFeatured: boolean;
}

// Enhanced Category Model
export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  articleCount: number;
  createdAt: string;
  updatedAt: string;
}

// Content Status Enum
export enum ContentStatus {
  Draft = 'Draft',
  UnderReview = 'UnderReview',
  Published = 'Published',
  Archived = 'Archived',
  Rejected = 'Rejected'
}

// API Response Types
export interface PaginatedResponse<T> {
  items: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  timestamp: string;
}

// Authentication Models
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: PrivateUserDTO;
}

// User Management Models
export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  specialization?: string;
  role: UserRole;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  bio?: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  specialization?: string;
  isActive?: boolean;
}

export interface UpdateUserRoleRequest {
  userId: string;
  role: UserRole;
}

// Search and Filter Models
export interface UserSearchFilters {
  query?: string;
  role?: UserRole;
  isActive?: boolean;
  specialization?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'lastName' | 'postsCount' | 'totalViews';
  sortOrder?: 'asc' | 'desc';
}

export interface ArticleSearchFilters {
  query?: string;
  userId?: string;
  categoryId?: string;
  tags?: string[];
  status?: ContentStatus;
  isFeatured?: boolean;
  publishedAfter?: string;
  publishedBefore?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'publishedAt' | 'createdAt' | 'title' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

// Error Models
export interface ValidationError {
  field: string;
  message: string;
  attemptedValue?: any;
}

export interface ApiError {
  statusCode: number;
  message: string;
  detail?: string;
  validationErrors?: ValidationError[];
  timestamp: string;
  traceId?: string;
}

// Dashboard Statistics
export interface DashboardStats {
  totalUsers: number;
  totalArticles: number;
  totalCategories: number;
  totalViews: number;
  activeUsers: number;
  publishedArticles: number;
  draftArticles: number;
  pendingReviews: number;
  recentActivity: RecentActivity[];
}

export interface RecentActivity {
  id: string;
  type: 'user_registered' | 'article_published' | 'article_created' | 'user_role_changed';
  description: string;
  userId?: string;
  userName?: string;
  timestamp: string;
}

// Legacy Author Model (for backward compatibility)
export interface LegacyAuthorDTO {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  specialization?: string;
  status: 'active' | 'inactive';
  role: 'author' | 'editor' | 'admin';
  postsCount: number;
  totalViews: number;
  createdAt: string;
  updatedAt: string;
}

// Migration Helper Types
export interface MigrationStatus {
  isComplete: boolean;
  migratedUsers: number;
  migratedArticles: number;
  errors: string[];
  startedAt: string;
  completedAt?: string;
}

// Export utility functions for type guards
export const isPublicUser = (user: any): user is PublicUserDTO => {
  return user && typeof user.id === 'string' && typeof user.firstName === 'string';
};

export const isPrivateUser = (user: any): user is PrivateUserDTO => {
  return isPublicUser(user) && 'email' in user && 'role' in user;
};

export const isLegacyAuthor = (author: any): author is LegacyAuthorDTO => {
  return author && typeof author.id === 'string' && typeof author.status === 'string';
};

// Role hierarchy for permission checking
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.Contributor]: 1,
  [UserRole.Reviewer]: 2,
  [UserRole.Moderator]: 3,
  [UserRole.Editor]: 4,
  [UserRole.Administrator]: 5,
  [UserRole.SuperAdmin]: 6
};

// Check if user has minimum required role
export const hasMinimumRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

// Get role permissions
export const getRolePermissions = (role: UserRole): RolePermissions => {
  const basePermissions: RolePermissions = {
    canCreateContent: false,
    canEditOwnContent: false,
    canEditOtherContent: false,
    canDeleteOwnContent: false,
    canDeleteOtherContent: false,
    canModerateComments: false,
    canManageUsers: false,
    canManageSystem: false,
    canViewAnalytics: false,
    canManageRoles: false
  };

  switch (role) {
    case UserRole.SuperAdmin:
      return { ...basePermissions, ...{
        canCreateContent: true,
        canEditOwnContent: true,
        canEditOtherContent: true,
        canDeleteOwnContent: true,
        canDeleteOtherContent: true,
        canModerateComments: true,
        canManageUsers: true,
        canManageSystem: true,
        canViewAnalytics: true,
        canManageRoles: true
      }};
      
    case UserRole.Administrator:
      return { ...basePermissions, ...{
        canCreateContent: true,
        canEditOwnContent: true,
        canEditOtherContent: true,
        canDeleteOwnContent: true,
        canDeleteOtherContent: true,
        canModerateComments: true,
        canManageUsers: true,
        canViewAnalytics: true
      }};
      
    case UserRole.Editor:
      return { ...basePermissions, ...{
        canCreateContent: true,
        canEditOwnContent: true,
        canEditOtherContent: true,
        canDeleteOwnContent: true,
        canModerateComments: true,
        canViewAnalytics: true
      }};
      
    case UserRole.Moderator:
      return { ...basePermissions, ...{
        canCreateContent: true,
        canEditOwnContent: true,
        canDeleteOwnContent: true,
        canModerateComments: true
      }};
      
    case UserRole.Reviewer:
      return { ...basePermissions, ...{
        canCreateContent: true,
        canEditOwnContent: true,
        canDeleteOwnContent: true
      }};
      
    case UserRole.Contributor:
    default:
      return { ...basePermissions, ...{
        canCreateContent: true,
        canEditOwnContent: true
      }};
  }
};
