---
slug: 'ml-liqvar-machine-learning-value-at-risk-us-equities'
date: '09/11/2026'
title: 'When Markets Turn Volatile, Can Machine Learning See the Risk Coming?'
subtitle: 'ML-LiqVaR combines GARCH volatility modelling, Extreme Value Theory and gradient-boosted quantile regression to forecast one-day-ahead Value-at-Risk on US equities. Across 8,072 out-of-sample observations from eight S&P 500 constituents between 2018 and 2024, it delivered the closest 99% calibration and the lowest average pinball loss of five models tested — but its improvement over GARCH-EVT was not statistically significant at the 5% level. This is what the paper found, what it did not find, and why the second half matters as much as the first.'
categories:
  [
    'Quantitative Research',
    'Value at Risk',
    'Risk Management',
    'Machine Learning',
    'Financial Econometrics',
    'GARCH',
    'Extreme Value Theory',
    'Gradient Boosting',
    'Liquidity',
    'Market Risk',
    'Model Validation',
    'VIX',
    'S&P 500',
    'SSRN',
    'Signals',
    'wall street',
  ]
image: '/CANiraj/ML-LiqVarCover.png'
author: 'Niraj Neupane'
---

_Disclaimer: This article is for educational purposes only. It summarises working-paper research that has not been peer reviewed. Trading and investments are subject to volatility, market risks, and macroeconomic shifts that could lead to partial or total loss of capital. Nothing here is investment advice or a recommendation to use any model in a live risk or trading system. Please consult your own risk, compliance and investment professionals before acting on any of it._

---

**Financial Gurkha | Research Note | September 11, 2026**

_By [Niraj Neupane](/about/niraj), CA (ICAI) — Quantitative Researcher, Financial Economist, Forward Deployed Engineer. This article summarises the author's own working paper, ML-LiqVaR, available in full on SSRN._

---

When volatility rises and liquidity dries up, measuring equity-market risk accurately stops being an academic exercise and becomes an operational one. Margin gets called on numbers. Limits get breached on numbers. Capital gets held against numbers. And the number almost everyone is arguing about, in almost every seat on a trading floor, is some version of the same question: **how much can this lose tomorrow?**

Value-at-Risk is the industry's standard answer to that question, and it has been for thirty years. It is also, famously, the answer that fails exactly when it is needed — in March 2020, in February 2018, in any week when the distribution of returns stops looking like the distribution the model was fitted on.

My working paper, **ML-LiqVaR**, asks a narrow and testable version of the obvious follow-up: can machine learning, given information about liquidity and market regime that traditional models mostly ignore, forecast that number better?

The honest answer, which the paper reports in full, is: **a little, consistently, but not by enough to claim victory.** That result is less exciting than the headline this article could have carried. It is also the result, and reporting it accurately is the whole point of doing the work.

!["The Hydrid VAR Framework Proposed by CA Niraj"](/CANiraj/image.png)

<Paper
  title="ML-LiqVaR: A Liquidity- and Regime-Aware, Extreme-Value-Calibrated Gradient-Boosting Value-at-Risk Model for US Equities"
  authors="Niraj Neupane"
  venue="SSRN Working Paper"
  id="7222958"
  href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7222958"
  abstract="A hybrid framework for one-day-ahead Value-at-Risk forecasting combining GARCH volatility modelling, conditional Extreme Value Theory, and gradient-boosted quantile regression, conditioned on volatility, momentum, VIX and liquidity features. Evaluated on 8,072 out-of-sample observations across eight large-cap US equity constituents, 2018 to 2024."
/>

### What's in this report

