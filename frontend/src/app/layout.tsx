import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'Kron', template: '%s | Kron' },
  description: 'Cybersecurity & Telecom Solutions',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <link rel="alternate" hrefLang="tr" href="https://krontech.com/tr" />
        <link rel="alternate" hrefLang="en" href="https://krontech.com/en" />
        <link rel="alternate" hrefLang="x-default" href="https://krontech.com/tr" />
      </head>
      <body className="min-h-full flex flex-col" style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}