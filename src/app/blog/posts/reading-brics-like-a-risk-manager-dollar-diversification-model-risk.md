---
slug: 'reading-brics-like-a-risk-manager-dollar-diversification-model-risk'
date: '09/20/2026'
title: 'Reading BRICS Like a Risk Manager: Why Dollar Diversification Is a Model-Risk Problem for U.S. Financial Markets'
subtitle: "BRICS is not replacing the dollar. The more consequential question is whether a more diversified global financial system could make yesterday's risk assumptions less reliable."
categories:
  [
    'BRICS',
    'De-Dollarization',
    'US Dollar',
    'Reserve Currency',
    'Central Banks',
    'Gold',
    'Treasuries',
    'Foreign Exchange',
    'Global Economy',
    'Model Risk',
    'Risk Management',
    'Value at Risk',
    'Quantitative Research',
    'IMF COFER',
    'wall street',
    'Signals',
  ]
image: '/reading-brics/brics-dollar-wall-street-global-financial-flows.png'
author: 'Niraj Neupane'
---

**Financial Gurkha | Risk & Markets | September 20, 2026**

_By [Niraj Neupane](/about/niraj)_

---

![Conceptual illustration of Wall Street and global financial flows](/reading-brics/brics-dollar-wall-street-global-financial-flows.png)

_**Conceptual illustration.** The dollar remains the dominant node in global finance even as alternative financial channels develop around it._

### What's in this report

