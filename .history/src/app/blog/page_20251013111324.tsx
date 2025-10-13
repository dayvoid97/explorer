import Link from 'next/link'
import { getAllPosts } from '@/lib/markdown'

export default async function BlogListPage() {
  const posts = await getAllPosts()

  return (
    <main className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-4xl font-bold">The Gurkha Blog</h1>
      {posts.map((post: any) => (
        <article key={post.slug} className="border-b pb-4">
          <Link href={`/blog/${post.slug}`}>
            <h2 className="text-2xl font-semibold hover:text-blue-600 transition">{post.title}</h2>
          </Link>
          <p className="text-gray-600">{post.subtitle}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {post.categories?.map((cat: string) => (
              <span key={cat} className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                {cat}
              </span>
            ))}
          </div>
        </article>
      ))}
    </main>
  )
}
