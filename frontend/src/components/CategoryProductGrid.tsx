'use client';


import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { type ProductSummary } from '@/lib/api';
import { productImages, fallbackImage } from '@/lib/categories';

interface CategoryProductGridProps {
  locale: Locale;
  products: ProductSummary[];
}

export default function CategoryProductGrid({ locale, products }: CategoryProductGridProps) {
  if (!products.length) return null;

  const learnMore = locale === 'tr' ? 'Detaylı Bilgi' : 'Learn More';

  return (
    <section style={{ backgroundColor: '#f5f5f5', padding: '40px 0 64px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '32px',
        }}>
          {products.map((product) => {
            const imgSrc = productImages[product.slug] ?? fallbackImage;
            return (
              <div
                key={product.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                {/* Görsel */}
                <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={imgSrc}
                    alt={product.title ?? product.slug}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* İçerik */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                  <h4 style={{ marginBottom: '12px' }}>
                    <Link
                      href={`/${locale}/products/${product.slug}`}
                      style={{
                        fontSize: '16px', fontWeight: 700,
                        color: '#2563eb', textDecoration: 'none',
                        textTransform: 'uppercase', letterSpacing: '0.02em',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#1d4ed8')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#2563eb')}
                    >
                      {product.title ?? product.slug}
                    </Link>
                  </h4>

                  <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6', flex: 1, marginBottom: '20px' }}>
                    {product.shortDescription}
                  </p>

                  {/* Learn More butonu */}
                  <div>
                    <Link
                      href={`/${locale}/products/${product.slug}`}
                      style={{
                        display: 'inline-block',
                        padding: '8px 24px',
                        border: '1px solid #2563eb',
                        color: '#2563eb',
                        fontSize: '14px',
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#2563eb';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#2563eb';
                      }}
                    >
                      {learnMore}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
