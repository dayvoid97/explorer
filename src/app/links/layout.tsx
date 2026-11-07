import type { Metadata } from 'next'
import type { ReactNode } from 'react'
// The brand serif, served from the repo (see app/fonts), exposed to the grid as
// var(--font-playfair) instead of a render-blocking Google Fonts stylesheet.
import { playfair as serif } from '@/app/fonts'

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
