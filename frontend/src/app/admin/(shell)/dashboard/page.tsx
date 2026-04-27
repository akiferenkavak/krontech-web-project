'use client';

import { useEffect, useState } from 'react';

interface Stats {
  products: number;
  blogPosts: number;
  resources: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ products: 0, blogPosts: 0, resources: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const [products, blogPosts, resources] = await Promise.allSettled([
          fetch('http://localhost:8080/api/v1/products?lang=en', { credentials: 'include' }).then((r) => r.json()),
          fetch('http://localhost:8080/api/v1/blog-posts/admin-list', { credentials: 'include' }).then((r) => r.json()),
          fetch('http://localhost:8080/api/v1/resources?lang=en', { credentials: 'include' }).then((r) => r.json()),
        ]);
        setStats({
          products: products.status === 'fulfilled' ? (products.value?.length ?? 0) : 0,
          blogPosts: blogPosts.status === 'fulfilled' ? (blogPosts.value?.length ?? 0) : 0,
          resources: resources.status === 'fulfilled' ? (resources.value?.length ?? 0) : 0,
        });
      } catch {
        // stats stays zero
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Products', value: stats.products, href: '/admin/products', color: '#2563eb' },
    { label: 'Blog Posts', value: stats.blogPosts, href: '/admin/blog', color: '#7c3aed' },
    { label: 'Resources', value: stats.resources, href: '/admin/resources', color: '#059669' },
  ];

  return (
    <div>
      <style>{`
        .stat-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .quick-btn:hover { opacity: 0.85; }
      `}</style>

      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
        Dashboard
      </h1>
      <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 32px' }}>
        Kron CMS — Content Management Panel
      </p>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {cards.map((card) => (
          <a key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
            <div
              className="stat-card"
              style={{
                background: 'white', padding: '24px',
                border: '1px solid #e5e7eb',
                display: 'flex', alignItems: 'center', gap: '16px',
                transition: 'box-shadow 0.15s',
              }}
            >
              <div style={{
                width: '48px', height: '48px', borderRadius: '8px',
                background: card.color, flexShrink: 0,
              }} />
              <div>
                <p style={{ fontSize: '28px', fontWeight: 700, color: '#111827', margin: 0 }}>
                  {card.value}
                </p>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                  {card.label}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Quick actions */}
      <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 16px' }}>
        Quick Actions
      </h2>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { label: '+ New Blog Post', href: '/admin/blog/new', color: '#7c3aed' },
          { label: '+ New Resource', href: '/admin/resources/new', color: '#059669' },
          { label: 'Upload Media', href: '/admin/media', color: '#0891b2' },
        ].map((btn) => (
          <a
            key={btn.href}
            href={btn.href}
            className="quick-btn"
            style={{
              padding: '10px 20px',
              background: btn.color,
              color: 'white',
              fontSize: '13px', fontWeight: 600,
              textDecoration: 'none',
              transition: 'opacity 0.15s',
            }}
          >
            {btn.label}
          </a>
        ))}
      </div>
    </div>
  );
}