import Link from 'next/link'
import { getAllPosts } from '../lib/markdown'
import { BlogPost } from './[slug]/metadata'

export default async function BlogListPage() {
  const posts: Omit<BlogPost, 'content'>[] = await getAllPosts()

  return (
    <main className="px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <h2
                className="text-2xl font-extrabold mb-2"
                style={{
                  fontFamily: "'Freight Big Pro', serif",
                  letterSpacing: '-0.05rem',
                }}
              >
                {post.title}
              </h2>

              <div className="flex flex-wrap gap-2 mb-2 text-sm text-gray-700">
                <span
                  className="bg-gray-100 px-2 py-1 rounded-full"
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    letterSpacing: '-0.05rem',
                  }}
                >
                  {post.author}
                </span>
                <span
                  className="bg-gray-100 px-2 py-1 rounded-full"
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    letterSpacing: '-0.05rem',
                  }}
                >
                  {post.date}
                </span>
              </div>

              <p className="mb-2" style={{ fontFamily: 'Helvetica' }}>
                {post.subtitle}
              </p>

              {post.categories?.length > 0 && (
                <div
                  className="flex flex-wrap gap-2"
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    letterSpacing: '-0.05rem',
                  }}
                >
                  {post.categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
