# Production Workflow: Kanchan × Muse × Claude

How a story goes from idea to website, Instagram and Threads, and how what we learn feeds the next one. Every rule about *what* gets published lives in [content-spec.md](./content-spec.md). This file covers *who does what, in what order*.

## Roles

| | Owns | Hands off |
| --- | --- | --- |
| **Kanchan** (editor-in-chief) | What we cover and the angle. Final approval of facts, positions and anything published under the brand | A story brief |
| **Muse** (research + production) | Deep sourcing (Tier 1/2 for every fact), drafting, Midjourney prompts, video edit, voiceover, captions, posting to Instagram, TikTok and Threads | A story package, then the posts |
| **Claude** (verification + platform) | Fact-checking the package against its sources, structuring the web article (SEO/AEO/FAQ/ⓘ), the site itself, the validator, analytics and the weekly scorecard | A reviewed article and a fact sheet the social posts are cut from |

## The handoff folder

Each story gets a folder: `production/<YYYY-MM-DD>-<slug>/`. Text files only go in git; video, audio and raw image files are ignored (see `.gitignore`) and live in the shared drive.

```
production/2026-10-22-meta-perfect-storm/
  brief.md      ← Kanchan (from docs/templates/story-brief.md)
  package.md    ← Muse (from docs/templates/story-package.md)
  review.md     ← Claude: fact-check results and fixes
```

## The flow

1. **Brief (Kanchan).** Copy `docs/templates/story-brief.md`. Say what the story is, why now, the angle, and the formats: web article, news brief, reel, carousel, Threads.
2. **Research and draft (Muse).** Fill in `package.md`:
   - The **fact table**: every claim, its number, and a Tier 1/2 source URL.
   - The web draft as a `.md` file in `src/app/news/items/` or `src/app/blog/posts/`.
   - Midjourney prompts, the reel script with voiceover lines, captions.

   Push to a branch named `muse/<slug>`.
3. **Automatic check.** The **Validate content** GitHub check runs on the push. Fix every ✖ before review.
4. **Review (Claude).** Re-check each fact-table row against its source and write `review.md`. Bring the web article to the house format (TOC, FAQ, ⓘ badges, internal links) and flag anything to correct. The reel and captions are re-cut from the *corrected* fact table, never from the first draft.
5. **Approve (Kanchan).** Read `review.md`, confirm the disclosure line, merge the pull request. The site deploys; the sitemap and IndexNow update.
6. **Produce (Muse).** Midjourney images, then the animation/video edit, then the voiceover (see below), then captions with the tracked link.
7. **Post (Muse).** Instagram and Threads, using Meta's AI label where video or voice is AI-generated. The bio link always points to the tracked `/links` URL below.
8. **Learn (Claude, weekly).** The scorecard: which posts brought readers, which articles kept them, which formats to make more of.

## Tracked links

Every Instagram post's link-in-bio click lands on `/links`, tagged so we know which post sent the reader:

```
https://financialgurkha.com/links?utm_source=instagram&utm_medium=social&utm_campaign=<slug>&utm_content=<post-type>-<YYYYMMDD>
```

- `utm_source`: `instagram` or `threads`.
- `utm_content`: the post type and date, e.g. `reel-20261022` or `carousel-20261022`.

The `/links` page records a `links-card-click` event (PostHog + GA4) with the article opened, its position, and these tags.

## Video

Instagram Reels and TikTok follow the full pipeline in [video-production.md](./video-production.md): tension and hardest number first, the abstraction ladder for visuals, timed scripts from verified facts, rendered number plates (`npm run plate`), and a QA gate before posting. Each video gets a `video-brief.md` from [templates/video-brief.md](./templates/video-brief.md) in the story's production folder.

**Voice:** Fish Audio "Anchor News" at 1.25×, numbers written as spoken, about 3 spoken words per second of video. Reels with AI-generated voice or imagery get Meta's AI label on Instagram and the AI-generated content label on TikTok.

**Tone law:** no ominous, no doomsday, in images, voiceover or copy. Neutral to positive, even on a selloff. See [content-spec.md](./content-spec.md#tone).

## Weekly scorecard (Claude)

Every Monday, from PostHog and GA4:

- Top articles and briefs by engaged reading time and scroll depth.
- `links-card-click` by `utm_content`: which posts turned into readers.
- Ad viewability and `ad-disclaimer-read` counts.
- Two to three recommendations: what to make more of, what to drop.
