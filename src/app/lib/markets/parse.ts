/**
 * Parsers for the homepage market data. Pure functions, no network: each takes a
 * source's raw response and returns quotes, or [] if the shape isn't recognised,
 * so one source changing its format never breaks the page.
 */
export interface Quote {
  id: string
  label: string
  value: number
  /** Change since the previous reading: percentage points for rates (shown in bp), percent otherwise */
  change: number | null
  kind: 'rate' | 'index' | 'fx'
  asOf: string // YYYY-MM-DD
  digits: number
}

const num = (v: unknown) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

/* ---------- U.S. Treasury constant-maturity yields, via FRED (CSV) ---------- */

/** FRED series for the Treasury yields shown. FRED republishes the Fed's H.15 release. */
export const TREASURY_SERIES = [
  { series: 'DGS3MO', id: 'ust3m', label: 'U.S. 3-Month' },
  { series: 'DGS2', id: 'ust2y', label: 'U.S. 2-Year' },
  { series: 'DGS10', id: 'ust10y', label: 'U.S. 10-Year' },
  { series: 'DGS30', id: 'ust30y', label: 'U.S. 30-Year' },
]

type FredSeries = (typeof TREASURY_SERIES)[number]

/** FRED API observations ({ observations: [{ date, value }] }); holidays are "." and are skipped. */
export function parseFredJson(json: unknown, s: FredSeries): Quote[] {
  const obs = (json as { observations?: { date?: string; value?: string }[] })?.observations ?? []
  return fredQuote(
    obs.map((o) => ({ date: o?.date ?? '', value: num(o?.value) })),
    s
  )
}

/** The keyless FRED download ("observation_date,DGS10" then one row a day); holidays are blank. */
export function parseFredCsv(csv: string, s: FredSeries): Quote[] {
  return fredQuote(
    csv
      .trim()
      .split(/\r?\n/)
      .slice(1)
      .map((line) => line.split(','))
      .map(([date, v]) => ({ date: date?.trim() ?? '', value: num(v) })),
    s
  )
}

