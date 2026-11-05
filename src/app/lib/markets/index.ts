import {
  US_INDEXES,
  WORLD_INDEXES,
  parseEcbXml,
  parseIndexQuotes,
  parseNyFed,
  parseTreasuryCsv,
  type Quote,
} from './parse'

export type { Quote } from './parse'

/**
 * Market data for the homepage strip and panel.
 *
 * Rates and currencies come from official public sources that need no key:
 * U.S. Treasury (par yield curve), New York Fed (reference rates) and the ECB
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

async function treasury(): Promise<Quote[]> {
  const year = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric' }).format(new Date()))
  const url = (y: number) =>
    `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/${y}/all?type=daily_treasury_yield_curve&field_tdr_date_value=${y}&page&_format=csv`
  const quotes = parseTreasuryCsv(((await get(url(year), 'text')) as string | null) ?? '')
  // In the first days of January the new year's file may still be empty
  return quotes.length ? quotes : parseTreasuryCsv(((await get(url(year - 1), 'text')) as string | null) ?? '')
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
