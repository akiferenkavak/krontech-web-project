// frontend/src/app/admin/(shell)/media/page.tsx
'use client';

import { useEffect, useState } from 'react';

const API = 'http://localhost:8080/api/v1';

interface Media {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  altText: string | null;
  createdAt: string;
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const [form, setForm] = useState({
    url: '',
    filename: '',
    altText: '',
    mimeType: 'image/jpeg',
  });

  async function fetchMedia() {
    try {
      const res = await fetch(`${API}/admin/media`, { credentials: 'include' });
      const data = await res.json();
      setMedia(Array.isArray(data) ? data : []);
    } catch {
      setMedia([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchMedia(); }, []);

  async function handleAdd() {
    if (!form.url.trim() || !form.filename.trim()) return;
    setAdding(true);
    try {
      await fetch(`${API}/admin/media`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setForm({ url: '', filename: '', altText: '', mimeType: 'image/jpeg' });
      await fetchMedia();
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu medyayı silmek istediğinizden emin misiniz?')) return;
    await fetch(`${API}/admin/media/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    await fetchMedia();
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #d1d5db',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
          Media Library
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          {media.length} media files — add URLs to use in blog posts and products
        </p>
      </div>

      {/* Add form */}
      <div style={{ background: 'white', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '24px' }}>
        <p style={{
          fontSize: '13px', fontWeight: 700, color: '#374151',
          margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          Add Media URL
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 120px', gap: '8px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>
              URL *
            </label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>
              Filename *
            </label>
            <input
              type="text"
              placeholder="image.jpg"
              value={form.filename}
              onChange={(e) => setForm({ ...form, filename: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase' }}>
              Alt Text
            </label>
            <input
              type="text"
              placeholder="Description"
              value={form.altText}
              onChange={(e) => setForm({ ...form, altText: e.target.value })}
              style={inputStyle}
            />
          </div>

          <button
            onClick={handleAdd}
            disabled={adding || !form.url.trim() || !form.filename.trim()}
            style={{
              padding: '8px 16px',
              background: adding ? '#93c5fd' : '#2563eb',
              color: 'white',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: adding ? 'not-allowed' : 'pointer',
              alignSelf: 'end',
            }}
          >
            {adding ? '...' : '+ Add'}
          </button>
        </div>

        {/* URL preview */}
        {form.url && (
          <div style={{ marginTop: '12px' }}>
            <img
              src={form.url}
              alt="preview"
              style={{ height: '80px', objectFit: 'cover', border: '1px solid #e5e7eb' }}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading...</p>
      ) : media.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>No media files yet. Add a URL above.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {media.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Thumbnail */}
              <div style={{ height: '140px', background: '#f3f4f6', position: 'relative', overflow: 'hidden' }}>
                {item.mimeType.startsWith('image/') ? (
                  <img
                    src={item.url}
                    alt={item.altText ?? item.filename}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth={1.5}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <p style={{
                  fontSize: '12px', fontWeight: 600, color: '#111827',
                  margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {item.filename}
                </p>
                {item.altText && (
                  <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
                    {item.altText}
                  </p>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '6px' }}>
                  <button
                    onClick={() => copyUrl(item.url)}
                    style={{
                      flex: 1,
                      padding: '6px 0',
                      fontSize: '11px',
                      fontWeight: 600,
                      border: '1px solid #e5e7eb',
                      background: copied === item.url ? '#d1fae5' : 'white',
                      color: copied === item.url ? '#065f46' : '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {copied === item.url ? '✓ Copied' : 'Copy URL'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: '6px 10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      border: '1px solid #fecaca',
                      background: 'white',
                      color: '#dc2626',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}