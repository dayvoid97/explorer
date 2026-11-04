# 2026 Senate flips packet

Eight articles, eight covers, eight reels. Facts and sources: [analysis.md](./analysis.md). Covers: [cards.json](./cards.json) (`npm run card -- production/2026-11-04-midterm-flips/cards.json`).

| # | Article | Reel storyboard |
| - | --- | --- |
| 1 | [The seven flips (hub)](/blog/midterms-2026-seven-senate-flips-what-moved-each-state) | `reels/01-seven-flips` |
| 2 | [Did farmers flip?](/blog/did-farmers-flip-2026-midterms-iowa-kansas-farm-vote) | `reels/02-did-farmers-flip` |
| 3 | [Texas](/blog/texas-flips-2026-talarico-hinojosa-latino-voters-prices) | `reels/03-texas` |
| 4 | [Maine and the tariff waiver](/blog/maine-2026-collins-jackson-canada-tariff-waiver) | `reels/04-maine` |
| 5 | [The Carolinas](/blog/carolinas-flip-2026-cooper-andrews-senate) | `reels/05-carolinas` |
| 6 | [Ohio and data centers](/blog/ohio-2026-sherrod-brown-husted-data-centers) | `reels/06-ohio` |
| 7 | [The farm economy in numbers](/blog/farm-economy-2026-diesel-fertilizer-soybean-exports-bankruptcies) | `reels/07-farm-economy` |
| 8 | [The Democratic Congress and the farm gap](/blog/democratic-congress-2027-agenda-farmers-tariffs-farm-bill) | `reels/08-democratic-congress` |

## Rendering the reels

Each reel is five scenes (17–23 seconds plus the end card), Fish "Anchor News" at 1.25×, Midjourney stills via APIFrame with a slow camera move (`"videoProvider": "still"`).

```bash
for r in production/2026-11-04-midterm-flips/reels/*/; do npm run video -- "$r/video.json"; done
```

**Cost:** 40 Midjourney stills × 10 APIFrame credits = **400 credits**. Switching a storyboard to `"videoProvider": "midjourney"` adds Midjourney video at 48 credits a scene (all eight: ~2,300 credits).

**Status, Nov 4:** not rendered. The Fish Audio key in the environment was rejected ("Invalid Token") and APIFrame had 4 credits. Renew the key and top up, then run the loop above.

## Before posting

- Results are AP projections as of Nov 4. Recheck every margin against certified results before posting a reel more than a few days out.
- QA gate in `docs/video-production.md`; Meta and TikTok AI labels on (AI voice and imagery).
- Caption: "Not investment advice." Tracked link: `/links?utm_source=instagram&utm_medium=social&utm_campaign=2026-senate-flips&utm_content=reel-20261104`.
