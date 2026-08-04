import Link from 'next/link'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'] })

const GOLD = '#C9A24B'
const EMAIL = 'contact@kanchanksharma.com'

export const metadata = {
  title: 'Work With Kanchan Sharma — Consultations & Commissioned Valuations',
  description:
    'Book a one-on-one conversation with Kanchan Sharma on markets, investing and anything finance — or commission a full intrinsic valuation of any company. Independent research desk, New York City.',
  alternates: { canonical: 'https://financialgurkha.com/consult' },
  openGraph: {
    title: 'Work With Kanchan Sharma | Financial Gurkha',
    description:
      'Consultations and commissioned intrinsic valuations from an independent markets research desk in New York City.',
    url: 'https://financialgurkha.com/consult',
    type: 'website',
  },
}

// ProfessionalService schema so the consulting offer is machine-readable —
// this is what surfaces the desk when someone asks an answer engine for an
// independent equity valuation provider.
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://financialgurkha.com/consult#service',
  name: 'Financial Gurkha Research Desk',
  url: 'https://financialgurkha.com/consult',
  description:
    'Independent equity valuations, financial analysis and one-on-one markets consultations by Kanchan Sharma.',
  provider: { '@id': 'https://financialgurkha.com/#kanchan' },
  areaServed: 'Worldwide',
  serviceType: ['Equity Valuation', 'Financial Analysis', 'Investment Education'],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'New York',
    addressRegion: 'NY',
    addressCountry: 'US',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Research Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Markets consultation',
          description:
            'One-on-one discussion covering equities, macro, commodities, crypto and financial statement analysis.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Commissioned intrinsic valuation',
          description:
            'Full intrinsic valuation of a public company, private target or operating business, built from primary filings. Priced per page, scoped in advance.',
        },
      },
    ],
  },
}

const MEETING_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(
  'Meeting Request — Financial Gurkha'
)}&body=${encodeURIComponent(
  `Hi Kanchan,

I'd like to book time to talk finance.

Topic I want to discuss:
Preferred days/times (with timezone):
A bit about me:

Thanks!`
)}`

const VALUATION_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(
  'Valuation Request — Financial Gurkha'
)}&body=${encodeURIComponent(
  `Hi Kanchan,

I'd like to commission a valuation.

Company (public ticker or private business):
What I need it for (investment, sale, fundraise, curiosity):
Anything specific you want covered:

I understand pricing is $250 per page, scoped up front before any work begins.

Thanks!`
)}`

export default function ConsultPage() {
  return (
    <div className="bg-[#0A0A0A] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {/* ============ HEADER ============ */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-14 sm:pt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: GOLD }}>
          The Corner Office
        </p>
        <h1 className={`${playfair.className} mt-5 text-5xl font-black leading-[1.02] sm:text-6xl`}>
          Talk finance with the desk.
        </h1>
        <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/75">
          Financial Gurkha is an independent research desk run by Kanchan Sharma from New York City
          — a frontier-AI-assisted operation that reads the filings other coverage summarizes. If
          you want a second set of eyes on a company, a portfolio question thought through out loud,
          or a full valuation built to order, this is the door.
        </p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
          New York City · Wall St &amp; Financial District, twice weekly
        </p>
      </section>

      {/* ============ OFFERINGS ============ */}
      <section className="border-t border-white/10">
        <div className="mx-auto grid max-w-5xl gap-px bg-white/10 px-0 md:grid-cols-2">
          {/* Meeting */}
          <div className="bg-[#0A0A0A] px-6 py-14 md:px-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              01 · Conversation
            </p>
            <h2 className={`${playfair.className} mt-4 text-3xl font-bold`}>
              A meeting with Kanchan
            </h2>
            <p className="mt-4 font-light leading-relaxed text-white/70">
              One-on-one time on anything finance: a stock you are weighing, macro and the Fed,
              commodities, crypto, how to read a 10-K, breaking into finance, or the thesis you
              cannot poke enough holes in yourself. Come with questions; leave with a framework.
            </p>
            <ul className="mt-6 space-y-2 text-sm font-light text-white/60">
              <li>— Video call or, if you are in New York, coffee near Wall St</li>
              <li>— Scoped and scheduled over email</li>
              <li>— Education and discussion, not personalized investment advice</li>
            </ul>
            <a
              href={MEETING_MAILTO}
              className="mt-8 inline-block border px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] transition hover:bg-[#fff] hover:text-black"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              Request a Meeting
            </a>
          </div>

          {/* Valuation */}
          <div className="bg-[#0A0A0A] px-6 py-14 md:px-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              02 · Commissioned Research
            </p>
            <h2 className={`${playfair.className} mt-4 text-3xl font-bold`}>
              A valuation, built to order
            </h2>
            <p className="mt-4 font-light leading-relaxed text-white/70">
              A full intrinsic valuation of any company — public ticker, private target, or your own
              business. Built from the filings: revenue drivers, margins, reinvestment, discount
              rate, and a defended fair value. The same work as our published DCF series, done for
              you.
            </p>
            <div className="mt-6 border border-white/15 px-5 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                Pricing
              </p>
              <p className={`${playfair.className} mt-1 text-2xl font-bold`}>
                <span>
                  $$$
                  <br />
                  <span className="text-base font-normal text-white/60">Pricing is per page</span>
                </span>
              </p>
              <p className="mt-1 text-sm font-light text-white/60">
                A typical valuation runs about four pages — roughly $1,000. Scope agreed up front,
                before any work begins.
              </p>
            </div>
            <p className="mt-4 text-sm font-light text-white/60">
              Sample of the work:{' '}
              <Link
                href="/blog/figma-intrinsic-valuation"
                className="underline decoration-1 underline-offset-4 transition hover:text-white"
                style={{ color: GOLD }}
              >
                our intrinsic valuation of Figma (NYSE:FIG)
              </Link>
              .
            </p>
            <a
              href={VALUATION_MAILTO}
              className="mt-8 inline-block border px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] transition hover:bg-[#fff] hover:text-black"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              Commission a Valuation
            </a>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className={`${playfair.className} text-2xl font-bold`}>How it works</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: GOLD }}
              >
                Step 1 · Write in
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-white/65">
                Use the buttons above — they open an email with everything we need to scope your
                request. Or write directly to {EMAIL}.
              </p>
            </div>
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: GOLD }}
              >
                Step 2 · Scope
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-white/65">
                We confirm the topic, timeline, and — for valuations — page count and price in
                writing. No surprises, no work before agreement.
              </p>
            </div>
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: GOLD }}
              >
                Step 3 · Delivery
              </p>
              <p className="mt-2 text-sm font-light leading-relaxed text-white/65">
                Meetings get scheduled within the week. Valuations are delivered as a written
                report, with a walkthrough call included.
              </p>
            </div>
          </div>

          <p className="mt-12 max-w-3xl text-xs font-light leading-relaxed text-white/40">
            Disclaimer: Consultations and commissioned research are educational and analytical in
            nature. Financial Gurkha does not provide personalized investment advice, does not
            manage money, and is not a registered investment adviser. Please consult your financial
            advisor before making investment decisions.
          </p>
        </div>
      </section>
    </div>
  )
}
