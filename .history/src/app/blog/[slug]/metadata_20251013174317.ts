import { getPostBySlug } from '@/app/lib/markdown'
import type { Metadata } from 'next'

export type BlogPost = {
  slug: string
  title: string
  subtitle: string
  categories: string[]
  image?: string
  content: string
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)

  return {
    title: `${post.title} | Financial Gurkha Blogs`,
    description: post.subtitle,
    keywords: post.categories?.join(', '),
    openGraph: {
      title: post.title,
      description: post.subtitle,
      images: post.image ? [{ url: post.image }] : undefined,
      type: 'article',
    },
  }
}
