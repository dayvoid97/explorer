# Ad setup — Financial Gurkha

All slots load through one shared hook: `src/app/hooks/useAdSlot.ts`.

---

## Two bugs this fixed

**1. The sidebar skyscraper often never loaded.**

```ts
if (window && window.adsbygoogle) {   // ← the bug
  window.adsbygoogle.push({})
}
```

The AdSense library was loaded with `strategy="lazyOnload"`, which waits for
every other resource on the page. The component's effect ran long before that,
so `window.adsbygoogle` was usually `undefined` and the push was skipped
entirely. The slot then sat empty for the whole session.

The correct pattern creates the queue if it does not exist, and the library
drains it whenever it arrives:

```ts
;(w.adsbygoogle = w.adsbygoogle || []).push({})
```

**2. Every mobile pageview requested a desktop ad it could never show.**

The sidebar wrapper is `hidden lg:block`, but a hidden element still *mounts* —
so phones were requesting a 300×600 into a container with no layout box. That is
an impression which by definition can never be viewed. It drags the site's
viewability rate down, and Google's policies treat serving into a hidden
container as an invalid placement.

The hook now checks `offsetParent === null` and skips the request entirely.

---

## How slots load now

| Behaviour | Why |
| :-- | :-- |
| Requested only within ~600px of the viewport | Advertisers bid on *viewable* impressions |
| Queue-safe push | Works whether or not the library has loaded |
| Skipped when container is hidden | No impossible impressions, no policy risk |
| Space reserved before fill | No layout shift (CLS is a ranking signal) |
| `ad_slot_loaded` event fired | Lets you verify fill rate in PostHog |

### Why fewer impressions can mean more money

This is the counterintuitive part and it is the whole point of the change.

Google scores a site on its **viewability rate** — the share of served
impressions that were actually seen. Advertisers bid accordingly. Previously,
every unit on a 6,000-word article fired on page load, so a reader who bounced
at 10% still generated four or five "impressions" nobody saw.

That does not just waste those impressions. A low site-wide viewability rate
suppresses the price advertisers will pay for **every** unit, including the
sidebar and including readers who do scroll. Serving fewer, better-seen
impressions typically raises total revenue.

There is no policy risk here — lazy-loading ad slots is standard practice and
explicitly supported by AdSense.

---

## Current inventory

| Slot | Where | Devices | Notes |
| :-- | :-- | :-- | :-- |
| `9398911626` | In-article, `in-article`/fluid | Mobile + tablet (`lg:hidden`) | 1 per ~1,100 words, max 5, anchored to section boundaries |
| `1584501832` | Sidebar 300×600 | Desktop only (`hidden lg:block`) | Sticky — stays viewable for the whole read |

The two never appear together: in-article is `lg:hidden`, sidebar is
`lg:block`. One ad environment per screen size.

**Sticky sidebar** is deliberate. On a long article a static sidebar ad scrolls
out of view within the first few percent of the page. Sticky keeps it in view
for the entire read, which is the largest single viewability gain available on
desktop. It sits in its own grid column and never overlays content, so it stays
inside policy.

**Section-anchored in-article placement** rather than word-count placement,
because deep links from Google and ChatGPT drop readers into the middle of the
article. Anchoring to H2 boundaries means any entry point meets a unit within a
section or two, and units land in the natural pause between sections instead of
interrupting an argument.

---

## Library loading

`AdsenseScript.tsx` uses `strategy="afterInteractive"`, changed from
`lazyOnload`. lazyOnload waits for all other resources, which on an article with
a large hero image can be seconds — long enough that a slot scrolled into view
sits queued and empty.

Because the slots are individually viewport-gated, loading the library earlier
does not produce a burst of unviewed requests. It just means a slot fills
promptly once the reader reaches it.

---

## What to watch

**In PostHog:** `ad_slot_loaded` broken down by `position`. Compare against
`article_scroll_depth`. If `section_4` and `section_5` rarely load, readers are
not getting that far and those units are not earning — which is also a signal
about article length.

**In AdSense:** watch **Active View viewable** (the viewability rate) over the
next two to four weeks. Expect impressions to fall and viewability to rise
sharply. The number that matters is **RPM**, not impression count. If RPM does
not improve after a month of data, tell me and we can revisit the rootMargin.

**Do not** judge this change on impression count in the first week. Fewer
impressions is the intended outcome.
