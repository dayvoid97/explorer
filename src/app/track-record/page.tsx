import Link from 'next/link'
import { CALLS, PRICES_AS_OF, priceReturn, impliedFromHere } from './data'

const GOLD = '#C9A24B'

export const metadata = {
  title: 'Track Record — Every Valuation We Have Published',
  description:
    'Every valuation Financial Gurkha has published, with the price at publication, the fair value we estimated, and the price today — including the ones that went against us.',
  alternates: { canonical: 'https://financialgurkha.com/track-record' },
  openGraph: {
    title: 'Track Record | Financial Gurkha',
    description:
      'Every published valuation, dated, with outcomes — wins and misses. Independent markets research, New York City.',
    url: 'https://financialgurkha.com/track-record',
    type: 'website',
  },
}

function fmt(n: number, currency: 'USD' | 'DKK') {
  return currency === 'USD' ? `$${n.toFixed(2)}` : `${n.toFixed(2)} DKK`
}

function pct(n: number | null) {
  if (n == null) return '—'
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(1)}%`
}

export default function TrackRecordPage() {
  const withPrices = CALLS.filter((c) => c.currentPrice != null)
  const up = withPrices.filter((c) => (priceReturn(c) ?? 0) > 0).length

  return (
    <div className="bg-[#0A0A0A] text-white">
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-12 sm:pt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: GOLD }}>
          Accountability · Updated {PRICES_AS_OF}
        </p>
        <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
          Every valuation we have published — including the ones we got wrong.
        </h1>

        <div className="mt-8 max-w-2xl space-y-5 text-lg font-light leading-relaxed text-white/75">
          <p>
            We do not claim a performance record, and you should be sceptical of any independent
            analyst who does. What we can do is publish every valuation we have written, with the
            date, the price at the time, the fair value we estimated, and where the stock trades
            now — so you can judge the work for yourself rather than take our word for it.
          </p>
          <p className="text-white/60">
            Of the {withPrices.length} valuations published to date, {up} is trading above its
            publication price and {withPrices.length - up} are below. That is the honest number.
          </p>
        </div>
      </section>

      {/* ---------- THE TABLE ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/20 text-left">
                  <th className="pb-3 pr-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Company
                  </th>
                  <th className="pb-3 pr-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Published
                  </th>
                  <th className="pb-3 pr-4 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Price then
                  </th>
                  <th className="pb-3 pr-4 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Our fair value
                  </th>
                  <th className="pb-3 pr-4 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Price now
                  </th>
                  <th className="pb-3 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody>
                {CALLS.map((c) => {
                  const ret = priceReturn(c)
                  return (
                    <tr key={c.slug} className="border-b border-white/10">
                      <td className="py-4 pr-4">
                        <Link
                          href={`/blog/${c.slug}`}
                          className="font-semibold underline decoration-1 underline-offset-4 transition hover:text-white"
                          style={{ color: GOLD }}
                        >
                          {c.company}
                        </Link>
                        <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                          {c.ticker}
                        </span>
                      </td>
                      <td className="py-4 pr-4 font-mono text-xs text-white/60">
                        {new Date(c.published).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-4 pr-4 text-right font-mono text-xs text-white/70">
                        {fmt(c.priceAtPublication, c.currency)}
                      </td>
                      <td className="py-4 pr-4 text-right font-mono text-xs text-white/70">
                        {fmt(c.fairValue, c.currency)}
                      </td>
                      <td className="py-4 pr-4 text-right font-mono text-xs text-white/70">
                        {c.currentPrice != null ? fmt(c.currentPrice, c.currency) : '—'}
                      </td>
                      <td
                        className="py-4 text-right font-mono text-xs font-bold"
                        style={{ color: ret == null ? '#888' : ret >= 0 ? '#4ade80' : '#f87171' }}
                      >
                        {pct(ret)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs font-light text-white/40">
            Prices as of {PRICES_AS_OF}. &ldquo;Change&rdquo; compares the current price with the
            price on the day we published — it is not a return on any position, since we do not
            publish entries, exits or position sizes. Novo Nordisk figures are in Danish kroner.
          </p>
        </div>
      </section>

      {/* ---------- HONEST ASSESSMENTS ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className="text-2xl font-bold">What happened, call by call</h2>
          <p className="mt-3 max-w-2xl font-light text-white/65">
            A number without an explanation is not transparency. Here is our own assessment of each
            one, including what the model got wrong.
          </p>

          <div className="mt-10 space-y-10">
            {CALLS.map((c) => {
              const ret = priceReturn(c)
              const implied = impliedFromHere(c)
              const good = (ret ?? 0) > 0
              return (
                <div key={c.slug} className="border-l-2 pl-5" style={{ borderColor: `${GOLD}55` }}>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h3 className="text-xl font-bold">{c.company}</h3>
                    <span
                      className="font-mono text-[10px] uppercase tracking-[0.2em]"
                      style={{ color: good ? '#4ade80' : '#f87171' }}
                    >
                      {ret == null ? 'Pending' : good ? 'Working' : 'Against us'}
                    </span>
                  </div>
                  <p className="mt-3 font-light leading-relaxed text-white/75">{c.assessment}</p>
                  {c.disclosedPosition && (
                    <p className="mt-2 text-sm text-white/50">
                      <span className="font-semibold text-white/70">Disclosed at the time:</span>{' '}
                      {c.disclosedPosition}
                    </p>
                  )}
                  {implied != null && (
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
                      Implied from here to our published fair value: {pct(implied)}
                    </p>
                  )}
                  <Link
                    href={`/blog/${c.slug}`}
                    className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.2em]"
                    style={{ color: GOLD }}
                  >
                    Read the original valuation →
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ---------- HOW TO READ THIS ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className="text-2xl font-bold">How to read this page</h2>
          <div className="mt-6 max-w-2xl space-y-4 font-light leading-relaxed text-white/70">
            <p>
              <span className="text-white/90">This is not a performance record.</span> We do not
              publish entry prices, exit prices or position sizes, and nothing here represents the
              return of an actual portfolio. It is a record of what we said and when.
            </p>
            <p>
              <span className="text-white/90">A valuation is not a price prediction.</span> A DCF
              estimates what a business is worth on stated assumptions. Markets can disagree for
              years, and sometimes the market is right and the model is wrong. Two of the three
              calls here are currently against us.
            </p>
            <p>
              <span className="text-white/90">Nothing gets deleted.</span> Entries stay on this page
              permanently, whatever happens. If we abandon a thesis we mark it closed and explain
              what changed rather than removing it.
            </p>
            <p>
              <span className="text-white/90">Three calls is a small sample.</span> It is not enough
              to judge a process by, and we would not want you to. It is enough to show that we are
              willing to be checked.
            </p>
          </div>

          <p className="mt-8 text-sm text-white/55">
            Our sourcing, disclosure and corrections policies are set out in{' '}
            <Link
              href="/legal/editorial"
              className="underline decoration-1 underline-offset-4"
              style={{ color: GOLD }}
            >
              Editorial Standards
            </Link>
            . Spotted an error on this page?{' '}
            <a
              href="mailto:contact@kanchanksharma.com"
              className="underline decoration-1 underline-offset-4"
              style={{ color: GOLD }}
            >
              Tell us
            </a>{' '}
            and we will correct it.
          </p>
        </div>
      </section>
    </div>
  )
}
