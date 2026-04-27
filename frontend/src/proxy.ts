import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, type Locale } from '@/i18n/config';

// ── In-memory redirect cache ─────────────────────────────────────────────────
type RedirectEntry = { fromPath: string; toPath: string; statusCode: number; isActive: boolean };

let redirectCache: RedirectEntry[] = [];
let cacheLastFetched = 0;
const CACHE_TTL_MS = 60_000;

async function getRedirects(): Promise<RedirectEntry[]> {
  const now = Date.now();
  if (now - cacheLastFetched < CACHE_TTL_MS) {
    console.log('[redirects] cache hit, count:', redirectCache.length);
    return redirectCache;
  }

  try {
    const internalApiUrl = process.env.INTERNAL_API_URL ?? 'http://backend:8080/api/v1';
    const url = `${internalApiUrl}/admin/redirects`;
    console.log('[redirects] fetching:', url);
    const res = await fetch(url, {
      headers: { 'x-internal-request': 'true' },
      cache: 'no-store',
    });
    console.log('[redirects] status:', res.status);
    const data = await res.json();
    console.log('[redirects] data:', JSON.stringify(data));
    redirectCache = (data.content ?? data) as RedirectEntry[];
    cacheLastFetched = now;
  } catch (e) {
    console.error('[redirects] fetch error:', e);
  }

  return redirectCache;
}
// ─────────────────────────────────────────────────────────────────────────────

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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Admin path'leri — locale yönlendirmesinden ÖNCE kontrol et ────────
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    if (pathname === '/admin/login') {
      const token = request.cookies.get('admin_token')?.value;
      if (token) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.next();
    }

    const isProtected = ADMIN_PROTECTED.some((p) => pathname.startsWith(p));
    if (isProtected) {
      const token = request.cookies.get('admin_token')?.value;
      if (!token) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  }

  // ── 2. Runtime redirect kontrolü ─────────────────────────────────────────
  const redirects = await getRedirects();
  const match = redirects.find(
    (r) => r.isActive && r.fromPath === pathname
  );
  if (match) {
    const destination = new URL(match.toPath, request.url);
    return NextResponse.redirect(destination, { status: match.statusCode });
  }

  // ── 3. Public site — locale yönlendirmesi ────────────────────────────────
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