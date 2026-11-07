'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { MarketData, MarketGroup } from '@/app/lib/markets'
import { MARKET_DATA_HREF } from '@/app/lib/data-sources'
import { formatChange, formatValue } from '@/app/lib/markets/format'
import MarketClock from './MarketClock'

/**
 * The black market strip under the navigation: one group of quotes scrolling at
 * a time, with a chevron menu to switch between rates, U.S. indexes, world
 * indexes and currencies. Refreshes itself every five minutes while open.
 */
const REFRESH_MS = 5 * 60 * 1000

function Item({ q }: { q: MarketGroup['quotes'][number] }) {
  const change = formatChange(q)
  return (
    <span className="inline-flex items-baseline gap-2 px-5">
      <span className="font-semibold text-white">{q.label}</span>
      <span className="tabular-nums text-white">{formatValue(q)}</span>
      {change ? (
        <span className="tabular-nums text-white/60">
          {change.arrow} {change.text}
        </span>
      ) : null}
    </span>
  )
}

export default function MarketStrip({ initial }: { initial: MarketData }) {
  const [data, setData] = useState(initial)
  const [groupId, setGroupId] = useState<MarketGroup['id'] | null>(initial.groups[0]?.id ?? null)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch('/api/markets')
        if (res.ok) setData(await res.json())
      } catch {}
    }, REFRESH_MS)
    return () => clearInterval(id)
  }, [])

  // Close the menu on outside click or Escape
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) =>
      menuRef.current && !menuRef.current.contains(e.target as Node) && setOpen(false)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const group = data.groups.find((g) => g.id === groupId) ?? data.groups[0]
  // Longer lists scroll for longer, so every group moves at the same speed
  const seconds = Math.max(25, (group?.quotes.length ?? 0) * 6)

  return (
    <div className="border-b border-white/15 bg-black text-[13px] text-white">
      <style>{`
        @keyframes fg-marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .fg-marquee { animation: fg-marquee var(--fg-marquee-s) linear infinite; }
        .fg-marquee-wrap:hover .fg-marquee { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .fg-marquee { animation: none; } .fg-marquee-wrap { overflow-x: auto; } }
      `}</style>
      <div className="mx-auto flex h-11 max-w-[1400px] items-stretch">
        <div
          ref={menuRef}
          className="relative flex shrink-0 items-stretch border-r border-white/15"
        >
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex items-center gap-2 px-4 text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-white/10"
            disabled={!group}
          >
            {group?.label ?? 'Markets'}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              aria-hidden
              className={`transition-transform ${open ? 'rotate-180' : ''}`}
            >
              <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
          {open ? (
            <ul
              role="listbox"
              aria-label="Market data"
              className="absolute left-0 top-full z-50 min-w-[200px] border border-white/20 bg-black py-1 shadow-xl"
            >
              {data.groups.map((g) => (
                <li key={g.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={g.id === group?.id}
                    onClick={() => {
                      setGroupId(g.id)
                      setOpen(false)
                    }}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[12px] font-semibold uppercase tracking-[0.12em] hover:bg-white/10 ${
                      g.id === group?.id ? 'text-white' : 'text-white/60'
                    }`}
                  >
                    {g.label}
                    <span className="text-[11px] tabular-nums text-white/40">
                      {g.quotes.length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div
          className="fg-marquee-wrap relative flex-1 overflow-hidden"
          aria-label={group ? `${group.label} quotes` : undefined}
        >
          {group ? (
            <div
              key={group.id}
              className="fg-marquee flex h-full w-max items-center"
              style={{ ['--fg-marquee-s' as string]: `${seconds}s` }}
            >
              {/* Two copies make the loop seamless; the second is hidden from screen readers */}
              {[0, 1].map((copy) => (
                <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
                  {group.id === 'rates' && data.fedTarget ? (
                    <span className="inline-flex items-baseline gap-2 px-5">
                      <span className="font-semibold">Fed Target</span>
                      <span className="tabular-nums">
                        {data.fedTarget.from.toFixed(2)}–{data.fedTarget.to.toFixed(2)}%
                      </span>
                    </span>
                  ) : null}
                  {group.quotes.map((q) => (
                    <Item key={q.id} q={q} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="flex h-full items-center px-5 text-white/50">Market data is updating.</p>
          )}
        </div>

        <Link
          href={MARKET_DATA_HREF}
          aria-label="Market data is delayed, not real-time. Where our data comes from"
          title="Delayed data, not real-time. Where our data comes from"
          className="flex shrink-0 items-center gap-1.5 border-l border-white/15 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60 hover:text-white"
        >
          <span aria-hidden>ⓘ</span>
          <span className="hidden sm:inline">Delayed</span>
        </Link>

        <div className="hidden shrink-0 items-center border-l border-white/15 px-4 text-[12px] md:flex">
          <MarketClock />
        </div>
      </div>
    </div>
  )
}
