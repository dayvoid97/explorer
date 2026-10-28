---
date: '10/27/2026'
title: 'Pricing a Telecom Giant: Inside the Reliance Jio IPO Valuation'
subtitle: "India's largest-ever IPO was 22 times oversubscribed. A quant's read of the prospectus shows the ₹1,119 price already assumes a decade of 15% cash-flow growth and a return on equity more than twice what Jio earns today."
categories:
  [
    'Jio Platforms',
    'Reliance Industries',
    'IPO',
    'India',
    'Valuation',
    'Quant Research',
    'Telecom',
    'Bharti Airtel',
  ]
image: '/jio-ipo-valuation-2026/hero_jio_ipo.jpg'
author: 'Niraj Neupane'
---

**By Niraj Neupane, CA (ICAI)**
_Quantitative Researcher, Korvane · Financial Economist, Calderyn Institute_

![The Jio IPO Hero Image](/jio-ipo-valuation-2026/hero_jio_ipo.jpg)

---

> **Key takeaways**
>
> **The deal.** Jio Platforms raised **₹30,213 crore** at **₹1,119** per share, valuing the company at about **₹10.3 lakh crore** (≈ $123 billion). The book was **22.2× subscribed**; shares list on **October 28**.
>
> **The price.** At ₹1,119 Jio trades at **34.3× post-issue earnings** and about **15× EV/EBITDA** once **₹1.04 lakh crore** of deferred spectrum dues are counted as debt.
>
> **The gap.** My reverse DCF shows the price needs **≈15.4% annual free-cash-flow growth for ten years**. A justified price-to-book model says the market is pricing a long-run **ROE of ≈24%**; Jio earned **9.4%** in FY26.
>
> **The odds.** Across **200,000 simulated three-year paths**, buying at the IPO price gives a **median return of ≈7% a year** and a **19% chance of loss**. Buying at the grey-market-implied listing price of ≈₹1,365 cuts the median to **≈0.4%** and lifts the chance of loss to **48%**.

---

### What's in this report

