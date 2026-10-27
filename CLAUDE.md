# Financial Gurkha (financialgurkha.com)

Next.js 15 app. The rules live in `docs/`; read them before publishing anything:
`docs/content-spec.md` (what gets published, sources, disclosures), `docs/production-workflow.md`
(who does what), `docs/video-production.md` (reels).

## Content

- Focus: **earnings coverage** as news briefs in `src/app/news/items/<YYYY-MM-DD>-<slug>.md`.
  `/links`, the news sitemap and RSS build themselves from that folder, so a new brief needs no
  other edits. Don't touch other parts of the site unless asked.
- Every figure needs a Tier 1/2 source (content-spec.md). Report results against estimates and
  the prior year. No buy/sell calls or price targets of our own.
- Run `npm run validate:content` and fix every ✖ before pushing. Work on a branch, never `main`.

## Video: the Gurkha Splash style

Set by the owner on Oct 27, 2026; replaces the old navy-and-gold look. Details and the storyboard
format: `docs/video-production.md`, stage 6.

- **Brand colors from the logo only:** black `#080808`, white `#F8F8F8`, gold `#C8A048` (+ lighter
  and darker golds for paint). Never navy. Source of truth: `scripts/brand/style.mjs`.
- **Frame:** footage in a 3:4 window in the middle, gold/white paint splashed out to the edges,
  wordmark on top, URL below. `npm run frame -- --seed N`; one seed per series.
- **Footage:** Midjourney via APIFrame, `--ar 3:4`, high contrast, deep blacks, warm gold
  highlights, one vivid accent, never text or numbers (numbers are plates: `npm run plate`).
- **Voice:** Fish Audio "Anchor News" at 1.25×, ~3 words per second, one sentence per scene,
  numbers written as spoken, sparse `[excited]` / `[emphasis]` cues.
- **Captions:** word-by-word, white Inter Black, active word gold, from Fish word timestamps.
- **Viral structure:** hook with the hardest number on screen in the first 2 seconds, one fact per
  shot, end card "Full breakdown · link in bio". Tone law: energy, never doom.
- **Make it:** `npm run video -- production/<story>/video.json`. Keys in `.env.local`:
  `FISH_AUDIO_API_KEY`, `FISH_AUDIO_VOICE_ID`, `APIFRAME_API_KEY` (`RUNWAYML_API_SECRET` only for
  the Runway fallback). Needs ffmpeg and Chrome/Brave/Chromium.
