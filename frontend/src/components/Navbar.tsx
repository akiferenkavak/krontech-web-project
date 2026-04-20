'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type Locale, locales } from '@/i18n/config';

const navLinks = [
  { key: 'products',  href: '/products',  label: { tr: 'Ürünler',      en: 'Products'  } },
  { key: 'solutions', href: '/solutions', label: { tr: 'Çözümler',     en: 'Solutions' } },
  { key: 'partners',  href: '/partners',  label: { tr: 'İş Ortaklığı', en: 'Partners'  } },
  { key: 'resources', href: '/resources', label: { tr: 'Kaynaklar',    en: 'Resources' } },
  { key: 'about',     href: '/about',     label: { tr: 'Hakkımızda',   en: 'About Us'  } },
  { key: 'contact',   href: '/contact',   label: { tr: 'İletişim',     en: 'Contact'   } },
];

export default function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Logo — orijinale yakın */}
        <Link href={`/${locale}`} className="flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-sm">
            <span className="text-white font-black text-base leading-none">K</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-bold text-gray-900 tracking-tight">Kron</span>
            <span className="text-[8px] font-medium text-gray-400 tracking-widest uppercase">Technologies</span>
          </div>
        </Link>

        {/* Nav linkleri — ortada */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(`/${locale}${link.href}`);
            return (
              <Link
                key={link.key}
                href={`/${locale}${link.href}`}
                className="px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap rounded-md"
                style={{
                  color: isActive ? '#2563eb' : '#374151',
                  borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                }}
              >
                {link.label[locale]}
              </Link>
            );
          })}
        </nav>

        {/* Sağ — arama + dil */}
        <div className="flex items-center gap-3 shrink-0">
          <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>

          <div className="flex items-center gap-1 text-sm">
            {locales.map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-300">|</span>}
                <Link
                  href={`/${l}${pathname.replace(/^\/(tr|en)/, '')}`}
                  className="font-semibold transition-colors px-1"
                  style={{ color: l === locale ? '#2563eb' : '#9ca3af' }}
                >
                  {l.toUpperCase()}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}