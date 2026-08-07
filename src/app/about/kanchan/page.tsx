import Link from 'next/link'
import Image from 'next/image'

const GOLD = '#C9A24B'
const EMAIL = 'contact@kanchanksharma.com'

export const metadata = {
  title: 'About Financial Gurkha & Kanchan Sharma',
  description:
    'Financial Gurkha is an independent markets research publication founded in 2022 and written from New York City by Kanchan Sharma. Equity valuations and earnings analysis sourced from primary SEC filings.',
  alternates: { canonical: 'https://financialgurkha.com/about/kanchan' },
  openGraph: {
    title: 'About Financial Gurkha & Kanchan Sharma',
    description:
      'Independent markets research from New York City. Who writes it, how the numbers are sourced, and what this publication is not.',
    url: 'https://financialgurkha.com/about/kanchan',
    type: 'profile',
  },
}

/**
 * Author and publication page.
 *
 * This page exists to answer one question for both readers and AI assistants:
 * who is behind this and why should the numbers be trusted?
 *
 * An AI visibility audit found assistants describing Financial Gurkha as "a
 * personal project focused on finance, technology, tools, and writing — not a
 * research firm with a documented process", and scoring transparency 5/10 for
 * "limited professional/organizational detail". The previous version of this
 * page described a tools startup building "company cards"; nothing on it
 * established credentials, sourcing discipline or independence. For finance
 * content — which Google classes as YMYL and holds to a higher evidence
 * standard — that is the single most expensive page on the site to get wrong.
 */
