---
date: '10/26/2026'
title: 'Virtual Collaborators: Anthropic’s Product Bet and Its Evidence'
subtitle: 'Anthropic’s S-1 rests its growth case on the “Virtual Collaborator”: AI agents that do hours of professional work inside a company. We lay out the product line from Mythos to Claude Cowork, and what Eli Lilly, AIG, Jane Street, Bristol Myers Squibb and DoorDash report getting from it.'
categories:
  [
    'Anthropic',
    'Claude',
    'AI Agents',
    'Artificial Intelligence',
    'Eli Lilly',
    'Enterprise Software',
    'IPO',
    'S-1 Filing',
    'Signals',
  ]
image: '/anthropic-s1/s1-case-study-eli-lilly.jpg'
author: 'Kanchan'
---

_Disclaimer: This article is for educational purposes only and is not investment advice._

> **AI disclosure.** Researched and drafted with the help of Claude, made by Anthropic, the company discussed. All facts and customer results are quoted from Anthropic’s S-1, where the company presents them; the analysis is Financial Gurkha’s.

**Part of our Anthropic S-1 series.** Full analysis: [Inside Anthropic’s S-1: The Complete Breakdown of the IPO Filing](/blog/anthropic-s1-ipo-filing-complete-analysis).

---

## The 60-Second Version

- **The thesis:** AI has reached the point where it can do work that “might otherwise occupy a skilled professional for several hours, a full day, or longer.” Anthropic calls these agents **Virtual Collaborators**.
- **The products:** Claude Code (coding) proved the idea. Claude Cowork (all knowledge work) is spreading faster than Code did at the same stage.
- **The evidence:** existing customers spend about **9×** more than a year earlier, and customers paying $100,000+ grew from about 950 to more than **11,900** in a year.
- **The case studies** report measured outcomes. Eli Lilly gave 50,000+ employees access, with more than 85% engagement in key functions. BMS cut a two-month research question to five minutes. AIG quoted 55% faster.

---

### What's in this report

