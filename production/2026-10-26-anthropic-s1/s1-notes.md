# Anthropic S-1 — reading notes

Source: photos of the Anthropic S-1 (filed with the SEC Oct 26, 2026), `~/Downloads/ant-ipo-s1/`. Page numbers are the filing's printed page numbers. Every figure below is transcribed from the photo named; verify against the EDGAR text before publishing.

## Customers (p. 134, IMG_3398)
- Customers with ≥$100K TTM revenue: **>11,900** at Sep 30, 2026, up from **>950** at Sep 30, 2025.
  - Chart "Rapid growth of enterprise customer base": ~20 (Dec 31, 2023) → ~200 (Dec 31, 2024) → ~1,500 (Dec 31, 2025) → >11,900 (Sep 30, 2026).
- **>1,900** customers with ≥$1M TTM revenue; **~250** with ≥$10M TTM revenue (Sep 30, 2026).
- Over **50%** of ≥$100K customers used both Claude Platform and at least one first-party app in Q3 2026, up from ~**30%** in Q4 2025.

## Compute efficiency (IMG_3399)
- "Compute is the most significant operating cost in our business."
- Three pillars: training efficiency ("closing the loop": Claude assists the research that builds the next model), inference efficiency (they operate "compute-constrained", demand exceeds available compute), multi-chip approach.
- Trains and serves natively across **four chip families: AWS Trainium, Google TPUs, NVIDIA GPUs, AMD GPUs**, via a proprietary orchestration layer.

## Operating efficiency (p. 136, IMG_3400)
- New models named: **Mythos 5, Fable 5, Opus 5**; new products **Claude Cowork, Claude Design**.
- **>90%** of contributions to Anthropic's codebase in September 2026 were written by Claude; average daily code volume per engineer in Q3 2026 was **>45×** the 2024 average.
- Sep 30, 2025 → Sep 30, 2026: TTM revenue **+~1,200%**, headcount **+~170%**; TTM revenue per employee **$1.4M → >$6.6M**.
- Revenue **$16.3B** for six months ended Jun 30, 2026, vs **$1.2B** H1 2025.
- Operating loss **$693M** H1 2026, vs **$2.1B** H1 2025.
- Adjusted Operating Income **$1.6B** H1 2026, vs Adjusted Operating Loss **$1.8B** H1 2025.
- Expects operating margin and Adjusted Operating Margin to fluctuate, especially when large new compute is delivered.

## Adjusted operating margin by quarter (p. 137, IMG_3401)
| Q1'25 | Q2'25 | Q3'25 | Q4'25 | Q1'26 | Q2'26 |
| --- | --- | --- | --- | --- | --- |
| (221)% | (129)% | (93)% | (84)% | (13)% | **19%** |
- Chart label: "+240 ppts" (Q1'25 → Q2'26). Non-GAAP; reconciliation in "Non-GAAP Financial Measures".

## How revenue is generated (pp. 137–138, IMG_3402–3403)
- Four model classes: **Mythos (including Fable), Opus, Sonnet, Haiku**, positioned along a "capability-cost-speed curve". Customers buy direct or through CSP (cloud service provider) marketplaces; many use both.
- **"Pay-for-intelligence"** = consumption (token-metered, priced by model) — the "substantial majority" of revenue. Subscriptions (enterprise and prosumer, terms generally 12 months or less) are the rest.
- Growing number of enterprise customers sign non-cancelable annual/multi-year contracts with minimum spend commitments.

| Period | Consumption | % | Subscription | % | **Total (FG sum)** |
| --- | --- | --- | --- | --- | --- |
| FY2023 | ~$41M (substantially all) | ~100% | — | — | **$41M** |
| FY2024 | $288M | 75% | $98M | 25% | **$386M** |
| FY2025 | $3.8B | 83% | $789M | 17% | **≈$4.59B** |
| H1 2026 | $13.1B | 80% | $3.2B | 20% | **$16.3B** (matches p.136) |

- FG note: FY2025 total ≈ $4.59B matches Reuters' Sept "nearly $4.6B". H1'26 $16.3B vs H1'25 $1.2B = **13.6×**.
- Risk language (p.138): growth "may reflect early-stage adoption dynamics… that may not be sustainable"; they **expect the growth rate to decline**, possibly "significantly and more rapidly than we anticipate".

## Public benefit commitment (p. 143–144, IMG_3404–3405)
- Contributed **846,840,960 Class N shares = 5% of fully diluted shares** (as of Jun 30, 2026, assuming full conversion of the **Amazon Notes**) to the **Anthropic Public Benefit Fund**, a wholly owned subsidiary ("Initial Public Benefit Issuance").
  - FG arithmetic: implied fully diluted share count ≈ 846,840,960 ÷ 0.05 ≈ **16.94 billion shares**.
