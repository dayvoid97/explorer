'use client'

import { useEffect, useState } from 'react'
import { createSearcher, type Result } from './engine'
import type { SearchDoc } from './index-data'

/**
 * Loads the search index once per visit (on first use, not on page load) and
 * returns a search function. Shared by the nav search box and /search.
 */
type Searcher = (query: string, limit?: number) => Result[]

let loading: Promise<Searcher> | null = null

export function loadSearcher(): Promise<Searcher> {
  loading ??= fetch('/api/search-index')
    .then((r) => (r.ok ? (r.json() as Promise<SearchDoc[]>) : Promise.reject(new Error(`search index ${r.status}`))))
    .then(createSearcher)
    .catch((error) => {
      loading = null // allow a retry on the next keystroke
      throw error
    })
  return loading
}

/** `enabled` delays the index download until the reader shows intent (focus, or a query in the URL). */
export function useSearcher(enabled: boolean) {
  const [searcher, setSearcher] = useState<Searcher | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (!enabled || searcher) return
    let live = true
    loadSearcher()
      .then((s) => live && setSearcher(() => s))
      .catch(() => live && setFailed(true))
    return () => {
      live = false
    }
  }, [enabled, searcher])
  return { searcher, failed }
}
