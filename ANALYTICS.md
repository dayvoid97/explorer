# Analytics — Financial Gurkha

Every custom event fires to **PostHog and GA4 from one call** (`src/app/lib/analytics.ts`).
PostHog answers *what did this person do and did they come back*. GA4 answers
*where did they come from and does Google rate this page*. Neither alone is enough.

---

## Two bugs this fixed

**1. PostHog was completely dead.** The provider initialised with
`NEXT_PUBLIC_POSTHOG_KEY`, but `.env` defines `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`.
It was calling `posthog.init(undefined)`. It now reads the correct name and falls
back to the old one, and warns in dev if neither is set.

**2. The provider was never mounted.** `<PostHogProvider>` did not appear in
`layout.tsx` at all. Even with a correct token, nothing would have been recorded.
It now wraps the whole app.

Also fixed: the gtag init used `function gtag(){}` inside a block, which left
`window.gtag` undefined — so any custom event sent from a component silently
vanished. It is now assigned to `window` explicitly.

---

## Filtering: what never gets recorded

Three gates run before anything is sent. All of them live in
`isTrackableEnvironment()` (`src/app/lib/analytics.ts`) plus the qualification
timer in `PostHogProvider`.

**1. Non-production hosts.** `localhost`, `127.0.0.1`, `.local`, `*.vercel.app`
and private LAN ranges send nothing. Every dev refresh was previously a session,
which at 20 visitors a day badly distorts the numbers.

**2. Automated clients.** Blocked on any of:
- `navigator.webdriver` — set by Puppeteer, Playwright, Selenium and every
  headless framework. The most reliable bot signal available in a browser.
- Known crawler / monitor / scraper user agents (~40 patterns: `bot`, `spider`,
  `headless`, `curl`, `python-requests`, `uptimerobot`, `ahrefs`, `semrush`,
  `bytespider`, `facebookexternalhit`, and so on).
- Zero reported `navigator.languages`, which is almost always automation.

**3. The two-second qualification gate.** A visit is only recorded once **either**
two seconds have elapsed with the tab visible **or** the visitor scrolls, clicks,
types or touches. Crawlers, uptime monitors and scrapers load and leave well
inside that window.

Implementation detail worth knowing: `gtag('config', ...)` is **not** called in
`layout.tsx` any more. Until config runs, gtag calls only queue into `dataLayer`
and nothing reaches Google. Config fires from `PostHogProvider` after
qualification — so an unqualified visit never produces a GA hit at all, rather
than producing one that has to be filtered later.

A tab that starts hidden (prefetch, background open) does not start the clock.

### The trade-off, stated plainly

A real person who genuinely bounces in under two seconds is also not counted.
This suppresses raw session numbers slightly and flatters engagement rates. At
this traffic level, where a handful of bot hits can double the apparent
audience, a smaller number you can trust beats a larger one you cannot.

### On the Singapore traffic

Country is deliberately **not** a filter. Singapore is simultaneously a major
financial centre with real readers for this exact subject matter, and the home
of AWS `ap-southeast-1`, GCP and DigitalOcean regions — so a lot of datacenter
traffic genuinely originates there. Blocking the country would throw away real
audience alongside the bots.

The bot-characteristic filters above remove automated traffic wherever it comes
from. To confirm the theory after a week of clean data, in PostHog compare
Singapore sessions against `article_scroll_depth` and `engaged_seconds` — real
readers scroll and accumulate engaged time; bots do neither. If Singapore still
shows volume with zero scroll events, tell me and we can add a targeted rule.

**Also switch on GA4's own bot filtering:** Admin → Data Streams → your stream →
Configure tag settings → Show all → *Define internal traffic*, and separately
ensure **Exclude known bots and spiders** is enabled under Data Settings → Data
Filters. GA4 filters the IAB known-bot list server-side, which catches things a
browser cannot see.

---

## Events now firing

### Reading behaviour — the interesting part

| Event | When | Key properties |
| :-- | :-- | :-- |
| `article_view` | Article page loads | `article_slug`, `word_count`, `entry_section`, `deep_linked`, `referrer_host` |
| `article_deep_link_entry` | Reader arrives with a `#section` hash | `entry_section`, `referrer_host` |
| `ad_slot_loaded` | An in-article ad enters the viewport | `position` |
| `article_scroll_depth` | Reader passes 25 / 50 / 75 / 90% | `depth_percent`, `engaged_seconds` |
| `article_read_complete` | Reader passes 90% | `engaged_seconds`, `likely_genuine_read` |
| `article_exit` | Tab hidden or closed | `max_depth_percent`, `engaged_seconds`, `total_seconds`, `reached_end` |

**`engaged_seconds` is not time-on-page.** The timer pauses when the tab is
hidden and when there has been no scroll, click, key or mouse movement for 30
seconds. A tab left open over lunch reports ~0, not 45 minutes. This is the
number to trust.

