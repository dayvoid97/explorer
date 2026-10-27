# Anthropic S-1 — analysis and context

Built from the 50 filing photos (`s1-notes.md` has every figure with its photo and page). Derived numbers are Financial Gurkha arithmetic, recomputed in code. **Verify all figures against the EDGAR text before publishing.**

## 1. The five things the filing establishes

1. **The fastest revenue ramp on record for a company this size.** Revenue: $41M (2023) → $386M (2024) → $4.59B (2025) → **$16.3B in H1 2026 alone**. Q2 2026 was **$11.6B**, 14.7× Q2 2025, and 2.44× the prior quarter. Annualized: ~$46B.
2. **It just turned operationally profitable.** First GAAP operating profit: **$974M in Q2 2026 (8% margin)**, after $8.1B of operating losses in 2025.
3. **The engine is compute efficiency.** Compute cost per revenue dollar: **$2.51 (Q1'25) → $0.48 (Q2'26)**. Revenue minus compute went from −151% to **+52% of revenue**. That single line explains the turn.
4. **The $80.7B H1 net loss is almost entirely accounting.** ~$81.1B of it is fair-value marks on convertible notes and derivatives that rise *because the company became more valuable*. Cash-relevant losses are a rounding error by comparison.
5. **The bet is enormous and pre-committed.** Named compute commitments total roughly **$782–807B** (FG sum, some cancellable), about **17× the current annualized revenue**, signed mostly in 2026, with suppliers often financing the purchases.

## 2. Quarterly picture (FG-derived)

| | Q1'25 | Q2'25 | Q3'25 | Q4'25 | Q1'26 | Q2'26 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Revenue ($M) | 376 | 787 | 1,382 | 2,040 | 4,731 | **11,555** |
| QoQ growth | — | 2.09× | 1.76× | 1.48× | 2.32× | **2.44×** |
| Compute ÷ revenue | 251% | 177% | 148% | 144% | 72% | **48%** |
| Revenue − compute | −151% | −77% | −48% | −44% | 28% | **52%** |
| Operating margin (GAAP) | −249% | −152% | −224%* | −139% | −35% | **+8%** |
| SBC ÷ revenue | 28% | 23% | 22% | 28% | 20% | 11% |
| Sales/mktg/partnerships ÷ revenue | 6% | 12% | 15% | 12% | 22% | 18% |
\*includes $1.5B Bartz settlement.

**Note the acceleration:** growth slowed through 2025 (2.09× → 1.48×), then re-accelerated sharply in 2026 (2.32×, 2.44×). That re-acceleration coincides with Claude Code/Cowork, the agent products. The filing itself warns growth "may not be sustainable" and expects it to decline.

## 3. The capital stack and who's on the other side

| Party | Role in the filing | Financial tie |
| --- | --- | --- |
| **Amazon** | Compute supplier (Trainium), cloud channel, investor | ≥$110B commitment to 2036; $6.2B convertible notes → 1.84B Class N shares at $2.09/$5.05 (≈ **$217B** at a $2T valuation; FG estimate); 12% ownership cap |
| **Google** | Compute (TPUs), cloud channel, investor | ≥$114.5B to 2033 + est. $125–150B extra TPU 2028–31; earlier notes converted to preferred; new 2026 NPA |
| **Broadcom** | TPU hardware lessor | $161.2B finance-lease rent; up to $42B 9% PIK convertible notes to fund *its own* rent, convertible at 90% of VWAP |
| **Microsoft** | Compute (NVIDIA), Azure channel | ≥$44.9B to 2033 |
| **SpaceXAI** (ex-xAI) | NVIDIA compute; a competitor | up to $120.5B to 2029, ~$3.1B/month from Dec 2026 (~$37B/yr); cancellable after early 2027 |
| **Nscale, Lambda** | NVIDIA GPU clouds | ~$44.6B and ~$41.3B, on delivery |
| **AMD** | GPUs (MI450) | >$20B expected spend; AMD buys up to $5B of Anthropic stock |
| **Morgan Stanley et al.** | Bank group | $15B secured revolver to 2031; $5B minimum-liquidity covenant |

**The theme: vendor-financed scale.** Chipmakers and clouds sell Anthropic compute, then fund part of the purchase through equity or convertibles. That aligns incentives, and it also means a chunk of the "investment" flowing into AI is suppliers recycling their own revenue.

## 4. Governance: what public shareholders actually buy

