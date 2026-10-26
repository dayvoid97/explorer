import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Playfair_Display } from 'next/font/google'

// Self-hosted at build time by next/font, instead of a render-blocking Google
// Fonts stylesheet requested from inside the page.
const serif = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-links-serif',
})

export const metadata: Metadata = {
  title: 'Financial Gurkha Links',
  description: 'Every Financial Gurkha article in one page. Tap any card to read the full story.',
  openGraph: {
    title: 'Financial Gurkha Links',
    description:
      'Every Financial Gurkha research article, by headline. Tap the headline matching the Instagram post you came from to read the full research.',
    url: 'https://financialgurkha.com/links',
    siteName: 'Financial Gurkha',
    type: 'website',
  },
}

export default function LinksLayout({ children }: { children: ReactNode }) {
  return <div className={serif.variable}>{children}</div>
}
