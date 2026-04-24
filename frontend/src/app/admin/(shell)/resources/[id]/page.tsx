'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

const API = 'http://localhost:8080/api/v1';

interface Translation { languageCode: string; title: string; description: string; }
interface Resource {
  id: string; slug: string; type: string; isActive: boolean;
  featuredImageUrl: string | null; fileUrl: string | null;
  relatedProductSlug: string | null;
  translations: Translation[];
}
interface Product { id: string; slug: string; title: string; }

const RESOURCE_TYPES = ['datasheet', 'whitepaper', 'case-study', 'video', 'brochure'];

export default function AdminResourceEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const isNew = id === 'new';

  const [slug, setSlug] = useState('');
  const [type, setType] = useState('datasheet');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [relatedProductSlug, setRelatedProductSlug] = useState('');
  const [translations, setTranslations] = useState<Translation[]>([
    { languageCode: 'en', title: '', description: '' },
    { languageCode: 'tr', title: '', description: '' },
  ]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeLang, setActiveLang] = useState<'en' | 'tr'>('en');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saveError, setSaveError] = useState('');

useEffect(() => {
  // Ürün listesi — related product seçimi için
  fetch(`${API}/products?lang=en`, { credentials: 'include' })
    .then((r) => r.json())
    .then(setProducts)
    .catch(() => {});

  if (isNew) return;

  // Direkt ID ile çek
  fetch(`${API}/admin/resources/${id}`, { credentials: 'include' })
    .then((r) => r.json())
    .then((data: Resource) => {
      setSlug(data.slug);
      setType(data.type);
      setIsActive(data.isActive ?? true);
      setFeaturedImageUrl(data.featuredImageUrl ?? '');
      setFileUrl(data.fileUrl ?? '');
      setRelatedProductSlug(data.relatedProductSlug ?? '');
      if (data.translations?.length) {
        setTranslations(data.translations);
      }
    })
    .finally(() => setLoading(false));
}, [id, isNew]);

  function updateTranslation(lang: string, field: keyof Translation, value: string) {
    setTranslations((prev) =>
      prev.map((t) => t.languageCode === lang ? { ...t, [field]: value } : t)
    );
  }

  async function handleSave() {
    setSaving(true);
    setSaveError('');
    try {
      const body = {
        slug, type, active: isActive,
        featuredImageUrl: featuredImageUrl || null,
        fileUrl: fileUrl || null,
        relatedProductSlug: relatedProductSlug || null,
        translations: translations.filter((t) => t.title),
      };

      const url = isNew
        ? `${API}/admin/resources`
        : `${API}/admin/resources/${id}`;

      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      router.push('/admin/resources');
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  const activeTr = translations.find((t) => t.languageCode === activeLang);
  if (loading) return <p style={{ color: '#9ca3af', fontSize: '14px' }}>Loading...</p>;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/admin/resources" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>← Resources</a>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
            {isNew ? 'New Resource' : 'Edit Resource'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {saveError && <span style={{ fontSize: '12px', color: '#dc2626', maxWidth: '300px' }}>{saveError}</span>}
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
        {/* Sol — çeviri */}
        <div>
          {/* Dil sekmeleri */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
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

          {activeTr && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Title</label>
                <input type="text" value={activeTr.title} onChange={(e) => updateTranslation(activeLang, 'title', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Description</label>
                <textarea value={activeTr.description} onChange={(e) => updateTranslation(activeLang, 'description', e.target.value)}
                  rows={4} style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} />
              </div>
            </div>
          )}
        </div>

        {/* Sağ — settings */}
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
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: 'white' }}>
                  {RESOURCE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>Related Product</label>
                <select value={relatedProductSlug} onChange={(e) => setRelatedProductSlug(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', fontSize: '13px', outline: 'none', boxSizing: 'border-box', background: 'white' }}>
                  <option value="">— None —</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.slug}>{p.title ?? p.slug}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>Thumbnail URL</label>
                <input type="text" value={featuredImageUrl} onChange={(e) => setFeaturedImageUrl(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                {featuredImageUrl && (
                  <img src={featuredImageUrl} alt="preview" style={{ width: '100%', marginTop: '8px', height: '100px', objectFit: 'cover' }} />
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>File URL (PDF)</label>
                <input type="text" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid #d1d5db', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                <label htmlFor="isActive" style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>Active</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}