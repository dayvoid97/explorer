import type { MarketData } from '@/app/lib/markets'
import { formatAsOf, formatChange, formatValue } from '@/app/lib/markets/format'
import MarketsAd from './MarketsAd'

// The ad takes the columns the data doesn't: beside two or three groups, or a full row under four
const AD_SPAN = { 1: 'lg:col-span-3', 2: 'lg:col-span-2', 3: 'lg:col-span-1', 4: 'lg:col-span-4' } as const

/** All four market groups as compact tables, with dates and sources shown. */
export default function MarketsPanel({ data }: { data: MarketData }) {
  if (!data.groups.length) return null
  const hasIndexes = data.groups.some((g) => g.id === 'us' || g.id === 'world')
  return (
    <section aria-labelledby="markets-heading" className="border-t-2 border-black pt-4">
      <h2 id="markets-heading" className="text-[13px] font-black uppercase tracking-[0.16em]">
        Markets
      </h2>
      <div className="mt-4 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {data.groups.map((g) => {
          const asOf = formatAsOf(g.quotes.find((q) => q.asOf)?.asOf ?? '')
          return (
            <div key={g.id}>
              <div className="flex items-baseline justify-between border-b border-black pb-1.5">
                <h3 className="text-[12px] font-bold uppercase tracking-[0.12em]">{g.label}</h3>
                {asOf ? <span className="text-[11px] text-black/50">{asOf}</span> : null}
              </div>
              <table className="w-full text-[14px]">
                <tbody>
                  {g.id === 'rates' && data.fedTarget ? (
                    <tr className="border-b border-black/10">
                      <th scope="row" className="py-2 pr-2 text-left font-semibold">
                        Fed Target
                      </th>
                      <td className="whitespace-nowrap py-2 text-right tabular-nums">
                        {data.fedTarget.from.toFixed(2)}–{data.fedTarget.to.toFixed(2)}%
                      </td>
                      <td />
                    </tr>
                  ) : null}
                  {g.quotes.map((q) => {
                    const change = formatChange(q)
                    return (
                      <tr key={q.id} className="border-b border-black/10">
                        <th scope="row" className="py-2 pr-2 text-left font-semibold">
                          {q.label}
                        </th>
                        <td className="whitespace-nowrap py-2 text-right tabular-nums">{formatValue(q)}</td>
                        <td className="w-[76px] whitespace-nowrap py-2 pl-2 text-right tabular-nums text-black/60">
                          {change ? `${change.arrow} ${change.text}` : ''}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
        <div className={`sm:col-span-2 ${AD_SPAN[Math.min(data.groups.length, 4) as 1 | 2 | 3 | 4]}`}>
          <MarketsAd />
        </div>
      </div>
      <p className="mt-4 text-[11px] leading-relaxed text-black/50">
        Rates: U.S. Treasury par yields and New York Fed reference rates, latest published. Currencies: European Central Bank
        reference rates.{hasIndexes ? ' Indexes: Financial Modeling Prep, delayed.' : ''} Changes are against the prior reading; rates in basis
        points.
      </p>
    </section>
  )
}
