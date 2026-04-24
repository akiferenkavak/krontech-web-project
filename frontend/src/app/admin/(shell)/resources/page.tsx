'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Resource {
  id: string;
  slug: string;
  type: string;
  isActive: boolean;
  title: string;
  description: string | null;
  fileUrl: string | null;
  featuredImageUrl: string | null;
  relatedProductSlug: string | null;
}

export default function AdminResourcesListPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchResources() {
    try {
      const res = await fetch('http://localhost:8080/api/v1/admin/resources', {
        credentials: 'include',
      });
      const data = await res.json();
      setResources(data ?? []);
    } catch {
      setResources([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchResources(); }, []);

  const typeColors: Record<string, string> = {
    datasheet: '#dbeafe',
    video: '#fce7f3',
    whitepaper: '#d1fae5',
    casestudy: '#fef3c7',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Resources</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{resources.length} resources total</p>
        </div>
        <Link href="/admin/resources/new" style={{
          padding: '10px 20px', background: '#2563eb', color: 'white',
          fontSize: '13px', fontWeight: 600, textDecoration: 'none',
        }}>
          + New Resource
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading...</p>
      ) : resources.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>No resources found.</p>
      ) : (
        <div style={{ background: 'white', border: '1px solid #e5e7eb' }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '48px 1fr 100px 160px 80px',
            padding: '12px 20px', borderBottom: '1px solid #e5e7eb',
            fontSize: '12px', fontWeight: 600, color: '#6b7280',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            <span></span>
            <span>Title</span>
            <span>Type</span>
            <span>Related Product</span>
            <span>Actions</span>
          </div>

          {resources.map((resource, i) => (
            <div key={resource.id} style={{
              display: 'grid', gridTemplateColumns: '48px 1fr 100px 160px 80px',
              padding: '12px 20px', alignItems: 'center',
              borderBottom: i < resources.length - 1 ? '1px solid #f3f4f6' : 'none',
            }}>
              {/* Thumbnail */}
              <div style={{
                width: '36px', height: '36px', overflow: 'hidden',
                background: '#f3f4f6', flexShrink: 0,
              }}>
                {resource.featuredImageUrl ? (
                  <img src={resource.featuredImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={1.5}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>{resource.title}</p>
                <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{resource.slug}</p>
              </div>

              {/* Type */}
              <span style={{
                fontSize: '11px', padding: '3px 8px', fontWeight: 600,
                background: typeColors[resource.type] ?? '#f3f4f6',
                color: '#374151', alignSelf: 'center',
              }}>
                {resource.type.toUpperCase()}
              </span>

              {/* Related product */}
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                {resource.relatedProductSlug ?? '—'}
              </span>

              {/* Actions */}
              <Link href={`/admin/resources/${resource.id}`} style={{
                fontSize: '13px', color: '#2563eb', fontWeight: 500, textDecoration: 'none',
              }}>
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}