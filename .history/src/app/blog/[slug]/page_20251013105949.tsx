import { notFound } from 'next/navigation'
import { blogPosts } from '../data'

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug)
  if (!post) return notFound()

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <h2 className="text-lg text-gray-600 mb-4">{post.subtitle}</h2>

      <div className="mb-4 space-x-2">
        {post.categories.map((cat) => (
          <span key={cat} className="text-sm bg-gray-200 px-2 py-1 rounded-full text-gray-700">
            {cat}
          </span>
        ))}
      </div>

      <article className="prose prose-lg text-gray-800 whitespace-pre-line">{post.content}</article>
    </main>
  )
}
