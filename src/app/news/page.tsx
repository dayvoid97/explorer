import Link from 'next/link'
import { formatNewsDate, getAllNews, type NewsSummary } from '@/app/lib/news'
import { NewsThumb } from './news-thumb'
import { NewsRailAd } from './news-ads'
import { NEWS_RAIL_AD_SLOT } from './news-ad-config'

export const metadata = {
  title: 'The Daily Brief | Financial Gurkha News',
  description:
    "The day's money news, explained like a friend would. Short, plain-English briefs on markets, rates, and the economy — verified and sourced.",
  alternates: {
    canonical: 'https://financialgurkha.com/news',
    types: { 'application/rss+xml': 'https://financialgurkha.com/rss.xml' },
  },
  openGraph: {
    title: 'The Daily Brief | Financial Gurkha News',
    description:
      "The day's money news, explained like a friend would. Short, plain-English briefs — verified and sourced.",
    url: 'https://financialgurkha.com/news',
    type: 'website',
    siteName: 'Financial Gurkha',
  },
}

const SERIF = "'Freight Big Pro', Georgia, 'Times New Roman', serif"
const BODY = "Georgia, 'Times New Roman', serif"
const GOLD = '#a8873c'
/*
 * Ads on this page: desktop only, one sticky 300×600 in the newspaper ad column
 * (NewsRailAd). Phones and tablets get no ads on the front page; readers meet
 * the in-article ads inside each brief instead.
 */

/** First tag, shown as the story's kicker ("META", "OIL"…). */
function kicker(item: NewsSummary) {
  return item.tags?.[0] ?? 'Markets'
}

function Meta({ item }: { item: NewsSummary }) {
  return (
    <p className="text-[11px] uppercase tracking-[0.16em] text-stone-500">
      <span className="font-bold" style={{ color: GOLD }}>
        {kicker(item)}
      </span>
      <span className="mx-2 text-stone-300">·</span>
      {formatNewsDate(item.date)}
      <span className="mx-2 text-stone-300">·</span>
      {item.readMinutes} min read
    </p>
  )
}

/** The newest brief, set large at the top of the page. */
function LeadStory({ item }: { item: NewsSummary }) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className="group grid items-start gap-6 md:grid-cols-[1.35fr_1fr] md:gap-8"
    >
      <div className="relative aspect-video overflow-hidden rounded-sm bg-[#efe6d2]">
        <NewsThumb
          src={item.image}
          alt={item.headline}
          sizes="(min-width: 768px) 560px, 100vw"
          priority
        />
      </div>
      <div className="flex flex-col justify-center">
        <p
          className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em]"
          style={{ color: GOLD }}
        >
          Latest brief
        </p>
        <h2
          className="text-3xl font-bold leading-[1.1] text-stone-900 group-hover:underline group-hover:decoration-[#C9A24B] group-hover:decoration-2 group-hover:underline-offset-4 md:text-[1.75rem] lg:text-[2rem]"
          style={{ fontFamily: SERIF, letterSpacing: '-0.015em' }}
        >
          {item.headline}
        </h2>
        <p
          className="mt-4 line-clamp-4 text-[17px] md:line-clamp-3 md:text-base leading-relaxed text-stone-600"
          style={{ fontFamily: BODY }}
        >
          {item.dek}
        </p>
        <div className="mt-5">
          <Meta item={item} />
        </div>
      </div>
    </Link>
  )
}

/** One row in the day-by-day list: text on the left, thumbnail on the right. */
function BriefRow({ item }: { item: NewsSummary }) {
  return (
    <Link href={`/news/${item.slug}`} className="group flex gap-4 py-5 sm:gap-6">
      <div className="min-w-0 flex-1">
        <h3
          className="text-[19px] font-bold leading-snug text-stone-900 group-hover:underline group-hover:decoration-[#C9A24B] group-hover:decoration-2 group-hover:underline-offset-4 sm:text-[22px]"
          style={{ fontFamily: SERIF }}
        >
          {item.headline}
        </h3>
        <p
          className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-stone-600 sm:text-base"
          style={{ fontFamily: BODY }}
        >
          {item.dek}
        </p>
        <div className="mt-3">
          <Meta item={item} />
        </div>
      </div>
      <div className="relative mt-1 aspect-[4/3] w-24 shrink-0 self-start overflow-hidden rounded-sm bg-[#efe6d2] sm:aspect-video sm:w-44">
        <NewsThumb src={item.image} alt="" sizes="(min-width: 640px) 176px, 96px" />
      </div>
    </Link>
  )
}