- [1. What Value-at-Risk Actually Claims](#1-what-value-at-risk-actually-claims)
- [2. Why the Standard Models Break in a Crisis](#2-why-the-standard-models-break-in-a-crisis)
- [3. What ML-LiqVaR Does Differently](#3-what-ml-liqvar-does-differently)
- [4. The Three Components, Explained](#4-the-three-components-explained)
  - [4.1 GARCH: getting the scale right](#41-garch-getting-the-scale-right)
  - [4.2 Gradient-boosted quantile regression: learning the shape](#42-gradient-boosted-quantile-regression-learning-the-shape)
  - [4.3 Conditional EVT: handling the part nobody has data for](#43-conditional-evt-handling-the-part-nobody-has-data-for)
- [5. The Features: Volatility, Momentum, VIX, Liquidity](#5-the-features-volatility-momentum-vix-liquidity)
- [6. How the Model Was Tested](#6-how-the-model-was-tested)
- [7. What the Research Found](#7-what-the-research-found)
- [8. What the Research Did Not Find](#8-what-the-research-did-not-find)
- [9. Why the Negative Result Matters](#9-why-the-negative-result-matters)
- [10. Practical Implications for Risk Teams](#10-practical-implications-for-risk-teams)
- [11. Limitations and What Comes Next](#11-limitations-and-what-comes-next)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Conclusion and Key Takeaways](#conclusion-and-key-takeaways)
- [Methodology and Sources](#methodology-and-sources)
  - [About the author](#about-the-author)
  - [Related reading](#related-reading)

---

## 1. What Value-at-Risk Actually Claims

Value-at-Risk <Info label="Value-at-Risk">A single number summarising the loss a position or portfolio should not exceed, over a given horizon, with a given probability. "One-day 99% VaR of $2 million" means: on 99 days out of 100, tomorrow's loss should come in under $2 million. It says nothing about how bad the remaining one day in 100 gets — that is Expected Shortfall's job.</Info> is a quantile forecast wearing a suit. Strip away the regulatory apparatus and the reporting conventions and it is one claim: _tomorrow's loss will not exceed X, with probability p._

The claim is falsifiable, which is its great virtue. If you forecast a 99% VaR every day for a year, you should breach it roughly 2.5 times. Breach it fifteen times and the model is wrong in a way that can be demonstrated, not merely argued about. That property is why supervisors like VaR despite its well-catalogued defects: it is a number you can hold a model to.

Two things follow from this that are worth stating before any of the modelling.

**First, a VaR model is judged on calibration, not on accuracy in the usual sense.** Nobody expects the model to predict tomorrow's return. The model is expected to draw a line such that returns fall below it at the stated frequency — no more, no less. A model that is too conservative fails just as surely as one that is too aggressive; it simply fails in the direction that costs capital instead of the direction that costs money.

**Second, the 99% level is where models are tested and where they are weakest.** A 95% quantile is estimated from plenty of data — one observation in twenty is on the wrong side of it. A 99% quantile is estimated from almost nothing. In a 500-day calibration window, five observations define it. This is the central statistical problem of tail-risk measurement, and no amount of machine learning makes it go away.

---

## 2. Why the Standard Models Break in a Crisis

The workhorse models each fail in a characteristic way, and the failures are informative.

**Historical Simulation** takes the empirical distribution of the last N days and reads the quantile off it directly. It makes no distributional assumption, which is appealing, and it has no memory of anything outside the window, which is not. A 250-day historical VaR entering March 2020 had spent the previous year looking at one of the calmest markets in living memory. It was, by construction, calibrated to a world that had just ended.

**Parametric Normal VaR** assumes returns are Gaussian. Equity returns are not Gaussian; they are fat-tailed <Info label="Fat tails">A distribution where extreme outcomes occur far more often than a normal distribution predicts. Under a normal distribution, a five-standard-deviation daily move should occur roughly once every 7,000 years. In equity markets they arrive every few years. Every risk model built on a normal assumption is, at the tail, systematically optimistic.</Info> and negatively skewed. The assumption is wrong in precisely the region the model exists to describe. Using the Student-t distribution instead is a genuine improvement, and still an assumption imposed rather than estimated.

**GARCH** <Info label="GARCH">Generalised Autoregressive Conditional Heteroskedasticity. A model of how volatility itself evolves: today's volatility depends on yesterday's volatility and yesterday's shock. It captures volatility clustering — the well-documented fact that turbulent days follow turbulent days and calm follows calm — which is why it has been the backbone of market risk modelling since the 1980s.</Info> addresses the biggest of these problems. Volatility is not constant, it clusters, and GARCH models the clustering explicitly. Combining GARCH with **Extreme Value Theory** <Info label="Extreme Value Theory">A branch of statistics concerned specifically with the behaviour of extreme observations. Rather than fitting a distribution to all the data and reading off the tail, EVT fits a distribution — typically the Generalised Pareto — only to observations beyond a high threshold. It is the statistically principled way to estimate a quantile further into the tail than your sample size would otherwise support.</Info> in the tail — the GARCH-EVT approach — is, on most published evidence, the strongest conventional method available. It is the benchmark any new model has to beat, and in this paper it is the benchmark that proved hard to beat.

What all of them share is a blind spot. Each conditions on the **history of returns** and essentially nothing else. They do not know whether the market is liquid. They do not know whether the option market is pricing fear. They do not know what regime they are in, except insofar as recent returns reveal it. When a crisis arrives, that information exists — it is in the spread, in the volume, in the VIX — and the model is not looking at it.

---

## 3. What ML-LiqVaR Does Differently

ML-LiqVaR is built on a simple premise: the information that a risk model needs during a regime change is available before the regime change shows up in the return series, and a model that conditions on it should forecast the tail better than one that does not.

The framework has three parts working together rather than competing:

| Component                            | What it contributes                                                     | Why it is there                                                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| GARCH volatility modelling           | A conditional volatility estimate that responds to clustering           | Standardises returns so the tail can be modelled on something closer to i.i.d. data                               |
| Gradient-boosted quantile regression | A flexible, non-linear quantile estimate conditioned on market features | Lets the model learn interactions between volatility, momentum, VIX and liquidity that no parametric form imposes |
| Conditional Extreme Value Theory     | A principled tail distribution beyond a high threshold                  | Supplies the far tail, where the learner has too few observations to be trusted                                   |

The third row is the one that distinguishes this from a generic "machine learning for VaR" exercise. **A gradient-boosting model is not asked to extrapolate into the extreme tail.** It cannot do that reliably — a tree-based learner can only predict values it has seen, and the 99.5th percentile of a loss distribution is, definitionally, something it has barely seen. Rather than pretending otherwise, ML-LiqVaR combines the machine-learned quantile with an EVT-fitted tail, so the region where the learner is weakest is handled by the method designed for exactly that region.

The result is a hybrid that is liquidity-aware and regime-aware where the data supports learning, and extreme-value-calibrated where it does not.

---

## 4. The Three Components, Explained

### 4.1 GARCH: getting the scale right

Before you can model the shape of a tail, you have to deal with the fact that the scale of returns changes constantly. A −3% day in a 10% annualised-volatility regime and a −3% day in a 45% regime are not the same event, and a model that treats them identically is throwing away the most reliable signal in financial time series.

GARCH provides a conditional volatility estimate for each day. Dividing returns by it produces standardised residuals that are far closer to identically distributed than raw returns — which is the precondition for everything that follows. This is not novel; it is the step that makes the rest legitimate.

### 4.2 Gradient-boosted quantile regression: learning the shape

Quantile regression <Info label="Quantile regression">Regression that targets a specified quantile of the response distribution rather than its mean, by minimising an asymmetric "pinball" loss. Ordinary regression asks what the average outcome is given the inputs; quantile regression asks what the 1st-percentile outcome is. For VaR forecasting, that is precisely the question.</Info> estimates a conditional quantile directly, which is what a VaR forecast is. Gradient boosting makes that estimate non-parametric: instead of assuming the 1% quantile is a linear function of volatility and VIX, the model learns whatever function the data supports, including interactions.

This matters because the interactions are where the interesting behaviour lives. High volatility with normal liquidity is a different risk environment from high volatility with wide spreads and thin books — the second is how a drawdown becomes a cascade. A linear model has to be told to look for that interaction. A boosted tree ensemble finds it if it is there.

### 4.3 Conditional EVT: handling the part nobody has data for

Beyond a high threshold, EVT fits a Generalised Pareto distribution to the exceedances and extrapolates from there. Applied conditionally — to the GARCH-standardised residuals rather than to raw returns — it gives a tail estimate that respects both the current volatility regime and the genuine fat-tailedness of equity returns.

Combining this with the machine-learned quantile rather than choosing between them is the design decision at the centre of the paper. Each method is used where it is strongest.

---

## 5. The Features: Volatility, Momentum, VIX, Liquidity

The model conditions on four families of information.

**Realised volatility.** The measured variability of recent returns, over multiple lookback windows. This is the base rate of risk and the single most informative input any VaR model has.

**Momentum.** Trailing return over various horizons. Equity tail risk is asymmetric with respect to recent direction — drawdowns behave differently from rallies of the same magnitude, and a model conditioning on level alone misses that.

**VIX.** The option market's expectation of near-term S&P 500 volatility <Info label="VIX">The CBOE Volatility Index — a measure of expected 30-day volatility of the S&P 500, derived from index option prices. Because it is forward-looking and priced by participants with capital at risk, it often moves before realised volatility does. For a model trying to anticipate rather than describe a regime shift, that lead is the point.</Info>. This is the one genuinely forward-looking input in the feature set. Realised volatility tells you what has happened; VIX tells you what the market is paying to protect against.

**Liquidity-related information.** The ability to transact without moving the price. It is the variable most conspicuously absent from conventional VaR and the reason the model carries "Liq" in its name. A large position in a name with a wide spread and thin depth has a risk profile that its return history does not disclose, and liquidity evaporation is the mechanism through which ordinary drawdowns become disorderly ones.

The hypothesis being tested is that these features carry information about the conditional tail beyond what the return series alone reveals. The results, as we will see, support that hypothesis directionally without confirming it at conventional significance levels.

---

## 6. How the Model Was Tested

The evaluation design matters more than the model description, because this is the part that determines whether the results mean anything.

| Design choice              | Specification                             |
| -------------------------- | ----------------------------------------- |
| Universe                   | Eight S&P 500 constituents                |
| Period                     | 2018 to 2024                              |
| Out-of-sample observations | 8,072                                     |
| Horizon                    | One day ahead                             |
| Models compared            | Five, including GARCH-EVT                 |
| Primary metrics            | 99% VaR calibration; average pinball loss |

Three features of this design deserve emphasis.

**The sample period includes real stress.** 2018 to 2024 spans the February 2018 volatility shock, the Q4 2018 drawdown, the March 2020 COVID crash, the 2022 bear market and the 2023 regional banking episode. A VaR model evaluated only on calm data tells you nothing; this window does not have that problem.

**All results are out-of-sample.** 8,072 observations were forecast by models that had not seen them. In-sample VaR performance is close to meaningless — any sufficiently flexible model fits a historical quantile perfectly — and the distinction is where a large share of published machine-learning-in-finance results quietly fall apart.

**Five models were compared, including the strongest conventional benchmark.** It would have been easy, and considerably more flattering, to benchmark against Historical Simulation and Normal VaR alone. Those are weak comparators and beating them proves very little. GARCH-EVT is the method a serious risk team would actually use, and it is the one that had to be beaten for the result to mean anything.

---

## 7. What the Research Found

On the two primary metrics, ML-LiqVaR came out in front.

**Closest 99% VaR calibration among the five models tested.** Of the five, ML-LiqVaR's realised breach rate sat nearest to the 1% the model claimed. Calibration at the 99% level is the hardest thing for a VaR model to get right and the property supervisors examine first, so leading on it is the most meaningful of the two results.

**Lowest average pinball loss** <Info label="Pinball loss">The standard scoring rule for quantile forecasts. It penalises errors asymmetrically: for a 1% quantile forecast, being above the realised return is penalised lightly and being below it is penalised heavily, in proportion to the quantile level. Unlike a simple breach count, it rewards forecasts that are close as well as correct, which makes it the more informative of the two metrics — and the harder one to game.</Info> **among the five models tested.** Where breach counting asks only whether the model was on the right side of the line, pinball loss asks how far off it was. Leading on both suggests the improvement is not an artefact of one metric.

Taken together: across 8,072 out-of-sample observations spanning two major market dislocations, a model conditioning on liquidity and regime information produced better-calibrated and better-scored tail forecasts than four alternatives, including the leading conventional method.

That is a real result. It is also not the result the headline of this article implies, and the next section explains why.

---

## 8. What the Research Did Not Find

**ML-LiqVaR's improvement over GARCH-EVT was not statistically significant at the 5% level.**

This is the sentence that determines what can honestly be claimed, so it is worth being precise about what it means and what it does not.

It does **not** mean the improvement is fake. ML-LiqVaR led on both primary metrics, and consistently enough to be worth reporting.

It **does** mean that the improvement is not large enough, relative to the noise in the comparison, to rule out chance at the conventional threshold. Reproduce the study on a different eight names, or a different seven-year window, and the ranking could plausibly reverse.

The reason this is unsurprising is statistical rather than methodological. Tests comparing VaR models have notoriously low power. You are comparing performance on events that by construction occur 1% of the time; in 8,072 observations that is roughly 80 breaches to distinguish two models on. Small differences in calibration are simply hard to establish at that sample size — a problem that afflicts the entire tail-risk literature and is not solved by having a better model.

The correct summary is therefore: **competitive performance, not demonstrated superiority.** ML-LiqVaR performs at least as well as the strongest conventional benchmark and leads it on the primary metrics, and the evidence is not sufficient to claim it is better.

---

## 9. Why the Negative Result Matters

There is a version of this research that reports the calibration and pinball-loss wins, describes the framework as outperforming GARCH-EVT, and never mentions the significance test. It would be more quotable. It would also be the specific failure mode that has made a great deal of machine-learning-in-finance research difficult to take seriously.

Three reasons the limitation is stated as prominently as the result.

**Because a risk model that is oversold is dangerous in a way an ordinary model is not.** A VaR framework adopted on the strength of an overstated backtest becomes the number that sets limits and sizes positions. Overconfidence in the model transfers directly into undercapitalisation of the book. The failure mode of overselling a risk model is not embarrassment; it is losses.

**Because model validation is the standard this work is written against.** Under the Federal Reserve's SR 11-7 guidance <Info label="SR 11-7">The Federal Reserve and OCC's supervisory guidance on model risk management. It requires that models used in regulated institutions be independently validated — conceptually reviewed, tested for stability and accuracy, monitored on an ongoing basis, and documented well enough for someone who did not build them to challenge them. It is the reason a US bank cannot deploy a risk model on the strength of a good backtest alone.</Info>, a model is expected to arrive with its limitations documented. A validator's first question about a claimed improvement is whether it survives a significance test. Answering that question in the paper is not modesty; it is the minimum the intended audience requires.

**Because the finding is genuinely useful as stated.** "A liquidity-aware ML framework matches the best conventional method and leads it on calibration and pinball loss, though not significantly" is an informative result. It says the approach is viable, that liquidity and regime features are carrying real signal, and that the next question is whether a larger or broader study can establish the difference. That is how a research programme advances.

---

## 10. Practical Implications for Risk Teams

For anyone running market risk on an equity book, the paper supports a few concrete positions.

**Liquidity and regime features are worth conditioning on.** The evidence does not establish that they produce a significantly better VaR number, but they consistently produced a better-calibrated and better-scored one. For a risk team already computing spreads, volumes and VIX levels, adding them as conditioning variables is cheap.

**Do not let a learner extrapolate into the tail.** The hybrid design exists because gradient boosting is unreliable beyond its training range, and the far tail is beyond the training range of every model ever fitted. Whatever learner you use, the extreme quantile should come from a method built for extremes.

**Benchmark against GARCH-EVT, not against a straw man.** If a new framework cannot beat GARCH-EVT, that is worth knowing before it is deployed. A comparison against Historical Simulation alone will flatter almost anything.

**Test significance, then report it either way.** The gap between "lowest pinball loss" and "significantly lowest pinball loss" is the gap between a model you can run in parallel and a model you can replace a production system with.

**Treat working papers as working papers.** This research has not been peer reviewed, and its conclusions may change between drafts. The full paper — with the specifications, the parameter choices and the complete results — is the thing to read before forming a view, and it is freely available.

---

## 11. Limitations and What Comes Next

The paper is explicit about where the evidence stops.

**Eight names is a narrow universe.** Eight S&P 500 constituents are large-cap, liquid US equities. Whether the framework generalises to small caps, to non-US markets, to other asset classes, or to portfolios rather than single names is untested here. Portfolio-level VaR introduces correlation dynamics that single-name results do not speak to at all.

**Liquidity data is the binding constraint.** The liquidity information available for this study is coarser than what a well-resourced desk has access to. Order-book depth, intraday spreads and realised market impact would all be more informative than the daily proxies available at this scale — and since the liquidity channel is the paper's central hypothesis, better data is where the largest gain is likely to be.

**Expected Shortfall is not tested.** Basel's Fundamental Review of the Trading Book moved the regulatory capital measure from VaR to Expected Shortfall <Info label="Expected Shortfall">The average loss conditional on the loss exceeding VaR. Where VaR says "you should not lose more than X", Expected Shortfall says "when you do lose more than X, expect to lose Y on average". It is coherent in a way VaR is not, and it is the measure Basel's Fundamental Review of the Trading Book adopted for regulatory capital — which is why any VaR framework aiming at institutional relevance eventually has to be tested on it.</Info>, precisely because VaR says nothing about the severity of a breach. A framework that forecasts the quantile well may or may not forecast the conditional mean beyond it well. That is a separate test and it has not yet been run.

**The significance result may not survive a larger study — or may be resolved by one.** The low power of VaR comparison tests means a wider universe and a longer window are the most direct route to establishing whether the observed improvement is real. That is the next piece of work.

The research agenda from here: broader portfolios, better liquidity data, and Expected Shortfall testing.

---

## Frequently Asked Questions

**What is ML-LiqVaR?**
ML-LiqVaR is a research framework for forecasting one-day-ahead Value-at-Risk on US equities. It combines GARCH volatility modelling, conditional Extreme Value Theory and gradient-boosted quantile regression, conditioning on market volatility, momentum, VIX and liquidity-related information. It was developed by Niraj Neupane, CA (ICAI), and is available as a working paper on SSRN.

**Did ML-LiqVaR outperform traditional VaR models?**
It achieved the closest 99% VaR calibration and the lowest average pinball loss of the five models tested, across 8,072 out-of-sample observations from eight S&P 500 constituents between 2018 and 2024. However, its improvement over the GARCH-EVT benchmark was not statistically significant at the 5% level. The correct characterisation is competitive performance, not demonstrated superiority.

**Why does statistical significance matter for a VaR model?**
Because a VaR model determines position limits and capital. A model adopted on the strength of an improvement that turns out to be noise leads directly to undercapitalised positions. It also matters for model validation: under the Federal Reserve's SR 11-7 guidance, an independent validator will test whether a claimed improvement survives a significance test, so the paper answers that question up front.

**Why combine machine learning with Extreme Value Theory instead of using machine learning alone?**
Gradient-boosting models cannot extrapolate reliably beyond their training range, and the far tail of a loss distribution is by definition sparsely observed. ML-LiqVaR uses the machine-learned quantile where the data supports learning and an EVT-fitted tail beyond it, so each method handles the region it is suited to.

**Why does liquidity belong in a VaR model?**
Conventional VaR models condition almost entirely on the history of returns and are blind to whether a position can actually be exited. A name with wide spreads and thin depth carries risk that its return series does not disclose, and liquidity evaporation is the mechanism by which ordinary drawdowns become disorderly ones. Testing whether liquidity features improve tail forecasts is the paper's central hypothesis.

**What is pinball loss and why is it used?**
Pinball loss is the standard scoring rule for quantile forecasts. It penalises errors asymmetrically according to the quantile being forecast, so it measures how close a VaR forecast was, not merely whether it was breached. That makes it more informative than breach counting alone and harder to score well on by accident.

**Where can I read the full paper?**
ML-LiqVaR is available free on SSRN at [abstract 7222958](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7222958). It is a working paper and has not been peer reviewed.

**What is the author working on next?**
Broader portfolios rather than single names, improved liquidity data — order-book depth and intraday measures rather than daily proxies — and Expected Shortfall testing, which is the measure Basel's Fundamental Review of the Trading Book uses for regulatory capital.

---

## Conclusion and Key Takeaways

1. **ML-LiqVaR led on both primary metrics.** Closest 99% calibration and lowest average pinball loss among five models, over 8,072 out-of-sample observations covering 2018 to 2024.

2. **The improvement over GARCH-EVT was not statistically significant at the 5% level.** Competitive performance, not demonstrated superiority — and the distinction is the paper's, not a caveat added afterwards.

3. **Liquidity and regime information appear to carry real signal about the conditional tail**, consistently enough to be worth conditioning on even without a significant result.

4. **The hybrid design is the methodological contribution.** Let the learner work where the data supports learning; let Extreme Value Theory handle the region where no model has enough observations.

5. **VaR model comparisons have low power.** With roughly 80 breaches to work with at the 99% level, small differences are hard to establish. That is a property of the problem, not a flaw in this study, and it constrains what any paper in this literature can honestly claim.

6. **The next steps are broader portfolios, better liquidity data, and Expected Shortfall testing.**

<Paper
  title="ML-LiqVaR: A Liquidity- and Regime-Aware, Extreme-Value-Calibrated Gradient-Boosting Value-at-Risk Model for US Equities"
  authors="Niraj Neupane"
  venue="SSRN Working Paper"
  id="7222958"
  href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7222958"
  cta="Read the full paper"
/>

---

## Methodology and Sources

This article summarises the author's own working paper. All empirical figures quoted — the 8,072 out-of-sample observations, the eight-constituent universe, the 2018–2024 period, the five-model comparison, the 99% calibration and pinball-loss rankings, and the significance result — are as reported in the paper. Explanatory material on VaR, GARCH, Extreme Value Theory, quantile regression, pinball loss, liquidity and SR 11-7 is standard background provided for readers and is not drawn from the paper's results.

**Primary source**

- Neupane, Niraj. _ML-LiqVaR: A Liquidity- and Regime-Aware, Extreme-Value-Calibrated Gradient-Boosting Value-at-Risk Model for US Equities._ SSRN Working Paper. [papers.ssrn.com/sol3/papers.cfm?abstract_id=7222958](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7222958)

**Related work by the same author**

- Neupane, Niraj. _Backtesting Value-at-Risk Models Under SR 11-7: A Comparative Analysis of Kupiec, Christoffersen, and Basel Traffic-Light Tests Applied to S&P 500 Returns (2018–2024)._ SSRN Working Paper, July 2026. [papers.ssrn.com/sol3/papers.cfm?abstract_id=7170418](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7170418)

**Standing on the shoulders of**

- Bollerslev, T. (1986). _Generalized Autoregressive Conditional Heteroskedasticity._
- McNeil, A. & Frey, R. (2000). _Estimation of Tail-Related Risk Measures for Heteroscedastic Financial Time Series: An Extreme Value Approach._
- Koenker, R. & Bassett, G. (1978). _Regression Quantiles._
- Friedman, J. (2001). _Greedy Function Approximation: A Gradient Boosting Machine._
- Kupiec, P. (1995). _Techniques for Verifying the Accuracy of Risk Measurement Models._
- Christoffersen, P. (1998). _Evaluating Interval Forecasts._
- Board of Governors of the Federal Reserve System / OCC. _SR 11-7: Guidance on Model Risk Management._

### About the author

**Niraj Neupane, CA (ICAI)** is a Quantitative Researcher, Financial Economist and Forward Deployed Engineer specialising in quantitative trading, machine learning and AI applications in financial markets, financial econometrics, and model validation. Read more on his [author profile](/about/niraj).

### Related reading

- [US National Accounts, Gross Domestic Income Components, Fiscal Deficits, and Housing](/blog/us-national-accounts-housing-deficit-macro-primer)
- [The Dollar, Gold, and Oil Since 2022: Anatomy of a Broken Correlation](/blog/usd-dxy-gold-oil-since-2022)
- [July 2026 CPI: Headline Inflation Says 3.4%. The Last Three Months Say 0.8%.](/blog/july-2026-cpi-inflation-energy-report)
