import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug } from '../../lib/markdown'
import { BlogPost } from './metadata'
import { ShareButtons } from './share-buttons'
import { AdSenseAd } from '@/app/components/adsense-ad'

const components = {
  h1: (props: any) => (
    <h1
      className="text-4xl font-bold mt-8 mb-4"
      style={{
        fontFamily: "'Freight Big Pro', serif",
        fontWeight: 800,
        letterSpacing: '-0.05rem',
      }}
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      className="text-3xl font-bold mt-8 mb-4"
      style={{
        fontFamily: "'Freight Big Pro', serif",
        fontWeight: 800,
        letterSpacing: '-0.05rem',
      }}
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      className="text-2xl font-bold mt-6 mb-3"
      style={{
        fontFamily: "'Freight Big Pro', serif",
        fontWeight: 800,
        letterSpacing: '-0.05rem',
      }}
      {...props}
    />
  ),
  p: (props: any) => (
    <p
      style={{
        fontFamily: 'Helvetica',
        fontWeight: 400,
        fontStyle: 'normal',
      }}
      {...props}
    />
  ),
  a: (props: any) => <a className="text-blue-600 hover:underline" {...props} />,
  ul: (props: any) => <ul className="list-disc  mb-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal  mb-4 space-y-2" {...props} />,
  li: (props: any) => <li className="ml-2" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-800 pl-4 italic  my-4" {...props} />
  ),
  img: (props: any) => <img className="rounded-lg my-6 w-full" {...props} />,
  code: (props: any) => (
    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />
  ),
}

// Helper function to inject ads at random intervals
function injectAdsIntoContent(content: string): string {
  const wordCount = content.split(/\s+/).length
  const paragraphs = content.split('\n\n')

  // Determine how many ads to insert based on content length
  let adCount = 0
  if (wordCount > 1000) adCount = 3
  else if (wordCount > 2000) adCount = 2
  else if (wordCount > 1000) adCount = 1

  if (adCount === 0) return content

  // Get random positions to insert ads (avoiding first 2 and last 2 paragraphs)
  const minIndex = 2
  const maxIndex = paragraphs.length - 2
  const positions = new Set<number>()

  while (positions.size < adCount && positions.size < maxIndex - minIndex) {
    positions.add(Math.floor(Math.random() * (maxIndex - minIndex)) + minIndex)
  }

  // Insert ads in reverse order to maintain indices
  const sortedPositions = Array.from(positions).sort((a, b) => b - a)

  sortedPositions.forEach((pos) => {
    paragraphs.splice(pos, 0, '<AdSenseAd />')
  })

  return paragraphs.join('\n\n')
}

export default async function BlogArticlePage({ params }: { params: { slug: string } }) {
  const post: BlogPost = await getPostBySlug(params.slug)

  // Inject ads into content based on length
  const contentWithAds = injectAdsIntoContent(post.content)

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link
        href="/blog"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition"
      >
        <span className="mr-2">←</span>
        Back to Blog
      </Link>

      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
      <h2 className="text-lg text-gray-600 mb-4">{post.subtitle}</h2>

      <div className="mb-6 flex flex-wrap gap-2">
        {post.categories.map((cat) => (
          <span key={cat} className="text-sm bg-gray-200 px-2 py-1 rounded-full text-gray-700">
            {cat}
          </span>
        ))}
      </div>
      <ShareButtons title={post.title} subtitle={post.subtitle} />
      {post.image && <img src={post.image} alt={post.title} className="mb-6 rounded-xl" />}

      <article className="prose prose-lg dark:prose-invert max-w-none mt-8">
        <MDXRemote source={contentWithAds} components={{ ...components, AdSenseAd }} />
      </article>
    </main>
  )
}
