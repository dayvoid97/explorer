import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import WinDetailPage from './WinDetailPage'
import { createSlug } from '@/app/lib/utils'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Props {
  params: {
    params: string[] // This will be [winId] or [winId, slug]
  }
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
  const [winId] = params.params
  const winData = await getWinData(winId)

  if (!winData) {
    return {
      title: 'Win not found',
      description: 'The requested win could not be found.',
    }
  }

  const title = winData.title
  const description = winData.paragraphs?.[0] || `A win by ${winData.username}: ${title}`
  const image = winData.previewImageUrl || winData.mediaUrls?.[0] || '/logo.png'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

export default async function WinCardPageWrapper({ params }: Props) {
  const [winId, providedSlug] = params.params

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
