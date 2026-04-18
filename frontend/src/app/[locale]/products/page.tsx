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
    alternates: {
      languages: {
        'tr': 'https://krontech.com/tr/products',
        'en': 'https://krontech.com/en/products',
      },
    },
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
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {locale === 'tr' ? 'Ürünler' : 'Products'}
      </h1>
      <p className="text-lg text-gray-500 mb-12">
        {locale === 'tr'
          ? 'Siber güvenlik ve telekom yazılım ürünlerimiz'
          : 'Our cybersecurity and telecom software products'}
      </p>

      {categories.map((category) => (
        <section key={category} className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-2">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) => p.category === category && !p.parentId)
              .map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.slug}`}
                  className="block border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-400 transition-all"
                >
                  {product.featuredImageUrl && (
                    <img
                      src={product.featuredImageUrl}
                      alt={product.title}
                      className="h-10 w-auto mb-4 object-contain"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {product.title}
                  </h3>
                  {product.shortDescription && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  )}
                </Link>
              ))}
          </div>
        </section>
      ))}
    </main>
  );
}