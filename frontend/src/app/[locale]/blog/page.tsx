import { type Locale } from '@/i18n/config';
import { getBlogPosts, getFeaturedBlogPosts, type BlogPostSummary } from '@/lib/api';
import type { Metadata } from 'next';
import BlogHero from '@/components/BlogHero';
import CategoryBreadcrumb from '@/components/CategoryBreadcrumb';
import BlogList from '@/components/BlogList';
import BlogSidebar from '@/components/BlogSidebar';
import styles from '@/components/blog.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Blog',
    description: locale === 'tr'
      ? 'Siber güvenlik ve teknoloji dünyasından güncel içerikler.'
      : 'Latest insights from the world of cybersecurity and technology.',
    alternates: {
      languages: {
        tr: 'https://krontech.com/tr/blog',
        en: 'https://krontech.com/en/blog',
      },
    },
  };
}

const PAGE_SIZE = 5;

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? '1', 10));

  let posts: BlogPostSummary[] = [];
  let totalPages = 1;
  let featuredPosts: BlogPostSummary[] = [];

  try {
    const data = await getBlogPosts(locale, currentPage - 1, PAGE_SIZE);
    posts = data.content;
    totalPages = data.totalPages;
  } catch {
    posts = [];
  }

  try {
    featuredPosts = await getFeaturedBlogPosts(locale);
  } catch {
    featuredPosts = [];
  }

  const isTr = locale === 'tr';

  return (
    <main className={styles.page}>
      <BlogHero
        bannerUrl="https://krontech.com/_upload/bannerimages/66b3f3362bf39418420b9a5c2dadc037-5eccfbd5a5018.jpg"
        title="Blog"
      />
      <CategoryBreadcrumb locale={locale} categoryTitle="Blog" />

      <div className={styles.container}>
        <div className={styles.layout}>

          <div className={styles.mainCol}>
            {posts.length === 0 ? (
              <p style={{ color: '#6b7280' }}>
                {isTr ? 'Henüz blog yazısı yok.' : 'No blog posts yet.'}
              </p>
            ) : (
              <BlogList
                locale={locale}
                posts={posts}
                currentPage={currentPage}
                totalPages={totalPages}
              />
            )}
          </div>

          <div className={styles.sideCol}>
            {featuredPosts.length > 0 && (
              <BlogSidebar locale={locale} posts={featuredPosts} />
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
