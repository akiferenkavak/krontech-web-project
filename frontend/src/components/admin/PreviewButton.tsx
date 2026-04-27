// frontend/src/components/admin/PreviewButton.tsx
// Admin paneldeki blog ve ürün edit sayfalarına eklenecek buton

'use client';

interface PreviewButtonProps {
  type: 'blog' | 'product' | 'resource';
  slug: string;
  locale?: string;
}

const PREVIEW_SECRET = process.env.NEXT_PUBLIC_PREVIEW_SECRET ?? '';

export default function PreviewButton({ type, slug, locale = 'en' }: PreviewButtonProps) {
  const previewUrl =
    `/api/preview?secret=${PREVIEW_SECRET}&type=${type}&slug=${slug}&locale=${locale}`;

  return (
    <a
      href={previewUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '9px 16px',
        border: '1px solid #e5e7eb',
        fontSize: '13px',
        color: '#374151',
        textDecoration: 'none',
        background: 'white',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      {locale === 'tr' ? 'Önizle' : 'Preview'} →
    </a>
  );
}

// Kullanım — admin/blog/[id]/page.tsx içindeki header'a:
// import PreviewButton from '@/components/admin/PreviewButton';
//
// <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
//   {!isNew && (
//     <>
//       <PreviewButton type="blog" slug={slug} locale="en" />
//       <PreviewButton type="blog" slug={slug} locale="tr" />
//     </>
//   )}
//   <button onClick={handleSave}>Save</button>
// </div>