- [The 60-Second Version](#the-60-second-version)
  - [What's in this report](#whats-in-this-report)
- [1. What a Virtual Collaborator Is](#1-what-a-virtual-collaborator-is)
- [2. The Product Line](#2-the-product-line)
- [3. Eli Lilly: Claude Across a 50,000-Person Company](#3-eli-lilly-claude-across-a-50000-person-company)
- [4. Four More Industries](#4-four-more-industries)
- [5. The Adoption Numbers](#5-the-adoption-numbers)
- [6. Where This Is Heading](#6-where-this-is-heading)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Methodology and Sources](#methodology-and-sources)

---

## 1. What a Virtual Collaborator Is

![The S-1’s description of Claude as a Virtual Collaborator](/anthropic-s1/s1-virtual-collaborator.jpg)

**A Virtual Collaborator is an AI agent embedded in a company’s systems, with the access rights, connections and context an employee would have.** It can use internal tools and carry out multi-step work that needs sustained reasoning. Anthropic’s aim is to extend these agents to knowledge workers globally, a group IDC estimates will exceed **one billion people in 2028**.

The distinction from a chatbot: a chatbot answers questions; a Virtual Collaborator finishes tasks.

## 2. The Product Line

| Layer        | Product                          | What it does                                                                                                 |
| :----------- | :------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| Models       | **Mythos**                       | Most capable class; offered to vetted organizations for cybersecurity and life sciences work                 |
|              | **Fable**                        | The generally available version of the Mythos-class model, with production safeguards (Fable 5.1, Sept 2026) |
|              | **Opus**                         | Reasoning workhorse; Opus 5.5 is the “enterprise daily driver”                                               |
|              | **Sonnet / Haiku**               | Balanced everyday model; fastest, lowest-cost model                                                          |
| Platform     | **Claude Platform**              | Building blocks for developers to build their own agents                                                     |
| Applications | **Claude Code**                  | Plans, writes, tests and debugs production code                                                              |
|              | **Claude Cowork**                | Reads files, navigates applications, completes multi-step desktop work; merging with Claude.ai               |
|              | Claude Security, Design, Science | Vertical applications                                                                                        |

Two details from the filing:

- **Safety shapes releases.** Mythos was first released only to selected organizations through **Project Glasswing**, backed by up to $100 million for cyber-defense, rather than to everyone.
- **The pace is fast.** Anthropic launched **250** new model versions, features and applications in the first nine months of 2026. NASA engineers used Claude Code to plan the first AI-planned drive of the Mars Perseverance rover.

## 3. Eli Lilly: Claude Across a 50,000-Person Company

![Anthropic’s Eli Lilly case study in the S-1](/anthropic-s1/s1-case-study-eli-lilly.jpg)

| Result                                                     | Figure            |
| :--------------------------------------------------------- | :---------------- |
| Employees with Claude Enterprise access                    | **50,000+**       |
| Expansion since rollout                                    | **5×**            |
| Full-time employees actively using Claude in key functions | **more than 85%** |

The timeline:

- **2024:** Lilly started building Anthropic’s models into its internal AI platform and developer tools, through Amazon Bedrock.
- **July 2025:** Claude Enterprise rolled out to about **10,000** people, mostly in research.
- **April 2026:** available company-wide. The filing describes Lilly as the first large pharmaceutical company to do so.

The five heaviest-using functions are legal and compliance, technology, finance, oncology and research.

**What changed in the work:**

- **Biologists** who used spreadsheet macros now build working web apps with Claude in a couple of hours.
- **Chemists** visualize complex data in real time to find new atomic configurations, work that would once have taken hours.

**It is a two-way partnership.**

- **Controls:** Lilly helped design Claude Enterprise’s controls, including a private connection that keeps internal systems off the public internet, and data-loss-prevention hooks that audit data passing through Claude.
- **Internal marketplace:** Lilly built a marketplace where teams publish skills, with Claude doing a first-pass review.
- **Next:** in October 2026 Lilly began piloting **Claude Science**, Anthropic’s workbench for scientists.

> “Now Claude is across the company, and we can’t imagine going back.”
> — Diogo Rau, EVP and Chief Information and Digital Officer, Eli Lilly (as quoted in the S-1)

## 4. Four More Industries

**Insurance: AIG.** Underwriting by AIG Assist cut submission review time by more than 90% and allowed review of 100% of applicable submissions. In Lexington’s Middle Market Property business: +30% quoted submissions, −55% time-to-quote, +40% submissions bound. Claude is now used in eight AIG business lines.

![Anthropic’s AIG case study](/anthropic-s1/s1-case-study-aig.jpg)

**Trading: Jane Street.** Researchers supervise teams of agents. One researcher moved a large codebase to a new language in about a week, work that would normally take a team months. On Jane Street’s internal agentic coding test, Claude Fable 5.1 scored 32% above Fable 5.

![Anthropic’s Jane Street case study](/anthropic-s1/s1-case-study-jane-street.jpg)

**Pharmaceuticals: Bristol Myers Squibb.** Claude works across the 30 to 40 external medical-records and claims databases BMS subscribes to. Answering a real-world-evidence question went from up to **two months to about five minutes**. More than 30,000 employees have access, and Cowork is being extended to all of them.

![Anthropic’s Bristol Myers Squibb case study](/anthropic-s1/s1-case-study-bms.jpg)

**Local commerce: DoorDash.** Claude Code and Cowork are available to every corporate employee. More than 7,000 people use Cowork monthly, almost half of them daily. Launch timelines for major products have been cut by more than half. One engineer finished in three weeks a migration that would once have taken four engineers more than a quarter.

![Anthropic’s DoorDash case study](/anthropic-s1/s1-case-study-doordash.jpg)

## 5. The Adoption Numbers

| Metric (as of Sept 30, 2026)                       | Figure                                      |
| :------------------------------------------------- | :------------------------------------------ |
| Customers paying $100,000+ a year                  | more than 11,900 (about 950 a year earlier) |
| Customers paying $1M+ / $10M+                      | more than 1,900 / about 250                 |
| Net revenue retention                              | about 900%                                  |
| Fortune 500 companies paying $100K+                | more than 50%                               |
| Their Anthropic spend as a share of total expenses | under 0.1% on average                       |

The last line is the filing’s growth argument in a single number: even its most committed big customers spend a sliver of their budgets on Claude so far.

## 6. Where This Is Heading

The filing describes the goal as Claude given “open-ended tasks lasting hours, days, or weeks.” Millions of agents would work in parallel: “a country of geniuses in a data center.” Customer testimonials are selected by the company, and adoption at a few leaders is not proof of mass adoption. Read them as the best evidence Anthropic chose to present.

---

## Frequently Asked Questions

**What is a Virtual Collaborator in Anthropic’s S-1?**
Anthropic’s term for AI systems that work alongside people on complex, multi-step professional tasks. They use the access rights, system connections and context an organization grants them, completing work that might otherwise take a skilled professional hours or days.

**How does Eli Lilly use Claude?**
Lilly gave 50,000+ employees access to Claude Enterprise, a 5× expansion since its July 2025 rollout. More than 85% of full-time employees in legal, technology, finance, oncology and research actively use it. Lilly co-developed security controls with Anthropic and began piloting Claude Science in October 2026.

**What is the difference between Claude Code and Claude Cowork?**
Claude Code is Anthropic’s coding agent: it plans, writes, tests and debugs software. Claude Cowork extends the same agent design to general knowledge work, reading files and operating applications on a user’s desktop. Its adoption has outpaced Claude Code’s at the same stage.

**Read the complete analysis:** [Inside Anthropic’s S-1: The Complete Breakdown of the IPO Filing](/blog/anthropic-s1-ipo-filing-complete-analysis)

---

## Methodology and Sources

From Anthropic, PBC’s Form S-1 filed October 26, 2026: the “Business” section and the customer case studies included in the prospectus. Customer results and quotations are as presented by Anthropic in the filing. [SEC EDGAR](https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm).
