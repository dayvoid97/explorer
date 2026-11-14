import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '../../lib/markdown'
import NextOrder, { NextOrderPost } from '@/app/components/article/NextOrder'
import InfoNote from '@/app/components/article/InfoNote'
import ArticleAnalytics from '@/app/components/article/ArticleAnalytics'
import {
  extractFaqs,
  makeComponents,
  sanitizeMarkdownForMdx,
  slugify,
  toIsoDate,
} from '@/app/components/article/mdx'
import PaperCard from '@/app/components/article/PaperCard'
import { getAuthor } from '@/app/lib/authors'

import { BlogPost } from './metadata'
// metadata.ts is not a Next.js special file, so its generateMetadata only runs
// if the page re-exports it. Without this, every article inherits the root
// layout's title, description and logo share image.
export { generateMetadata } from './metadata'

// Build every article at deploy time. Without this the route is dynamic, and
// each visit re-reads the file and recompiles the MDX on the server.
// A slug added later still renders on first request and is cached after.
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.filter((p) => p.slug).map((p) => ({ slug: p.slug }))
}
import { ShareButtons } from './share-buttons'
import { AdSenseSidebarAd } from '@/app/components/AdsenseSidebarAd'
import { AdSenseInArticle } from '@/app/components/adsense-in-article'

import remarkGfm from 'remark-gfm'

// --- Table of contents -------------------------------------------------------
//
// Every article gets a table of contents. Articles with a hand-written one
// ("What's in this report" / "Table of Contents") keep it; everything else
// gets an auto-generated TOC built from the H2 headings, using the same
// slugify() the MDX renderer uses for heading anchors — so every link lands
// exactly. The nav carries id="whats-in-this-report", which is also what the
// "↑ Contents" arrows on each section link back to.

function stripMarkdownHeading(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/`([^`]+)`/g, '$1')
    .trim()
}

// Boilerplate sections that don't belong in a contents list.
const TOC_EXCLUDE = /^(about this analysis|table of contents)$/i

function extractToc(content: string): { text: string; id: string }[] {
  // Ignore fenced code blocks — a "##" inside one is not a heading.
  const prose = content.replace(/```[\s\S]*?```/g, '')
  const entries: { text: string; id: string }[] = []
  for (const m of prose.matchAll(/^##\s+(.+)$/gm)) {
    const text = stripMarkdownHeading(m[1])
    if (!text || TOC_EXCLUDE.test(text)) continue
    entries.push({ text, id: slugify(text) })
  }
  return entries
}

const MANUAL_TOC_RE = /^#{2,3}\s+(what's in this report|table of contents)/im

// --- In-article ad placement -------------------------------------------------
//
// One fixed unit sits directly above "The 60-Second Version" (see
// injectAdsIntoContent below). The rest are placed section by section.
//
// Section placement is SECTION-based rather than word-count based, because that is how
// readers actually arrive. Deep links from Google's "jump to" results, ChatGPT
// citations and our own table of contents drop people into the middle of a
// 6,000-word article. A reader who lands at section nine and reads one section
// should still see an ad; word-count placement measured from the top cannot
// guarantee that.
//
// Anchoring to H2 boundaries means every entry point has a unit within a
// section or two, and units always land in the natural pause between sections
// rather than interrupting an argument.
//
// The ad renders a <div>, so it must be emitted as a standalone block. Appending
// it to a paragraph makes MDX treat it as inline content, producing invalid
// <p>...<div/></p> markup and a hydration error.

// Ad density scales with length: roughly one unit per 300 words of body,
// capped at 5. On an 8,000-word piece that is a unit every ~1,600 words, which
// leaves several screens of uninterrupted reading between them.
const WORDS_PER_AD = 300
const MAX_ADS = 3
// Never place a section unit before this many words — keeps the opening, the
// 60-second summary and the table of contents (the fast path) to one unit.
// Approximately 150 words before the first ad is rendered. Likely first ad after the second paragraph
const LEAD_IN_WORDS = 150
// Keep the closing stretch (FAQ, takeaways, read-next widget) clear.
const TAIL_WORDS = 500
// The FIRST mobile unit must land within this many words of the start of the body
// (desktop is unaffected: this unit is `lg:hidden`, desktop uses the sidebar).
// Articles with a "60-Second Version" already satisfy this through the fixed
// opening unit; every other article gets its first section unit pulled forward to
// the boundary nearest FIRST_AD_TARGET_WORDS, never past FIRST_AD_MAX_WORDS.
const FIRST_AD_TARGET_WORDS = 350
const FIRST_AD_MAX_WORDS = 500

function isHeading2(block: string) {
  return /^##\s/.test(block.trim())
}

// The 60-second summary is the first thing most readers scroll to, so the
// opening unit goes directly above it. Section-based units never land on the
// same heading, so the two never stack.
const SIXTY_SECOND_RE = /^##\s+The 60[- ]Second Version/i

// A block that is plain running prose: not a table, list, quote, image, code
// fence, rule, heading or component, and not an indented list continuation.
const NOT_PROSE_RE = /^(\||>|[-*+]\s|\d+\.\s|<|!\[|```|#|---)/
function isProse(block: string) {
  const b = block.replace(/^\n+/, '')
  return b.trim().length > 0 && !/^\s/.test(b) && !NOT_PROSE_RE.test(b)
}

