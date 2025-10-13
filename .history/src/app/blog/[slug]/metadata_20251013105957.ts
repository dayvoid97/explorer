import { blogPosts } from '../data'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug)
  if (!post) {
    return {
      title: 'Article Not Found | Gurkha Blog',
    }
  }

  return {
    title: `${post.title} | Gurkha Blog`,
    description: post.subtitle,
    keywords: post.categories.join(', '),
    openGraph: {
      title: post.title,
      description: post.subtitle,
      type: 'article',
      url: `https://yourdomain.com/blog/${post.slug}`,
    },
  }
}
