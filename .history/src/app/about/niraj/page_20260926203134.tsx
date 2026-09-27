import Image from 'next/image'
import Link from 'next/link'

const GOLD = '#C9A24B'

const SSRN_MLLIQVAR = 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7222958'
const SSRN_BACKTESTING = 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7170418'
const LINKEDIN = 'https://www.linkedin.com/in/nirajneupane17/'

const HEADLINE = [
  'CHARTERED ACCOUNTANT (ICAI)',
  'QUANTITATIVE FINANCE RESEARCHER',
  'AI/ML IN FINANCIAL MARKETS',
]
const SUBHEADLINE = [
  'Quantitative Finance',
  'Financial Econometrics',
  'AI/ML',
  'Trading',
  'Risk Management',
  'Model Validation',
  'Financial Technology',
]

const SHORT_BIO =
  'Niraj Neupane is a Chartered Accountant (ICAI) and quantitative finance researcher working at the intersection of quantitative finance, financial econometrics, artificial intelligence, machine learning, and financial markets. His research focuses on financial modeling, market and liquidity risk, quantitative trading and research, model validation, and responsible applications of AI in finance.'
const VERY_SHORT_BIO =
  'Chartered Accountant (ICAI) and quantitative finance researcher focused on AI/ML, quantitative finance, financial econometrics, trading, risk management, model validation, and responsible AI in financial markets.'

const MAIN_BIO = [
  'Niraj Neupane is a Chartered Accountant (ICAI) and quantitative finance researcher working at the intersection of financial economics, financial econometrics, artificial intelligence, machine learning, quantitative modeling, and financial markets.',
  'His research examines how quantitative and AI/ML methods can be developed, tested, validated, and responsibly applied across financial-market activities, including quantitative research, systematic trading, market and liquidity risk management, financial forecasting, regulatory and compliance applications, and financial-model governance.',
  'His work spans financial risk measurement, Value-at-Risk, Expected Shortfall, liquidity-adjusted risk, volatility modeling, quantitative trading, financial econometrics, machine-learning forecasting, model validation, stress testing, regime-aware analysis, and responsible AI.',
  'A central theme of his research is the reliability of quantitative and machine-learning models: whether models that perform well under historical or normal conditions continue to provide useful, robust, interpretable, and defensible results when markets experience volatility, liquidity changes, structural shifts, and stress.',
  'Through his research and technical projects, Niraj aims to contribute to the responsible and effective application of artificial intelligence, machine learning, and automation across trading, risk management, regulatory compliance, and quantitative research in financial markets.',
]

const BACKGROUND = [
  'Niraj Neupane is a Chartered Accountant (ICAI) and quantitative finance researcher with academic training in economics, finance, financial economics, and quantitative methods. His work combines financial econometrics, statistical modeling, machine learning, financial engineering, programming, and practical financial-market analysis.',
  'His research interests extend across quantitative finance and financial technology, including financial forecasting, market and liquidity risk, Value-at-Risk, Expected Shortfall, volatility modeling, derivatives, quantitative trading, portfolio analytics, financial econometrics, machine learning, model validation, stress testing, and financial-market applications of artificial intelligence.',
  'A central area of his work is the development and validation of quantitative models. This includes examining how models perform across different market regimes, how model selection can introduce overfitting, how forecasts can become miscalibrated, and how validation frameworks can identify weaknesses that may not be visible through conventional performance measures.',
  'His broader research agenda examines how artificial intelligence, machine learning, and automation can be responsibly integrated into financial-market activities while maintaining appropriate standards of reliability, transparency, validation, governance, and human oversight.',
]

const TRAJECTORY_CHAIN = [
  'Risk Measurement',
  'Quantitative Modeling',
  'Backtesting',
  'Machine Learning',
  'Model Validation',
  'Responsible AI',
]

const TRAJECTORY = [
  {
    title: 'ML-LiqVaR',
    body: 'Developing machine-learning methods for liquidity-aware, regime-aware, and tail-risk-sensitive Value-at-Risk estimation.',
  },
  {
    title: 'VaR Backtesting Under SR 11-7',
    body: 'Examining conventional statistical backtesting and quantitative model-validation approaches for financial risk models.',
  },
  {
    title: 'Governance-Grade ML Validation',
    body: 'Extending conventional validation to regime robustness, model-selection risk, calibration, and governance of machine-learning risk models.',
  },
]

const FOCUS_INTRO =
  'My research focuses on the responsible and effective application of artificial intelligence, machine learning, quantitative methods, and automation to financial markets.'

