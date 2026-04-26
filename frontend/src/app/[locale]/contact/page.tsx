'use client';

import { use } from 'react';
import { type Locale } from '@/i18n/config';
import DynamicForm from '@/components/DynamicForm';

const copy = {
  tr: {
    title: 'Bize Ulaşın',
    submit: 'Gönder',
    breadcrumbHome: 'Ana Sayfa',
    breadcrumbPage: 'İletişim',
  },
  en: {
    title: 'Contact Us',
    submit: 'Send',
    breadcrumbHome: 'Home',
    breadcrumbPage: 'Contact',
  },
};

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);
  const t = copy[locale];

  return (
    <main style={{ backgroundColor: '#f5f5f5', minHeight: '60vh' }}>

      {/* ── Banner ── */}
      <section
        style={{
          backgroundImage: 'url(https://krontech.com/_upload/bannerimages/7686dbf5cbd52b04682ab9420e26ca9a-5f0866e1014a4.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '220px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)' }} />
        <h1 style={{
          position: 'relative', zIndex: 1,
          fontSize: '3rem', fontWeight: 300, color: 'white',
          margin: 0, letterSpacing: '2px',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}>
          {t.title}
        </h1>
      </section>

      {/* ── Breadcrumb ── */}
      <nav style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef', padding: '10px 0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
          <a href={`/${locale}`} style={{ color: '#6b7280', textDecoration: 'none' }}>{t.breadcrumbHome}</a>
          <span style={{ color: '#d1d5db' }}>/</span>
          <span style={{ color: '#111827', fontWeight: 600 }}>{t.breadcrumbPage}</span>
        </div>
      </nav>

      {/* ── Form kartı ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          backgroundColor: 'white',
          padding: '40px 48px 48px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 28px' }}>
            {t.title}
          </h2>

          <DynamicForm
            locale={locale}
            slug="contact"
            submitLabel={t.submit}
          />
        </div>
      </div>

    </main>
  );
}