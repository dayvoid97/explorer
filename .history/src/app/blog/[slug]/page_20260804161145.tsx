import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '../../lib/markdown'
import NextOrder, { NextOrderPost } from '@/app/components/article/NextOrder'

import { BlogPost } from './metadata'
import { ShareButtons } from './share-buttons'
import { AdSenseSidebarAd } from '@/app/components/AdsenseSidebarAd'
import { AdSenseInArticle } from '@/app/components/adsense-in-article'

import remarkGfm from 'remark-gfm'

// Pull the plain text out of arbitrary React children so headings can be
// slugified. MDX gives us nested elements (bold, links, code) inside headings.
function nodeToText(node: any): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeToText).join('')
  if (node?.props?.children) return nodeToText(node.props.children)
  return ''
}

// GitHub-flavoured slug rules: lowercase, drop punctuation, spaces -> hyphens.
// Consecutive hyphens are deliberately NOT collapsed — GitHub keeps them, so
// "Power & Energy" becomes "power--energy". Editors that auto-generate a table
// of contents (VS Code's Markdown All in One, remark-toc, etc.) follow the same
// rule, so matching it exactly means generated TOCs link correctly with no
// hand-written anchor tags.
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s/g, '-')
}

const headingStyle = {
  fontFamily: "'Freight Big Pro', serif",
  fontWeight: 800,
  letterSpacing: '-0.05rem',
} as const

