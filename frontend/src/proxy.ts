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

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

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