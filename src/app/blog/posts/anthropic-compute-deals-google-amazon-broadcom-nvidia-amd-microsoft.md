---
date: '10/26/2026'
title: 'Anthropic’s Compute Deals: Google, Amazon, Broadcom, NVIDIA, AMD'
subtitle: 'Anthropic’s minimum compute commitments rose from $54.6 billion to $265.6 billion in six months, and the S-1 describes more deals signed since. Here is every major supplier agreement, what it costs, how it is financed, and why several suppliers are also investors.'
categories:
  [
    'Anthropic',
    'Compute',
    'NVIDIA',
    'Google',
    'Amazon',
    'Broadcom',
    'AMD',
    'Microsoft',
    'Data Centers',
    'IPO',
    'S-1 Filing',
    'Signals',
  ]
image: '/anthropic-s1/anthropic-compute-commitments.jpg'
author: 'Kanchan'
---

_Disclaimer: This article is for educational purposes only and is not investment advice._

> **AI disclosure.** Researched and drafted with the help of Claude, made by Anthropic, the company discussed. All figures are from Anthropic’s S-1; the analysis is Financial Gurkha’s.

**Part of our Anthropic S-1 series.** Full analysis: [Inside Anthropic’s S-1: The Complete Breakdown of the IPO Filing](/blog/anthropic-s1-ipo-filing-complete-analysis).

---

## The 60-Second Version

- **Audited minimum compute commitments:** **$54.6 billion** at Dec 31, 2025, then **$265.6 billion** at June 30, 2026, with terms of 1 to 20 years.
- **Four chip families:** AWS Trainium, Google TPUs, NVIDIA GPUs and AMD GPUs, all orchestrated as one pool.
- **The largest named deals:** Broadcom equipment leases (~$161B), SpaceXAI (up to $120.5B), Google (at least ~$114.5B), Amazon (at least $110B).
- **Suppliers finance their own sales:** Amazon’s convertible notes, Google’s and Amazon’s equity, AMD’s $5B stock purchase, and Broadcom’s $42B note facility.
- **Oracle is not mentioned anywhere in the filing.**

---

### What's in this report

