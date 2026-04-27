'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Translation {
  languageCode: string;
  status: string;
  title: string;
  publishedAt: string | null;
}

interface Product {
  id: string;
  slug: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  parentId: string | null;
  translations: Translation[];
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PUBLISHED: { bg: '#EAF3DE', color: '#3B6D11' },
  DRAFT:     { bg: '#FAEEDA', color: '#854F0B' },
  ARCHIVED:  { bg: '#FCEBEB', color: '#A32D2D' },
  SCHEDULED: { bg: '#E6F1FB', color: '#185FA5' },
};

export default function AdminProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/products/admin-list', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  function getTitle(product: Product): string {
    const en = product.translations.find((t) => t.languageCode === 'en');
    const tr = product.translations.find((t) => t.languageCode === 'tr');
    return en?.title ?? tr?.title ?? product.slug;
  }

  const roots    = products.filter((p) => !p.parentId);
  const children = products.filter((p) => p.parentId);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Products</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{products.length} products total</p>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {roots.map((root) => (
            <div key={root.id}>
              {/* Root satırı */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 220px 140px 80px 80px',
                padding: '14px 20px', background: 'white',
                border: '1px solid #e5e7eb', alignItems: 'center',
              }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>
                    {getTitle(root)}
                  </p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{root.slug}</p>
                </div>

                {/* Status badges */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {root.translations.map((t) => {
                    const cfg = STATUS_COLORS[t.status] ?? { bg: '#f3f4f6', color: '#374151' };
                    return (
                      <span key={t.languageCode} style={{
                        fontSize: '11px', fontWeight: 600, padding: '2px 7px',
                        background: cfg.bg, color: cfg.color, whiteSpace: 'nowrap',
                      }}>
                        {t.languageCode.toUpperCase()}: {t.status}
                      </span>
                    );
                  })}
                </div>

                <span style={{
                  fontSize: '12px', padding: '3px 8px',
                  background: '#dbeafe', color: '#1e40af',
                  alignSelf: 'center', justifySelf: 'start',
                }}>
                  {root.category}
                </span>

                <span style={{
                  fontSize: '12px', color: root.isActive ? '#059669' : '#9ca3af', fontWeight: 600,
                }}>
                  {root.isActive ? 'Active' : 'Inactive'}
                </span>

                <Link
                  href={`/admin/products/${root.id}`}
                  style={{ fontSize: '13px', color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}
                >
                  Edit
                </Link>
              </div>

              {/* Child ürünler */}
              {children.filter((c) => c.parentId === root.id).map((child) => (
                <div
                  key={child.id}
                  style={{
                    display: 'grid', gridTemplateColumns: '1fr 220px 140px 80px 80px',
                    padding: '12px 20px 12px 44px',
                    background: '#f9fafb',
                    borderLeft: '1px solid #e5e7eb',
                    borderRight: '1px solid #e5e7eb',
                    borderBottom: '1px solid #f3f4f6',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#d1d5db', fontSize: '16px' }}>└</span>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: '0 0 2px' }}>
                        {getTitle(child)}
                      </p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{child.slug}</p>
                    </div>
                  </div>

                  {/* Status badges */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {child.translations.map((t) => {
                      const cfg = STATUS_COLORS[t.status] ?? { bg: '#f3f4f6', color: '#374151' };
                      return (
                        <span key={t.languageCode} style={{
                          fontSize: '11px', fontWeight: 600, padding: '2px 7px',
                          background: cfg.bg, color: cfg.color, whiteSpace: 'nowrap',
                        }}>
                          {t.languageCode.toUpperCase()}: {t.status}
                        </span>
                      );
                    })}
                  </div>

                  <span style={{ fontSize: '12px', color: '#6b7280' }}>{child.category}</span>

                  <span style={{
                    fontSize: '12px', color: child.isActive ? '#059669' : '#9ca3af', fontWeight: 600,
                  }}>
                    {child.isActive ? 'Active' : 'Inactive'}
                  </span>

                  <Link
                    href={`/admin/products/${child.id}`}
                    style={{ fontSize: '13px', color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}
                  >
                    Edit
                  </Link>
                </div>
              ))}

              <div style={{ borderBottom: '2px solid #e5e7eb' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}