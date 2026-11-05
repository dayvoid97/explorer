import Fuse, { type IFuseOptions } from 'fuse.js'
import type { SearchDoc } from './index-data'

/**
 * Fuzzy search over the index, in the browser. Typos are forgiven ("inflaton",
 * "nvdia"), and multi-word queries rank pages matching more of the words first.
 */
export interface Result {
  doc: SearchDoc
  score: number // higher is better
  matched: number // how many query words matched
  snippet: string
}

const KEYS = [
  { name: 'title', weight: 0.45 },
  { name: 'tags', weight: 0.2 },
  { name: 'summary', weight: 0.2 },
  { name: 'body', weight: 0.15 },
]

const MIN_SCORE = 0.1

const STOP = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'is', 'are', 'was', 'what', 'how', 'why', 'with', 'by', 'at', 'it', 'its'])

export function tokens(query: string) {
  return query
    .toLowerCase()
    .split(/[^\p{L}\p{N}$%.&-]+/u)
    .map((t) => t.replace(/^[.-]+|[.-]+$/g, ''))
    .filter((t) => t.length >= 2 && !STOP.has(t))
    .slice(0, 8)
}

export function createSearcher(docs: SearchDoc[]) {
  const base: IFuseOptions<SearchDoc> = { keys: KEYS, includeScore: true, ignoreLocation: true, minMatchCharLength: 2 }
  // Short words must match exactly, or "fed" finds "feed" and "fee"; longer ones may be misspelled
  const strict = new Fuse(docs, { ...base, threshold: 0.05 })
  const fuzzy = new Fuse(docs, { ...base, threshold: 0.3 })

  return function search(query: string, limit = 20): Result[] {
    const words = tokens(query)
    if (!words.length) return []
    const totals = new Map<string, { doc: SearchDoc; sum: number; matched: number }>()
    for (const word of words) {
      for (const hit of (word.length <= 3 ? strict : fuzzy).search(word)) {
        const t = totals.get(hit.item.id) ?? { doc: hit.item, sum: 0, matched: 0 }
        t.sum += 1 - (hit.score ?? 1)
        t.matched += 1
        totals.set(hit.item.id, t)
      }
    }
    const phrase = query.trim().toLowerCase()
    return [...totals.values()]
      .map(({ doc, sum, matched }) => {
        let score = sum / words.length
        // The whole query in the headline is the strongest signal
        if (phrase.length > 3 && doc.title.toLowerCase().includes(phrase)) score += 0.5
        return { doc, score, matched, snippet: snippet(doc, words) }
      })
      // Faint matches deep in long bodies are noise ("bitcoin" in an article that never says it)
      .filter((r) => r.score >= MIN_SCORE)
      .sort((a, b) => b.matched - a.matched || b.score - a.score || b.doc.date.localeCompare(a.doc.date))
      .slice(0, limit)
  }
}

/** A short passage around the first query word that appears in the text, else the summary. */
function snippet(doc: SearchDoc, words: string[]) {
  const body = doc.body
  const lower = body.toLowerCase()
  const at = words.map((w) => lower.indexOf(w)).filter((i) => i >= 0).sort((a, b) => a - b)[0]
  if (at === undefined || doc.summary.toLowerCase().includes(words[0])) return doc.summary
  const start = Math.max(0, body.lastIndexOf(' ', Math.max(0, at - 70)))
  const end = body.indexOf(' ', Math.min(body.length, at + 150))
  return `${start > 0 ? '…' : ''}${body.slice(start, end < 0 ? undefined : end).trim()}${end > 0 && end < body.length ? '…' : ''}`
}

/** Splits text into plain and matched parts, for bolding the query words. */
export function highlight(text: string, words: string[]): { text: string; hit: boolean }[] {
  const exact = words.filter((w) => w.length >= 2)
  if (!exact.length) return [{ text, hit: false }]
  const re = new RegExp(`(${exact.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return text
    .split(re)
    .filter(Boolean)
    .map((part) => ({ text: part, hit: exact.includes(part.toLowerCase()) }))
}
