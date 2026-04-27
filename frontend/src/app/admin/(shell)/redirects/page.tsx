'use client';

import { useEffect, useState } from 'react';

const API = 'http://localhost:8080/api/v1';

interface Redirect {
  id: string;
  fromPath: string;
  toPath: string;
  statusCode: number;
  isActive: boolean;
  createdAt: string | null;
}

export default function AdminRedirectsPage() {
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    fromPath: '',
    toPath: '',
    statusCode: '301',
    isActive: true,
  });

  async function fetchRedirects() {
    try {
      const res = await fetch(`${API}/admin/redirects`, { credentials: 'include' });
      const data = await res.json();
      setRedirects(Array.isArray(data) ? data : []);
    } catch {
      setRedirects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchRedirects(); }, []);

  async function handleAdd() {
    if (!form.fromPath.trim() || !form.toPath.trim()) {
      setError('Source path and target path are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API}/admin/redirects`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? 'Failed to create redirect');
      }
      setForm({ fromPath: '', toPath: '', statusCode: '301', isActive: true });
      await fetchRedirects();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An error occurred.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, fromPath: string) {
    if (!confirm(`Are you sure you want to delete redirect "${fromPath}"?`)) return;
    try {
      await fetch(`${API}/admin/redirects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      await fetchRedirects();
    } catch { /* ignore */ }
  }

  async function handleToggle(id: string) {
    try {
      await fetch(`${API}/admin/redirects/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      });
      await fetchRedirects();
    } catch { /* ignore */ }
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
          Redirects
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          {redirects.length} redirects configured — manage URL redirects here
        </p>
      </div>

      {/* Add new redirect form */}
      <div style={{ background: 'white', border: '1px solid #e5e7eb', padding: '20px', marginBottom: '24px' }}>
        <p style={{
          fontSize: '13px',
          fontWeight: 700,
          color: '#374151',
          margin: '0 0 16px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Add New Redirect
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 120px 120px auto',
          gap: '8px',
          alignItems: 'end'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6b7280',
              marginBottom: '4px',
              textTransform: 'uppercase'
            }}>
              Source Path
            </label>
            <input
              type="text"
              placeholder="/old-url"
              value={form.fromPath}
              onChange={(e) => setForm({ ...form, fromPath: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6b7280',
              marginBottom: '4px',
              textTransform: 'uppercase'
            }}>
              Target Path
            </label>
            <input
              type="text"
              placeholder="/tr/products/pam-kron"
              value={form.toPath}
              onChange={(e) => setForm({ ...form, toPath: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6b7280',
              marginBottom: '4px',
              textTransform: 'uppercase'
            }}>
              Type
            </label>
            <select
              value={form.statusCode}
              onChange={(e) => setForm({ ...form, statusCode: e.target.value })}
              style={{ ...inputStyle, background: 'white' }}
            >
              <option value="301">301 — Permanent</option>
              <option value="302">302 — Temporary</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              color: '#6b7280',
              marginBottom: '4px',
              textTransform: 'uppercase'
            }}>
              Status
            </label>
            <select
              value={form.isActive ? 'true' : 'false'}
              onChange={(e) => setForm({ ...form, isActive: e.target.value === 'true' })}
              style={{ ...inputStyle, background: 'white' }}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <button
            onClick={handleAdd}
            disabled={saving}
            style={{
              padding: '8px 16px',
              background: saving ? '#93c5fd' : '#2563eb',
              color: 'white',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              alignSelf: 'end',
            }}
          >
            {saving ? '...' : '+ Add'}
          </button>
        </div>

        {error && (
          <p style={{ fontSize: '13px', color: '#dc2626', margin: '8px 0 0' }}>
            {error}
          </p>
        )}
      </div>

      {/* List */}
      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading...</p>
      ) : redirects.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>No redirects defined yet.</p>
      ) : (
        <div style={{ background: 'white', border: '1px solid #e5e7eb' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 80px 80px 120px',
            padding: '10px 20px',
            borderBottom: '2px solid #e5e7eb',
            fontSize: '11px',
            fontWeight: 700,
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            <span>Source</span>
            <span>Target</span>
            <span>Type</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {redirects.map((r, i) => (
            <div
              key={r.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 80px 80px 120px',
                padding: '12px 20px',
                alignItems: 'center',
                borderBottom: i < redirects.length - 1 ? '1px solid #f3f4f6' : 'none',
                background: r.isActive ? 'white' : '#fafafa',
              }}
            >
              <span style={{
                fontSize: '13px',
                color: r.isActive ? '#111827' : '#9ca3af',
                fontFamily: 'monospace'
              }}>
                {r.fromPath}
              </span>

              <span style={{
                fontSize: '13px',
                color: r.isActive ? '#2563eb' : '#9ca3af',
                fontFamily: 'monospace'
              }}>
                → {r.toPath}
              </span>

              <span style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                background: r.statusCode === 301 ? '#EAF3DE' : '#FAEEDA',
                color: r.statusCode === 301 ? '#3B6D11' : '#854F0B',
                whiteSpace: 'nowrap',
              }}>
                {r.statusCode} — {r.statusCode === 301 ? 'Permanent' : 'Temporary'}
              </span>

              <button
                onClick={() => handleToggle(r.id)}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  background: r.isActive ? '#dbeafe' : '#f3f4f6',
                  color: r.isActive ? '#1e40af' : '#6b7280',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {r.isActive ? 'Active' : 'Inactive'}
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleDelete(r.id, r.fromPath)}
                  style={{
                    fontSize: '12px',
                    color: '#dc2626',
                    fontWeight: 500,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}