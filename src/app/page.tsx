import Link from 'next/link'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { playfair } from './fonts'
import { getAllPosts } from './lib/markdown'
import { formatNewsDate, getAllNews, newsTimestamp, type NewsSummary } from './lib/news'
import { getMarkets } from './lib/markets'
import { BRAND, BRAND_TITLE } from './lib/brand'
import { resolveCoverImage } from './lib/cover-image'
import MarketStrip from './components/home/MarketStrip'
import MarketsPanel from './components/home/MarketsPanel'
import StreetGallery from './components/home/StreetGallery'
import { getStreetPhotos } from './lib/street-photos'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800', '900'] })
// Newspaper-style serif for the hero headlines; the brand serif used in video plates and cards
const serif = playfair

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
 * The homepage, in black and white: the market strip, then a three-column hero
 * in the financial-newspaper layout (newest brief, newest research article,
 * latest briefs), more briefs, the markets panel, research, then the Wall
 * Street postcards.
 */
const kicker = (item: NewsSummary) => item.tags?.[0] ?? 'Markets'

// Covers are full-size originals; the optimizer serves a resized copy that fits the slot.
function Cover({
  image,
  sizes,
  priority = false,
}: {
  image?: string
  sizes: string
  priority?: boolean
}) {
  const img = resolveCoverImage(image)
  if (!img) return null
  return (
    <Image
      src={img.src}
      alt=""
      fill
      sizes={sizes}
      quality={75}
      priority={priority}
      unoptimized={!img.optimize}
      className="object-cover"
    />
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-black/60">{children}</p>
  )
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
  const streetPhotos = getStreetPhotos()
  // The newest research article leads the hero; the research section below starts after it
  const [featured, ...research] = [...posts]
    .filter((p) => p.slug)
    .sort((a, b) => newsTimestamp(b.date) - newsTimestamp(a.date))
    .slice(0, 6)

  // Hero: the newest brief on the left, the next one under it, three more under Latest
  const [lead, second, ...others] = news
  const latest = others.slice(0, 3)
  const more = others.slice(3, 7)
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

        {/* ============ HERO: newest brief · newest research · latest ============ */}
        {lead || featured ? (
          <section
            aria-label="Top stories"
            className="grid gap-10 border-t-2 border-black pt-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,2.2fr)_minmax(0,1fr)] lg:gap-0"
          >
            {/* Left: the newest brief, with the next one pinned to the bottom */}
            <div className="flex flex-col lg:pr-8">
              {lead ? (
                <Link href={`/news/${lead.slug}`} className="group block">
                  <p className="text-[15px] font-semibold">{kicker(lead)}</p>
                  <h1
                    className={`${serif.className} mt-3 text-[34px] font-semibold leading-[1.08] tracking-[-0.01em] group-hover:underline sm:text-[42px]`}
                  >
                    {lead.headline}
                  </h1>
                  <p className="mt-4 line-clamp-4 text-[17px] leading-relaxed text-black/65">{lead.dek}</p>
                  <p className="mt-3 text-[12px] text-black/50">
                    {formatNewsDate(lead.date)} · {lead.readMinutes} min read
                  </p>
                </Link>
              ) : null}
              {second ? (
                <Link
                  href={`/news/${second.slug}`}
                  className="group mt-8 block border-l border-black/30 pl-5 lg:mt-auto lg:pt-10"
                >
                  <h2
                    className={`${serif.className} text-[20px] font-semibold leading-snug group-hover:underline`}
                  >
                    {second.headline}
                  </h2>
                  <span className="mt-3 inline-block border border-black px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]">
                    {kicker(second)}
                  </span>
                </Link>
              ) : null}
            </div>

            {/* Center: the newest research article, image over a shaded caption panel */}
            {featured ? (
              <Link
                href={`/blog/${featured.slug}`}
                className="group flex flex-col lg:border-l lg:border-black/15 lg:px-8"
              >
                {featured.image ? (
                  <div className="relative aspect-[16/9] overflow-hidden bg-black/5">
                    <Cover image={featured.image} sizes="(min-width: 1024px) 660px, 100vw" priority />
                  </div>
                ) : null}
                <div className="flex-1 bg-black/[0.05] px-6 py-6 text-center sm:px-10">
                  <p className="text-[15px] font-semibold">{featured.categories?.[0] ?? 'Research'}</p>
                  <h2
                    className={`${serif.className} mt-3 text-[26px] leading-tight group-hover:underline sm:text-[32px]`}
                  >
                    <span className="font-bold">Research.</span>{' '}
                    <span className="font-medium">{featured.title}</span>
                  </h2>
                  <p className="mt-3 text-[13px] text-black/55">
                    {featured.author ? `By ${featured.author} · ` : ''}
                    {formatNewsDate(featured.date)}
                  </p>
                </div>
              </Link>
            ) : null}

            {/* Right: Latest, the first with a picture */}
            {latest.length ? (
              <div className="lg:border-l lg:border-black/15 lg:pl-8">
                <h2 className="text-[15px] font-semibold">
                  <Link href="/news" className="hover:underline">
                    Latest
                  </Link>
                </h2>
                <ol className="mt-3">
                  {latest.map((item, i) => (
                    <li key={item.slug} className={i ? 'border-t border-black/15 py-4' : 'pb-4'}>
                      <Link href={`/news/${item.slug}`} className="group block">
                        {i === 0 && item.image ? (
                          <div className="relative mb-3 aspect-[16/10] overflow-hidden bg-black/5">
                            <Cover image={item.image} sizes="(min-width: 1024px) 300px, 100vw" />
                          </div>
                        ) : null}
                        <h3
                          className={`${serif.className} font-semibold leading-snug group-hover:underline ${
                            i === 0 ? 'text-[20px]' : 'text-[17px]'
                          }`}
                        >
                          {item.headline}
                        </h3>
                        <p className="mt-1.5 text-[12px] text-black/50">{formatNewsDate(item.date)}</p>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </section>
        ) : null}

        {more.length ? (
          <section
            aria-label="More briefs"
            className="mt-10 grid gap-8 border-t border-black/15 pt-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {more.map((item) => (
              <Link key={item.slug} href={`/news/${item.slug}`} className="group">
                {item.image ? (
                  <div className="relative aspect-[16/9] overflow-hidden bg-black/5">
                    <Cover
                      image={item.image}
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                    />
                  </div>
                ) : null}
                <div className="mt-3">
                  <Kicker>{kicker(item)}</Kicker>
                  <h3 className="mt-1 text-[17px] font-bold leading-snug group-hover:underline">
                    {item.headline}
                  </h3>
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
                  <div className="relative aspect-[16/9] overflow-hidden bg-black/5">
                    <Cover image={research[0].image} sizes="(min-width: 1024px) 600px, 100vw" />
                  </div>
                ) : null}
                <h3 className="mt-4 text-[26px] font-black leading-tight tracking-[-0.015em] group-hover:underline">
                  {research[0].title}
                </h3>
                <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-black/70">
                  {research[0].subtitle}
                </p>
                <p className="mt-2 text-[12px] text-black/50">
                  {formatNewsDate(research[0].date)} · {research[0].author}
                </p>
              </Link>
              <div className="grid gap-x-8 sm:grid-cols-2 lg:col-span-6">
                {research.slice(1).map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group border-b border-black/15 py-4 first:pt-0 sm:[&:nth-child(2)]:pt-0"
                  >
                    <Kicker>{post.categories?.[0] ?? 'Research'}</Kicker>
                    <h3 className="mt-1 text-[18px] font-bold leading-snug group-hover:underline">
                      {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[14px] text-black/65">{post.subtitle}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>

      {/* ============ FROM THE STREET: the Wall Street postcard ============ */}
      {streetPhotos.length ? (
        <section aria-labelledby="from-the-street" className="bg-black text-white">
          <div className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
              From the Street
            </p>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
              <h2
                id="from-the-street"
                className={`${serif.className} max-w-xl text-[32px] font-semibold leading-tight sm:text-[40px]`}
              >
                We walk the blocks we write about.
              </h2>
              <p className="max-w-sm text-[15px] leading-relaxed text-white/60">
                Financial Gurkha operates from New York City. Most articles are researched and written
                from Wall Street and the surrounding Financial District — on the ground, at least twice
                a week.
              </p>
            </div>
            <div className="mt-10">
              <StreetGallery photos={streetPhotos} />
            </div>
            <div className="mt-8 flex justify-end">
              <Link
                href="/wall-street"
                className="border border-white/20 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:border-white hover:text-white"
              >
                See the full wall of postcards →
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
