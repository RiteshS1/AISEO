import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import FloatingContactWidget from '@/components/FloatingContactWidget';

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
  metadataBase: new URL('https://aiseo-n9lz.vercel.app'),
  title: 'GetNifty AIEO | Dominate AI Search Visibility',
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
    'GetNifty',
  ],
  openGraph: {
    title: 'GetNifty AIEO | Dominate AI Search Visibility',
    description:
      'AI Engine Optimization platform. Audit your brand for ChatGPT, Gemini & Perplexity. Free AI visibility audit.',
    url: '/',
    siteName: 'GetNifty AIEO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GetNifty AIEO | Dominate AI Search Visibility',
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
              name: 'GetNifty',
              description:
                'GetNifty AIEO is an AI Engine Optimization (AIEO) auditing platform that helps brands dominate visibility in AI search. We audit and optimize for ChatGPT, Gemini, Perplexity, and other LLMs so your brand is discovered when AI answers.',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web',
            }),
          }}
        />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is AI SEO (AISEO)?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'AI SEO, also known as AISEO or AIO (Artificial Intelligence Optimization), is the strategy of optimizing digital content to be discovered, understood, and cited by Generative AI models like ChatGPT, Gemini, and Perplexity, in addition to traditional search engines.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How can AI improve SEO for small businesses?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'AI tools automate complex technical audits, generate structured schema data, and help small businesses build topical authority faster by identifying content gaps that AI engines prioritize.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What are the best AI SEO tools?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'While content tools like Jasper are popular, true AISEO requires visibility analytics tools that measure entity confidence. GetNifty provides specialized auditing for brand visibility across LLMs.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Will AI replace traditional SEO in 2025?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: "It won't replace it, but it will evolve into a hybrid model where 'Answer Engine Optimization' (AEO) becomes as critical as traditional keywords. Traffic will shift from blue links to direct AI answers.",
                  },
                },
                {
                  '@type': 'Question',
                  name: 'How do I optimize images for AI SEO?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'AI vision models read images for context. Optimization requires descriptive filenames, alt text that describes object relationships, and surrounding the image with entity-rich content.',
                  },
                },
              ],
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
