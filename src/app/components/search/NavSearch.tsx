'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import { track } from '@/app/lib/analytics'
import { tokens } from '@/app/lib/search/engine'
import { useSearcher } from '@/app/lib/search/use-search'
import Highlighted from './Highlighted'

/**
 * Search box for the site navigation. Results appear as you type (fuzzy, so
 * typos still find the article); Enter opens the highlighted result or the full
 * results page. Press "/" anywhere to jump to it.
 *
 *   variant="desktop": inline in the nav bar
 *   variant="mobile":  a full-width box at the top of the mobile menu
 */
const LIMIT = 6

export const formatDay = (ymd: string) => {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

export default function NavSearch({ variant, onNavigate }: { variant: 'desktop' | 'mobile'; onNavigate?: () => void }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [active, setActive] = useState(false) // box focused or results open
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const { searcher, failed } = useSearcher(active)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 120)
    return () => clearTimeout(t)
  }, [query])

  const results = useMemo(() => (searcher && debounced.trim() ? searcher(debounced, LIMIT) : []), [searcher, debounced])
  const words = useMemo(() => tokens(debounced), [debounced])

  // "/" focuses the search box, like most news and developer sites
  useEffect(() => {
    if (variant !== 'desktop') return
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)
      if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [variant])

  // Close on outside click
  useEffect(() => {
    if (!active) return
    const onDown = (e: MouseEvent) => boxRef.current && !boxRef.current.contains(e.target as Node) && setActive(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [active])

  const close = () => {
    setActive(false)
    setCursor(-1)
    inputRef.current?.blur()
  }

  const go = (href: string) => {
    track('search', { search_term: query.trim(), results: results.length })
    close()
    setQuery('')
    onNavigate?.()
    router.push(href)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => Math.min(c + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => Math.max(c - 1, -1))
    } else if (e.key === 'Enter' && query.trim()) {
      e.preventDefault()
      go(cursor >= 0 && results[cursor] ? results[cursor].doc.url : `/search?q=${encodeURIComponent(query.trim())}`)
    } else if (e.key === 'Escape') {
      close()
    }
  }

  const showPanel = active && query.trim().length > 0
  const panel = showPanel ? (
    <div
      role="listbox"
      className={`absolute z-50 mt-2 overflow-hidden border border-black/15 bg-white text-left text-black shadow-2xl ${
        variant === 'desktop' ? 'right-0 w-[440px]' : 'left-0 right-0'
      }`}>
      {failed ? (
        <p className="px-4 py-4 text-[14px] text-black/60">Search is unavailable right now. Please try again.</p>
      ) : !searcher ? (
        <p className="px-4 py-4 text-[14px] text-black/60">Loading…</p>
      ) : results.length === 0 ? (
        <p className="px-4 py-4 text-[14px] text-black/60">No results for “{debounced}”.</p>
      ) : (
        <ul>
          {results.map((r, i) => (
            <li key={r.doc.id} role="option" aria-selected={i === cursor}>
              <Link
                href={r.doc.url}
                onClick={(e) => {
                  e.preventDefault()
                  go(r.doc.url)
                }}
                onMouseEnter={() => setCursor(i)}
                className={`block border-b border-black/10 px-4 py-3 ${i === cursor ? 'bg-black/5' : ''}`}>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/50">
                  {r.doc.kind === 'news' ? 'News' : 'Research'} · {formatDay(r.doc.date)}
                </p>
                <p className="mt-0.5 text-[15px] font-semibold leading-snug">
                  <Highlighted text={r.doc.title} words={words} />
                </p>
                <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-black/60">
                  <Highlighted text={r.snippet} words={words} />
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {query.trim() ? (
        <button
          type="button"
          onClick={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
          className="block w-full px-4 py-3 text-left text-[13px] font-semibold hover:bg-black/5">
          See all results for “{query.trim()}” →
        </button>
      ) : null}
    </div>
  ) : null

  const input = (
    <div className="relative flex items-center">
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-white/60" aria-hidden />
      <input
        ref={inputRef}
        type="search"
        value={query}
        placeholder="Search"
        aria-label="Search articles and news"
        autoComplete="off"
        onChange={(e) => {
          setQuery(e.target.value)
          setCursor(-1)
          setActive(true)
        }}
        onFocus={() => setActive(true)}
        onKeyDown={onKeyDown}
        className={`h-9 rounded-full border border-white/25 bg-white/10 pl-9 pr-3 text-[14px] text-white placeholder:text-white/50 focus:border-white focus:outline-none ${
          variant === 'desktop' ? 'w-52 transition-[width] focus:w-72' : 'w-full'
        }`}
      />
    </div>
  )

  if (variant === 'desktop') {
    return (
      <div ref={boxRef} className="relative hidden md:block">
        {input}
        {panel}
      </div>
    )
  }

  // In the mobile menu: a full-width box, results directly under it
  return (
    <div ref={boxRef} className="relative">
      {input}
      {panel}
    </div>
  )
}
