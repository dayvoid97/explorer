'use client'

import { useEffect, useRef, useState } from 'react'
import { track } from '@/app/lib/analytics'

/**
 * Shared loader for every AdSense slot on the site.
 *
 * Three things it gets right that a bare `adsbygoogle.push({})` does not:
 *
 * 1. QUEUE-SAFE PUSH.
 *    `(w.adsbygoogle = w.adsbygoogle || []).push({})` creates the array if the
 *    AdSense library has not loaded yet, and the library drains it on arrival.
 *    Guarding with `if (window.adsbygoogle)` instead — as the sidebar did —
 *    means the push is skipped entirely whenever the script has not landed,
 *    which with a lazily-loaded library is most of the time. Those slots simply
 *    never fill.
 *
 * 2. VIEWPORT GATING.
 *    The slot is only requested once it comes within roughly one screen of the
 *    viewport. Advertisers bid on *viewable* impressions and Google scores the
 *    whole site on its viewability rate, so impressions recorded for ads nobody
 *    scrolls past actively suppress the CPM on every other unit. Fewer, better-
 *    seen impressions usually earn more in total.
 *
 * 3. HIDDEN-CONTAINER GUARD.
 *    A slot inside a `hidden lg:block` wrapper still mounts on mobile. Without
 *    this check it requests an ad into a container with no layout box — an
 *    impression that can never be viewed, and a placement Google's policies
 *    treat as invalid. `offsetParent === null` catches display:none reliably.
 */
export function useAdSlot(position: string) {
  const ref = useRef<HTMLDivElement>(null)
  const [shouldRender, setShouldRender] = useState(false)
  const pushed = useRef(false)

  // Wait until the slot is both visible and near the viewport.
  useEffect(() => {
    const el = ref.current
    if (!el) return

    // display:none (e.g. the desktop sidebar on a phone) — never request.
    if (el.offsetParent === null) return

    if (typeof IntersectionObserver === 'undefined') {
      setShouldRender(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldRender(true)
          io.disconnect()
        }
      },
      // One screen of lead time, so the slot is filled by the time it is
      // scrolled to and the reader never sees an empty box.
      { rootMargin: '600px 0px' }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Request the ad exactly once, after the <ins> element exists in the DOM.
  useEffect(() => {
    if (!shouldRender || pushed.current) return
    pushed.current = true

    try {
      const w = window as unknown as { adsbygoogle?: unknown[] }
      ;(w.adsbygoogle = w.adsbygoogle || []).push({})
      track('ad_slot_loaded', { position })
    } catch {
      // Blocked or unavailable — never break the page for an ad.
    }
  }, [shouldRender, position])

  return { ref, shouldRender }
}
