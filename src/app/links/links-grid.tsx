'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { resolveCoverImage } from '@/app/lib/cover-image'
import { track } from '@/app/lib/analytics'
import { useAdSlot } from '@/app/hooks/useAdSlot'
import { AdLabel } from '@/app/components/AdLabel'
import { BRAND } from '@/app/lib/brand'

export interface LinkArticle {
  title: string
  href: string
  image: string
  ts: number
  dateLabel: string
  kind: string
}

type SortMode = 'newest' | 'oldest' | 'surprise'

const INSTAGRAM_URL = 'https://www.instagram.com/financialgurkha/'

// Loaded once with next/font in ./layout.tsx and exposed as a CSS variable.
const SERIF = "var(--font-links-serif), Georgia, 'Times New Roman', serif"

/*
 * Layout
 *
 * Phones: two columns of 9:16 cards; the cover fills the card and the headline
 * sits on a gradient along the bottom edge, like a Reel thumbnail.
 *
 * md and up: an Instagram profile. Profile header, tab-style sort, and a tight
 * three-column grid of 3:4 tiles (Instagram's profile-grid shape) with 4px
 * gaps. Covers fill the tile edge to edge, and the headline appears on hover,
 * the way Instagram shows likes.
 *
 * Ads: one 300×250 card ad per page (see CardAd). /links exists to get readers
 * into an article, where the rest of the ads live.
 */
// Roughly the first screen on a phone; these load with high priority.
const PRIORITY_CARDS = 6

/*
 * Card ads: one per page, sized exactly 300×250 (the most-bid display size)
 * using AdSense's exact-size method for responsive units: display:inline-block
 * with a fixed width and height, and no data-ad-format, so the ad can never
 * stretch out of its card.
 *
 * - Phones and tablets (below lg): a full-width ad card after the 6th tile.
 *   Six tiles is exactly 3 rows on the 2-column phone grid and 2 rows on the
 *   3-column tablet grid, so the grid never gets a hole.
 * - Desktop (lg+): a single tile in the grid at a random position from tile 4
 *   to 9 (rows two and three), picked after the page loads.
 *
 * Only one of the two is ever visible, and the ad loader never requests an ad
 * for a hidden slot, so each page view makes a single ad request.
 */
const AD_CLIENT = 'ca-pub-8441965953327461'
const MOBILE_AD_SLOT = '2051198166' // fg-links-display-mobile
const DESKTOP_AD_SLOT = '5104114795' // fg-links-desktop
const MOBILE_AD_AFTER = 6
const DESKTOP_AD_RANGE: [number, number] = [4, 9]

function CardAd({ variant }: { variant: 'mobile' | 'desktop' }) {
  const { ref, shouldRender } = useAdSlot(`links_card_${variant}`)
  const frame =
    variant === 'mobile'
      ? 'col-span-full my-1 flex lg:hidden'
      : 'hidden lg:flex lg:aspect-[3/4]'
  return (
    <div
      ref={ref}
      className={`ad-slot ${frame} flex-col items-center border border-[rgba(198,161,91,0.35)] bg-[#141414] p-3`}
    >
      <div className="w-full">
        <AdLabel align="right" />
      </div>
      {/* The ad is exactly 300×250 and is never cropped. */}
      <div className="flex flex-1 items-center justify-center">
        <div className="h-[250px] w-[300px]">
          {shouldRender && (
            <ins
              className="adsbygoogle"
              style={{ display: 'inline-block', width: 300, height: 250 }}
              data-ad-client={AD_CLIENT}
              data-ad-slot={variant === 'mobile' ? MOBILE_AD_SLOT : DESKTOP_AD_SLOT}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function GeneratedCover({ kind }: { kind: string }) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#0b0b0b] px-2 text-center"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 50% 0%, rgba(198,161,91,0.22), transparent 60%), repeating-linear-gradient(0deg, rgba(243,234,210,0.04) 0 1px, transparent 1px 18px)',
      }}
    >
      <span
        style={{ fontFamily: SERIF }}
        className="text-[13px] font-bold uppercase leading-tight tracking-[0.18em] text-[#f3ead2] md:text-lg"
      >
        Financial
        <br />
        <span className="text-[#c6a15b]">Gurkha</span>
      </span>
      <span className="h-px w-6 bg-[#c6a15b] md:w-10" />
      <span className="text-[8px] uppercase tracking-[0.2em] text-[#c6a15b] md:text-[10px]">
        {kind}
      </span>
    </div>
  )
}

