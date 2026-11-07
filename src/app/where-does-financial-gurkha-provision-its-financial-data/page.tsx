import Link from 'next/link'
import { DATA_SOURCES_PATH } from '../lib/data-sources'

const SITE = 'https://financialgurkha.com'
const PATH = DATA_SOURCES_PATH
const EMAIL = 'contact@kanchanksharma.com'
const LAST_UPDATED = 'November 7, 2026'

export const metadata = {
  title: 'Where Does Financial Gurkha Provision Its Financial Data?',
  description:
    'Treasury yields from FRED, reference rates from the New York Fed, currencies from the ECB, and research sourced from SEC filings and official statistics. All market data is delayed, not real-time.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: {
    title: 'Where Does Financial Gurkha Provision Its Financial Data?',
    description: 'FRED, the New York Fed, the ECB and primary filings. Delayed, not real-time.',
    url: `${SITE}${PATH}`,
    type: 'website',
  },
}

// Not shown on the page. Emitted as FAQPage data so search and answer engines
// can quote the disclosure directly.
const FAQS = [
  {
    q: 'Where does Financial Gurkha get its financial data?',
    a: 'U.S. Treasury yields come from FRED (Federal Reserve Bank of St. Louis), the fed funds rate and SOFR from the New York Fed, and currency rates from the European Central Bank. Research and news are sourced from SEC filings, official statistics, company releases and established newsrooms, listed at the end of each article.',
  },
  {
    q: 'Is Financial Gurkha market data real-time?',
    a: 'No. Market data on Financial Gurkha is delayed. Each source publishes once a business day, and Treasury yields usually run one business day behind.',
  },
  {
    q: 'Where do the Treasury yields on Financial Gurkha come from?',
    a: 'FRED, the Federal Reserve Bank of St. Louis economic database, which republishes the Federal Reserve H.15 constant-maturity Treasury yields.',
  },
]

const SANS = { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }
const link = 'font-bold underline underline-offset-4 hover:text-gray-600'

function Item({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-4 border-t-2 border-black py-5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-black text-sm font-black">
        {n}
      </span>
      <div>
        <h3 className="text-lg font-black uppercase tracking-wide">{title}</h3>
        <p className="mt-1 text-[16px] leading-snug text-gray-800">{children}</p>
      </div>
    </li>
  )
}

export default function DataSourcesPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-12 text-black sm:py-16" style={SANS}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <div className="border-4 border-black p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.3em]">Public notice · Data</p>
        <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
          Where does Financial Gurkha provision its financial data?
        </h1>
        <p className="mt-3 text-[16px] leading-snug text-gray-800">Official sources first. Named, every time.</p>

        <div className="mt-6 border-4 border-black p-4 text-center">
          <p className="text-xl font-black uppercase leading-tight sm:text-2xl">Delayed. Not real-time.</p>
          <p className="mt-1 text-sm text-gray-700">
            Each source publishes once a business day. Check a live quote before acting on any number.
          </p>
        </div>

        <section id="market-data" className="mt-8 scroll-mt-24">
          <h2 className="text-xs font-black uppercase tracking-[0.3em]">The market numbers</h2>
          <p className="mt-2 text-[16px] leading-snug text-gray-800">
            The rates and currencies in the homepage strip and Markets panel.
          </p>
          <ol className="mt-4">
            <Item n={1} title="FRED">
              The Federal Reserve Bank of St. Louis. U.S. Treasury yields: 3-month, 2-year, 10-year and 30-year, from
              the Fed’s H.15 release. Updated once a day, usually one business day behind.{' '}
              <a href="https://fred.stlouisfed.org/series/DGS10" className={link} rel="noopener" target="_blank">
                See the 10-year series
              </a>
              .
            </Item>
            <Item n={2} title="New York Fed">
              The effective fed funds rate, SOFR and the Fed’s target range. Published each business morning for the day
              before.{' '}
              <a href="https://www.newyorkfed.org/markets/reference-rates" className={link} rel="noopener" target="_blank">
                Reference rates
              </a>
              .
            </Item>
            <Item n={3} title="European Central Bank">
              Euro reference rates, published once each business day around 4 p.m. Frankfurt time. We work out the dollar
              pairs (EUR/USD, GBP/USD, USD/JPY and others) from them.{' '}
              <a
                href="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html"
                className={link}
                rel="noopener"
                target="_blank">
                ECB rates
              </a>
              .
            </Item>
          </ol>
          <p className="border-t-2 border-black pt-4 text-sm leading-snug text-gray-700">
            Stock index levels, when shown, are delayed quotes licensed from Financial Modeling Prep. The site checks for
            new figures every few minutes; that makes them fresh, not live.
          </p>
        </section>

        <section id="research" className="mt-8 scroll-mt-24">
          <h2 className="text-xs font-black uppercase tracking-[0.3em]">Our research and news</h2>
          <p className="mt-2 text-[16px] leading-snug text-gray-800">
            Every article ends with its sources. We rank them in three tiers.
          </p>
          <ol className="mt-4">
            <Item n={1} title="Primary and official">
              Company filings on SEC EDGAR (10-K, 10-Q, S-1). The Federal Reserve, U.S. Treasury, Bureau of Labor
              Statistics, Bureau of Economic Analysis, Census, EIA and CBO. Company investor-relations releases. Exchanges
              such as Nasdaq, NYSE and CME. The ECB, Bank of England, Bank of Japan, IMF, World Bank, BIS and OECD.
              Research on SSRN and NBER.
            </Item>
            <Item n={2} title="Established newsrooms">
              Reuters, AP, Bloomberg, The Wall Street Journal, the Financial Times, CNBC and others with editorial
              standards and a corrections policy.
            </Item>
            <Item n={3} title="Everything else">
              Never the only source for a fact.
            </Item>
          </ol>
          <p className="border-t-2 border-black pt-4 text-sm leading-snug text-gray-700">
            Our own calculations, such as growth rates, valuations and models, are labelled as ours in each article’s
            methodology.
          </p>
        </section>
      </div>

      <p className="mt-6 text-sm leading-snug text-gray-600">
        How we choose what to cover:{' '}
        <Link href="/legal/editorial" className="underline underline-offset-4">
          Editorial Standards
        </Link>
        . Spotted a wrong number? Tell us:{' '}
        <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">
          {EMAIL}
        </a>
        . Updated {LAST_UPDATED}.
      </p>
    </main>
  )
}
