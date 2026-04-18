import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { getBlogPostBySlug, type BlogPostDetail } from '@/lib/api';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const post = await getBlogPostBySlug(slug, locale);
    const translation = post.translations?.find(
      (t) => t.languageCode === locale
    );

    const title = translation?.seoTitle ?? translation?.title ?? slug;
    const description = translation?.seoDescription ?? translation?.excerpt ?? '';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://krontech.com/${locale}/blog/${slug}`,
        siteName: 'Kron',
        locale: locale === 'tr' ? 'tr_TR' : 'en_US',
        type: 'article',
        publishedTime: translation?.publishedAt ?? undefined,
      },
      alternates: {
        languages: {
          'tr': `https://krontech.com/tr/blog/${slug}`,
          'en': `https://krontech.com/en/blog/${slug}`,
        },
      },
    };
  } catch {
    return { title: slug };
  }
}

const t = {
  tr: {
    back: '← Bloga Dön',
    notFound: 'Blog yazısı bulunamadı.',
    noContent: 'Bu yazı için henüz içerik eklenmemiş.',
  },
  en: {
    back: '← Back to Blog',
    notFound: 'Blog post not found.',
    noContent: 'No content available for this post yet.',
  },
};

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const copy = t[locale];

  let post: BlogPostDetail | null = null;
  let error = false;

  try {
    post = await getBlogPostBySlug(slug, locale);
  } catch {
    error = true;
  }

  if (error || !post) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-20">
        <Link href={`/${locale}/blog`} className="text-sm text-blue-600 hover:underline">
          {copy.back}
        </Link>
        <p className="mt-8 text-gray-500">{copy.notFound}</p>
      </main>
    );
  }

  const translation = post.translations?.find(
    (t) => t.languageCode === locale
  );

  const jsonLd = translation ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': translation.title,
    'description': translation.excerpt ?? '',
    'datePublished': translation.publishedAt ?? '',
    'author': {
      '@type': 'Organization',
      'name': 'Kron',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Kron',
      'url': 'https://krontech.com',
    },
  } : null;

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">

      {/* JSON-LD */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Geri butonu */}
      <Link href={`/${locale}/blog`} className="text-sm text-blue-600 hover:underline">
        {copy.back}
      </Link>

      {/* Başlık alanı */}
      <div className="mt-8 mb-10">
        {translation?.publishedAt && (
          <p className="text-sm text-gray-400 mb-3">
            {new Date(translation.publishedAt).toLocaleDateString(
              locale === 'tr' ? 'tr-TR' : 'en-US',
              { year: 'numeric', month: 'long', day: 'numeric' }
            )}
          </p>
        )}
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          {translation?.title ?? slug}
        </h1>
        {translation?.excerpt && (
          <p className="mt-4 text-xl text-gray-500">
            {translation.excerpt}
          </p>
        )}
      </div>

      {/* Kapak görseli */}
      {post.featuredImageUrl && (
        <div className="mb-10 rounded-xl overflow-hidden">
          <img
            src={post.featuredImageUrl}
            alt={translation?.title ?? slug}
            className="w-full h-72 object-cover"
          />
        </div>
      )}

      {/* İçerik */}
      {translation?.content ? (
        <div
          className="prose prose-lg max-w-none text-gray-700"
          dangerouslySetInnerHTML={{ __html: translation.content }}
        />
      ) : (
        <p className="text-gray-400">{copy.noContent}</p>
      )}
    </main>
  );
}