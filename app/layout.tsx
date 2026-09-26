import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import FloatingContactWidget from '@/components/FloatingContactWidget';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: '/' },
  title: 'AISEO by Ritesh | AI Search Visibility',
  description:
    'AI Engine Optimization (AIEO) platform. Audit and optimize your brand for ChatGPT, Gemini, Perplexity & LLMs. Free AI visibility audit – get discovered when AI answers.',
  keywords: [
    'AIEO',
    'AI Engine Optimization',
    'AI search visibility',
    'ChatGPT visibility',
    'Gemini ranking',
    'LLM optimization',
    'AI SEO',
    'answer engine optimization',
    'AISEO by Ritesh',
  ],
  openGraph: {
    title: 'AISEO by Ritesh | AI Search Visibility',
    description:
      'AI Engine Optimization platform. Audit your brand for ChatGPT, Gemini & Perplexity. Free AI visibility audit.',
    url: '/',
    siteName: 'AISEO by Ritesh',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AISEO by Ritesh | AI Search Visibility',
    description:
      'AI Engine Optimization platform. Audit your brand for ChatGPT, Gemini & Perplexity. Free AI visibility audit.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
        )}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': ['Organization', 'SoftwareApplication'],
              name: 'AISEO by Ritesh',
              description:
                'AISEO by Ritesh is an AI Engine Optimization auditing platform that helps brands improve visibility in AI search.',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
            }),
          }}
        />
      </head>
      <body className={`bg-slate-950 text-slate-50 selection:bg-lime-500/30 antialiased ${inter.className}`} suppressHydrationWarning>
        {children}
        <FloatingContactWidget />
      </body>
    </html>
  );
}