const FOCUS = [
  'Quantitative Finance and Financial Engineering',
  'Artificial Intelligence and Machine Learning in Financial Markets',
  'Financial Econometrics and Time-Series Modeling',
  'Quantitative Trading and Systematic Research',
  'Market and Liquidity Risk Management',
  'Value-at-Risk and Expected Shortfall',
  'Financial Forecasting and Volatility Modeling',
  'Model Validation and Model Risk Management',
  'Stress Testing and Regime-Aware Analysis',
  'Regulatory and Compliance Applications',
  'Explainable AI and Financial Model Governance',
  'Responsible AI for Financial Institutions',
]

const AREAS = [
  {
    title: 'AI & Machine Learning in Financial Markets',
    body: 'Machine-learning methods for financial forecasting, quantitative research, risk measurement, anomaly detection, model development, and financial-market applications.',
  },
  {
    title: 'Quantitative Finance',
    body: 'Quantitative modeling, financial engineering, derivatives, portfolio analytics, systematic strategies, financial forecasting, and computational finance.',
  },
  {
    title: 'Financial Econometrics',
    body: 'Financial time-series analysis, volatility modeling, GARCH-family models, quantile regression, forecasting, regime identification, and statistical inference.',
  },
  {
    title: 'Market & Liquidity Risk',
    body: 'Value-at-Risk, Expected Shortfall, liquidity-adjusted risk, tail-risk measurement, stress testing, volatility, and regime-dependent financial risk.',
  },
  {
    title: 'Quantitative Trading & Research',
    body: 'Systematic research, feature engineering, signal development, portfolio analysis, backtesting, quantitative strategies, and model evaluation.',
  },
  {
    title: 'Model Validation',
    body: 'Backtesting, coverage testing, benchmarking, calibration, stability analysis, robustness testing, model-selection risk, and validation frameworks.',
  },
  {
    title: 'Regulatory & Compliance Analytics',
    body: 'AI/ML applications for financial surveillance, anomaly detection, regulatory analytics, compliance monitoring, and quantitative assessment of financial-market activity.',
  },
  {
    title: 'Responsible AI & Financial Governance',
    body: 'Explainability, model risk management, monitoring, documentation, governance, validation, auditability, and responsible deployment of AI/ML systems in financial institutions.',
  },
]

const QUESTIONS = [
  'How can artificial intelligence and machine learning improve quantitative financial modeling while maintaining appropriate standards of reliability and validation?',
  'How can machine-learning models be validated when financial markets experience structural changes, volatility shifts, liquidity deterioration, or stressed conditions?',
  'Can conventional backtesting adequately identify the weaknesses of flexible machine-learning risk models?',
  'How can liquidity, volatility, and market-regime information be incorporated into financial risk models?',
  'How can AI and quantitative methods support systematic trading and quantitative research?',
  'How can machine-learning models be monitored for instability, overfitting, calibration deterioration, and model drift?',
  'How can explainability, validation, and governance improve the responsible use of AI in financial institutions?',
  'How can AI and automation support financial-market compliance and regulatory applications while maintaining appropriate human oversight?',
]

const PHILOSOPHY = [
  'A financial model should not be judged only by how well it performs under normal conditions. It should also be evaluated for stability, calibration, robustness, interpretability, and failure behavior when markets change.',
  'My research therefore considers the broader lifecycle of quantitative and machine-learning models—from problem formulation and development to empirical testing, validation, monitoring, governance, and practical deployment.',
  'The objective is not simply to build models that perform well, but to understand when they work, when they fail, why they fail, and how those failure modes can be identified and managed.',
]

const METHODS = [
  {
    title: 'Financial Econometrics',
    items: [
      'Time-series analysis',
      'Volatility modeling',
      'GARCH-family models',
      'Quantile regression',
      'Forecasting',
      'Regime analysis',
      'Statistical testing',
    ],
  },
  {
    title: 'Machine Learning',
    items: [
      'Supervised learning',
      'Gradient boosting',
      'Quantile machine learning',
      'Feature engineering',
      'Model evaluation',
      'Anomaly detection',
      'Model monitoring',
    ],
  },
  {
    title: 'Financial Engineering',
    items: [
      'Value-at-Risk',
      'Expected Shortfall',
      'Derivatives',
      'Portfolio analytics',
      'Stress testing',
      'Tail-risk measurement',
      'Liquidity risk',
    ],
  },
  {
    title: 'Quantitative Research',
    items: [
      'Systematic research',
      'Backtesting',
      'Signal development',
      'Portfolio construction',
      'Performance evaluation',
      'Financial data analysis',
    ],
  },
  {
    title: 'Model Validation',
    items: [
      'Backtesting',
      'Benchmarking',
      'Calibration',
      'Stability testing',
      'Robustness analysis',
      'Overfitting assessment',
      'Model governance',
    ],
  },
  {
    title: 'Computational Finance',
    items: [
      'Python',
      'C++',
      'R',
      'SQL',
      'Pandas',
      'NumPy',
      'Scikit-learn',
      'TensorFlow',
      'MATLAB',
      'Statistical and numerical computing',
    ],
  },
]

