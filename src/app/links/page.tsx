'use client'

import { useMemo, useState } from 'react'

const ARTICLES: { title: string; href: string }[] = [
  { title: "Britain's Welfare Bill Is Breaking the Budget — and the Bond Market Has Noticed", href: 'https://financialgurkha.com/blog/uk-welfare-bill-budget-gilt-yields-g7-comparison' },
  { title: 'Record Stocks, 24-Year-High Yields: Which Market Is Wrong?', href: 'https://financialgurkha.com/blog/record-stocks-24-year-high-treasury-yields-which-market-is-wrong' },
  { title: 'Physical AI: The Brain and the Body Have Become Their Own Markets', href: 'https://financialgurkha.com/blog/physical-ai-brain-body-robotics-thesis' },
  { title: "The 30-Year Hit a 2002 High. Why Didn't Wall Street Panic?", href: 'https://financialgurkha.com/blog/systemic-tail-episode-risk-ster-30-year-treasury-2002-high' },
  { title: "600 Years of Capitalism: Reading the Review of Sven Beckert's Global History", href: 'https://financialgurkha.com/blog/600-years-of-capitalism-sven-beckert-capitalism-a-global-history-review' },
  { title: 'Anthropic at $2 Trillion: The IPO Has to Beat a 5.56% Treasury First', href: 'https://financialgurkha.com/blog/anthropic-ipo-2-trillion-valuation-opportunity-cost-treasury-yields' },
  { title: "The Bond Market's Bad Week Was an Episode, Not a Day: Why VaR Can't See It", href: 'https://financialgurkha.com/blog/bond-market-bad-week-tail-episode-risk-cter' },
  { title: 'Tanker Stocks in 2026: Record Profits, Near-$1 Million-a-Day Rates, and Whether It Is Too Late to Buy', href: 'https://financialgurkha.com/blog/tanker-stocks-2026-hormuz-vlcc-rates-earnings-valuation' },
  { title: 'Reading BRICS Like a Risk Manager: Why Dollar Diversification Is a Model-Risk Problem for U.S. Financial Markets', href: 'https://financialgurkha.com/blog/reading-brics-like-a-risk-manager-dollar-diversification-model-risk' },
  { title: 'Federal Reserve Raises Interest Rates to 3.75%–4%. Twelve Votes, Zero Dissents.', href: 'https://financialgurkha.com/blog/fed-raises-rates-sept16-2026-fomc-implementation-note' },
  { title: 'When Markets Turn Volatile, Can Machine Learning See the Risk Coming?', href: 'https://financialgurkha.com/blog/ml-liqvar-machine-learning-value-at-risk-us-equities' },
  { title: 'The State of US Energy: Crude Production, Petroleum refining, the Strategic Petroleum Reserves, and Why Nobody Will Build a Refinery', href: 'https://financialgurkha.com/blog/us-energy-crude-refining-imports-exports-2026' },
  { title: 'US National Accounts, Gross Domestic Income Components, Fiscal Deficits, and Housing: Insights from Bloomberg Terminal Research', href: 'https://financialgurkha.com/blog/us-national-accounts-housing-deficit-macro-primer' },
  { title: 'July 2026 CPI: Headline Inflation Says 3.4%. The Last Three Months Say 0.8%.', href: 'https://financialgurkha.com/blog/july-2026-cpi-inflation-energy-report' },
  { title: 'Sandisk reports $9.8 billion in Q426 revenue', href: 'https://financialgurkha.com/blog/sandisk-fy26-earnings-nand-supercycle' },
  { title: "Caterpillar's First $20 Billion Quarter: A Record $72 Billion Backlog, Raised Guidance, and the AI Boom in Yellow Iron", href: 'https://financialgurkha.com/blog/caterpillar-first-20-billion-quarter' },
  { title: 'Microsoft FY26 Earnings: $331 Billion in Revenue, $133 Billion in Profit, and the $115 Billion AI Bet That Just Paid Off', href: 'https://financialgurkha.com/blog/microsoft-fy26-earnings-fy27-guidance' },
  { title: 'Federal Reserve Keeps Interest Rates Steady', href: 'https://financialgurkha.com/blog/fed-decision-preview-jul29-2026' },
  { title: 'All About Monad (MON): Generate Value From Monad Blockchain', href: 'https://financialgurkha.com/blog/all-about-monad' },
  { title: 'An Intrinsic Valuation of FIGMA (NYSE:FIG)', href: 'https://financialgurkha.com/blog/figma-intrinsic-valuation' },
  { title: "America's Net Investment Position with the World", href: 'https://financialgurkha.com/blog/usa-net-investment-position' },
  { title: 'Dollar Gold Crude Relations', href: 'https://financialgurkha.com/blog/usd-dxy-gold-oil-since-2022' },
  { title: 'Gold: A Primer on Commodities and Trading', href: 'https://financialgurkha.com/blog/a-primer-on-precious-metals' },
  { title: 'Novo Nordisk DCF Valuation: Should you invest in the Ozempic and Wegovy Maker for exeptional returns?', href: 'https://financialgurkha.com/blog/novo-nordisk-dcf-valuation' },
  { title: 'MP Materials Valuation: A Discounted Cash Flow Approach', href: 'https://financialgurkha.com/blog/mp-materials-valuation' },
]

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif"

