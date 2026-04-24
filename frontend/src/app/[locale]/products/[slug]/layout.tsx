import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { getProductBySlug, getResources } from '@/lib/api';
import type { Metadata } from 'next';
import styles from '@/components/product.module.css';
// Tab link — active state için ayrı client component
import TabLink from '@/components/ProductTabLink';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const product = await getProductBySlug(slug, locale);
    const translation = product.translations?.find((t) => t.languageCode === locale);
    const title = translation?.seoTitle ?? translation?.title ?? slug;
    const description = translation?.seoDescription ?? translation?.shortDescription ?? '';
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://krontech.com/${locale}/products/${slug}`,
        siteName: 'Kron',
        locale: locale === 'tr' ? 'tr_TR' : 'en_US',
        type: 'website',
      },
      alternates: {
        languages: {
          tr: `https://krontech.com/tr/products/${slug}`,
          en: `https://krontech.com/en/products/${slug}`,
        },
      },
    };
  } catch {
    return { title: slug };
  }
}

// Tab ikonları
function SolutionIcon() {
  return (
    <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function HowItWorksIcon() {
  return (
    <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function KeyBenefitsIcon() {
  return (
    <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function ProductFamilyIcon() {
  return (
    <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="2" y="3" width="6" height="6" /><rect x="9" y="3" width="6" height="6" />
      <rect x="16" y="3" width="6" height="6" /><rect x="2" y="12" width="6" height="6" />
      <rect x="9" y="12" width="6" height="6" />
    </svg>
  );
}

function ResourcesIcon() {
  return (
    <svg className={styles.tabIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
    </svg>
  );
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale; slug: string; tab?: string }>;
}) {
  const { locale, slug } = await params;
  const isTr = locale === 'tr';

  let product = null;
  let hasResources = false;

  try {
    product = await getProductBySlug(slug, locale);
  } catch {
    return <>{children}</>;
  }

  try {
    const resources = await getResources(locale);
    hasResources = resources.some((r) => r.relatedProductSlug === slug);
  } catch {
    hasResources = false;
  }

  const translation = product.translations?.find((t) => t.languageCode === locale);
  const title = translation?.title ?? product.slug;
  const shortDesc = translation?.shortDescription ?? '';

  // Dinamik sekme listesi
  const tabs = [
    { key: 'solution', label: isTr ? 'Çözüm' : 'Solution', href: `/${locale}/products/${slug}`, icon: <SolutionIcon />, show: true },
    { key: 'how-it-works', label: isTr ? 'Nasıl Çalışır?' : 'How It Works?', href: `/${locale}/products/${slug}/how-it-works`, icon: <HowItWorksIcon />, show: !!translation?.howItWorksContent },
    { key: 'key-benefits', label: isTr ? 'Temel Faydalar' : 'Key Benefits', href: `/${locale}/products/${slug}/key-benefits`, icon: <KeyBenefitsIcon />, show: !!translation?.keyBenefitsContent },
    { key: 'product-family', label: isTr ? 'Ürün Ailesi' : 'Product Family', href: `/${locale}/products/${slug}/product-family`, icon: <ProductFamilyIcon />, show: (product.children?.length ?? 0) > 0 },
    { key: 'resources', label: isTr ? 'Kaynaklar' : 'Resources', href: `/${locale}/products/${slug}/resources`, icon: <ResourcesIcon />, show: hasResources },
  ].filter((t) => t.show);

  // Banner arka planı
  const bannerStyle = product.bannerImageUrl
    ? { backgroundImage: `url(${product.bannerImageUrl})` }
    : { background: 'linear-gradient(135deg, #0d1b3e 0%, #1a3a6e 50%, #0d1b3e 100%)' };

  // Kategori breadcrumb label
  const categoryLabel = {
    'identity-access': isTr ? 'Kimlik ve Erişim Yönetimi' : 'Identity & Access Management',
    'data': isTr ? 'Veri Güvenliği' : 'Data Security',
    'network': isTr ? 'Telko Çözümleri' : 'Telco Solutions',
  }[product.category] ?? product.category;

  return (
    <>
      {/* ===== BANNER ===== */}
      <section className={styles.banner} style={bannerStyle}>
        <div className={styles.bannerOverlay} />
        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>{title}</h1>
          {shortDesc && <p className={styles.bannerDesc}>{shortDesc}</p>}
          <div className={styles.bannerButtons}>
            <a href="#" className={styles.bannerBtnOutline}>
              {isTr ? 'Datasheet İndir' : 'Download Datasheet'}
            </a>
            <Link
              href={`/${locale}/request-demo?product=${slug}`}
              className={styles.bannerBtnOutline}
            >
              {isTr ? 'Demo Talep Et' : 'Request a Demo'}
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TAB BAR ===== */}
      <nav className={styles.tabBar}>
        <div className={styles.tabBarInner}>
          {tabs.map((tab) => (
            <TabLink
              key={tab.key}
              href={tab.href}
              label={tab.label}
              icon={tab.icon}
            />
          ))}
        </div>
      </nav>

      {/* ===== BREADCRUMB ===== */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          <Link href={`/${locale}`} className={styles.breadcrumbLink}>
            {isTr ? 'Ana Sayfa' : 'Home'}
          </Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <Link
            href={`/${locale}/products/category/${product.category}`}
            className={styles.breadcrumbLink}
          >
            {categoryLabel}
          </Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span className={styles.breadcrumbCurrent}>{title}</span>
        </div>
      </div>

      {/* ===== SAYFA İÇERİĞİ ===== */}
      <div className={styles.pageContent}>
        <div className={styles.contentInner}>
          {children}
        </div>
      </div>
    </>
  );
}


