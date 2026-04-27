'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Translation {
  languageCode: string;
  status: string;
  title: string;
  publishedAt: string | null;
}

interface BlogPost {
  id: string;
  slug: string;
  featuredImageUrl: string | null;
  authorName: string;
  featured: boolean;
  translations: Translation[];
  tags: { id: string; slug: string }[];
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PUBLISHED: { bg: '#EAF3DE', color: '#3B6D11' },
  DRAFT:     { bg: '#FAEEDA', color: '#854F0B' },
  ARCHIVED:  { bg: '#FCEBEB', color: '#A32D2D' },
  SCHEDULED: { bg: '#E6F1FB', color: '#185FA5' },
};

export default function AdminBlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchPosts() {
    try {
      const res = await fetch('http://localhost:8080/api/v1/blog-posts/admin-list', {
        credentials: 'include',
      });
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPosts(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    setDeleting(id);
    try {
      await fetch(`http://localhost:8080/api/v1/blog-posts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      await fetchPosts();
    } finally {
      setDeleting(null);
    }
  }

  // Her post için gösterilecek başlık — aktif dil önceliği en → tr
  function getTitle(post: BlogPost): string {
    const en = post.translations.find((t) => t.languageCode === 'en');
    const tr = post.translations.find((t) => t.languageCode === 'tr');
    return en?.title ?? tr?.title ?? post.slug;
  }

  // En son publishedAt
  function getPublishedAt(post: BlogPost): string | null {
    return post.translations
      .map((t) => t.publishedAt)
      .filter(Boolean)
      .sort()
      .at(-1) ?? null;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
            Blog Posts
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            {posts.length} posts total
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          style={{
            padding: '10px 20px', background: '#2563eb', color: 'white',
            fontSize: '13px', fontWeight: 600, textDecoration: 'none',
          }}
        >
          + New Post
        </Link>
      </div>

      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading...</p>
      ) : posts.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>No posts found.</p>
      ) : (
        <div style={{ background: 'white', border: '1px solid #e5e7eb' }}>
          {/* Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 200px 120px 100px',
            padding: '12px 20px', borderBottom: '1px solid #e5e7eb',
            fontSize: '12px', fontWeight: 600, color: '#6b7280',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            <span>Title</span>
            <span>Status</span>
            <span>Published</span>
            <span>Actions</span>
          </div>

          {posts.map((post, i) => {
            const title = getTitle(post);
            const publishedAt = getPublishedAt(post);

            return (
              <div
                key={post.id}
                style={{
                  display: 'grid', gridTemplateColumns: '1fr 200px 120px 100px',
                  padding: '14px 20px', alignItems: 'center',
                  borderBottom: i < posts.length - 1 ? '1px solid #f3f4f6' : 'none',
                }}
              >
                {/* Title + slug */}
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>
                    {title}
                    {post.featured && (
                      <span style={{
                        marginLeft: '8px', fontSize: '11px', padding: '2px 6px',
                        background: '#fef3c7', color: '#92400e', fontWeight: 500,
                      }}>
                        Featured
                      </span>
                    )}
                  </p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{post.slug}</p>
                </div>

                {/* Status badges — her dil için ayrı */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {post.translations.map((t) => {
                    const cfg = STATUS_COLORS[t.status] ?? { bg: '#f3f4f6', color: '#374151' };
                    return (
                      <span key={t.languageCode} style={{
                        fontSize: '11px', fontWeight: 600, padding: '2px 7px',
                        background: cfg.bg, color: cfg.color,
                        whiteSpace: 'nowrap',
                      }}>
                        {t.languageCode.toUpperCase()}: {t.status}
                      </span>
                    );
                  })}
                </div>

                {/* Published date */}
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  {publishedAt
                    ? new Date(publishedAt).toLocaleDateString('en-GB', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })
                    : '—'}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link
                    href={`/admin/blog/${post.id}`}
                    style={{ fontSize: '12px', color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id, title)}
                    disabled={deleting === post.id}
                    style={{
                      fontSize: '12px', color: '#dc2626', fontWeight: 500,
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    }}
                  >
                    {deleting === post.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}