export default function LinksPage() {
  const [query, setQuery] = useState('')
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? ARTICLES.filter((a) => a.title.toLowerCase().includes(q)) : ARTICLES
  }, [query])

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#0b0b0b',
        backgroundImage:
          'repeating-linear-gradient(90deg, rgba(243,234,210,0.045) 0px, rgba(243,234,210,0.045) 1px, transparent 1px, transparent 7px)',
        color: '#f3ead2',
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap"
      />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '48px 20px 56px' }}>
        <header style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              lineHeight: 1.2,
            }}
          >
            Financial Gurkha
          </div>
          <div
            style={{
              width: 64,
              height: 2,
              backgroundColor: '#c6a15b',
              margin: '14px auto 12px',
            }}
          />
          <div style={{ color: '#c6a15b', fontSize: 14, letterSpacing: '0.08em' }}>
            @financialgurkha
          </div>
          <p style={{ color: '#b9ae94', fontSize: 15, lineHeight: 1.55, marginTop: 18 }}>
            Saw a post on Instagram? Tap the headline that matches it to read the
            full research.
          </p>
        </header>

        <label htmlFor="fg-links-search" style={{ display: 'block', marginBottom: 18 }}>
          <span
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              overflow: 'hidden',
              clip: 'rect(0 0 0 0)',
            }}
          >
            Find an article by headline
          </span>
          <input
            id="fg-links-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a word from the headline…"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: 'rgba(243,234,210,0.05)',
              border: '1px solid rgba(198,161,91,0.45)',
              borderRadius: 10,
              color: '#f3ead2',
              fontSize: 16,
              padding: '13px 14px',
              outline: 'none',
            }}
          />
        </label>

        <nav aria-label="Financial Gurkha articles">
          {shown.map((a) => (
            <a
              key={a.href}
              href={a.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
                padding: '18px 6px',
                borderBottom: '1px solid rgba(198,161,91,0.25)',
                color: '#f3ead2',
                textDecoration: 'none',
              }}
            >
              <span
                style={{
                  fontFamily: SERIF,
                  fontSize: 19,
                  fontWeight: 600,
                  lineHeight: 1.35,
                }}
              >
                {a.title}
              </span>
              <span
                aria-hidden="true"
                style={{
                  color: '#c6a15b',
                  fontSize: 13,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}
              >
                Read →
              </span>
            </a>
          ))}
          {shown.length === 0 && (
            <p style={{ color: '#b9ae94', fontSize: 15, padding: '18px 6px' }}>
              No headline matches that — clear the search to see the full list.
            </p>
          )}
        </nav>

        <footer
          style={{
            textAlign: 'center',
            marginTop: 40,
            color: '#b9ae94',
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: '0 0 6px' }}>
            Educational content only, not investment advice.
          </p>
          <a href="https://financialgurkha.com" style={{ color: '#c6a15b' }}>
            financialgurkha.com
          </a>
        </footer>
      </div>
    </main>
  )
}
