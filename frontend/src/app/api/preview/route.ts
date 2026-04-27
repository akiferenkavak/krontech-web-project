// frontend/src/app/api/preview/route.ts — mevcut dosyayı tamamen değiştir

import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

const PREVIEW_SECRET = process.env.PREVIEW_SECRET ?? '';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const secret = searchParams.get('secret');
    const type   = searchParams.get('type');
    const slug   = searchParams.get('slug');
    const locale = searchParams.get('locale') ?? 'en';

    if (secret !== PREVIEW_SECRET) {
        return NextResponse.json({ error: 'Invalid preview secret' }, { status: 401 });
    }

    if (!type || !slug) {
        return NextResponse.json(
            { error: 'type ve slug parametreleri zorunludur' },
            { status: 400 }
        );
    }

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
                { error: `Geçersiz type: ${type}` },
                { status: 400 }
            );
    }

    const draft = await draftMode();
    draft.enable();

    // Preview sayfasına yönlendir — previewMode query parametresi ile
    const url = new URL(previewPath, request.url);
    url.searchParams.set('previewMode', 'true');

    return NextResponse.redirect(url);
}