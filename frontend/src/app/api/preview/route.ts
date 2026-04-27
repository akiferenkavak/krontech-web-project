// frontend/src/app/api/preview/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

const PREVIEW_SECRET = process.env.PREVIEW_SECRET ?? 'krontech-preview-secret';

/**
 * Preview endpoint — taslak içerikleri yayınlanmadan önce görüntülemek için.
 *
 * Kullanım:
 *   GET /api/preview?secret=<PREVIEW_SECRET>&type=blog&slug=<slug>&locale=en
 *   GET /api/preview?secret=<PREVIEW_SECRET>&type=product&slug=<slug>&locale=tr
 *
 * Admin paneli "Önizle" butonları bu URL'yi açar.
 * Preview modunu kapatmak için: GET /api/preview/exit
 */
export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const secret = searchParams.get('secret');
    const type   = searchParams.get('type');   // "blog" | "product" | "resource"
    const slug   = searchParams.get('slug');
    const locale = searchParams.get('locale') ?? 'en';

    // 1. Secret doğrulama
    if (secret !== PREVIEW_SECRET) {
        return NextResponse.json({ error: 'Invalid preview secret' }, { status: 401 });
    }

    // 2. Zorunlu parametreler
    if (!type || !slug) {
        return NextResponse.json(
            { error: 'type ve slug parametreleri zorunludur' },
            { status: 400 }
        );
    }

    // 3. Hedef URL'yi belirle
    let previewPath: string;

    switch (type) {
        case 'blog':
            previewPath = `/${locale}/blog/${slug}`;
            break;
        case 'product':
            previewPath = `/${locale}/products/${slug}`;
            break;
        case 'resource':
            previewPath = `/${locale}/resources`;
            break;
        default:
            return NextResponse.json(
                { error: `Geçersiz type: ${type}. Kabul edilenler: blog, product, resource` },
                { status: 400 }
            );
    }

    // 4. Draft mode'u aktifleştir (Next.js 13+ App Router)
    const draft = await draftMode();
    draft.enable();

    // 5. Önizleme sayfasına yönlendir
    return NextResponse.redirect(new URL(previewPath, request.url));
}