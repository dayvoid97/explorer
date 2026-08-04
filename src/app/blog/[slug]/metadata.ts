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
      images: post.image ? [{ url: post.image, alt: post.title }] : undefined,
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
      images: post.image ? [post.image] : undefined,
    },
    other: {
      // Consumed by Google News and several aggregators.
      'article:published_time': publishedTime ?? '',
      'article:author': post.author || 'Kanchan Sharma',
    },
  }
}
