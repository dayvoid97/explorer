'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

/**
 * "Your Next Position" — interactive read-next widget at the end of every article.
 *
 * The reader places an "order" (picks a desk + a vintage), the house fills it
 * with a matching article — or routes them to the Street gallery. Styled as a
 * trading-desk order ticket: black, gold, monospace.
 */

export type NextOrderPost = {
  slug: string
  title: string
  subtitle: string
  date: string
  image?: string
  categories: string[]
}

const GOLD = '#C9A24B'

type DeskId = 'valuations' | 'macro' | 'commodities' | 'crypto' | 'street' | 'consult'

const DESKS: { id: DeskId; label: string; blurb: string; keywords: string[] }[] = [
  {
    id: 'valuations',
    label: 'Valuations Desk',
    blurb: 'DCFs, intrinsic value, deep dives',
    keywords: ['valuation', 'dcf', 'intrinsic'],
  },
  {
    id: 'macro',
    label: 'Macro Desk',
    blurb: 'The Fed, rates, the big picture',
    keywords: ['federal reserve', 'global economy', 'treasuries', 'wall street', 'united states'],
  },
  {
    id: 'commodities',
    label: 'Commodities Desk',
    blurb: 'Gold, oil, hard assets',
    keywords: ['gold', 'silver', 'commodities', 'precious metals', 'futures', 'oil'],
  },
  {
    id: 'crypto',
    label: 'Crypto Desk',
    blurb: 'Chains, tokens, the frontier',
    keywords: ['crypto', 'blockchain', 'dex', 'mon'],
  },
  {
    id: 'street',
    label: 'The Street',
    blurb: 'Photos from Wall St. — step outside',
    keywords: [],
  },
  {
    id: 'consult',
    label: 'The Corner Office',
    blurb: 'Book a meeting with Kanchan · commission a valuation',
    keywords: [],
  },
]

const VINTAGES = [
  { id: 'fresh', label: 'Fresh off the desk', blurb: 'Most recent filing' },
  { id: 'dealer', label: "Dealer's choice", blurb: 'Let the house pick' },
] as const

type VintageId = typeof VINTAGES[number]['id']

const FILL_LINES = ['ROUTING ORDER TO FLOOR…', 'CHECKING THE BOOKS…', 'ORDER MATCHED.']

function matchDesk(post: NextOrderPost, desk: typeof DESKS[number]) {
  const cats = post.categories?.map((c) => c.toLowerCase()) ?? []
  return desk.keywords.some((kw) => cats.some((c) => c.includes(kw)))
}

