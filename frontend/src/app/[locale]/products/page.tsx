import Link from 'next/link';
import { getProducts } from '@/lib/api';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Ürünler' : 'Products',
    description: locale === 'tr'
      ? 'Siber güvenlik ve telekom yazılım ürünlerimiz.'
      : 'Our cybersecurity and telecom software products.',
  };
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const products = await getProducts(locale);
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <main>
      {/* Hero band */}
      <div style={{ background: 'linear-gradient(135deg, #0d1b3e, #1a2f6e)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-2">
            {locale === 'tr' ? 'Ürünler' : 'Products'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>
            {locale === 'tr'
              ? "Kron'un öncü teknoloji ve siber güvenlik yazılım ürünleri"
              : "Kron's cutting edge technology and cyber security software products"}
          </p>
        </div>
      </div>

      {/* Ürün listesi — beyaz */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          {categories.map((category) => (
            <section key={category} className="mb-14">
              <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6 pb-3 border-b border-gray-100">
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products
                  .filter((p) => p.category === category && !p.parentId)
                  .map((product) => (
                    <Link
                      key={product.id}
                      href={`/${locale}/products/${product.slug}`}
                      className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md hover:border-blue-300 transition-all"
                    >
                      <div className="h-32 flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #1a2f6e, #2563eb)' }}>
                        <span className="text-white text-3xl font-black opacity-30">
                          {product.title?.charAt(0)}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {product.title}
                        </h3>
                        {product.shortDescription && (
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {product.shortDescription}
                          </p>
                        )}
                        <span className="mt-3 inline-block text-sm text-blue-600 font-semibold">
                          {locale === 'tr' ? 'Detaylı Bilgi' : 'Learn More'} →
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}