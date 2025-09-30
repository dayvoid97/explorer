import './globals.css'
import type { Metadata } from 'next'
import NavBarClientWrapper from './components/NavBarClientWrapper'
import Footer from './components/Footer'
import Script from 'next/script'
import { QuickPostButton } from './components/QuickPostButton'

export const metadata: Metadata = {
  title: 'Financial Gurkha',
  description:
    'Only Ws in the Chat. FINANCIAL GURKHA IS FOR THE WINNERS. Post Your Dubs, Make Money Online',
  keywords: [
    'financial gurkha',
    'investing',
    'make money online',
    'only ws in the chat',
    'only won the chat',
    'only win the chat',
    '@onlywonthechat',
    '@onlywinthechat',
    'stock market',
    'crypto market',
    'feed explorer',
    'market watcher',
    'crypto analysis',
    'platform to post Ws',
    'platform to post dubs',
  ],
  authors: [{ name: 'Kanchan Sharma', url: 'https://financialgurkha.com/about/kanchan' }],
  creator: 'Financial Gurkha',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Financial Gurkha',
    description:
      'Discover your favorite topics on Financial Gurkha. Generate income as a content creator.',
    url: 'https://financialgurkha.com/winners',
    siteName: 'Financial Gurkha',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Only Ws in the Chat',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth antialiased">
      <head>
        <meta
          name="google-site-verification"
          content="kCNuZr5CtsCqdB-qpgskyWfPOdIs_CWW--FeTAmOXK0"
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
        />
      </head>
      <body className="flex flex-col min-h-screen  ">
        {/* ✅ Google Analytics */}
        <Script
          id="gtag-src"
          src="https://www.googletagmanager.com/gtag/js?id=G-N9MVJV15MJ"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
              if (!window.gtagInitialized) {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-N9MVJV15MJ');
                window.gtagInitialized = true;
              }
            `}
        </Script>

        <NavBarClientWrapper />
        <main className="flex-grow">{children}</main>
        <QuickPostButton />
        <Footer />
      </body>
    </html>
  )
}
