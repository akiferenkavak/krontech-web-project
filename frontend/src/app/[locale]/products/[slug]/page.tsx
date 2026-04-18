import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { getProductBySlug, type ProductDetail } from '@/lib/api';

const t = {
  tr: {
    back: '← Ürünlere Dön',
    notFound: 'Ürün bulunamadı.',
    noContent: 'Bu ürün için henüz içerik eklenmemiş.',
    requestDemo: 'Demo Talep Et',
    downloadDatasheet: 'Datasheet İndir',
    subProducts: 'Alt Ürünler',
  },
  en: {
    back: '← Back to Products',
    notFound: 'Product not found.',
    noContent: 'No content available for this product yet.',
    requestDemo: 'Request a Demo',
    downloadDatasheet: 'Download Datasheet',
    subProducts: 'Sub Products',
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

        {/* CTA Butonları */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/${locale}/request-demo?product=${product.slug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
          >
            {copy.requestDemo}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <button
            disabled
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-500 cursor-not-allowed opacity-60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {copy.downloadDatasheet}
          </button>
        </div>
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
            {copy.subProducts}
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