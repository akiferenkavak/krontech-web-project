import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { getProductBySlug, type ProductDetail } from '@/lib/api';

const t = {
  tr: {
    back: '← Ürünlere Dön',
    notFound: 'Ürün bulunamadı.',
    noContent: 'Bu ürün için henüz içerik eklenmemiş.',
  },
  en: {
    back: '← Back to Products',
    notFound: 'Product not found.',
    noContent: 'No content available for this product yet.',
  },
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const copy = t[locale];

  let product: ProductDetail | null = null;
  let error = false;

  try {
    product = await getProductBySlug(slug, locale);
  } catch {
    error = true;
  }

  if (error || !product) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-20">
        <Link href={`/${locale}/products`} className="text-sm text-blue-600 hover:underline">
          {copy.back}
        </Link>
        <p className="mt-8 text-gray-500">{copy.notFound}</p>
      </main>
    );
  }

  const translation = product.translations?.find(
    (t) => t.languageCode === locale
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* Geri butonu */}
      <Link href={`/${locale}/products`} className="text-sm text-blue-600 hover:underline">
        {copy.back}
      </Link>

      {/* Başlık */}
      <div className="mt-8 mb-12">
        <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
          {product.category}
        </span>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">
          {translation?.title ?? product.slug}
        </h1>
        {translation?.shortDescription && (
          <p className="mt-4 text-xl text-gray-500 max-w-2xl">
            {translation.shortDescription}
          </p>
        )}
      </div>

      {/* İçerik */}
      {translation?.content ? (
        <div
          className="prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: translation.content }}
        />
      ) : (
        <p className="text-gray-400">{copy.noContent}</p>
      )}

      {/* Alt ürünler */}
      {product.children && product.children.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {locale === 'tr' ? 'Alt Ürünler' : 'Sub Products'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.children.map((child) => (
              <Link
                key={child.id}
                href={`/${locale}/products/${child.slug}`}
                className="block rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
              >
                <h3 className="font-semibold text-gray-900 hover:text-blue-700">
                  {child.title ?? child.slug}
                </h3>
                {child.shortDescription && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {child.shortDescription}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}