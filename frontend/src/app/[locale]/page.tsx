import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { getProducts, type ProductSummary } from '@/lib/api';

const t = {
  tr: {
    heroTitle: 'Siber Güvenlik ve Telekom Çözümleri',
    heroSub: 'Kurumsal altyapınızı güçlendiren, ölçeklenebilir ve güvenilir teknoloji platformları.',
    heroCta: 'Ürünleri Keşfet',
    heroDemo: 'Demo Talep Et',
    productsTitle: 'Ürün Kategorileri',
    productsError: 'Ürünler yüklenemedi.',
    productsEmpty: 'Henüz ürün bulunmuyor.',
    learnMore: 'İncele →',
  },
  en: {
    heroTitle: 'Cybersecurity & Telecom Solutions',
    heroSub: 'Scalable, reliable technology platforms that strengthen your corporate infrastructure.',
    heroCta: 'Explore Products',
    heroDemo: 'Request Demo',
    productsTitle: 'Product Categories',
    productsError: 'Could not load products.',
    productsEmpty: 'No products yet.',
    learnMore: 'Learn more →',
  },
};

async function ProductGrid({ locale }: { locale: Locale }) {
  let products: ProductSummary[] = [];
  let error = false;

  try {
    products = await getProducts(locale);
  } catch {
    error = true;
  }

  if (error) {
    return <p className="text-red-500 text-sm">{t[locale].productsError}</p>;
  }

  if (products.length === 0) {
    return <p className="text-gray-400 text-sm">{t[locale].productsEmpty}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/${locale}/products/${product.slug}`}
          className="group block rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
            <span className="text-blue-700 text-lg font-bold">
              {product.slug.charAt(0).toUpperCase()}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
            {product.title ?? product.slug}
          </h3>
          {product.shortDescription && (
            <p className="text-sm text-gray-500 line-clamp-2">{product.shortDescription}</p>
          )}
        <span className="mt-4 inline-block text-sm text-blue-600 font-medium">
        {t[locale].learnMore}
        </span>
        </Link>
      ))}
    </div>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const copy = t[locale];

  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              {copy.heroTitle}
            </h1>
            <p className="text-blue-100 text-lg mb-10 leading-relaxed">
              {copy.heroSub}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/${locale}/products`}
                className="px-6 py-3 rounded-md bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors"
              >
                {copy.heroCta}
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="px-6 py-3 rounded-md border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                {copy.heroDemo}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ürün Kategorileri */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-10">
          {copy.productsTitle}
        </h2>
        <ProductGrid locale={locale} />
      </section>
    </main>
  );
}