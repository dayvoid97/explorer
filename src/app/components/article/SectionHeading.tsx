import React from 'react'

const GOLD = '#C9A24B'

const headingStyle = {
  fontFamily: "'Freight Big Pro', serif",
  fontWeight: 800,
  letterSpacing: '-0.05rem',
} as const

/**
 * Article section heading with two navigation affordances.
 *
 * `#`  — a permalink to this exact section. Readers share it, and it is what
 *        Google and answer engines use when they deep-link to the part of the
 *        page that answers a query.
 * `↑`  — jumps back to the table of contents. On a 5,000+ word piece the
 *        contents list is the map, and without a way back to it readers who
 *        finish a section have nowhere obvious to go except away.
 *
 * Deliberately NOT a client component. Both affordances are plain anchors, so
 * they work with JavaScript disabled, cost nothing at hydration, and stay
 * crawlable.
 */
export default function SectionHeading({
  as,
  id,
  children,
  showContentsLink = false,
  ...props
}: {
  as: 'h1' | 'h2' | 'h3'
  id: string
  children: React.ReactNode
  showContentsLink?: boolean
} & React.HTMLAttributes<HTMLHeadingElement>) {
  const Tag = as

  const sizing =
    as === 'h1'
      ? 'text-4xl mt-8 mb-4'
      : as === 'h2'
        ? 'text-3xl mt-10 mb-4'
        : 'text-2xl mt-6 mb-3'

  return (
    <Tag
      id={id}
      className={`group relative font-bold scroll-mt-24 ${sizing}`}
      style={headingStyle}
      {...props}
    >
      {children}

      {/* Permalink — revealed on hover so it never clutters the reading view,
          but always present in the DOM for crawlers and keyboard users. */}
      <a
        href={`#${id}`}
        aria-label="Link to this section"
        className="ml-2 align-middle text-[0.55em] font-normal opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
        style={{ color: GOLD, textDecoration: 'none' }}
      >
        #
      </a>

      {showContentsLink && (
        <a
          href="#whats-in-this-report"
          aria-label="Back to table of contents"
          title="Back to contents"
          className="ml-2 inline-flex items-center gap-1 align-middle text-[0.42em] font-normal uppercase tracking-[0.2em] opacity-0 transition-opacity focus:opacity-100 group-hover:opacity-100"
          style={{
            color: GOLD,
            textDecoration: 'none',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            letterSpacing: '0.2em',
          }}
        >
          ↑ Contents
        </a>
      )}
    </Tag>
  )
}
