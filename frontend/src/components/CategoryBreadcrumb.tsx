import Link from 'next/link';
import { type Locale } from '@/i18n/config';

interface CategoryBreadcrumbProps {
  locale: Locale;
  categoryTitle: string;
}

export default function CategoryBreadcrumb({ locale, categoryTitle }: CategoryBreadcrumbProps) {
  return (
    <section style={{ padding: '12px 0', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
          <Link
            href={`/${locale}`}
            style={{ color: '#6b7280', textDecoration: 'none' }}
          >
            {locale === 'tr' ? 'Ana Sayfa' : 'Home'}
          </Link>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ color: '#111827', fontWeight: 600 }}>{categoryTitle}</span>
        </nav>
      </div>
    </section>
  );
}