- [The Question Wall Street Should Be Asking](#the-question-wall-street-should-be-asking)
- [Part I — The Dollar Is Still the Incumbent](#part-i--the-dollar-is-still-the-incumbent)
- [Part II — BRICS Is Building Optionality, Not a Single Replacement Currency](#part-ii--brics-is-building-optionality-not-a-single-replacement-currency)
- [Part III — Why Payment Infrastructure Matters More Than the Currency Headline](#part-iii--why-payment-infrastructure-matters-more-than-the-currency-headline)
- [Part IV — The Model-Risk Problem](#part-iv--the-model-risk-problem)
- [Part V — A Changing Monetary Architecture Can Change Correlations](#part-v--a-changing-monetary-architecture-can-change-correlations)
- [Part VI — The Dollar Can Remain Dominant While Becoming Less Exclusive](#part-vi--the-dollar-can-remain-dominant-while-becoming-less-exclusive)
- [Part VII — Gold Adds Another Layer](#part-vii--gold-adds-another-layer)
- [Part VIII — The Slow Drift](#part-viii--the-slow-drift)
- [Part IX — The April 2025 Lesson](#part-ix--the-april-2025-lesson)
- [Part X — From VaR to Scenario-Based Model Validation](#part-x--from-var-to-scenario-based-model-validation)
- [Part XI — What Should Risk Managers Actually Monitor?](#part-xi--what-should-risk-managers-actually-monitor)
- [Part XII — AI and Machine Learning Can Help — But They Do Not Eliminate Model Risk](#part-xii--ai-and-machine-learning-can-help--but-they-do-not-eliminate-model-risk)
- [Part XIII — BRICS as a Stress Test for the Global Financial System](#part-xiii--brics-as-a-stress-test-for-the-global-financial-system)
- [The Risk Manager's Conclusion](#the-risk-managers-conclusion)
- [Final Takeaway](#final-takeaway)
- [Data & Sources](#data--sources)

---

## The Question Wall Street Should Be Asking

Every few years, the BRICS conversation returns to the same headline:

> Will BRICS replace the U.S. dollar?

That may be the wrong question.

For a risk manager, the more useful question is:

> What happens to financial-market risk models if the global system gradually becomes less dependent on a single currency, settlement channel, and liquidity architecture?

That distinction matters.

At the 18th BRICS Summit in New Delhi on September 12–13, 2026, leaders of the expanded bloc emphasized economic and financial cooperation, including greater use of local currencies and work on cross-border payment mechanisms. The summit's communiqué also backed further efforts to promote trade and investment settlement in local currencies and to improve the interoperability of central-bank digital currencies.

But there was no new BRICS currency.

Earlier in the year, India's central bank had proposed exploring links between BRICS central-bank digital currencies, while emphasizing that the objective was to make cross-border transactions more efficient. RBI Governor Sanjay Malhotra subsequently described CBDC and fast-payment-system linkages as options still under discussion.

That is precisely why the issue deserves a different analytical framework.

The risk is not necessarily **dollar replacement**.

It is **dollar diversification**.

And for quantitative risk management, diversification of the global monetary architecture can become a **model-risk problem**.

## Part I — The Dollar Is Still the Incumbent

Before discussing de-dollarization, it is important to establish the starting point.

The U.S. dollar remains deeply embedded in the international financial system.

According to the IMF's latest Currency Composition of Official Foreign Exchange Reserves data, the dollar represented **57.13% of global official foreign-exchange reserves in Q1 2026**, up from 56.42% in Q4 2025. The IMF notes that exchange-rate valuation effects accounted for around half of the quarterly increase in the dollar's share.

![The dollar's incumbency in official foreign exchange reserves](/reading-brics/fig-1-usd-share-official-fx-reserves-imf-cofer.png)

**FIG. 1 · IMF COFER.** _The dollar remains the dominant reserve currency even as the international monetary system becomes more diversified at the margin._

The foreign-exchange market tells an even stronger story.

The BIS reported that OTC foreign-exchange turnover reached approximately **$9.6 trillion per day in April 2025**, with the U.S. dollar on one side of **89.2% of all FX transactions**. That was actually up from 88.4% in 2022.

The renminbi has gained ground in FX trading, reaching 8.5% of global turnover in the 2025 BIS survey, but the dollar remains the world's dominant vehicle currency.

So the starting point is clear:

> The dollar remains dominant.

But dominance and exclusivity are not the same thing.

A financial system can remain dollar-centered while simultaneously developing additional settlement channels around it.

That is where the BRICS story becomes interesting.

## Part II — BRICS Is Building Optionality, Not a Single Replacement Currency

The most important development coming out of BRICS 2026 is not a new currency.

It is the continued effort to make **cross-border transactions easier without requiring every transaction to pass through the same currency and financial infrastructure**.

India's proposal to explore CBDC linkages is a good example. Reuters reported in January that the Reserve Bank of India had recommended putting the idea of connecting BRICS CBDCs on the summit agenda. The proposal was intended to facilitate cross-border trade finance and tourism payments.

By August, the RBI governor said BRICS members were discussing potential links between fast-payment systems and CBDCs, while stressing that the discussions remained at an early stage.

The New Delhi summit subsequently reinforced the broader direction toward local-currency settlement and interoperable payment infrastructure. Reuters described those initiatives as more achievable than a common BRICS currency and unlikely to challenge the dollar's dominant role in global finance in the near term.

This distinction is critical.

Think of the international financial system as a network.

Historically, an enormous amount of global commerce has relied on the dollar as the dominant intermediary.

BRICS does not necessarily have to eliminate that network.

It can build **additional pathways around it**.

```
Traditional architecture

Local economy
  → USD
  → correspondent banking
  → global settlement

Emerging architecture

Local economy
  → local currency
  → interoperable payment infrastructure
  → local counterparty
```

The second pathway does not have to replace the first.

It only needs to become sufficiently useful that market participants have another option.

**And options matter.**

## Part III — Why Payment Infrastructure Matters More Than the Currency Headline

Currency dominance is not determined only by the currency printed on a banknote.

It is reinforced by infrastructure.

- deep capital markets;
- liquid government securities;
- correspondent banking;
- derivatives markets;
- foreign-exchange liquidity;
- payment systems;
- collateral markets;
- legal infrastructure;
- market-making capacity; and
- the ability to move capital across borders efficiently.

This is why the BRICS payment discussion deserves more attention than the recurring headlines about a "BRICS currency."

The 2026 summit backed further work on cross-border payment mechanisms, local-currency settlement and CBDC interoperability. Reuters also highlighted a critical complication: payment infrastructure is not politically neutral, and disagreements over who controls the architecture can affect how quickly these systems develop.

That is a much more practical agenda.

A common currency would require an extraordinary level of monetary and political integration.

Interoperable payment infrastructure requires something very different:

> Technical compatibility and economic incentives.

The latter may be considerably easier to develop.

## Part IV — The Model-Risk Problem

Now we reach the part that matters most for financial risk management.

Most financial models are historical.

They learn relationships from historical data:

- correlations;
- volatilities;
- distributions;
- liquidity;
- spreads;
- default behavior;
- cross-asset relationships; and
- market reactions to shocks.

But historical data are generated by a particular **financial regime**.

If the regime changes, the historical sample may remain statistically correct while becoming less representative of the future.

That is the essence of **model risk**.

Consider a simplified example.

Suppose a risk model has historically observed a strong relationship between:

> USD strength ↔ Treasury demand ↔ global risk aversion.

During periods of stress, investors buy dollar assets.

Treasuries rally.

The dollar strengthens.

Portfolio hedges behave as expected.

A model calibrated to this environment can develop confidence in these relationships.

But what happens if global reserve managers and institutions gradually gain more alternatives?

Suppose a future geopolitical shock produces:

- greater use of local-currency settlement;
- more regional payment infrastructure;
- greater diversification of reserve assets;
- increased use of gold;
- different funding patterns; and
- less uniform demand for dollar liquidity.

The dollar may remain dominant.

Yet the **marginal behavior of investors during stress could change**.

That is the model-risk problem.

## Part V — A Changing Monetary Architecture Can Change Correlations

For a risk manager, the most important variable may not be the dollar's absolute share.

It may be the behavior of the dollar **during stress**.

Imagine a portfolio containing:

- U.S. Treasuries;
- USD FX exposure;
- emerging-market currencies;
- commodities;
- credit;
- equities; and
- derivatives.

A conventional risk framework might rely on historical relationships among those assets.

But correlations are not laws of nature.

They are characteristics of a regime.

```
Risk-off
  → USD ↑
  → Treasuries ↑
  → EM FX ↓

Alternative regime
  → USD ↑
  → Treasuries ↓

Geopolitical shock
  → USD liquidity ↑
  → cross-currency basis widens
  → emerging-market funding stress increases

Geopolitical fragmentation
  → regional settlement increases
  → liquidity becomes distributed across multiple currency systems
```

The problem for a risk model is not that one scenario is "right."

The problem is that **the probability distribution itself may be changing**.

## Part VI — The Dollar Can Remain Dominant While Becoming Less Exclusive

This is the distinction frequently lost in the de-dollarization debate.

The IMF's latest data show that the dollar still accounts for more than half of global official FX reserves.

The BIS shows an even more entrenched position in FX markets, with the dollar appearing on one side of 89.2% of transactions.

So the evidence does not support a simple narrative that the dollar is suddenly disappearing.

Instead, the more defensible hypothesis is:

> The international monetary system could become more diversified at the margin while remaining overwhelmingly dollar-centered.

That is a more subtle transition.

And subtle transitions are precisely where risk models can struggle.

A 5% or 10% change in an aggregate statistic may appear insignificant.

But if that change occurs disproportionately in:

- marginal transactions;
- reserve rebalancing;
- cross-border payments;
- commodity settlement;
- collateral;
- funding markets; or
- crisis-period liquidity,

its effect on market dynamics could be considerably larger than the headline number suggests.

## Part VII — Gold Adds Another Layer

Reserve diversification is not limited to currencies.

Gold has become an increasingly important variable in discussions of official reserves.

The World Gold Council estimates that central banks and other official institutions bought **863 tonnes of gold in 2025**, below the exceptional 1,000-tonne-plus levels of the previous three years but still well above the 2010–2021 average. Its 2026 reporting showed continued official-sector demand, including 244 tonnes in Q1 and 289 tonnes in Q2.

![Central bank gold purchases, 2022 to 2026 estimate](/reading-brics/fig-2-central-bank-gold-purchases-2022-2026e-wgc.png)

**FIG. 2 · WGC.** _Central-bank gold purchases remain elevated relative to the pre-2022 period, adding another dimension to reserve diversification._

But there is an important analytical caveat.

The IMF says gold's increased share of official reserves in 2025 was driven **overwhelmingly by valuation effects from higher gold prices**, rather than simply by large-scale accumulation of physical gold.

That distinction matters.

A risk manager should distinguish between:

> Valuation effects

and

> Portfolio reallocation.

If gold prices rise sharply, gold's share of reserves can increase even without central banks making a dramatic shift away from Treasuries.

But from a portfolio perspective, the development remains relevant.

Reserve managers have multiple assets available to them.

And the more diversified the reserve portfolio becomes, the more important it becomes to understand how those assets behave jointly during stress.

## Part VIII — The Slow Drift

The dollar's story is therefore better understood over decades than quarters.

![The dollar's reserve share from 2000 to 2026](/reading-brics/fig-3-usd-reserve-share-2000-2026-imf-cofer.png)

**FIG. 3 · IMF COFER.** _The long-run movement in the dollar's share of allocated official reserves shows a gradual, non-monotonic decline rather than a sudden collapse._

The chart shows the long-run movement in the dollar's share of allocated official reserves: from approximately **71.1% in 2000 to 57.1% in 2026**.

The important word is **slow**.

This is not a single-event collapse.

It is a long, non-monotonic evolution.

And that distinction is important for risk management.

A model does not necessarily fail because a variable moves dramatically overnight.

It can also become progressively less representative as the underlying regime changes.

The IMF's revised COFER dataset now provides a complete currency composition series with revisions back to 2000, making long-run comparisons more analytically consistent.

## Part IX — The April 2025 Lesson

The issue is not purely theoretical.

Financial markets have repeatedly demonstrated that historically familiar relationships can become unstable during periods of major policy and geopolitical uncertainty.

April 2025 provides a useful example of the importance of monitoring such regime behavior.

The BIS reported that global OTC FX turnover reached **$9.6 trillion per day in April 2025**, 28% above the 2022 survey level, during a period of elevated FX volatility and increased trading following major trade-policy announcements.

For risk managers, episodes like this matter because they can challenge assumptions about:

- correlation stability;
- liquidity;
- volatility;
- hedge effectiveness;
- market depth; and
- the behavior of traditional safe-haven assets.

The lesson is not that historical relationships are useless.

It is that **historical relationships have conditions**.

A model that works extremely well during one regime can become fragile when the market environment changes.

## Part X — From VaR to Scenario-Based Model Validation

This is where the discussion becomes actionable.

If global monetary diversification continues, financial institutions should not simply ask:

> "What is the probability of a dollar decline?"

A more useful risk-management framework asks:

> What happens if the assumptions embedded in our models stop holding?

### Scenario 1 — Gradual Reserve Diversification

Central banks slowly increase exposure to alternative reserve assets.

**Potential model implications:**

- changing FX correlations;
- altered reserve-flow dynamics;
- changes in Treasury-demand assumptions.

### Scenario 2 — Regional Payment Fragmentation

More international transactions settle through regional currencies and payment systems.

**Potential implications:**

- liquidity fragmentation;
- wider cross-currency basis;
- changing transaction costs;
- different stress-transmission channels.

### Scenario 3 — Geopolitical Liquidity Shock

Sanctions, trade restrictions or geopolitical escalation create simultaneous stress across several currencies.

**Potential implications:**

- nonlinear FX moves;
- funding stress;
- liquidity deterioration;
- model underestimation of tail losses.

### Scenario 4 — Safe-Haven Regime Change

The dollar and Treasuries no longer exhibit the same historical relationship during every crisis.

**Potential implications:**

- hedge-ratio instability;
- higher portfolio tail risk;
- increased Expected Shortfall;
- stress-test failures.

These scenarios do not predict that any one future will occur.

They test whether the institution is prepared if the assumptions underlying its models are wrong.

## Part XI — What Should Risk Managers Actually Monitor?

### 1. Reserve Composition

- USD reserve share;
- EUR and CNY shares;
- gold allocation;
- changes in reserve duration;
- central-bank portfolio behavior.

### 2. Payment Infrastructure

- local-currency settlement;
- CBDC interoperability;
- regional payment systems;
- correspondent-banking dependence;
- settlement concentration.

### 3. Market Liquidity

- bid-ask spreads;
- FX market depth;
- cross-currency basis;
- Treasury liquidity;
- funding spreads.

### 4. Correlation Stability

- USD/Treasury correlation;
- USD/gold correlation;
- FX/equity correlations;
- cross-asset hedge ratios;
- correlation clustering during stress.

### 5. Model Performance

- VaR exceptions;
- Expected Shortfall breaches;
- stress-test errors;
- liquidity-model errors;
- forecast instability;
- parameter drift;
- regime-switching indicators.

The goal is not to predict the end of dollar dominance.

The goal is to identify **when the statistical behavior of the system is beginning to diverge from the assumptions embedded in risk models.**

## Part XII — AI and Machine Learning Can Help — But They Do Not Eliminate Model Risk

This is where the next generation of financial-risk systems becomes important.

Machine-learning models can help identify:

- nonlinear relationships;
- structural breaks;
- regime changes;
- liquidity deterioration;
- unusual correlation patterns;
- tail dependencies; and
- emerging stress clusters.

For example, a traditional VaR model might assume a relatively stable covariance matrix.

A machine-learning or regime-switching framework could instead ask:

> Are the relationships that generated the covariance matrix still present?

That is a fundamentally different question.

But AI itself introduces another layer of model risk.

A complex model can detect a pattern without explaining why the pattern exists.

Therefore, advanced risk systems need:

> Prediction + validation + interpretability + stress testing + governance.

The objective should not be to replace conventional risk models with AI.

It should be to create **adaptive risk-management frameworks that can identify when conventional assumptions are becoming unreliable.**

## Part XIII — BRICS as a Stress Test for the Global Financial System

This is ultimately why BRICS 2026 is interesting from a quantitative-finance perspective.

The bloc does not need to create a new global currency to affect financial-market risk.

It can gradually influence the architecture through:

```
local-currency settlement
        ↓
payment interoperability
        ↓
regional financial infrastructure
        ↓
reserve diversification
        ↓
changing capital flows
        ↓
changing market correlations
        ↓
new stress-transmission channels
```

The process could take years.

It could also proceed unevenly.

Some initiatives may fail.

Some may remain politically symbolic.

Some may become commercially important.

The uncertainty itself is part of the risk.

Reuters' post-summit analysis makes a similar distinction: local-currency settlement and interoperable payment systems are more achievable than a common BRICS currency, while their near-term effect is more likely to be the creation of additional options than displacement of the dollar.

## The Risk Manager's Conclusion

The dollar is not disappearing.

The current evidence does not support that conclusion.

The dollar remains dominant in official reserves and overwhelmingly important in global FX markets.

But dominance does not guarantee that the future will statistically resemble the past.

BRICS 2026 illustrates a different possibility:

> A global financial system in which the dollar remains the central currency while alternative settlement mechanisms, local currencies and reserve assets gradually become more relevant.

That is not necessarily a dollar-collapse scenario.

It is a **regime-transition scenario**.

And regime transitions are where financial models are most vulnerable.

For U.S. financial institutions, the important question therefore should not be:

> "Will BRICS replace the dollar?"

It should be:

> **"Would our risk models still work if the financial system became meaningfully less dependent on the dollar than the historical data suggest?"**

That question changes the conversation from geopolitics to risk management.

From headlines to scenarios.

From prediction to validation.

And ultimately, from **dollar dominance** to **model resilience**.

## Final Takeaway

**BRICS does not have to dethrone the dollar to change the risk landscape.**

A gradual diversification of global payment systems, currencies and reserves could alter the relationships that U.S. financial institutions have historically relied upon.

For risk managers, the response is not to predict a post-dollar world.

It is to **stress-test the assumptions of today's models against the possibility of one.**

That is the real model-risk question.

## Data & Sources

- **IMF — Currency Composition of Official Foreign Exchange Reserves (COFER), Q1 2026:** dollar share 57.13%. [IMF Data Brief](https://data.imf.org/en/news/imf%20data%20brief%20july%201)
- **BIS — 2025 Triennial Central Bank Survey:** $9.6 trillion average daily OTC FX turnover; USD on one side of 89.2% of transactions. [BIS](https://www.bis.org/publications/202509-commentary-otc-derivatives.htm)
- **Reuters — BRICS payment systems and CBDC discussions, 2026.** [Reuters](https://www.reuters.com/world/india/advantage-china-new-delhis-brics-summit-2026-09-15/)
- **World Gold Council — Central-bank gold demand.** [World Gold Council](https://www.gold.org/goldhub/research/gold-demand-trends/gold-demand-trends-full-year-2025/central-banks)
- **IMF — COFER dataset.** [IMF COFER](https://data.imf.org/Datasets/COFER)

### About the author

**Niraj Neupane, CA (ICAI)** is a Quantitative Researcher, Financial Economist and Forward Deployed Engineer specialising in quantitative trading, machine learning and AI applications in financial markets, financial econometrics, and model validation. Read more on his [author profile](/about/niraj).

### Related reading

- [When Markets Turn Volatile, Can Machine Learning See the Risk Coming?](/blog/ml-liqvar-machine-learning-value-at-risk-us-equities)
- [Dollar Gold Crude Relations](/blog/usd-dxy-gold-oil-since-2022)
- [Gold: A Primer on Commodities and Trading](/blog/a-primer-on-precious-metals)

---

_The views expressed are the author's own and do not represent any employer or institution. This article is commentary and analysis, not investment advice._
