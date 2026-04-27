'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExt from '@tiptap/extension-link';
import ImageExt from '@tiptap/extension-image';

const API = 'http://localhost:8080/api/v1';

interface VersionEntry {
  id: string;
  action: string;
  newValue: Record<string, unknown> | null;
  oldValue: Record<string, unknown> | null;
  createdAt: string;
  user: { email: string } | null;
}

const ACTION_COLORS: Record<string, { bg: string; color: string }> = {
  CREATE:  { bg: '#EAF3DE', color: '#3B6D11' },
  UPDATE:  { bg: '#FAEEDA', color: '#854F0B' },
  DELETE:  { bg: '#FCEBEB', color: '#A32D2D' },
  PUBLISH: { bg: '#E6F1FB', color: '#185FA5' },
};

interface Language { id: string; code: string; name: string; }
interface Translation {
  id: string; languageCode: string; title: string; shortDescription: string;
  content: string; howItWorksContent: string; keyBenefitsContent: string;
  productFamilyContent: string; seoTitle: string; seoDescription: string; status: string;
}
interface Product {
  id: string; slug: string; category: string; isActive: boolean;
  bannerImageUrl: string | null; featuredImageUrl: string | null;
  translations: Translation[]; sortOrder?: number;
}
type ContentTab = 'solution' | 'how-it-works' | 'key-benefits' | 'product-family';

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PUBLISHED: { bg: '#EAF3DE', color: '#3B6D11' },
  DRAFT:     { bg: '#FAEEDA', color: '#854F0B' },
  ARCHIVED:  { bg: '#FCEBEB', color: '#A32D2D' },
  SCHEDULED: { bg: '#E6F1FB', color: '#185FA5' },
};

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;
  const btn = (action: () => void, label: string, active?: boolean) => (
    <button type="button" onClick={action} style={{
      padding: '4px 10px', fontSize: '12px', border: '1px solid #d1d5db',
      background: active ? '#e5e7eb' : 'white', cursor: 'pointer', fontWeight: active ? 700 : 400,
    }}>{label}</button>
  );
  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', padding: '8px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
      {btn(() => editor.chain().focus().toggleBold().run(), 'B', editor.isActive('bold'))}
      {btn(() => editor.chain().focus().toggleItalic().run(), 'I', editor.isActive('italic'))}
      {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2', editor.isActive('heading', { level: 2 }))}
      {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3', editor.isActive('heading', { level: 3 }))}
      {btn(() => editor.chain().focus().toggleBulletList().run(), '• List', editor.isActive('bulletList'))}
      {btn(() => { const url = prompt('URL:'); if (url) editor.chain().focus().setLink({ href: url }).run(); }, 'Link')}
      {btn(() => { const url = prompt('Image URL:'); if (url) editor.chain().focus().setImage({ src: url }).run(); }, 'Image')}
    </div>
  );
}

function RichEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, LinkExt, ImageExt],
    content: value ?? '',
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });
  return (
    <div style={{ border: '1px solid #d1d5db', minHeight: '280px' }}>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} style={{ padding: '16px', minHeight: '240px', fontSize: '14px', lineHeight: 1.7, outline: 'none' }} />
    </div>
  );
}