const PROJECTS_INTRO =
  'Alongside academic and independent research, Niraj develops research-oriented technology initiatives designed to translate quantitative finance and AI/ML methodologies into practical financial-market applications.'

const PROJECTS = [
  {
    title: 'Korvane',
    body: [
      'Korvane is a research and technology initiative focused on AI-driven trade, risk, and model-validation applications.',
      'Its conceptual scope includes quantitative research, market-risk analytics, liquidity and stress analysis, model validation, monitoring, explainability, and financial decision-support workflows.',
      'The initiative is intended to connect quantitative research methodologies with practical financial-market technology.',
    ],
  },
  {
    title: 'Calderyn Institute',
    body: [
      'Calderyn Institute is a research and education initiative focused on developing quantitative and AI/ML capabilities for financial-market applications.',
      'Its proposed areas include quantitative trading, quantitative research, quantitative development, financial risk, model validation, financial engineering, and responsible AI for finance.',
    ],
  },
]

const FUTURE_INTRO =
  'The continuing research program will explore the development, validation, and responsible deployment of AI and quantitative methods across financial markets.'

const FUTURE = [
  'Machine-learning risk measurement',
  'Liquidity-adjusted and regime-aware risk models',
  'AI-based stress testing',
  'Explainable AI for financial models',
  'Machine-learning model validation',
  'Quantitative trading and systematic research',
  'AI-assisted financial-market surveillance',
  'Regulatory and compliance analytics',
  'Model monitoring and model-drift detection',
  'Responsible AI and financial-model governance',
  'AI/ML applications in quantitative finance and financial engineering',
]

const ABOUT_RESEARCH = [
  'Niraj Neupane contributes independent research on quantitative finance, financial economics, financial econometrics, artificial intelligence, machine learning, financial risk management, quantitative trading, and financial-market technology.',
  'Research presented on this site may include working papers, preprints, research in progress, and technical research projects. Unless explicitly identified as peer-reviewed or formally published, a paper should be considered a working paper and should not be interpreted as having undergone formal journal peer review.',
  'Research findings are developed and updated as methodologies, datasets, empirical results, and validation procedures evolve.',
  "The research represents the author's independent views unless a specific institutional or collaborative affiliation is explicitly identified.",
]

export const metadata = {
  title: 'Niraj Neupane — Quantitative Finance Researcher | Financial Gurkha',
  description: VERY_SHORT_BIO,
  alternates: { canonical: 'https://financialgurkha.com/about/niraj' },
  openGraph: {
    title: 'Niraj Neupane — Quantitative Finance Researcher',
    description: VERY_SHORT_BIO,
    url: 'https://financialgurkha.com/about/niraj',
    type: 'profile',
  },
}

const monoLabel = 'font-mono text-[10px] uppercase tracking-[0.3em]'
const sectionH2 = 'text-2xl font-bold'

// Keeps each item on one line and lets the separator trail it, so a wrapped
// line never starts with a stray bullet or splits a phrase like "Model Validation".
function InlineList({ items, sep, sepColor }: { items: string[]; sep: string; sepColor?: string }) {
  return (
    <>
      {items.map((item, i) => (
        <span key={item}>
          {i > 0 && ' '}
          <span className="whitespace-nowrap">
            {item}
            {i < items.length - 1 && (
              <span className="ml-2" style={sepColor ? { color: sepColor } : undefined}>
                {sep}
              </span>
            )}
          </span>
        </span>
      ))}
    </>
  )
}

