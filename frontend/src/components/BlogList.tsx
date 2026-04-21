import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { type BlogPostSummary } from '@/lib/api';

interface BlogListProps {
  locale: Locale;
  posts: BlogPostSummary[];
  currentPage: number;
  totalPages: number;
}

export default function BlogList({ locale, posts, currentPage, totalPages }: BlogListProps) {
  const isTr = locale === 'tr';

  return (
    <div>
      {/* Blog kartları */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              overflow: 'hidden',
            }}
          >
            {/* Görsel */}
            <Link href={`/${locale}/blog/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
              {post.featuredImageUrl ? (
                <img
                  src={post.featuredImageUrl}
                  alt={post.title ?? ''}
                  style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '280px',
                  background: 'linear-gradient(135deg, #0d1b3e, #1a2f6e)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '80px', fontWeight: 900, color: 'rgba(255,255,255,0.1)' }}>
                    {post.title?.charAt(0)}
                  </span>
                </div>
              )}
            </Link>

            {/* İçerik */}
            <div style={{ padding: '24px' }}>
              <Link href={`/${locale}/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <h4 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '12px', lineHeight: '1.4' }}>
                  {post.title}
                </h4>
                {post.excerpt && (
                  <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.7', marginBottom: '16px' }}>
                    {post.excerpt}
                  </p>
                )}
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString(
                        isTr ? 'tr-TR' : 'en-US',
                        { month: 'short', day: 'numeric', year: 'numeric' }
                      )
                    : ''}
                </span>
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  style={{ fontSize: '14px', color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
                >
                  {isTr ? 'Devamını Oku→' : 'Read More→'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '32px', flexWrap: 'wrap' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/${locale}/blog?page=${page}`}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '36px', height: '36px', fontSize: '14px', fontWeight: 500,
                textDecoration: 'none',
                backgroundColor: page === currentPage ? '#2563eb' : 'white',
                color: page === currentPage ? 'white' : '#374151',
                border: `1px solid ${page === currentPage ? '#2563eb' : '#e5e7eb'}`,
              }}
            >
              {page}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