**`likely_genuine_read`** compares engaged time against the article's own
estimated reading time (words ÷ 230 wpm). Someone who hits 90% depth in 8
seconds scrolled; someone who took 4 minutes read. Milestones fire once each, so
scrolling up and down does not inflate the funnel.

### Interaction

| Event | When | Key properties |
| :-- | :-- | :-- |
| `explainer_opened` | Reader clicks an ⓘ badge | `term`, `kind`, `path` |
| `next_order_desk_selected` | Picks a desk in the order ticket | `desk`, `desk_label` |
| `next_order_filled` | Order ticket returns an article | `desk`, `vintage`, `picked_slug`, `off_desk` |
| `next_order_executed` | Clicks through to the suggested article | `from_slug`, `to_slug` |
| `next_order_route` | Picks Street gallery or Corner Office | `destination` |
| `consult_cta_clicked` | Clicks Request a Meeting / Commission a Valuation | `intent`, `referrer_path` |

`consult_cta_clicked` is the most valuable event on the site. `mailto:` links
open an external mail client and leave no trace anywhere — without this event
there is no way to know whether `/consult` converts.

`explainer_opened` is the most useful editorially: which terms readers click is a
direct map of where the writing loses people.

---

## What to actually look at in PostHog

**1. Do people finish the long articles?**
Funnel: `article_view` → `article_scroll_depth (50)` → `article_read_complete`.
Break down by `article_slug`. If Sandisk at 8,000 words completes as well as a
1,500-word post, length is not hurting you — which changes your whole content
strategy.

**2. Is the 60-second summary helping or replacing the article?**
Compare `max_depth_percent` distributions on articles with a TL;DR versus
without. If readers stop at 20%, the summary is doing its job but costing you ad
impressions and dwell time. Worth knowing before deciding either way.

**3. Which terms confuse readers?**
Trend `explainer_opened` broken down by `term`. High-frequency terms deserve a
dedicated explainer article — that is free long-tail SEO, informed by real demand
rather than a keyword tool.

**4. Does the order ticket work?**
`next_order_desk_selected` → `next_order_executed` conversion. If people open it
and never execute, the picks are wrong. Also check which `desk` gets chosen most
— that tells you which vertical to write more of.

**5. Session replay.** Enabled with inputs masked. For a site at your traffic
level, watching ten real sessions is worth more than any dashboard. Look for
where people stop scrolling.

**6. Retention.** PostHog → Retention, event `article_view`. Returning readers
are the entire asset. This is the number that matters most long term.

**7. Where do deep-linked readers actually land?**
Trend `article_deep_link_entry` broken down by `entry_section`. This is the
question behind the whole ad-placement change: when Google or ChatGPT sends
someone to a specific section, which one is it? Two uses:

- If one section dominates, it deserves its own standalone article — it is
  already answering a query well enough to be cited.
- Ads are now anchored to section boundaries partly so these readers meet one.
  Cross-check `article_deep_link_entry` against `ad_slot_loaded` to confirm they
  do.

Also worth splitting `article_view` by `deep_linked: true/false`. Deep-linked
readers behave completely differently — they arrive mid-page, read one section
and leave. Averaging them together with top-of-page readers hides both patterns.

---

## GA4 — toggles to switch on

Go to **Admin → Data Streams → your web stream**.

**1. Enhanced measurement** — turn on all of it, especially:
- Scroll (fires at 90%)
- Outbound clicks
- Site search
- File downloads

**2. Mark these as Key Events** (Admin → Events → Key events)

The single most important step. GA4 will not show conversion reporting until you
do this:

- `consult_cta_clicked` ← the money event
- `article_read_complete`
- `next_order_executed`

**3. Custom dimensions** (Admin → Custom definitions → Create custom dimension)

Without these, your event parameters are collected but **not queryable** in
reports. This trips up almost everyone. Create each as scope **Event**:

| Dimension name | Event parameter |
| :-- | :-- |
| Article slug | `article_slug` |
| Depth percent | `depth_percent` |
| Explainer term | `term` |
| Consult intent | `intent` |
| Desk | `desk` |

**4. Custom metric** — same screen, scope Event, unit Standard:

| Metric name | Parameter |
| :-- | :-- |
| Engaged seconds | `engaged_seconds` |

**5. Link Search Console** (Admin → Product links → Search Console links).
Lets you see which *query* led to a session that then read to completion — the
highest-value join available to you and currently missing.

**6. Link AdSense** (Admin → Product links → AdSense links) once you have
meaningful traffic, so revenue lands next to behaviour.

**7. Data retention** (Admin → Data settings → Data retention): change from
2 months to **14 months**. Default throws away your history.

---

## Notes

- All tracking fails silently. An ad blocker, a PostHog outage, or a missing
  token can never break the page.
- `trackEvent` (the old PostHog-only helper used by signup and card creation) now
  routes through the same dual dispatch, so those events reach GA4 too.
- Session replay masks all inputs by default.
- If you add a consent banner later, gate `posthog.init` behind it — the code is
  already structured so that is a one-line change.
