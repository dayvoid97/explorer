'use client'

import posthog from 'posthog-js'

/**
 * One call, both destinations.
 *
 * PostHog answers "what did this person do, in what order, and did they come
 * back" — session replay, funnels, retention.
 * GA4 answers "where did they come from and does Google think this page is
 * good" — and it is what Search Console and AdSense correlate against.
 *
 * Sending to both from a single helper means we never end up with an event
 * that exists in one tool and not the other, which is the usual way analytics
 * rots over six months.
 */

type Props = Record<string, string | number | boolean | undefined | null>

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void
  }
}

/* ------------------------------------------------------------------ *
 * Environment and bot filtering
 * ------------------------------------------------------------------ */

// Hostnames that must never send analytics: local development, Vercel preview
// deployments, and anything on a .local domain. Without this, every dev refresh
// counts as a session and the numbers at low traffic become meaningless.
const NON_PRODUCTION_HOST =
  /^localhost$|^127\.0\.0\.1$|^0\.0\.0\.0$|^\[::1\]$|\.local$|\.vercel\.app$|^192\.168\.|^10\./

// User-agent fragments belonging to crawlers, scrapers, monitors and headless
// browsers. Not exhaustive — no client-side list can be — but it removes the
// obvious, high-volume offenders.
const BOT_UA =
  /bot|crawler|spider|crawling|slurp|headless|phantom|puppeteer|playwright|selenium|scrapy|curl|wget|python-requests|axios|node-fetch|go-http|java\/|okhttp|lighthouse|pagespeed|gtmetrix|pingdom|uptimerobot|statuscake|semrush|ahrefs|mj12|dotbot|petalbot|bytespider|dataforseo|screaming frog|preview|facebookexternalhit|whatsapp|telegrambot|slackbot|discordbot|embedly|quora link|vkshare|w3c_validator/i

/**
 * Should this visit be recorded at all?
 *
 * Runs three checks:
 *
 * 1. HOSTNAME — never record localhost or preview deployments.
 * 2. navigator.webdriver — set by every automation framework. The single most
 *    reliable headless-browser signal available in the browser.
 * 3. USER AGENT — known crawler and monitoring signatures.
 *
 * Note on the Singapore question: country is deliberately NOT a filter here.
 * Singapore is both a major financial centre with genuine readers and the home
 * of AWS ap-southeast-1, GCP and DigitalOcean regions — so datacenter traffic
 * originates there in volume. Blocking the country would discard real audience
 * along with the bots. Filtering on bot *characteristics* removes the automated
 * traffic wherever it comes from, and leaves real Singaporean readers counted.
 */
export function isTrackableEnvironment(): boolean {
  if (typeof window === 'undefined') return false

  if (NON_PRODUCTION_HOST.test(window.location.hostname)) return false

  const nav = window.navigator
  if (nav.webdriver) return false
  if (BOT_UA.test(nav.userAgent)) return false

  // A browser reporting zero languages is almost always automated.
  if (!nav.languages || nav.languages.length === 0) return false

  return true
}

export function track(event: string, props: Props = {}) {
  if (typeof window === 'undefined') return
  if (!isTrackableEnvironment()) return

  // Strip undefined/null so neither tool records empty dimensions.
  const clean: Record<string, string | number | boolean> = {}
  for (const [k, v] of Object.entries(props)) {
    if (v !== undefined && v !== null) clean[k] = v
  }

  try {
    posthog.capture(event, clean)
  } catch {
    // PostHog blocked or not yet initialised — never break the page for analytics.
  }

  try {
    window.gtag?.('event', event, clean)
  } catch {
    /* same */
  }
}

/**
 * Article-level context attached to every event fired from a post page, so
 * PostHog can segment by article without joining on URL strings.
 */
export function trackArticle(event: string, slug: string, props: Props = {}) {
  track(event, { article_slug: slug, ...props })
}

/**
 * Original PostHog-only helper, kept for the existing signup and card-creation
 * flows. It now routes through `track` so those events reach GA4 as well —
 * previously they were invisible outside PostHog.
 */
export function trackEvent(name: string, properties: Record<string, unknown> = {}) {
  track(name, properties as Props)
}
