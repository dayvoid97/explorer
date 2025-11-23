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
  const post = await getPostBySlug(slug)

  return {
    title: `${post.title} | Financial Gurkha Blogs`,
    description: post.subtitle,
    keywords: post.categories?.join(', '),
    openGraph: {
      title: post.title,
      description: post.subtitle,
      images: post.image ? [{ url: post.image }] : undefined,
      type: 'article',
      url: `https://financialgurkha.com/blog/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.subtitle,
      images: post.image ? [post.image] : undefined,
    },
  }
}
