'use client';

import { use, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { type Locale } from '@/i18n/config';

const t = {
  tr: {
    title: 'Demo Talep Et',
    subtitle: 'Ürünlerimizi canlı deneyimlemek için formu doldurun. Uzmanlarımız en kısa sürede sizinle iletişime geçecektir.',
    firstName: 'Ad',
    lastName: 'Soyad',
    email: 'E-posta',
    company: 'Şirket',
    phone: 'Telefon',
    product: 'İlgilenilen Ürün',
    productPlaceholder: 'Ürün seçin (opsiyonel)',
    message: 'Mesajınız',
    kvkk: 'KVKK kapsamında kişisel verilerimin işlenmesini onaylıyorum.',
    submit: 'Demo Talep Et',
    submitting: 'Gönderiliyor...',
    success: 'Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.',
    error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
    required: 'Bu alan zorunludur.',
  },
  en: {
    title: 'Request a Demo',
    subtitle: 'Fill out the form to experience our products live. Our experts will contact you as soon as possible.',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    company: 'Company',
    phone: 'Phone',
    product: 'Product of Interest',
    productPlaceholder: 'Select a product (optional)',
    message: 'Message',
    kvkk: 'I consent to the processing of my personal data.',
    submit: 'Request a Demo',
    submitting: 'Submitting...',
    success: 'Your request has been received. We will contact you shortly.',
    error: 'An error occurred. Please try again.',
    required: 'This field is required.',
  },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

const inputStyle = {
  backgroundColor: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
};

const labelStyle = { color: 'rgba(255,255,255,0.7)' };

interface ProductOption {
  slug: string;
  title: string;
  category: string;
}

export default function RequestDemoPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);
  const copy = t[locale];
  const searchParams = useSearchParams();
  const productSlugFromUrl = searchParams.get('product') ?? '';

  const [products, setProducts] = useState<ProductOption[]>([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    interestedProduct: productSlugFromUrl,
    message: '',
    kvkk: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch(`${API_BASE}/products?lang=${locale}`)
      .then((r) => r.json())
      .then((data: ProductOption[]) => setProducts(data))
      .catch(() => {});
  }, [locale]);

  useEffect(() => {
    if (productSlugFromUrl) {
      setForm((prev) => ({ ...prev, interestedProduct: productSlugFromUrl }));
    }
  }, [productSlugFromUrl]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = copy.required;
    if (!form.lastName.trim()) e.lastName = copy.required;
    if (!form.email.trim()) e.email = copy.required;
    if (!form.company.trim()) e.company = copy.required;
    if (!form.kvkk) e.kvkk = copy.required;
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('submitting');

    try {
      const formRes = await fetch(`${API_BASE}/forms/demo-request`);
      const demoForm = await formRes.json();
      if (!demoForm?.id) throw new Error('Form bulunamadı');

      const res = await fetch(`${API_BASE}/forms/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formDefinitionId: demoForm.id,
          data: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            company: form.company,
            phone: form.phone,
            interestedProduct: form.interestedProduct || null,
            message: form.message,
          },
          kvkkConsent: form.kvkk,
        }),
      });

      if (!res.ok) throw new Error('Submit failed');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <main className="max-w-2xl mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}>
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">{copy.success}</h1>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white">{copy.title}</h1>
        <p className="mt-3 text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>{copy.subtitle}</p>
        <div className="w-12 h-1 rounded-full mt-4" style={{ background: 'linear-gradient(90deg, #2563eb, #60a5fa)' }} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Ad + Soyad */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>{copy.firstName} *</label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={inputStyle}
            />
            {errors.firstName && <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>{copy.lastName} *</label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={inputStyle}
            />
            {errors.lastName && <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={labelStyle}>{copy.email} *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={inputStyle}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>

        {/* Şirket + Telefon */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>{copy.company} *</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={inputStyle}
            />
            {errors.company && <p className="mt-1 text-xs text-red-400">{errors.company}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" style={labelStyle}>{copy.phone}</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Ürün dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1" style={labelStyle}>{copy.product}</label>
          <select
            value={form.interestedProduct}
            onChange={(e) => setForm({ ...form, interestedProduct: e.target.value })}
            className="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ ...inputStyle, backgroundColor: 'rgba(255,255,255,0.06)' }}
          >
            <option value="" style={{ backgroundColor: '#0a1628' }}>{copy.productPlaceholder}</option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug} style={{ backgroundColor: '#0a1628' }}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={labelStyle}>{copy.message}</label>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.kvkk}
              onChange={(e) => setForm({ ...form, kvkk: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-gray-600 text-blue-600"
            />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{copy.kvkk}</span>
          </label>
          {errors.kvkk && <p className="mt-1 text-xs text-red-400">{errors.kvkk}</p>}
        </div>

        {status === 'error' && <p className="text-sm text-red-400">{copy.error}</p>}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
        >
          {status === 'submitting' ? copy.submitting : copy.submit}
        </button>
      </form>
    </main>
  );
}