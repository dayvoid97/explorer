import Link from 'next/link'
import { getAllNews } from '@/app/lib/news'
import { NewsShareButtons } from '@/app/news/share-buttons'

export const metadata = {
  title: 'The Daily Brief | Financial Gurkha News',
  description:
    "The day's money news, explained like a friend would. Short, plain-English briefs on markets, rates, and the economy — verified and sourced.",
  alternates: { canonical: 'https://financialgurkha.com/news' },
  openGraph: {
    title: 'The Daily Brief | Financial Gurkha News',
    description:
      "The day's money news, explained like a friend would. Short, plain-English briefs — verified and sourced.",
    url: 'https://financialgurkha.com/news',
    type: 'website',
    siteName: 'Financial Gurkha',
  },
}

export default async function NewsIndexPage() {
  const items = await getAllNews()
  const sorted = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      {/* Warm masthead */}
      <div className="text-center mb-10">
        <p
          className="mb-3 text-sm font-bold uppercase"
          style={{ letterSpacing: '0.28em', color: '#C9A24B' }}
        >
          Financial Gurkha
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold text-stone-900 mb-4"
          style={{ fontFamily: "'Freight Big Pro', Georgia, serif", letterSpacing: '-0.02em' }}
        >
          The Daily Brief
        </h1>
        <p
          className="text-lg text-stone-500 max-w-xl mx-auto leading-relaxed"
          style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
        >
          The day&apos;s money news, explained like a friend would. No jargon, no panic —
          just what happened, what it means for you, and where we got it.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-amber-100 bg-[#FDF9F0] p-10 text-center">
          <p className="text-stone-500 text-lg" style={{ fontFamily: 'Georgia, serif' }}>
            The news desk is brewing its first brief. Check back soon.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sorted.map((item) => (
            <article
              key={item.slug}
              className="rounded-2xl border border-amber-100 bg-[#FDF9F0] p-6 sm:p-8 shadow-[0_2px_16px_rgba(201,162,75,0.06)] hover:shadow-[0_4px_28px_rgba(201,162,75,0.14)] hover:-translate-y-0.5 transition"
            >
              <Link href={`/news/${item.slug}`} className="block">
                <div className="flex items-center gap-3 mb-3 text-sm text-stone-400">
                  <time>{item.date}</time>
                  {item.tags?.[0] && (
                    <>
                      <span>·</span>
                      <span className="text-amber-700 font-semibold">{item.tags[0]}</span>
                    </>
                  )}
                </div>
                <h2
                  className="text-2xl font-bold text-stone-900 mb-3 leading-snug"
                  style={{ fontFamily: "'Freight Big Pro', Georgia, serif" }}
                >
                  {item.headline}
                </h2>
                <p className="text-stone-600 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  {item.dek}
                </p>
                <span className="inline-block mt-4 text-sm font-bold text-amber-700">
                  Read the brief →
                </span>
              </Link>
              <div className="mt-4 pt-4 border-t border-amber-100/70">
                <NewsShareButtons
                  compact
                  title={item.headline}
                  url={`https://financialgurkha.com/news/${item.slug}`}
                  image={item.image}
                />
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
