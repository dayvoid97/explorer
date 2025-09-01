import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import WinDetailPage from './WinDetailPage'
import { createSlug } from '@/app/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Props {
  params: Promise<{
    params: string[]
  }>
}

async function getWinData(winId: string) {
  try {
    // Backend stays the same - only uses winId
    const res = await fetch(`${API_URL}/gurkha/wins/${winId}`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      return null
    }

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

  if (!winData) {
    return {
      title: 'Win not found',
      description: 'The requested win could not be found.',
    }
  }

  const title = winData.title
  const description = winData.paragraphs?.[0] || `A win by ${winData.username}: ${title}`

  // UPDATED: Better image prioritization logic
  const getWinImage = (winData: any): string => {
    // Priority 1: Dedicated preview image
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
  const absoluteImageUrl = image.startsWith('http')
    ? image
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://financialgurkha.com'}${image}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200, // Recommended OG image dimensions
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
  const resolvedParams = await params // Add this line
  const [winId, providedSlug] = resolvedParams.params // Change this line

  // Fetch the win data
  const winData = await getWinData(winId)

  if (!winData) {
    notFound()
  }

  // Generate the correct slug from the title
  const correctSlug = createSlug(winData.title)

  // If no slug provided, redirect to URL with slug
  if (!providedSlug) {
    redirect(`/winners/wincard/${winId}/${correctSlug}`)
  }

  // If provided slug doesn't match correct slug, redirect
  if (providedSlug !== correctSlug) {
    redirect(`/winners/wincard/${winId}/${correctSlug}`)
  }

  // Pass winId to your existing component
  return <WinDetailPage winId={winId} />
}
