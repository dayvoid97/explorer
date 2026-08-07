import React from 'react'
import Link from 'next/link'

const GOLD = '#C9A24B'

interface LegalPolicy {
  id: string
  title: string
  content: string
}

interface LegalPoliciesProps {
  policies: LegalPolicy[]
  activePolicy: string
}

/* ------------------------------------------------------------------ *
 * Parsing
 * ------------------------------------------------------------------ */

type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'para'; text: string }
  | { kind: 'meta'; text: string }

/**
 * Turn the plain-text policy into structured blocks.
 *
 * The previous version dumped the whole string into a <pre>, which meant no
 * heading hierarchy, no wrapping (long paragraphs ran off the side of the
 * container), and nothing for a crawler or screen reader to navigate by. Legal
 * pages are read by both — and after an AI audit flagged our legal pages as a
 * credibility problem, "unreadable" is not the impression to leave.
 *
 * Two heading shapes appear in our policies:
 *   "1. Introduction"        — numbered sections (Terms, Privacy, Copyright)
 *   "Who publishes this"     — unnumbered sections (Editorial Standards)
 *
 * The unnumbered case is inferred: a short line with no terminal punctuation,
 * followed by more content, is a heading rather than a sentence.
 */
function parsePolicy(content: string, docTitle: string): Block[] {
  const lines = content.split('\n')
  const blocks: Block[] = []
  let seen = 0

  lines.forEach((raw, i) => {
    const line = raw.trim()
    if (!line) return
    seen += 1

    // Drop the masthead lines at the top of each document — the document title
    // and the "Financial Gurkha — <policy>" line are already rendered as the
    // page <h1>, and repeating them creates two competing headings.
    if (seen <= 3) {
      const normalized = line.toLowerCase().replace(/\s*[—–-]\s*/g, ' ')
      const titleNorm = docTitle
        .toLowerCase()
        .replace(/\s*[—–-]\s*/g, ' ')
        .replace(/&/g, 'and')
      if (
        normalized === titleNorm ||
        normalized === 'financial gurkha' ||
        normalized.startsWith('financial gurkha ' + titleNorm) ||
        normalized.replace('financial gurkha ', '') === titleNorm
      ) {
        return
      }
    }

    if (/^last updated:/i.test(line)) {
      blocks.push({ kind: 'meta', text: line })
      return
    }

    // "1. Introduction" style.
    if (/^\d+\.\s+\S/.test(line) && line.length < 90) {
      blocks.push({ kind: 'heading', text: line })
      return
    }

    // Unnumbered heading: short, no terminal punctuation, and followed by text.
    const nextLine = lines.slice(i + 1).find((l) => l.trim())
    const looksLikeHeading =
      line.length < 70 && !/[.,;:!?]$/.test(line) && Boolean(nextLine) && !/^\d/.test(line)

    if (looksLikeHeading) {
      blocks.push({ kind: 'heading', text: line })
      return
    }

    blocks.push({ kind: 'para', text: line })
  })

  return blocks
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/^\d+\.\s*/, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

/** Turn bare emails and URLs in body text into real links. */
function linkify(text: string, keyPrefix: string) {
  const parts = text.split(
    /(\b[\w.+-]+@[\w-]+\.[\w.]+\b|\bhttps?:\/\/\S+|\b[\w-]+\.(?:com|gov|org)\b)/g
  )
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`
    if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(part)) {
      return (
        <a
          key={key}
          href={`mailto:${part}`}
          className="underline decoration-1 underline-offset-4"
          style={{ color: GOLD }}
        >
          {part}
        </a>
      )
    }
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={key}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-1 underline-offset-4"
          style={{ color: GOLD }}
        >
          {part}
        </a>
      )
    }
    return <React.Fragment key={key}>{part}</React.Fragment>
  })
}

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */

export default function LegalPolicies({ policies, activePolicy }: LegalPoliciesProps) {
  const currentPolicy = policies.find((policy) => policy.id === activePolicy)

  if (!currentPolicy) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <h1 className="mb-4 text-3xl font-bold text-white">Policy not found</h1>
        <Link href="/legal/terms" className="underline" style={{ color: GOLD }}>
          Back to Terms of Service
        </Link>
      </div>
    )
  }

  const blocks = parsePolicy(currentPolicy.content, currentPolicy.title)
  const lastUpdated = blocks.find((b) => b.kind === 'meta')?.text
  const headings = blocks.filter(
    (b): b is { kind: 'heading'; text: string } => b.kind === 'heading'
  )

  return (
    <div className="bg-[#0A0A0A] text-white">
      {/* ---------- HEADER ---------- */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-10 sm:pt-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.35em]" style={{ color: GOLD }}>
            Financial Gurkha · Legal
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            {currentPolicy.title}
          </h1>
          {lastUpdated && (
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
              {lastUpdated}
            </p>
          )}

          {/* Policy switcher */}
          <nav className="mt-8 flex flex-wrap gap-2">
            {policies.map((p) => {
              const active = p.id === activePolicy
              return (
                <Link
                  key={p.id}
                  href={`/legal/${p.id}`}
                  className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition ${
                    active
                      ? 'border-[#C9A24B] bg-[#C9A24B] text-black'
                      : 'border-white/15 text-white/60 hover:border-[#C9A24B] hover:text-[#C9A24B]'
                  }`}
                >
                  {p.title}
                </Link>
              )
            })}
          </nav>
        </div>
      </section>

      {/* ---------- BODY ---------- */}
      <div className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_220px]">
          {/* Content */}
          <article className="max-w-2xl">
            {blocks.map((block, i) => {
              if (block.kind === 'meta') return null

              if (block.kind === 'heading') {
                return (
                  <h2
                    key={i}
                    id={slugify(block.text)}
                    className="mt-10 mb-3 scroll-mt-24 text-lg font-bold first:mt-0"
                    style={{ fontFamily: "'Freight Big Pro', Georgia, serif" }}
                  >
                    {block.text}
                  </h2>
                )
              }

              return (
                <p key={i} className="mb-4 text-[15px] leading-relaxed text-white/75">
                  {linkify(block.text, String(i))}
                </p>
              )
            })}
          </article>

          {/* On-this-page nav — legal documents are scanned, not read start to
              finish, so a jump list is worth more here than on an article. */}
          {headings.length > 3 && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p
                  className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em]"
                  style={{ color: GOLD }}
                >
                  On this page
                </p>
                <ul className="space-y-2 border-l border-white/10 pl-4">
                  {headings.map((h, i) => (
                    <li key={i}>
                      <a
                        href={`#${slugify(h.text)}`}
                        className="block text-xs leading-snug text-white/45 transition hover:text-white"
                      >
                        {h.text.replace(/^\d+\.\s*/, '')}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </div>

      {/* ---------- CONTACT ---------- */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="max-w-2xl border border-white/15 px-6 py-8">
            <h3 className="text-lg font-bold">Questions about this policy?</h3>
            <p className="mt-2 text-sm font-light leading-relaxed text-white/65">
              Corrections, legal questions and rights requests all go to the same address, and are
              answered by a person.
            </p>
            <a
              href="mailto:contact@kanchanksharma.com"
              className="mt-6 inline-block border px-6 py-3 font-mono text-[11px] uppercase tracking-[0.25em] transition hover:bg-white hover:text-black"
              style={{ borderColor: GOLD, color: GOLD }}
            >
              contact@kanchanksharma.com
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
