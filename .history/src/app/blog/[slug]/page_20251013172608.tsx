import { getPostBySlug } from '../../lib/markdown'
import { BlogPost } from './metadata'

export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post: BlogPost = await getPostBySlug(params.slug)

  return (
    <main className="max-w-3xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <h2 className="text-lg text-gray-600 mb-4">{post.subtitle}</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        {post.categories.map((cat) => (
          <span key={cat} className="text-sm bg-gray-200 px-2 py-1 rounded-full text-gray-700">
            {cat}
          </span>
        ))}
      </div>

      {post.image && <img src={post.image} alt={post.title} className="mb-6 rounded-xl" />}

      <article
        className="prose prose-lg text-red-800 max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </main>
  )
}
