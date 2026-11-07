import {
  US_INDEXES,
  WORLD_INDEXES,
  parseEcbXml,
  parseIndexQuotes,
  parseNyFed,
  parseFredCsv,
  parseFredJson,
  TREASURY_SERIES,
  type Quote,
} from './parse'

export type { Quote } from './parse'

/**
 * Market data for the homepage strip and panel.
 *
 * Rates and currencies come from official public sources that need no key:
 * Treasury yields via FRED (St. Louis Fed), New York Fed (reference rates) and the ECB
 * (euro reference rates). Index levels are licensed data, so they need a
 * provider key: FMP_API_KEY (Financial Modeling Prep). Without it, the index
 * groups are simply left out.
 *
 * Each source is cached for 10 minutes and fails independently.
 */
export interface MarketGroup {
  id: 'rates' | 'us' | 'world' | 'fx'
  label: string
  quotes: Quote[]
}

export interface MarketData {
  groups: MarketGroup[]
  fedTarget: { from: number; to: number; asOf: string } | null
}

const REVALIDATE = 600

async function get(url: string, as: 'text' | 'json') {
  try {
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'FinancialGurkha/1.0 (+https://financialgurkha.com)' },
    })
    if (!res.ok) return null
    return as === 'json' ? await res.json() : await res.text()
  } catch {
    return null
  }
}

// Treasury yields from FRED rather than treasury.gov: home.treasury.gov takes
// about 17 seconds to answer, past the 8-second timeout, so the yields never
// showed. FRED answers in well under a second. Its figures run about one
// business day behind Treasury's evening release.
//
// With a key, the documented FRED API; without one, FRED's public CSV download.
// The key is read only here, on the server. FRED_API_KEY is preferred: a
// NEXT_PUBLIC_ variable would be bundled into the browser if client code ever
// read it.
const FRED_KEY = process.env.FRED_API_KEY || process.env.NEXT_PUBLIC_FRED_API_KEY

async function treasury(): Promise<Quote[]> {
  // Three weeks back always holds at least two trading days, even over holidays
  const since = new Date(Date.now() - 21 * 86_400_000).toISOString().slice(0, 10)
  const results = await Promise.all(
    TREASURY_SERIES.map(async (s) => {
      if (FRED_KEY) {
        const json = await get(
          `https://api.stlouisfed.org/fred/series/observations?series_id=${s.series}&api_key=${FRED_KEY}&file_type=json&sort_order=desc&observation_start=${since}`,
          'json'
        )
        const quotes = parseFredJson(json, s)
        if (quotes.length) return quotes
      }
      const csv = await get(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${s.series}&cosd=${since}`, 'text')
      return parseFredCsv((csv as string | null) ?? '', s)
    })
  )
  return results.flat()
}

async function indexes(): Promise<Quote[]> {
  const key = process.env.FMP_API_KEY
  if (!key) return []
  const json = await get(`https://financialmodelingprep.com/stable/batch-index-quotes?apikey=${key}`, 'json')
  return parseIndexQuotes(json, [...US_INDEXES, ...WORLD_INDEXES])
}

export async function getMarkets(): Promise<MarketData> {
  const [ust, nyfed, ecb, idx] = await Promise.all([
    treasury(),
    get('https://markets.newyorkfed.org/api/rates/all/latest.json', 'json').then(parseNyFed),
    get('https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml', 'text').then((x) => parseEcbXml((x as string | null) ?? '')),
    indexes(),
  ])
  const usIds = new Set(US_INDEXES.map((i) => i.id))
  const groups: MarketGroup[] = [
    { id: 'us', label: 'U.S. Indexes', quotes: idx.filter((q) => usIds.has(q.id)) },
    { id: 'rates', label: 'Rates', quotes: [...nyfed.quotes, ...ust] },
    { id: 'world', label: 'World Indexes', quotes: idx.filter((q) => !usIds.has(q.id)) },
    { id: 'fx', label: 'Currencies', quotes: ecb },
  ]
  return { groups: groups.filter((g) => g.quotes.length), fedTarget: nyfed.targetRange }
}
