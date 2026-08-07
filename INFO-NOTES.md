# Inline Explainers — `<Info>` usage guide

A small gold badge you can drop anywhere in an article. Readers click it and a
highlight panel opens with your explanation. Works inside paragraphs **and**
inside table cells.

---

## Basic usage

```markdown
Marketable equity securities <Info label="Marketable equity securities">Shares of
other public companies Sandisk owns as an investment, not part of its storage
business.</Info>
```

Renders as: `Marketable equity securities ⓘ` — click the badge, panel opens below.

## Inside a table

Put it right after the label or the number. Both work:

```markdown
| Marketable equity securities <Info label="What is this?">Explanation here.</Info> | $1.777B | $0 |
| Retained earnings | $9.649B <Info label="Retained earnings">Explanation.</Info> | $(1.784B) |
```

## Question-mark variant

```markdown
Adjusted free cash flow <Info kind="q" label="Why adjusted?">Because management
strips out customer prepayments.</Info>
```

`kind="q"` gives a `?` badge. Default is `i`.

## Without a label

```markdown
84.6% <Info>Gross margin is revenue minus the direct cost of making the product.</Info>
```

The label is optional — it just renders a small gold caption above the text.

---

## Rules

**One rule that matters:** no `|` characters inside the explanation text when the
badge is inside a markdown table. A pipe breaks the table. Use "or" or a dash.

**Keep it to 1–3 sentences.** The panel is ~320px wide. Longer than about 60
words and it becomes a wall.

**Explain the concept, not the company.** Good: what a contract liability *is*
and why a rise matters. Less good: restating the number that is already in the
table.

**Apostrophes need escaping** if you use a straight `'` inside a `label="..."`
attribute — simplest fix is to use a curly `'` or avoid apostrophes in labels.

---

## Why it is built this way

**Everything is an inline element** (`span`, `button`) rather than a `div`.
A `<div>` inside a `<p>` or `<td>` is invalid HTML and React reports it as a
hydration error — the same bug class that broke the in-article ads. Absolute
positioning works fine on a span, so nothing is lost visually.

**The explanation text is always present in the DOM**, hidden with
`visibility`/`opacity` rather than being conditionally rendered. That means
Google and AI answer engines can read every explanation even when the panel is
closed. It also means the definitions contribute to the page's topical depth —
a page that defines "contract liabilities" and "areal density" is a page that
ranks for those terms.

**Accessibility:** the badge is a real `<button>` with `aria-expanded` and
`aria-controls`, the panel has `role="note"`, Escape closes it, and clicking
outside closes it.

---

## Good candidates for an explainer

- **Accounting terms** a general reader would not know: contract liabilities,
  retained earnings, goodwill impairment, deferred revenue, treasury stock
- **Non-GAAP adjustments** and why management makes them
- **Industry jargon**: Gb/mm², TLC/QLC, HBM, ATMP, incremental margin
- **Structural facts** that explain an odd number: why capex is 0.9% of revenue
  (the JV), why free cash flow and adjusted free cash flow differ
- **Anything a reader would otherwise open a new tab to look up** — every one of
  those is a reader you nearly lost

## Watch out: never put one in the frontmatter

If the phrase you are matching also appears in the `subtitle:` field, a
find-and-replace will hit the frontmatter first. JSX inside YAML frontmatter
does not render — it leaks as raw text into meta descriptions and social
previews. Always confirm the badge landed **below** the closing `---`.

## Currently deployed — 30 explainers across 11 articles

| Article | Count | Terms explained |
| :-- | --: | :-- |
| Sandisk FY26 | 6 | marketable equity securities, retained earnings, contract liabilities, goodwill impairment, Flash Ventures, Gb/mm² |
| Caterpillar Q2 | 6 | adjusted vs reported, incremental margin, customer advances, past dues, tariff recovery, MP&E free cash flow |
| Microsoft FY26 | 5 | unearned revenue, useful life & depreciation, statutory vs effective tax rate, constant currency, free cash flow |
| Novo Nordisk DCF | 3 | DCF valuation, value trap, cost of capital |
| MP Materials | 3 | DCF valuation, terminal year, NdPr |
| Monad | 2 | Layer 1, EVM |
| Fed decision | 1 | federal funds rate |
| Figma valuation | 1 | intrinsic value |
| Precious metals | 1 | micro futures |
| USD/DXY/gold/oil | 1 | basis point |
| US net investment position | 1 | net international investment position |

Density was kept deliberately low — roughly one per 400–800 words on the dense
filings pieces, and one or two on the shorter posts. The badge should feel like
a helpful aside, not a textbook.