- Framework: after the IPO, the board **may** issue up to an **additional 2%** of then-outstanding shares to the Fund **each time the share price rises 50% above the prior milestone**, starting from the IPO price. A milestone counts only if the close exceeds the threshold on ≥90 of the trailing 120 trading days AND the 10-day average close also exceeds it. At the board's discretion.
  - FG note: this is **dilution tied to success** — a direct cost to public shareholders if the stock performs. Worth explaining carefully.
- Fund shares may be transferred, donated, or sold (including in registered offerings). Initial managers: **Dario Amodei, Daniela Amodei, Jack Clark, Dr. Neil "Buddy" Shah**.
- Employee donation matching program (matched with Class N shares). **Co-founders each pledged 80% of their personal equity** to philanthropic causes.
- Filing file name visible in the browser URL: `anthropicpbc-sx1.htm` (S-1, registrant "Anthropic PBC").

## Public benefit expenses (p. 144, IMG_3406)
- Public-benefit expenses, mostly charitable donations under the matching program: **$541M in FY2025, ~4% of total operating expenses**. Expected to increase. Filing says these may reduce revenue, raise expenses, lower Adjusted Operating Margin, and **contribute to dilution**.
- Revenue recognized as tokens are consumed. Subscriptions are prepaid monthly or annually and recognized ratably. Growth rate expected to decline and to fluctuate.

## Results of operations — the income statement (p. 147, IMG_3408) ★ core table
($ millions)
| | FY2023 | FY2024 | FY2025 | H1 2025 | H1 2026 |
| --- | ---: | ---: | ---: | ---: | ---: |
| **Revenue** | 41 | 386 | **4,585** | 1,163 | **16,286** |
| Compute and infrastructure | 433 | 2,522 | 7,326 | 2,334 | 8,945 |
| Personnel⁽¹⁾ | 95 | 454 | 1,839 | 538 | 3,152 |
| Bartz settlement | — | — | 1,500 | — | — |
| Sales, marketing, partnerships | 2 | 43 | 568 | 120 | 3,168 |
| Other operating and administrative | 62 | 347 | 1,412 | 306 | 1,714 |
| **Total operating expenses** | 592 | 3,366 | 12,645 | 3,298 | 16,979 |
| **Operating loss** | (551) | (2,980) | **(8,060)** | (2,135) | **(693)** |
| Interest income | 69 | 106 | 431 | 115 | 1,111 |
| Change in FV of convertible notes, derivative liabilities, SAFEs | (1,045) | (5,434) | **(34,308)** | (10,942) | **(72,388)** |
| Other income (expense), net | (2) | — | (8) | — | (8,757) |
| Total other income (expense), net | (978) | (5,328) | (33,885) | (10,827) | (80,034) |
| Loss before taxes | (1,529) | (8,308) | (41,945) | (12,962) | (80,727) |
| Provision for income taxes | 2 | 1 | 20 | 7 | 21 |
| **Net loss** | **(1,531)** | **(8,309)** | **(41,965)** | **(12,969)** | **(80,748)** |

(1) Stock-based comp in personnel: $29M (2023), $192M (2024), $1.2B (2025); $286M (H1'25), $2.2B (H1'26).
(2) FV changes were $1.0B, $5.4B, $34.3B (2023–25) and $10.9B, $72.4B (H1'25, H1'26), "primarily driven by an increase in the fair value of our outstanding convertible promissory notes resulting from an increase in our enterprise valuation".

**FG reads:**
- **The H1 2026 net loss of $80.7B is ~90% non-cash valuation accounting.** $72.4B FV change + $8.8B other expense = $81.1B, vs operating loss of just $0.69B. The business nearly broke even operationally; the "loss" mostly reflects Anthropic becoming more valuable, which raises the value of notes that convert into its stock.
- Compute as % of revenue: 2023 1,056% → 2024 653% → 2025 160% → H1'25 201% → **H1'26 55%**. This is the economic story.
- Sales/marketing/partnerships exploded: $120M (H1'25) → **$3.17B (H1'26)**, 19% of revenue. Worth asking what "partnerships" includes (CSP revenue share?).
- Other operating and administrative: 10.5% of H1'26 revenue.
- Interest income $1.1B in H1'26 — the cash pile itself earns ~$2.2B/yr annualized.
- FY2025 operating loss $8.06B includes $1.5B Bartz settlement; ex-Bartz ≈ $6.56B.

