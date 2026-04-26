'use client';

import { useEffect, useState, useCallback } from 'react';

const API = 'http://localhost:8080/api/v1';

// ─── Tipler ───────────────────────────────────────────────────────────────────

interface FormDefinition {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  newSubmissionCount: number;
}

interface Submission {
  id: string;
  formDefinitionId: string;
  formName: string;
  data: Record<string, string>;
  status: 'new' | 'read' | 'exported';
  ipAddress: string;
  kvkkConsent: boolean;
  marketingConsent: boolean;
  createdAt: string;
}

interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const statusConfig = {
  new:      { label: 'New',      bg: '#dbeafe', color: '#1e40af' },
  read:     { label: 'Read',     bg: '#d1fae5', color: '#065f46' },
  exported: { label: 'Exported', bg: '#f3f4f6', color: '#374151' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status as keyof typeof statusConfig] ?? statusConfig.read;
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600, padding: '3px 8px',
      backgroundColor: cfg.bg, color: cfg.color,
    }}>
      {cfg.label}
    </span>
  );
}

// ─── Detay modal ──────────────────────────────────────────────────────────────

function DetailModal({
  sub,
  onClose,
  onStatusChange,
  onDelete,
}: {
  sub: Submission;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleStatus(newStatus: string) {
    setUpdating(true);
    await onStatusChange(sub.id, newStatus);
    setUpdating(false);
  }

  async function handleDelete() {
    if (!confirm('Bu kaydı silmek istediğinizden emin misiniz?')) return;
    setDeleting(true);
    await onDelete(sub.id);
    setDeleting(false);
    onClose();
  }

  const dataEntries = Object.entries(sub.data ?? {}).filter(([, v]) => v);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'white', width: '100%', maxWidth: '560px',
        maxHeight: '85vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: '1px solid #e5e7eb',
        }}>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>
              {sub.formName}
            </p>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0' }}>
              {new Date(sub.createdAt).toLocaleString('tr-TR')} · {sub.ipAddress}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form verileri */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {dataEntries.map(([key, val]) => (
              <div key={key}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px' }}>
                  {key}
                </p>
                <p style={{ fontSize: '14px', color: '#111827', margin: 0, wordBreak: 'break-word' }}>
                  {String(val)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Consent bilgisi */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '24px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 2px' }}>KVKK</p>
            <span style={{ fontSize: '13px', color: sub.kvkkConsent ? '#059669' : '#dc2626', fontWeight: 600 }}>
              {sub.kvkkConsent ? '✓ Onaylandı' : '✗ Onaylanmadı'}
            </span>
          </div>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 2px' }}>Pazarlama</p>
            <span style={{ fontSize: '13px', color: sub.marketingConsent ? '#059669' : '#9ca3af', fontWeight: 600 }}>
              {sub.marketingConsent ? '✓ Onaylandı' : '— Onaylanmadı'}
            </span>
          </div>
        </div>

        {/* Aksiyonlar */}
        <div style={{ padding: '16px 24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <StatusBadge status={sub.status} />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
            {sub.status !== 'read' && (
              <button
                onClick={() => handleStatus('read')}
                disabled={updating}
                style={{
                  padding: '7px 14px', fontSize: '12px', fontWeight: 600,
                  border: '1px solid #d1d5db', background: 'white',
                  cursor: updating ? 'not-allowed' : 'pointer', color: '#374151',
                }}
              >
                Okundu İşaretle
              </button>
            )}
            {sub.status !== 'exported' && (
              <button
                onClick={() => handleStatus('exported')}
                disabled={updating}
                style={{
                  padding: '7px 14px', fontSize: '12px', fontWeight: 600,
                  border: '1px solid #d1d5db', background: 'white',
                  cursor: updating ? 'not-allowed' : 'pointer', color: '#374151',
                }}
              >
                Exported
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                padding: '7px 14px', fontSize: '12px', fontWeight: 600,
                border: '1px solid #fecaca', background: '#fff',
                cursor: deleting ? 'not-allowed' : 'pointer', color: '#dc2626',
              }}
            >
              {deleting ? '...' : 'Sil'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Ana sayfa ────────────────────────────────────────────────────────────────

export default function AdminSubmissionsPage() {
  const [forms, setForms] = useState<FormDefinition[]>([]);
  const [activeFormId, setActiveFormId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [exporting, setExporting] = useState(false);

  const PAGE_SIZE = 20;

  // Form listesini çek
  useEffect(() => {
    fetch(`${API}/admin/forms`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data: FormDefinition[]) => {
        setForms(data);
        if (data.length > 0) setActiveFormId(data[0].id);
      })
      .catch(() => {});
  }, []);

  // Submission'ları çek
  const fetchSubmissions = useCallback(async () => {
    if (!activeFormId) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        size: String(PAGE_SIZE),
      });
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(
        `${API}/admin/forms/${activeFormId}/submissions?${params}`,
        { credentials: 'include' }
      );
      const data: PagedResponse<Submission> = await res.json();
      setSubmissions(data.content ?? []);
      setTotalElements(data.totalElements ?? 0);
    } catch {
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, [activeFormId, page, statusFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  async function handleStatusChange(id: string, status: string) {
    await fetch(`${API}/admin/submissions/${id}/status`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    // Modal'daki submission'ı güncelle
    setSelected((prev) => prev ? { ...prev, status: status as Submission['status'] } : prev);
    fetchSubmissions();
  }

  async function handleDelete(id: string) {
    await fetch(`${API}/admin/submissions/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    fetchSubmissions();
  }

  async function handleExport() {
    if (!activeFormId) return;
    setExporting(true);
    try {
      const res = await fetch(
        `${API}/admin/forms/${activeFormId}/submissions/export`,
        { credentials: 'include' }
      );
      const data: Submission[] = await res.json();

      // CSV oluştur
      if (data.length === 0) return;
      const headers = ['id', 'createdAt', 'status', 'kvkkConsent', 'marketingConsent', 'ipAddress',
        ...Object.keys(data[0].data ?? {})];
      const rows = data.map((s) => [
        s.id, s.createdAt, s.status,
        s.kvkkConsent, s.marketingConsent, s.ipAddress,
        ...Object.values(s.data ?? {}),
      ]);
      const csv = [headers, ...rows]
        .map((row) => row.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `submissions-${forms.find((f) => f.id === activeFormId)?.slug ?? 'export'}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      fetchSubmissions();
    } finally {
      setExporting(false);
    }
  }

  const activeForm = forms.find((f) => f.id === activeFormId);
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);

  return (
    <div>
      {/* Başlık */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
            Form Submissions
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            {totalElements} total submissions
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || !activeFormId}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '9px 18px', background: exporting ? '#93c5fd' : '#2563eb',
            color: 'white', border: 'none', fontSize: '13px', fontWeight: 600,
            cursor: exporting ? 'not-allowed' : 'pointer',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {exporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Form sekmeleri */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '20px' }}>
        {forms.map((form) => (
          <button
            key={form.id}
            onClick={() => { setActiveFormId(form.id); setPage(0); setStatusFilter(''); }}
            style={{
              padding: '10px 20px', fontSize: '14px', fontWeight: 600,
              border: 'none', background: 'none', cursor: 'pointer',
              color: activeFormId === form.id ? '#2563eb' : '#6b7280',
              borderBottom: activeFormId === form.id ? '2px solid #2563eb' : '2px solid transparent',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            {form.name}
            {form.newSubmissionCount > 0 && (
              <span style={{
                fontSize: '11px', fontWeight: 700,
                backgroundColor: '#2563eb', color: 'white',
                borderRadius: '9999px', padding: '1px 7px',
              }}>
                {form.newSubmissionCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filtre */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {['', 'new', 'read', 'exported'].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(0); }}
            style={{
              padding: '5px 12px', fontSize: '12px', fontWeight: 600,
              border: '1px solid',
              borderColor: statusFilter === s ? '#2563eb' : '#e5e7eb',
              background: statusFilter === s ? '#eff6ff' : 'white',
              color: statusFilter === s ? '#2563eb' : '#6b7280',
              cursor: 'pointer',
            }}
          >
            {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Tablo */}
      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading...</p>
      ) : submissions.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>No submissions found.</p>
      ) : (
        <div style={{ background: 'white', border: '1px solid #e5e7eb' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 160px 100px 120px',
            padding: '12px 20px', borderBottom: '2px solid #e5e7eb',
            fontSize: '11px', fontWeight: 700, color: '#6b7280',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            <span>Name / Email</span>
            <span>Company</span>
            <span>Date</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {submissions.map((sub, i) => {
            const d = sub.data ?? {};
            const name = [d.firstName, d.lastName].filter(Boolean).join(' ') || d.name || '—';
            const email = d.email || '—';
            const company = d.company || '—';

            return (
              <div
                key={sub.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 160px 100px 120px',
                  padding: '13px 20px', alignItems: 'center',
                  borderBottom: i < submissions.length - 1 ? '1px solid #f3f4f6' : 'none',
                  backgroundColor: sub.status === 'new' ? '#fafbff' : 'white',
                }}
              >
                <div>
                  <p style={{
                    fontSize: '14px', fontWeight: sub.status === 'new' ? 700 : 500,
                    color: '#111827', margin: '0 0 2px',
                  }}>
                    {name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{email}</p>
                </div>

                <span style={{ fontSize: '13px', color: '#6b7280' }}>{company}</span>

                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  {new Date(sub.createdAt).toLocaleDateString('tr-TR', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </span>

                <StatusBadge status={sub.status} />

                <button
                  onClick={() => {
                    setSelected(sub);
                    // Otomatik "read" — API çağrısı modal açılınca yapılıyor
                    if (sub.status === 'new') {
                      handleStatusChange(sub.id, 'read');
                    }
                  }}
                  style={{
                    fontSize: '12px', color: '#2563eb', fontWeight: 600,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    textAlign: 'left',
                  }}
                >
                  View →
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '6px', marginTop: '16px' }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              style={{
                width: '32px', height: '32px', fontSize: '13px', fontWeight: 600,
                border: '1px solid', cursor: 'pointer',
                borderColor: page === i ? '#2563eb' : '#e5e7eb',
                background: page === i ? '#2563eb' : 'white',
                color: page === i ? 'white' : '#374151',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Detay modal */}
      {selected && (
        <DetailModal
          sub={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}