function CardImage({ a, priority }: { a: LinkArticle; priority: boolean }) {
  const img = resolveCoverImage(a.image)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (!img || failed) return <GeneratedCover kind={a.kind} />

  return (
    <div className="relative h-full w-full bg-[#101010]">
      {!loaded && <div className="absolute inset-0 animate-pulse bg-[#1c1c1c]" />}
      <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
        {/* The cover fills the card edge to edge: 9:16 on phones, 3:4 on md+. */}
        <Image
          src={img.src}
          alt={a.title}
          fill
          sizes="(min-width: 768px) 310px, 50vw"
          quality={72}
          priority={priority}
          unoptimized={!img.optimize}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </div>
  )
}

/*
 * One card, two layouts, cover edge to edge in both:
 * - Phones: a 9:16 card, headline always visible on a gradient at the bottom.
 * - md+: a borderless 3:4 tile, headline in a hover overlay.
 */
function ArticleCard({
  a,
  priority,
  onOpen,
}: {
  a: LinkArticle
  priority: boolean
  onOpen: () => void
}) {
  return (
    <a
      href={a.href}
      onClick={onOpen}
      aria-label={a.title}
      className="group relative block aspect-[9/16] overflow-hidden rounded-md bg-[#141414] ring-1 ring-[rgba(198,161,91,0.18)] transition hover:ring-[rgba(198,161,91,0.5)] focus-visible:outline-none md:block md:aspect-[3/4] md:rounded-none md:ring-0"
    >
      <div className="absolute inset-0 overflow-hidden">
        <CardImage a={a} priority={priority} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/60 to-transparent p-2.5 pt-20 md:inset-0 md:items-center md:justify-center md:gap-3 md:bg-none md:bg-black/65 md:p-6 md:text-center md:opacity-0 md:transition-opacity md:duration-200 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        <p
          style={{ fontFamily: SERIF }}
          className="line-clamp-4 text-[14px] font-semibold leading-tight text-white md:line-clamp-5 md:text-lg md:leading-snug md:text-white"
        >
          {a.title}
        </p>
        <p className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c6a15b] md:block">
          {a.kind}
          {a.dateLabel ? ` · ${a.dateLabel}` : ''}
        </p>
      </div>
    </a>
  )
}

const TABS: { mode: SortMode; label: string; title?: string }[] = [
  { mode: 'newest', label: 'Newest first' },
  { mode: 'oldest', label: 'Oldest first' },
  { mode: 'surprise', label: '🎲 Surprise me', title: 'Shuffle the grid' },
]

