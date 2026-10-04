'use client'

import { useEffect, useRef } from 'react'
import { track } from '@/app/lib/analytics'

/**
 * Fires `ad-disclaimer-read` once per visit to the ads disclosure page, so we
 * know how often readers check how Financial Gurkha makes money.
 *
 * `from` records the internal page the reader came from (usually an article,
 * via the ⓘ on an ad label). External referrers are reported as "external".
 */
export default function AdDisclaimerAnalytics() {
  const fired = useRef(false)

  useEffect(() => {
    if (fired.current) return
    fired.current = true

    let from = 'direct'
    try {
      if (document.referrer) {
        const ref = new URL(document.referrer)
        from = ref.host === window.location.host ? ref.pathname : 'external'
      }
    } catch {
      // Malformed referrer — keep the default.
    }

    track('ad-disclaimer-read', { from })
  }, [])

  return null
}
