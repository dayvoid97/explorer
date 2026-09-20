import Link from 'next/link'
import Image from 'next/image'

const GOLD = '#C9A24B'

export const metadata = {
  title: 'About Financial Gurkha',
  description:
    'Financial Gurkha is an independent markets research publication founded in 2022, written from New York City. Equity valuations and earnings analysis read from primary SEC filings.',
  alternates: { canonical: 'https://financialgurkha.com/about' },
}

/**
 * /about is one of the pages AI assistants read when deciding what this
 * publication is. It previously said "Meet the Creators" over two portraits and
 * described a tools startup — which is why assistants characterised the site as
 * a personal project rather than a research publication. It now leads with what
 * the publication does and who is accountable for it.
 */
export default function AboutPage() {
  return (
    <div className="bg-[#0A0A0A] text-white">
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-12 sm:pt-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: GOLD }}>
          Independent Markets Research · Est. 2022 · New York City
        </p>
        <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">About Financial Gurkha</h1>

        <div className="mt-8 max-w-2xl space-y-5 text-lg font-light leading-relaxed text-white/75">
          <p>
            Financial Gurkha publishes independent equity valuations, earnings analysis and macro
            research. Every figure is taken from a primary source — SEC filings, earnings releases,
            call transcripts and official statistical data — rather than summarised from other
            coverage.
          </p>
          <p>
            We write in depth about a small number of situations rather than briefly about many. The
            aim is that a reader finishes an article understanding not just what a company reported,
            but which line in the filing actually mattered and why.
          </p>
          <p>
            The publication is written from New York City, and much of the work is done in and
            around the Financial District.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/about/kanchan"
            className="border px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] transition hover:bg-white hover:text-black"
            style={{ borderColor: GOLD, color: GOLD }}
          >
            Who Writes It →
          </Link>
          <Link
            href="/legal/editorial"
            className="border border-white/20 px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] text-white/70 transition hover:border-white hover:text-white"
          >
            Editorial Standards
          </Link>
        </div>
      </section>

      {/* ---------- PEOPLE ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: GOLD }}>
            The People
          </p>

          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/about/kanchan" className="group">
              <Image
                src="/kanchan.jpg"
                alt="Kanchan Sharma, founder and analyst"
                width={160}
                height={160}
                className="h-[160px] w-[160px] rounded-full object-cover grayscale-[30%] transition duration-500 group-hover:grayscale-0"
              />
              <p className="mt-4 text-xl font-bold">Kanchan Sharma</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                Founder &amp; Analyst
              </p>
              <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-white/65">
                Financial economics graduate, St. John&apos;s University. Writes the valuations and
                earnings analysis.
              </p>
            </Link>

            {/* Contributing author. No licensed portrait, so a monogram rather
                than a broken image or a stock headshot. */}
            <Link href="/about/niraj" className="group">
              <div
                className="flex h-[160px] w-[160px] items-center justify-center rounded-full border-2 text-4xl font-black transition duration-500"
                style={{ borderColor: GOLD, color: GOLD }}
                aria-hidden="true"
              >
                NN
              </div>
              <p className="mt-4 text-xl font-bold">Niraj Neupane</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                Contributing Author · Quantitative Research
              </p>
              <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-white/65">
                CA (ICAI). Quantitative researcher on Value-at-Risk, financial econometrics and
                model validation. Author of ML-LiqVaR.
              </p>
            </Link>

            <Link href="/about/akash" className="group">
              <Image
                src="/akash.jpg"
                alt="Akash Pariyar"
                width={160}
                height={160}
                className="h-[160px] w-[160px] rounded-full object-cover grayscale-[30%] transition duration-500 group-hover:grayscale-0"
              />
              <p className="mt-4 text-xl font-bold">Akash Pariyar</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
                Operations
              </p>
              <p className="mt-3 max-w-xs text-sm font-light leading-relaxed text-white/65">
                Manages the platform and publication operations.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- DISCLOSURE ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-14">
          <h2 className="text-2xl font-bold">Independence and limits</h2>
          <p className="mt-4 max-w-2xl font-light leading-relaxed text-white/70">
            Financial Gurkha has no outside ownership, no sponsor and no institutional affiliation.
            No company pays for coverage, and no company reviews an article before publication.
            Where the author holds or intends to hold a security discussed, that is disclosed in the
            article itself.
          </p>
          <p className="mt-4 max-w-2xl font-light leading-relaxed text-white/70">
            We are not a registered investment adviser, do not provide personalised investment
            advice, and do not manage money. Everything published is educational. Verify anything
            that matters against the filing before acting on it.
          </p>
          <p className="mt-6 text-sm text-white/50">
            Full details in our{' '}
            <Link
              href="/legal/editorial"
              className="underline decoration-1 underline-offset-4"
              style={{ color: GOLD }}
            >
              Editorial Standards &amp; Methodology
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
