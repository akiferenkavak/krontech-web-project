'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExt from '@tiptap/extension-link';
import ImageExt from '@tiptap/extension-image';

const API = 'http://localhost:8080/api/v1';

interface Language {
  id: string;
  code: string;
  name: string;
}

interface Translation {
  id: string;
  languageCode: string;
  title: string;
  shortDescription: string;
  content: string;
  howItWorksContent: string;
  keyBenefitsContent: string;
  productFamilyContent: string;
  seoTitle: string;
  seoDescription: string;
  status: string;
}

interface Product {
  id: string;
  slug: string;
  category: string;
  isActive: boolean;
  bannerImageUrl: string | null;
  featuredImageUrl: string | null;
  translations: Translation[];
  sortOrder?: number;
}

type ContentTab = 'solution' | 'how-it-works' | 'key-benefits' | 'product-family';

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
      {btn(() => { const url = prompt('URL:'); if (url) editor.chain().focus().setLink({ href: url }).run(); }, '🔗 Link')}
      {btn(() => { const url = prompt('Image URL:'); if (url) editor.chain().focus().setImage({ src: url }).run(); }, '🖼 Image')}
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

  useEffect(() => {
    fetch(`${API}/languages`, { credentials: 'include' })
      .then((r) => r.json())
      .then(setLanguages)
      .catch(() => {});

    fetch(`${API}/products/${id}`, { credentials: 'include' })
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
    { key: 'solution', label: 'Solution', field: 'content' },
    { key: 'how-it-works', label: 'How It Works', field: 'howItWorksContent' },
    { key: 'key-benefits', label: 'Key Benefits', field: 'keyBenefitsContent' },
    { key: 'product-family', label: 'Product Family', field: 'productFamilyContent' },
  ];

  async function handleSave() {
    setSaving(true);
    setSaveError('');
    try {

      const productRes = await fetch(`${API}/products/${id}`, {
  method: 'PUT',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slug,
    category,
    bannerImageUrl: bannerImageUrl || null,
    isActive: product?.isActive ?? true,
    sortOrder: product?.sortOrder ?? 0,
    parentId: null,
    featuredImageId: null,
  }),
});
if (!productRes.ok) throw new Error('Failed to update product');

      // Her translation için PUT /products/{id}/translations
      for (const t of translations) {
        const lang = languages.find((l) => l.code === t.languageCode);
        if (!lang) continue;

        const res = await fetch(`${API}/products/${id}/translations`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            languageId: lang.id,
            title: t.title,
            shortDescription: t.shortDescription,
            content: t.content,
            howItWorksContent: t.howItWorksContent,
            keyBenefitsContent: t.keyBenefitsContent,
            productFamilyContent: t.productFamilyContent,
            seoTitle: t.seoTitle,
            seoDescription: t.seoDescription,
            indexPage: true,
            status: 'PUBLISHED',
          }),
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`${t.languageCode}: ${err}`);
        }
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/admin/products" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>← Products</a>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>Edit Product</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {saveError && <span style={{ fontSize: '12px', color: '#dc2626', maxWidth: '300px' }}>{saveError}</span>}
          <a href={`/en/products/${slug}`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none', padding: '10px 16px', border: '1px solid #e5e7eb' }}>
            View →
          </a>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '10px 24px', background: saving ? '#93c5fd' : '#2563eb',
            color: 'white', border: 'none', fontSize: '14px', fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
          }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>
        {/* Sol — içerik */}
        <div>
          {/* Dil seçimi */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
            {(['en', 'tr'] as const).map((lang) => (
              <button key={lang} type="button" onClick={() => setActiveLang(lang)} style={{
                padding: '10px 20px', fontSize: '13px', fontWeight: 600,
                border: 'none', background: 'none', cursor: 'pointer',
                color: activeLang === lang ? '#2563eb' : '#6b7280',
                borderBottom: activeLang === lang ? '2px solid #2563eb' : '2px solid transparent',
              }}>
                {lang === 'en' ? '🇬🇧 English' : '🇹🇷 Turkish'}
              </button>
            ))}
          </div>

          {/* İçerik sekmeleri */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '24px', background: '#f9fafb' }}>
            {contentTabs.map((tab) => (
              <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} style={{
                padding: '10px 16px', fontSize: '12px', fontWeight: 600,
                border: 'none', background: 'none', cursor: 'pointer',
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

        {/* Sağ — meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'white', border: '1px solid #e5e7eb', padding: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#374151', margin: '0 0 16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Settings</p>
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
        </div>
      </div>
    </div>
  );
}