'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef } from 'react';
import { type Locale, locales } from '@/i18n/config';

const productsMenu = {
  categories: [
    {
      key: 'iam',
      href: '/products/category/identity-access',
      label: { tr: 'Kimlik ve Erişim Yönetimi', en: 'Identity & Access Management' },
      items: [
        {
          key: 'pam',
          label: { tr: 'Ayrıcalıklı Erişim Yönetimi', en: 'Privileged Access Management' },
          href: '/products/pam-kron',
          children: [
            { label: { tr: 'Kron PAM', en: 'Kron PAM' }, href: '/products/pam-kron' },
            { label: { tr: 'Şifre Kasası', en: 'Password Vault' }, href: '/products/pam-kron' },
            { label: { tr: 'Oturum Yöneticisi', en: 'Privileged Session Manager' }, href: '/products/pam-kron' },
            { label: { tr: 'Görev Otomasyonu', en: 'Privileged Task Automation' }, href: '/products/pam-kron' },
            { label: { tr: 'Uç Nokta Yönetimi', en: 'Endpoint Privileged Management' }, href: '/products/pam-kron' },
            { label: { tr: 'Kullanıcı Davranış Analizi', en: 'User Behavior Analytics' }, href: '/products/pam-kron' },
          ],
        },
        { key: 'mfa', label: { tr: 'Çok Faktörlü Kimlik Doğrulama', en: 'Multi-Factor Authentication' }, href: '/products/pam-kron' },
        { key: 'uam', label: { tr: 'Birleşik Erişim Yöneticisi', en: 'Unified Access Manager' }, href: '/products/pam-kron' },
        { key: 'aaa', label: { tr: 'AAA Sunucusu', en: 'AAA Server' }, href: '/products/aaa-solution' },
      ],
    },
    {
      key: 'data',
      href: '/products/category/data',
      label: { tr: 'Veri Güvenliği ve Yönetimi', en: 'Data Security & Data Management' },
      items: [
        { key: 'telemetry', label: { tr: 'Telemetri Pipeline', en: 'Telemetry Pipeline' }, href: '/products/data-security' },
        { key: 'ddm', label: { tr: 'Dinamik Veri Maskeleme', en: 'Dynamic Data Masking' }, href: '/products/data-security' },
        { key: 'dam', label: { tr: 'Veritabanı Aktivite İzleme', en: 'Database Activity Monitoring' }, href: '/products/dam' },
      ],
    },
    {
      key: 'telco',
      href: '/products/category/network',
      label: { tr: 'Telko Çözümleri', en: 'Telco Solutions' },
      items: [
        { key: 'ipdr', label: { tr: 'IPDR Loglama', en: 'IPDR Logging' }, href: '/products/network-security' },
        { key: 'qa', label: { tr: 'Kalite Güvencesi', en: 'Quality Assurance' }, href: '/products/network-security' },
        { key: 'aaa2', label: { tr: 'AAA & Abone Yönetimi', en: 'AAA Server & Subscriber Management' }, href: '/products/aaa-solution' },
      ],
    },
  ],
  preview: {
    img: 'https://krontech.com/_upload/menuimages/92410abff8e7f3e19c7a24397170be54-5f0d5a11397d5.jpg',
    desc: {
      tr: 'Müşterilerin, çalışanların ve cihazların dijital kimliklerini çeşitli ortamlarda güvence altına alın.',
      en: 'Secure digital identities of your customers, employees and things in various environments, including on-premises, cloud and endpoint devices.',
    },
  },
};

