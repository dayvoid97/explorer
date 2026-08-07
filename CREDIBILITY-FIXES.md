# Credibility fixes — response to the AI visibility audit

**Date:** August 7, 2026
**Trigger:** Visibility report showing Financial Gurkha named in 9 of 171 ChatGPT
answers, with assistants describing the site as *"a small, early-stage investing
blog"* and scoring **Transparency 5/10** and **Independence 3–5/10**.

The content gaps (crypto 0/36, macro 0/36, semiconductors 0/36) are a writing
problem and will close with time. What follows are the **meta-level** problems —
the ones that were capping credibility regardless of how good the analysis is.

---

## What the assistants actually said, and what caused it

| What ChatGPT said | Root cause | Status |
| :-- | :-- | :-- |
| *"Its homepage labels the site 'BETA'"* — cited in **three separate answers** | A `<sup>BETA</sup>` in the navbar masthead | **Fixed** |
| *"legal terms contain apparent template or operational inconsistencies, including references to another product called 'Strum—Vibe Together'"* | Legal pages were boilerplate from an unrelated app — 28 references plus `strum.tips@gmail.com` as the contact address | **Fixed** |
| *"a personal project focused on finance, technology, tools, and writing — not a research firm with a documented process"* | `/about/kanchan` described a tools startup building "company cards" | **Fixed** |
| *"Transparency: 5/10 — limited professional/organizational detail"* | No credentials, no sourcing policy, no corrections policy anywhere on the site | **Fixed** |
| *"accuracy is unproven"* — no documented methodology | Nothing described how figures are sourced or valuations built | **Fixed** |
| *"closer to personal investment commentary than independent research"* | Disclosure existed but no site-wide independence policy to frame it | **Fixed** |

---

## Changes made

### 1. BETA removed from the masthead

`NavBar.tsx` — the `BETA` superscript is now `EST. 2022`.

This was the single most damaging string on the site. A beta badge tells every
reader and every language model that the work is provisional. It was being read
directly off the homepage and quoted back in answers about whether the
publication is credible. Replacing it with a founding date turns the same piece
of furniture from a liability into an age signal.

### 2. Legal pages rewritten from scratch

`src/app/legal/[policy]/page.tsx` was boilerplate for a different product. It
told anyone reading — human or model — that nobody had looked at these pages.

Now four policies, all describing this publication:

- **Terms of Service** — including an explicit section stating we are not a
  registered investment adviser, that valuations are opinions with stated
  assumptions, and that the reader carries the decision.
- **Privacy Policy** — accurate about GA4, PostHog, AdSense and what is actually
  collected.
- **Editorial Standards & Methodology** *(new)* — replaces the EULA, which was
  irrelevant to a publication with no app.
- **Copyright and Trademark Policy** — including a no-training clause.

Contact address corrected to `contact@kanchanksharma.com` throughout.

### 3. Editorial Standards page — the important one

`/legal/editorial` directly answers what the audit said was missing:

- **Who publishes this** — named, credentialed, no outside ownership
- **Where the numbers come from** — primary filings only, never repeated from
  other media
- **Where we derive a figure** — arithmetic shown, estimates labelled
- **How valuations are built** — opinions with stated assumptions, no undocumented
  track record claims
- **Conflicts of interest** — disclosed before the analysis, no paid coverage, no
  pre-publication review by companies
- **Corrections** — how errors are handled and reported
- **Use of AI** — stated plainly rather than left unsaid
- **What this is not** — not an adviser, not a data service, not comprehensive

This page is now the `publishingPrinciples` target in the Organization schema, so
crawlers and assistants are pointed at it explicitly.

### 4. About pages rebuilt

`/about` and `/about/kanchan` previously described a tech startup. They now lead
with what the publication does, name the credentials (financial economics degree,
St. John's University), describe the method, and state the limits.

The "what this publication is not" section is deliberate. Assistants penalised
the site for *unstated* limits; stating them plainly reads as confidence, and it
gives a model something accurate to say instead of guessing.

### 5. Structured data strengthened

`Person` entity now carries `alumniOf` and `hasCredential`. `publishingPrinciples`
points at the editorial standards page. Sitemap now includes `/about/kanchan`,
`/legal/editorial`, `/legal/terms` and `/legal/privacy`.

---

## Remaining Strum references

`/cryptodividend` and `/genznepal` still contain "Strum Collective" footers, and
`PromoBanner.tsx` promotes the Strum app. **All three sit on routes that
`next.config.ts` redirects to `/winners`**, so they are not crawlable and did not
appear in the audit. Worth cleaning when those routes come back, not urgent now.

---

## What to expect

These changes do not add coverage, so they will not move the crypto, macro or
semiconductor numbers — that needs articles.

What they should change is **how you are described when you are named.** The
audit found you are named first in 9 of 9 answers where you appear, which means
the recommendation strength is already there. The problem was the characterisation
attached to it.

Re-run the audit in three to four weeks, after the assistants have recrawled. The
specific strings to watch for disappearing: *"BETA"*, *"early-stage"*, *"personal
project"*, and the Strum inconsistency. If transparency does not move above 5/10
after that, the next lever is a documented, timestamped track record — publishing
calls with dates and revisiting them honestly.
