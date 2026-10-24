# Story package

<!-- Muse fills this in from the brief. Copy to production/<YYYY-MM-DD>-<slug>/package.md.
     Claude fact-checks every row of the fact table before anything is produced. -->

**Brief:** `production/<folder>/brief.md`
**Web draft:** `src/app/news/items/<file>.md` or `src/app/blog/posts/<file>.md`
**Branch:** `muse/<slug>`

## 1. Fact table

Every number and claim in the article, reel and captions comes from this table and nowhere else.

| # | Claim (exact wording used) | Number | Source (name, date) | URL | Tier |
| - | --- | --- | --- | --- | --- |
| 1 | | | | | 1 / 2 |

## 2. Midjourney prompts

| Shot | Use | Prompt | Aspect |
| --- | --- | --- | --- |
| Cover | Web cover + Threads | | `--ar 16:9` |
| Reel 1 | Opening | | `--ar 9:16` |

## 3. Reel script

Target 45–60 seconds, under 150 spoken words. Numbers written as spoken.

| Time | Visual (shot #) | Voiceover | On-screen text |
| --- | --- | --- | --- |
| 0–3s | Hook | | |

## 4. Captions

**Instagram:**

**Threads:**

**Link (bio):** `https://financialgurkha.com/links?utm_source=instagram&utm_medium=social&utm_campaign=<slug>&utm_content=reel-<YYYYMMDD>`

## 5. Checklist

- [ ] Every fact-table row has a Tier 1 or Tier 2 URL
- [ ] `npm run validate:content` passes (no ✖)
- [ ] Claude review done (`review.md`)
- [ ] Kanchan approved and merged
- [ ] AI label on the reel (AI video / voice)
- [ ] Posted to Instagram + Threads with the tracked link
