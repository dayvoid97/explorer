import { getPostBySlug } from '@/app/lib/markdown'
import Image from 'next/image'

export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <h2 className="text-lg text-gray-600 mb-4">{post.subtitle}</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        {post.categories?.map((cat: string) => (
          <span key={cat} className="text-sm bg-gray-200 px-2 py-1 rounded-full text-gray-700">
            {cat}
          </span>
        ))}
      </div>

      {post.image && (
        <div className="mb-6">
          <Image
            src={post.image}
            alt={post.title}
            width={800}
            height={400}
            className="rounded-xl"
          />
        </div>
      )}

      <article
        className="prose prose-lg text-gray-800"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </main>
  )
}
