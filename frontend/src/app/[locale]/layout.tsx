import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { locales, type Locale } from '@/i18n/config';
import Navbar from '@/components/Navbar';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'Kron', template: '%s | Kron' },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* hreflang — her dil için alternatif URL */}
        <link rel="alternate" hrefLang="tr" href={`https://krontech.com/tr`} />
        <link rel="alternate" hrefLang="en" href={`https://krontech.com/en`} />
        <link rel="alternate" hrefLang="x-default" href={`https://krontech.com/tr`} />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar locale={locale} />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}