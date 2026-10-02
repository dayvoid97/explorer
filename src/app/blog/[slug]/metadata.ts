import { getPostBySlug } from '@/app/lib/markdown'
import type { Metadata } from 'next'

export interface BlogPost {
  slug: string
  title: string
  subtitle: string
  date: string
  categories: string[]
  image?: string
  content: string
  author: string
  /** Spotlight Books: present when the post is a review of a book. */
  month?: string
  book?: {
    title: string
    author: string
    authorAffiliation?: string
    publisher: string
    year: number
    pages?: number
  }
  /** Set when the post responds to a published review rather than the book alone. */
  reviewSource?: {
    title: string
    author: string
    publication: string
    issue?: string
    date?: string
    url?: string
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  let post: BlogPost
  try {
    post = await getPostBySlug(slug)
  } catch {
    return { title: 'Post not found | Financial Gurkha Blogs' }
  }

  const url = `https://financialgurkha.com/blog/${slug}`
  const published = new Date(post.date)
  const publishedTime = isNaN(published.getTime()) ? undefined : published.toISOString()

  // Meta descriptions get truncated around 160 characters in search results.
  // Subtitles here run long by design (they double as article standfirsts), so
  // trim on a word boundary rather than letting Google cut mid-word.
  const description =
    post.subtitle.length > 158
      ? `${post.subtitle.slice(0, 155).replace(/\s+\S*$/, '')}…`
      : post.subtitle

  // Social cards (Reddit, X, LinkedIn, iMessage) use the article's cover image.
  // Articles without one fall back to the logo. The fallback has to be explicit:
  // Next replaces the layout's openGraph object wholesale rather than merging it,
  // so leaving `images` undefined here would share with no image at all.
  const shareImage = post.image || '/logo.png'
  const shareImageAlt = post.image ? post.title : 'Financial Gurkha'

  return {
    title: post.title,
    description,
    keywords: post.categories?.join(', '),
    authors: [{ name: post.author || 'Kanchan Sharma' }],
    // Canonical prevents duplicate-content dilution if a post is reachable via
    // query strings, trailing slashes, or syndicated copies.
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      images: [{ url: shareImage, alt: shareImageAlt }],
      type: 'article',
      url,
      siteName: 'Financial Gurkha',
      publishedTime,
      authors: [post.author || 'Kanchan Sharma'],
      tags: post.categories,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [{ url: shareImage, alt: shareImageAlt }],
    },
    other: {
      // Consumed by Google News and several aggregators.
      'article:published_time': publishedTime ?? '',
      'article:author': post.author || 'Kanchan Sharma',
    },
  }
}