## Interest income, FV changes, other expense (IMG_3409)
- Interest income H1'26 **$1,111M vs $115M**, +$996M (+866%): higher average cash and new short-term investments.
- FV change H1'26 **$(72,388)M vs $(10,942)M**: change of $(61,446)M, +562%, driven by convertible notes' value rising with enterprise valuation 2025→2026.
- Other income (expense), net H1'26 **$(8,757)M vs —**: "primarily driven by the initial fair value recognition and change in fair value of the assets and liabilities recognized under the [cut off — continue on next photo]".

## Personnel, Bartz, S&M (FY2024→FY2025, IMG_3410)
- Personnel **$454M → $1,839M** (+305%); 118% → 40% of revenue. Driven by +$973M stock-based comp and +$339M cash comp from headcount growth.
- **Bartz settlement $1,500M** in FY2025 (33% of revenue), "entirely driven by the preliminary legal settlement for Bartz". (FG context: *Bartz v. Anthropic*, the authors' copyright class action over books used in training; verify description from the filing's Legal Proceedings section.)
- Sales, marketing, partnerships **$43M → $568M** (+1,221%); 11% → 12% of revenue.

## FY2025 interest + FV (p. 152, IMG_3411)
- Interest income FY25 $431M vs $106M (+$325M, +307%); $305M of it from higher cash and new short-term investments.
- FV change FY25 $(34,308)M vs $(5,434)M (−$28.9B, +531%), driven by convertible notes' value rising with enterprise valuation 2024→2025.

## Non-GAAP reconciliation (IMG_3412) ★
| ($M) | FY23 | FY24 | FY25 | H1'25 | H1'26 |
| --- | ---: | ---: | ---: | ---: | ---: |
| Operating loss | (551) | (2,980) | (8,060) | (2,135) | (693) |
| + Stock-based comp | 29 | 192 | 1,165 | 286 | 2,185 |
| + Non-cash charitable contributions⁽¹⁾ | — | — | 541 | — | 126 |
| + Bartz settlement⁽²⁾ | — | — | 1,500 | — | — |
| **Adjusted Operating Income (Loss)** | (522) | (2,788) | **(4,854)** | (1,849) | **1,618** |
| Revenue | 41 | 386 | 4,585 | 1,163 | 16,286 |
| Operating margin (GAAP) | (1,344)% | (772)% | (176)% | (184)% | **(4)%** |
| Adjusted Operating Margin | (1,273)% | (722)% | (106)% | (159)% | **10%** |
(1) donation-matching non-cash charges, linked to employee equity awards, in other op & admin. (2) excluded as "not indicative of ongoing operations".
- FG check: H1'26 −693 + 2,185 + 126 = 1,618 ✓; FY25 −8,060 + 1,165 + 541 + 1,500 = −4,854 ✓.
- **SBC is 13.4% of H1'26 revenue** and is the single biggest add-back; Adjusted Operating Income exists only because SBC is excluded. Readers must see this.
- Adjusted Net Income (Loss) = net loss excluding SBC, non-cash charitable, Bartz, FV changes on convertibles/derivatives/SAFEs, and FV of certain MTM instruments. [Reconciliation figures continue past the photo; need the next page.]

## Quarterly results (unaudited) (IMG_3413) ★★ the story table
| ($M) | Q1'25 | Q2'25 | Q3'25 | Q4'25 | Q1'26 | Q2'26 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| **Revenue** | 376 | 787 | 1,382 | 2,040 | 4,731 | **11,555** |
| Compute & infrastructure | 944 | 1,390 | 2,047 | 2,945 | 3,387 | 5,558 |
| Personnel⁽¹⁾ | 218 | 320 | 489 | 812 | 1,295 | 1,857 |
| Bartz settlement | — | — | 1,500 | — | — | — |
| Sales, marketing, partnerships | 24 | 96 | 202 | 246 | 1,033 | 2,135 |
| Other op & admin | 125 | 181 | 233 | 873 | 683 | 1,031 |
| Total opex | 1,311 | 1,987 | 4,471 | 4,876 | 6,398 | 10,581 |
| **Operating income (loss)** | (935) | (1,200) | (3,089) | (2,836) | (1,667) | **974** |
| Interest income | 51 | 64 | 124 | 192 | 349 | 762 |
| FV change convertibles etc. | (5,701) | (5,241) | (9,165) | (14,201) | (12,791) | (59,597) |
| Other income (expense), net | — | — | (3) | (5) | (309) | (8,448) |
| Loss before taxes | (6,585) | (6,377) | (12,133) | (16,850) | (14,418) | (66,309) |
| Taxes | 7 | — | 5 | 8 | 21 | — |
| **Net loss** | (6,592) | (6,377) | (12,138) | (16,858) | (14,439) | **(66,309)** |
(1) SBC by quarter: $105M, $181M, $305M, $574M, $924M, $1.3B.
- FG checks: Q1+Q2'26 revenue 4,731+11,555 = 16,286 ✓; op 974−1,667 = −693 ✓; Q2'26 974+762−59,597−8,448 = −66,309 ✓.
- **Q2 2026 = first GAAP operating profit: $974M (8.4% margin).** Revenue **2.44× QoQ** (4,731 → 11,555) and **14.7× YoY** (787 → 11,555).
- Compute/revenue by quarter: 251%, 177%, 148%, 144%, 72%, **48%**.
- Q2'26 annualized revenue ≈ $46.2B (FG arithmetic: 11,555 × 4), consistent with TechCrunch's Sept "Q2 revenue $11.5B".
- Q2'26 interest income $762M ≈ $3B/yr annualized.