const solutionsMenu = [
  {
    key: 'security',
    label: { tr: 'Güvenlik Kullanım Senaryoları', en: 'Security Use Cases' },
    items: [
      { label: { tr: 'Hizmet Olarak PAM', en: 'PAM as a Service' }, href: '/products/pam-kron' },
      { label: { tr: 'Güvenli Uzaktan Erişim', en: 'Secure Remote Access' }, href: '/products/pam-kron' },
      { label: { tr: 'İç Tehdit Koruması', en: 'Insider Threat Protection' }, href: '/products/pam-kron' },
      { label: { tr: 'Zero Trust ve En Az Ayrıcalık', en: 'Zero Trust and Least Privilege' }, href: '/products/pam-kron' },
      { label: { tr: 'Denetim ve Mevzuat Uyumu', en: 'Audit and Regulatory Compliance' }, href: '/products/pam-kron' },
      { label: { tr: 'OT Güvenliği', en: 'OT Security with Kron PAM' }, href: '/products/pam-kron' },
    ],
  },
  {
    key: 'telco',
    label: { tr: 'Telekom Kullanım Senaryoları', en: 'Telecom Use Cases' },
    items: [
      { label: { tr: "Cisco CPAR'ı Kron AAA ile Değiştir", en: 'Replace Cisco CPAR with Kron AAA' }, href: '/products/aaa-solution' },
      { label: { tr: 'Petabayt Ölçekli Veri Saklama', en: 'Petabyte-Scale Telco Data Retention' }, href: '/products/network-security' },
      { label: { tr: 'GPON Sağlama', en: 'GPON Provisioning & Service Activation' }, href: '/products/network-security' },
    ],
  },
  {
    key: 'data',
    label: { tr: 'Veri Yönetimi', en: 'Data Management' },
    items: [
      { label: { tr: 'Log Hacmini Azalt', en: 'Reduce Log Volume' }, href: '/products/data-security' },
      { label: { tr: 'Veri Yeniden Hidrasyonu', en: 'Data Rehydration' }, href: '/products/data-security' },
      { label: { tr: 'Güvenlik Verisi Yönetimi', en: 'Security Data Management' }, href: '/products/data-security' },
    ],
  },
];

function useDropdown() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enter = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const leave = () => { timer.current = setTimeout(() => setOpen(false), 150); };
  return { open, enter, leave };
}

