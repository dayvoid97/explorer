# Financial Gurkha Content Spec

The single set of rules for everything published on financialgurkha.com. Kanchan, Muse and Claude all write to this spec. `npm run validate:content` checks it automatically, and the **Validate content** GitHub check runs it on every push.

- **✖ Error**: breaks the page or the build. Must be fixed before merging.
- **⚠ Warning**: house style or quality. Fix when you can.

## Brand

The site reads these from `src/app/lib/brand.ts`; change them there, not page by page.

| Use | Exact wording |
| --- | --- |
| One-line bio | Financial Markets Reporting From Wall Street, New York. Equity Valuations, Earnings Analysis, Macro Research and Technical Analysis. |
| Positioning (short) | Financial Markets Reporting From Wall Street, New York |
| Tagline | Financial Gurkha is for the winners. |
| Name | **Financial Gurkha** (never "Financial Gurkhas") |
| Location (addresses only) | New York, NY |

## Where things live

| Content | File | URL |
| --- | --- | --- |
| Research article | `src/app/blog/posts/<slug>.md` | `/blog/<slug>` |
| News brief | `src/app/news/items/<YYYY-MM-DD>-<slug>.md` | `/news/<YYYY-MM-DD>-<slug>` |
| Article images | `public/<article-slug>/…` | `/<article-slug>/…` |
| News covers | `public/news/<slug>.jpg` | `/news/<slug>.jpg` |

- **The filename is the URL.** Lowercase words joined by hyphens. A frontmatter `slug` does not change the URL. ⚠
- Give each article its **own image folder**. Never use a shared `public/images/`, where files from different articles collide.

## Frontmatter

### Research article

```yaml
---
date: '10/22/2026'                 # MM/DD/YYYY ✖
title: 'Headline under 70 characters'   # ✖ if missing, ⚠ if over 70
subtitle: 'One or two sentences. Becomes the Google description and the share text.'  # ✖
categories: ['Treasury Yields', 'Bond Market']   # list ✖
image: '/article-slug/cover.jpg'   # local file ⚠ if missing or hotlinked, ✖ if path is wrong
author: 'Kanchan'                  # or 'Niraj Neupane' ✖
---
```

### News brief

```yaml
---
date: '10/22/2026'                 # MM/DD/YYYY ✖ (YYYY-MM-DD works but ⚠)
headline: "Under 110 characters"   # ✖
dek: "The one-paragraph summary shown on /news and in shares."  # ✖
tags: ["oil", "iran"]              # list; the first tag is the kicker on /news ✖
image: "/news/slug-oct-22-2026.jpg"
sources:                           # ✖ at least one Tier 1 or Tier 2
  - name: "Reuters — Headline of the report (Oct 22, 2026)"
    url: "https://www.reuters.com/…"
---
```

## Sources

Every fact needs a source, and every brief needs **at least one Tier 1 or Tier 2 source** ✖. The tier list is `scripts/source-tiers.json`.

| Tier | What counts | Examples |
| --- | --- | --- |
| **1. Primary** | The original record | SEC filings, Fed / Treasury / BLS / BEA / EIA, courts, company press releases and IR sites, exchanges, IMF, primary research |
| **2. Established newsrooms** | Editorial standards and a corrections policy | Reuters, Bloomberg, AP, WSJ, FT, CNBC, NYT, The Economist |
| **3. Everything else** | Aggregators, blogs, data sites, tabloids | Investopedia, MarketBeat, TradingView, NY Post | 

Tier 3 can add color but never be the only source for a fact ⚠. If a reputable outlet is missing from the list, add it to `scripts/source-tiers.json` in the same pull request.

## Writing in markdown that renders

The site renders posts as MDX. These break pages:

| Don't | Do |
| --- | --- |
| `<40bp`, `< 5%`, `<=` ✖ | "under 40bp", "below 5%" |
| Any component other than `<Info>`, `<Paper>` ✖ | Plain markdown |
| `![](images/fig.png)` (relative path) ✖ | `![Alt text](/article-slug/fig.png)` |
| An image that is not in `public/` ✖ | Commit the file with the article |
| `# Title` inside the body ⚠ | Title in frontmatter; sections start at `##` |
| Hotlinked images from Reddit, SEC, etc. ⚠ | Download into `public/` |
| Images over 1.5 MB ⚠ | Compress (JPG ~80% quality, max ~2400 px wide) |

**Explainer badges** go *after* the term; the label is the popover title:

```md
the term premium <Info label="Term premium">The extra yield investors demand for holding a long bond.</Info> rose
```

## House format for research articles

Articles dated from 09/20/2026 on should have:

1. `## The 60-Second Version`: key numbers and the takeaways. The first mobile ad sits directly above it.
2. `### What's in this report`: a table of contents linking every `##` section ⚠.
3. Numbered sections, with the shown arithmetic for any number we derive.
4. `## Frequently Asked Questions`, formatted as `**Question?**` on one line and the answer on the next ⚠. This feeds Google's FAQ data.
5. `## Conclusion and Key Takeaways`, then `## Methodology and Sources`.

## Disclosure

- **Author position:** "the author holds / does not hold a position in …", confirmed by the author before publishing.
- **AI disclosure:** if AI drafted or generated any part, including text, images, video or voice, say so in one line.
- **On Instagram and Threads:** use Meta's AI label on reels with AI-generated video or voice.
