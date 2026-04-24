import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { getProductBySlug } from '@/lib/api';
import styles from '@/components/product.module.css';

export default async function ProductFamilyPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isTr = locale === 'tr';

  let product = null;
  try {
    product = await getProductBySlug(slug, locale);
  } catch {
    return null;
  }

  const translation = product.translations?.find((t) => t.languageCode === locale);
  const children = product.children ?? [];

  if (children.length === 0) {
    return (
      <p style={{ color: '#9ca3af', padding: '40px 0' }}>
        {isTr ? 'Bu ürün ailesi için henüz ürün eklenmemiş.' : 'No products in this family yet.'}
      </p>
    );
  }

  return (
    <div style={{ paddingTop: '32px' }}>
      {/* Hero blok */}
      {translation?.productFamilyContent && (
        <div
          className={styles.htmlContent}
          style={{ marginBottom: '32px' }}
          dangerouslySetInnerHTML={{ __html: translation.productFamilyContent }}
        />
      )}

      {/* Alt ürün grid */}
      <div className={styles.productFamilyGrid}>
        {children.map((child) => (
          <Link
            key={child.id}
            href={`/${locale}/products/${child.slug}`}
            className={styles.productFamilyCard}
          >
            <div className={styles.productFamilyCardIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2}>
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className={styles.productFamilyCardTitle}>
              {child.title ?? child.slug}
            </h3>
            {child.shortDescription && (
              <p className={styles.productFamilyCardDesc}>
                {child.shortDescription}
              </p>
            )}
            <span className={styles.productFamilyCardLink}>
              {isTr ? 'Daha Fazla →' : 'Learn More →'}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
