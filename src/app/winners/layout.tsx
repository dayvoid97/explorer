import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financial Gurkha - Only Ws in the Chat',
  description:
    'The Winners: a hall of fame for the biggest Ws of life, from the greatest investors to the people and places that made us.',
  openGraph: {
    title: 'FINANCIAL GURKHA IS FOR THE WINNERS',
    description:
      'The Winners: a hall of fame for the biggest Ws of life, from the greatest investors to the people and places that made us.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Financial Gurkha is for the Winners',
      },
    ],
  },
}

export default function WinnersLayout({ children }: { children: React.ReactNode }) {
  return children
}
