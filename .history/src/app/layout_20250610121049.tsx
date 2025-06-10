import './globals.css'
import type { Metadata } from 'next'
import Navbar from './components/NavBar'
import Footer from './components/Footer'
import { PostHogProvider } from './providers/PostHogProvider'
import Script from 'next/script' // ✅ import next/script

export const metadata: Metadata = {
  title: 'Financial Gurkha',
  description: 'Explore the world of investing with Financial Gurkha Explorer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-N9MVJV15MJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N9MVJV15MJ');
          `}
        </Script>
        <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8441965953327461"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <PostHogProvider>
        <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </body>
      </PostHogProvider>
    </html>
  )
}
