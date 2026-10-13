import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getNewsBySlug } from '@/app/lib/news'
import {
  makeComponents,
  sanitizeMarkdownForMdx,
  toIsoDate,
} from '@/app/components/article/mdx'
import { ShareButtons } from '@/app/blog/[slug]/share-buttons'
import { AdSenseSidebarAd } from '@/app/components/AdsenseSidebarAd'
import { AdSenseInArticle } from '@/app/components/adsense-in-article'

import remarkGfm from 'remark-gfm'

export { generateMetadata } from './metadata'

// Split the snippet body at the "What it means for you" heading so a mobile
// in-article ad can sit in the natural pause between the two halves. A second
// unit goes just above the sources box on longer pieces.
function splitForAds(content: string): { top: string; bottom: string } {
  const idx = content.search(/^##\s+What it means for you/im)
  if (idx < 0) return { top: content, bottom: '' }
  return { top: content.slice(0, idx), bottom: content.slice(idx) }
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let item
  try {
    item = await getNewsBySlug(slug)
  } catch {
    notFound()
  }

  const { top, bottom } = splitForAds(item.content)
  const wordCount = item.content.split(/\s+/).length
  const longEnoughForTwo = wordCount > 450

  const url = `https://financialgurkha.com/news/${slug}`

  const newsSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: item.headline,
    description: item.dek,
    image: item.image ? [item.image] : undefined,
    datePublished: toIsoDate(item.date),
    dateModified: toIsoDate(item.date),
    wordCount,
    keywords: item.tags?.join(', '),
    articleSection: 'News',
    inLanguage: 'en-US',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'Financial Gurkha', url: 'https://financialgurkha.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Financial Gurkha',
      url: 'https://financialgurkha.com',
      logo: { '@type': 'ImageObject', url: 'https://financialgurkha.com/logo.png' },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://financialgurkha.com' },
      { '@type': 'ListItem', position: 2, name: 'News', item: 'https://financialgurkha.com/news' },
      { '@type': 'ListItem', position: 3, name: item.headline, item: url },
    ],
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
        <main className="lg:col-span-3">
          <Link
            href="/news"
            className="inline-flex items-center text-sm font-semibold text-amber-700 hover:text-amber-900 mb-6 transition"
          >
            <span className="mr-2">←</span>
            All news
          </Link>

          {/* Warm fuzzy card — the news desk's home. Cream paper, soft edges,
              friendly serif: the opposite of a trading terminal. */}
          <article className="max-w-3xl rounded-2xl border border-amber-100 bg-[#FDF9F0] p-6 sm:p-10 shadow-[0_2px_24px_rgba(201,162,75,0.08)]">
            <p
              className="mb-4 text-sm font-bold uppercase"
              style={{ letterSpacing: '0.22em', color: '#C9A24B' }}
            >
              The Daily Brief
            </p>

            <h1
              className="text-3xl sm:text-4xl font-bold mb-4 text-stone-900"
              style={{ fontFamily: "'Freight Big Pro', Georgia, serif", letterSpacing: '-0.02em' }}
            >
              {item.headline}
            </h1>

            <p
              className="text-lg sm:text-xl text-stone-600 mb-6 leading-relaxed"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
            >
              {item.dek}
            </p>

            {/* Cover image — shown when the brief sets an `image` in frontmatter. */}
            {item.image && (
              <figure className="mb-8 overflow-hidden rounded-xl border border-amber-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.headline}
                  className="w-full h-auto"
                  loading="eager"
                />
              </figure>
            )}

            <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500">
              <span>Financial Gurkha News Desk</span>
              <span className="text-stone-300">·</span>
              <time dateTime={toIsoDate(item.date)}>{item.date}</time>
            </div>

            {item.tags?.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-sm bg-amber-100/70 px-3 py-1 rounded-full text-amber-900"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="prose prose-lg max-w-none text-stone-800">
              <MDXRemote
                source={sanitizeMarkdownForMdx(top)}
                components={makeComponents(false)}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              />
            </div>

            {/* Mobile in-article ad in the pause between sections. Desktop
                readers get the sticky sidebar instead (see aside below). */}
            <AdSenseInArticle position="news_mid" />

            {bottom && (
              <div className="prose prose-lg max-w-none text-stone-800">
                <MDXRemote
                  source={sanitizeMarkdownForMdx(bottom)}
                  components={makeComponents(false)}
                  options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                />
              </div>
            )}

            {longEnoughForTwo && <AdSenseInArticle position="news_bottom" />}

            {/* Sources — every claim traceable, in plain sight. */}
            {item.sources?.length > 0 && (
              <div className="mt-10 rounded-xl bg-white/70 border border-amber-100 p-5">
                <p
                  className="mb-3 text-xs font-bold uppercase text-stone-500"
                  style={{ letterSpacing: '0.18em' }}
                >
                  Where this came from
                </p>
                <ul className="space-y-2">
                  {item.sources.map((s) => (
                    <li key={s.url} className="text-[15px]">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-stone-800 underline decoration-amber-300 decoration-2 underline-offset-4 hover:text-amber-800 transition"
                      >
                        {s.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8">
              <ShareButtons title={item.headline} subtitle={item.dek} />
            </div>

            <p className="mt-8 text-sm text-stone-400 italic">
              Plain-English explainers, not advice. Nothing here tells you to buy, sell, or hold
              anything.
            </p>
          </article>
        </main>

        {/* Desktop sidebar ad — same unit and behavior as articles. */}
        <aside className="hidden lg:block lg:col-span-1 mt-8 lg:mt-[100px]">
          <AdSenseSidebarAd />
        </aside>
      </div>
    </div>
  )
}
