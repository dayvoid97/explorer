# Social packet: "The election was the match, not the fuel"

**Story:** Niraj Neupane's read of the Nov 5 chip selloff · **Article:** `/blog/ai-chip-selloff-election-match-not-fuel-memory-cycle`
**Formats:** [x] Reel / TikTok (`video.json`) · [x] Carousel and X/LinkedIn cards (`cards.json`) · [ ] Founder-on-camera (suggested below)
**Length:** 10 scenes, 150 spoken words → about 50s at Fish "Anchor News" 1.25×, plus the 1.8s end card.

## Packet contents

| File | What it is | Status |
| --- | --- | --- |
| `video.json` | Reel storyboard for `npm run video`: narration, voice cues, Midjourney prompts, motion, plates | Dry run passes |
| `cards.json` | Three 1600×900 number cards (the week, the AMD paradox, the memory squeeze) | Rendered to `render/cards/` |
| `render/plates/` | The six reel number plates, 1080×1920 transparent | Rendered |
| `original.md` | Niraj's file as delivered | Reference |

`render/` is git-ignored; the cards and plates are re-made from the JSON with `npm run card` and `npm run plate`.

## 1. Facts (every number on screen or in the voiceover)

All figures come from Niraj's article and the sources it cites. The [x] marks a match with the article; primary-source checks are the last column.

| # | Fact | Number | Article section | Primary check |
| - | --- | --- | --- | --- |
| F1 | Philadelphia Semiconductor Index, Thu Nov 5 | −12.25%, second-worst day in its history | 1. The tape | [ ] Yahoo Finance / Reuters, Nov 5 |
| F2 | Nasdaq Composite, Thursday | −5.52%, into correction | 1. The tape | [ ] |
| F3 | AMD Q3 data-center revenue | $8.5B, +97% | 4. The AMD paradox | [ ] AMD Q3 2026 release |
| F4 | AMD stock | −17% Thursday, +8% Friday | 3, 4 | [ ] |
| F5 | Sandisk / Micron, Thursday | −22% / −17%; both fell again Friday | 2, 3 | [ ] |
| F6 | Apple December-quarter gross-margin guide | 45–46%, from 47.9% | 5. The memory squeeze | [ ] Apple FQ4 call |
| F7 | Qualcomm handset revenue | −26%, to $5.14B | 5 | [ ] |
| F8 | SOX and Nvidia, Friday | +4% / +6% | 3. The Friday test | [ ] |
| F9 | Ten-stock AI basket VaR, correlation 0.3 → 0.9 | +57% (illustrative calculation) | 7. Crowding | Author's model |

## 2. Tension

- **The turn:** "AMD's data-center revenue grew 97%, yet the stock fell 17%." The headline blamed the election; the tape points to crowding and memory.
- **The hardest number:** **−12.25%** (F1), on screen in frame 1.
- **Thumbnail test:** the "−12.25%" plate over tilting rows of gold chips reads in under a second. [x]

## 3. Visual concepts (spectacle → physical metaphor → mood)

| Scene | Rung | Concept | Tone law |
| --- | --- | --- | --- |
| 01 | Spectacle | Rows of gold chips on black glass, one section tilting like a wave | [x] motion, no menace |
| 02 | Physical metaphor | A single lit match above a stack of gold bars: the title metaphor, nothing burning | [x] |
| 03 | Physical metaphor | A gold chip rising while a glass elevator beside it drops | [x] |
| 04 | Mood | Niraj's NYSE chips illustration (`imageFile`, no Midjourney cost) | [x] |
| 05 | Physical metaphor | Gold memory modules tipping like dominoes | [x] |
| 06 | Physical metaphor | A balance scale: memory chips outweigh the phone | [x] |
| 07 | Physical metaphor | A gold spring bouncing up while a memory module keeps sliding | [x] |
| 08 | Spectacle | Ten different gold objects on one thread, swinging as one | [x] |
| 09 | Mood | One river of gold light splitting into three streams | [x] positive close |
| 10 | Mood | Niraj's Wall Street illustration (`imageFile`) | [x] |

## 4. Script (Fish "Anchor News", 1.25×)

