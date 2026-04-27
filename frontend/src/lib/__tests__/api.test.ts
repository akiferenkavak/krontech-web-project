// frontend/src/lib/__tests__/api.test.ts

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getProducts, getBlogPosts, getBlogPostBySlug, getProductBySlug } from '@/lib/api';

const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockProductList = [
  {
    id: 'prod-1',
    slug: 'pam-kron',
    category: 'identity-access',
    isActive: true,
    sortOrder: 0,
    parentId: null,
    featuredImageUrl: null,
    title: 'PAM Kron',
    shortDescription: 'Privileged Access Management',
  },
];

const mockPagedBlogPosts = {
  content: [
    {
      id: 'post-1',
      slug: 'zero-trust-mimarisi',
      title: 'Zero Trust Architecture',
      excerpt: 'Overview',
      featuredImageUrl: null,
      authorName: 'Admin',
      tags: [],
      publishedAt: '2025-01-01T00:00:00',
      featured: true,
    },
  ],
  page: 0,
  size: 10,
  totalElements: 1,
  totalPages: 1,
  last: true,
};

describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('calls correct endpoint with locale', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProductList,
      });

      await getProducts('en');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/products?lang=en'),
        expect.any(Object)
      );
    });

    it('returns parsed product list', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProductList,
      });

      const result = await getProducts('en');

      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('pam-kron');
    });

    it('calls with Turkish locale correctly', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await getProducts('tr');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('lang=tr'),
        expect.any(Object)
      );
    });

    it('throws error on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(getProducts('en')).rejects.toThrow('API error: 500');
    });
  });

  describe('getBlogPosts', () => {
    it('calls correct endpoint with pagination params', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPagedBlogPosts,
      });

      await getBlogPosts('en', 0, 10);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/blog-posts?lang=en&page=0&size=10'),
        expect.any(Object)
      );
    });

    it('returns paged response structure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPagedBlogPosts,
      });

      const result = await getBlogPosts('en', 0, 10);

      expect(result.content).toHaveLength(1);
      expect(result.totalPages).toBe(1);
      expect(result.page).toBe(0);
    });

    it('throws error on 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getBlogPosts('en', 0, 10)).rejects.toThrow('API error: 404');
    });
  });

  describe('getBlogPostBySlug', () => {
    it('calls correct slug endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'post-1', slug: 'test-post', translations: [] }),
      });

      await getBlogPostBySlug('test-post', 'en');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/blog-posts/slug/test-post'),
        expect.any(Object)
      );
    });
  });

  describe('getProductBySlug', () => {
    it('calls correct slug endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'prod-1', slug: 'pam-kron', translations: [] }),
      });

      await getProductBySlug('pam-kron', 'en');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/products/slug/pam-kron'),
        expect.any(Object)
      );
    });
  });
});