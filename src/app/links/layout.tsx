import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Links | Financial Gurkha',
  description:
    'Every Financial Gurkha research article, by headline. Tap the headline matching the Instagram post you came from to read the full research.',
  openGraph: {
    title: 'Links | Financial Gurkha',
    description:
      'Every Financial Gurkha research article, by headline. Tap the headline matching the Instagram post you came from to read the full research.',
    url: 'https://financialgurkha.com/links',
    siteName: 'Financial Gurkha',
    type: 'website',
  },
}

export default function LinksLayout({ children }: { children: ReactNode }) {
  return children
}
