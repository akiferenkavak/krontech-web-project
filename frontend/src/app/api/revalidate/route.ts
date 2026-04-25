import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? 'krontech-revalidate-secret';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, slug } = body;

    if (type === 'product') {
      // Ürün sayfalarını revalidate et
      revalidatePath('/[locale]/products/[slug]', 'page');
      revalidatePath('/[locale]/products', 'page');
      revalidatePath('/[locale]', 'page'); // Ana sayfa (product catalog)
      if (slug) {
        revalidatePath(`/en/products/${slug}`);
        revalidatePath(`/tr/products/${slug}`);
      }
    } else if (type === 'blog') {
      // Blog sayfalarını revalidate et
      revalidatePath('/[locale]/blog/[slug]', 'page');
      revalidatePath('/[locale]/blog', 'page');
      revalidatePath('/[locale]', 'page'); // Ana sayfa (blog slider)
      if (slug) {
        revalidatePath(`/en/blog/${slug}`);
        revalidatePath(`/tr/blog/${slug}`);
      }
    } else if (type === 'all') {
      revalidatePath('/', 'layout');
    }

    return NextResponse.json({
      revalidated: true,
      type,
      slug: slug ?? null,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}