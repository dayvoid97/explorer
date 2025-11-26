import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getPostBySlug } from '../../lib/markdown'
import { BlogPost } from './metadata'
import { ShareButtons } from './share-buttons'
import { AdSenseSidebarAd } from '@/app/components/AdsenseSidebarAd'
import { AdSenseInArticle } from '@/app/components/adsense-in-article'

import remarkGfm from 'remark-gfm'

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
      className="mb-3"
      style={{
        fontFamily: 'Times New Roman',
        fontSize: 20,
        fontStyle: 'normal',
      }}
      {...props}
    />
  ),
  a: (props: any) => (
    <a
      className="color-white bg-green-800 rounded font-bold hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
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
  table: (props: any) => (
    <table className="min-w-full border-collapse border border-gray-300 my-6" {...props} />
  ),
  thead: (props: any) => <thead {...props} />,
  tbody: (props: any) => <tbody {...props} />,
  tr: (props: any) => <tr className="border-b border-gray-300" {...props} />,
  th: (props: any) => (
    <th className="border border-gray-300 px-4 py-2 text-left font-bold" {...props} />
  ),
  td: (props: any) => <td className="border border-gray-300 px-4 py-2" {...props} />,
}

// Helper function to inject ads at random intervals
function injectAdsIntoContent(content: string) {
  const paragraphs = content.split('\n\n')
  const positions = new Set<number>()

  let cumulativeWords = 0
  let lastAdPosition = -1

  for (let i = 0; i < paragraphs.length; i++) {
    // Count words in current paragraph
    const wordsInParagraph = paragraphs[i].split(/\s+/).length
    cumulativeWords += wordsInParagraph

    // Check both conditions:
    // 1. At least 200 words since last ad (or start)
    // 2. At least 3 paragraphs since last ad (or start)
    const wordsSinceLastAd = cumulativeWords >= 200
    const paragraphsSinceLastAd = i - lastAdPosition >= 3

    if (wordsSinceLastAd && paragraphsSinceLastAd) {
      // Don't place ad in the last paragraph
      if (i < paragraphs.length - 1) {
        positions.add(i)
        cumulativeWords = 0 // Reset word counter
        lastAdPosition = i // Update last ad position
      }
    }
  }

  // Inject ads at the identified positions
  positions.forEach((idx) => {
    paragraphs[idx] = paragraphs[idx] + `\n\n<AdSenseInArticle />`
  })

  return paragraphs.join('\n\n')
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post: BlogPost = await getPostBySlug(slug)

  // Inject ads into content based on length
  const contentWithAds = injectAdsIntoContent(post.content)

  return (
    // <<< MODIFIED: Use a flexible container for responsive two-column layout >>>
    <div className="container mx-auto max-w-7xl p-4 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
        {/* Main Content Area (takes 3/4 space on large screens) */}
        <main className="lg:col-span-3">
          <Link
            href="/blog"
            className="inline-flex items-center bg-red-700 hover:text-gray-900 mb-8 transition"
          >
            <span className="mr-2">←</span>
            Back to Blog
          </Link>

          <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
          <h2 className="text-lg  mb-4">{post.subtitle}</h2>

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
            <MDXRemote
              source={contentWithAds}
              components={{ ...components, AdSenseInArticle }}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                },
              }}
            />
          </article>
        </main>

        {/* Sidebar Ad Area (takes 1/4 space on large screens) */}
        <aside className="hidden lg:block lg:col-span-1 mt-8 lg:mt-[100px]">
          <AdSenseSidebarAd />
        </aside>
      </div>
    </div>
  )
}