function VersionHistoryModal({
  postId,
  onClose,
}: {
  postId: string;
  onClose: () => void;
}) {
  const [versions, setVersions] = useState<VersionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API}/admin/versions/Product/${postId}`, { credentials: 'include' })  // ← Product
      .then((r) => r.json())
      .then(setVersions)
      .catch(() => setVersions([]))
      .finally(() => setLoading(false));
  }, [postId]);

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
        background: 'white', width: '100%', maxWidth: '580px',
        maxHeight: '80vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid #e5e7eb',
        }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>
            Version History
          </p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {loading ? (
            <p style={{ padding: '24px', color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>Loading...</p>
          ) : versions.length === 0 ? (
            <p style={{ padding: '24px', color: '#9ca3af', fontSize: '14px', textAlign: 'center' }}>No history yet.</p>
          ) : (
            versions.map((v) => {
              const cfg = ACTION_COLORS[v.action] ?? { bg: '#f3f4f6', color: '#374151' };
              const isOpen = expanded === v.id;
              return (
                <div key={v.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 20px', cursor: 'pointer',
                    }}
                    onClick={() => setExpanded(isOpen ? null : v.id)}
                  >
                    <span style={{
                      fontSize: '11px', fontWeight: 700, padding: '2px 8px',
                      background: cfg.bg, color: cfg.color, whiteSpace: 'nowrap',
                    }}>
                      {v.action}
                    </span>
                    <span style={{ fontSize: '12px', color: '#6b7280', flex: 1 }}>
                      {v.user?.email ?? 'system'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                      {new Date(v.createdAt).toLocaleString('tr-TR', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="#9ca3af" strokeWidth={2}
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', flexShrink: 0 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {isOpen && (v.newValue || v.oldValue) && (
                    <div style={{ padding: '0 20px 12px', background: '#f9fafb' }}>
                      <pre style={{
                        fontSize: '11px', color: '#374151', margin: 0,
                        padding: '10px', background: 'white', border: '1px solid #e5e7eb',
                        overflowX: 'auto', lineHeight: 1.6, fontFamily: 'monospace',
                      }}>
                        {JSON.stringify(v.newValue ?? v.oldValue, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [activeLang, setActiveLang] = useState<'en' | 'tr'>('en');
  const [activeTab, setActiveTab] = useState<ContentTab>('solution');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetch(`${API}/languages`, { credentials: 'include' })
      .then((r) => r.json()).then(setLanguages).catch(() => {});

    fetch(`${API}/products/detail/${id}`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data: Product) => {
        setProduct(data);
        setSlug(data.slug);
        setCategory(data.category);
        setBannerImageUrl(data.bannerImageUrl ?? '');
        setTranslations(data.translations ?? []);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const updateTr = useCallback((field: keyof Translation, value: string) => {
    setTranslations((prev) =>
      prev.map((t) => t.languageCode === activeLang ? { ...t, [field]: value } : t)
    );
  }, [activeLang]);

  const tr = translations.find((t) => t.languageCode === activeLang);

  const contentTabs: { key: ContentTab; label: string; field: keyof Translation }[] = [
    { key: 'solution',       label: 'Solution',       field: 'content' },
    { key: 'how-it-works',   label: 'How It Works',   field: 'howItWorksContent' },
    { key: 'key-benefits',   label: 'Key Benefits',   field: 'keyBenefitsContent' },
    { key: 'product-family', label: 'Product Family', field: 'productFamilyContent' },
  ];

  async function handleSave(publishStatus: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED' = 'PUBLISHED') {
    setSaving(true);
    setSaveError('');
    try {
      const productRes = await fetch(`${API}/products/${id}`, {
        method: 'PUT', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug, category, bannerImageUrl: bannerImageUrl || null,
          isActive: product?.isActive ?? true, sortOrder: product?.sortOrder ?? 0,
          parentId: null, featuredImageId: null,
        }),
      });
      if (!productRes.ok) throw new Error('Failed to update product');

      for (const t of translations) {
        const lang = languages.find((l) => l.code === t.languageCode);
        if (!lang) continue;
        const res = await fetch(`${API}/products/${id}/translations`, {
          method: 'PUT', credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            languageId: lang.id, title: t.title, shortDescription: t.shortDescription,
            content: t.content, howItWorksContent: t.howItWorksContent,
            keyBenefitsContent: t.keyBenefitsContent, productFamilyContent: t.productFamilyContent,
            seoTitle: t.seoTitle, seoDescription: t.seoDescription,
            indexPage: true, status: publishStatus,
          }),
        });
        if (!res.ok) { const err = await res.text(); throw new Error(`${t.languageCode}: ${err}`); }
      }

      router.push('/admin/products');
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/admin/products" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>Products</a>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>Edit Product</h1>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {saveError && <span style={{ fontSize: '12px', color: '#dc2626', maxWidth: '300px' }}>{saveError}</span>}


        {/* History butonu */}
        {slug && (
          <button
            onClick={() => setShowHistory(true)}
            style={{
              padding: '9px 14px',
              border: '1px solid #e5e7eb',
              background: 'white',
              fontSize: '12px',
              color: '#6b7280',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 3v5h5" />
              <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
              <path d="M12 7v5l4 2" />
            </svg>
            History
          </button>
        )}
          {slug && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {(['en', 'tr'] as const).map((loc) => (
                  <a key={loc}
                    href={`/api/preview?secret=${process.env.NEXT_PUBLIC_PREVIEW_SECRET}&type=product&slug=${slug}&locale=${loc}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ padding: '9px 12px', border: '1px solid #e5e7eb', fontSize: '12px', color: '#6b7280', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                    {loc.toUpperCase()}
                  </a>
                ))}
              </div>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>preview</span>
            </div>
          )}

          <button onClick={() => handleSave('DRAFT')} disabled={saving}
            style={{ padding: '10px 16px', background: 'white', color: '#374151', border: '1px solid #d1d5db', fontSize: '13px', fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer' }}>
            Save as Draft
          </button>

          <button onClick={() => handleSave('ARCHIVED')} disabled={saving}
            style={{ padding: '10px 16px', background: 'white', color: '#dc2626', border: '1px solid #fecaca', fontSize: '13px', fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer' }}>
            Unpublish
          </button>

          <button onClick={() => handleSave('PUBLISHED')} disabled={saving}
            style={{ padding: '10px 24px', background: saving ? '#93c5fd' : '#2563eb', color: 'white', border: 'none', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
        <div>
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
            {(['en', 'tr'] as const).map((lang) => (
              <button key={lang} type="button" onClick={() => setActiveLang(lang)} style={{
                padding: '10px 20px', fontSize: '13px', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer',
                color: activeLang === lang ? '#2563eb' : '#6b7280',
                borderBottom: activeLang === lang ? '2px solid #2563eb' : '2px solid transparent',
              }}>
                {lang === 'en' ? 'English' : 'Turkish'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '24px', background: '#f9fafb' }}>
            {contentTabs.map((tab) => (
              <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} style={{
                padding: '10px 16px', fontSize: '12px', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer',
                color: activeTab === tab.key ? '#111827' : '#9ca3af',
                borderBottom: activeTab === tab.key ? '2px solid #111827' : '2px solid transparent',
                textTransform: 'uppercase', letterSpacing: '0.04em',
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          {tr ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeTab === 'solution' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Title</label>
                    <input type="text" value={tr.title ?? ''} onChange={(e) => updateTr('title', e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Short Description</label>
                    <textarea value={tr.shortDescription ?? ''} onChange={(e) => updateTr('shortDescription', e.target.value)}
                      rows={3} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                  </div>
                </>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                  {contentTabs.find((t) => t.key === activeTab)?.label} Content
                </label>
                <RichEditor
                  key={`${activeLang}-${activeTab}`}
                  value={(tr[contentTabs.find((t) => t.key === activeTab)!.field] as string) ?? ''}
                  onChange={(v) => updateTr(contentTabs.find((t) => t.key === activeTab)!.field, v)}
                />
              </div>
              {activeTab === 'solution' && (
                <div style={{ background: '#f9fafb', padding: '16px', border: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#374151', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>SEO Title</label>
                      <input type="text" value={tr.seoTitle ?? ''} onChange={(e) => updateTr('seoTitle', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>SEO Description</label>
                      <textarea value={tr.seoDescription ?? ''} onChange={(e) => updateTr('seoDescription', e.target.value)}
                        rows={2} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', fontSize: '13px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: '#9ca3af', fontSize: '14px', padding: '40px', textAlign: 'center' }}>
              No {activeLang === 'en' ? 'English' : 'Turkish'} translation found.
            </p>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'white', border: '1px solid #e5e7eb', padding: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#374151', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Settings</p>

            {translations.length > 0 && (
              <div style={{ marginBottom: '16px', padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Status</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {translations.map((t) => {
                    const cfg = STATUS_COLORS[t.status] ?? { bg: '#f3f4f6', color: '#374151' };
                    return (
                      <span key={t.languageCode} style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', background: cfg.bg, color: cfg.color }}>
                        {t.languageCode.toUpperCase()}: {t.status}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>Slug</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>Category</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>Banner Image URL</label>
                <input type="text" value={bannerImageUrl} onChange={(e) => setBannerImageUrl(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                {bannerImageUrl && (
                  <img src={bannerImageUrl} alt="banner preview" style={{ width: '100%', marginTop: '8px', height: '80px', objectFit: 'cover' }} />
                )}
              </div>
            </div>
          </div>

          <a href={`/en/products/${slug}`} target="_blank" rel="noopener noreferrer"
            style={{ display: 'block', textAlign: 'center', padding: '10px', border: '1px solid #e5e7eb', fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>
            View on Site
          </a>
        </div>
      </div>

            {/* Version History Modal */}
      {showHistory && (
        <VersionHistoryModal
          postId={id}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}