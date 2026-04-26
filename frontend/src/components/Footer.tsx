'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { type Locale } from '@/i18n/config';
import PhoneInput from '@/components/form/PhoneInput';
import CountrySelect from '@/components/form/CountrySelect';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

// Dark background input style — beyaz border + şeffaf bg
const darkInput: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid rgba(255,255,255,0.2)',
  backgroundColor: 'rgba(255,255,255,0.08)',
  color: 'white',
  fontSize: '14px',
  borderRadius: '2px',
  outline: 'none',
};

// CountrySelect için dark trigger class
const darkTrigger =
  'w-full border border-white/20 px-3 py-2.5 text-sm bg-white/[0.08] text-white rounded-sm flex items-center cursor-pointer select-none focus:outline-none';

const i18n = {
  tr: {
    title: 'Bize Ulaşın',
    subtitle: "Kron Teknoloji'nin telekom ve siber güvenlik ürünleri hakkında daha fazla bilgi almak için bizimle iletişime geçin.",
    firstName: 'Ad', lastName: 'Soyad', company: 'Şirket', email: 'E-Posta',
    country: 'Ülke', phone: 'Telefon',
    kvkk1: "Kişisel verilerimin Türkiye'de ve yurt dışında yerleşik üçüncü taraflara",
    kvkk1Link: 'Gizlilik Politikası',
    kvkk1After: 'kapsamında aktarılmasına onay veriyorum ve konuyla ilgili bilgilendirildiğimi kabul ediyorum.',
    kvkk2: 'Kron ürün ve hizmetlerinin tanıtımı amacıyla SMS veya e-posta ile ticari elektronik ileti gönderilmesi için kişisel verilerimin işlenmesini kabul ediyorum.',
    kvkk2Link: 'Bilgilendirme Notu',
    kvkkRequired: 'KVKK onayı zorunludur.',
    recaptchaRequired: 'Lütfen robot olmadığınızı doğrulayın.',
    submit: 'Gönder',
    submitting: 'Gönderiliyor...',
    success: 'Mesajınız alındı, en kısa sürede sizinle iletişime geçeceğiz.',
    error: 'Bir hata oluştu. Lütfen tekrar deneyin.',
  },
  en: {
    title: 'Contact Us',
    subtitle: "Contact us to learn more about Kron Technologies' telecom and cybersecurity products.",
    firstName: 'First Name', lastName: 'Last Name', company: 'Company', email: 'E-Mail',
    country: 'Country', phone: 'Phone',
    kvkk1: 'I hereby consent to the transfer of my personal data to third parties settled in Türkiye and abroad within the scope of the',
    kvkk1Link: 'Privacy Policy',
    kvkk1After: 'and I accept that I have been duly informed regarding the subject.',
    kvkk2: 'I hereby consent to receiving commercial electronic messages by SMS or e-mail for promotion, information and advertisement of Kron products and services.',
    kvkk2Link: 'Information Note',
    kvkkRequired: 'KVKK consent is required.',
    recaptchaRequired: 'Please verify that you are not a robot.',
    submit: 'Send',
    submitting: 'Sending...',
    success: 'Your message has been received. We will get back to you shortly.',
    error: 'An error occurred. Please try again.',
  },
};