function fredQuote(observations: { date: string; value: number | null }[], s: FredSeries): Quote[] {
  const rows = observations
    .filter((r): r is { date: string; value: number } => /^\d{4}-\d{2}-\d{2}$/.test(r.date) && r.value !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
  if (!rows.length) return []
  const [latest, previous] = rows
  return [
    {
      id: s.id,
      label: s.label,
      value: latest.value,
      change: previous ? latest.value - previous.value : null,
      kind: 'rate',
      asOf: latest.date,
      digits: 2,
    },
  ]
}

/* ---------- New York Fed reference rates (JSON) ---------- */

interface NyFedRate {
  type?: string
  effectiveDate?: string
  percentRate?: number
  targetRateFrom?: number | null
  targetRateTo?: number | null
}

export function parseNyFed(json: unknown): { quotes: Quote[]; targetRange: { from: number; to: number; asOf: string } | null } {
  const rates = ((json as { refRates?: NyFedRate[] })?.refRates ?? []).filter((r) => r && typeof r === 'object')
  const find = (type: string) => rates.find((r) => r.type?.toUpperCase() === type)
  const quotes: Quote[] = []
  for (const [type, label] of [
    ['EFFR', 'Fed Funds Eff.'],
    ['SOFR', 'SOFR'],
  ] as const) {
    const r = find(type)
    const value = num(r?.percentRate)
    if (r && value !== null) quotes.push({ id: type.toLowerCase(), label, value, change: null, kind: 'rate', asOf: r.effectiveDate ?? '', digits: 2 })
  }
  const effr = find('EFFR')
  const from = num(effr?.targetRateFrom)
  const to = num(effr?.targetRateTo)
  return { quotes, targetRange: from !== null && to !== null ? { from, to, asOf: effr?.effectiveDate ?? '' } : null }
}

/* ---------- ECB euro reference rates, last 90 days (XML) ---------- */

/** Dollar crosses from the ECB's euro-based rates. */
const FX = [
  { id: 'eurusd', label: 'EUR/USD', calc: (r: Record<string, number>) => r.USD, digits: 4 },
  { id: 'gbpusd', label: 'GBP/USD', calc: (r: Record<string, number>) => r.USD / r.GBP, digits: 4 },
  { id: 'usdjpy', label: 'USD/JPY', calc: (r: Record<string, number>) => r.JPY / r.USD, digits: 2 },
  { id: 'usdcny', label: 'USD/CNY', calc: (r: Record<string, number>) => r.CNY / r.USD, digits: 4 },
  { id: 'usdinr', label: 'USD/INR', calc: (r: Record<string, number>) => r.INR / r.USD, digits: 2 },
  { id: 'usdcad', label: 'USD/CAD', calc: (r: Record<string, number>) => r.CAD / r.USD, digits: 4 },
  { id: 'usdchf', label: 'USD/CHF', calc: (r: Record<string, number>) => r.CHF / r.USD, digits: 4 },
]

export function parseEcbXml(xml: string): Quote[] {
  const days = [...xml.matchAll(/<Cube\s+time=['"](\d{4}-\d{2}-\d{2})['"]\s*>([\s\S]*?)<\/Cube>/g)]
    .map(([, date, body]) => ({
      date,
      rates: Object.fromEntries([...body.matchAll(/currency=['"]([A-Z]{3})['"]\s+rate=['"]([\d.]+)['"]/g)].map(([, c, r]) => [c, parseFloat(r)])),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
  if (!days.length) return []
  const [latest, previous] = days
  return FX.flatMap((f) => {
    const value = f.calc(latest.rates)
    if (!Number.isFinite(value)) return []
    const prior = previous ? f.calc(previous.rates) : NaN
    return [{ id: f.id, label: f.label, value, change: Number.isFinite(prior) ? ((value - prior) / prior) * 100 : null, kind: 'fx' as const, asOf: latest.date, digits: f.digits }]
  })
}

/* ---------- Index quotes (Financial Modeling Prep, JSON array) ---------- */

export const US_INDEXES = [
  { symbol: '^GSPC', id: 'spx', label: 'S&P 500' },
  { symbol: '^DJI', id: 'dji', label: 'Dow Jones' },
  { symbol: '^IXIC', id: 'ixic', label: 'Nasdaq' },
  { symbol: '^NDX', id: 'ndx', label: 'Nasdaq 100' },
  { symbol: '^RUT', id: 'rut', label: 'Russell 2000' },
  { symbol: '^VIX', id: 'vix', label: 'VIX' },
]
export const WORLD_INDEXES = [
  { symbol: '^FTSE', id: 'ftse', label: 'FTSE 100' },
  { symbol: '^GDAXI', id: 'dax', label: 'DAX' },
  { symbol: '^FCHI', id: 'cac', label: 'CAC 40' },
  { symbol: '^STOXX50E', id: 'sx5e', label: 'Euro Stoxx 50' },
  { symbol: '^N225', id: 'n225', label: 'Nikkei 225' },
  { symbol: '^HSI', id: 'hsi', label: 'Hang Seng' },
  { symbol: '000001.SS', id: 'shcomp', label: 'Shanghai' },
  { symbol: '^BSESN', id: 'sensex', label: 'Sensex' },
  { symbol: '^NSEI', id: 'nifty', label: 'Nifty 50' },
  { symbol: '^KS11', id: 'kospi', label: 'KOSPI' },
]

interface IndexQuote {
  symbol?: string
  price?: number
  change?: number
  changePercentage?: number
  changesPercentage?: number
  previousClose?: number
  timestamp?: number
}

export function parseIndexQuotes(json: unknown, wanted: typeof US_INDEXES): Quote[] {
  if (!Array.isArray(json)) return []
  const bySymbol = new Map((json as IndexQuote[]).filter((q) => q?.symbol).map((q) => [q.symbol!.toUpperCase(), q]))
  return wanted.flatMap((w) => {
    const q = bySymbol.get(w.symbol.toUpperCase())
    const value = num(q?.price)
    if (!q || value === null) return []
    let change = num(q.changePercentage ?? q.changesPercentage)
    if (change === null) {
      const prev = num(q.previousClose) ?? (num(q.change) !== null ? value - num(q.change)! : null)
      change = prev ? ((value - prev) / prev) * 100 : null
    }
    const asOf = q.timestamp ? new Date(q.timestamp * 1000).toISOString().slice(0, 10) : ''
    return [{ id: w.id, label: w.label, value, change, kind: 'index' as const, asOf, digits: 2 }]
  })
}
