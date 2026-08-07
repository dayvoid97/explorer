'use client'

import { useEffect, useId, useRef, useState } from 'react'

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
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label ? `Explain: ${label}` : 'More information'}
        className={`ml-1 inline-flex h-[1.15em] w-[1.15em] translate-y-[-0.1em] items-center justify-center rounded-full border text-[0.7em] font-bold leading-none transition-colors ${
          open ? 'text-black' : 'hover:text-black'
        }`}
        style={{
          borderColor: GOLD,
          color: open ? '#000' : GOLD,
          backgroundColor: open ? GOLD : 'transparent',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        }}
        onMouseEnter={(e) => {
          if (!open) e.currentTarget.style.backgroundColor = GOLD
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        {kind === 'q' ? '?' : 'i'}
      </button>

      <span
        id={panelId}
        role="note"
        className={`absolute left-1/2 top-[calc(100%+0.6em)] z-50 block w-[min(20rem,78vw)] -translate-x-1/2 rounded-sm border p-3 text-left shadow-xl transition-all duration-150 ${
          open
            ? 'visible opacity-100'
            : 'pointer-events-none invisible absolute h-px w-px overflow-hidden opacity-0'
        }`}
        style={{
          borderColor: `${GOLD}66`,
          backgroundColor: '#111111',
          // Neutralise inherited article typography (Times New Roman, 20px).
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif',
          fontSize: '0.85rem',
          fontWeight: 400,
          lineHeight: 1.55,
          fontStyle: 'normal',
          letterSpacing: 'normal',
          textAlign: 'left',
          whiteSpace: 'normal',
          color: 'rgba(255,255,255,0.82)',
        }}
      >
        {label && (
          <span
            className="mb-1 block text-[0.99rem] font-semibold uppercase tracking-[0.18em]"
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
