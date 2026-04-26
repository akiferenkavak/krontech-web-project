import { notFound } from 'next/navigation';
import { type Locale } from '@/i18n/config';
import { getProducts } from '@/lib/api';
import { getCategoryBySlug } from '@/lib/categories';
import type { Metadata } from 'next';
import CategoryHero from '@/components/CategoryHero';
import CategoryBreadcrumb from '@/components/CategoryBreadcrumb';
import CategoryHeader from '@/components/CategoryHeader';
import CategoryProductGrid from '@/components/CategoryProductGrid';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  const meta = getCategoryBySlug(category);
  if (!meta) return { title: 'Not Found' };

  return {
    title: meta.title[locale],
    description: meta.description[locale],
    alternates: {
      languages: {
        tr: `https://krontech.com/tr/products/category/${category}`,
        en: `https://krontech.com/en/products/category/${category}`,
      },
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: Locale; category: string }>;
}) {
  const { locale, category } = await params;

  const meta = getCategoryBySlug(category);
  if (!meta) notFound();

  // Tüm ürünleri çek, bu kategoriye göre filtrele
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  try {
    const all = await getProducts(locale);
    products = all.filter((p) => p.category === meta.categoryKey);
  } catch {
    products = [];
  }

  return (
    <main>
      <CategoryHero
        bannerUrl={meta.bannerUrl}
        title={meta.title[locale]}
      />
      <CategoryBreadcrumb
        locale={locale}
        categoryTitle={meta.title[locale]}
      />
      <CategoryHeader
        title={meta.title[locale]}
        description={meta.description[locale]}
      />
      <CategoryProductGrid
        locale={locale}
        products={products}
      />
    </main>
  );
}