| Scene | Voiceover | Fact | Plate |
| --- | --- | --- | --- |
| 01-hook | [confident] Chip stocks just had the second-worst day in their history: [emphasis] twelve point two five percent. | F1 | `−12.25%` · Philadelphia Semiconductor Index, Nov 5 |
| 02-match | Everyone blamed the election. But the election only lit the match. It was not the fuel. | — | — |
| 03-amd | Look at AMD. Data-center revenue up [emphasis] ninety-seven percent. The stock fell seventeen percent. | F3, F4 | `−17%` · AMD stock, after +97% data-center growth |
| 04-owners | When results like that cannot hold a stock up, the market is repricing who owns it. | — | — |
| 05-memory | The biggest drop was memory. Sandisk fell [emphasis] twenty-two percent. Micron, seventeen. | F5 | `−22%` · Sandisk, Thursday |
| 06-customers | Memory prices are now squeezing their own customers. Apple guided its margin down to [emphasis] forty-five percent. | F6 | `45–46%` · Apple's margin guide, down from 47.9% |
| 07-friday | On Friday, AMD bounced [emphasis] eight percent and Nvidia six. Memory fell again. | F4, F5, F8 | `+8%` · AMD, Friday · memory fell again |
| 08-crowding | In a crowded trade, a ten-stock AI basket can carry [emphasis] fifty-seven percent more risk than the calm-day model shows. | F9 | `+57%` · Basket VaR, correlation 0.3 → 0.9 |
| 09-split | The takeaway: the AI trade is splitting into different businesses, with different cycles. | — | — |
| 10-close | The full breakdown, by Niraj Neupane, is at the link in bio. | — | — |

"Forty-five percent" in scene 06 is the low end of the 45–46% guide; the plate shows the full range.

## 5. Captions

**Instagram:** Chip stocks just had the second-worst day in their history, −12.25%. The election got the blame. Niraj Neupane's read: the election was the match, not the fuel. AMD grew data-center revenue 97% and still fell 17%. Memory led the losses and kept falling on Friday, as its own customers warned about cost. Full breakdown: link in bio. Not investment advice. #Semiconductors #AMD #Micron #AI #Stocks #FinancialGurkha

**TikTok:** Chips fell 12% in a day. Was it the election, or something already in the market? Full breakdown in bio. Not investment advice.

**Threads / X:** The chip index fell 12.25% on Nov 5, its second-worst day ever. AMD's data-center revenue grew 97%; the stock fell 17%. Memory fell most and kept falling Friday while the rest bounced. Niraj Neupane on why the election was the match, not the fuel: financialgurkha.com/blog/ai-chip-selloff-election-match-not-fuel-memory-cycle (attach card 1 or 2)

**LinkedIn (with card 3):** On Thursday, a NAND maker, a GPU designer, a data-center landlord, a turbine maker and Bitcoin all fell together. In a crowded theme, diversification disappears exactly when it is needed: on Niraj Neupane's illustrative numbers, a ten-stock AI basket's one-day VaR rises 57% as correlation moves from 0.3 to 0.9. Full analysis, including the steelman for the policy explanation: financialgurkha.com/blog/ai-chip-selloff-election-match-not-fuel-memory-cycle

**Links:** Instagram bio `https://financialgurkha.com/links?utm_source=instagram&utm_medium=social&utm_campaign=match-not-fuel&utm_content=reel-20261107` · TikTok: same with `utm_source=tiktok` · Threads/X/LinkedIn: the article URL with `utm_source=threads|x|linkedin&utm_medium=social&utm_campaign=match-not-fuel`

Copy follows the tone law: "fell", "second-worst day", never "crash", "collapse" or "bloodbath". The article's own title uses "Chip Crash"; that is the author's headline and stays on the site.

## Companion: founder-on-camera (30s)

Kanchan to camera, one number: "AMD's data-center business grew ninety-seven percent. The stock fell seventeen percent. When great numbers can't hold a stock up, the market is telling you something about who owns it." Plate: `03-amd.png`.

## 6. How to render

```bash
npm run video -- production/2026-11-07-match-not-fuel-ai-chip-crash/video.json --dry-run
npm run video -- production/2026-11-07-match-not-fuel-ai-chip-crash/video.json
```

- **Cost:** 8 Midjourney scenes at 10 + 48 APIFrame credits each; scenes 04 and 10 use Niraj's images, so they skip the image step. For a cheaper cut, set `"videoProvider": "still"` (10 credits a scene, local camera moves).
- **ffmpeg is required** for assembly and was not installed on the main Mac as of Nov 7: `brew install ffmpeg`.
- The finished reel lands at `render/2026-11-07-match-not-fuel-ai-chip-crash.mp4`. Cover frame: scene 01 with the `−12.25%` plate.

## 7. QA gate

- [ ] Every number traces to an F-row; primary checks above ticked
- [x] Tone law: falls rendered as tilts, dominoes and a scale; no menace, no "crash" in social copy
- [x] Numbers are rendered plates; prompts say "no text, no words"
- [x] Hook in 2 seconds with "−12.25%" visible
- [ ] Subject and plate inside the 3:4 grid crop (check after render)
- [ ] Subtitles burned in, clear of platform UI (check after render)
- [x] 150 words; numbers written as spoken
- [x] No buy/sell language; "Not investment advice" in captions
- [ ] Meta and TikTok AI labels set (AI imagery and voice)
- [ ] Tracked links in place
- [ ] Niraj credited on every platform; Kanchan approved