// scroll-mt keeps anchored headings clear of the sticky navbar when jumped to.
const components = {
  h1: ({ children, ...props }: any) => (
    <h1
      id={slugify(nodeToText(children))}
      className="text-4xl font-bold mt-8 mb-4 scroll-mt-24"
      style={headingStyle}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2
      id={slugify(nodeToText(children))}
      className="text-3xl font-bold mt-8 mb-4 scroll-mt-24"
      style={headingStyle}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3
      id={slugify(nodeToText(children))}
      className="text-2xl font-bold mt-6 mb-3 scroll-mt-24"
      style={headingStyle}
      {...props}
    >
      {children}
    </h3>
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
  // Links: anchor jumps (#section) and internal routes (/blog/...) stay in this
  // tab — opening them in a new tab breaks in-page navigation and leaks readers
  // out of the session. Only genuinely external links open in a new tab.
  a: ({ href = '', ...props }: any) => {
    const isAnchor = href.startsWith('#')
    const isInternal =
      href.startsWith('/') || href.startsWith('./') || href.includes('financialgurkha.com')
    const isExternal = !isAnchor && !isInternal

    return (
      <a
        href={href}
        className="text-[#000] font-semibold underline decoration-1 underline-offset-4 hover:text-green-600 transition"
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...props}
      />
    )
  },
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

// Posts are plain markdown, but MDXRemote parses them as MDX where `{...}`
// is a JS expression — unescaped braces crash the page at render time
// (e.g. "\text{ billion}" -> ReferenceError: billion is not defined).
// Escape braces everywhere except inside code fences / inline code.
function sanitizeMarkdownForMdx(content: string) {
  const parts = content.split(/(```[\s\S]*?```|`[^`\n]*`)/g)
  return parts
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/\{/g, '\\{').replace(/\}/g, '\\}')))
    .join('')
}

// --- In-article ad placement -------------------------------------------------
//
// Goals: at most 3 units, spaced evenly through the body, never crowding the
// opening summary, and always emitted as standalone blocks.
//
// That last point is not cosmetic. The ad renders a <div>; appending it to the
// end of a paragraph makes MDX treat it as inline content, producing invalid
// <p>...<div/></p> markup that React reports as a hydration error. Emitting it
// as its own block (blank line either side) makes MDX parse it as flow content.

const MAX_ADS = 3
// Skip the opening stretch — readers should hit the summary and first section
// before any ad interrupts them, which also protects the "60-second read" path.
const LEAD_IN_WORDS = 400
// Tail guard so an ad never lands just above the FAQ / closing sections.
const TAIL_WORDS = 250

// Blocks an ad must never be placed against: headings (an ad between a heading
// and its first paragraph orphans the heading), tables, code fences, quotes,
// rules and list items — breaking those mid-structure corrupts rendering.
function isUnsafeBoundary(block: string) {
  const b = block.trim()
  return (
    b === '' ||
    b.startsWith('#') ||
    b.startsWith('|') ||
    b.startsWith('```') ||
    b.startsWith('>') ||
    b.startsWith('---') ||
    /^[-*]\s/.test(b) ||
    /^\d+\.\s/.test(b)
  )
}

function injectAdsIntoContent(content: string) {
  const blocks = content.split('\n\n')
  const wordsPerBlock = blocks.map((b) => b.trim().split(/\s+/).filter(Boolean).length)
  const totalWords = wordsPerBlock.reduce((a, b) => a + b, 0)

  const usableWords = totalWords - LEAD_IN_WORDS - TAIL_WORDS
  if (usableWords <= 0) return content

  // Scale ad count to article length so short posts don't feel spammy:
  // roughly one unit per 700 words of usable body, capped at MAX_ADS.
  const adCount = Math.min(MAX_ADS, Math.max(1, Math.floor(usableWords / 700)))

  // Evenly spaced word targets across the usable range. For 3 ads that lands
  // near the 25%, 50% and 75% marks of the body.
  const targets = Array.from(
    { length: adCount },
    (_, i) => LEAD_IN_WORDS + (usableWords * (i + 1)) / (adCount + 1)
  )

  // Collect every legal insertion point with its position in the article, then
  // snap each target to the *nearest* one. Scanning forward only would push ads
  // toward the end of posts where safe gaps are sparse (long table or list runs),
  // which is how you end up with an ad stranded at 86% of the article.
  const collectCandidates = (lead: number, tail: number) => {
    const found: { index: number; words: number }[] = []
    let cumulative = 0
    for (let i = 0; i < blocks.length - 1; i++) {
      cumulative += wordsPerBlock[i]
      if (cumulative < lead || cumulative > totalWords - tail) continue
      if (isUnsafeBoundary(blocks[i]) || isUnsafeBoundary(blocks[i + 1])) continue
      found.push({ index: i, words: cumulative })
    }
    return found
  }

  // Posts built mostly from tables and lists can have no legal boundary inside
  // the preferred window. Relax the lead-in/tail guards rather than silently
  // shipping an article with no in-content unit at all.
  let candidates = collectCandidates(LEAD_IN_WORDS, TAIL_WORDS)
  if (candidates.length === 0) {
    candidates = collectCandidates(LEAD_IN_WORDS / 2, TAIL_WORDS / 2)
  }
  if (candidates.length === 0) {
    candidates = collectCandidates(150, 100)
  }
  if (candidates.length === 0) return content

  // Keep units from bunching up when several targets snap to the same region.
  const MIN_GAP_WORDS = Math.max(300, usableWords / (adCount + 2))
  const placed: { index: number; words: number }[] = []

  for (const target of targets) {
    const pick = candidates
      .filter(
        (c) =>
          !placed.some((p) => p.index === c.index) &&
          placed.every((p) => Math.abs(p.words - c.words) >= MIN_GAP_WORDS)
      )
      .sort((a, b) => Math.abs(a.words - target) - Math.abs(b.words - target))[0]

    if (pick) placed.push(pick)
  }

  const insertAfter = new Set(placed.map((p) => p.index))

  const out: string[] = []
  blocks.forEach((block, i) => {
    out.push(block)
    if (insertAfter.has(i)) out.push('<AdSenseInArticle />')
  })

  return out.join('\n\n')
}

// Pull Q&A pairs out of the "Frequently Asked Questions" section so we can emit
// FAQPage structured data. Answer engines (Google AI Overviews, Perplexity,
// ChatGPT browsing) lean heavily on this schema when deciding what to quote,
// so it is the highest-leverage markup on an article page.
// Expected markdown shape:  **Question?**\nAnswer text.
function extractFaqs(content: string): { question: string; answer: string }[] {
  const section = content.split(/^##\s+Frequently Asked Questions\s*$/m)[1]
  if (!section) return []

  // Stop at the next H2 so we don't swallow the closing sections.
  const body = section.split(/^##\s+/m)[0]
  const faqs: { question: string; answer: string }[] = []
  const re = /^\*\*(.+?\?)\*\*\s*\n([\s\S]*?)(?=\n\*\*|\n---|\s*$)/gm

  let match: RegExpExecArray | null
  while ((match = re.exec(body)) !== null) {
    const question = match[1].trim()
    const answer = match[2]
      .replace(/\*\*/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
    if (question && answer) faqs.push({ question, answer })
  }
  return faqs
}

function toIsoDate(date: string): string {
  const parsed = new Date(date)
  return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString()
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let post: BlogPost
  try {
    post = await getPostBySlug(slug)
  } catch {
    notFound()
  }

  // Inject ads into content based on length
  const contentWithAds = injectAdsIntoContent(sanitizeMarkdownForMdx(post.content))

  // Universe of articles for the "Your Next Position" order ticket
  const allPosts = await getAllPosts()
  const nextOrderPosts: NextOrderPost[] = allPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    date: p.date,
    image: p.image,
    categories: p.categories ?? [],
  }))

  // ---- Structured data (SEO / AEO / GEO) ----
  const url = `https://financialgurkha.com/blog/${slug}`
  const faqs = extractFaqs(post.content)
  const wordCount = post.content.split(/\s+/).length

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.subtitle,
    image: post.image ? [post.image] : undefined,
    datePublished: toIsoDate(post.date),
    dateModified: toIsoDate(post.date),
    wordCount,
    keywords: post.categories?.join(', '),
    articleSection: post.categories?.[0],
    inLanguage: 'en-US',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: {
      '@type': 'Person',
      name: post.author || 'Kanchan Sharma',
      url: 'https://financialgurkha.com/about/kanchan',
      jobTitle: 'Independent Markets Analyst',
      knowsAbout: ['Equity Valuation', 'Discounted Cash Flow Analysis', 'Macroeconomics'],
    },
    publisher: {
      '@type': 'Organization',
      name: 'Financial Gurkha',
      url: 'https://financialgurkha.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://financialgurkha.com/logo.png',
      },
      location: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'New York',
          addressRegion: 'NY',
          addressCountry: 'US',
        },
      },
    },
  }

  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://financialgurkha.com' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://financialgurkha.com/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  return (
    // <<< MODIFIED: Use a flexible container for responsive two-column layout >>>
    <div className="mx-auto max-w-7xl p-4 sm:p-8">
      {/* Structured data — read by Google, and by AI answer engines deciding
          which source to cite. FAQPage is the one that earns direct quotes. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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

          <article className="prose prose-lg  mt-8 max-w-3xl">
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

          {/* Your Next Position — interactive read-next order ticket */}
          <div className="max-w-3xl">
            <NextOrder posts={nextOrderPosts} currentSlug={slug} />
          </div>
        </main>

        {/* Sidebar Ad Area (takes 1/4 space on large screens) */}
        <aside className="hidden lg:block lg:col-span-1 mt-8 lg:mt-[100px]">
          <AdSenseSidebarAd />
        </aside>
      </div>
    </div>
  )
}
