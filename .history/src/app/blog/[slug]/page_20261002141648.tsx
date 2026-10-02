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
  toIsoDate,
} from '@/app/components/article/mdx'
import PaperCard from '@/app/components/article/PaperCard'
import { getAuthor } from '@/app/lib/authors'

import { BlogPost } from './metadata'
// metadata.ts is not a Next.js special file, so its generateMetadata only runs
// if the page re-exports it. Without this, every article inherits the root
// layout's title, description and logo share image.
export { generateMetadata } from './metadata'
import { ShareButtons } from './share-buttons'
import { AdSenseSidebarAd } from '@/app/components/AdsenseSidebarAd'
import { AdSenseInArticle } from '@/app/components/adsense-in-article'

import remarkGfm from 'remark-gfm'


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

// Ad density scales with length: roughly one unit per 1,100 words of body,
// capped at 5. On an 8,000-word piece that is a unit every ~1,600 words, which
// leaves several screens of uninterrupted reading between them.
const WORDS_PER_AD = 1100
const MAX_ADS = 5
// Never place a section unit before this many words — keeps the opening, the
// 60-second summary and the table of contents (the fast path) to one unit.
const LEAD_IN_WORDS = 350
// Keep the closing stretch (FAQ, takeaways, read-next widget) clear.
const TAIL_WORDS = 300

function isHeading2(block: string) {
  return /^##\s/.test(block.trim())
}

// The 60-second summary is the first thing most readers scroll to, so the
// opening unit goes directly above it. Section-based units never land on the
// same heading, so the two never stack.
const SIXTY_SECOND_RE = /^##\s+The 60[- ]Second Version/i

function injectSectionAds(content: string) {
  const blocks = content.split('\n\n')
  const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

  // Every H2 boundary is a candidate slot, recorded with its position in the
  // article. Section boundaries are the only place an ad belongs — they are the
  // natural pause, and they guarantee a deep-linked reader meets one quickly.
  const candidates: { index: number; wordsBefore: number }[] = []
  let cumulative = 0
  blocks.forEach((b, i) => {
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

  // Evenly spaced word targets, each snapped to the NEAREST eligible section
  // boundary. Walking forward and taking every Nth heading clusters units in
  // whichever part of the article happens to have short sections — that is how
  // a long piece ends up with nothing across its final third.
  const targets = Array.from(
    { length: adCount },
    (_, i) => LEAD_IN_WORDS + (usable * (i + 1)) / (adCount + 1)
  )

  const minGap = Math.max(600, usable / (adCount + 1) / 2)
  const placed: { index: number; wordsBefore: number }[] = []

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
  // Only show the "back to contents" arrow on articles that actually have one.
  const hasToc = /^###\s+What's in this report/m.test(post.content)

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
        publisher: { '@type': 'Organization', name: 'Financial Gurkha', url: 'https://financialgurkha.com' },
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

          <article className="prose prose-lg  mt-8 max-w-3xl">
            <MDXRemote
              source={contentWithAds}
              components={{
                ...makeComponents(hasToc),
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