// Whether an ad may be inserted BEFORE block i without splitting anything: not
// inside a fenced code block, not directly under a heading (that would separate
// the heading from its first paragraph), and the block that follows must open a
// new paragraph or sub-section — never the middle of a list or a table.
function isSafeBreak(blocks: string[], i: number, insideFence: boolean[]) {
  if (i <= 0 || insideFence[i]) return false
  if (/^#{1,6}\s/.test(blocks[i - 1].trim())) return false
  return isProse(blocks[i]) || /^###\s/.test(blocks[i].trim())
}

function injectSectionAds(content: string) {
  const blocks = content.split('\n\n')
  const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

  // Every H2 boundary is a candidate slot, recorded with its position in the
  // article. Section boundaries are the only place an ad belongs — they are the
  // natural pause, and they guarantee a deep-linked reader meets one quickly.
  const candidates: { index: number; wordsBefore: number }[] = []
  const before: number[] = [] // words before each block, for paragraph fallbacks
  const insideFence: boolean[] = [] // is block i inside a ``` fence? (never split one)
  let cumulative = 0
  let fenced = false
  blocks.forEach((b, i) => {
    before[i] = cumulative
    insideFence[i] = fenced
    if ((b.match(/^```/gm) ?? []).length % 2 === 1) fenced = !fenced
    if (isHeading2(b)) candidates.push({ index: i, wordsBefore: cumulative })
    cumulative += words(b)
  })

  const totalWords = cumulative
  const usable = totalWords - LEAD_IN_WORDS - TAIL_WORDS
  if (usable <= 0 || candidates.length === 0) return content

  const eligible = candidates.filter(
    (c) =>
      c.wordsBefore >= LEAD_IN_WORDS &&
      c.wordsBefore <= totalWords - TAIL_WORDS &&
      !SIXTY_SECOND_RE.test(blocks[c.index].trim())
  )
  if (eligible.length === 0) return content

  const adCount = Math.min(MAX_ADS, Math.max(1, Math.round(usable / WORDS_PER_AD)))
  const minGap = Math.max(400, usable / (adCount + 1) / 2)
  const placed: { index: number; wordsBefore: number }[] = []

  // First mobile unit: articles with a 60-second summary already open with a
  // fixed unit; all others get theirs early. Prefer the section boundary nearest
  // the target (within the max); if no heading falls in that window, use the
  // safe paragraph break nearest the target instead.
  const hasSixty = blocks.some((b) => SIXTY_SECOND_RE.test(b.trim()))
  if (!hasSixty) {
    const limit = Math.min(FIRST_AD_MAX_WORDS, totalWords - TAIL_WORDS)
    const nearest = <T extends { wordsBefore: number }>(xs: T[]) =>
      [...xs].sort(
        (a, b) =>
          Math.abs(a.wordsBefore - FIRST_AD_TARGET_WORDS) -
          Math.abs(b.wordsBefore - FIRST_AD_TARGET_WORDS)
      )[0]
    let first = nearest(eligible.filter((c) => c.wordsBefore <= limit))
    if (!first) {
      const slots = blocks
        .map((_, i) => ({ index: i, wordsBefore: before[i] }))
        .filter(
          (c) =>
            c.wordsBefore >= LEAD_IN_WORDS &&
            c.wordsBefore <= limit &&
            isSafeBreak(blocks, c.index, insideFence)
        )
      first = nearest(slots)
    }
    if (first) placed.push(first)
  }

  // Remaining units: evenly spaced word targets, each snapped to the NEAREST
  // eligible section boundary. Walking forward and taking every Nth heading
  // clusters units in whichever part of the article happens to have short
  // sections — that is how a long piece ends up with nothing across its final
  // third. When the first unit was pinned early, the rest are spread over what
  // is left of the article.
  const start = placed.length ? placed[0].wordsBefore : LEAD_IN_WORDS
  const remaining = adCount - placed.length
  const span = totalWords - TAIL_WORDS - start
  const targets = Array.from(
    { length: Math.max(0, remaining) },
    (_, i) => start + (span * (i + 1)) / (remaining + 1)
  )

  for (const target of targets) {
    const pick = eligible
      .filter(
        (c) =>
          !placed.some((p) => p.index === c.index) &&
          placed.every((p) => Math.abs(p.wordsBefore - c.wordsBefore) >= minGap)
      )
      .sort((a, b) => Math.abs(a.wordsBefore - target) - Math.abs(b.wordsBefore - target))[0]
    if (pick) placed.push(pick)
  }

  if (placed.length === 0) return content

  placed.sort((a, b) => a.index - b.index)
  const insertBefore = new Map(placed.map((p, i) => [p.index, i + 1]))

  const out: string[] = []
  blocks.forEach((block, i) => {
    const n = insertBefore.get(i)
    if (n) out.push(`<AdSenseInArticle position="section_${n}" />`)
    out.push(block)
  })

  return out.join('\n\n')
}

function injectAdsIntoContent(content: string) {
  const blocks = injectSectionAds(content).split('\n\n')
  const sixty = blocks.findIndex((b) => SIXTY_SECOND_RE.test(b.trim()))
  if (sixty >= 0) blocks.splice(sixty, 0, '<AdSenseInArticle position="above_60_second" />')
  return blocks.join('\n\n')
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
  const author = getAuthor(post.author)
  const faqs = extractFaqs(post.content)
  const wordCount = post.content.split(/\s+/).length
  // Articles with a hand-written TOC keep it; the rest get an auto-generated
  // one from their H2s. Either way the "↑ Contents" arrows have somewhere to go.
  const hasManualToc = MANUAL_TOC_RE.test(post.content)
  const tocEntries = hasManualToc ? [] : extractToc(post.content)
  const hasToc = hasManualToc || tocEntries.length >= 2
  // The "↑ Contents" arrows must land on the real TOC: the auto-generated nav
  // or the "### What's in this report" H3 both slugify to
  // #whats-in-this-report; a hand-written "## Table of Contents" H2 lands on
  // #table-of-contents.
  const contentsHref =
    hasManualToc && /^##\s+table of contents/im.test(post.content)
      ? '#table-of-contents'
      : '#whats-in-this-report'

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
      name: author.name,
      url: author.url,
      jobTitle: author.jobTitle,
      knowsAbout: author.knowsAbout,
      sameAs: author.sameAs,
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

  // Spotlight Books posts are book reviews. Marking them up as a Review of a
  // Book lets search and answer engines treat the page as "what Financial
  // Gurkha says about this book", alongside the NewsArticle markup above.
  const reviewSchema = post.book
    ? {
        '@context': 'https://schema.org',
        '@type': 'Review',
        name: post.title,
        url,
        datePublished: toIsoDate(post.date),
        author: { '@type': 'Person', name: author.name, url: author.url },
        publisher: {
          '@type': 'Organization',
          name: 'Financial Gurkha',
          url: 'https://financialgurkha.com',
        },
        itemReviewed: {
          '@type': 'Book',
          name: post.book.title,
          author: {
            '@type': 'Person',
            name: post.book.author,
            ...(post.book.authorAffiliation
              ? { affiliation: { '@type': 'Organization', name: post.book.authorAffiliation } }
              : {}),
          },
          publisher: { '@type': 'Organization', name: post.book.publisher },
          datePublished: String(post.book.year),
          ...(post.book.pages ? { numberOfPages: post.book.pages } : {}),
        },
        ...(post.reviewSource
          ? {
              citation: {
                '@type': 'Review',
                name: post.reviewSource.title,
                author: { '@type': 'Person', name: post.reviewSource.author },
                publisher: { '@type': 'Organization', name: post.reviewSource.publication },
                ...(post.reviewSource.url ? { url: post.reviewSource.url } : {}),
              },
            }
          : {}),
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
      {reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ArticleAnalytics slug={slug} wordCount={wordCount} />

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

          {/* Visible byline. The Person schema above is invisible to readers,
              and a finance article with no attributable human on the page is
              exactly what an E-E-A-T review flags. The link is the same URL the
              structured data points at, so machine and reader agree. */}
          <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-gray-600">
            <span>
              By{' '}
              <Link
                href={new URL(author.url).pathname}
                className="font-semibold text-black underline decoration-1 underline-offset-4 hover:text-green-600 transition"
              >
                {author.name}
              </Link>
            </span>
            <span className="text-gray-400">·</span>
            <span>{author.role}</span>
            <span className="text-gray-400">·</span>
            <time dateTime={toIsoDate(post.date)}>{post.date}</time>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {post.categories.map((cat) => (
              <span key={cat} className="text-sm bg-gray-200 px-2 py-1 rounded-full text-gray-700">
                {cat}
              </span>
            ))}
          </div>
          <ShareButtons title={post.title} subtitle={post.subtitle} />

          {tocEntries.length >= 2 && (
            <nav
              aria-label="Table of contents"
              id="whats-in-this-report"
              className="max-w-3xl mb-8 mt-8 scroll-mt-24 rounded-lg border border-gray-200 bg-stone-50 p-5 sm:p-6"
            >
              <p
                className="mb-4 text-sm font-bold uppercase"
                style={{ letterSpacing: '0.18em', color: '#C9A24B' }}
              >
                What&apos;s in this report
              </p>
              <ol className="space-y-2.5">
                {tocEntries.map((e) => (
                  <li key={e.id}>
                    <a
                      href={`#${e.id}`}
                      className="text-[17px] font-semibold text-black underline decoration-1 underline-offset-4 hover:text-green-700 transition"
                      style={{ fontFamily: "'Freight Big Pro', Georgia, serif" }}
                    >
                      {e.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <article className="prose prose-lg  mt-8 max-w-3xl">
            <MDXRemote
              source={contentWithAds}
              components={{
                ...makeComponents(hasToc, contentsHref),
                AdSenseInArticle,
                Info: InfoNote,
                Paper: PaperCard,
              }}
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
