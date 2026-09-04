# Financial Gurkha — SEO / AEO / GEO Audit

**Date:** August 4, 2026
**Scope:** site-wide metadata, structured data, crawlability, blog frontmatter

---

## 1. What was broken (now fixed)

| # | Issue | Impact | Status |
| :-- | :-- | :-- | :-- |
| 1 | **No `/sitemap.xml`** | Google had to discover every page by crawling links. Posts could sit undiscovered for weeks. | **Fixed** — `src/app/sitemap.ts` |
| 2 | **No `/robots.txt`** | No sitemap declaration, no crawler guidance, AI agents left to guess. | **Fixed** — `src/app/robots.ts` |
| 3 | **Root metadata still said "Only Ws in the Chat"** | Every page inherited positioning that contradicted the research brand. Actively harmful for both search and advertisers. | **Fixed** — `layout.tsx` |
| 4 | **No `metadataBase`** | Relative OG image paths never resolved → social previews shipped with no image. | **Fixed** |
| 5 | **No canonical URLs anywhere** | Duplicate-content dilution across query strings and trailing slashes. | **Fixed** on all key routes |
| 6 | **No Organization / Person / WebSite schema** | No publisher entity for Google to attach authority to. Critical for finance (YMYL). | **Fixed** — `layout.tsx` |
| 7 | **Sitemap would have listed redirected routes** | ~13 routes 307 to `/winners`. Listing them burns crawl budget and throws Search Console errors. | Avoided by design |
| 8 | **Two posts had frontmatter slugs that didn't match filenames** | Confusing, and a trap for future canonical logic. | **Fixed** |
| 9 | **`.history` snapshots being type-checked** | Duplicate global declarations, very slow builds. | **Fixed** — tsconfig exclude |

---

## 2. What now ships

### Crawlability

**`/sitemap.xml`** — 15 URLs, dynamically generated from the posts directory. New articles appear automatically on deploy. Uses real frontmatter dates as `lastModified`, and tiers priority by age (posts under 30 days → 0.9/daily, older → 0.7/monthly). Only live routes are listed; redirected legacy routes are deliberately excluded.

**`/robots.txt`** — declares the sitemap, blocks the redirect-only and authenticated routes, and explicitly allows both search crawlers and AI agents.

### The GEO layer (this is the differentiator)

`robots.ts` names AI crawlers explicitly rather than letting them inherit the wildcard rule:

`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Perplexity-User`, `ClaudeBot`, `Claude-User`, `Claude-SearchBot`, `anthropic-ai`, `Google-Extended`, `Applebot`, `Applebot-Extended`, `CCBot`, `Amazonbot`, `meta-externalagent`, `cohere-ai`

Answer engines will not cite content they cannot fetch, and several respect a named user-agent block over the wildcard. For a publication whose goal is to be *quoted as a source*, this is the whole game.

### Structured data (JSON-LD)

| Schema | Where | Why it matters |
| :-- | :-- | :-- |
| `Organization` | every page | Publisher entity, founding date, NYC address, `knowsAbout` topics |
| `Person` (Kanchan Sharma) | every page | Author credentials + expertise — the E-E-A-T signal that carries most weight in finance |
| `WebSite` | every page | Ties the site to the publisher entity |
| `NewsArticle` | every post | Headline, dates, word count, author, publisher |
| `FAQPage` | posts with an FAQ section | **Highest-leverage markup on the site** — auto-extracts `**Question?**` pairs and feeds them to AI Overviews, Perplexity and ChatGPT in the exact format they prefer to quote |
| `BreadcrumbList` | every post | Breadcrumb display in search results |
| `ProfessionalService` | `/consult` | Makes the valuation service machine-readable — surfaces the desk when someone asks an answer engine for independent equity valuation |

### Metadata

