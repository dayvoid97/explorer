import dynamic from 'next/dynamic'
import './globals.css'

import type { Metadata } from 'next'
import NavBarClientWrapper from './components/NavBarClientWrapper'
import Footer from './components/Footer'
import Script from 'next/script'
import GlobalScrollToTop from './components/GlobalScrollToTop'

import { AdSenseScript } from './components/AdsenseScript'
import { PostHogProvider } from './providers/PostHogProvider'

export const metadata: Metadata = {
  // metadataBase lets Next resolve relative image paths in OG/Twitter tags to
  // absolute URLs. Without it, social previews silently fail to load images.
  metadataBase: new URL('https://financialgurkha.com'),
  title: {
    default: 'Financial Gurkha — Independent Financial Market Research from Wall Street, New York',
    // Child pages supply only their own title; this appends the brand.
    template: '%s | Financial Gurkha',
  },
  description:
    'Independent equity valuations, earnings analysis, and macro research read straight from SEC filings. Written from Wall Street and Lower Manhattan, New York City. Est. 2022.',
  keywords: [
    'financial gurkha',
    'equity research',
    'intrinsic valuation',
    'DCF valuation',
    'earnings analysis',
    '10-K analysis',
    'SEC filings analysis',
    'stock market analysis',
    'US stock market',
    'macroeconomic analysis',
    'federal reserve analysis',
    'commodities',
    'crypto analysis',
    'independent markets research',
    'Kanchan Sharma',
    'Kanchan Sharma Forbes 30 under 30',
    'New York financial analyst',
    'Financial Analysts based in New York City',
  ],
  authors: [{ name: 'Kanchan Sharma', url: 'https://financialgurkha.com/about/kanchan' }],
  creator: 'Kanchan Sharma',
  publisher: 'Financial Gurkha',
  applicationName: 'Financial Gurkha',
  category: 'finance',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Financial Gurkha — Markets Research from Wall Street, New York',
    description:
      'Independent equity valuations, earnings analysis, and macro research read straight from SEC filings. New York City.',
    url: 'https://financialgurkha.com',
    siteName: 'Financial Gurkha',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Financial Gurkha — independent markets research, New York City',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Financial Gurkha — Markets Research from Wall Street, New York',
    description:
      'Independent equity valuations and earnings analysis, read straight from the filings.',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// Site-level structured data. Organization + WebSite establish the publisher
// entity and the author's credentials — the E-E-A-T signals that matter
// disproportionately for finance (YMYL) content, and the same graph answer
// engines read when deciding whether a source is authoritative enough to cite.
const siteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://financialgurkha.com/#organization',
      name: 'Financial Gurkha',
      alternateName: 'FinancialGurkha',
      url: 'https://financialgurkha.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://financialgurkha.com/logo.png',
      },
      description:
        'Independent markets research publication covering equity valuations, earnings and macro analysis from primary SEC filings.',
      foundingDate: '2022',
      knowsAbout: [
        'Equity Valuation',
        'Discounted Cash Flow Analysis',
        'Earnings Analysis',
        'SEC Filings',
        'Macroeconomics',
        'Commodities Trading',
        'Cryptocurrency Markets',
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'New York',
        addressRegion: 'NY',
        addressCountry: 'US',
      },
      founder: { '@id': 'https://financialgurkha.com/#kanchan' },
      publishingPrinciples: 'https://financialgurkha.com/legal/editorial',
    },
    {
      '@type': 'Person',
      '@id': 'https://financialgurkha.com/#kanchan',
      name: 'Kanchan Sharma',
      url: 'https://financialgurkha.com/about/kanchan',
      jobTitle: 'Independent Markets Analyst',
      description:
        'Financial economics graduate and independent markets analyst covering US equities, valuations and macro from New York City.',
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: "St. John's University",
      },
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        credentialCategory: 'degree',
        educationalLevel: 'Bachelor',
        about: 'Financial Economics',
      },
      knowsAbout: [
        'Intrinsic Valuation',
        'Discounted Cash Flow Modeling',
        'Equity Research',
        'Financial Statement Analysis',
        'Options and Derivatives',
        'Commodities',
      ],
      worksFor: { '@id': 'https://financialgurkha.com/#organization' },
      homeLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'New York',
          addressRegion: 'NY',
          addressCountry: 'US',
        },
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://financialgurkha.com/#website',
      url: 'https://financialgurkha.com',
      name: 'Financial Gurkha',
      description: 'Independent markets research from Wall Street, New York.',
      publisher: { '@id': 'https://financialgurkha.com/#organization' },
      inLanguage: 'en-US',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth antialiased">
      <head>
        <meta
          name="google-site-verification"
          content="kCNuZr5CtsCqdB-qpgskyWfPOdIs_CWW--FeTAmOXK0"
        />
        {/* robots / googlebot directives now come from the Metadata API above. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <Script
          id="gtag-src"
          src="https://www.googletagmanager.com/gtag/js?id=G-N9MVJV15MJ"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
              if (!window.gtagInitialized) {
                window.dataLayer = window.dataLayer || [];
                // Assign to window explicitly. Declaring gtag with 'function'
                // inside this block leaves it out of scope for other modules,
                // which is why custom events were never reaching GA4.
                window.gtag = function(){ window.dataLayer.push(arguments); };
                window.gtag('js', new Date());
                window.gtagInitialized = true;
              }
              // NOTE: gtag('config', ...) is deliberately NOT called here.
              // Configuration happens in PostHogProvider once the visit has
              // qualified (2s dwell or an interaction) and the client passes the
              // bot / non-production checks. Until config runs, gtag calls only
              // queue into dataLayer and nothing is sent to Google — so
              // localhost, preview builds and crawlers never appear in GA4.
            `}
        </Script>

        <PostHogProvider>
          <NavBarClientWrapper />

          <AdSenseScript />
          <main className="flex-grow">{children}</main>
          <GlobalScrollToTop />
          <Footer />
        </PostHogProvider>
      </body>
    </html>
  )
}