function BulletList({ items, twoCol = false }: { items: string[]; twoCol?: boolean }) {
  return (
    <ul className={`mt-6 grid gap-x-10 gap-y-3 ${twoCol ? 'sm:grid-cols-2' : ''}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm font-light leading-relaxed text-white/75">
          <span aria-hidden="true" style={{ color: GOLD }}>
            ▪
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function AboutNirajPage() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://financialgurkha.com/#niraj',
    name: 'Niraj Neupane',
    honorificSuffix: 'CA (ICAI)',
    jobTitle: 'Quantitative Finance Researcher',
    description: SHORT_BIO,
    url: 'https://financialgurkha.com/about/niraj',
    knowsAbout: [
      'Quantitative Finance',
      'Financial Econometrics',
      'Artificial Intelligence in Finance',
      'Machine Learning in Finance',
      'Value at Risk',
      'Expected Shortfall',
      'Market and Liquidity Risk',
      'Volatility Modeling',
      'GARCH Models',
      'Extreme Value Theory',
      'Gradient Boosting',
      'Quantile Regression',
      'Quantitative Trading',
      'Model Validation',
      'Model Risk Management',
      'SR 11-7',
      'Stress Testing',
      'Responsible AI',
    ],
    sameAs: [SSRN_MLLIQVAR, SSRN_BACKTESTING, LINKEDIN],
  }

  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: 'Niraj Neupane — Quantitative Finance Researcher',
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
        <p className="mt-3 font-mono text-[11px] font-bold uppercase leading-relaxed tracking-[0.2em] text-white/60">
          <InlineList items={HEADLINE} sep="•" />
        </p>
        <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/75">
          <InlineList items={SUBHEADLINE} sep="•" />
        </p>
      </section>

      {/* ---------- ABOUT ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-4xl gap-10 px-6 py-14 sm:grid-cols-[200px_1fr]">
          <div>
            <div
              className="h-[200px] w-[200px] overflow-hidden rounded-full border"
              style={{ borderColor: GOLD }}
            >
              <Image
                src="/CANiraj/CANirajCover.png"
                alt="Niraj Neupane, CA (ICAI), quantitative finance researcher"
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div>
            <h2 className={sectionH2}>About</h2>
            <div className="mt-5 space-y-4 font-light leading-relaxed text-white/75">
              {MAIN_BIO.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- BACKGROUND ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className={sectionH2}>Background</h2>
          <div className="mt-5 max-w-2xl space-y-4 font-light leading-relaxed text-white/75">
            {BACKGROUND.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- RESEARCH & WORKING PAPERS ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className={sectionH2}>Research &amp; Working Papers</h2>
          <p className="mt-3 max-w-2xl font-light leading-relaxed text-white/70">
            Research papers, working papers, and research in progress covering quantitative finance,
            financial econometrics, artificial intelligence, machine learning, financial risk
            management, quantitative trading, and model validation.
          </p>

          <div className="mt-10 space-y-10">
            {/* ML-LiqVaR */}
            <div className="border-l-2 pl-6" style={{ borderColor: GOLD }}>
              <p className={monoLabel} style={{ color: GOLD }}>
                SSRN Working Paper · Abstract 7222958
              </p>
              <h3 className="mt-3 text-xl font-bold leading-snug">
                ML-LiqVaR: A Liquidity- and Regime-Aware, Extreme-Value-Calibrated Gradient-Boosting
                Value-at-Risk Model for US Equities
              </h3>
              <div className="mt-3 max-w-2xl space-y-3 text-sm font-light leading-relaxed text-white/70">
                <p>
                  A quantitative framework for one-day-ahead Value-at-Risk forecasting that combines
                  volatility modeling, Extreme Value Theory, gradient-boosted quantile regression,
                  liquidity and volatility features, and regime-aware modeling.
                </p>
                <p>
                  The research examines whether machine-learning methods can improve tail-risk
                  measurement while maintaining rigorous statistical validation and providing a more
                  comprehensive representation of market conditions.
                </p>
              </div>
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

            {/* VaR backtesting */}
            <div className="border-l-2 border-white/15 pl-6">
              <p className={`${monoLabel} text-white/40`}>
                SSRN Working Paper · Abstract 7170418 · July 2026
              </p>
              <h3 className="mt-3 text-xl font-bold leading-snug">
                Backtesting Value-at-Risk Models Under SR 11-7: A Comparative Analysis of Kupiec,
                Christoffersen, and Basel Traffic-Light Tests Applied to S&amp;P 500 Returns
              </h3>
              <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-white/70">
                A walk-forward empirical study of Value-at-Risk models using S&amp;P 500 daily
                returns. The research compares unconditional coverage, conditional coverage, and
                Basel traffic-light backtesting approaches and examines their relevance to
                quantitative model validation and financial risk management.
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

            {/* Governance-grade validation. No public link yet, so no download button. */}
            <div className="border-l-2 border-white/15 pl-6">
              <p className={`${monoLabel} text-white/40`}>Working Paper</p>
              <h3 className="mt-3 text-xl font-bold leading-snug">
                When Backtests Lie: A Governance-Grade Validation Framework for Machine-Learning
                Value-at-Risk Models under Regime Shifts
              </h3>
              <div className="mt-3 max-w-2xl space-y-3 text-sm font-light leading-relaxed text-white/70">
                <p>
                  This research develops a governance-oriented validation framework for
                  machine-learning Value-at-Risk models.
                </p>
                <p>
                  The framework extends conventional backtesting with regime-conditional coverage
                  analysis, Probability of Backtest Overfitting, and conformal recalibration to
                  examine whether aggregate model evaluation can conceal weaknesses during stressed
                  or changing market conditions.
                </p>
                <p>
                  The research connects statistical forecast evaluation with practical model-risk
                  governance and develops a reproducible framework for assessing the reliability,
                  robustness, and calibration of machine-learning risk models.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- RESEARCH TRAJECTORY ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className={sectionH2}>Research Trajectory</h2>
          <p className="mt-5 font-mono text-[11px] font-bold uppercase leading-loose tracking-[0.2em] text-white/70">
            <InlineList items={TRAJECTORY_CHAIN} sep="→" sepColor={GOLD} />
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {TRAJECTORY.map((t, i) => (
              <div key={t.title}>
                <p className={monoLabel} style={{ color: GOLD }}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 text-base font-bold leading-snug">{t.title}</h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-white/70">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- RESEARCH FOCUS ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className={sectionH2}>Research Focus</h2>
          <p className="mt-3 max-w-2xl font-light leading-relaxed text-white/70">{FOCUS_INTRO}</p>
          <BulletList items={FOCUS} twoCol />
        </div>
      </section>

      {/* ---------- AREAS OF RESEARCH ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className={sectionH2}>Areas of Research</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {AREAS.map((a) => (
              <div key={a.title}>
                <h3 className={monoLabel} style={{ color: GOLD }}>
                  {a.title}
                </h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-white/70">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- RESEARCH QUESTIONS ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className={sectionH2}>Research Questions</h2>
          <div className="max-w-2xl">
            <BulletList items={QUESTIONS} />
          </div>
        </div>
      </section>

      {/* ---------- RESEARCH PHILOSOPHY ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className={sectionH2}>Research Philosophy</h2>
          <div
            className="mt-6 max-w-2xl space-y-4 border-l-2 pl-6 font-light leading-relaxed text-white/80"
            style={{ borderColor: GOLD }}
          >
            {PHILOSOPHY.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- TECHNICAL & QUANTITATIVE METHODS ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className={sectionH2}>Technical &amp; Quantitative Methods</h2>
          <div className="mt-8 space-y-7">
            {METHODS.map((m) => (
              <div key={m.title}>
                <h3 className={monoLabel} style={{ color: GOLD }}>
                  {m.title}
                </h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {m.items.map((item) => (
                    <li
                      key={item}
                      className="border border-white/15 px-2.5 py-1 font-mono text-[11px] text-white/70"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- RESEARCH & TECHNOLOGY PROJECTS ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className={sectionH2}>Research &amp; Technology Projects</h2>
          <p className="mt-3 max-w-2xl font-light leading-relaxed text-white/70">
            {PROJECTS_INTRO}
          </p>
          <div className="mt-8 grid gap-10 sm:grid-cols-2">
            {PROJECTS.map((p) => (
              <div key={p.title} className="border-l-2 border-white/15 pl-6">
                <h3 className="text-xl font-bold">{p.title}</h3>
                <div className="mt-3 space-y-3 text-sm font-light leading-relaxed text-white/70">
                  {p.body.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FUTURE RESEARCH DIRECTIONS ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className={sectionH2}>Future Research Directions</h2>
          <p className="mt-3 max-w-2xl font-light leading-relaxed text-white/70">{FUTURE_INTRO}</p>
          <p className="mt-4 font-light text-white/70">Key directions include:</p>
          <BulletList items={FUTURE} twoCol />
        </div>
      </section>

      {/* ---------- ABOUT THIS RESEARCH ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className={sectionH2}>About This Research</h2>
          <div className="mt-4 max-w-2xl space-y-4 font-light leading-relaxed text-white/70">
            {ABOUT_RESEARCH.map((p) => (
              <p key={p}>{p}</p>
            ))}
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
