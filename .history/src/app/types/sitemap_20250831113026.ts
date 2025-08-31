// types/sitemap.ts - Shared TypeScript types

export interface Analysis {
  id: string
  slug: string
  username: string
  ticker: string
  title?: string
  created_at: string
  updated_at: string
  status: 'published' | 'draft' | 'archived'
  view_count?: number
  priority?: number
}

export interface Winner {
  id: string
  analysis_id: string
  date: string
  updated_at: string
  type: 'daily' | 'weekly' | 'monthly'
}

export interface User {
  username: string
  display_name?: string
  updated_at: string
  analysis_count: number
  follower_count?: number
  verified?: boolean
}

export interface SitemapUrl {
  loc: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: string
}

export interface SitemapConfig {
  baseUrl: string
  maxUrls: number
  cacheTime: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    hasNext: boolean
  }
}

// API endpoint response types
export interface AnalysesApiResponse extends ApiResponse<Analysis[]> {}
export interface WinnersApiResponse extends ApiResponse<Winner[]> {}
export interface UsersApiResponse extends ApiResponse<User[]> {}

// Sitemap notification types
export interface SitemapNotification {
  sitemap_url: string
  search_engine: 'google' | 'bing' | 'yandex'
  status: 'success' | 'failed' | 'pending'
  submitted_at: string
  response_code?: number
}

export interface SitemapQueueItem {
  id: number
  content_type: 'analysis' | 'winner' | 'user'
  content_id: string
  action: 'created' | 'updated' | 'published' | 'deleted'
  processed: boolean
  created_at: string
  processed_at?: string
}
