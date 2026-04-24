'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  featuredImageUrl: string | null;
  authorName: string;
  publishedAt: string;
  featured: boolean;
  tags: { id: string; slug: string }[];
}

export default function AdminBlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchPosts() {
    try {
      const res = await fetch('http://localhost:8080/api/v1/blog-posts?lang=en&size=100', {
        credentials: 'include',
      });
      const data = await res.json();
      setPosts(data.content ?? data ?? []);
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
            display: 'grid', gridTemplateColumns: '1fr 160px 120px 100px',
            padding: '12px 20px', borderBottom: '1px solid #e5e7eb',
            fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            <span>Title</span>
            <span>Author</span>
            <span>Published</span>
            <span>Actions</span>
          </div>

          {posts.map((post, i) => (
            <div
              key={post.id}
              style={{
                display: 'grid', gridTemplateColumns: '1fr 160px 120px 100px',
                padding: '14px 20px', alignItems: 'center',
                borderBottom: i < posts.length - 1 ? '1px solid #f3f4f6' : 'none',
              }}
            >
              {/* Title */}
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>
                  {post.title}
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

              {/* Author */}
              <span style={{ fontSize: '13px', color: '#6b7280' }}>{post.authorName}</span>

              {/* Published */}
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  : '—'}
              </span>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link
                  href={`/admin/blog/${post.id}`}
                  style={{
                    fontSize: '12px', color: '#2563eb', fontWeight: 500,
                    textDecoration: 'none',
                  }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id, post.title)}
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
          ))}
        </div>
      )}
    </div>
  );
}