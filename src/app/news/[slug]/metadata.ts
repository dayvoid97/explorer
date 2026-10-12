import { getNewsBySlug } from '@/app/lib/news'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  let item
  try {
    item = await getNewsBySlug(slug)
  } catch {
    return { title: 'News item not found | Financial Gurkha News' }
  }

  const url = `https://financialgurkha.com/news/${slug}`
  const published = new Date(item.date)
  const publishedTime = isNaN(published.getTime()) ? undefined : published.toISOString()

  const description =
    item.dek.length > 158
      ? `${item.dek.slice(0, 155).replace(/\s+\S*$/, '')}…`
      : item.dek

  const shareImage = item.image || '/logo.png'

  return {
    title: `${item.headline} | Financial Gurkha News`,
    description,
    keywords: item.tags?.join(', '),
    authors: [{ name: 'Financial Gurkha' }],
    alternates: { canonical: url },
    openGraph: {
      title: item.headline,
      description,
      images: [{ url: shareImage, alt: item.headline }],
      type: 'article',
      url,
      siteName: 'Financial Gurkha',
      publishedTime,
      authors: ['Financial Gurkha'],
      tags: item.tags,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: item.headline,
      description,
      images: [{ url: shareImage, alt: item.headline }],
    },
    other: {
      'article:published_time': publishedTime ?? '',
      'article:author': 'Financial Gurkha',
    },
  }
}
