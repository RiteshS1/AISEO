import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI SEO (AISEO) | Artificial Intelligence Engine Optimization by GetNifty',
  description:
    'Dominate the future of search with AI SEO. We optimize brands for AI engines like ChatGPT, Gemini, and Perplexity. Get a free AI visibility audit today.',
  keywords:
    'ai seo, aiseo, artificial intelligence seo, ai search engine optimization, ai seo tools, ai seo software, ai seo agency',
  openGraph: {
    title: 'AI SEO (AISEO) | Artificial Intelligence Engine Optimization by GetNifty',
    description:
      'Dominate the future of search with AI SEO. We optimize brands for AI engines like ChatGPT, Gemini, and Perplexity. Get a free AI visibility audit today.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
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
      <body className="bg-slate-950 text-slate-50 selection:bg-lime-500/30 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
