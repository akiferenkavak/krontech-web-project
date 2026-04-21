import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { type BlogPostSummary } from '@/lib/api';

interface BlogSidebarProps {
  locale: Locale;
  posts: BlogPostSummary[];
}

export default function BlogSidebar({ locale, posts }: BlogSidebarProps) {
  const isTr = locale === 'tr';

  return (
    <div style={{
      position: 'sticky',
      top: '100px',
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
    }}>
      {/* Başlık — orijinalde koyu lacivert */}
      <div style={{
        backgroundColor: '#0d1b3e',
        padding: '14px 20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'white', margin: 0 }}>
          {isTr ? 'Öne Çıkanlar' : 'Highlights'}
        </h3>
      </div>

      {/* Post listesi */}
      <div style={{ padding: '8px' }}>
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${locale}/blog/${post.slug}`}
            style={{ display: 'flex', gap: '12px', padding: '12px 8px', textDecoration: 'none', borderBottom: '1px solid #f3f4f6' }}
          >
            {/* Küçük görsel */}
            <div style={{ flexShrink: 0, width: '80px', height: '56px', overflow: 'hidden' }}>
              {post.featuredImageUrl ? (
                <img
                  src={post.featuredImageUrl}
                  alt={post.title ?? ''}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: 'linear-gradient(135deg, #0d1b3e, #1a2f6e)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: 'rgba(255,255,255,0.2)' }}>
                    {post.title?.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Başlık + tarih */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '13px', fontWeight: 600, color: '#111827', lineHeight: '1.4',
                margin: '0 0 4px', display: '-webkit-box',
                WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {post.title}
              </p>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString(
                      isTr ? 'tr-TR' : 'en-US',
                      { month: 'short', day: 'numeric', year: 'numeric' }
                    )
                  : ''}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
