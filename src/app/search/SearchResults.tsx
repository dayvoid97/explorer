'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { track } from '@/app/lib/analytics'
import { tokens } from '@/app/lib/search/engine'
import { useSearcher } from '@/app/lib/search/use-search'
import Highlighted from '@/app/components/search/Highlighted'
import { formatDay } from '@/app/components/search/NavSearch'
import SearchAd, { SEARCH_AD_AFTER, SEARCH_AD_MIN_RESULTS } from './SearchAd'

/** Full results page: /search?q=… Same fuzzy search as the nav box, with every match and a kind filter. */
export default function SearchResults() {
  const params = useSearchParams()
  const router = useRouter()
  const q = params.get('q') ?? ''
  const [query, setQuery] = useState(q)
  const [kind, setKind] = useState<'all' | 'news' | 'research'>('all')
  const { searcher, failed } = useSearcher(true)

  // Follow the URL when the nav search sends a new query
  useEffect(() => setQuery(q), [q])

  const results = useMemo(() => (searcher && q.trim() ? searcher(q, 50) : []), [searcher, q])
  const shown = kind === 'all' ? results : results.filter((r) => r.doc.kind === kind)
  const words = useMemo(() => tokens(q), [q])
  const count = (k: 'news' | 'research') => results.filter((r) => r.doc.kind === k).length

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    track('search', { search_term: query.trim(), source: 'search_page' })
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <form onSubmit={submit} className="relative" role="search">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-black/40" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news and research"
            aria-label="Search news and research"
            autoFocus={!q}
            className="h-14 w-full border-2 border-black bg-white pl-12 pr-4 text-[18px] focus:outline-none"
          />
        </form>

        {q ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-3">
            <p className="text-[14px]">
              {searcher ? (
                <>
                  <span className="font-bold">{results.length}</span> result{results.length === 1 ? '' : 's'} for “{q}”
                </>
              ) : failed ? (
                'Search is unavailable right now. Please try again.'
              ) : (
                'Searching…'
              )}
            </p>
            <div className="flex gap-2 text-[12px] font-semibold">
              {(['all', 'news', 'research'] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={`rounded-full border px-3 py-1 ${kind === k ? 'border-black bg-black text-white' : 'border-black/20 hover:border-black'}`}>
                  {k === 'all' ? `All ${results.length}` : k === 'news' ? `News ${count('news')}` : `Research ${count('research')}`}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <ol className="mt-2">
          {shown.map((r, i) => (
            <Fragment key={r.doc.id}>
              {/* Keyed by query: each new search is a navigation and gets its own ad */}
              {i === SEARCH_AD_AFTER && shown.length >= SEARCH_AD_MIN_RESULTS ? <SearchAd key={`ad-${q}`} /> : null}
              <li className="border-b border-black/10 py-5">
                <Link href={r.doc.url} className="group flex gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-black/50">
                      {r.doc.kind === 'news' ? 'News' : 'Research'} · {formatDay(r.doc.date)}
                    </p>
                    <h2 className="mt-1 text-[20px] font-bold leading-snug group-hover:underline">
                      <Highlighted text={r.doc.title} words={words} />
                    </h2>
                    <p className="mt-1 line-clamp-3 text-[15px] leading-relaxed text-black/65">
                      <Highlighted text={r.snippet} words={words} />
                    </p>
                  </div>
                  {r.doc.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.doc.image} alt="" loading="lazy" className="hidden h-24 w-36 shrink-0 object-cover sm:block" />
                  ) : null}
                </Link>
              </li>
            </Fragment>
          ))}
        </ol>

        {q && searcher && results.length === 0 ? (
          <p className="mt-8 text-[15px] text-black/60">
            Nothing matched “{q}”. Try fewer words, a company name or a ticker, or browse the <Link href="/news" className="underline">news</Link> and{' '}
            <Link href="/blog" className="underline">research</Link>.
          </p>
        ) : null}
      </div>
    </div>
  )
}
