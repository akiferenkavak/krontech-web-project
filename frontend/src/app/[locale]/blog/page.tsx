import Link from 'next/link';
import { type Locale } from '@/i18n/config';
import { getBlogPosts, type BlogPostSummary } from '@/lib/api';

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
    <main className="max-w-7xl mx-auto px-6 py-16">
      {/* Başlık */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900">{copy.title}</h1>
        <p className="mt-3 text-lg text-gray-500">{copy.subtitle}</p>
      </div>

      {/* Hata */}
      {error && <p className="text-red-500 text-sm">{copy.error}</p>}

      {/* Boş */}
      {!error && posts.length === 0 && (
        <p className="text-gray-400 text-sm">{copy.empty}</p>
      )}

      {/* Liste */}
      {!error && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/${locale}/blog/${post.slug}`}
              className="group block rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-blue-200 transition-all"
            >
              {/* Cover image */}
              {post.coverImageUrl ? (
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                  <span className="text-4xl font-bold text-blue-200">
                    {post.title?.charAt(0)}
                  </span>
                </div>
              )}

              <div className="p-6">
                {/* Tarih */}
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(post.publishedAt).toLocaleDateString(
                    locale === 'tr' ? 'tr-TR' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </p>

                {/* Başlık */}
                <h2 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {post.title}
                </h2>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                )}

                <span className="text-sm text-blue-600 font-medium">
                  {copy.readMore}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}