- **Public benefit corporation** with a three-way mandate: shareholders, those affected by its conduct, and the Company Purpose.
- **The Long-Term Benefit Trust holds Class T stock: no economic rights, but it elects the board majority.** Five trustee seats (one vacant), self-perpetuating, annual terms.
- Changing that requires 80% of board + 80% of trustees, or a founder/Class E/Class A supermajority path; without founders, 85% of Class A.
- **Dilution designed in:** 5% of fully diluted shares (846.8M) already moved to a Public Benefit Fund; up to **+2% more each time the stock rises 50%** from the IPO price. Co-founders pledged 80% of personal equity to philanthropy.
- Shares classes seen: A (public), E, F (founders), N (non-voting; Amazon/AMD/Fund), T (trust). **Votes per class not in our photos.**

Plain English: a Class A buyer gets economics, not control.

## 5. The product thesis (owner emphasis: "Virtual Collaborators")

The filing's argument for durable growth rests on AI as a **Virtual Collaborator**: an agent with the access rights, system connections and context of an employee, doing multi-hour professional work. The evidence it offers:

- **NRR ~900%**: existing customers spend ~9× more a year later.
- Customers paying ≥$100K grew **950 → 11,900** in a year; >1,900 pay ≥$1M, ~250 pay ≥$10M.
- Inside Anthropic: **>90% of code written by Claude**; per-engineer daily code volume **>45×** the 2024 average; revenue per employee **$1.4M → >$6.6M**.
- The case studies quantify outcomes, not "AI adoption":

| Customer | Outcome in the filing |
| --- | --- |
| AIG | +30% quoted submissions, −55% time-to-quote, +40% bound; review time −90% |
| Bristol Myers Squibb | Real-world-evidence question: ~2 months → ~5 minutes |
| DoorDash | Major product launch timelines cut >50%; 7,000+ monthly Cowork users |
| Jane Street | Codebase migration in ~1 week vs months; Fable 5.1 +32% on internal eval |
| Eli Lilly | 50,000+ employees with access; >85% active in key functions |
| Accenture | 45,000 trained; security test coverage 10% → 80%; client 7× ROI |
| IRC | 464 staff hours/week returned; health indicators used 20% → 100% |

- **Market framing:** knowledge work ≈ $40T of global value (company estimate); IDC's $22.5T cumulative AI impact by 2031.

## 6. Valuation context (FG arithmetic, illustrative)

- Fully diluted shares ≈ **16.94B** (from 846.8M = 5%).
- $965B (May Series H) ≈ **$57/share**; $2T reported target ≈ **$118/share**, before new offering shares.
- At $2T: **~43× the Q2 annualized run rate** ($46.2B), or ~61× H1 revenue annualized ($16.3B × 2 = $32.6B).
- At $2T, Q2's annualized operating income (~$3.9B) is an earnings yield near 0.2%, vs the 10-year Treasury near 5%. Our September opportunity-cost piece still applies, now with real numbers.
- Pricing and share count are **not set** (to confirm in the filing).

## 7. Risks the filing itself flags (from the photos)

- Growth rate expected to decline, possibly sharply; early-adoption dynamics may not last.
- Compute commitments are non-cancelable take-or-pay in most cases; payments sometimes in advance of delivery.
- Margins will fluctuate as large compute tranches arrive.
- Regulation: EU AI Act systemic-risk obligations, state AG coalition (Sep 24, 2026), export controls; Anthropic's own pro-regulation stance "could… slow our growth".
- Litigation: $1.5B Bartz copyright settlement (2025).
- Public-benefit spending ($541M in 2025) and Fund issuance add cost and dilution.

## 8. Gaps to fill before writing (not in the 50 photos)

1. **Offering terms:** shares offered, price range, exchange/ticker, underwriters, use of proceeds, lock-ups.
2. **Q3 2026 results:** the filing quotes Sep 30 metrics (NRR, customers, rev/employee, "Q3 revenue 86× Q4'24"); is there a Q3 income statement?
3. **Balance sheet and cash flow:** cash, investments, operating cash flow, capex, restricted cash.
4. **Capitalization:** votes per share by class; founder ownership; Amazon and Google stakes.
5. **The contractual obligations table** (to reconcile our $782–807B tally and avoid double-counting).
6. **Customer concentration** (Reuters reported ~25% from two customers; confirm).
7. **NRR definition.**
8. **Full risk-factor list** (safety, model-behavior disclosures Reuters cited).
9. Confirm the EDGAR URL/CIK (path ends `000162828026067168/anthropicpbc-sx1.htm`).

## 9. Disclosure for the piece

Financial Gurkha uses Claude, Anthropic's model, in research and production, and Claude assisted with this analysis. Every number is from the filing with arithmetic shown, and conclusions are the editor's. This disclosure should sit at the top of the article.
