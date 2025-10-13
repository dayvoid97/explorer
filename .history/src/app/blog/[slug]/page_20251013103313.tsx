import { notFound } from 'next/navigation'

const posts = {
  'getting-started': {
    title: 'Getting Started with Gurkha Finance',
    content: 'Welcome to our first blog post about how to begin...',
  },
  'market-sentiment': {
    title: 'Understanding Market Sentiment',
    content: 'In this post, we explore how traders gauge market mood...',
  },
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug]
  if (!post) return notFound()

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700 leading-relaxed">{post.content}</p>
    </main>
  )
}
