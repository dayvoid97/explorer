import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '../lib/markdown'
import { resolveCoverImage as cover } from '../lib/cover-image'
import { BlogPost } from './[slug]/metadata'

export const metadata = {
  title: 'Markets Research & Equity Valuations',
  description:
    'Every Financial Gurkha analysis: valuations, earnings breakdowns, Federal Reserve coverage, commodities and crypto research. Written from New York City.',
  alternates: { canonical: 'https://financialgurkha.com/blog' },
  openGraph: {
    title: 'Markets Research & Equity Valuations | Financial Gurkha',
    description:
      'Intrinsic valuations, earnings breakdowns from primary SEC filings, and macro analysis. New York City.',
    url: 'https://financialgurkha.com/blog',
    type: 'website',
  },
}

export default async function BlogListPage() {
  const posts: Omit<BlogPost, 'content'>[] = await getAllPosts()

  // Sort posts descending by date (most recent first)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <main className="mx-auto max-w-3xl px-4">
      <div className="flex gap-3 mb-6">
        <div className="h-px flex-grow bg-white/10" />
        <h2 className="text-[20px] font-black uppercase tracking-[0.3em] bg-green-400">
          FINANCIAL GURKHA BLOGS
        </h2>
        <div className="h-px flex-grow bg-white/10" />
      </div>
      <div className="space-y-8">
        {sortedPosts.map((post, i) => (
          <Link
            key={post.slug || post.date}
            href={`/blog/${post.slug}`}
            className="block hover:opacity-90 transition"
          >
            {cover(post.image) && (
              <div className="relative h-80 w-full">
                <Image
                  src={cover(post.image)!.src}
                  alt={post.title}
                  fill
                  sizes="(min-width: 768px) 768px, 100vw"
                  quality={75}
                  priority={i === 0}
                  unoptimized={!cover(post.image)!.optimize}
                  className="object-cover"
                />
              </div>
            )}
            <div className="py-4">
              <h2
                className="text-2xl font-semibold mb-2"
                style={{
                  fontFamily: "'Freight Big Pro', serif",
                  fontWeight: 800,
                  letterSpacing: '-0.05rem',
                }}
              >
                {post.title}
              </h2>
              <div className="mb-3 flex flex-wrap gap-2">
                <span
                  className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontWeight: 400,
                    fontStyle: 'normal',
                    letterSpacing: '-0.05rem',
                  }}
                >
                  {post.author}
                </span>
                <span
                  className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-700"
                  style={{
                    fontFamily: "'Roboto Mono', monospace",
                    fontWeight: 400,
                    fontStyle: 'normal',
                    letterSpacing: '-0.05rem',
                  }}
                >
                  {post.date}
                </span>
              </div>

              <p
                className="mb-3"
                style={{
                  fontFamily: 'Helvetica',
                  fontWeight: 400,
                  fontStyle: 'normal',
                }}
              >
                {post.subtitle}
              </p>
              <div
                className="flex flex-wrap gap-2"
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontWeight: 400,
                  fontStyle: 'normal',
                  letterSpacing: '-0.05rem',
                }}
              >
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
