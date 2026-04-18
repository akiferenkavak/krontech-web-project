import { type Locale } from '@/i18n/config';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Krontech — {locale}</h1>
    </main>
  );
}