## Revolving credit (p. 162, IMG_3414)
- May 2025: $2.5B senior secured revolver (Morgan Stanley Senior Funding as agent), raised to $2.75B (Sep 2025) and $3.25B (Nov 2025). **No borrowings at Jun 30, 2026**; $78M standby LCs; in covenant compliance.
- **Sep 2026: Amended & Restated $15B senior secured revolver**, fully available for letters of credit, maturing **Sep 4, 2031**, with a springing maturity if >$500M of scheduled principal on certain debt falls due within 91 days and liquidity/covenant tests are not met. For working capital and general corporate purposes.

## Credit covenants, AMD, convertible notes overview (IMG_3415)
- A&R Credit Agreement: customary covenants (debt, liens, asset sales, investments, mergers, restricted payments), several loosened after a "Guarantee and Collateral Release Date". **Financial covenant: liquidity ≥ $5.0B at each quarter-end**, starting Dec 31, 2026.
- **AMD (Jul 2026):** Hardware Supply Agreement to buy, lease, or access AMD Helios rack-scale systems with **Instinct MI450** GPUs. **AMD commits to buy up to $5.0B of Anthropic Class N stock**, drawable in increments as AMD GPU delivery and deployment milestones are hit (first expected **2027**). Post-IPO purchase price = 30-day Class A VWAP before closing; draws must be made within 12 months after final delivery.
  - FG: a supplier financing its own sale with an equity purchase. A circular-financing pattern worth flagging.
- **NPAs (note purchase agreements) with Google, Amazon (AWS), and Broadcom** for convertible promissory notes and, in some cases, non-voting stock.
  - Google: Sep 2023 and Aug 2024 NPAs, notes fully converted into non-voting redeemable convertible preferred; **Google 2026 NPA (Mar 2026)** gives potential future financing capacity.
  - Amazon: 2023 and 2024 NPAs; **~$6.2B principal still outstanding**.

