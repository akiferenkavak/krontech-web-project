import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { getProducts, getBlogPosts, type ProductSummary, type BlogPostSummary } from '@/lib/api';
import type { Metadata } from 'next';
import HeroSlider from '@/components/HeroSlider';
import ProductCatalog from '@/components/ProductCatalog';
import BlogSlider from '@/components/BlogSlider';


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
    whyKronTitle: 'Neden Kron',
    whyKronDesc: 'Kron, BT erişim kontrol sistemleri, servis aktivasyonu ve siber güvenlik alanlarındaki son teknoloji yazılım ürünleriyle işletmenize değer katar.',
    whyKronCta: 'Daha Fazla',
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
    whyKronTitle: 'Why Kron',
    whyKronDesc: 'Kron adds value to your business with its cutting edge software products in the ICT access control systems, service activation and cyber security fields.',
    whyKronCta: 'Learn More',
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
      <ProductCatalog locale={locale} products={products} />

      {/* ===== WHY KRON ===== */}
<section
  className="py-16"
  style={{
    backgroundImage: `url('https://krontech.com/_upload/backgroundimages/analysts-back.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <div className="max-w-7xl mx-auto px-6">
    <div className="flex flex-col md:flex-row items-center gap-8">

      {/* Sol — beyaz kutu */}
      <div className="w-full md:w-7/12 bg-white p-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          {copy.whyKronTitle}<b>?</b>
        </h2>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          {copy.whyKronDesc}
        </p>
        <Link
          href={`/${locale}/about`}
          className="inline-block border border-blue-600 text-blue-600 px-6 py-2 text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors"
        >
          {copy.whyKronCta}
        </Link>
      </div>

      {/* Sağ — analist görseli */}
      <div className="w-full md:w-5/12 flex justify-center">
        <img
          src="https://krontech.com/_upload/descriptioncontentimages2/analysts5_1.png"
          alt="Industry Analysts"
          className="w-full max-w-sm"
        />
      </div>

    </div>
  </div>
</section>

      {/* ===== KRON RAKAMLARLA ===== */}
<section style={{ backgroundColor: '#f5f5f5' }} className="py-16">
  <div className="max-w-7xl mx-auto px-6">
    <div className="text-center mb-12">
      <h3 className="text-3xl font-bold text-gray-900 mb-2">{copy.statsTitle}</h3>
      <p className="text-gray-500">{copy.statsSub}</p>
    </div>
    <div className="flex justify-center">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl w-full">
        {[
          { img: 'GroupZ1410078698Z1Z2.png', value: '6',     label: { tr: 'Kıta',      en: 'Continents'  } },
          { img: 'country_04.jpg',           value: '35+',   label: { tr: 'Ülke',      en: 'Countries'   } },
          { img: 'GroupZ1410078700Z1Z1_3.png',value: '200+', label: { tr: 'İş Ortağı', en: 'Partners'    } },
          { img: 'GroupZ1410078701Z1Z1.png',  value: '1500+',label: { tr: 'Kurulum',   en: 'Deployments' } },
        ].map((stat) => (
          <div key={stat.value} className="flex flex-col items-center text-center px-4">
            <img
              src={`https://krontech.com/_upload/iconimages/${stat.img}`}
              alt={stat.label.en}
              className="object-contain mb-4"
              style={{ width: '140px', height: '140px' }}
            />
            <h5 className="text-base text-gray-800">
              <span className="font-bold" style={{ color: '#2563eb' }}>{stat.value}</span>
              {' '}
              <span className="font-normal text-gray-700">{stat.label[locale]}</span>
            </h5>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>


{/* ===== SUCCESS STORY ===== */}
<section className="bg-white">
  <div className="flex flex-col md:flex-row">
    {/* Sol — görsel */}
    <div className="w-full md:w-1/2">
      <img
        src="https://krontech.com/_upload/descriptioncontentimages/GroupZ9.png"
        alt="Kron PAM Bank Case Study"
        className="w-full h-full object-cover"
        style={{ minHeight: '400px' }}
      />
    </div>

    {/* Sağ — içerik */}
    <div className="w-full md:w-1/2 flex flex-col justify-center bg-white px-16 py-16">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 leading-snug">
        {locale === 'tr'
          ? "Kron, dünyanın önde gelen bankalarından birine PAM'i 3 ayda kurmasında yardımcı oluyor"
          : "Kron helps one of the world's leading banks to deploy PAM in 3 months"}
      </h3>
      <p className="text-gray-500 mb-8 leading-relaxed" style={{ fontSize: '14px' }}>
        {locale === 'tr'
          ? 'Kron\'un güçlü bir PAM çözümünü yalnızca 3 ayda nasıl hayata geçirdiğini, 19.000 cihazı coğrafi yedeklilikle güvence altına aldığını keşfedin.'
          : 'Discover how Kron implemented a robust PAM solution in just 3 months, securing 19,000 devices with geo-redundancy. Serving 17 million clients across Canada, the U.S., and 27 other countries, Kron operates from 4 major data centers in Canada, New York, London, and Singapore, with globally distributed operations teams managing over 15,000 devices.'}
      </p>
      <a
        href="https://krontech.com/_upload/pdf/KronPAM_BANK_CaseZStudy.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="self-start border border-blue-600 text-blue-600 px-6 py-2 text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors"
>
        {locale === 'tr' ? 'Başarı Hikayesini İncele' : 'See the Success Story'}
      </a>
    </div>
  </div>
</section>

      {/* ===== BLOG ===== */}
      {posts.length > 0 && (
  <BlogSlider locale={locale} posts={posts} />
)}


    </main>
  );}