import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financial Gurkha - Only Ws in the Chat',
  description:
    'Discover the latest wins from our community. See how winners are making money online and achieving their financial goals.',
  openGraph: {
    title: 'FINANCIAL GURKHA IS FOR THE WINNERS',
    description:
      'Discover the latest wins from our community. See how winners are making money online. Share your intel to make money.',
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
