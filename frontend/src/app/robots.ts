import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://krontech.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/en/', '/tr/'],
        disallow: ['/admin', '/api/', '/_next/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}