export default function LinksGrid({ articles }: { articles: LinkArticle[] }) {
  const [mode, setMode] = useState<SortMode>('newest')
  const [seed, setSeed] = useState(0)

  // Instagram attribution: bio links carry UTM tags (see docs/production-workflow.md).
  const campaign = useRef<{ source?: string; content?: string; campaign?: string }>({})
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    campaign.current = {
      source: q.get('utm_source') ?? undefined,
      content: q.get('utm_content') ?? undefined,
      campaign: q.get('utm_campaign') ?? undefined,
    }
  }, [])

  const trackOpen = (a: LinkArticle, position: number) =>
    track('links-card-click', {
      href: a.href,
      kind: a.kind,
      position,
      sort: mode,
      utm_source: campaign.current.source,
      utm_content: campaign.current.content,
      utm_campaign: campaign.current.campaign,
    })

  const ordered = useMemo(() => {
    if (mode === 'oldest') return [...articles].sort((x, y) => x.ts - y.ts)
    if (mode === 'surprise') return shuffle(articles)
    return articles
    // `seed` re-runs the shuffle each time "Surprise me" is pressed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles, mode, seed])

  // Ad tile position: picked on the client after mount, so server and client
  // render the same markup (a random pick during render would not match).
  const [adAfter, setAdAfter] = useState<number | null>(null)
  useEffect(() => {
    const [lo, hi] = DESKTOP_AD_RANGE
    setAdAfter(lo - 1 + Math.floor(Math.random() * (hi - lo + 1)))
  }, [])

  const research = articles.filter((a) => a.kind === 'Research').length
  const news = articles.length - research

  const pick = (m: SortMode) => {
    if (m === 'surprise') setSeed((s) => s + 1)
    setMode(m)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#0b0b0b',
        backgroundImage:
          'repeating-linear-gradient(90deg, rgba(243,234,210,0.045) 0px, rgba(243,234,210,0.045) 1px, transparent 1px, transparent 7px)',
        color: '#f3ead2',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      }}
    >
      <div className="mx-auto max-w-[1120px] px-4 pb-14 pt-10 md:max-w-[935px] md:px-5 lg:px-0">
        {/* ---------- Phones: centred masthead ---------- */}
        <header className="mb-6 text-center md:hidden">
          <div
            style={{ fontFamily: SERIF }}
            className="text-[30px] font-bold uppercase leading-tight tracking-[0.14em]"
          >
            Financial Gurkha
          </div>
          <div className="mx-auto mb-3 mt-[14px] h-[2px] w-16 bg-[#c6a15b]" />
          <div className="text-sm tracking-[0.08em] text-[#c6a15b]">@financialgurkha</div>
          <p className="mx-auto mt-[14px] max-w-[560px] text-[15px] leading-[1.55] text-[#b9ae94]">
            {BRAND.bio}
          </p>
        </header>

        {/* ---------- md+: Instagram profile header ---------- */}
        <header className="mb-10 hidden items-center gap-16 px-8 md:flex">
          <div
            className="flex h-[150px] w-[150px] shrink-0 items-center justify-center rounded-full bg-[#0b0b0b] ring-2 ring-[#c6a15b] ring-offset-4 ring-offset-[#0b0b0b]"
            aria-hidden
          >
            <span style={{ fontFamily: SERIF }} className="text-5xl font-bold tracking-tight">
              F<span className="text-[#c6a15b]">G</span>
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-normal text-[#f3ead2]">financialgurkha</h1>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('links_instagram_click', { placement: 'profile_header' })}
                className="rounded-lg bg-[#c6a15b] px-4 py-1.5 text-sm font-semibold text-[#0b0b0b] transition hover:bg-[#d6b46b]"
              >
                Visit Instagram
              </a>
            </div>
            <ul className="mt-5 flex gap-10 text-base">
              <li>
                <span className="font-semibold">{articles.length}</span> posts
              </li>
              <li>
                <span className="font-semibold">{research}</span> research
              </li>
              <li>
                <span className="font-semibold">{news}</span> news briefs
              </li>
            </ul>
            <div className="mt-5 text-sm leading-relaxed">
              <p style={{ fontFamily: SERIF }} className="font-semibold">
                Financial Gurkha
              </p>
              <p className="text-[#b9ae94]">
                {BRAND.bio}
              </p>
            </div>
          </div>
        </header>

        {/* ---------- Sort: pill buttons on phones, Instagram tabs on md+ ---------- */}
        <div
          role="group"
          aria-label="Sort articles"
          className="mb-[26px] flex flex-wrap justify-center gap-[10px] md:mb-1 md:gap-14 md:border-t md:border-[rgba(243,234,210,0.15)]"
        >
          {TABS.map((t) => {
            const active = mode === t.mode
            return (
              <button
                key={t.mode}
                onClick={() => pick(t.mode)}
                aria-pressed={active}
                title={t.title}
                className={`cursor-pointer border px-4 py-[9px] text-[13px] font-semibold tracking-[0.04em] md:-mt-px md:border-0 md:border-t md:bg-transparent md:px-0 md:py-4 md:text-xs md:uppercase md:tracking-[0.15em] ${
                  active
                    ? 'border-[rgba(198,161,91,0.5)] bg-[#c6a15b] text-[#0b0b0b] md:border-t-[#f3ead2] md:text-[#f3ead2]'
                    : 'border-[rgba(198,161,91,0.5)] bg-transparent text-[#f3ead2] md:border-t-transparent md:text-[#8e8e8e] md:hover:text-[#f3ead2]'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-1">
          {ordered.map((a, i) => (
            <div key={a.href} className="contents">
              <ArticleCard a={a} priority={i < PRIORITY_CARDS} onOpen={() => trackOpen(a, i + 1)} />
              {i + 1 === MOBILE_AD_AFTER && i + 1 < ordered.length && <CardAd variant="mobile" />}
              {i + 1 === adAfter && i + 1 < ordered.length && <CardAd variant="desktop" />}
            </div>
          ))}
        </div>

        {ordered.length === 0 && (
          <p className="text-center text-[15px] text-[#b9ae94]">No articles found.</p>
        )}

        <footer className="mt-10 text-center text-[13px] leading-relaxed text-[#b9ae94]">
          <p className="mb-1.5">Educational content only, not investment advice.</p>
          <a href="https://financialgurkha.com" className="text-[#c6a15b]">
            financialgurkha.com
          </a>
        </footer>
      </div>
    </main>
  )
}
