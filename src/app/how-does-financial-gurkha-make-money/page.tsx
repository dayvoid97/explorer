import Link from 'next/link'
import AdDisclaimerAnalytics from './AdDisclaimerAnalytics'

const SITE = 'https://financialgurkha.com'
const PATH = '/how-does-financial-gurkha-make-money'
const EMAIL = 'contact@kanchanksharma.com'
const LAST_UPDATED = 'October 4, 2026'

export const metadata = {
  title: 'How Does Financial Gurkha Make Money?',
  description:
    'Financial Gurkha is funded by Google AdSense ads, consultations with Kanchan Sharma, and affiliate links on books and products. A plain disclosure.',
  alternates: { canonical: `${SITE}${PATH}` },
  openGraph: {
    title: 'How Does Financial Gurkha Make Money?',
    description: 'Ads, consulting and affiliate links. A plain disclosure.',
    url: `${SITE}${PATH}`,
    type: 'website',
  },
}

// Not shown on the page. Emitted as FAQPage data so search and answer engines
// can quote the disclosure directly.
const FAQS = [
  {
    q: 'How does Financial Gurkha make money?',
    a: 'Google AdSense ads, paid consultations with founder Kanchan Sharma, and affiliate commissions on books and products linked from the site.',
  },
  {
    q: 'Are the book links on Financial Gurkha affiliate links?',
    a: 'Most likely, yes. We may earn a small commission if you buy. Which books we feature does not depend on it.',
  },
  {
    q: 'How can I tell if a link earns Financial Gurkha a commission?',
    a: 'Assume it does. An affiliate link or external product link on Financial Gurkha earns us a kickback about 99% of the time.',
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
        <h2 className="text-lg font-black uppercase tracking-wide">{title}</h2>
        <p className="mt-1 text-[16px] leading-snug text-gray-800">{children}</p>
      </div>
    </li>
  )
}

export default function HowWeMakeMoneyPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-12 text-black sm:py-16" style={SANS}>
      <AdDisclaimerAnalytics />
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
        <p className="text-xs font-black uppercase tracking-[0.3em]">Public notice · Disclosure</p>
        <h1 className="mt-3 text-4xl font-black leading-none tracking-tight sm:text-5xl">
          How we make money.
        </h1>
        <p className="mt-3 text-[16px] leading-snug text-gray-800">
          Three ways. No secrets.
        </p>

        <ol className="mt-6">
          <Item n={1} title="Ads">
            Served by Google AdSense, our preferred partner. Google picks the ads, not us. Every ad
            is labelled “Advertisement.”
          </Item>
          <Item n={2} title="Consulting">
            Paid sessions with founder Kanchan Sharma.{' '}
            <Link href="/consult" className={link}>
              Book one
            </Link>
            .
          </Item>
          <Item n={3} title="Affiliate links">
            Book and product links most likely pay us a small commission if you buy. It never
            decides which books we pick.
          </Item>
        </ol>

        <div className="border-t-2 border-black pt-5">
          <h2 className="text-lg font-black uppercase tracking-wide">Why ads?</h2>
          <ul className="mt-2 space-y-1 text-[16px] leading-snug text-gray-800">
            <li>— They keep Financial Gurkha running and free to read.</li>
            <li>— Nothing wrong with making bread from research.</li>
            <li>— New York City is expensive. We love it anyway.</li>
            <li>— They fund the tools we’re building next.</li>
          </ul>
        </div>

        <div className="mt-6 border-4 border-black p-4 text-center">
          <p className="text-xl font-black uppercase leading-tight sm:text-2xl">
            See a product link? Assume we get paid.
          </p>
          <p className="mt-1 text-sm text-gray-700">True about 99% of the time.</p>
        </div>
      </div>

      <p className="mt-6 text-sm leading-snug text-gray-600">
        Ads don’t buy coverage (
        <Link href="/legal/editorial" className="underline underline-offset-4">
          Editorial Standards
        </Link>
        ). Cookies and ad opt-out:{' '}
        <Link href="/legal/privacy" className="underline underline-offset-4">
          Privacy Policy
        </Link>
        . Questions:{' '}
        <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">
          {EMAIL}
        </a>
        . Updated {LAST_UPDATED}.
      </p>
    </main>
  )
}
