'use client'

import { useEffect, useRef } from 'react'
import { trackArticle } from '@/app/lib/analytics'

/**
 * Reading-behaviour instrumentation for article pages.
 *
 * Answers the questions a pageview count cannot:
 *   - How far down does a reader actually get?
 *   - Do they finish, or bail at the tables?
 *   - How long do they genuinely spend reading, as opposed to leaving a tab open?
 *
 * Two deliberate choices:
 *
 * 1. ENGAGED TIME, NOT ELAPSED TIME. The timer pauses when the tab is hidden
 *    and when there has been no scroll, click, key or mouse movement for 30
 *    seconds. A tab left open over lunch should not report a 45-minute read.
 *
 * 2. MILESTONES FIRE ONCE. Scrolling back up and down again does not re-fire
 *    25%, so funnel numbers stay honest.
 */

const DEPTH_MILESTONES = [25, 50, 75, 90] as const
const IDLE_TIMEOUT_MS = 30_000
const HEARTBEAT_MS = 5_000

export default function ArticleAnalytics({
  slug,
  wordCount,
}: {
  slug: string
  wordCount?: number
}) {
  const fired = useRef<Set<number>>(new Set())
  const engagedMs = useRef(0)
  const lastActivity = useRef(Date.now())
  const maxDepth = useRef(0)
  const completed = useRef(false)
  const startedAt = useRef(Date.now())

  useEffect(() => {
    // Estimated reading time at ~230 words per minute, used to judge whether
    // someone plausibly read the piece or just scrolled to the bottom.
    const estimatedReadSec = wordCount ? Math.round((wordCount / 230) * 60) : undefined

    // Did the reader arrive at the top, or deep-linked into a section?
    // Google "jump to" results, ChatGPT citations and shared permalinks all
    // land people mid-article. Knowing WHICH section they enter at is the
    // single most useful thing for deciding where to place ads and what to
    // write more of — it is the point at which their query was answered.
    const entryHash = window.location.hash.replace('#', '') || null

    trackArticle('article_view', slug, {
      word_count: wordCount,
      estimated_read_seconds: estimatedReadSec,
      entry_section: entryHash ?? 'top',
      deep_linked: Boolean(entryHash),
      referrer_host: document.referrer ? new URL(document.referrer).hostname : 'direct',
    })

    if (entryHash) {
      trackArticle('article_deep_link_entry', slug, {
        entry_section: entryHash,
        referrer_host: document.referrer ? new URL(document.referrer).hostname : 'direct',
      })
    }

    const markActive = () => {
      lastActivity.current = Date.now()
    }

    const onScroll = () => {
      markActive()

      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      if (scrollable <= 0) return

      const pct = Math.min(100, Math.round((window.scrollY / scrollable) * 100))
      if (pct > maxDepth.current) maxDepth.current = pct

      for (const m of DEPTH_MILESTONES) {
        if (pct >= m && !fired.current.has(m)) {
          fired.current.add(m)
          trackArticle('article_scroll_depth', slug, {
            depth_percent: m,
            engaged_seconds: Math.round(engagedMs.current / 1000),
          })
        }
      }

      // 90% counts as finished — the last 10% is usually footer and related links.
      if (pct >= 90 && !completed.current) {
        completed.current = true
        const engagedSec = Math.round(engagedMs.current / 1000)
        trackArticle('article_read_complete', slug, {
          engaged_seconds: engagedSec,
          word_count: wordCount,
          // Did they spend enough time to plausibly have read it, or did they
          // scroll straight to the bottom? This is the quality signal.
          likely_genuine_read: estimatedReadSec ? engagedSec >= estimatedReadSec * 0.4 : undefined,
        })
      }
    }

    // Heartbeat accumulates engaged time only while the tab is visible and the
    // reader has done something recently.
    const heartbeat = setInterval(() => {
      const idle = Date.now() - lastActivity.current > IDLE_TIMEOUT_MS
      if (!document.hidden && !idle) engagedMs.current += HEARTBEAT_MS
    }, HEARTBEAT_MS)

    const activityEvents: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'click', 'touchstart']
    activityEvents.forEach((e) => window.addEventListener(e, markActive, { passive: true }))
    window.addEventListener('scroll', onScroll, { passive: true })

    // Final summary on exit. visibilitychange is more reliable than beforeunload
    // on mobile, where tabs are often backgrounded rather than closed.
    const onLeave = () => {
      if (document.visibilityState !== 'hidden') return
      trackArticle('article_exit', slug, {
        max_depth_percent: maxDepth.current,
        engaged_seconds: Math.round(engagedMs.current / 1000),
        total_seconds: Math.round((Date.now() - startedAt.current) / 1000),
        reached_end: completed.current,
        word_count: wordCount,
      })
    }
    document.addEventListener('visibilitychange', onLeave)

    onScroll() // capture the case where the page is already short enough to be fully visible

    return () => {
      clearInterval(heartbeat)
      window.removeEventListener('scroll', onScroll)
      activityEvents.forEach((e) => window.removeEventListener(e, markActive))
      document.removeEventListener('visibilitychange', onLeave)
    }
  }, [slug, wordCount])

  return null
}
