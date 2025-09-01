import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Winners - Financial Gurkha',
  description:
    'Discover the latest wins from our community. See how winners are making money online and achieving their financial goals.',
  openGraph: {
    title: 'Winners - Financial Gurkha',
    description:
      'Discover the latest wins from our community. See how winners are making money online.',
    images: [
      {
        url: 'https://financialgurkha.com/og-winners.png',
        width: 1200,
        height: 630,
        alt: 'Financial Gurkha Winners',
      },
    ],
  },
}

export default function WinnersLayout({ children }: { children: React.ReactNode }) {
  return children
}
