import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { type BlogPostSummary } from '@/lib/api';
import styles from './blog.module.css';

interface BlogSidebarProps {
  locale: Locale;
  posts: BlogPostSummary[];
}

export default function BlogSidebar({ locale, posts }: BlogSidebarProps) {
  const isTr = locale === 'tr';

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h3 className={styles.sidebarTitle}>
          {isTr ? 'Öne Çıkanlar' : 'Highlights'}
        </h3>
      </div>

      <div className={styles.sidebarList}>
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${locale}/blog/${post.slug}`}
            className={styles.sidebarItem}
          >
            <div className={styles.sidebarThumb}>
              {post.featuredImageUrl ? (
                <img
                  src={post.featuredImageUrl}
                  alt={post.title ?? ''}
                  className={styles.sidebarThumbImg}
                />
              ) : (
                <div className={styles.sidebarThumbPlaceholder} />
              )}
            </div>
            <div className={styles.sidebarItemMeta}>
              <p className={styles.sidebarItemTitle}>{post.title}</p>
              <p className={styles.sidebarItemDate}>
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
