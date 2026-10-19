'use client'

import { useMemo, useState } from 'react'
import { useAdSlot } from '@/app/hooks/useAdSlot'
import { AdLabel } from '@/app/components/AdLabel'

export interface LinkArticle {
  title: string
  href: string
  image: string
  ts: number
  dateLabel: string
  kind: string
}

type SortMode = 'newest' | 'oldest' | 'surprise'

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif"

/** Two big 9:16 portrait cards per row, every screen size. */

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
    <div ref={ref} className="ad-slot col-span-full -my-1">
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

function ArticleCard({ a }: { a: LinkArticle }) {
  return (
    <a
      href={a.href}
      className="group relative block overflow-hidden rounded-xl bg-[#161616] ring-1 ring-[rgba(198,161,91,0.18)]"
    >
      <div className="aspect-[9/16] overflow-hidden">
        {a.image ? (
          <img
            src={a.image}
            alt={a.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#0e1a33] p-4 text-center">
            <span
              style={{ fontFamily: SERIF }}
              className="text-sm font-semibold text-[#f3ead2]"
            >
              {a.title}
            </span>
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-4 pt-16">
        <p className="text-[15px] font-semibold leading-snug text-white">
          {a.title}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-[#c6a15b]">
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

  const ordered = useMemo(() => {
    if (mode === 'oldest') return [...articles].sort((x, y) => x.ts - y.ts)
    if (mode === 'surprise') return shuffle(articles)
    return articles // newest first — pre-sorted server-side
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articles, mode, seed])

  const perBlock = 2 * 4 // 2 cols, one ad after every 4 rows
  const blocks: LinkArticle[][] = []
  for (let i = 0; i < ordered.length; i += perBlock) {
    blocks.push(ordered.slice(i, i + perBlock))
  }

  const surprise = () => {
    setMode('surprise')
    setSeed((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const btn = (active: boolean): React.CSSProperties => ({
    padding: '9px 16px',
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: '0.04em',
    border: '1px solid rgba(198,161,91,0.5)',
    backgroundColor: active ? '#c6a15b' : 'transparent',
    color: active ? '#0b0b0b' : '#f3ead2',
    cursor: 'pointer',
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
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap"
      />
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
            This is our Instagram grid, on our own site. Tap any card to read
            the full story.
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
            onClick={() => setMode('newest')}
            aria-pressed={mode === 'newest'}
          >
            Newest first
          </button>
          <button
            style={btn(mode === 'oldest')}
            onClick={() => setMode('oldest')}
            aria-pressed={mode === 'oldest'}
          >
            Oldest first
          </button>
          <button
            style={btn(mode === 'surprise')}
            onClick={surprise}
            aria-pressed={mode === 'surprise'}
            title="Shuffle the grid"
          >
            🎲 Surprise me
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5">
          {blocks.map((block, bi) => (
            <div key={bi} className="contents">
              {block.map((a) => (
                <ArticleCard key={a.href} a={a} />
              ))}
              {bi < blocks.length - 1 && (
                <LinksAdRow position={`links-grid-block-${bi}`} />
              )}
            </div>
          ))}
        </div>

        {ordered.length === 0 && (
          <p style={{ color: '#b9ae94', fontSize: 15, textAlign: 'center' }}>
            No articles found.
          </p>
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
          <p style={{ margin: '0 0 6px' }}>
            Educational content only, not investment advice.
          </p>
          <a href="https://financialgurkha.com" style={{ color: '#c6a15b' }}>
            financialgurkha.com
          </a>
        </footer>
      </div>
    </main>
  )
}
