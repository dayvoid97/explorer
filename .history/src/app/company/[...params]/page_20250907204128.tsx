// app/company/[...params]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import CompanyCardPublicPage from './CompanyCardPublicPage'
import {
  createCardSlug,
  generateCardDescription,
  getCardImage,
  generateCardTitle,
} from '../../lib/cardSeoUtil'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Props {
  params: Promise<{
    params: string[]
  }>
}

// Define the card structure to match your hook
interface CardItem {
  title: string
  description?: string
  type: string
  mimeType?: string
  externalLink?: string
  paragraphs?: string[]
  content?: string
  categories?: string
  unitId?: string
  uploadedAt?: string
  viewCount?: number
  saveCount?: number
  signedUrl?: string
}

interface PublicCard {
  cardId: string
  cardTicker: string
  companyName: string
  username: string
  createdAt: string
  items: CardItem[]
}

async function getCardData(cardId: string): Promise<PublicCard | null> {
  try {
    const res = await fetch(`${API_URL}/gurkha/exploreCard?id=${cardId}`, {
      cache: 'no-store', // or 'force-cache' if you want caching
    })

    if (!res.ok) {
      return null
    }

    return await res.json()
  } catch (error) {
    console.error('Error fetching card data:', error)
    return null
  }
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const [cardId] = resolvedParams.params
  const cardData = await getCardData(cardId)

  if (!cardData) {
    return {
      title: 'Card not found',
      description: 'The requested company card could not be found.',
    }
  }

  const title = generateCardTitle(cardData)
  const description = generateCardDescription(cardData)
  const image = getCardImage(cardData)

  // Ensure image URL is absolute for social media
  const absoluteImageUrl = image.startsWith('http')
    ? image
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://financialgurkha.com'}${image}`

  const slug = createCardSlug(cardData.companyName, cardData.cardTicker)
  const canonicalUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || 'https://financialgurkha.com'
  }/company/${cardData.cardId}/${slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'article',
      url: canonicalUrl,
      siteName: 'Financial Gurkha', // Replace with your site name
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    // Additional SEO metadata
    authors: [{ name: cardData.username }],
    creator: cardData.username,
    publisher: 'Financial Gurkha', // Replace with your site name
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function CardPageWrapper({ params }: Props) {
  const resolvedParams = await params
  const [cardId, ...slugParts] = resolvedParams.params
  const providedSlug = slugParts.length > 0 ? slugParts.join('/') : null

  // Fetch the card data for slug validation
  const cardData = await getCardData(cardId)

  if (!cardData) {
    notFound()
  }

  // Generate the correct slug from the card data
  const correctSlug = createCardSlug(cardData.companyName, cardData.cardTicker)

  // If no slug provided, redirect to URL with slug
  if (!providedSlug) {
    redirect(`/company/${cardId}/${correctSlug}`)
  }

  // If provided slug doesn't match correct slug, redirect
  if (providedSlug !== correctSlug) {
    redirect(`/company/${cardId}/${correctSlug}`)
  }

  // Return the client component - it will use the hook to fetch data
  // We're only using server-side data for validation/redirects and metadata
  return <CompanyCardPublicPage />
}
