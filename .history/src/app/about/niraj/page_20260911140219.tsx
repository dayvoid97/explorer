import Link from 'next/link'

const GOLD = '#C9A24B'

const SSRN_MLLIQVAR = 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7222958'
const SSRN_BACKTESTING = 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7170418'
const LINKEDIN = 'https://www.linkedin.com/in/nirajneupane17/'

export const metadata = {
  title: 'Niraj Neupane — Quantitative Researcher | Financial Gurkha',
  description:
    'Niraj Neupane, CA (ICAI), is a quantitative researcher and financial economist working on Value-at-Risk forecasting, GARCH and Extreme Value Theory, machine learning in market risk, and model validation under SR 11-7.',
  alternates: { canonical: 'https://financialgurkha.com/about/niraj' },
  openGraph: {
    title: 'Niraj Neupane — Quantitative Researcher',
    description:
      'Value-at-Risk forecasting, financial econometrics, machine learning in market risk, and model validation. Author of ML-LiqVaR.',
    url: 'https://financialgurkha.com/about/niraj',
    type: 'profile',
  },
}

export default function AboutNirajPage() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://financialgurkha.com/#niraj',
    name: 'Niraj Neupane',
    honorificSuffix: 'CA (ICAI)',
    jobTitle: 'Quantitative Researcher',
    description:
      'Quantitative researcher and financial economist working on Value-at-Risk forecasting, financial econometrics, machine learning applications in market risk, and model validation.',
    url: 'https://financialgurkha.com/about/niraj',
    knowsAbout: [
      'Value at Risk',
      'Expected Shortfall',
      'Financial Econometrics',
      'GARCH Models',
      'Extreme Value Theory',
      'Gradient Boosting',
      'Quantile Regression',
      'Market Liquidity',
      'Model Validation',
      'SR 11-7',
      'Quantitative Trading',
    ],
    sameAs: [SSRN_MLLIQVAR, SSRN_BACKTESTING, LINKEDIN],
  }

  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: 'Niraj Neupane — Quantitative Researcher',
    url: 'https://financialgurkha.com/about/niraj',
    mainEntity: { '@id': 'https://financialgurkha.com/#niraj' },
    publisher: { '@id': 'https://financialgurkha.com/#organization' },
  }

  return (
    <div className="bg-[#0A0A0A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />

      {/* ---------- HEADER ---------- */}
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-12 sm:pt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: GOLD }}>
          Contributing Author · Quantitative Research
        </p>
        <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">Niraj Neupane</h1>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
          CA (ICAI) · Quantitative Researcher · Financial Economist · Forward Deployed Engineer
        </p>
        <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/75">
          Niraj works on the measurement of extreme loss in equity markets — how much a position can
          lose on a bad day, how confident anyone is entitled to be in that number, and what happens
          to it when liquidity disappears. His research sits at the join between classical financial
          econometrics and machine learning, and it is written to be validated rather than admired.
        </p>
      </section>

      {/* ---------- THE PERSON ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-4xl gap-10 px-6 py-14 sm:grid-cols-[200px_1fr]">
          <div></div>
          <div>
            <h2 className="text-2xl font-bold">Background</h2>
            <div className="mt-5 space-y-4 font-light leading-relaxed text-white/75">
              <p>
                Niraj is a Chartered Accountant under the Institute of Chartered Accountants of
                India (ICAI), and works as a quantitative researcher and financial economist. His
                professional focus spans quantitative trading, machine learning and AI applications
                in financial markets, financial econometrics, and model validation. He also works as
                a Forward Deployed Engineer — the part of the job where a model stops being a
                notebook and has to survive contact with a production risk system.
              </p>
              <p>
                The accountancy training matters more to the research than it might appear. Risk
                models in regulated institutions are not judged on elegance; they are judged on
                whether they can be documented, challenged, backtested and defended to a supervisor.
                That is the standard his papers are written against, which is why they report the
                results that do not clear a significance threshold alongside the ones that do.
              </p>
              <p>
                His current work covers one-day-ahead Value-at-Risk forecasting for US equities,
                conditional Extreme Value Theory in the tail, liquidity and volatility regime
                features, and the backtesting machinery — Kupiec, Christoffersen, Basel traffic
                light — that regulators actually use to decide whether a model is acceptable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- RESEARCH ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className="text-2xl font-bold">Published research</h2>
          <p className="mt-3 max-w-2xl font-light leading-relaxed text-white/70">
            Working papers, available in full on SSRN.
          </p>

          <div className="mt-10 space-y-10">
            {/* Paper 1 */}
            <div className="border-l-2 pl-6" style={{ borderColor: GOLD }}>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: GOLD }}
              >
                SSRN Working Paper · Abstract 7222958
              </p>
              <h3 className="mt-3 text-xl font-bold leading-snug">
                ML-LiqVaR: A Liquidity- and Regime-Aware, Extreme-Value-Calibrated Gradient-Boosting
                Value-at-Risk Model for US Equities
              </h3>
              <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-white/70">
                A hybrid framework for one-day-ahead VaR forecasting that combines GARCH volatility
                modelling, conditional Extreme Value Theory in the tail, and gradient-boosted
                quantile regression, conditioned on volatility, momentum, VIX and liquidity
                features. Tested on 8,072 out-of-sample observations across eight S&amp;P 500
                constituents, 2018–2024, against four benchmark models.
              </p>
              <div className="mt-5 flex flex-wrap gap-4">
                <a
                  href={SSRN_MLLIQVAR}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] transition hover:bg-white hover:text-black"
                  style={{ borderColor: GOLD, color: GOLD }}
                >
                  Download on SSRN ↓
                </a>
                <Link
                  href="/blog/ml-liqvar-machine-learning-value-at-risk-us-equities"
                  className="border border-white/20 px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-white/70 transition hover:border-white hover:text-white"
                >
                  Read the summary
                </Link>
              </div>
            </div>

            {/* Paper 2 */}
            <div className="border-l-2 border-white/15 pl-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                SSRN Working Paper · Abstract 7170418 · July 2026
              </p>
              <h3 className="mt-3 text-xl font-bold leading-snug">
                Backtesting Value-at-Risk Models Under SR 11-7: A Comparative Analysis of Kupiec,
                Christoffersen, and Basel Traffic-Light Tests Applied to S&amp;P 500 Returns
                (2018–2024)
              </h3>
              <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-white/70">
                A walk-forward backtest of Historical Simulation, Parametric Normal and Student-t
                VaR on S&amp;P 500 daily returns, recalibrated every day on a trailing 250-day
                window and evaluated against the three tests a US supervisor applies under the
                Federal Reserve&apos;s SR 11-7 model risk management guidance.
              </p>
              <div className="mt-5">
                <a
                  href={SSRN_BACKTESTING}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/20 px-6 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-white/70 transition hover:border-white hover:text-white"
                >
                  Download on SSRN ↓
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FOCUS ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className="text-2xl font-bold">Areas of work</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: GOLD }}
              >
                Tail risk measurement
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
                Value-at-Risk and Expected Shortfall, conditional Extreme Value Theory, and the
                question of what a 99% quantile estimate is actually worth when it is fitted on a
                few hundred observations.
              </p>
            </div>
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: GOLD }}
              >
                Financial econometrics
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
                GARCH-family volatility models, quantile regression, regime identification, and the
                long-standing question of how much of a return distribution is genuinely
                forecastable.
              </p>
            </div>
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: GOLD }}
              >
                Machine learning in markets
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
                Gradient boosting for quantile targets, feature construction from liquidity and
                volatility data, and the discipline of testing an ML model against the econometric
                benchmark it claims to beat.
              </p>
            </div>
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: GOLD }}
              >
                Model validation
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
                Backtesting under SR 11-7, coverage and independence testing, Basel traffic-light
                classification, and building models that can be documented and challenged rather
                than only deployed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- DISCLOSURE ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className="text-2xl font-bold">On this contribution</h2>
          <div className="mt-4 max-w-2xl space-y-4 font-light leading-relaxed text-white/70">
            <p>
              Niraj writes for Financial Gurkha as an independent contributing author. His articles
              here summarise his own published research and are not sponsored, commissioned by, or
              written on behalf of any employer, client or institution. Views are his own and do not
              represent those of any organisation he is affiliated with.
            </p>
            <p>
              Research summarised on this site is working-paper stage. Working papers on SSRN have
              not been peer reviewed, and conclusions may change between drafts. Where a result is
              not statistically significant, we say so in the article rather than in a footnote.
            </p>
          </div>
          <p className="mt-6 text-sm text-white/50">
            Our sourcing, disclosure and corrections policy is set out in the{' '}
            <Link
              href="/legal/editorial"
              className="underline decoration-1 underline-offset-4"
              style={{ color: GOLD }}
            >
              Editorial Standards
            </Link>
            .
          </p>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <div className="flex flex-wrap gap-4">
            <a
              href={SSRN_MLLIQVAR}
              target="_blank"
              rel="noopener noreferrer"
              className="border px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] transition hover:bg-white hover:text-black"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              Download ML-LiqVaR ↓
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/20 px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] text-white/70 transition hover:border-white hover:text-white"
            >
              LinkedIn
            </a>
            <Link
              href="/blog"
              className="border border-white/20 px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] text-white/70 transition hover:border-white hover:text-white"
            >
              Read the Analysis
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