export default function AboutKanchanPage() {
  return (
    <div className="bg-[#0A0A0A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            name: 'About Financial Gurkha',
            url: 'https://financialgurkha.com/about/kanchan',
            mainEntity: { '@id': 'https://financialgurkha.com/#kanchan' },
            publisher: { '@id': 'https://financialgurkha.com/#organization' },
          }),
        }}
      />

      {/* ---------- HEADER ---------- */}
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-12 sm:pt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: GOLD }}>
          About · Independent Markets Research · Est. 2022
        </p>
        <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">
          Who writes Financial Gurkha, and how the numbers get here.
        </h1>
        <p className="mt-6 text-lg font-light leading-relaxed text-white/75">
          Financial Gurkha is an independent markets research publication founded in 2022 and
          written from New York City. It covers equity valuations, earnings and macro — read from
          primary filings rather than summarised from other coverage.
        </p>
      </section>

      {/* ---------- THE PERSON ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-4xl gap-10 px-6 py-14 sm:grid-cols-[200px_1fr]">
          <div>
            <Image
              src="/kanchan.jpg"
              alt="Kanchan Sharma, founder and analyst, Financial Gurkha"
              width={200}
              height={200}
              className="h-[200px] w-[200px] rounded-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Kanchan Sharma</h2>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
              Founder &amp; Analyst · New York City
            </p>
            <div className="mt-5 space-y-4 font-light leading-relaxed text-white/75">
              <p>
                I hold a bachelor&apos;s degree in financial economics from St. John&apos;s
                University and have spent well over a thousand hours building valuation models —
                discounted cash flow work on public companies, private targets and operating
                businesses.
              </p>
              <p>
                The work covers US equities and earnings, macro and the Federal Reserve,
                commodities, semiconductors and memory, and digital assets. Where something has a
                cash flow today, a plausible cash flow tomorrow, or an underlying that can be
                capitalised, it can be valued — and that is the range this publication works across.
              </p>
              <p>
                Financial Gurkha is written from New York. I am in the Financial District and around
                Wall Street at least twice a week, and much of the writing is done there.
              </p>
            </div>
            <p className="mt-6 text-sm text-white/50">
              Reach me at{' '}
              <a
                href={`mailto:${EMAIL}`}
                className="underline decoration-1 underline-offset-4"
                style={{ color: GOLD }}
              >
                {EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- METHOD ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className="text-2xl font-bold">How the work is done</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: GOLD }}
              >
                Primary sources only
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
                Every figure comes from a 10-K, 10-Q, 8-K, earnings release, investor presentation,
                call transcript, or an official statistical release. We do not repeat numbers from
                other financial media without going back to the filing.
              </p>
            </div>
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: GOLD }}
              >
                Arithmetic shown
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
                The most useful numbers — incremental margin, free cash flow margin, implied growth
                — are rarely printed in a filing. Where we calculate rather than quote, we show the
                working so you can check it.
              </p>
            </div>
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: GOLD }}
              >
                Assumptions stated
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
                A valuation is an opinion supported by arithmetic, not a fact. Growth, margin,
                reinvestment and discount rate are stated explicitly. Its value lies in being
                transparent enough for you to disagree with.
              </p>
            </div>
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: GOLD }}
              >
                Conflicts disclosed
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-white/70">
                Where the author holds or intends to hold a security discussed, it is disclosed in
                the article, before the analysis. No company pays for coverage, and no company sees
                an article before publication.
              </p>
            </div>
          </div>

          <p className="mt-10 text-sm text-white/60">
            The full methodology, corrections policy and disclosure rules are set out in our{' '}
            <Link
              href="/legal/editorial"
              className="underline decoration-1 underline-offset-4"
              style={{ color: GOLD }}
            >
              Editorial Standards
            </Link>
            . Every valuation we have published, with outcomes — including the ones that went
            against us — is on the{' '}
            <Link
              href="/track-record"
              className="underline decoration-1 underline-offset-4"
              style={{ color: GOLD }}
            >
              track record
            </Link>{' '}
            page.
          </p>
        </div>
      </section>

      {/* ---------- WHAT THIS IS NOT ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className="text-2xl font-bold">What this publication is not</h2>
          <p className="mt-4 max-w-2xl font-light leading-relaxed text-white/70">
            Being clear about the limits is part of being credible about the rest.
          </p>
          <ul className="mt-6 space-y-3 text-sm font-light text-white/65">
            <li>
              — <span className="text-white/85">Not a registered investment adviser.</span> Financial
              Gurkha is not registered with the SEC, FINRA or any state regulator. We do not give
              personalised investment advice and do not manage money.
            </li>
            <li>
              — <span className="text-white/85">Not a real-time data service.</span> We do not carry
              live quotes, options-implied moves, consensus estimates or transcript coverage of every
              company.
            </li>
            <li>
              — <span className="text-white/85">Not comprehensive.</span> We write in depth about a
              small number of situations rather than briefly about many. Coverage is selective by
              design.
            </li>
            <li>
              — <span className="text-white/85">Not a documented performance record.</span> We
              publish valuations and reasoning, not a track record of returns, and we do not claim
              forecasting accuracy we have not evidenced.
            </li>
          </ul>
          <p className="mt-8 max-w-2xl text-sm font-light leading-relaxed text-white/60">
            Use this as independent research and a starting point — then verify anything that
            matters against the filing itself. That is what we do, and it is what we would want a
            reader to do with our work.
          </p>
        </div>
      </section>

      {/* ---------- AI DISCLOSURE ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className="text-2xl font-bold">On the use of AI</h2>
          <p className="mt-4 max-w-2xl font-light leading-relaxed text-white/70">
            We use AI tools in research and drafting — reading long filings, checking arithmetic,
            structuring drafts. Every published figure is verified against the primary source by a
            human, and the editorial judgement, the argument and the conclusions are the
            author&apos;s. We would rather state this plainly than leave it unsaid.
          </p>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className="text-2xl font-bold">Work with the desk</h2>
          <p className="mt-4 max-w-2xl font-light leading-relaxed text-white/70">
            Commissioned valuations for public companies, private targets and operating businesses,
            and one-on-one consultations on markets and financial statements.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/consult"
              className="border px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] transition hover:bg-white hover:text-black"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              Commission Research
            </Link>
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
