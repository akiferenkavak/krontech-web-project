// frontend/src/app/api/preview/exit/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

/**
 * Preview modunu kapatır ve ana sayfaya yönlendirir.
 * GET /api/preview/exit?redirect=/tr/blog/my-post
 */
export async function GET(request: NextRequest) {
    const draft = await draftMode();
    draft.disable();

    const redirectTo = request.nextUrl.searchParams.get('redirect') ?? '/';
    return NextResponse.redirect(new URL(redirectTo, request.url));
}