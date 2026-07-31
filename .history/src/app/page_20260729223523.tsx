import Link from 'next/link'
import { Playfair_Display } from 'next/font/google'
import { getAllPosts } from './lib/markdown'
import { BlogPost } from './blog/[slug]/metadata'
import NycClock from './components/home/NycClock'
import StreetGallery from './components/home/StreetGallery'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'] })

const GOLD = '#C9A24B'

export const metadata = {
  title: 'Financial Gurkha — Markets Research from Wall Street, New York',
  description:
    'Independent equity valuations, macro analysis, and market coverage. Written from Wall Street and Lower Manhattan, New York City. Est. 2022.',
}

export default async function Home() {
  const posts: Omit<BlogPost, 'content'>[] = await getAllPosts()
  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const featured = sorted[0]
  const rest = sorted.slice(1, 7)

  return (
    <div className="bg-[#0A0A0A] text-white">
      {/* ============ HERO ============ */}
      <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/50">
              Independent Markets Research · Est. 2022
            </p>

            <h1
              className={`${playfair.className} mt-6 text-6xl font-black leading-[0.95] sm:text-7xl lg:text-8xl`}
            >
              Financial
              <br />
              <span style={{ color: GOLD }}>Gurkha</span>
            </h1>

            <p className="mt-8 max-w-md text-lg font-light leading-relaxed text-white/80">
              Equity valuations, macro analysis, and market coverage — researched, written, and
              filed from Wall Street, New York.
            </p>

            <div className="mt-8">
              <NycClock />
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {featured && (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="border px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] transition hover:bg-[#C9A24B] hover:text-black"
                  style={{ borderColor: GOLD, color: GOLD }}
                >
                  Read the Latest
                </Link>
              )}
              <a
                href="#from-the-street"
                className="border border-white/20 px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] text-white/70 transition hover:border-white hover:text-white"
              >
                From the Street
              </a>
            </div>
          </div>

          {/* Hero photo — 14 Wall Street */}
          <div className="relative hidden lg:block">
            <div
              className="absolute -inset-3 translate-x-4 translate-y-4 border"
              style={{ borderColor: `${GOLD}55` }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/kanchan-wallst-financialgurkha.png"
              alt="Financial Gurkha at 14 Wall Street, New York"
              className="relative aspect-[3/4] w-full object-cover"
            />
            <p className="pt-3 text-right font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              14 Wall Street · Financial District, NYC
            </p>
          </div>
        </div>
      </section>

      {/* ============ DATELINE STRIP ============ */}
      <div className="border-y border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">
            Reported from Wall Street. Published to the world.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: GOLD }}>
            New York City
          </p>
        </div>
      </div>

      {/* ============ FEATURED ANALYSIS ============ */}
      {featured && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: GOLD }}>
            Featured Analysis
          </p>
          <Link href={`/blog/${featured.slug}`} className="group mt-8 grid gap-10 lg:grid-cols-2">
            {featured.image && (
              <div className="aspect-[16/10] overflow-hidden bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
                />
              </div>
            )}
            <div className="flex flex-col justify-center">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                {featured.date} · {featured.author}
              </p>
              <h2
                className={`${playfair.className} mt-4 text-3xl font-bold leading-tight sm:text-4xl group-hover:underline decoration-1 underline-offset-8`}
              >
                {featured.title}
              </h2>
              <p className="mt-5 line-clamp-4 font-light leading-relaxed text-white/70">
                {featured.subtitle}
              </p>
              <p
                className="mt-6 font-mono text-xs uppercase tracking-[0.25em]"
                style={{ color: GOLD }}
              >
                Read the analysis →
              </p>
            </div>
          </Link>
        </section>
      )}

      {/* ============ THE LEDGER (latest work) ============ */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between">
            <h2 className={`${playfair.className} text-3xl font-bold sm:text-4xl`}>The Ledger</h2>
            <Link
              href="/blog"
              className="font-mono text-xs uppercase tracking-[0.25em] text-white/50 transition hover:text-white"
            >
              All articles →
            </Link>
          </div>

          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                {post.image && (
                  <div className="aspect-[16/10] overflow-hidden bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.image}
                      alt={post.title}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale-[25%] transition duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <p className="pt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                  {post.date}
                </p>
                <h3
                  className={`${playfair.className} pt-2 text-xl font-bold leading-snug group-hover:underline decoration-1 underline-offset-4`}
                >
                  {post.title}
                </h3>
                <p className="line-clamp-2 pt-2 text-sm font-light text-white/60">
                  {post.subtitle}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FROM THE STREET ============ */}
      <section id="from-the-street" className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: GOLD }}>
            From the Street
          </p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <h2 className={`${playfair.className} max-w-xl text-3xl font-bold sm:text-4xl`}>
              We walk the blocks we write about.
            </h2>
            <p className="max-w-sm text-sm font-light leading-relaxed text-white/60">
              Financial Gurkha operates from New York City. Most articles are researched and written
              from Wall Street and the surrounding Financial District — on the ground, at least
              twice a week.
            </p>
          </div>
          <div className="mt-10">
            <StreetGallery />
          </div>
        </div>
      </section>

      {/* ============ CLOSING STATEMENT ============ */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <p
            className={`${playfair.className} mx-auto max-w-3xl text-2xl font-normal italic leading-relaxed text-white/85 sm:text-3xl`}
          >
            “Markets reward the prepared. We do the preparation in public.”
          </p>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.35em] text-white/40">
            Financial Gurkha · New York City · Est. 2022
          </p>
        </div>
      </section>
    </div>
  )
}
