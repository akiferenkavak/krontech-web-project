import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from '@/i18n/config';

function getLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const preferred = acceptLanguage
    .split(',')
    .map((s) => s.split(';')[0].trim().substring(0, 2));

  return (
    (preferred.find((l) => locales.includes(l as Locale)) as Locale) ??
    defaultLocale
  );
}

const ADMIN_PROTECTED = [
  '/admin/dashboard',
  '/admin/blog',
  '/admin/products',
  '/admin/resources',
  '/admin/media',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Admin path'leri — locale yönlendirmesinden ÖNCE kontrol et ────────
  if (pathname.startsWith('/admin')) {
    // Root admin → dashboard
    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Login sayfası — token varsa dashboard'a
    if (pathname === '/admin/login') {
      const token = request.cookies.get('admin_token')?.value;
      if (token) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next(); // token yok → login sayfasını göster
    }

    // Korumalı admin sayfaları — token yoksa login'e
    const isProtected = ADMIN_PROTECTED.some((p) => pathname.startsWith(p));
    if (isProtected) {
      const token = request.cookies.get('admin_token')?.value;
      if (!token) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Diğer /admin/* path'leri — olduğu gibi geç
    return NextResponse.next();
  }

  // ── 2. Public site — locale yönlendirmesi ────────────────────────────────
  const pathnameHasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};