export default function NextOrder({
  posts,
  currentSlug,
}: {
  posts: NextOrderPost[]
  currentSlug: string
}) {
  const [step, setStep] = useState<'desk' | 'vintage' | 'filling' | 'filled'>('desk')
  const [desk, setDesk] = useState<typeof DESKS[number] | null>(null)
  const [fillLine, setFillLine] = useState(0)
  const [pick, setPick] = useState<NextOrderPost | null>(null)
  const [offDesk, setOffDesk] = useState(false) // true when desk was empty → dealer's choice
  const orderNo = useMemo(() => Math.floor(1000 + Math.random() * 9000), [])
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const universe = useMemo(() => posts.filter((p) => p.slug !== currentSlug), [posts, currentSlug])

  const placeOrder = (vintage: VintageId) => {
    if (!desk) return
    let pool = universe.filter((p) => matchDesk(p, desk))
    let off = false
    if (pool.length === 0) {
      pool = universe
      off = true
    }

    let chosen: NextOrderPost
    if (vintage === 'fresh') {
      chosen = [...pool].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    } else {
      chosen = pool[Math.floor(Math.random() * pool.length)]
    }

    setPick(chosen)
    setOffDesk(off)
    setStep('filling')
    setFillLine(0)
    FILL_LINES.forEach((_, i) => {
      timers.current.push(setTimeout(() => setFillLine(i), i * 450))
    })
    timers.current.push(setTimeout(() => setStep('filled'), FILL_LINES.length * 450 + 250))
  }

  const reset = () => {
    timers.current.forEach(clearTimeout)
    setStep('desk')
    setDesk(null)
    setPick(null)
    setOffDesk(false)
  }

  return (
    <section className="my-16 border border-white/15 bg-[#0A0A0A] text-white">
      {/* Ticket header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
          Financial Gurkha · Order Ticket
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: GOLD }}>
          FG-{orderNo}
        </p>
      </div>

      <div className="px-5 py-8 sm:px-8">
        {/* STEP 1 — pick a desk */}
        {step === 'desk' && (
          <div>
            <h3 className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
              Done reading? Let's play a game.
            </h3>
            <p className="mt-2 text-sm font-light text-white/60">
              Pick a desk. The House Fulfills.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {DESKS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    if (d.id === 'street') {
                      window.location.href = '/#from-the-street'
                      return
                    }
                    if (d.id === 'consult') {
                      window.location.href = '/consult'
                      return
                    }
                    setDesk(d)
                    setStep('vintage')
                  }}
                  className="group border border-white/15 px-4 py-4 text-left transition hover:border-[#C9A24B]"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.2em] transition group-hover:text-[#C9A24B]">
                    {d.label}
                  </p>
                  <p className="pt-1 text-xs font-light text-white/50">{d.blurb}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — pick a vintage */}
        {step === 'vintage' && desk && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: GOLD }}>
              {desk.label} · Selected
            </p>
            <h3 className="mt-3 text-2xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>
              How do you want it filled?
            </h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {VINTAGES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => placeOrder(v.id)}
                  className="group border border-white/15 px-4 py-4 text-left transition hover:border-[#C9A24B]"
                >
                  <p className="font-mono text-xs uppercase tracking-[0.2em] transition group-hover:text-[#C9A24B]">
                    {v.label}
                  </p>
                  <p className="pt-1 text-xs font-light text-white/50">{v.blurb}</p>
                </button>
              ))}
            </div>
            <button
              onClick={reset}
              className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 transition hover:text-white"
            >
              ← Change desk
            </button>
          </div>
        )}

        {/* STEP 3 — filling animation */}
        {step === 'filling' && (
          <div className="py-6">
            {FILL_LINES.slice(0, fillLine + 1).map((line, i) => (
              <p
                key={line}
                className="font-mono text-sm tracking-[0.15em]"
                style={{ color: i === FILL_LINES.length - 1 ? GOLD : 'rgba(255,255,255,0.5)' }}
              >
                <span className="text-white/30">{'>'}</span> {line}
              </p>
            ))}
          </div>
        )}

        {/* STEP 4 — order filled */}
        {step === 'filled' && pick && (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: GOLD }}>
              Order Filled{offDesk ? ' · Desk was quiet — dealer stepped in' : ''}
            </p>
            <Link
              href={`/blog/${pick.slug}`}
              className="group mt-5 grid gap-6 sm:grid-cols-[200px_1fr]"
            >
              {pick.image && (
                <div className="aspect-[16/10] overflow-hidden bg-white/5 sm:aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pick.image}
                    alt={pick.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
              )}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                  {pick.date}
                </p>
                <h4
                  className="pt-2 text-xl font-bold leading-snug group-hover:underline decoration-1 underline-offset-4"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {pick.title}
                </h4>
                <p className="line-clamp-2 pt-2 text-sm font-light text-white/60">
                  {pick.subtitle}
                </p>
                <p
                  className="pt-4 font-mono text-xs uppercase tracking-[0.25em]"
                  style={{ color: GOLD }}
                >
                  Execute →
                </p>
              </div>
            </Link>
            <button
              onClick={reset}
              className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 transition hover:text-white"
            >
              ← Cancel · place a new order
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
