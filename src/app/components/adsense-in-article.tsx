'use client'

import { useEffect, useRef } from 'react'

/**
 * In-article AdSense unit — mobile and tablet only.
 *
 * On large screens the article layout already carries a sidebar skyscraper
 * (see AdSenseSidebarAd), so in-content units there would double up and hurt
 * the reading experience. `lg:hidden` keeps this to narrow viewports where the
 * sidebar isn't rendered.
 *
 * Two implementation notes:
 * 1. This renders a <div>, so it must be injected as a standalone block in the
 *    markdown — never appended inside a paragraph, which produces invalid
 *    <p><div/></p> markup and a React hydration error.
 * 2. The push() call runs in useEffect rather than an inline <script> tag.
 *    React does not execute inline scripts inserted via dangerouslySetInnerHTML
 *    during hydration, so the old approach silently failed to fill some slots.
 */
export const AdSenseInArticle = () => {
  const pushed = useRef(false)

  useEffect(() => {
    // Guard against double-push under React strict mode, which would throw
    // "adsbygoogle.push() error: All ins elements already have ads".
    if (pushed.current) return
    pushed.current = true

    try {
      const w = window as unknown as { adsbygoogle?: unknown[] }
      ;(w.adsbygoogle = w.adsbygoogle || []).push({})
    } catch {
      // AdSense unavailable (ad blocker, dev environment) — fail silently.
    }
  }, [])

  return (
    <div className="my-8 lg:hidden">
      <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
        Advertisement
      </p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-8441965953327461"
        data-ad-slot="9398911626"
      />
    </div>
  )
}
