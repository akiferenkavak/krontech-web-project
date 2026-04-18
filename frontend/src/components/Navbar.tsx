'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type Locale, locales } from '@/i18n/config';

const navLinks = [
  { key: 'products',  href: '/products',  label: { tr: 'Ürünler',      en: 'Products'  } },
  { key: 'sectors',   href: '/sectors',   label: { tr: 'Sektörler',    en: 'Sectors'   } },
  { key: 'partners',  href: '/partners',  label: { tr: 'İş Ortaklığı', en: 'Partners'  } },
  { key: 'resources', href: '/resources', label: { tr: 'Kaynaklar',    en: 'Resources' } },
  { key: 'about',     href: '/about',     label: { tr: 'Hakkımızda',   en: 'About'     } },
  { key: 'contact',   href: '/contact',   label: { tr: 'İletişim',     en: 'Contact'   } },
];

export default function Navbar({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-1 shrink-0">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-700 rounded-sm text-white font-black text-lg leading-none">
            K
          </span>
          <span className="flex flex-col leading-none ml-1">
            <span className="text-lg font-bold text-gray-900 tracking-tight">Kron</span>
            <span className="text-[9px] font-semibold text-gray-400 tracking-widest uppercase">Teknoloji</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={`/${locale}${link.href}`}
              className="text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors whitespace-nowrap"
            >
              {link.label[locale]}
            </Link>
          ))}
        </nav>

        {/* Dil + Arama */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Arama ikonu */}
          <button className="text-gray-400 hover:text-gray-700 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>

          {/* Dil switcher */}
          <div className="flex items-center gap-1 text-sm border border-gray-200 rounded-md px-2 py-1">
            {locales.map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-300 text-xs">|</span>}
                <Link
                  href={`/${l}${pathname.replace(/^\/(tr|en)/, '')}`}
                  className={
                    l === locale
                      ? 'font-semibold text-blue-700'
                      : 'text-gray-400 hover:text-gray-700 transition-colors'
                  }
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