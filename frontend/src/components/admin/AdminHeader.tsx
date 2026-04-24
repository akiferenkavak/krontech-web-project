'use client';

import { useRouter } from 'next/navigation';
import { adminLogout } from '@/lib/admin-api';

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await adminLogout();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <>
      <style>{`
        .admin-header-link:hover { color: #111827 !important; }
        .admin-logout-btn:hover { background: #f9fafb !important; border-color: #d1d5db !important; }
      `}</style>
      <header style={{
        height: '60px',
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 32px',
        gap: '16px',
      }}>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-header-link"
          style={{
            fontSize: '13px', color: '#6b7280',
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
            transition: 'color 0.15s',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15,3 21,3 21,9" /><line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          View Site
        </a>

        <button
          onClick={handleLogout}
          className="admin-logout-btn"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 16px',
            background: 'transparent',
            border: '1px solid #e5e7eb',
            fontSize: '13px', color: '#374151',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </header>
    </>
  );
}