- Title template: child pages supply their own title, brand appended automatically
- Homepage uses an absolute title (no double-branding)
- Meta descriptions auto-trimmed to ~158 chars on a word boundary (your subtitles run long by design)
- Article OG tags now include `publishedTime`, `authors`, `tags`, `siteName`
- `article:published_time` / `article:author` meta for Google News and aggregators
- Canonicals on `/`, `/blog`, `/consult`, and every post

---

## 3. Blog inventory

| Post | Title len | FAQ schema | Notes |
| :-- | --: | :-- | :-- |
| caterpillar-first-20-billion-quarter | 118 | yes (12 Q&A) | Strongest AEO asset on the site |
| microsoft-fy26-earnings-fy27-guidance | 120 | yes (7 Q&A) | |
| novo-nordisk-dcf-valuation | 101 | no | |
| all-about-monad | 60 | no | |
| mp-materials-valuation | 55 | no | |
| usa-net-investment-position | 48 | no | |
| fed-decision-preview-jul29-2026 | 43 | no | |
| figma-intrinsic-valuation | 42 | no | |
| a-primer-on-precious-metals | 41 | no | |
| usd-dxy-gold-oil-since-2022 | 27 | no | Thin — 197 words |

**On long titles:** the 100–120 char titles get truncated in Google's SERP display, but that is acceptable here because the key terms are front-loaded ("Caterpillar's First $20 Billion Quarter…", "Microsoft FY26 Earnings: $331 Billion in Revenue…"). Long descriptive titles also match more long-tail queries and give answer engines more to work with. Not worth changing.

---

## 4. Remaining actions, in priority order

### Do this week

**1. Submit the sitemap to Google Search Console.**
Deploy, then Search Console → Sitemaps → submit `https://financialgurkha.com/sitemap.xml`. Also submit to Bing Webmaster Tools (Bing feeds ChatGPT search). This is the single highest-return action available right now.

**2. Add FAQ sections to the eight posts that lack them.**
This is the biggest remaining AEO gap. Every post with a `## Frequently Asked Questions` section using the `**Question?**` / answer format automatically emits `FAQPage` schema — no code needed, it just works. Five or six questions per post. Target the questions people actually type: "Is Novo Nordisk undervalued?", "How do you value MP Materials?", "What is a DCF valuation?"

**3. Move OG images off `redd.it`.**
Every post hotlinks its share image from Reddit's CDN. Those URLs carry expiring signature params (`&s=...`) and will eventually 404 — at which point every social share and every rich result loses its image. Download them into `/public/og/` and reference locally.

### Do this month

**4. Build out `/about`.**
Google's E-E-A-T evaluation for finance content leans heavily on a real author page. Credentials (financial economics degree, St. John's), what the desk covers, methodology, and the "we read the filings" principle. Link it from `publishingPrinciples` in the Organization schema, which already points there.

**5. Thin content.**
`usa-net-investment-position` (197 words) and `usd-dxy-gold-oil-since-2022` are below the threshold where they can rank. Either expand them to 800+ words or leave them out of internal linking.

**6. Internal linking.**
The CAT ↔ MSFT cross-link works well. Do more of it — link every valuation post to `/consult`, and link related analyses to each other. Internal links distribute authority and keep readers on-site, which lifts both rankings and ad revenue.

### Consider

**7. An RSS feed** at `/feed.xml`. Cheap to add, and several AI crawlers and aggregators discover content through RSS.

**8. Author bylines rendered on the article page.** The schema names Kanchan, but the visible page doesn't show a byline with a link to the author page. Both Google and human readers look for it.

---

## 5. Ads

The site is technically ready for monetization:

- In-article units: mobile/tablet only (`lg:hidden`), capped at 3, spaced by content length, never inside a paragraph or table
- Sidebar skyscraper: desktop only — no doubling up
- Ad density stays well inside AdSense policy on every post

**Honest note on revenue:** AdSense pays roughly $3–8 RPM for finance content, so meaningful ad income needs volume — the sitemap and FAQ schema work above is what gets you there. The `/consult` page is likely to out-earn ads for a long while yet; one commissioned valuation is worth more than a month of impressions at current traffic.
