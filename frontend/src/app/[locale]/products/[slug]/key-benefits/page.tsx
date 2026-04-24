import { type Locale } from '@/i18n/config';
import { getProductBySlug } from '@/lib/api';
import styles from '@/components/product.module.css';

export default async function KeyBenefitsPage({
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

  if (!translation?.keyBenefitsContent) {
    return (
      <p style={{ color: '#9ca3af', padding: '40px 0' }}>
        {isTr ? 'Bu sekme için henüz içerik eklenmemiş.' : 'No content available yet.'}
      </p>
    );
  }

  return (
    <div
      className={styles.htmlContent}
      style={{ paddingTop: '32px' }}
      dangerouslySetInnerHTML={{ __html: translation.keyBenefitsContent }}
    />
  );
}
