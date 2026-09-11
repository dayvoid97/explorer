const GOLD = '#C9A24B'

/**
 * Citation block with a download call-to-action, for articles that summarise a
 * formal working paper.
 *
 * Usage in markdown/MDX (self-closing, on its own line — it renders a <div>, so
 * appending it to a paragraph produces invalid <p><div/></p> markup):
 *
 *   <Paper
 *     title="ML-LiqVaR: ..."
 *     authors="Niraj Neupane"
 *     venue="SSRN Working Paper"
 *     id="7222958"
 *     href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7222958"
 *   />
 *
 * The block emits ScholarlyArticle structured data as well as the visible card.
 * An article that summarises research is a secondary source; the markup is what
 * tells a crawler where the primary one lives, which is the difference between
 * this page being treated as commentary and being treated as the paper itself.
 */
export default function PaperCard({
  title,
  authors,
  venue = 'SSRN Working Paper',
  id,
  href,
  abstract,
  cta = 'Download the paper',
}: {
  title: string
  authors: string
  venue?: string
  id?: string
  href: string
  abstract?: string
  cta?: string
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: title,
    author: authors.split(',').map((name) => ({ '@type': 'Person', name: name.trim() })),
    publisher: { '@type': 'Organization', name: 'Social Science Research Network' },
    url: href,
    identifier: id ? `SSRN-id${id}` : undefined,
    abstract,
    inLanguage: 'en-US',
  }

  return (
    <div className="my-10 border border-black/15 bg-[#0A0A0A] p-6 text-white sm:p-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <p className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: GOLD }}>
        {venue}
        {id ? ` · Abstract ${id}` : ''}
      </p>

      <p className="mt-4 text-xl font-bold leading-snug text-white">{title}</p>
      <p className="mt-2 text-sm font-light text-white/60">{authors}</p>

      {abstract && (
        <p className="mt-4 max-w-2xl text-sm font-light leading-relaxed text-white/70">{abstract}</p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border px-6 py-3 font-mono text-xs uppercase tracking-[0.25em] no-underline transition hover:bg-white hover:text-black"
          style={{ borderColor: GOLD, color: GOLD }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {cta}
        </a>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
          Free · Opens on SSRN
        </span>
      </div>
    </div>
  )
}
