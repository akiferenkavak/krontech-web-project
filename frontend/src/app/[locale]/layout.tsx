import { locales, type Locale } from '@/i18n/config';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    <>
      <Navbar locale={locale} />
      <div className="flex-1">{children}</div>
      <Footer locale={locale} />
    </>
  );
}