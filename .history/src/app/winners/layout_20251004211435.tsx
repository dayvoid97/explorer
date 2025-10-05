import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Financial Gurkha - Only Ws in the Chat',
  description:
    'Discover the latest wins from our community. See how winners are making money online and achieving their financial goals.',
  openGraph: {
    title: 'FINANCIAL GURKHA IS FOR THE WINNERS',
    description:
      'Discover the latest wins from our community. See how winners are making money online. Share your intel and make money.',
    images: [
      {
        url: 'https://p19-pu-sign-useast8.tiktokcdn-us.com/tos-useast5-avt-0068-tx/b5da813ff4e13a0c1fcb32abbc3fd109~tplv-tiktokx-cropcenter:1080:1080.jpeg?dr=9640&refresh_token=9f18861c&x-expires=1756929600&x-signature=Ps95pFqgarF37jZG1Ixd3FupHeg%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=useast5',
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
