import type { Quote } from './parse'

/** Display helpers shared by the market strip (client) and the markets panel (server). */
export function formatValue(q: Quote) {
  const n = q.value.toLocaleString('en-US', { minimumFractionDigits: q.digits, maximumFractionDigits: q.digits })
  return q.kind === 'rate' ? `${n}%` : n
}

/** Rates move in basis points; indexes and currencies in percent. */
export function formatChange(q: Quote) {
  if (q.change === null) return null
  const up = q.change > 0
  const flat = q.kind === 'rate' ? Math.round(q.change * 100) === 0 : Math.abs(q.change) < 0.005
  const arrow = flat ? '' : up ? '▲' : '▼'
  const text =
    q.kind === 'rate'
      ? `${Math.abs(Math.round(q.change * 100))} bp`
      : `${Math.abs(q.change).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
  return { arrow, text: flat ? (q.kind === 'rate' ? '0 bp' : '0.00%') : text, direction: flat ? 'flat' : up ? 'up' : 'down' }
}

export function formatAsOf(iso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}
