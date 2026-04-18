const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ---------- Types ----------

export interface ProductSummary {
  id: string;
  slug: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  parentId: string | null;
  featuredImageUrl: string | null;
  title: string | null;
  shortDescription: string | null;
}

export interface ProductTranslation {
  id: string;
  languageCode: string;
  languageName: string;
  title: string;
  shortDescription: string | null;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status: string;
  publishedAt: string | null;
}

export interface ProductDetail {
  id: string;
  slug: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  parentId: string | null;
  featuredImageUrl: string | null;
  translations: ProductTranslation[];
  children: ProductSummary[];
}

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: string;
  tags: string[];
}

export interface BlogPostDetail extends BlogPostSummary {
  body: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// ---------- Products ----------

export function getProducts(locale: string): Promise<ProductSummary[]> {
  return apiFetch(`/products?lang=${locale}`);
}

export function getProductBySlug(slug: string, locale: string): Promise<ProductDetail> {
  return apiFetch(`/products/slug/${slug}?lang=${locale}`);
}

// ---------- Blog ----------

export function getBlogPosts(
  locale: string,
  page = 0,
  size = 10
): Promise<PagedResponse<BlogPostSummary>> {
  return apiFetch(`/blog-posts?lang=${locale}&page=${page}&size=${size}`);
}

export function getBlogPostBySlug(slug: string, locale: string): Promise<BlogPostDetail> {
  return apiFetch(`/blog-posts/${slug}?lang=${locale}`);
}