'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAdSlot } from '@/app/hooks/useAdSlot'
import { AdLabel } from '@/app/components/AdLabel'
import { resolveCoverImage } from '@/app/lib/cover-image'
import { track } from '@/app/lib/analytics'

export interface LinkArticle {
  title: string
  href: string
  image: string
  ts: number
  dateLabel: string
  kind: string
}

type SortMode = 'newest' | 'oldest' | 'surprise'

// Loaded once with next/font in ./layout.tsx and exposed as a CSS variable.
const SERIF = "var(--font-links-serif), Georgia, 'Times New Roman', serif"

/*
 * Grid shape
 *
 * Phones: three columns of 9:16 portrait cards, Instagram-style. On a typical
 * 360–430px phone a column is ~107–130px wide, so a card is ~190–230px tall
 * (about 200px on the common 375–390px widths).
 *
 * md and up: fixed 250×250 square cards, as many per row as fit, centred.
 *
 * Ads go after every 12 cards: 4 full rows of 3 on phones, 3 full rows of 4 on
 * a desktop, so an ad never leaves a half-empty row above it.
 */
const CARDS_PER_AD = 12
// Roughly the first two rows on a phone; these load with high priority.
const PRIORITY_CARDS = 6

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Full-width in-article ad row — same unit as on the article pages. */
function LinksAdRow({ position }: { position: string }) {
  const { ref, shouldRender } = useAdSlot(position)
  return (
    <div ref={ref} className="ad-slot col-span-full my-1">
      <AdLabel align="right" />
      <div className="min-h-[60px]">
        {shouldRender && (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-layout="in-article"
            data-ad-format="fluid"
            data-ad-client="ca-pub-8441965953327461"
            data-ad-slot="9398911626"
          />
        )}
      </div>
    </div>
  )
}

