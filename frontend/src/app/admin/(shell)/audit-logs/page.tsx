'use client';

import { useEffect, useState, useCallback } from 'react';

const API = 'http://localhost:8080/api/v1';

interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  createdAt: string;
  user: { email: string } | null;
}

interface PagedResponse {
  content: AuditLog[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const ACTION_COLORS: Record<string, { bg: string; color: string }> = {
  CREATE:  { bg: '#EAF3DE', color: '#3B6D11' },
  UPDATE:  { bg: '#FAEEDA', color: '#854F0B' },
  DELETE:  { bg: '#FCEBEB', color: '#A32D2D' },
  PUBLISH: { bg: '#E6F1FB', color: '#185FA5' },
};

const ENTITY_TYPES = ['', 'BlogPost', 'Product', 'Resource', 'FormSubmission'];
const ACTIONS      = ['', 'CREATE', 'UPDATE', 'DELETE', 'PUBLISH'];
const PAGE_SIZE    = 20;

function ActionBadge({ action }: { action: string }) {
  const cfg = ACTION_COLORS[action] ?? { bg: '#f3f4f6', color: '#374151' };
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600,
      padding: '3px 8px',
      background: cfg.bg, color: cfg.color,
      whiteSpace: 'nowrap',
    }}>
      {action}
    </span>
  );
}

function JsonModal({
  title,
  data,
  onClose,
}: {
  title: string;
  data: Record<string, unknown>;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: 'white', width: '100%', maxWidth: '520px',
        maxHeight: '80vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid #e5e7eb',
        }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>{title}</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <pre style={{
          flex: 1, overflowY: 'auto',
          margin: 0, padding: '16px 20px',
          fontSize: '12px', lineHeight: 1.6,
          color: '#374151', background: '#f9fafb',
          fontFamily: 'monospace',
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs]               = useState<AuditLog[]>([]);
  const [totalElements, setTotal]     = useState(0);
  const [totalPages, setTotalPages]   = useState(1);
  const [page, setPage]               = useState(0);
  const [loading, setLoading]         = useState(false);
  const [entityFilter, setEntity]     = useState('');
  const [actionFilter, setAction]     = useState('');
  const [modal, setModal]             = useState<{ title: string; data: Record<string, unknown> } | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        size: String(PAGE_SIZE),
      });
      if (entityFilter) params.set('entityType', entityFilter);
      if (actionFilter) params.set('action', actionFilter);

      const res = await fetch(`${API}/admin/audit-logs?${params}`, {
        credentials: 'include',
      });

      if (!res.ok) throw new Error();
      const data: PagedResponse = await res.json();
      setLogs(data.content ?? []);
      setTotal(data.totalElements ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, entityFilter, actionFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Filtre değişince sayfa sıfırla
  function handleEntityFilter(v: string) { setEntity(v); setPage(0); }
  function handleActionFilter(v: string) { setAction(v); setPage(0); }

  return (
    <div>
      {/* Başlık */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
          Audit Logs
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
          {totalElements} kayıt — içerik üzerindeki tüm CREATE / UPDATE / DELETE / PUBLISH işlemleri
        </p>
      </div>

      {/* Filtreler */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <select
          value={entityFilter}
          onChange={(e) => handleEntityFilter(e.target.value)}
          style={{
            padding: '7px 12px', border: '1px solid #e5e7eb',
            fontSize: '13px', background: 'white', color: '#374151',
            cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="">Tüm içerik tipleri</option>
          {ENTITY_TYPES.filter(Boolean).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={actionFilter}
          onChange={(e) => handleActionFilter(e.target.value)}
          style={{
            padding: '7px 12px', border: '1px solid #e5e7eb',
            fontSize: '13px', background: 'white', color: '#374151',
            cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="">Tüm işlemler</option>
          {ACTIONS.filter(Boolean).map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <button
          onClick={fetchLogs}
          style={{
            padding: '7px 14px', border: '1px solid #e5e7eb',
            fontSize: '13px', background: 'white', color: '#374151',
            cursor: 'pointer',
          }}
        >
          ↻ Yenile
        </button>
      </div>

      {/* Tablo */}
      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Yükleniyor...</p>
      ) : logs.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '14px' }}>Kayıt bulunamadı.</p>
      ) : (
        <div style={{ background: 'white', border: '1px solid #e5e7eb' }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '140px 100px 1fr 160px 100px',
            padding: '10px 20px',
            borderBottom: '2px solid #e5e7eb',
            fontSize: '11px', fontWeight: 700, color: '#6b7280',
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            <span>İşlem</span>
            <span>Tip</span>
            <span>Detay</span>
            <span>Kullanıcı</span>
            <span>Tarih</span>
          </div>

          {logs.map((log, i) => (
            <div
              key={log.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 100px 1fr 160px 100px',
                padding: '12px 20px',
                alignItems: 'center',
                borderBottom: i < logs.length - 1 ? '1px solid #f3f4f6' : 'none',
              }}
            >
              {/* Action badge */}
              <div>
                <ActionBadge action={log.action} />
              </div>

              {/* Entity type */}
              <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>
                {log.entityType}
              </span>

              {/* Detay — newValue veya oldValue özeti */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                <span style={{
                  fontSize: '12px', color: '#6b7280',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  maxWidth: '260px',
                }}>
                  {log.newValue
                    ? Object.entries(log.newValue)
                        .map(([k, v]) => `${k}: ${String(v)}`)
                        .join(' · ')
                    : log.entityId}
                </span>
                {(log.newValue || log.oldValue) && (
                  <button
                    onClick={() => setModal({
                      title: `${log.action} — ${log.entityType}`,
                      data: { newValue: log.newValue, oldValue: log.oldValue },
                    })}
                    style={{
                      flexShrink: 0,
                      fontSize: '11px', color: '#2563eb',
                      background: 'none', border: 'none',
                      cursor: 'pointer', padding: 0, fontWeight: 500,
                    }}
                  >
                    JSON →
                  </button>
                )}
              </div>

              {/* Kullanıcı */}
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {log.user?.email ?? '—'}
              </span>

              {/* Tarih */}
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                {new Date(log.createdAt).toLocaleDateString('tr-TR', {
                  day: '2-digit', month: 'short', year: 'numeric',
                })}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', gap: '4px', marginTop: '16px' }}>
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              padding: '6px 12px', fontSize: '13px', border: '1px solid #e5e7eb',
              background: 'white', cursor: page === 0 ? 'not-allowed' : 'pointer',
              color: page === 0 ? '#d1d5db' : '#374151',
            }}
          >
            ←
          </button>

          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const p = totalPages <= 7
              ? i
              : page < 4
                ? i
                : page > totalPages - 5
                  ? totalPages - 7 + i
                  : page - 3 + i;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: '32px', height: '32px', fontSize: '13px', fontWeight: 500,
                  border: '1px solid',
                  borderColor: page === p ? '#2563eb' : '#e5e7eb',
                  background: page === p ? '#2563eb' : 'white',
                  color: page === p ? 'white' : '#374151',
                  cursor: 'pointer',
                }}
              >
                {p + 1}
              </button>
            );
          })}

          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            style={{
              padding: '6px 12px', fontSize: '13px', border: '1px solid #e5e7eb',
              background: 'white',
              cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer',
              color: page === totalPages - 1 ? '#d1d5db' : '#374151',
            }}
          >
            →
          </button>
        </div>
      )}

      {/* JSON modal */}
      {modal && (
        <JsonModal
          title={modal.title}
          data={modal.data}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}