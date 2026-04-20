'use client';

import Link from 'next/link';
import { useState } from 'react';
import { type Locale } from '@/i18n/config';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid rgba(255,255,255,0.15)',
  backgroundColor: 'rgba(255,255,255,0.08)',
  color: 'white',
  fontSize: '14px',
  borderRadius: '2px',
  outline: 'none',
};

export default function Footer({ locale }: { locale: Locale }) {
  const [form, setForm] = useState({
    firstName: '', lastName: '', company: '', email: '', phone: '', kvkk: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.kvkk) return;
    setStatus('submitting');
    try {
      const formRes = await fetch(`${API_BASE}/forms/demo-request`);
      const demoForm = await formRes.json();
      const res = await fetch(`${API_BASE}/forms/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formDefinitionId: demoForm.id,
          data: { firstName: form.firstName, lastName: form.lastName, company: form.company, email: form.email, phone: form.phone },
          kvkkConsent: form.kvkk,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  const isTr = locale === 'tr';

  return (
    <footer>
      {/* ===== CONTACT US FORM ===== */}
      <section
        className="relative py-24"
        style={{
          backgroundImage: 'url(https://krontech.com/project/_resources/images/man-with-headphones.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }} />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-center">

            {/* Sol — Başlık */}
            <div className="w-full md:w-2/5 text-white shrink-0">
              <h2 className="text-3xl font-bold mb-4">
                {isTr ? 'Bize Ulaşın' : 'Contact Us'}
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isTr
                  ? "Kron Teknoloji'nin telekom ve siber güvenlik ürünleri hakkında daha fazla bilgi almak için bizimle iletişime geçin."
                  : "Contact us to learn more about Kron Technologies' telecom and cybersecurity products."}
              </p>
            </div>

            {/* Sağ — Form */}
            <div className="w-full md:w-3/5">
              {status === 'success' ? (
                <div className="text-white text-center py-8">
                  <div className="text-green-400 text-4xl mb-4">✓</div>
                  <p className="text-lg font-medium">
                    {isTr ? 'Mesajınız alındı, en kısa sürede sizinle iletişime geçeceğiz.' : 'Your message has been received. We will get back to you shortly.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder={isTr ? 'Ad' : 'First Name'}
                      value={form.firstName}
                      onChange={e => setForm({ ...form, firstName: e.target.value })}
                      style={inputStyle}
                    />
                    <input
                      type="text"
                      placeholder={isTr ? 'Soyad' : 'Last Name'}
                      value={form.lastName}
                      onChange={e => setForm({ ...form, lastName: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder={isTr ? 'Şirket' : 'Company'}
                      value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                      style={inputStyle}
                    />
                    <input
                      type="email"
                      placeholder="E-Mail"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <input
                    type="tel"
                    placeholder={isTr ? 'Telefon' : 'Phone'}
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    style={inputStyle}
                  />

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.kvkk}
                      onChange={e => setForm({ ...form, kvkk: e.target.checked })}
                      className="mt-1 h-4 w-4 shrink-0"
                    />
                    <span className="text-xs text-gray-300 leading-relaxed">
                      {isTr
                        ? <>Kişisel verilerimin <Link href={`/${locale}/privacy-policy`} className="text-blue-400 hover:underline">Gizlilik Politikası</Link> kapsamında yurt içi ve yurt dışındaki üçüncü kişilere aktarılmasına onay veriyorum.</>
                        : <>I hereby consent to the transfer of my personal data to third parties within the scope of the <Link href={`/${locale}/privacy-policy`} className="text-blue-400 hover:underline">Privacy Policy</Link>.</>
                      }
                    </span>
                  </label>

                  {status === 'error' && (
                    <p className="text-red-400 text-sm">
                      {isTr ? 'Bir hata oluştu. Lütfen tekrar deneyin.' : 'An error occurred. Please try again.'}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'submitting' || !form.kvkk}
                    className="w-full py-3 text-white font-semibold text-sm transition-all disabled:opacity-50"
                    style={{ backgroundColor: '#2563eb' }}
                  >
                    {status === 'submitting'
                      ? (isTr ? 'Gönderiliyor...' : 'Sending...')
                      : (isTr ? 'Gönder' : 'Send')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <div style={{ backgroundColor: '#000000' }} className="pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

            {/* Logo */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-sm">
                  <span className="text-white font-black text-base leading-none">K</span>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-lg font-bold text-white tracking-tight">Kron</span>
                  <span className="text-[8px] font-medium text-gray-500 tracking-widest uppercase">Technologies</span>
                </div>
              </div>
            </div>

            {/* Ürünler */}
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {isTr ? 'Ürünler' : 'Products'}
              </p>
              <ul className="space-y-2">
                {[
                  { href: '/products/pam-kron',        label: { tr: 'Kron PAM',                  en: 'Kron PAM'                    } },
                  { href: '/products/data-security',   label: { tr: 'Veri Güvenliği',            en: 'Data Security'               } },
                  { href: '/products/dam',             label: { tr: 'Veritabanı Aktivite İzleme', en: 'Database Activity Monitoring'} },
                  { href: '/products/network-security',label: { tr: 'Ağ Güvenliği',              en: 'Network Security'            } },
                  { href: '/products/aaa-solution',    label: { tr: 'AAA Çözümü',                en: 'AAA Solution'                } },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={`/${locale}${link.href}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kurumsal */}
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {isTr ? 'Kurumsal' : 'About Us'}
              </p>
              <ul className="space-y-2">
                {[
                  { href: '/about',     label: { tr: 'Hakkımızda', en: 'About Us'  } },
                  { href: '/blog',      label: { tr: 'Blog',       en: 'Blog'      } },
                  { href: '/resources', label: { tr: 'Kaynaklar',  en: 'Resources' } },
                  { href: '/contact',   label: { tr: 'İletişim',   en: 'Contact'   } },
                ].map(link => (
                  <li key={link.href}>
                    <Link href={`/${locale}${link.href}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label[locale]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sosyal Medya */}
            <div>
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                {isTr ? 'Sosyal Medya' : 'Social Media'}
              </p>
              <ul className="space-y-2">
                {[
                  { href: 'https://www.linkedin.com/company/krontech', label: 'LinkedIn'   },
                  { href: 'https://x.com/kron_tech',                   label: 'X'          },
                  { href: 'https://www.instagram.com/kron.tech/',      label: 'Instagram'  },
                  { href: 'https://www.youtube.com/channel/UCMV3_pdImKw-DeL6TC0uQQA', label: 'Youtube' },
                ].map(link => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-gray-400 hover:text-white transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Alt çizgi */}
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              Copyright © 2007 - 2026 Kron All Rights Reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {[
                { href: 'https://e-sirket.mkk.com.tr/esir/Dashboard.jsp#/sirketbilgileri/10854', label: isTr ? 'Elektronik Tebligat' : 'Information Society Services', external: true },
                { href: `/${locale}/privacy-policy`,    label: isTr ? 'Gizlilik Politikası' : 'Privacy Policy',    external: false },
                { href: `/${locale}/information-note`,  label: isTr ? 'Bilgilendirme Notu'  : 'Information Note',  external: false },
                { href: `/${locale}/cookie-policy`,     label: isTr ? 'Çerez Politikası'    : 'Cookie Policy',     external: false },
              ].map(link =>
                link.external ? (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-gray-600 hover:text-gray-400 transition-colors whitespace-nowrap">
                    {link.label}
                  </a>
                ) : (
                  <Link key={link.href} href={link.href}
                    className="text-xs text-gray-600 hover:text-gray-400 transition-colors whitespace-nowrap">
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}