export default function Footer({ locale }: { locale: Locale }) {
  const copy = i18n[locale];
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', company: '', email: '',
    country: '', phone: '',
    kvkk1: false, kvkk2: false,
  });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = copy.kvkkRequired.replace('KVKK onayı', 'Ad');
    if (!form.lastName.trim())  errs.lastName  = copy.kvkkRequired.replace('KVKK onayı', 'Soyad');
    if (!form.company.trim())   errs.company   = copy.kvkkRequired.replace('KVKK onayı', 'Şirket');
    if (!form.email.trim())     errs.email     = copy.kvkkRequired.replace('KVKK onayı', 'E-posta');
    if (!form.kvkk1)            errs.kvkk1     = copy.kvkkRequired;
    if (!recaptchaToken)        errs.recaptcha = copy.recaptchaRequired;
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('submitting');

    try {
      // contact form ID'sini slug ile al
      const formRes = await fetch(`${API_BASE}/forms/contact`);
      if (!formRes.ok) throw new Error();
      const formDef = await formRes.json();

      const res = await fetch(`${API_BASE}/forms/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formDefinitionId: formDef.id,
          data: {
            firstName: form.firstName,
            lastName:  form.lastName,
            company:   form.company,
            email:     form.email,
            country:   form.country,
            phone:     form.phone,
          },
          kvkkConsent:      form.kvkk1,
          marketingConsent: form.kvkk2,
          recaptchaToken,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  }

  const errorText = 'mt-1 text-xs text-red-400';

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
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }} />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-start">

            {/* Sol — başlık */}
            <div className="w-full md:w-2/5 text-white shrink-0 md:pt-2">
              <h2 className="text-3xl font-bold mb-4">{copy.title}</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{copy.subtitle}</p>
            </div>

            {/* Sağ — form */}
            <div className="w-full md:w-3/5">
              {status === 'success' ? (
                <div className="text-white text-center py-8">
                  <div className="text-green-400 text-4xl mb-4">✓</div>
                  <p className="text-lg font-medium">{copy.success}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-3">

                  {/* Row 1: First / Last */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input type="text" placeholder={`${copy.firstName} *`}
                        value={form.firstName}
                        onChange={e => setForm({ ...form, firstName: e.target.value })}
                        style={{ ...darkInput, borderColor: errors.firstName ? '#f87171' : undefined }}
                      />
                      {errors.firstName && <p className={errorText}>{errors.firstName}</p>}
                    </div>
                    <div>
                      <input type="text" placeholder={`${copy.lastName} *`}
                        value={form.lastName}
                        onChange={e => setForm({ ...form, lastName: e.target.value })}
                        style={{ ...darkInput, borderColor: errors.lastName ? '#f87171' : undefined }}
                      />
                      {errors.lastName && <p className={errorText}>{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Row 2: Company / Email */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input type="text" placeholder={`${copy.company} *`}
                        value={form.company}
                        onChange={e => setForm({ ...form, company: e.target.value })}
                        style={{ ...darkInput, borderColor: errors.company ? '#f87171' : undefined }}
                      />
                      {errors.company && <p className={errorText}>{errors.company}</p>}
                    </div>
                    <div>
                      <input type="email" placeholder={`${copy.email} *`}
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        style={{ ...darkInput, borderColor: errors.email ? '#f87171' : undefined }}
                      />
                      {errors.email && <p className={errorText}>{errors.email}</p>}
                    </div>
                  </div>

                  {/* Row 3: Country / Phone */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* CountrySelect — dark trigger override */}
                    <CountrySelect
                      fieldName="footer-country"
                      placeholder={copy.country}
                      value={form.country}
                      locale={locale}
                      triggerClassName={darkTrigger}
                      placeholderColor="text-white/50"
                      onChange={val => setForm({ ...form, country: val })}
                    />
                    {/* PhoneInput — dark background inline style */}
<div className="dark-phone-theme w-full">
                      <style>{`
                        /* 2. Ekleme: Kütüphanenin ana kapsayıcısına %100 genişlik veriyoruz 👇 */
                        .dark-phone-theme .iti {
                          width: 100%;
                        }
                        
                        /* Önceki yazdıklarımız aynen duruyor */
                        .dark-phone-theme .iti__selected-dial-code {
                          color: white !important;
                        }
                        .dark-phone-theme input::placeholder {
                          color: rgba(255,255,255,0.5) !important;
                        }
                        .dark-phone-theme .iti__country-list {
                          color: black !important;
                        }
                      `}</style>                    
                      
                      <PhoneInput
                        fieldName="footer-phone"
                        placeholder={copy.phone} 
                        inputStyle={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid rgba(255,255,255,0.2)',
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          color: 'white',
                          fontSize: '14px',
                          borderRadius: '2px',
                          outline: 'none',
                        }}
                        onChange={val => setForm({ ...form, phone: val })}
                      />
                    </div>
                  </div>

                  {/* KVKK + reCAPTCHA + Send */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pt-2">

                    {/* Sol: checkboxlar */}
                    <div className="flex-1 space-y-3">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.kvkk1}
                          onChange={e => setForm({ ...form, kvkk1: e.target.checked })}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-blue-500"
                        />
                        <span className="text-xs text-gray-300 leading-relaxed">
                          {copy.kvkk1}{' '}
                          <Link href={`/${locale}/privacy-policy`} className="text-blue-400 hover:underline">
                            {copy.kvkk1Link}
                          </Link>{' '}
                          {copy.kvkk1After}
                        </span>
                      </label>
                      {errors.kvkk1 && <p className={errorText}>{errors.kvkk1}</p>}

                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.kvkk2}
                          onChange={e => setForm({ ...form, kvkk2: e.target.checked })}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-blue-500"
                        />
                        <span className="text-xs text-gray-300 leading-relaxed">
                          {copy.kvkk2}{' '}
                          <Link href={`/${locale}/information-note`} className="text-blue-400 hover:underline">
                            {copy.kvkk2Link}
                          </Link>
                        </span>
                      </label>
                    </div>

                    {/* Sağ: reCAPTCHA + Send */}
                    <div className="flex flex-col items-center md:items-end gap-3 w-full md:w-[304px] shrink-0">
                      <div>
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={RECAPTCHA_SITE_KEY}
                          hl={locale}
                          onChange={token => {
                            setRecaptchaToken(token);
                            if (token) setErrors(prev => { const e = { ...prev }; delete e.recaptcha; return e; });
                          }}
                          onExpired={() => setRecaptchaToken(null)}
                        />
                        {errors.recaptcha && <p className={errorText}>{errors.recaptcha}</p>}
                      </div>

                      {status === 'error' && (
                        <p className="text-sm text-red-400 w-full text-right">{copy.error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="w-full py-3 bg-blue-600 text-white text-base font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 rounded-sm"
                      >
                        {status === 'submitting' ? copy.submitting : copy.submit}
                      </button>
                    </div>
                  </div>

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
                {locale === 'tr' ? 'Ürünler' : 'Products'}
              </p>
              <ul className="space-y-2">
                {[
                  { href: '/products/pam-kron',         label: { tr: 'Kron PAM',                   en: 'Kron PAM'                     } },
                  { href: '/products/data-security',    label: { tr: 'Veri Güvenliği',             en: 'Data Security'                } },
                  { href: '/products/dam',              label: { tr: 'Veritabanı Aktivite İzleme', en: 'Database Activity Monitoring' } },
                  { href: '/products/network-security', label: { tr: 'Ağ Güvenliği',               en: 'Network Security'             } },
                  { href: '/products/aaa-solution',     label: { tr: 'AAA Çözümü',                 en: 'AAA Solution'                 } },
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
                {locale === 'tr' ? 'Kurumsal' : 'About Us'}
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
                {locale === 'tr' ? 'Sosyal Medya' : 'Social Media'}
              </p>
              <ul className="space-y-2">
                {[
                  { href: 'https://www.linkedin.com/company/krontech',                     label: 'LinkedIn'  },
                  { href: 'https://x.com/kron_tech',                                       label: 'X'         },
                  { href: 'https://www.instagram.com/kron.tech/',                          label: 'Instagram' },
                  { href: 'https://www.youtube.com/channel/UCMV3_pdImKw-DeL6TC0uQQA',     label: 'Youtube'   },
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
                { href: 'https://e-sirket.mkk.com.tr/esir/Dashboard.jsp#/sirketbilgileri/10854', label: locale === 'tr' ? 'Elektronik Tebligat' : 'Information Society Services', external: true },
                { href: `/${locale}/privacy-policy`,   label: locale === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy',  external: false },
                { href: `/${locale}/information-note`, label: locale === 'tr' ? 'Bilgilendirme Notu'  : 'Information Note', external: false },
                { href: `/${locale}/cookie-policy`,    label: locale === 'tr' ? 'Çerez Politikası'    : 'Cookie Policy',   external: false },
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