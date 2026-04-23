import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { getBlogPostBySlug, getFeaturedBlogPosts, getBlogPosts, type BlogPostDetail, type BlogPostSummary } from '@/lib/api';
import type { Metadata } from 'next';
import BlogSidebar from '@/components/BlogSidebar';
import BlogSlider from '@/components/BlogSlider';
import styles from '@/components/blog.module.css';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const post = await getBlogPostBySlug(slug, locale);
    const translation = post.translations?.find((t) => t.languageCode === locale);
    const title = translation?.seoTitle ?? translation?.title ?? slug;
    const description = translation?.seoDescription ?? translation?.excerpt ?? '';
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://krontech.com/${locale}/blog/${slug}`,
        siteName: 'Kron',
        locale: locale === 'tr' ? 'tr_TR' : 'en_US',
        type: 'article',
        images: post.featuredImageUrl ? [{ url: post.featuredImageUrl }] : undefined,
        publishedTime: translation?.publishedAt ?? undefined,
      },
      alternates: {
        languages: {
          tr: `https://krontech.com/tr/blog/${slug}`,
          en: `https://krontech.com/en/blog/${slug}`,
        },
      },
    };
  } catch {
    return { title: slug };
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isTr = locale === 'tr';

  let post: BlogPostDetail | null = null;
  let featuredPosts: BlogPostSummary[] = [];
  let otherPosts: BlogPostSummary[] = [];

  try { post = await getBlogPostBySlug(slug, locale); } catch { post = null; }
  try { featuredPosts = await getFeaturedBlogPosts(locale); } catch { featuredPosts = []; }
  try {
    const data = await getBlogPosts(locale, 0, 6);
    // Mevcut yazıyı "Other Blogs"'dan çıkar
    otherPosts = data.content.filter((p) => p.slug !== slug);
  } catch { otherPosts = []; }

  if (!post) {
    return (
      <main className={styles.detailPage}>
        <div className={styles.detailContainer}>
          <Link href={`/${locale}/blog`} style={{ color: '#2563eb', fontSize: '14px' }}>
            {isTr ? '← Bloga Dön' : '← Back to Blog'}
          </Link>
          <p style={{ marginTop: '24px', color: '#6b7280' }}>
            {isTr ? 'Blog yazısı bulunamadı.' : 'Blog post not found.'}
          </p>
        </div>
      </main>
    );
  }

  const translation = post.translations?.find((t) => t.languageCode === locale);
  const pageUrl = `https://krontech.com/${locale}/blog/${slug}`;
  const title = translation?.title ?? slug;

  const jsonLd = translation ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: translation.title,
    description: translation.excerpt ?? '',
    datePublished: translation.publishedAt ?? '',
    image: post.featuredImageUrl ?? undefined,
    author: { '@type': 'Organization', name: 'Kron' },
    publisher: { '@type': 'Organization', name: 'Kron', url: 'https://krontech.com' },
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <main className={styles.detailPage}>

        {/* ===== İÇERİK + SIDEBAR ===== */}
        <div className={styles.detailContainer}>
          <div className={styles.detailLayout}>

            {/* Sol — Blog içeriği */}
            <div className={styles.detailMainCol}>
              <div className={styles.detailCard}>

                {/* Kapak görseli */}
                {post.featuredImageUrl && (
                  <img
                    src={post.featuredImageUrl}
                    alt={title}
                    className={styles.detailCoverImage}
                  />
                )}

                <div className={styles.detailBody}>
                  {/* Başlık */}
                  <h1 className={styles.detailTitle}>{title}</h1>

                  {/* Meta: tarih + yazar */}
                  <div className={styles.detailMeta}>
                    {translation?.publishedAt && (
                      <span>
                        {new Date(translation.publishedAt).toLocaleDateString(
                          isTr ? 'tr-TR' : 'en-US',
                          { month: 'short', day: 'numeric', year: 'numeric' }
                        )}
                      </span>
                    )}
                    {post.authorName && (
                      <>
                        <span className={styles.detailMetaDivider}>/</span>
                        <span>{post.authorName}</span>
                      </>
                    )}
                  </div>

                  {/* Sosyal medya paylaşım */}
                  <div className={styles.detailSocials}>
                    {/* LinkedIn */}
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.detailSocialLink}
                      title="LinkedIn'de Paylaş"
                    >
                      <svg className={styles.detailSocialIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.detailSocialLink}
                      title="Facebook'ta Paylaş"
                    >
                      <svg className={styles.detailSocialIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                    {/* X (Twitter) */}
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(pageUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.detailSocialLink}
                      title="X'te Paylaş"
                    >
                      <svg className={styles.detailSocialIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  </div>

                  {/* Blog içeriği */}
                  {translation?.content ? (
                    <div
                      className={styles.detailContent}
                      dangerouslySetInnerHTML={{ __html: translation.content }}
                    />
                  ) : translation?.excerpt ? (
                    <div className={styles.detailContent}>
                      <p>{translation.excerpt}</p>
                    </div>
                  ) : (
                    <p className={styles.detailNoContent}>
                      {isTr ? 'Bu yazı için henüz içerik eklenmemiş.' : 'No content available for this post yet.'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sağ — Sticky Sidebar */}
            <div className={styles.detailSideCol}>
              {featuredPosts.length > 0 && (
                <BlogSidebar locale={locale} posts={featuredPosts} />
              )}
            </div>

          </div>
        </div>

        {/* ===== OTHER BLOGS ===== */}
        {otherPosts.length > 0 && (
          <div className={styles.otherBlogsSection}>
            <h3 className={styles.otherBlogsTitle}>
              {isTr ? 'Diğer Yazılar' : 'Other Blogs'}
            </h3>
            <BlogSlider locale={locale} posts={otherPosts} />
          </div>
        )}

        {/* ===== BREADCRUMB ===== */}
        <div className={styles.detailBreadcrumb}>
          <div className={styles.detailBreadcrumbInner}>
            <Link href={`/${locale}`} className={styles.detailBreadcrumbLink}>
              {isTr ? 'Ana Sayfa' : 'Home'}
            </Link>
            <span style={{ color: '#d1d5db' }}>/</span>
            <Link href={`/${locale}/blog`} className={styles.detailBreadcrumbLink}>
              Blog
            </Link>
            <span style={{ color: '#d1d5db' }}>/</span>
            <span className={styles.detailBreadcrumbCurrent}>{title}</span>
          </div>
        </div>

      </main>
    </>
  );
}
