import Link from 'next/link'

const posts = [
  { title: 'Getting Started with Gurkha Finance', slug: 'getting-started' },
  { title: 'Understanding Market Sentiment', slug: 'market-sentiment' },
]

export default function BlogPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Our Blog</h1>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
