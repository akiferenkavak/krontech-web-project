import { MetadataRoute } from 'next';
import { getProducts, getBlogPosts } from '@/lib/api';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://krontech.com';
const LOCALES = ['en', 'tr'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // ── 1. Statik sayfalar ───────────────────────────────────────────────────
  const staticPages = ['', '/blog'];

  for (const locale of LOCALES) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: page === '' ? 1.0 : 0.8,
        alternates: {
          languages: {
            en: `${BASE_URL}/en${page}`,
            tr: `${BASE_URL}/tr${page}`,
          },
        },
      });
    }
  }

  // ── 2. Ürün sayfaları ────────────────────────────────────────────────────
  try {
    const products = await getProducts('en');
    const productTabs = ['', '/how-it-works', '/key-benefits', '/product-family', '/resources'];

    for (const product of products) {
      for (const locale of LOCALES) {
        for (const tab of productTabs) {
          entries.push({
            url: `${BASE_URL}/${locale}/products/${product.slug}${tab}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: tab === '' ? 0.9 : 0.6,
            alternates: {
              languages: {
                en: `${BASE_URL}/en/products/${product.slug}${tab}`,
                tr: `${BASE_URL}/tr/products/${product.slug}${tab}`,
              },
            },
          });
        }
      }
    }
  } catch {
    // Ürünler çekilemezse devam et
  }

  // ── 3. Blog yazıları ─────────────────────────────────────────────────────
  try {
    const blogData = await getBlogPosts('en', 0, 100);
    const posts = blogData.content ?? [];

    for (const post of posts) {
      for (const locale of LOCALES) {
        entries.push({
          url: `${BASE_URL}/${locale}/blog/${post.slug}`,
          lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
          alternates: {
            languages: {
              en: `${BASE_URL}/en/blog/${post.slug}`,
              tr: `${BASE_URL}/tr/blog/${post.slug}`,
            },
          },
        });
      }
    }
  } catch {
    // Blog yazıları çekilemezse devam et
  }

  // Duplicate'leri temizle
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false;
    seen.add(entry.url);
    return true;
  });
}