## Outstanding notes (Amazon) (IMG_3416)
| Agreement | Principal ($M) | Conversion price/sh | Class N shares on conversion |
| --- | ---: | ---: | ---: |
| Amazon 2023 NPA | 2,186 | $2.0928 | 1,044,716,970 |
| Amazon 2024 NPA | 4,017 | $5.0478 | 795,727,992 |
| **Total** | **6,203** | | **1,840,444,962** |
- Non-interest-bearing "rollover notes". **Amazon ownership cap: 12%** of capitalization (fully diluted incl. awards and convertibles), waivable by Amazon. Amounts that can't convert under the cap are reissued as rollover notes and convert at quarter-ends after the IPO.
- At the IPO, notes convert into Class N at the **lower of the fixed price and the IPO price**; post-IPO quarterly conversions at the lowest of fixed price, IPO price, and 10-day trailing VWAP.
- FG: Amazon converts at **$2.09 and $5.05 per share**. With ~16.9B fully diluted shares, a $2T valuation implies roughly **$118/share** (FG estimate, before the offering's new shares). That gap is why the FV loss is enormous. 1.84B shares × ~$118 ≈ **~$217B** of value on $6.2B principal.

## Broadcom — Infrastructure Partner 2026 NPA (p. 166, IMG_3417)
- Up to **$42.0B** of convertible notes, **solely to finance quarterly rent under the "2026 Lease Arrangement"** (infrastructure equipment lease). $0 outstanding; none expected before the IPO.
- **9.00% PIK** interest (capitalized into principal); **13.00%** and conversion at 85% if certain revenue-performance conditions aren't met.
- Maturity: 60 months from draw start for the first $24.0B, 63 months for $24–32B, 57 months above $32B.
- Post-IPO, the holder may convert into Class N at **90% of the 30-day VWAP** of Class A (85% in the penalty case).
- Broadcom may assign the NPA to a designated financial partner (with Anthropic's consent). Draw period starts when the leased equipment becomes serviceable; issuance runs through its 5th anniversary, subject to revenue-growth conditions "significantly below our actual revenue growth rates".
  - FG: vendor financing at 9% PIK, convertible at a 10% discount. Potential **dilution of up to $42B of stock** plus capitalized interest.

## Compute commitments (p. 170, IMG_3418) ★
- **Microsoft (Nov 2025, amended Feb and Oct 2026):** at least **$44.9B** of spend, **Nov 2026–May 2033**, regardless of usage; non-cancelable except for Microsoft's uncured material breach or undelivered tranches.
- **Google (Mar 2026, amended May–Aug 2026):** at least **~$114.5B**, **Apr 2026–Jul 2033**, regardless of usage, with a true-up if spend falls short; non-cancelable except for Google's uncured breach.
- **Plus additional TPU compute** from TPU providers including Google, delivered **2028–2031**: estimated **$125.0B–$150.0B**, **not included** in the contractual commitments table.
- More arrangements expected. Other compute arrangements and leases exist that aren't described here.
- FG running tally (named so far): MSFT $44.9B + GOOG $114.5B + additional TPU $125–150B = **$284–309B**, before AWS, NVIDIA, AMD, Broadcom leases and the contractual-obligations table. [Need the table page.]

## More compute commitments (pp. 170–171, IMG_3419–3421) ★
- (IMG_3419 is a clean re-shot of the Microsoft and Google paragraphs on p.170; figures as above.)
- **Amazon (Apr 2026):** at least **$110.0B**, **May 2026–Apr 2036**, regardless of usage, with a true-up if spend falls short; non-cancelable except for Amazon's uncured breach.
- **SpaceXAI (May–Oct 2026)** = SpaceX.AI LLC, formerly X.AI LLC, a wholly owned subsidiary of SpaceX. NVIDIA-GPU compute, **up to $120.5B** over terms into **2029**, about **$3.1B per month** once all capacity is delivered (expected **Dec 2026**). After initial non-cancelable periods ending **Jan 2027 and Mar 2027**, cancellable by either party on 90 days' notice.
  - FG: Anthropic renting compute from xAI/SpaceX, a direct AI competitor. Notable.
- **AMD:** no fixed dollar commitment; initial 2027 tranche of Helios systems. If the full initial capacity is procured, expenditures **expected to exceed $20.0B** (not in the commitments table), plus optional additional capacity of about the same amount.
- **Nscale (Aug 2026):** NVIDIA GPUs, **up to ~$44.6B** over terms into **2033**. Fees accrue only as capacity is delivered and accepted. Nscale must use best efforts to obtain financing.
  - FG: Nscale itself filed an S-1 on Sep 18, 2026 (EDGAR full-text hit seen earlier), so Anthropic is a key customer of a fellow IPO candidate.
- **Lambda (May, Jun, Aug 2026):** NVIDIA GPUs, **~$41.3B** over terms into **2034**, accruing on delivery and acceptance. The Aug 2026 deal is **~$34.9B** of that, and either party may terminate if Lambda doesn't secure the facility lease.
- **Broadcom equipment leases:** five-year master equipment leases for hardware in dedicated data centers run by others, accounted for as **finance leases**. Rent ≈ **$161.2B excluding interest**, quarterly, starting when equipment is "ready for service". Gives access to **TPU-based** capacity: some online in 2026, more from 2027. Non-cancelable except on default.
  - Restricted cash deposited for Broadcom's benefit; two special-purpose subsidiaries hold the leases, guaranteed by Anthropic PBC and secured by the equipment, with cross-defaults.
  - Quarterly rent can be financed with the $42B Broadcom convertible NPA. In Q2 2026 Broadcom assigned part of one lease to a third party.

### FG commitment tally (named arrangements; overlap possible, verify vs the contractual obligations table)
| Counterparty | Amount | Type | Through |
| --- | ---: | --- | --- |
| Broadcom leases (TPU hardware) | $161.2B | finance lease rent, ex-interest | ~5-yr terms |
| SpaceXAI (NVIDIA) | up to $120.5B | services; cancellable after early 2027 | 2029 |
| Google | ≥$114.5B | take-or-pay | Jul 2033 |
| Additional TPU (Google and others) | est. $125–150B | not in table | 2028–31 delivery |
| Amazon | ≥$110.0B | take-or-pay | Apr 2036 |
| Microsoft | ≥$44.9B | take-or-pay | May 2033 |
| Nscale (NVIDIA) | up to ~$44.6B | on delivery | 2033 |
| Lambda (NVIDIA) | ~$41.3B | on delivery | 2034 |
| AMD | >$20.0B expected | not in table | 2027+ |
| **Total** | **≈ $782–807B** | | |
- FG: Reuters' Sept "$518B" was the earlier contractual table. The named arrangements now total roughly **$780–810B** (FG sum; some may overlap or be cancellable). Against H1'26 revenue of $16.3B and a ~$46B Q2 run rate.
- FG: suppliers are financing their own sales. AMD ($5B equity), Broadcom ($42B convertible to fund its own lease rent), Amazon ($6.2B convertible notes), Google (2026 NPA). Customer-vendor-investor circularity is a key analytical theme.

## Enterprise adoption (IMG_3422) — repeats p.134 (11,900 / 1,900 / 250; >50% use platform + app). Three layers: models, platform, applications.

## Distribution (IMG_3423)
- Surfaces: **Claude Platform** (agentic development environment), **Claude Code** (coding agent), **Claude Cowork** (knowledge-work agent with computer use).
- Diffusion "much of it organic", amplified by go-to-market and Applied AI teams. On **AWS, GCP and Azure** through joint go-to-market: Anthropic holds the direct customer contract and **pays a fee to each CSP**.
  - FG: likely part of "sales, marketing, and partnerships", which would explain its jump to $3.2B in H1'26. Verify.
- Partners: SIs (Accenture, Deloitte, KPMG, PwC), Salesforce, Snowflake. New **"Ode with Anthropic"**, an AI services company built with private equity firms to serve mid-sized companies.

## Strengths of the financial model (IMG_3424) ★
- **Net Revenue Retention ≈ 900%** at Sep 30, 2026. (FG: extraordinary; check the filing's definition.)
- Q2'26 revenue **+1,368% YoY** vs compute and infrastructure **+300%**. FG check: 11,555/787 = 14.68× = +1,368% ✓; 5,558/1,390 = 4.0× = +300% ✓.
- TTM revenue per employee >$6.6M (Sep 30, 2026) vs $1.4M.
- Q2'26 revenue $11.6B vs $787M; **operating margin 8%, operating income $1.0B** vs (152)% and $(1.2)B in Q2'25.

## Closing the loop (IMG_3425)
- Claude used across research, training and testing: experiments, training data, evals and safety audits, code.
- On internal benchmarks for hard open-ended engineering problems, Claude's success rate ≈ **90% in Sep 2026, up ~50 points in nine months**.
- Headcount grew **>5×** from Dec 31, 2024 to Sep 30, 2026, while **Q3'26 revenue was 86× Q4'24 revenue**.
  - FG: Q4'24 revenue isn't in my notes yet. 86× implies Q3'26 revenue ≈ 86 × Q4'24. If Q4'24 ≈ $150–200M, Q3'26 ≈ **$13–17B**. **The S-1 seems to reference Q3'26 (Sep 30) metrics without a full Q3 income statement in these photos; look for Q3 numbers.**

## Scaling laws / market thesis (p. 184, IMG_3427)
- Cites *Scaling Laws for Neural Language Models* (co-authors Dario Amodei, Jared Kaplan, Sam McCandlish, Tom Brown later co-founded Anthropic).
- Expects demand for AI to outstrip supply for the foreseeable future, **limited principally by compute availability**, and concentrated at the frontier, with enterprises gravitating to the most capable models.

## Market opportunity (IMG_3428)
- Knowledge work is valued at **>$40 trillion globally in 2025** (company belief, footnote 6). IDC estimates a cumulative **$22.5T** global economic impact from AI solutions by 2031 (footnote 7).
- IT spend grew $1.2T (2006) → $4.3T (2025), a ~7% CAGR; cloud grew from 0 to $1.9T. Global GDP $34T (2000) → >$118T (2025, World Bank). The top-10 public tech companies grew revenue $68B → >$2.5T, **~38×, about 11× the rate of global GDP growth**.
  - FG: "11× the rate" is ~38× ÷ ~3.5× GDP. A TAM framing, not a forecast.

## Approach to compute (IMG_3430)
- A fungible compute pool across **AWS Trainium, Google TPUs, NVIDIA GPUs, AMD GPUs**, with in-house orchestration and scheduling. The same pool serves customers, research, and internal use.
- Secures compute "well in advance of anticipated demand", sometimes with **payments in advance of delivery**. Anticipates "significant investments… for the foreseeable future".

## ★ Claude as a Virtual Collaborator (IMG_3431) — OWNER NOTE: "Take esp. emphasis here"
- "We believe we have reached an inflection point where AI systems can function as genuine collaborators in professional work… tasks that might otherwise occupy a skilled professional for several hours, a full day, or longer."
- **"Virtual Collaborators"**: AI that works alongside humans on complex multi-step professional work, carrying the access rights, system connections, and context the organization grants. Navigates internal tools and runs multi-step workflows "embedded where work gets done". [Text continues past the photo; need the rest.]
- FG: this is the product thesis that connects the $40T knowledge-work TAM, Cowork/Code, the 900% NRR, and "closing the loop" (>90% of code written by Claude). **Candidate spine for the article.**

## Growth strategy (p. 196, IMG_3432)
- Pillars: talent and culture ("grow… without growing headcount linearly"), **compute** (secure more beyond existing commitments, **expand its own data center footprint**, improve cost profile), intelligence, capability and safety. Verticals: software, financial services, insurance, healthcare, life sciences, legal, education, retail, telecom, professional services, technology, cybersecurity.

## Growth strategy cont. (p. 197, IMG_3433)
- Surfaces: Claude Code, Cowork, Claude.ai, **Claude Security, Claude Design, Claude Science**; AWS/GCP/Azure marketplaces; embedded in enterprise apps.
- Grow direct go-to-market and Applied AI teams; prosumer channel as internal advocates; **international expansion "meaningful driver"**.
- New markets: life sciences (global pharma spend >$2T in 2026, IQVIA); built a molecular biology lab, **acquired Coefficient Bio**; "Model Hardware Standard" lets Claude operate lab equipment, microscopes, liquid handlers, robotic arms → physical work/robotics.
- Strategic transactions: acquisitions, investments, SI/data-platform partnerships.

## Multi-chip (p. 204, IMG_3434)
- AWS Trainium (influence future generations); Google TPUs via **Google and Broadcom**; NVIDIA (Grace Blackwell, Vera Rubin) via NVIDIA partnership + Microsoft, SpaceXAI, Nscale, Lambda, others; AMD Instinct MI450 via Helios systems, multi-year engineering collaboration.
- Claude speeds onboarding of new chip platforms; reduces single-vendor dependence.

## Customer case study: Accenture (IMG_3458–3459; likely in the S-1 graphics/insert pages)
- "Customer since 2025". **45,000** Accenture professionals trained on Anthropic; security scan test coverage **10% → 80%** with Accenture Cyber.AI (Claude-powered); **7×** ROI reported by a broadband provider (joint customer).
- Dec 2025: **Accenture Anthropic Business Group** formed; Claude Code rolled out to tens of thousands of Accenture developers. Cyber.AI secures 1,600 apps and 500,000+ APIs; scan turnaround days → under an hour.
- Quote: Julie Sweet, Chair and CEO, Accenture.

## Customer case studies (S-1 insert pages) — "Virtual Collaborator" evidence
- **Accenture (IMG_3460, cont.):** >18,000 certified Claude practitioners; forward-deployed engineers; Claude Center of Excellence; broadband client: **7× ROI, 55% faster to market, sales-lead validation cost −86%, accuracy 13% → 97%**.
- **AIG (IMG_3461):** 8 business lines on Claude. Lexington Middle Market Property: **+30% quoted submissions, −55% time-to-quote, +40% submissions bound** (as of Mar 31, 2026). Underwriting by AIG Assist cut review time **>90%**, enabling review of 100% of submissions. Claims pilot: days → hours. Multi-agent underwriting team concept with underwriters overseeing every decision. Quote: Eric Andersen, President & CEO.
- **Bristol Myers Squibb (IMG_3462):** customer since 2023; May 2026 selected Claude Enterprise company-wide; **30,000+ employees** with access; >3,000 developers/data scientists on Claude Code; real-world-evidence question **~2 months → ~5 minutes** across 30–40 external databases; dozens of data sources via MCP; Claude Science; Opus as "PhD-level advisor". Quote: Greg Meyers, EVP & Chief Digital and Technology Officer.
- **DoorDash (IMG_3463):** customer since 2023; Claude Code + Cowork to 100% of corporate employees; **7,000+ monthly Cowork users** (almost half daily); launch timelines **cut >50%**; one engineer did in 3 weeks a migration that would have taken 4 engineers over a quarter; designers/PMs ship production code. Quote: Andy Fang, Co-Founder.
- **International Rescue Committee (IMG_3464):** customer since 2025 (Claude for Nonprofits, discounted licenses); **8× user growth** (300-user pilot → ~2,400 seats, heading to all 10,000 staff with computers); **464 staff hours returned/week**; 20.5M+ people served in 2025 across 40 countries; key health indicators used in planning **20% → 100%**; funding landscaping analysis 1 week → a couple of hours; malnutrition-treatment dropout prediction. Quote: Katherine Rodrigues, Senior Director, Policy & Planning.
- **Jane Street (IMG_3465):** "Frontier intelligence a trading firm can trust". **Claude Fable 5.1 +32%** over Fable 5 on Jane Street's internal agentic coding eval; large codebase migration **~1 week vs months**; Claude deployed "nearly wall-to-wall"; researchers supervise teams of agents; experiments run unattended over weekends; one researcher ~50% more analysis vs a year ago; "research taste"; models that once passed 1% of internal tests outgrew them. Quote: Craig Falls, Head of Quantitative Research ("Fable 5.1 solves more of our coding problems than Fable 5 or Opus 5, and achieves state of the art on trading intuition").
- **Eli Lilly (IMG_3466–3467):** **50,000+** employees with Claude Enterprise access; **5× expansion** since rollout (≈10,000 in Jul 2025 → company-wide by Apr 2026, "first large pharmaceutical company to do so"); **>85%** of full-time employees in five key functions (legal/compliance, technology, finance, oncology, research) actively engage; began 2024 via Amazon Bedrock; secure private connection + DLP hooks co-built with Anthropic; piloting Claude Science (Oct 2026). Quote: Diogo Rau, EVP & Chief Information and Digital Officer.

## How research becomes product (IMG_3468)
- Founded on the conviction that Scaling Laws are the primary engine; claims "compute multiplier advancements" let it advance faster than scaling alone predicts.
- Pre-training: validated at small scale first; frontier runs are "planned capital deployments with defined inputs and strict inclusion criteria"; "not every run performs as our researchers expect".
- **Post-training is now one of the largest research investments** (conversational → autonomous agents); proprietary realistic-task portfolio claimed as a durable, hard-to-replicate advantage.
- Inference co-designed with architecture; researchers and inference engineers share planning, reporting lines, targets.

## Regulation (IMG_3469)
- Areas: AI regulation, privacy and security, **export controls and trade**, IP, employment, antitrust, consumer protection, tax.
- US federal + state; NIST AI RMF (voluntary). **Sep 24, 2026: NY and NJ AGs led a coalition letter urging Congress to pass comprehensive federal frontier-AI legislation.** EU AI Act obligations for general-purpose models with systemic risk.
- Anthropic has called for regulation of frontier AI; filing concedes the approaches it supports "could increase our compliance burdens… or otherwise slow our growth".

## ★ Governance: Long-Term Benefit Trust (IMG_3470–3471)
- PBC with tripartite goals: (i) stockholders' pecuniary interests, (ii) those materially affected by its conduct, (iii) the Company Purpose.
- LTBT = Delaware common-law "noncharitable purpose trust"; trustees with expertise in AI safety, national security, public policy, social enterprise; insulated from financial performance.
- **Class T common stock** (held solely by the LTBT): **no economic rights**, but the right to elect and remove the **Class T directors, who constitute a majority of the board**.
- Class A and Class F holders elect the remaining directors, voting together. LTBT has no day-to-day authority, but major actions (merger, sale) need board approval, a majority of whom the LTBT elects.
- **Specified Class T Director:** LTBT's nomination/removal needs Nominating & Governance Committee concurrence; if NGC declines within 15 days, it goes to a **Class E** stockholder vote. Post-offering NGC = 1 Class T director + 2 non-Class T directors. For-cause removal requires 30 days' notice between the LTBT and **"the Founder LLC"**.
- Share classes seen so far: **A, E, F, N (non-voting, Amazon/AMD/Public Benefit Fund), T**. Need the capitalization table (votes per share) — not in these photos.
- FG: public Class A buyers will NOT control the board; a purpose trust elects the majority. Central governance point for investors.
- Browser tab shows "Anthropic, PBC - S-1 (Q2)". EDGAR path ends `/000162828026067168/anthropicpbc-sx1.htm` (CIK partially visible, "2130357…"). Other tabs: WSJ, Newcomer Substack.

## Changing the LTBT (IMG_3472–3473)
- **Trust Amendment Threshold** — LTBT terms and Class T rights can change only via:
  1. Trustees in favor: **80% of the board + 80% of Trustees**; or
  2. Class F still outstanding, Trustees opposed: (a) until the **3rd anniversary of the IPO**: Class F (unanimous Continuing Founders) + majority of Class E (40% quorum) + majority of Class A (majority quorum); or (b) any time: Class F (2/3 of Continuing Founders) + **75% of Class E** + majority of Class A; or
  3. No Class F outstanding, Trustees opposed: **85% of outstanding Class A**.
- Class T can be **redeemed for no consideration** by the same thresholds.
- **Five trustee seats, one currently vacant.** Self-perpetuating (trustees appoint trustees; 30 days' notice to NGC). Removable by the Delaware Court of Chancery for disqualifying conduct. Annual terms, no term limits. "In practice… Trustees and company executives have collaborated closely on sourcing, interviewing, and selecting Trustees."
- **Dr. Neil "Buddy" Shah**: Trustee and Chair since Jun 2023; also an initial manager of the Public Benefit Fund; CEO of the Clinton Health Access Initiative since Jun 2022; ex-GiveWell MD; co-founder of IDinsight.
  - FG: the LTBT chair also co-manages the 5% Public Benefit Fund. Worth noting as overlapping roles.
