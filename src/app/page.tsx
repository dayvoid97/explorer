import Link from 'next/link'
import { Inter } from 'next/font/google'
import { getAllPosts } from './lib/markdown'
import { formatNewsDate, getAllNews, newsTimestamp, type NewsSummary } from './lib/news'
import { getMarkets } from './lib/markets'
import { BRAND, BRAND_TITLE } from './lib/brand'
import MarketStrip from './components/home/MarketStrip'
import MarketsPanel from './components/home/MarketsPanel'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] })

export const metadata = {
  // Absolute title (no brand suffix) — the root layout template is bypassed
  // deliberately here so the homepage title reads cleanly in search results.
  title: {
    absolute: BRAND_TITLE,
  },
  description: BRAND.bio,
  alternates: { canonical: 'https://financialgurkha.com' },
}

// Market data and the newest briefs refresh every 10 minutes
export const revalidate = 600

/**
 * The homepage, in black and white: the market strip, then the day's briefs,
 * the markets panel, then research.
 */
const kicker = (item: NewsSummary) => item.tags?.[0] ?? 'Markets'

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-black/60">{children}</p>
}

function SectionHead({ title, href, cta }: { title: string; href: string; cta: string }) {
  return (
    <div className="flex items-baseline justify-between border-t-2 border-black pt-4">
      <h2 className="text-[13px] font-black uppercase tracking-[0.16em]">{title}</h2>
      <Link href={href} className="text-[12px] font-semibold hover:underline">
        {cta} →
      </Link>
    </div>
  )
}

export default async function Home() {
  const [news, posts, markets] = await Promise.all([getAllNews(), getAllPosts(), getMarkets()])
  const research = [...posts]
    .filter((p) => p.slug)
    .sort((a, b) => newsTimestamp(b.date) - newsTimestamp(a.date))
    .slice(0, 5)

  const [lead, ...others] = news
  const latest = others.slice(0, 6)
  const more = others.slice(6, 10)
  const today = new Date().toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className={`${inter.className} bg-white text-black`}>
      <MarketStrip initial={markets} />

      <div className="mx-auto max-w-[1400px] px-4 pb-20 sm:px-6">
        <div className="flex items-center justify-between py-4 text-[12px]">
          <p className="font-semibold">{today}</p>
          <Link href="/news" className="font-semibold hover:underline">
            The Daily Brief →
          </Link>
        </div>

        {/* ============ THE DAY'S BRIEFS ============ */}
        {lead ? (
          <section aria-label="Today's briefs" className="grid gap-8 border-t-2 border-black pt-6 lg:grid-cols-12">
            <Link href={`/news/${lead.slug}`} className="group lg:col-span-7">
              {lead.image ? (
                <div className="aspect-[16/9] overflow-hidden bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={lead.image} alt="" className="h-full w-full object-cover" />
                </div>
              ) : null}
              <div className="mt-4">
                <Kicker>{kicker(lead)}</Kicker>
                <h1 className="mt-2 text-[32px] font-black leading-[1.08] tracking-[-0.02em] group-hover:underline sm:text-[42px]">{lead.headline}</h1>
                <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-black/75">{lead.dek}</p>
                <p className="mt-3 text-[12px] text-black/50">
                  {formatNewsDate(lead.date)} · {lead.readMinutes} min read
                </p>
              </div>
            </Link>

            <div className="lg:col-span-5">
              <h2 className="text-[13px] font-black uppercase tracking-[0.16em]">Latest</h2>
              <ol className="mt-2">
                {latest.map((item) => (
                  <li key={item.slug} className="border-b border-black/15 py-4 first:pt-2">
                    <Link href={`/news/${item.slug}`} className="group block">
                      <Kicker>{kicker(item)}</Kicker>
                      <h3 className="mt-1 text-[18px] font-bold leading-snug tracking-[-0.01em] group-hover:underline">{item.headline}</h3>
                      <p className="mt-1 text-[12px] text-black/50">{formatNewsDate(item.date)}</p>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ) : null}

        {more.length ? (
          <section aria-label="More briefs" className="mt-10 grid gap-8 border-t border-black/15 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {more.map((item) => (
              <Link key={item.slug} href={`/news/${item.slug}`} className="group">
                {item.image ? (
                  <div className="aspect-[16/9] overflow-hidden bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <div className="mt-3">
                  <Kicker>{kicker(item)}</Kicker>
                  <h3 className="mt-1 text-[17px] font-bold leading-snug group-hover:underline">{item.headline}</h3>
                </div>
              </Link>
            ))}
          </section>
        ) : null}

        {/* ============ MARKETS ============ */}
        <div className="mt-14">
          <MarketsPanel data={markets} />
        </div>

        {/* ============ RESEARCH ============ */}
        {research.length ? (
          <section aria-label="Research" className="mt-14">
            <SectionHead title="Research" href="/blog" cta="All research" />
            <div className="mt-6 grid gap-8 lg:grid-cols-12">
              <Link href={`/blog/${research[0].slug}`} className="group lg:col-span-6">
                {research[0].image ? (
                  <div className="aspect-[16/9] overflow-hidden bg-black/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={research[0].image} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                ) : null}
                <h3 className="mt-4 text-[26px] font-black leading-tight tracking-[-0.015em] group-hover:underline">{research[0].title}</h3>
                <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-black/70">{research[0].subtitle}</p>
                <p className="mt-2 text-[12px] text-black/50">
                  {formatNewsDate(research[0].date)} · {research[0].author}
                </p>
              </Link>
              <div className="grid gap-x-8 sm:grid-cols-2 lg:col-span-6">
                {research.slice(1).map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group border-b border-black/15 py-4 first:pt-0 sm:[&:nth-child(2)]:pt-0">
                    <Kicker>{post.categories?.[0] ?? 'Research'}</Kicker>
                    <h3 className="mt-1 text-[18px] font-bold leading-snug group-hover:underline">{post.title}</h3>
                    <p className="mt-1 line-clamp-2 text-[14px] text-black/65">{post.subtitle}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
