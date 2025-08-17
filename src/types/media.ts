// Media Library Types aligned with backend DTO
export type MediaItem = {
  id: string;
  url: string;                // e.g. /uploads/yyyy/MM/file.ext
  thumbnailUrl?: string | null;
  fileName: string;
  originalFileName: string;
  mimeType: string;
  size: number;
  width?: number | null;
  height?: number | null;
  title: string;
  altText?: string | null;
  caption?: string | null;
  description?: string | null;
  uploadedByUserId: string;
  createdAt: string;
  updatedAt?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
};

export type MediaPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type MediaListResponse = {
  items: MediaItem[];
  pagination: MediaPagination;
};
