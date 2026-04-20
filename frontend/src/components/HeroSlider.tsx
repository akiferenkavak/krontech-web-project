'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type Locale } from '@/i18n/config';

const BASE = 'https://krontech.com';

const slides = [
  {
    bg: `${BASE}/_upload/slaytimages/slider_bg_kc.png`,
    rightImage: `${BASE}/_upload/slaytimagesmobil/685x650_kuppinger_logo.png`,
    title: { tr: 'Kron Recognized as a', en: 'Kron Recognized as a' },
    titleBold: { tr: '3 Kategoride Lider ve 1 Kategoride Challenger', en: 'Leader in 3 Categories and a Challenger in 1 Category' },
    titleSuffix: { tr: ' olarak tanındı!', en: ' by KuppingerCole Analysts!' },
    desc: {
      tr: 'Kron, dünyanın önde gelen araştırma firması KuppingerCole Analistleri tarafından tanınan önemli bir kilometre taşına ulaştı. PAM\'da Ürün Lideri, Non-Human Identity Management\'ta Genel Lider ve Ürün Lideri. OT/ICS için Güvenli Uzaktan Erişimde Genel Lider, Ürün Lideri, Pazar Lideri ve İnovasyon Lideri. Veri Güvenliği Platformlarında Challenger.',
      en: 'Kron has achieved a major milestone by being recognized by one of the world\'s leading research firm, KuppingerCole Analysts. Product Leader in PAM, Overall Leader and Product Leader in Non-Human Identity Management. Overall Leader, Product Leader, Market Leader, and Innovation Leader in Secure Remote Access for OT/ICS. Challenger in Data Security Platforms reports.',
    },
    cta: { tr: 'Raporları İncele', en: 'Get The Reports Now' },
    href: '/recognized-as-a-leader-by-kuppingercole-4-categories-recognized-leading-trusted',
  },
  {
    bg: `${BASE}/_upload/slaytimages/sliderbg.png`,
    rightImage: `${BASE}/_upload/slaytimagesmobil/00-Global-ENG_1.png`,
    title: { tr: 'Küresel Olarak Tanınan', en: 'Globally Recognized' },
    titleBold: { tr: 'Çözüm Portföyü', en: 'Portfolio of Solutions' },
    titleSuffix: { tr: '', en: '' },
    desc: {
      tr: 'Kron, ölçeklenebilirlik, kullanılabilirlik ve uyumluluk için en yüksek standartları karşılamak üzere güvenilen görev-kritik çözümler sunar.',
      en: 'Kron delivers mission-critical solutions trusted to meet the highest standard for scalability, availability, and compliance.',
    },
    cta: { tr: 'İletişime Geç', en: 'Contact Us' },
    href: '/contact',
  },
  {
    bg: `${BASE}/_upload/slaytimages/sliderbg.png`,
    rightImage: `${BASE}/_upload/slaytimagesmobil/1-pam_1.png`,
    title: { tr: 'Kron', en: 'Kron' },
    titleBold: { tr: 'Ayrıcalıklı Erişim Yönetimi', en: 'Privileged Access Management' },
    titleSuffix: { tr: '', en: '' },
    desc: {
      tr: 'Dünyanın önde gelen PAM platformu ile iç tehditlere karşı esnek, merkezi yönetimli ve katmanlı bir savunma güvenlik mimarisi oluşturun.',
      en: 'Establish a flexible, centrally managed and layered defense security architecture against insider threats with the world\'s leading Privileged Access Management platform.',
    },
    cta: { tr: 'Detaylı Bilgi', en: 'Learn More' },
    href: '/products/pam-kron',
  },
  {
    bg: `${BASE}/_upload/slaytimages/sliderbg.png`,
    rightImage: `${BASE}/_upload/slaytimagesmobil/2-epm_.png`,
    title: { tr: 'Kron', en: 'Kron' },
    titleBold: { tr: 'Uç Nokta Ayrıcalık Yönetimi', en: 'Endpoint Management' },
    titleSuffix: { tr: '', en: '' },
    desc: {
      tr: 'Uç noktalarda çalışan uygulama ve komutları kontrol edin ve izleyin, kuruluş genelinde ayrıcalıklı kullanıcıları daha verimli yönetin.',
      en: 'Control and monitor applications and commands run on endpoints, manage privileged users across the organization more efficiently.',
    },
    cta: { tr: 'Detaylı Bilgi', en: 'Learn More' },
    href: '/products/network-security',
  },
  {
    bg: `${BASE}/_upload/slaytimages/sliderbg.png`,
    rightImage: `${BASE}/_upload/slaytimagesmobil/3-secret-managements_.png`,
    title: { tr: 'Kron', en: 'Kron' },
    titleBold: { tr: 'Sır Yönetimi', en: 'Secrets Management' },
    titleSuffix: { tr: '', en: '' },
    desc: {
      tr: 'Kron PAM\'ın gelişmiş Sır Yönetimi ile ayrıcalıklı parolaların paylaşılması riskini ortadan kaldırın.',
      en: 'Eliminate the risk of sharing privileged passwords with Kron PAM\'s enhanced Secrets Management.',
    },
    cta: { tr: 'Detaylı Bilgi', en: 'Learn More' },
    href: '/products/pam-kron',
  },
  {
    bg: `${BASE}/_upload/slaytimages/sliderbg.png`,
    rightImage: `${BASE}/_upload/slaytimagesmobil/4-aaa_.png`,
    title: { tr: 'Kron', en: 'Kron' },
    titleBold: { tr: 'Kimlik Doğrulama, Yetkilendirme ve Hesap Yönetimi', en: 'Authentication, Authorization, and Accounting' },
    titleSuffix: { tr: '', en: '' },
    desc: {
      tr: 'Gelişmiş profil oluşturma özellikleri ile yetkilendirme, kimlik doğrulama ve hesap yönetimi platformu.',
      en: 'Authorization, authentication and accounting platform with advanced profiling features.',
    },
    cta: { tr: 'Detaylı Bilgi', en: 'Learn More' },
    href: '/products/network-security',
  },
  {
    bg: `${BASE}/_upload/slaytimages/sliderbg.png`,
    rightImage: `${BASE}/_upload/slaytimagesmobil/5-ddm_.png`,
    title: { tr: 'Kron', en: 'Kron' },
    titleBold: { tr: 'Dinamik Veri Maskeleme', en: 'Dynamic Data Masking' },
    titleSuffix: { tr: '', en: '' },
    desc: {
      tr: 'Rol tabanlı erişim kontrolü, dinamik veri maskeleme ve kapsamlı veritabanı aktivite izleme ile hassas veri koruma ve gerçek zamanlı gözetim sağlayın.',
      en: 'Leverage advanced role-based access control, dynamic data masking, and comprehensive database activity monitoring to ensure sensitive data protection and real-time oversight.',
    },
    cta: { tr: 'Detaylı Bilgi', en: 'Learn More' },
    href: '/products/data-security',
  },
  {
    bg: `${BASE}/_upload/slaytimages/sliderbg.png`,
    rightImage: `${BASE}/_upload/slaytimagesmobil/6-tlmp__1.png`,
    title: { tr: 'Kron', en: 'Kron' },
    titleBold: { tr: 'Telemetri Pipeline', en: 'Telemetry Pipeline' },
    titleSuffix: { tr: '', en: '' },
    desc: {
      tr: 'Kron Telemetri Pipeline, kuruluşların gözlemlenebilirlik ve güvenlik odaklı veri akışlarını yönetmelerini sağlar, tedarikçi bağımlılığını azaltır.',
      en: 'Kron Telemetry Pipeline enables organizations to manage their observability and security data streams, mitigates vendor lock-in, and assists in breaking down data silos.',
    },
    cta: { tr: 'Detaylı Bilgi', en: 'Learn More' },
    href: '/products/data-security',
  },
  {
    bg: `${BASE}/_upload/slaytimages/sliderbg.png`,
    rightImage: `${BASE}/_upload/slaytimagesmobil/7-dam_.png`,
    title: { tr: 'Kron', en: 'Kron' },
    titleBold: { tr: 'Veritabanı Aktivite İzleme', en: 'Database Activity Monitoring' },
    titleSuffix: { tr: '', en: '' },
    desc: {
      tr: 'Kron Veri Aktivite İzleme ile veritabanlarınızı koruyun ve sürekli uyumluluk, veri bütünlüğü ve operasyonel istikrarı sağlayın.',
      en: 'Secure your databases with Kron Data Activity Monitoring and ensure continuous compliance, data integrity, and operational stability.',
    },
    cta: { tr: 'Detaylı Bilgi', en: 'Learn More' },
    href: '/products/data-security',
  },
  {
    bg: `${BASE}/_upload/slaytimages/sliderbg.png`,
    rightImage: `${BASE}/_upload/slaytimagesmobil/8-ipdr_.png`,
    title: { tr: 'Kron', en: 'Kron' },
    titleBold: { tr: 'IPDR Loglama', en: 'IPDR Logging' },
    titleSuffix: { tr: '', en: '' },
    desc: {
      tr: 'Kron\'un amaca özel IPDR Loglama çözümü ile geniş bant abonelerin ağ trafiği aktivitelerini toplayın, dönüştürün ve depolayın.',
      en: 'Collect, transform, and store broadband subscribers\' network traffic activities with Kron\'s purpose-built IPDR Logging.',
    },
    cta: { tr: 'Detaylı Bilgi', en: 'Learn More' },
    href: '/products/network-security',
  },
];

