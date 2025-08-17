import './globals.css'
import type { Metadata } from 'next'
import NavBarClientWrapper from './components/NavBarClientWrapper'
import Footer from './components/Footer'
import { PostHogProvider } from './providers/PostHogProvider'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Financial Gurkha',
  description:
    'Only Ws in the Chat. Try the Financial Gurkha Explorer at financialgurkha.com/explorer. Sister domain: www.thefederalreserve.com.',
  keywords: [
    'financial gurkha',
    'investing',
    'only ws in the chat',
    'only won the chat',
    'only win the chat',
    '@onlywonthechat',
    '@onlywinthechat',
    'stock market',
    'crypto market',
    'explorer',
    'market watcher',
    'crypto analysis',
    'macroeconomics',
    'microeconomics',
    'platform to post Ws',
    'platform to post dubs',
  ],
  authors: [{ name: 'Kanchan Sharma', url: 'https://financialgurkha.com' }],
  creator: 'Financial Gurkha',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Financial Gurkha',
    description:
      'Explore cards, wins, and insights. The Financial Gurkha Explorer is your search engine for investing and markets.',
    url: 'https://financialgurkha.com',
    siteName: 'Financial Gurkha',
    images: [
      {
        url: '/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'Financial Gurkha Preview',
      },
    ],
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth antialiased">
      <head />
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 ">
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

        {/* ✅ Google Adsense */}
        <Script
          id="adsense-script"
          strategy="afterInteractive"
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8441965953327461"
        />

        {/* ✅ Infolinks */}
        <Script id="infolinks-init" strategy="afterInteractive">
          {`
              if (!window.infolinks_initialized) {
                window.infolinks_pid = 3437271;
                window.infolinks_wsid = 0;
                window.infolinks_initialized = true;
              }
            `}
        </Script>
        <Script
          id="infolinks-lib"
          src="//resources.infolinks.com/js/infolinks_main.js"
          strategy="afterInteractive"
        />

        <NavBarClientWrapper />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
