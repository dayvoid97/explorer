import Link from 'next/link'
import { getAllPosts } from '../lib/markdown'
import { BlogPost } from './[slug]/metadata'

export default async function BlogListPage() {
  const posts: Omit<BlogPost, 'contentHtml'>[] = await getAllPosts()

  return (
    <main className="max-w-5xl mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold mb-6">The Gurkha Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {post.image && (
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-2">{post.subtitle}</p>
              <div className="flex flex-wrap gap-2">
                {post.categories?.map((cat) => (
                  <span
                    key={cat}
                    className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