/**
 * Branded cover drawn in CSS for posts with no image, or whose image failed.
 * No network request, and it stays sharp at any size. The title itself comes
 * from the card overlay, so it is not repeated here.
 */
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
      <span className="text-[8px] uppercase tracking-[0.2em] text-[#c6a15b] md:text-[10px]">{kind}</span>
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
        {/* Ambient fill so the tile stays full-bleed around an uncropped cover.
            A ~32px copy is enough once blurred: a couple of KB, not a second
            full download. */}
        <Image
          src={img.src}
          alt=""
          aria-hidden
          fill
          sizes="32px"
          quality={30}
          unoptimized={!img.optimize}
          className="scale-110 object-cover opacity-50 blur-xl"
        />
        {/* The whole cover, uncropped, at the card's display size. */}
        <Image
          src={img.src}
          alt={a.title}
          fill
          sizes="(min-width: 768px) 250px, 34vw"
          quality={72}
          priority={priority}
          unoptimized={!img.optimize}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`object-contain transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    </div>
  )
}

/*
 * Card layout: almost every cover is a landscape image (about 16:9). Dropped
 * into a 9:16 or square tile on its own, it shrinks to a strip with dead space
 * above and below. So the cover takes a landscape slot at the top, and the
 * headline fills the rest of the tile beneath it, where it has room to be read.
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
      className="group flex aspect-[9/16] flex-col overflow-hidden rounded-md bg-[#141414] ring-1 ring-[rgba(198,161,91,0.18)] transition hover:ring-[rgba(198,161,91,0.5)] md:aspect-square md:rounded-xl"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden">
        <CardImage a={a} priority={priority} />
      </div>
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-1 p-2 md:p-3">
        <p
          style={{ fontFamily: SERIF }}
          className="line-clamp-6 text-[11px] font-semibold leading-tight text-[#f3ead2] md:line-clamp-3 md:text-[14px] md:leading-snug"
        >
          {a.title}
        </p>
        <p className="truncate text-[8px] uppercase tracking-[0.12em] text-[#c6a15b] md:text-[10px]">
          {a.kind}
          {a.dateLabel ? ` · ${a.dateLabel}` : ''}
        </p>
      </div>
    </a>
  )
}

export default function LinksGrid({ articles }: { articles: LinkArticle[] }) {
  const [mode, setMode] = useState<SortMode>('newest')
  const [seed, setSeed] = useState(0)

  // Instagram attribution. Each reel's bio link points here with UTM tags, e.g.
  // /links?utm_source=instagram&utm_content=<post-id>. Every card click records
  // which article was opened, where it sat in the grid, and which post the
  // reader came from, so we can see which posts turn into readers.
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

  const blocks: LinkArticle[][] = []
  for (let i = 0; i < ordered.length; i += CARDS_PER_AD) {
    blocks.push(ordered.slice(i, i + CARDS_PER_AD))
  }

  const pick = (m: SortMode) => {
    if (m === 'surprise') setSeed((s) => s + 1)
    setMode(m)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const btn = (active: boolean): React.CSSProperties => ({
    padding: '9px 16px',
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.04em',
    border: '1px solid rgba(198,161,91,0.5)',
    backgroundColor: active ? '#c6a15b' : 'transparent',
    color: active ? '#0b0b0b' : '#f3ead2',
    cursor: 'hand',
  })

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
      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '40px 16px 56px' }}>
        <header style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              lineHeight: 1.2,
            }}
          >
            Financial Gurkha
          </div>
          <div
            style={{
              width: 64,
              height: 2,
              backgroundColor: '#c6a15b',
              margin: '14px auto 12px',
            }}
          />
          <div style={{ color: '#c6a15b', fontSize: 14, letterSpacing: '0.08em' }}>
            @financialgurkha
          </div>
          <p
            style={{
              color: '#b9ae94',
              fontSize: 15,
              lineHeight: 1.55,
              marginTop: 14,
              maxWidth: 560,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Equity valuations, macro analysis, and market coverage — researched, written, and filed
            from Wall Street, New York.
          </p>
        </header>

        <div
          style={{
            display: 'flex',
            gap: 10,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 26,
          }}
          role="group"
          aria-label="Sort articles"
        >
          <button
            style={btn(mode === 'newest')}
            onClick={() => pick('newest')}
            aria-pressed={mode === 'newest'}
          >
            Newest first
          </button>
          <button
            style={btn(mode === 'oldest')}
            onClick={() => pick('oldest')}
            aria-pressed={mode === 'oldest'}
          >
            Oldest first
          </button>
          <button
            style={btn(mode === 'surprise')}
            onClick={() => pick('surprise')}
            aria-pressed={mode === 'surprise'}
            title="Shuffle the grid"
          >
            🎲 Surprise me
          </button>
        </div>

        <div className="grid grid-cols-3 gap-1 sm:gap-2 md:justify-center md:gap-4 md:[grid-template-columns:repeat(auto-fill,250px)]">
          {blocks.map((block, bi) => (
            <div key={bi} className="contents">
              {block.map((a, i) => (
                <ArticleCard
                  key={a.href}
                  a={a}
                  priority={bi * CARDS_PER_AD + i < PRIORITY_CARDS}
                  onOpen={() => trackOpen(a, bi * CARDS_PER_AD + i + 1)}
                />
              ))}
              {bi < blocks.length - 1 && <LinksAdRow position={`links-grid-block-${bi}`} />}
            </div>
          ))}
        </div>

        {ordered.length === 0 && (
          <p style={{ color: '#b9ae94', fontSize: 15, textAlign: 'center' }}>No articles found.</p>
        )}

        <footer
          style={{
            textAlign: 'center',
            marginTop: 40,
            color: '#b9ae94',
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: '0 0 6px' }}>Educational content only, not investment advice.</p>
          <a href="https://financialgurkha.com" style={{ color: '#c6a15b' }}>
            financialgurkha.com
          </a>
        </footer>
      </div>
    </main>
  )
}