function ProductsPanel({ locale }: { locale: Locale }) {
  const [openCat, setOpenCat] = useState<string | null>('iam');
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '320px', minWidth: '320px', padding: '16px 24px 16px 16px', borderRight: '1px solid #e5e7eb' }}>
        {productsMenu.categories.map((cat) => (
          <div key={cat.key} style={{ marginBottom: '4px' }}>
            <Link
              href={`/${locale}${cat.href}`}
  onClick={() => setOpenCat(openCat === cat.key ? null : cat.key)}
  style={{
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '5px 0', fontSize: '14px', fontWeight: 600, color: '#111827',
    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
    textDecoration: 'none',
  }}
>
              {cat.label[locale]}
              <svg style={{ width: '13px', height: '13px', color: '#9ca3af', flexShrink: 0, transform: openCat === cat.key ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            {openCat === cat.key && (
              <div style={{ paddingBottom: '8px' }}>
                {cat.items.map((item) => (
                  <div key={item.key}>
                    <Link
                      href={`/${locale}${item.href}`}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', fontWeight: 500, color: '#374151', padding: '3px 0 3px 8px', textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#2563eb')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
                    >
                      {item.label[locale]}
                      {'children' in item && item.children && (
                        <svg style={{ width: '11px', height: '11px', color: '#9ca3af', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </Link>
                    {'children' in item && item.children && (
                      <div style={{ marginLeft: '16px' }}>
                        {item.children.map((child) => (
                          <Link key={child.label.en} href={`/${locale}${child.href}`}
                            style={{ display: 'block', fontSize: '12px', color: '#6b7280', padding: '2px 0', textDecoration: 'none' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#2563eb')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
                          >
                            {child.label[locale]}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: '16px 16px 16px 28px', display: 'flex', flexDirection: 'column' }}>
        <img src={productsMenu.preview.img} alt="Products" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px', marginBottom: '14px' }} />
        <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>{productsMenu.preview.desc[locale]}</p>
      </div>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg style={{ width: '12px', height: '12px', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function Panel({ hook, children }: { hook: ReturnType<typeof useDropdown>; children: React.ReactNode }) {
  if (!hook.open) return null;
  return (
    <div
      style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, backgroundColor: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.12)', borderTop: '2px solid #2563eb', borderRadius: '0 0 6px 6px', width: '860px', maxWidth: 'calc(100vw - 48px)' }}
      onMouseEnter={hook.enter}
      onMouseLeave={hook.leave}
    >
      <div style={{ padding: '0 8px' }}>{children}</div>
    </div>
  );
}

function NavBtn({ label, hook }: { label: string; hook: ReturnType<typeof useDropdown> }) {
  return (
    <div onMouseEnter={hook.enter} onMouseLeave={hook.leave}>
      <button style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', fontSize: '16px', fontWeight: 500, color: hook.open ? '#2563eb' : '#111827', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', borderBottom: hook.open ? '2px solid #2563eb' : '2px solid transparent' }}>
        {label}
        <Chevron open={hook.open} />
      </button>
    </div>
  );
}

function PreviewBox({ img, title, desc }: { img: string; title: string; desc: string }) {
  return (
    <div style={{ width: '260px', minWidth: '260px', padding: '0 16px', borderLeft: '1px solid #f3f4f6' }}>
      <img src={img} alt={title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px', marginBottom: '12px' }} />
      <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', marginBottom: '8px' }}>{title}</p>
      <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>{desc}</p>
    </div>
  );
}

export default function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const isTr = locale === 'tr';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const products = useDropdown();
  const solutions = useDropdown();
  const partners = useDropdown();
  const resources = useDropdown();
  const about = useDropdown();

  return (
    <>
      {/* Announcement Bar */}
      <div
        style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%), #1563FF', height: '56px', color: 'white', display: 'flex', alignItems: 'center', overflow: 'hidden' }}
        className="hidden md:flex"
      >
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', height: '100%', paddingLeft: 'max(24px, calc((100% - 1280px) / 2 + 24px))' }}>
          <p style={{ marginRight: 'auto', fontSize: '14px' }}>
            <span style={{ fontWeight: 600 }}>(16 Apr) Webinar with KuppingerCole, </span>
            Kron &amp; Turkcell: Rethinking Privileged Access for Non-Human Identity
          </p>
          <a
            href="https://www.kuppingercole.com/events/rethinking-privileged-access"
            target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '14px', fontWeight: 600, color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch', padding: '0 40px', whiteSpace: 'nowrap', backgroundColor: 'rgba(0,40,120,0.6)', marginLeft: '32px' }}
          >
            {isTr ? 'Kayıt Ol' : 'Register Now'}
          </a>
        </div>
      </div>

      {/* Navbar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 9998, backgroundColor: 'white', borderBottom: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'visible' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', position: 'relative' }}>

          {/* Logo */}
          <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <img src="https://krontech.com/project/_resources/images/kt-dark-logo-en.png" alt="Kron" style={{ height: '66px', width: 'auto' }} />
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center' }} className="hidden md:flex">
            <NavBtn label={isTr ? 'Ürünler' : 'Products'} hook={products} />
            <NavBtn label={isTr ? 'Çözümler' : 'Solutions'} hook={solutions} />
            <NavBtn label={isTr ? 'İş Ortaklığı' : 'Partners'} hook={partners} />
            <NavBtn label={isTr ? 'Kaynaklar' : 'Resources'} hook={resources} />
            <NavBtn label={isTr ? 'Hakkımızda' : 'About Us'} hook={about} />
            <Link href={`/${locale}/contact`} style={{ padding: '8px 12px', fontSize: '16px', fontWeight: 500, color: pathname === `/${locale}/contact` ? '#2563eb' : '#111827', textDecoration: 'none', whiteSpace: 'nowrap', borderBottom: pathname === `/${locale}/contact` ? '2px solid #2563eb' : '2px solid transparent' }}>
              {isTr ? 'İletişim' : 'Contact'}
            </Link>
          </nav>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            <button onClick={() => setSearchOpen(!searchOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px' }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }} className="hidden md:flex">
              {locales.map((l, i) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {i > 0 && <span style={{ color: '#d1d5db' }}>|</span>}
                  <Link href={`/${l}${pathname.replace(/^\/(tr|en)/, '')}`} style={{ fontWeight: 700, color: l === locale ? '#2563eb' : '#9ca3af', textDecoration: 'none', padding: '0 4px' }}>
                    {l.toUpperCase()}
                  </Link>
                </span>
              ))}
            </div>
            <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4b5563', padding: '4px' }}>
              <svg style={{ width: '24px', height: '24px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>

          {/* Panels */}
          <Panel hook={products}>
            <div style={{ paddingTop: '8px', paddingBottom: '8px' }}>
              <ProductsPanel locale={locale} />
            </div>
          </Panel>

          <Panel hook={solutions}>
            <div style={{ display: 'flex', padding: '16px 0' }}>
              <div style={{ flex: 1, display: 'flex' }}>
                {solutionsMenu.map((col, i) => (
                  <div key={col.key} style={{ flex: 1, padding: '0 24px', borderRight: i < solutionsMenu.length - 1 ? '2px solid #e6e6e6' : 'none' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af', marginBottom: '10px', paddingBottom: '6px', borderBottom: '1px solid #f3f4f6' }}>
                      {col.label[locale]}
                    </p>
                    {col.items.map((item) => (
                      <Link key={item.label.en} href={`/${locale}${item.href}`}
                        style={{ display: 'block', fontSize: '13px', color: '#374151', padding: '5px 0', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#2563eb')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
                      >
                        {item.label[locale]}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
              <PreviewBox
                img="https://krontech.com/_upload/menuimages/92410abff8e7f3e19c7a24397170be54-5f0d5a11397d5.jpg"
                title={isTr ? 'Çözümler' : 'Solutions'}
                desc={isTr ? 'Kurumunuzun güvenlik ve telekom ihtiyaçlarına yönelik kapsamlı çözümler.' : "Comprehensive solutions for your organization's security and telecom needs."}
              />
            </div>
          </Panel>

          <Panel hook={partners}>
            <div style={{ display: 'flex', padding: '16px 0' }}>
              <div style={{ flex: 1, padding: '0 8px' }}>
                {[
                  { label: { tr: 'Partner Portalı', en: 'Partner Portal' }, href: 'https://partner.krontech.com/' },
                  { label: { tr: 'Etkinlikler', en: 'Events' }, href: 'https://partner.krontech.com/kron-expo-meetings' },
                ].map((item) => (
                  <a key={item.label.en} href={item.href} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', padding: '8px 0', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#2563eb')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
                  >
                    {item.label[locale]}
                  </a>
                ))}
              </div>
              <PreviewBox
                img="https://krontech.com/_upload/menuimages/eeca816a5e04dbbc3d7d6a426b5afe1e-5f0d5f54ab3f7.jpg"
                title={isTr ? 'Kron İş Ortakları' : 'Kron Partner Community'}
                desc={isTr ? "Kron'un yüksek teknoloji ürünleri dünya genelinde 40'tan fazla iş ortağıyla sunulmaktadır." : "Kron's high-tech products are globally available with more than 40 partners all over the world."}
              />
            </div>
          </Panel>

          <Panel hook={resources}>
            <div style={{ display: 'flex', padding: '16px 0' }}>
              <div style={{ flex: 1, padding: '0 8px' }}>
                {[
                  { label: { tr: 'Datasheetler', en: 'Datasheets' }, href: '/resources?type=datasheet' },
                  { label: { tr: 'Vaka Çalışmaları', en: 'Case Studies' }, href: '/resources?type=case-study' },
                  { label: { tr: 'Blog', en: 'Blog' }, href: '/blog' },
                ].map((item) => (
                  <Link key={item.label.en} href={`/${locale}${item.href}`}
                    style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', padding: '8px 0', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#2563eb')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
                  >
                    {item.label[locale]}
                  </Link>
                ))}
              </div>
              <PreviewBox
                img="https://krontech.com/_upload/menuimages/cybersecurity_470x170_1.jpg"
                title={isTr ? 'Siber Güvenlik Kaynakları' : 'Cybersecurity Resources'}
                desc={isTr ? 'Vaka çalışmaları, datasheetler ve bloglardan oluşan siber güvenlik kütüphanemizi keşfedin.' : 'Explore our cybersecurity library of case studies, datasheets and blogs to learn more about Kron solutions.'}
              />
            </div>
          </Panel>

          <Panel hook={about}>
            <div style={{ display: 'flex', padding: '16px 0' }}>
              <div style={{ flex: 1, padding: '0 8px' }}>
                {[
                  { label: { tr: 'Hakkımızda', en: 'About Us' }, href: '/about' },
                  { label: { tr: 'Yönetim', en: 'Management' }, href: '/about' },
                  { label: { tr: 'Yönetim Kurulu', en: 'Board of Directors' }, href: '/about' },
                  { label: { tr: 'Kariyer', en: 'Careers' }, href: '/about' },
                  { label: { tr: 'Basın Odası', en: 'Newsroom' }, href: '/about' },
                  { label: { tr: 'Duyurular', en: 'Announcements' }, href: '/about' },
                  { label: { tr: 'Yatırımcı İlişkileri', en: 'Investor Relations' }, href: '/about' },
                ].map((item) => (
                  <Link key={item.label.en} href={`/${locale}${item.href}`}
                    style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', padding: '6px 0', textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#2563eb')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#374151')}
                  >
                    {item.label[locale]}
                  </Link>
                ))}
              </div>
              <PreviewBox
                img="https://krontech.com/_upload/menuimages/d3903840072012f6d38ffbf6b76ad676-5f197a0b7378b.jpg"
                title={isTr ? 'Hakkımızda' : 'About Us'}
                desc={isTr ? 'Kron, telekomünikasyon sektörü başta olmak üzere finans, enerji ve sağlık sektörlerine yüksek teknoloji çözümleri üretmektedir.' : 'Kron produces high technology solutions for the operational efficiency and security needs of corporate enterprises in finance, energy and health sectors.'}
              />
            </div>
          </Panel>

        </div>

        {/* Search */}
        {searchOpen && (
          <div style={{ borderTop: '1px solid #f3f4f6', backgroundColor: 'white', padding: '16px 24px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <input
                type="text" autoFocus value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isTr ? 'Size nasıl yardımcı olabiliriz?' : 'How can we help you?'}
                style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: '4px', padding: '8px 16px', fontSize: '14px', outline: 'none' }}
              />
              <button onClick={() => setSearchOpen(false)} style={{ fontSize: '14px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}>
                {isTr ? 'Kapat' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9997, backgroundColor: 'white', overflowY: 'auto', paddingTop: '64px' }}>
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            {[
              { label: { tr: 'Ürünler', en: 'Products' }, href: '/products' },
              { label: { tr: 'Çözümler', en: 'Solutions' }, href: '/products' },
              { label: { tr: 'İş Ortaklığı', en: 'Partners' }, href: '/about' },
              { label: { tr: 'Kaynaklar', en: 'Resources' }, href: '/resources' },
              { label: { tr: 'Hakkımızda', en: 'About Us' }, href: '/about' },
              { label: { tr: 'İletişim', en: 'Contact' }, href: '/contact' },
            ].map((item) => (
              <Link key={item.href + item.label.en} href={`/${locale}${item.href}`} onClick={() => setMobileOpen(false)}
                style={{ display: 'block', fontSize: '16px', fontWeight: 500, color: '#1f2937', padding: '12px 0', borderBottom: '1px solid #f3f4f6', textDecoration: 'none' }}>
                {item.label[locale]}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
              {locales.map((l) => (
                <Link key={l} href={`/${l}${pathname.replace(/^\/(tr|en)/, '')}`} onClick={() => setMobileOpen(false)}
                  style={{ fontSize: '14px', fontWeight: 700, color: l === locale ? '#2563eb' : '#9ca3af', textDecoration: 'none' }}>
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}