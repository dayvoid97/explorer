import Link from 'next/link'
import { getAllPosts } from '../lib/markdown'
import { BlogPost } from './[slug]/metadata'

export default async function BlogListPage() {
  const posts: Omit<BlogPost, 'content'>[] = await getAllPosts()

  return (
    <main>
      <div>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {post.image && <img src={post.image} alt={post.title} />}
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
