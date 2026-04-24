import { type Locale } from '@/i18n/config';
import { getResources, getProductBySlug } from '@/lib/api';
import styles from '@/components/product.module.css';

export default async function ProductResourcesPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isTr = locale === 'tr';

  let resources = [];
  let product = null;

  try {
    const all = await getResources(locale);
    resources = all.filter((r) => r.relatedProductSlug === slug);
  } catch {
    resources = [];
  }

  try {
    product = await getProductBySlug(slug, locale);
  } catch {
    product = null;
  }

  const translation = product?.translations?.find((t) => t.languageCode === locale);
  const productTitle = translation?.title ?? slug;

  if (resources.length === 0) {
    return (
      <p style={{ color: '#9ca3af', padding: '40px 0' }}>
        {isTr ? 'Bu ürün için henüz kaynak eklenmemiş.' : 'No resources available yet.'}
      </p>
    );
  }

  return (
    <div style={{ paddingTop: '32px' }}>

      {/* Hero blok */}
      <div style={{
        display: 'flex',
        alignItems: 'stretch',
        background: 'white',
        marginBottom: '32px',
        overflow: 'hidden',
      }}>
        <div style={{
          flex: 1,
          padding: '48px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 16px',
            lineHeight: 1.3,
          }}>
            {isTr
              ? `${productTitle} için Kaynaklar`
              : `Resources for the Ultimate ${productTitle}`}
          </h2>
          <p style={{ fontSize: '15px', color: '#6b7280', lineHeight: 1.7, margin: 0 }}>
            {isTr
              ? `${productTitle} hakkında daha fazla bilgi edinin. Kron'un dünya lideri PAM çözümünü detaylandıran datasheet'leri indirin.`
              : `Learn more about privileged access management and ${productTitle}'s features. Download the datasheets detailing Kron's world-leading PAM solution.`}
          </p>
        </div>
        <div style={{ flex: '0 0 50%', maxWidth: '50%', overflow: 'hidden' }}>
          <img
            src="https://krontech.com/_upload/descriptioncontentimages/6bf2789843157925e979e9379f71ce4c-5f0c5f465d6cf.jpg"
            alt="Resources"
            style={{ width: '100%', height: '100%', minHeight: '260px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>

      {/* Resource kartları */}
      <div className={styles.resourcesGrid}>
        {resources.map((resource) => (
          <div key={resource.id} className={styles.resourceCard}>
            {resource.featuredImageUrl ? (
              <img
                src={resource.featuredImageUrl}
                alt={resource.title}
                className={styles.resourceCardCover}
              />
            ) : (
              <div
                className={styles.resourceCardCover}
                style={{
                  background: 'linear-gradient(135deg, #0d1b3e, #1a2f6e)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                </svg>
              </div>
            )}
            <div className={styles.resourceCardBody}>
              <p className={styles.resourceCardTitle}>{resource.title}</p>
              {resource.fileUrl ? (
                <a
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.resourceCardBtn}
                >
                  {isTr ? 'İndir' : 'Download'}
                </a>
              ) : (
                <span
                  className={styles.resourceCardBtn}
                  style={{ opacity: 0.5, cursor: 'not-allowed' }}
                >
                  {isTr ? 'Yakında' : 'Coming Soon'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
