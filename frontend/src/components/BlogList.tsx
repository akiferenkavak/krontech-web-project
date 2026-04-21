import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { type BlogPostSummary } from '@/lib/api';
import styles from './blog.module.css';

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
      <div className={styles.cardList}>
        {posts.map((post) => (
          <div key={post.id} className={styles.card}>
            <Link href={`/${locale}/blog/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
              {post.featuredImageUrl ? (
                <img
                  src={post.featuredImageUrl}
                  alt={post.title ?? ''}
                  className={styles.cardImage}
                />
              ) : (
                <div className={styles.cardImagePlaceholder}>
                  <span className={styles.cardImagePlaceholderText}>
                    {post.title?.charAt(0)}
                  </span>
                </div>
              )}
            </Link>

            <div className={styles.cardBody}>
              <Link href={`/${locale}/blog/${post.slug}`} className={styles.cardTitle}>
                {post.title}
              </Link>
              {post.excerpt && (
                <p className={styles.cardExcerpt}>{post.excerpt}</p>
              )}
              <div className={styles.cardFooter}>
                <span className={styles.cardDate}>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString(
                        isTr ? 'tr-TR' : 'en-US',
                        { month: 'short', day: 'numeric', year: 'numeric' }
                      )
                    : ''}
                </span>
                <Link href={`/${locale}/blog/${post.slug}`} className={styles.cardReadMore}>
                  {isTr ? 'Devamını Oku→' : 'Read More→'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`/${locale}/blog?page=${page}`}
              className={`${styles.pageLink} ${page === currentPage ? styles.pageLinkActive : ''}`}
            >
              {page}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