- [The 60-Second Version](#the-60-second-version)
- [1. Why Anthropic Buys This Much Compute](#1-why-anthropic-buys-this-much-compute)
- [2. Every Major Agreement](#2-every-major-agreement)
- [3. Suppliers Who Are Also Investors](#3-suppliers-who-are-also-investors)
- [4. How Much of This Is Firm](#4-how-much-of-this-is-firm)
- [5. What It Means](#5-what-it-means)
- [Frequently Asked Questions](#frequently-asked-questions)

---

## 1. Why Anthropic Buys This Much Compute

The filing calls compute “the most significant operating cost in our business.” It says Anthropic has operated in a **“compute-constrained environment”**, where demand exceeded the compute it could get. Because hardware takes so long to arrive, it signs contracts “well in advance of anticipated demand,” sometimes paying before delivery.

The strategy is **multi-chip.** Anthropic trains and runs Claude across four chip families through its own orchestration layer. That lets it pick the best price-performance chip for each job, and avoid depending on any single supplier.

## 2. Every Major Agreement

| Supplier | Chips | Commitment | Term | Can it be cancelled? |
| :--- | :--- | :--- | :--- | :--- |
| **Broadcom** | Google TPU hardware, leased | ~$161.2B of rent, excluding interest | 5-year master leases | No, except on default |
| **SpaceXAI** (formerly xAI) | NVIDIA GPUs | Up to $120.5B; ~$3.1B a month at full delivery | Into 2029 | Yes, 90 days’ notice after Jan/Mar 2027 |
| **Google** | TPUs | At least ~$114.5B, with a true-up if spend falls short | Apr 2026–Jul 2033 | No, except on Google’s breach |
| **Google + others** | Additional TPUs | Estimated $125–150B | Delivered 2028–2031 | Not in the commitments table |
| **Amazon** | Trainium and other compute | At least $110B, with a true-up | May 2026–Apr 2036 | No, except on Amazon’s breach |
| **Microsoft** | NVIDIA GPUs | At least $44.9B | Nov 2026–May 2033 | No, except on breach or undelivered tranches |
| **Nscale** | NVIDIA GPUs | Up to ~$44.6B, paid as delivered | Into 2033 | Limited circumstances |
| **Lambda** | NVIDIA GPUs | ~$41.3B, paid as delivered | Into 2034 | Limited; $34.9B tranche depends on a facility lease |
| **AMD** | Instinct MI450 in Helios racks | Expected to exceed $20B | First tranche 2027 | No, except on AMD’s breach |
| **NVIDIA** | Grace Blackwell, Vera Rubin | Through the clouds above; direct design collaboration | — | — |

![Bar chart of Anthropic’s named compute arrangements, $ billions](/anthropic-s1/anthropic-compute-commitments.jpg)

![The S-1’s description of the Amazon, SpaceXAI, AMD, Nscale and Lambda agreements](/anthropic-s1/s1-amazon-spacexai-compute.jpg)

![The S-1’s description of the Broadcom equipment leases](/anthropic-s1/s1-broadcom-leases.jpg)

A notable name on the list: **SpaceXAI**, formerly xAI, is a subsidiary of SpaceX and runs a competing AI model. Anthropic rents NVIDIA compute from it.

## 3. Suppliers Who Are Also Investors

| Partner | Sells Anthropic | Also… |
| :--- | :--- | :--- |
| **Amazon** | Compute; resells Claude on AWS | Holds $6.2B of convertible notes, convertible into ~1.84B shares at $2.09 and $5.05; invested $5B in Series H; capped at 12% ownership |
| **Google** | TPU compute; resells Claude on Google Cloud | Invested $10B in Series H; earlier notes converted to preferred stock; a 2026 note agreement for future funding |
| **Broadcom** | TPU hardware leases | Will lend up to $42B in convertible notes, at 9% interest paid in kind <Info label="Paid-in-kind (PIK) interest">Interest added to the loan balance instead of paid in cash. The debt grows over time.</Info>, solely to fund Anthropic’s rent; convertible at a 10% discount to the share price |
| **AMD** | MI450 GPUs | Will buy up to $5B of Anthropic stock as chips are delivered |
| **Microsoft** | NVIDIA compute; resells Claude on Azure | Joint go-to-market partner |

The filing names the tension directly. Some partners “provide us capital or credit support, serve as our infrastructure vendors, and develop and offer AI models… that compete with ours.” It warns this “could give rise to conflicts of interest” over access, cost and priority.

The cloud providers are also a major sales channel. **48% of first-half 2026 revenue came through their marketplaces**, with Anthropic paying each a fee.

## 4. How Much of This Is Firm

**The audited number is $265.6 billion of fixed or minimum commitments at June 30, 2026.** The named deals in the table above add up to more, for three reasons:
- **Several were signed after June 30:** the SpaceXAI amendments, Nscale and Lambda.
- **Some are maximums or usage-based**, not minimums.
- **Some can be cancelled,** like SpaceXAI after early 2027.

The filing’s own all-in total is left blank in this preliminary version, so we do not add the named deals into a single figure.

Beyond these, Anthropic has guaranteed up to **$0.8 billion** for data-center developers, and plans to expand its **own data center footprint**.

## 5. What It Means

1. **This is the biggest bet in the filing.** Against $16.3 billion of first-half revenue, $265.6 billion is about 8 years of revenue at the first-half pace.
2. **It explains the growth.** Without the compute there is nothing to sell; the company says demand has exceeded supply.
3. **It is diversified.** No single supplier dominates, and four chip families are in use.
4. **It ties Anthropic closely to its rivals and partners.** That tie runs through Amazon, Google and Microsoft, as well as SpaceX.

---

## Frequently Asked Questions

**How much has Anthropic committed to spend on compute?**
Anthropic’s audited fixed or minimum compute commitments were $265.6 billion at June 30, 2026, up from $54.6 billion at December 31, 2025. It has signed further agreements since.

**Which chips does Anthropic use?**
Four families: AWS Trainium, Google TPUs, NVIDIA GPUs (including Grace Blackwell and Vera Rubin) and AMD Instinct MI450 GPUs.

**Does Anthropic have a deal with Oracle?**
Oracle is not mentioned in Anthropic’s S-1.

**What is the Broadcom deal?**
Five-year master equipment leases for TPU-based hardware in dedicated data centers, with about $161.2 billion of rent excluding interest, accounted for as finance leases. Broadcom also agreed to fund up to $42 billion of that rent through convertible notes.

**Read the complete analysis:** [Inside Anthropic’s S-1: The Complete Breakdown of the IPO Filing](/blog/anthropic-s1-ipo-filing-complete-analysis)

---

## Methodology and Sources

From Anthropic, PBC’s Form S-1 filed October 26, 2026: “Liquidity and Capital Resources,” “Infrastructure Service Arrangements,” “Infrastructure Equipment Leases,” “Convertible Notes,” “Business—Multi-Chip Compute Approach” and Note 13. [SEC EDGAR](https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm).