export default function HeroSlider({ locale }: { locale: Locale }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden" style={{ height: '85vh', minHeight: '560px' }}>
      {/* Arka plan */}
      <div className="absolute inset-0">
        <Image
          src={slide.bg}
          alt=""
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>

      {/* İçerik */}
      <div className="relative h-full max-w-7xl mx-auto px-6">
        <div className="flex h-full items-center justify-between">

          {/* Sol — Metin */}
          <div className="w-full lg:w-5/12 text-white z-10 pb-16 lg:pb-0">
            <h2 className="text-3xl lg:text-4xl font-bold mb-5 leading-tight">
              {slide.title[locale]}{' '}
              <span className="px-1 rounded" style={{ backgroundColor: '#1563ff' }}>
                {slide.titleBold[locale]}
              </span>
              {slide.titleSuffix[locale]}
            </h2>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {slide.desc[locale]}
            </p>
            <Link
              href={`/${locale}${slide.href}`}
              className="inline-block px-6 py-3 text-white font-semibold text-sm rounded transition-all hover:opacity-90"
              style={{ backgroundColor: '#1563ff' }}
            >
              {slide.cta[locale]}
            </Link>
          </div>

          {/* Sağ — Görsel */}
          <div className="hidden lg:flex w-7/12 h-full items-center justify-center pl-8">
            <div className="relative w-full h-full">
              <Image
                src={slide.rightImage}
                alt={slide.titleBold[locale]}
                fill
                className="object-contain object-right"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10 px-6">
        <div className="max-w-7xl w-full mx-auto flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '40px' : '10px',
                height: '6px',
                backgroundColor: i === current ? 'white' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}