- [The Jio IPO in 10 numbers](#the-jio-ipo-in-10-numbers)
- [1. The deal: India's biggest IPO, India's thinnest float](#1-the-deal-indias-biggest-ipo-indias-thinnest-float)
- [2. How far the valuation has travelled](#2-how-far-the-valuation-has-travelled)
- [3. The business: a telecom network with a platform option](#3-the-business-a-telecom-network-with-a-platform-option)
- [4. The balance sheet: net cash on paper, spectrum debt underneath](#4-the-balance-sheet-net-cash-on-paper-spectrum-debt-underneath)
- [5. Relative value: Jio versus Bharti Airtel](#5-relative-value-jio-versus-bharti-airtel)
- [6. The quant analysis: what the price implies](#6-the-quant-analysis-what-the-price-implies)
  - [Analysis 1: Reverse DCF, the growth the price requires](#analysis-1-reverse-dcf-the-growth-the-price-requires)
  - [Analysis 2: The ROE the market is pricing](#analysis-2-the-roe-the-market-is-pricing)
  - [Analysis 3: Scenario grid, growth versus exit multiple](#analysis-3-scenario-grid-growth-versus-exit-multiple)
  - [Analysis 4: Monte Carlo, 200,000 simulated futures](#analysis-4-monte-carlo-200000-simulated-futures)
  - [Analysis 5: The tariff lever](#analysis-5-the-tariff-lever)
- [7. Five ways the market can get Jio wrong](#7-five-ways-the-market-can-get-jio-wrong)
  - [1. Confusing demand with value](#1-confusing-demand-with-value)
  - [2. Valuing EBITDA instead of cash](#2-valuing-ebitda-instead-of-cash)
  - [3. Ignoring the spectrum liability](#3-ignoring-the-spectrum-liability)
  - [4. Assuming the multiple holds](#4-assuming-the-multiple-holds)
  - [5. Treating the listing price as the entry price](#5-treating-the-listing-price-as-the-entry-price)
- [8. The quant dashboard: what to watch](#8-the-quant-dashboard-what-to-watch)
- [9. Why this matters beyond Mumbai](#9-why-this-matters-beyond-mumbai)
- [The bottom line](#the-bottom-line)
  - [Your take](#your-take)
  - [About the author](#about-the-author)
  - [Sources](#sources)

---

## The Jio IPO in 10 numbers

![The Jio IPO in 10 numbers](/jio-ipo-valuation-2026/top10_jio_in_numbers.png)

| #   | Item                | The number        | Why it matters                                              |
| --- | ------------------- | ----------------- | ----------------------------------------------------------- |
| 1   | **The price**       | **₹1,119**        | Top of the ₹1,065–1,119 band                                |
| 2   | **The size**        | **₹30,213 cr**    | India's largest IPO; 100% fresh issue of 27 crore shares    |
| 3   | **The demand**      | **22.2×**         | Overall subscription; ₹8,110 cr from 212 anchors            |
| 4   | **The value**       | **₹10.3 lakh cr** | Post-issue market cap, about $123 billion                   |
| 5   | **The multiple**    | **34.3×**         | FY26 P/E on post-issue EPS of ₹32.6                         |
| 6   | **The return**      | **10.8%**         | Return on average capital employed, down from 12.8% in FY24 |
| 7   | **The margin**      | **51.9%**         | FY26 EBITDA margin; 53.3% in Q1 FY27                        |
| 8   | **The harvest**     | **−36%**          | Fall in cash capex, FY24 to FY26                            |
| 9   | **The hidden debt** | **₹1.04 lakh cr** | Deferred spectrum obligations, senior to equity             |
| 10  | **The float**       | **2.9%**          | Share of the company in public hands                        |

---

## 1. The deal: India's biggest IPO, India's thinnest float

| Item                    | Detail                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| **Issuer**              | Jio Platforms Limited, a Reliance Industries subsidiary                                           |
| **Bidding**             | October 21–23, 2026                                                                               |
| **Final price**         | **₹1,119** (band ₹1,065–1,119); lot of 12 shares                                                  |
| **Issue**               | **₹30,213 crore**, 100% fresh issue, no offer for sale                                            |
| **Use of proceeds**     | Prepay or repay Reliance Jio Infocomm (RJIL) borrowings; general corporate purposes capped at 25% |
| **Anchors**             | **₹8,110 crore** from **212** anchor investors at ₹1,119                                          |
| **Subscription**        | About **22.2×** overall; full subscription within roughly 100 minutes                             |
| **Allotment / listing** | October 26 / **October 28** on NSE and BSE                                                        |

![A ₹10 lakh crore company, a ₹30,000 crore float](/jio-ipo-valuation-2026/fig1_deal_anatomy.png)

Three features of the structure shape everything that follows:

- **No one is cashing out.** Meta, Google and the other 2020 investors are not selling. All proceeds go to the company, mostly to retire RJIL debt.
- **The float is tiny.** About **2.9%** of the company trades publicly, possible only because SEBI eased minimum-float rules for very large issuers. Thin floats amplify scarcity premia on the way up and volatility on the way down.
- **Retail came in force.** Retail investors bid more than **₹6,900 crore on day one**, reportedly a record for any Indian IPO.

![Representative image: an NSE listing ceremony](/jio-ipo-valuation-2026/photo_nse_listing_ceremony.jpg)

_Representative image of an NSE listing ceremony (Kross Limited, September 2024). Not the Jio Platforms listing._

> **A note on the numbers in circulation.** Some write-ups quote an issue size of ₹30,188 crore and a P/E of 33.3×. The arithmetic gives **₹30,213 crore** (27 crore × ₹1,119). The 33.3× uses _pre-issue_ EPS of ₹33.6; on the post-issue share count of ≈920.9 crore, EPS is **≈₹32.6** and the P/E is **≈34.3×**, which is what an incoming shareholder actually pays.

---

## 2. How far the valuation has travelled

![Earlier market estimate of Reliance Jio's valuation versus India's largest listed companies](/jio-ipo-valuation-2026/photo_jio_valuation_earlier_estimate.png)

_An earlier market estimate put Jio's value at about ₹4.9 lakh crore, fifth among BSE-listed companies at the time. Peer figures in this graphic are historical and have since changed._

| Measure          | Earlier estimate  | IPO, October 2026      | Change     |
| ---------------- | ----------------- | ---------------------- | ---------- |
| Jio equity value | ≈ ₹4.9 lakh crore | ≈ **₹10.3 lakh crore** | **≈ 2.1×** |

Jio's equity value has roughly **doubled** from that earlier benchmark. Part of the rise is earned: revenue, EBITDA and profit all compounded strongly (Section 3). The rest is expectation. The job of a valuation analyst is to separate the two.

---

## 3. The business: a telecom network with a platform option

![Jio Platforms](/jio-ipo-valuation-2026/photo_jio_campus.jpg)

_Illustrative image._

Economically, Jio Platforms is a mobile network. Reliance Jio Infocomm produced **87.7% of FY26 revenue, 94.9% of EBITDA and 93.8% of profit**. Home broadband, enterprise, digital services, cloud and AI are the growth story, but they are still a small share of the earnings being priced.

![Three years of compounding](/jio-ipo-valuation-2026/fig2_financials.png)

| ₹ crore (FY = April–March)      | FY24     | FY25     | FY26         | Q1 FY27 |
| ------------------------------- | -------- | -------- | ------------ | ------- |
| Revenue from operations         | 1,09,558 | 1,28,218 | **1,46,885** | 39,173  |
| EBITDA (incl. other income)     | 54,959   | 64,170   | **76,255**   | 20,865  |
| EBITDA margin                   | 50.2%    | 50.1%    | **51.9%**    | 53.3%   |
| Profit after tax                | 21,423   | 26,109   | **30,049**   | 7,764   |
| Cash from operations            | 57,662   | 68,156   | **77,556**   | —       |
| Return on avg. capital employed | 12.8%    | 12.5%    | **10.8%**    | —       |

Operating metrics are moving the right way: **36.2 million** net subscriber additions in FY26, a **268 million** 5G base, exit-quarter ARPU of **₹214** (from ₹181.7 two years earlier) and fixed-broadband customers up **55%**.

**Three observations on earnings quality:**

- **Growth is real but telecom-paced.** Revenue compounded about **15.8%** a year over FY24–26 and EBITDA about **17.8%**. Excellent for a network; not hyper-growth.
- **EBITDA depends on definition.** Reported EBITDA includes other income. Excluding it, FY26 EBITDA is about **₹73,400 crore**. Recurring network cash flows should be valued on the lower figure.
- **Returns on capital are falling.** ROACE slid from **12.8% to 10.8%** as spectrum and 5G assets entered the base. That is roughly Jio's cost of capital, not a large spread above it.

![Return on capital is falling, not rising](/jio-ipo-valuation-2026/fig3_roace_vs_airtel.png)

---

## 4. The balance sheet: net cash on paper, spectrum debt underneath

| Item                                            | ₹ crore      |
| ----------------------------------------------- | ------------ |
| Total borrowings, June 30, 2026                 | ≈ 61,372     |
| Cash and marketable securities                  | ≈ 51,833     |
| **Net debt, June 2026**                         | **≈ 9,539**  |
| Fresh equity from the IPO                       | 30,213       |
| **Net cash after the IPO** (before issue costs) | **≈ 20,700** |
| Deferred spectrum obligations                   | ≈ 1,04,000   |
| **Economic net debt** (incl. spectrum)          | **≈ 83,300** |

After the IPO, Jio holds net cash on conventional debt. But Indian telcos pay for spectrum in instalments, and those deferred payments are **debt-like claims senior to equity**. Any honest enterprise-value calculation includes them.

The cash story is improving fast. Cash capex fell **36%**, from ₹53,510 crore in FY24 to ₹34,184 crore in FY26, as the 5G build-out matured. EBITDA less capex rose from almost nothing to **₹42,071 crore**.

![The 5G harvest: capex down, cash up](/jio-ipo-valuation-2026/fig4_capex_harvest.png)

The catch is the yield. After tax, my estimate of FY26 free cash flow to the firm is about **₹29,100 crore**, a **2.6% yield** on enterprise value. Investors are paying for the _trajectory_ of that number, not its current level.

---

## 5. Relative value: Jio versus Bharti Airtel

![What you are really paying: ≈₹11.1 lakh crore of enterprise value](/jio-ipo-valuation-2026/fig5_ev_bridge.png)

| EV build                                | EV (₹ lakh cr) | ÷ reported EBITDA (₹76,255 cr) | ÷ EBITDA ex-other income (₹73,400 cr) |
| --------------------------------------- | -------------- | ------------------------------ | ------------------------------------- |
| Market cap + post-IPO net cash          | ≈ 10.10        | 13.2×                          | 13.8×                                 |
| **+ deferred spectrum ≈ ₹1.04 lakh cr** | **≈ 11.14**    | **14.6×**                      | **15.2×**                             |

The second row is the defensible one. It reconciles with brokers' published figures of **14.8×** (Business Today) and **15.0–15.6×** (Emkay).

![Cheaper on earnings, dearer on EV, weaker on returns](/jio-ipo-valuation-2026/fig6_jio_vs_airtel.png)

| Metric                   | Jio Platforms (₹1,119) | Bharti Airtel            |
| ------------------------ | ---------------------- | ------------------------ |
| P/E, FY26                | **≈ 34.3×**            | ≈ 37.5×                  |
| EV/EBITDA, FY28E (MOFSL) | **≈ 12.0×**            | ≈ 10.3× (India business) |
| Return on capital, FY26  | **10.8%**              | 19.0%                    |
| Net debt / EBITDA, FY26  | **0.36×**              | 1.36×                    |

_Leverage definitions differ between the two companies._

Jio looks **cheaper on P/E** because it carries less interest expense. It looks **dearer on EV/EBITDA** because the market capitalises its operating earnings at a higher rate. On forward numbers, Motilal Oswal puts Jio at a **17% premium** to Airtel's India business, and Bloomberg Intelligence at **12–13×** versus about **9.5×** for Airtel.

A premium multiple paired with roughly half the return on capital is rational only if returns are about to converge upward. That is the bet embedded in ₹1,119.

---

## 6. The quant analysis: what the price implies

Multiples tell you what the market pays. They do not tell you what the market _expects_. For that, I ran four models on the prospectus figures. All inputs, formulas and assumptions are listed so the results can be replicated.

### Analysis 1: Reverse DCF, the growth the price requires

![Reverse DCF: the price needs ≈15% cash-flow growth for a decade](/jio-ipo-valuation-2026/quant1_reverse_dcf.png)

**Method.** I start from FY26 free cash flow to the firm, **FCFF = EBITDA ex-other income − cash capex − tax ≈ ₹29,100 crore** (before spectrum instalments). I then solve for the 10-year growth rate _g_ at which a two-stage DCF equals today's enterprise value of **₹11.14 lakh crore**:

> EV = Σ₁¹⁰ FCFF₀(1+g)ᵗ / (1+WACC)ᵗ + [FCFF₁₀(1+g_T) / (WACC − g_T)] / (1+WACC)¹⁰

| Implied 10-year FCFF growth | Terminal g 4% | Terminal g 5% | Terminal g 6% |
| --------------------------- | ------------- | ------------- | ------------- |
| WACC 10%                    | 14.4%         | 12.7%         | 10.6%         |
| **WACC 11%**                | 16.9%         | **15.4%**     | 13.7%         |
| WACC 12%                    | 19.1%         | 17.8%         | 16.3%         |
| WACC 13%                    | 21.2%         | 20.1%         | 18.8%         |

**Result.** In the base case (WACC 11%, terminal growth 5%), the price requires FCFF to grow **≈15.4% a year for ten years**, multiplying FY26 cash flow by **≈4.2×** by FY36. Every cell in the grid demands double-digit growth. A 1-point change in WACC moves the required growth by 2–2.5 points: the valuation is highly sensitive to the discount rate.

### Analysis 2: The ROE the market is pricing

![The market is pricing a 24% ROE. Jio earns 9.4%](/jio-ipo-valuation-2026/quant2_implied_roe.png)

**Method.** For a firm in steady state, the justified price-to-book ratio is:

> P/B = (ROE − g) / (r − g)

Solving for ROE gives the long-run return on equity that today's price implies: **ROE = g + P/B × (r − g)**.

| Input                     | Value              |
| ------------------------- | ------------------ |
| Book equity after the IPO | ≈ ₹3.64 lakh crore |
| Price-to-book at ₹1,119   | **2.83×**          |
| FY26 ROE (average equity) | **9.4%**           |

| Implied steady-state ROE | g = 5% | g = 6%    | g = 7% |
| ------------------------ | ------ | --------- | ------ |
| Cost of equity 11.5%     | 23.4%  | 21.6%     | 19.7%  |
| **Cost of equity 12.5%** | 26.2%  | **24.4%** | 22.6%  |
| Cost of equity 13.5%     | 29.0%  | 27.2%     | 25.4%  |

**Result.** The market is pricing a long-run ROE of **≈24%**, about **2.6×** what Jio earned in FY26 and above Airtel's 19% ROCE. **Caveat:** Jio's book equity is inflated by acquired spectrum and goodwill, which depresses reported ROE. Even so, the gap is too wide to close on accounting alone. It has to close through tariffs and capital discipline.

### Analysis 3: Scenario grid, growth versus exit multiple

![Exit multiple matters as much as growth](/jio-ipo-valuation-2026/quant3_return_grid.png)

**Method.** FY29 price = ₹32.63 × (1 + g)³ × exit P/E; annualised return = (price ÷ 1,119)^(1/3) − 1.

| EPS growth ↓ / Exit P/E → | 20×   | 25×   | 30×    | 35×    |
| ------------------------- | ----- | ----- | ------ | ------ |
| 10% a year                | −8.1% | −1.0% | +5.2%  | +10.8% |
| 15% a year                | −3.9% | +3.5% | +10.0% | +15.8% |
| 20% a year                | +0.3% | +8.0% | +14.8% | +20.8% |

**Result.** To earn a **12% annual return** over three years, Jio needs EPS growth of **≈17% a year if the market pays 30× at exit**, or **≈24% if it pays 25×**. Telecom multiples tend to compress as growth matures. A five-turn de-rating can erase several years of earnings growth.

### Analysis 4: Monte Carlo, 200,000 simulated futures

![200,000 simulated futures: entry price decides the odds](/jio-ipo-valuation-2026/quant4_monte_carlo.png)

**Method.** I draw FY26–29 EPS growth from **N(15%, 5%)**, centred on consensus EBITDA growth, and the FY29 exit P/E from **N(28×, 5×)**, clipped at 12–50×. I then compute the annualised three-year return from two entry prices: the IPO price and the grey-market-implied listing price.

| Outcome                     | Bought at ₹1,119 (IPO) | Bought at ≈ ₹1,365 (grey market) |
| --------------------------- | ---------------------- | -------------------------------- |
| **Median annual return**    | **7.2%**               | **0.4%**                         |
| Probability of a loss       | **19%**                | **48%**                          |
| Probability of ≥ 12% a year | **27%**                | **6%**                           |
| 5th–95th percentile         | −6% to +20%            | —                                |

**Result.** Same company, same future, different odds. A **22% higher entry price** cuts the median annual return by roughly **7 percentage points** and turns a one-in-five chance of loss into a coin toss.

### Analysis 5: The tariff lever

![One tariff hike ≈ one year of EBITDA growth](/jio-ipo-valuation-2026/quant5_tariff_sensitivity.png)

**Method.** EBITDA uplift = tariff hike × RJIL revenue (≈ ₹1.29 lakh crore) × share of the hike realised after churn and down-trading ÷ FY26 EBITDA, assuming near-zero incremental cost.

| EBITDA uplift | 50% realised | 70% realised | 90% realised |
| ------------- | ------------ | ------------ | ------------ |
| 10% hike      | +8.5%        | +11.8%       | +15.2%       |
| **15% hike**  | +12.7%       | **+17.7%**   | +22.8%       |
| 20% hike      | +16.9%       | +23.7%       | +30.4%       |

**Result.** A **15% hike with 70% realisation** adds about **₹13,500 crore**, or **+17.7%**, to EBITDA, roughly one year of growth. Motilal Oswal assumes such a hike in December 2026. Tariffs are the single fastest lever for closing the ROE gap in Analysis 2. They are also a regulatory and competitive variable that Jio does not fully control.

---

## 7. Five ways the market can get Jio wrong

### 1. Confusing demand with value

A 22× subscription says the shares are scarce. It says nothing about whether ₹1,119 is cheap. With a 2.9% float, demand from index funds and allocation-hungry institutions can outrun fundamentals for months.

### 2. Valuing EBITDA instead of cash

Jio's 52% EBITDA margin is world-class. Its 2.6% FCFF yield on enterprise value is not. The difference is capex, tax and spectrum. Valuation should start from the cash, as in Analysis 1.

### 3. Ignoring the spectrum liability

Leaving out ₹1.04 lakh crore of deferred spectrum dues cuts EV/EBITDA from about 15× to about 13×. That flatters Jio by roughly 1.5 turns of EBITDA against peers whose leverage figures include similar items.

### 4. Assuming the multiple holds

Analyses 3 and 4 show that the exit multiple drives returns as much as earnings growth. Global telecom operators trade well below 30× earnings. Jio's premium is partly a platform and scarcity premium, and premiums are the first thing to compress.

### 5. Treating the listing price as the entry price

Allottees bought at ₹1,119. Anyone buying near the grey-market level of ≈₹1,365 pays about 42× trailing earnings. The Monte Carlo puts their median return close to zero.

---

## 8. The quant dashboard: what to watch

![The quant dashboard: five numbers that will reprice Jio](/jio-ipo-valuation-2026/fig7_quant_dashboard.png)

| Signal                     | Current level                  | What would change the view                                       |
| -------------------------- | ------------------------------ | ---------------------------------------------------------------- |
| **ROACE**                  | 10.8%                          | Two consecutive years of increases would validate the premium    |
| **Tariffs and ARPU**       | ~15% hike assumed for Dec 2026 | Realisation above 70% with stable churn                          |
| **Capex / EBITDA**         | 45%                            | A spectrum auction or 6G cycle pushing it back up                |
| **Non-mobile revenue mix** | ~11%                           | Broadband, enterprise and digital rising without margin dilution |
| **Float and flows**        | 2.9%                           | Index inclusion versus lock-up expiries in the first year        |

| Risk                 | Why it matters                                                                |
| -------------------- | ----------------------------------------------------------------------------- |
| Multiple compression | 34× leaves little room for disappointment                                     |
| Regulation           | Licence fees, spectrum pricing, satellite-broadband entry                     |
| Concentration        | RJIL is about 95% of EBITDA                                                   |
| Governance           | Promoter-controlled group; related-party dealings with RIL                    |
| Holdco discount      | Markets often discount listed stakes held by a parent, which may weigh on RIL |

---

## 9. Why this matters beyond Mumbai

Jio's IPO shows that a developing-country capital market can now absorb a **$3.6 billion** primary issue largely from domestic savings. For smaller markets from Kathmandu to Dhaka, three lessons stand out:

| Lesson                                         | Implication for frontier markets                                                                                                                                                         |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Domestic depth is the real story**           | Retail bid ₹6,900 crore on day one. Mutual-fund penetration, digital demat accounts and investor protection built that depth; markets like Nepal's NEPSE still need it.                  |
| **Thin floats are a policy trade-off**         | India eased float rules to list a giant. The cost is weaker price discovery. Regulators such as Nepal's SEBON face the same tension with large state-owned telecom and hydropower firms. |
| **Connectivity is development infrastructure** | Jio's cheap data after 2016 brought hundreds of millions online and seeded digital payments. The productivity dividend matters more than any one valuation.                              |

**For readers outside India:** Jio's offering documents state there is no public offering of the shares in the United States, and residents of many countries, including Nepal, face restrictions on portfolio investment abroad. Check the rules that apply to you.

---

## The bottom line

The Jio IPO is a vote of confidence in India's digital economy, and the business deserves it: dominant scale, 52% EBITDA margins, falling capex and minimal conventional debt.

But the price is a forecast. At ₹1,119, the market is assuming **≈15% cash-flow growth for a decade** and a **return on equity near 24%**, against **9.4%** today. That can happen through tariff increases, capex discipline and a growing non-mobile business. It has not happened yet.

> **Oversubscription measures demand, not value. The test for Jio is not how many investors wanted the shares, but whether its return on capital rises to meet the price they paid.**

---

### Your take

Is Jio a telecom utility that deserves a telecom multiple, or a digital platform that deserves a premium? Share your view in the comments.

---

> **Methodology and research**
>
> All valuation models in Section 6 are the author's own calculations from Jio Platforms' RHP figures as reported in secondary summaries. Reverse DCF: two-stage FCFF model, 10-year explicit period, Gordon terminal value. Implied ROE: justified P/B model. Monte Carlo: 200,000 draws, seed 42.
>
> **Also by the author:** > [_When Backtests Lie_](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7652318) (SSRN) · [_Conditional Tail Episode Risk_](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7502499) (SSRN) · [_Systemic Tail Episode Risk_](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7534899) (SSRN)

---

### About the author

**Niraj Neupane, CA (ICAI)**, is a quantitative researcher whose work focuses on validating machine-learning risk models and measuring path-dependent and systemic tail risk for financial institutions and regulators. He is the founder of **Korvane**, an AI-powered trade, risk and validation platform, and **Calderyn Institute**, which trains professionals in quantitative finance and AI engineering. ORCID: 0009-0003-7026-7026.

_Views expressed are the author's own and do not represent any employer. This article is for information and education only and is not investment advice or a recommendation to buy or sell any security. The author holds no position in Jio Platforms or Reliance Industries at the time of writing._

---

## Listing update — October 28, 2026 (first trading day)

NSE's official first-day figures are in, and they sit at the friendly end of this model's range:

| First-day marker (NSE, Oct 28) | Figure |
|---|---|
| **Open** | ₹1,358.00 (+21.4% vs the ₹1,119 issue price) |
| **Official close** | **₹1,417.50** (+26.7%) |
| Intraday range | ₹1,357 – ₹1,423.90 |
| VWAP | ₹1,368.97 |
| Market value at close | ≈ ₹13.0 lakh crore (vs ₹10.3 lakh crore at issue) |
| P/E at close | ≈ 43.5x (vs 34.3x at the issue price) |

Three notes. First, ₹1,419 was the last traded price, not the official close — the close is ₹1,417.50. Second, a strong listing does not re-run this model: at the close, the market is paying for *more* than the 15.4% ten-year free-cash-flow growth the issue price already implied, and the implied ROE gap this piece flagged widens rather than closes. Whether the Section 12 arithmetic gets re-run at the new price is a desk decision, not an automatic update — the FY26 inputs (9.4% ROE, 51.9% EBITDA margin, ARPU of ₹214) are unchanged by a listing pop. Third, no 2020 investor sold into the debut: the issue carried no offer for sale, so Meta, Google and the other eleven financial and strategic holders from the 2020 rounds still hold their stakes — each of which is now worth roughly two-and-a-half to three times its entry price, as detailed in our companion piece on the investors of 2020.

### Sources

**IPO terms and subscription**

- Chittorgarh, Jio Platforms IPO details and valuation: https://www.chittorgarh.com/ipo/jio-platforms-ipo/
- ICICI Direct, Jio Platforms IPO terms and objects of the issue: https://www.icicidirect.com/ipo/reliance-jio-ipo
- IPOji, Jio Platforms IPO subscription and GMP: https://www.ipoji.com/ipo/jio-platforms-ipo
- PSU Connect, Jio Platforms IPO fully subscribed in 100 minutes: https://www.psuconnect.in/ipo/jio-platforms-ipo-fully-subscribed-in-100-minutes-indias-largest-30213-cr-issue
- TelecomTalk, Jio Platforms IPO breaks records on day one: https://telecomtalk.info/jioplatformsipo-breaksrecords-on-day1-qibdemand-surges-9-42times/1013110/
- Kotak Neo, India's biggest private IPO in works: https://www.kotakneo.com/news/market-news/indias-biggest-private-ipo-in-works-as-jio-prepares-drhp-filing/

**Financials (RHP summaries)**

- 5paisa, Jio Platforms FY26 financials: https://www.5paisa.com/index.php/blog/jio-platforms-fy26-financials-revenue-profit
- DSIJ, RHP balance sheet and cash flow: https://insights.dsij.in/dsijarticledetail/jio-platforms-ipo-rs-30213-crore-mega-issue-from-indias-telecom-leader-should-you-subscribe
- Finnovate, segment contribution, Q1 FY27 and net debt: https://www.finnovate.in/learn/blog/jio-platforms-review-details-investment-guide
- IPO Central, capex, leverage and ROACE: https://ipocentral.in/?p=265153
- IPO Central, Jio Platforms IPO review: https://ipocentral.in/jio-platforms-ipo-review/
- Kotak Neo, top 10 things from the DRHP: https://www.kotakneo.com/news/ipos/jio-ipo-journey-moves-ahead-top-10-things-investors-should-know-from-drhp/

**Valuation and peers**

- INDmoney, Jio Platforms IPO review (P/E, ROCE, spectrum dues): https://www.indmoney.com/blog/ipo/jio-platforms-ipo-review
- Business Today, Jio likely to seek premium over Airtel valuations: https://www.businesstoday.in/markets/ipo-corner/story/jio-platorms-ipo-likely-to-seek-premium-over-bharti-airtel-valuations-fresh-gmp-what-analysts-say-560019-2026-10-07
- Business Today, 14.8× EV/EBITDA at the upper band: https://www.businesstoday.in/markets/ipo-corner/story/jio-platforms-ipo-issue-subscribed-57-in-pre-ipo-window-nse-data-shows-check-latest-gmp-562677-2026-10-21
- Outlook Business, Jio's IPO can put Airtel's valuation in focus (MOFSL): https://www.outlookbusiness.com/amp/story/corporate/jios-ipo-can-put-airtels-valuation-in-focus
- Multibagg, Emkay valuation checks: https://www.multibagg.ai/market-pulse/articles/jio-platforms-ipo-valuation-checks-cmvilk7g000002wphbs3h51lb
- Business Today, Nuvama on RIL shareholders: https://www.businesstoday.in/amp/markets/stocks/story/jio-platforms-ipo-why-nuvama-says-reliance-shareholders-may-not-gain-much-after-listing-538408-2026-06-22

<sub>All charts and models in Sections 1–8 are the author's own work from the sources above. FCFF excludes spectrum instalments and working capital. Monte Carlo and scenario results are illustrative distributions, not forecasts or price targets. The valuation bar chart in Section 2 is an earlier third-party estimate shown for historical comparison; the NSE ceremony photo is representative and not of the Jio listing; the campus image is illustrative. Rupee/dollar conversion at ≈ ₹84/$. Graphics © Niraj Neupane.</sub>
