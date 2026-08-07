'use client'

import { track } from '@/app/lib/analytics'

const GOLD = '#C9A24B'

/**
 * The two mailto buttons on /consult, extracted into a client component purely
 * so the click can be tracked.
 *
 * This is the single most valuable event on the site. A `mailto:` link opens an
 * external mail client and leaves no trace in any analytics tool, so without an
 * explicit click event there is literally no way to know whether the consult
 * page converts. Everything else measures attention; this measures intent.
 */
export default function ConsultCTA({
  href,
  intent,
  children,
}: {
  href: string
  intent: 'meeting' | 'valuation'
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      onClick={() =>
        track('consult_cta_clicked', {
          intent,
          // Where they came from matters more than the click itself — it tells
          // you which article drives paid work.
          referrer_path: typeof document !== 'undefined' ? document.referrer : undefined,
        })
      }
      className="mt-8 inline-block border px-7 py-3 font-mono text-xs uppercase tracking-[0.25em] transition hover:bg-white hover:text-black"
      style={{ borderColor: GOLD, color: GOLD }}
    >
      {children}
    </a>
  )
}
