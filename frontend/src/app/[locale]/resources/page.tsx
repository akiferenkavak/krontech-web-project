import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Kaynaklar' : 'Resources',
    description: locale === 'tr'
      ? 'Teknik dokümanlar, vaka çalışmaları ve rehberler.'
      : 'Technical documents, case studies and guides.',
    alternates: {
      languages: {
        'tr': 'https://krontech.com/tr/resources',
        'en': 'https://krontech.com/en/resources',
      },
    },
  };
}



const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api/v1';

const t = {
  tr: {
    title: 'Kaynaklar',
    subtitle: 'Teknik dokümanlar, vaka çalışmaları ve rehberler.',
    all: 'Tümü',
    datasheet: 'Datasheet',
    whitepaper: 'Whitepaper',
    caseStudy: 'Vaka Çalışması',
    download: 'İndir',
    learnMore: 'Devamını Oku',
    noResults: 'Bu kategoride kaynak bulunamadı.',
    relatedProduct: 'İlgili Ürün',
  },
  en: {
    title: 'Resources',
    subtitle: 'Technical documents, case studies and guides.',
    all: 'All',
    datasheet: 'Datasheet',
    whitepaper: 'Whitepaper',
    caseStudy: 'Case Study',
    download: 'Download',
    learnMore: 'Learn More',
    noResults: 'No resources found in this category.',
    relatedProduct: 'Related Product',
  },
};

const typeLabels: Record<string, keyof typeof t['en']> = {
  datasheet: 'datasheet',
  whitepaper: 'whitepaper',
  'case-study': 'caseStudy',
};

const typeColors: Record<string, string> = {
  datasheet:  'bg-blue-50 text-blue-700',
  whitepaper: 'bg-purple-50 text-purple-700',
  'case-study': 'bg-green-50 text-green-700',
};

interface ResourceSummary {
  id: string;
  slug: string;
  type: string;
  title: string;
  description: string | null;
  fileUrl: string | null;
  featuredImageUrl: string | null;
  relatedProductSlug: string | null;
  relatedProductTitle: string | null;
}

async function getResources(lang: string, type?: string): Promise<ResourceSummary[]> {
  const url = type
    ? `${API_BASE}/resources?lang=${lang}&type=${type}`
    : `${API_BASE}/resources?lang=${lang}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ResourcesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  const { type } = await searchParams;
  const copy = t[locale];

  const resources = await getResources(locale, type);

  const filters = [
    { key: undefined,      label: copy.all },
    { key: 'datasheet',    label: copy.datasheet },
    { key: 'whitepaper',   label: copy.whitepaper },
    { key: 'case-study',   label: copy.caseStudy },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* Başlık */}
      <div className="mb-10">
            <h1 className="text-4xl font-bold text-white mb-3">{copy.title}</h1>
             <p className="text-lg mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>{copy.subtitle}</p>
             <div className="w-12 h-1 rounded-full" style={{ background: 'linear-gradient(90deg, #2563eb, #60a5fa)' }} />
        </div>

      {/* Filtre tabları */}
      <div className="flex gap-2 mb-10 flex-wrap">
        {filters.map((f) => {
          const href = f.key
            ? `/${locale}/resources?type=${f.key}`
            : `/${locale}/resources`;
          const isActive = type === f.key || (!type && !f.key);

          return (
            <Link
              key={f.label}
              href={href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {/* Liste */}
      {resources.length === 0 ? (
        <p className="text-gray-400">{copy.noResults}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div
            key={resource.id}
            className="flex flex-col rounded-xl p-6 transition-all duration-300 border"
            style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(255,255,255,0.08)',
            }}
            >
              {/* Tip badge */}
              <span className={`self-start text-xs font-semibold px-2 py-1 rounded-full mb-4 ${
                typeColors[resource.type] ?? 'bg-gray-100 text-gray-600'
              }`}>
                {copy[typeLabels[resource.type] ?? 'all']}
              </span>

              {/* Başlık */}
              <h3 className="font-semibold text-white mb-2 leading-snug">
                {resource.title}
              </h3>

              {/* Açıklama */}
              {resource.description && (
                <p className="text-sm line-clamp-3 mb-4 flex-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {resource.description}
                </p>
              )}

              {/* İlgili ürün */}
              {resource.relatedProductSlug && (
                <Link
                  href={`/${locale}/products/${resource.relatedProductSlug}`}
                  className="text-xs text-blue-600 hover:underline mb-4"
                >
                  {copy.relatedProduct}: {resource.relatedProductSlug}
                </Link>
              )}

              {/* İndir butonu */}
              {resource.fileUrl ? (
                
                  <a href={resource.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {copy.download}
                </a>
              ) : (
                <span className="mt-auto text-xs text-gray-300 italic">
                  {copy.download} —
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}