import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { getProducts, getBlogPosts, type ProductSummary, type BlogPostSummary } from '@/lib/api';
import type { Metadata } from 'next';
import HeroSlider from '@/components/HeroSlider';


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'tr'
      ? 'Kron — Siber Güvenlik ve Telekom Çözümleri'
      : 'Kron — Cybersecurity & Telecom Solutions',
    description: locale === 'tr'
      ? 'Kurumsal altyapınızı güçlendiren, ölçeklenebilir ve güvenilir teknoloji platformları.'
      : 'Scalable, reliable technology platforms that strengthen your corporate infrastructure.',
    openGraph: {
      url: `https://krontech.com/${locale}`,
      siteName: 'Kron',
      locale: locale === 'tr' ? 'tr_TR' : 'en_US',
      type: 'website',
    },
  };
}

const t = {
  tr: {
    heroBadge: 'Siber Güvenlik Lideri',
    heroTitle: 'Siber Güvenlik ve Telekom Teknolojileri',
    heroSub: 'Kurumsal altyapınızı güçlendiren, ölçeklenebilir ve güvenilir teknoloji platformları.',
    heroCta: 'Ürünleri Keşfet',
    heroDemo: 'Demo Talep Et',
    productsTitle: 'Kron Ürünleri',
    productsSub: "Kron'un öncü teknoloji ve siber güvenlik yazılım ürünleri",
    statsTitle: 'Kron Rakamlarla',
    statsSub: '18 yıllık deneyim, yüzlerce proje...',
    blogTitle: 'Güncel Kalın',
    learnMore: 'Devamını Oku',
    requestDemo: 'Demo Talep Et',
  },
  en: {
    heroBadge: 'Cybersecurity Leader',
    heroTitle: 'Cybersecurity & Telecom Technologies',
    heroSub: 'Scalable, reliable technology platforms that strengthen your corporate infrastructure.',
    heroCta: 'Explore Products',
    heroDemo: 'Request Demo',
    productsTitle: 'Kron Products',
    productsSub: "Kron's cutting edge technology and cyber security software products",
    statsTitle: 'Kron in Numbers',
    statsSub: '18 years of experience, hundreds of projects...',
    blogTitle: 'Keep up to Date',
    learnMore: 'Read More',
    requestDemo: 'Request Demo',
  },
};

const stats = [
  { icon: '🌍', value: '6', label: { tr: 'Kıta', en: 'Continents' } },
  { icon: '🗺️', value: '35+', label: { tr: 'Ülke', en: 'Countries' } },
  { icon: '🤝', value: '200+', label: { tr: 'İş Ortağı', en: 'Partners' } },
  { icon: '🚀', value: '1500+', label: { tr: 'Kurulum', en: 'Deployments' } },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const copy = t[locale];

  let products: ProductSummary[] = [];
  let posts: BlogPostSummary[] = [];

  try { products = await getProducts(locale); } catch { /* ignore */ }
  try {
    const data = await getBlogPosts(locale, 0, 3);
    posts = data.content;
  } catch { /* ignore */ }

return (
    <main>
      {/* ===== HERO SLIDER ===== */}
      <HeroSlider locale={locale} />

      {/* ===== ÜRÜNLER — beyaz arka plan ===== */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{copy.productsTitle}</h2>
            <p className="text-gray-500">{copy.productsSub}</p>
          </div>

          {products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.slug}`}
                  className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300"
                >
                  <div className="h-40 flex items-center justify-center text-white font-bold text-xl"
                    style={{ background: 'linear-gradient(135deg, #1a2f6e, #2563eb)' }}>
                    <span className="text-4xl font-black opacity-30">
                      {product.category?.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">
                      {product.title ?? product.slug}
                    </h3>
                    {product.shortDescription && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {product.shortDescription}
                      </p>
                    )}
                    <span className="text-blue-600 text-sm font-semibold">
                      {copy.learnMore} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== KRON RAKAMLARLA ===== */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{copy.statsTitle}</h2>
            <p className="text-gray-500">{copy.statsSub}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.value} className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                  style={{ background: 'linear-gradient(135deg, #e8f0fe, #c7d7fd)' }}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label[locale]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BLOG ===== */}
      {posts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">{copy.blogTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="h-44 flex items-center justify-center relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0d1b3e, #1a2f6e)' }}>
                    <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded text-white"
                      style={{ backgroundColor: '#2563eb' }}>
                      Blog
                    </span>
                    <span className="text-5xl font-black text-white opacity-10">
                      {post.title?.charAt(0)}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
                      <span>
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(
                          locale === 'tr' ? 'tr-TR' : 'en-US',
                          { month: 'short', day: 'numeric', year: 'numeric' }
                        ) : ''}
                      </span>
                      <span className="text-blue-600 font-medium">{copy.learnMore}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== FOOTER ÜSTÜ CTA ===== */}
      <section style={{ background: 'linear-gradient(135deg, #0d1b3e, #111827)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {locale === 'tr' ? 'Kron ile İletişime Geçin' : 'Get in Touch with Kron'}
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            {locale === 'tr'
              ? 'Uzmanlarımız sizinle en kısa sürede iletişime geçecek.'
              : 'Our experts will get in touch with you shortly.'}
          </p>
          <Link
            href={`/${locale}/request-demo`}
            className="inline-block px-8 py-3 rounded text-white font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: '#2563eb' }}
          >
            {copy.requestDemo}
          </Link>
        </div>
      </section>
    </main>
  );}