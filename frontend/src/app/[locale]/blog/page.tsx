import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { getBlogPosts, type BlogPostSummary } from '@/lib/api';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Blog' : 'Blog',
    description: locale === 'tr'
      ? 'Siber güvenlik ve teknoloji dünyasından güncel içerikler.'
      : 'Latest insights from the world of cybersecurity and technology.',
    alternates: {
      languages: {
        'tr': 'https://krontech.com/tr/blog',
        'en': 'https://krontech.com/en/blog',
      },
    },
  };
}


const t = {
  tr: {
    title: 'Blog',
    subtitle: 'Siber güvenlik ve teknoloji dünyasından güncel içerikler.',
    empty: 'Henüz blog yazısı bulunmuyor.',
    error: 'Blog yazıları yüklenemedi.',
    readMore: 'Devamını Oku →',
  },
  en: {
    title: 'Blog',
    subtitle: 'Latest insights from the world of cybersecurity and technology.',
    empty: 'No blog posts yet.',
    error: 'Could not load blog posts.',
    readMore: 'Read More →',
  },
};

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const copy = t[locale];

  let posts: BlogPostSummary[] = [];
  let error = false;

  try {
    const data = await getBlogPosts(locale);
    posts = data.content;
  } catch {
    error = true;
  }

  return (
    <main>
      {/* Hero band */}
      <div style={{ background: 'linear-gradient(135deg, #0d1b3e, #1a2f6e)' }} className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-2">{copy.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)' }}>{copy.subtitle}</p>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          {error && <p className="text-red-500 text-sm">{copy.error}</p>}
          {!error && posts.length === 0 && <p className="text-gray-400 text-sm">{copy.empty}</p>}
          {!error && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/${locale}/blog/${post.slug}`}
                  className="group bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
                >
                  <div className="h-44 flex items-center justify-center relative"
                    style={{ background: 'linear-gradient(135deg, #0d1b3e, #1a2f6e)' }}>
                    <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded text-white bg-blue-600">
                      Blog
                    </span>
                    <span className="text-5xl font-black text-white opacity-10">
                      {post.title?.charAt(0)}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-gray-400 mb-2">
                      {new Date(post.publishedAt ?? '').toLocaleDateString(
                        locale === 'tr' ? 'tr-TR' : 'en-US',
                        { year: 'numeric', month: 'short', day: 'numeric' }
                      )}
                    </p>
                    <h2 className="font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-3 mb-4">{post.excerpt}</p>
                    )}
                    <span className="text-sm text-blue-600 font-semibold">{copy.readMore}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}