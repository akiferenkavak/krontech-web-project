'use client';

import { use, useState } from 'react';
import { type Locale } from '@/i18n/config';

const t = {
  tr: {
    title: 'Demo Talep Et',
    subtitle: 'Uzmanlarımız en kısa sürede sizinle iletişime geçecektir.',
    name: 'Ad Soyad',
    email: 'E-posta',
    company: 'Şirket',
    phone: 'Telefon',
    message: 'Mesajınız',
    kvkk: 'KVKK kapsamında kişisel verilerimin işlenmesini onaylıyorum.',
    submit: 'Gönder',
    submitting: 'Gönderiliyor...',
    success: 'Talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.',
    error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
    required: 'Bu alan zorunludur.',
  },
  en: {
    title: 'Request a Demo',
    subtitle: 'Our experts will get in touch with you as soon as possible.',
    name: 'Full Name',
    email: 'Email',
    company: 'Company',
    phone: 'Phone',
    message: 'Message',
    kvkk: 'I consent to the processing of my personal data.',
    submit: 'Submit',
    submitting: 'Submitting...',
    success: 'Your request has been received. We will contact you shortly.',
    error: 'An error occurred. Please try again.',
    required: 'This field is required.',
  },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = use(params);
  const copy = t[locale];

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    kvkk: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = copy.required;
    if (!form.email.trim()) e.email = copy.required;
    if (!form.company.trim()) e.company = copy.required;
    if (!form.kvkk) e.kvkk = copy.required;
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus('submitting');

    try {
      const formRes = await fetch(`${API_BASE}/forms/demo-request`);
      const demoForm = await formRes.json();

      if (!demoForm) throw new Error('Form bulunamadı');

      const res = await fetch(`${API_BASE}/forms/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formDefinitionId: demoForm.id,
          data: {
            name: form.name,
            email: form.email,
            company: form.company,
            phone: form.phone,
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
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{copy.success}</h1>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">{copy.title}</h1>
        <p className="mt-3 text-lg text-gray-500">{copy.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{copy.name} *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{copy.email} *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{copy.company} *</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{copy.phone}</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{copy.message}</label>
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.kvkk}
              onChange={(e) => setForm({ ...form, kvkk: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm text-gray-600">{copy.kvkk}</span>
          </label>
          {errors.kvkk && <p className="mt-1 text-xs text-red-500">{errors.kvkk}</p>}
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-500">{copy.error}</p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 transition-colors disabled:opacity-60"
        >
          {status === 'submitting' ? copy.submitting : copy.submit}
        </button>
      </form>
    </main>
  );
}