/** Briefs after the lead, grouped under a heading for each publication day. */
function groupByDay(items: NewsSummary[]) {
  const groups: { label: string; items: NewsSummary[] }[] = []
  for (const item of items) {
    const label = formatNewsDate(item.date, 'long')
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.items.push(item)
    else groups.push({ label, items: [item] })
  }
  return groups
}

export default async function NewsIndexPage() {
  const items = await getAllNews() // newest first
  const [lead, ...rest] = items
  const days = groupByDay(rest)
  const edition = lead ? formatNewsDate(lead.date, 'long') : ''

  return (
    <main className="px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl rounded-sm border border-[#eadfc6] bg-[#FDF9F0] px-5 pb-12 pt-6 shadow-[0_2px_24px_rgba(168,135,60,0.08)] sm:px-10">
        {/* ---------- Nameplate ---------- */}
        <header className="text-center">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-stone-500 sm:text-[11px]">
            <span>Financial Gurkha</span>
            <span className="hidden sm:inline">Wall Street · New York</span>
            <span>{items.length} briefs</span>
          </div>
          <div className="mt-3 border-t-[3px] border-double border-stone-800" />
          <h1
            className="py-4 text-5xl font-bold leading-none text-stone-900 sm:py-5 sm:text-7xl"
            style={{ fontFamily: SERIF, letterSpacing: '-0.02em' }}
          >
            The Daily Brief
          </h1>
          <div className="border-t border-stone-800" />
          <div className="flex flex-col items-center justify-between gap-1 py-2 text-[11px] uppercase tracking-[0.18em] text-stone-600 sm:flex-row">
            <span>{edition}</span>
            <span
              className="normal-case tracking-normal italic text-stone-500"
              style={{ fontFamily: BODY }}
            >
              The day&apos;s money news, explained like a friend would.
            </span>
          </div>
          <div className="border-t border-stone-800" />
        </header>

        {!lead ? (
          <p className="py-16 text-center text-lg text-stone-500" style={{ fontFamily: BODY }}>
            The news desk is brewing its first brief. Check back soon.
          </p>
        ) : (
          <>
            <section className="pt-8" aria-label="Latest brief">
              <LeadStory item={lead} />
            </section>

            {/* Desktop: the day-by-day list beside a newspaper ad column (once its unit is set). */}
            <div
              className={
                NEWS_RAIL_AD_SLOT ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10' : ''
              }
            >
              <div className="min-w-0">
                {days.map((day) => (
                  <section key={day.label} className="mt-10" aria-label={day.label}>
                    <h2 className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.25em] text-stone-800">
                      {day.label === edition ? `More from ${day.label}` : day.label}
                      <span className="h-px flex-1 bg-stone-300" />
                    </h2>
                    <div className="divide-y divide-[#eadfc6]">
                      {day.items.map((item) => (
                        <BriefRow key={item.slug} item={item} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
              {/* Desktop only; renders nothing on phones and tablets. */}
              <NewsRailAd />
            </div>

            <footer
              className="mt-12 border-t border-stone-300 pt-5 text-center text-sm text-stone-500"
              style={{ fontFamily: BODY }}
            >
              <p className="italic">
                Plain-English explainers, not advice. Every brief lists its sources.
              </p>
              <p className="mt-2">
                <a
                  href="/rss.xml"
                  className="font-semibold text-stone-700 underline decoration-[#C9A24B] decoration-2 underline-offset-4 hover:text-stone-900"
                >
                  Follow by RSS
                </a>
              </p>
            </footer>
          </>
        )}
      </div>
    </main>
  )
}
