'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, Suspense } from 'react'
import { usePostHog } from 'posthog-js/react'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { isTrackableEnvironment } from '../lib/analytics'

// The env file defines NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN. The older
// NEXT_PUBLIC_POSTHOG_KEY name is accepted as a fallback so a rename in either
// place cannot silently disable analytics again.
const POSTHOG_TOKEN =
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN || process.env.NEXT_PUBLIC_POSTHOG_KEY

const GA_ID = 'G-N9MVJV15MJ'

// A visit only counts once it has lasted this long, or the visitor has done
// something. Automated traffic overwhelmingly loads and leaves inside a second.
const QUALIFY_AFTER_MS = 2000

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!isTrackableEnvironment()) {
      if (process.env.NODE_ENV === 'development') {
        console.info('[Analytics] Non-production host or automated client — tracking disabled.')
      }
      return
    }

    if (!POSTHOG_TOKEN) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[PostHog] No project token found — analytics disabled.')
      }
      return
    }

    posthog.init(POSTHOG_TOKEN, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      autocapture: true,
      person_profiles: 'identified_only',
      // Pageviews are sent manually below, after the visit qualifies.
      capture_pageview: false,
      capture_pageleave: true,
      disable_session_recording: false,
      session_recording: { maskAllInputs: true },
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <SuspendedPageView />
      {children}
    </PHProvider>
  )
}

/**
 * Fires the pageview to PostHog and GA4 — but only once the visit qualifies.
 *
 * A visit qualifies when EITHER two seconds have elapsed with the tab visible,
 * OR the visitor scrolls, clicks, types or touches. Crawlers, uptime monitors
 * and scrapers load the document and move on well inside that window, so they
 * never register.
 *
 * The honest trade-off: a real person who genuinely bounces in under two
 * seconds is also not counted. That suppresses raw session numbers slightly and
 * flatters engagement rates. For a site at this traffic level, where a handful
 * of bot hits can double the apparent audience, having a smaller number you can
 * trust is worth more than a larger one you cannot.
 *
 * On client-side route changes the visitor has already qualified, so subsequent
 * pageviews fire immediately.
 */
function PageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const ph = usePostHog()
  const [qualified, setQualified] = useState(false)
  const gaConfigured = useRef(false)

  // Qualification runs once per page load.
  useEffect(() => {
    if (!isTrackableEnvironment()) return

    let done = false
    const qualify = () => {
      if (done) return
      done = true
      setQualified(true)
      cleanup()
    }

    // A tab that starts hidden is a background/prefetch load — do not start
    // the clock until it is actually looked at.
    const timer = window.setTimeout(() => {
      if (!document.hidden) qualify()
    }, QUALIFY_AFTER_MS)

    const events: (keyof WindowEventMap)[] = ['scroll', 'click', 'keydown', 'touchstart', 'mousemove']
    events.forEach((e) => window.addEventListener(e, qualify, { passive: true, once: true }))

    function cleanup() {
      window.clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, qualify))
    }
    return cleanup
  }, [])

  useEffect(() => {
    if (!qualified || !pathname) return
    if (!isTrackableEnvironment()) return

    let url = window.origin + pathname
    if (searchParams.toString()) url += '?' + searchParams.toString()

    const section = pathname.startsWith('/blog/')
      ? 'article'
      : pathname === '/blog'
        ? 'blog_index'
        : pathname === '/'
          ? 'home'
          : pathname.replace('/', '') || 'home'

    ph?.capture('$pageview', { $current_url: url, section })

    // GA4 is configured lazily for the same reason — no config call means no
    // hits are sent, so an unqualified visit costs Google nothing and never
    // appears in reports.
    if (!gaConfigured.current) {
      gaConfigured.current = true
      window.gtag?.('config', GA_ID, { send_page_view: false })
    }
    window.gtag?.('event', 'page_view', {
      page_path: pathname,
      page_location: url,
      section,
    })
  }, [qualified, pathname, searchParams, ph])

  return null
}

function SuspendedPageView() {
  return (
    <Suspense fallback={null}>
      <PageView />
    </Suspense>
  )
}
