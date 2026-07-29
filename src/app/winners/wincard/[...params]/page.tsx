import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import WinDetailPage from './WinDetailPage'
import { createSlug } from '@/app/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://financialgurkha.com' // Use a proper fallback

// Correcting the interface for Next.js 15
interface Props {
  params: Promise<{
    params: string[]
  }>
}

async function getWinData(winId: string) {
  try {
    const res = await fetch(`${API_URL}/gurkha/wins/${winId}`, {
      cache: 'no-store',
    })

    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    return null
  }
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const [winId] = resolvedParams.params

  const winData = await getWinData(winId)
  const correctSlug = winData ? createSlug(winData.title) : ''
  const canonicalUrl = `${SITE_URL}/winners/wincard/${winId}/${correctSlug}`

  if (!winData) {
    return {
      title: 'Win not found',
      description: 'The requested content could not be found.',
    }
  }

  const title = winData.title
  const description = winData.paragraphs?.[0] || `A win by ${winData.username}: ${title}`

  // UPDATED: Better image prioritization logic
  const getWinImage = (winData: any): string => {
    if (winData.previewImageUrl) {
      return winData.previewImageUrl
    }

    // Priority 2: External link preview (like YouTube thumbnail)
    if (winData.externalLink?.previewImage) {
      return winData.externalLink.previewImage
    }

    // Priority 3: First media URL if it's an image
    if (winData.mediaUrls?.length > 0) {
      for (let i = 0; i < winData.mediaUrls.length; i++) {
        const url = winData.mediaUrls[i]
        const mimeType = winData.mimeTypes?.[i]

        // Check if it's an image by MIME type
        if (mimeType && mimeType.startsWith('image/')) {
          return url
        }

        // Fallback: check by file extension
        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return url
        }
      }
    }

    // Priority 4: Fallback to logo
    return '/logo.png'
  }

  const image = getWinImage(winData)
  // Ensure image URL is absolute for social media
  const absoluteImageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: title,
    image: absoluteImageUrl,
    datePublished: winData.createdAt,
    dateModified: winData.updatedAt || winData.createdAt, // Assumes an updatedAt field exists
    author: {
      '@type': 'Person',
      name: winData.username,
      url: `${SITE_URL}/publicprofile/${winData.username}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Financial Gurkha',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    description: description,
  }

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
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
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
    },
  }
}

export default async function WinCardPageWrapper({ params }: Props) {
  const resolvedParams = await params
  const [winId, providedSlug] = resolvedParams.params

  const winData = await getWinData(winId)

  if (!winData) {
    notFound()
  }

  // Generate the correct slug from the title
  const correctSlug = createSlug(winData.title)
  // If no slug provided, redirect to URL with slug
  if (!providedSlug || providedSlug !== correctSlug) {
    redirect(`/winners/wincard/${winId}/${correctSlug}`)
  }

  // Pass the already fetched data to the detail component
  return <WinDetailPage initialWinData={winData} winId={winId} /> // Pass data
}
