'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { track } from '@/app/lib/analytics'

const GOLD = '#C9A24B'

/**
 * Inline explainer badge for article text and tables.
 *
 * Usage in markdown/MDX:
 *   $1,777M <Info label="Marketable equity securities">Sandisk bought $970M of
 *   equity securities this year and marked them up by $804M.</Info>
 *
 *   Use kind="q" for a "?" badge instead of "i".
 *
 * Two design constraints drove the implementation:
 *
 * 1. EVERY ELEMENT IS INLINE-LEVEL (span/button, never div). The badge gets
 *    dropped inside table cells and paragraphs, and a <div> inside a <p> is
 *    invalid HTML that React reports as a hydration error. Absolute positioning
 *    works fine on a span, so nothing is lost.
 *
 * 2. THE EXPLANATION IS ALWAYS IN THE DOM. It is hidden with opacity and
 *    pointer-events rather than conditional rendering, so search crawlers and
 *    AI answer engines can read the text even when the popover is closed.
 *    Hiding content from users but not crawlers would be cloaking; hiding it
 *    behind a click the user can perform is a normal disclosure pattern.
 */
export default function InfoNote({
  label,
  kind = 'i',
  children,
}: {
  label?: string
  kind?: 'i' | 'q'
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const panelId = useId()

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <span ref={wrapRef} className="relative inline-block align-baseline">
      <button
        type="button"
        onClick={() => {
          const next = !open
          setOpen(next)
          // Only opens are tracked. Which terms readers click is a direct map of
          // where the writing loses people — the most actionable editorial
          // signal available, and it costs nothing to collect.
          if (next) {
            track('explainer_opened', {
              term: label ?? 'unlabelled',
              kind,
              path: typeof window !== 'undefined' ? window.location.pathname : undefined,
            })
          }
        }}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label ? `Explain: ${label}` : 'More information'}
        // Sits raised like a superscript. translate-y is used rather than
        // vertical-align:super so the badge does not alter the line box and
        // push surrounding text or table rows around.
        className={`ml-[0.15em] inline-flex h-[1.05em] w-[1.05em] -translate-y-[0.42em] items-center justify-center rounded-full border text-[0.62em] font-bold leading-none transition-colors duration-150 ${
          open
            ? 'border-black bg-black text-white'
            : 'border-[#C9A24B] bg-white text-[#C9A24B] hover:border-black hover:bg-black hover:text-white'
        }`}
        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
      >
        {kind === 'q' ? '?' : 'i'}
      </button>

      <span
        id={panelId}
        role="note"
        className={`absolute left-1/2 top-[calc(100%+0.6em)] z-[500] block w-[min(40rem,78vw)] -translate-x-1/2 rounded-sm border p-3 text-left shadow-xl transition-all duration-150 ${
          open
            ? 'visible opacity-80'
            : 'pointer-events-none invisible absolute h-px w-px overflow-hidden opacity-0'
        }`}
        style={{
          borderColor: `${GOLD}66`,
          backgroundColor: '#111111',
          // Neutralise inherited article typography (Times New Roman, 20px).
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
          fontSize: '0.99rem',
          fontWeight: 600,
          lineHeight: 1.99,
          fontStyle: 'normal',
          letterSpacing: 'normal',
          textAlign: 'left',
          whiteSpace: 'normal',
          color: 'rgba(255,255,255,0.99)',
        }}
      >
        {label && (
          <span
            className="mb-1 block text-[0.72rem] font-semibold uppercase tracking-[0.18em]"
            style={{ color: GOLD }}
          >
            {label}
          </span>
        )}
        <span className="block">{children}</span>
      </span>
    </span>
  )
}
