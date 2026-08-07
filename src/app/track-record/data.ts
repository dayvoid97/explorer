/**
 * Every valuation Financial Gurkha has published, with the price at the time
 * and the price now.
 *
 * The point of this file is that it contains losses. An AI visibility audit
 * scored the publication 5/10 on transparency and noted that "accuracy is
 * unproven" — there was no way for a reader to check whether any published
 * valuation had been any good. A record that only showed winners would be worse
 * than no record at all; the credibility comes precisely from publishing the
 * ones that went against us.
 *
 * HOW TO MAINTAIN THIS
 * Update `currentPrice` and `priceAsOf` roughly quarterly, or after any large
 * move. Never delete an entry. If a thesis is abandoned, mark it `closed` with
 * a note explaining what changed — a withdrawn call that is explained is worth
 * more than a call quietly deleted.
 */

export type Call = {
  slug: string
  company: string
  ticker: string
  published: string // ISO date
  priceAtPublication: number
  fairValue: number
  currency: 'USD' | 'DKK'
  /** Leave undefined until you refresh it. */
  currentPrice?: number
  /** Date the current price was checked. */
  priceAsOf?: string
  status: 'open' | 'closed'
  /** Honest one-line assessment. Required. */
  assessment: string
  /** Any position the author held or intended to hold, as disclosed at the time. */
  disclosedPosition?: string
}

export const PRICES_AS_OF = 'August 7, 2026'

export const CALLS: Call[] = [
  {
    slug: 'mp-materials-valuation',
    company: 'MP Materials',
    ticker: 'NYSE: MP',
    published: '2023-12-13',
    priceAtPublication: 20.16,
    fairValue: 81.17,
    currency: 'USD',
    currentPrice: 47.69,
    priceAsOf: '2026-08-06',
    status: 'open',
    assessment:
      'Directionally right and by a wide margin. The stock has more than doubled from the publication price and traded as high as $100.25 in the last twelve months, above our $81.17 estimate. It has since given back a substantial part of that. The thesis — Western rare earth processing as a strategic asset — played out.',
  },
  {
    slug: 'novo-nordisk-dcf-valuation',
    company: 'Novo Nordisk',
    ticker: 'NYSE: NVO / CSE: NOVO-B',
    published: '2025-01-01',
    priceAtPublication: 317,
    fairValue: 617,
    currency: 'DKK',
    currentPrice: 293.6,
    priceAsOf: '2026-08-06',
    status: 'open',
    assessment:
      'Wrong so far. The base-case 617 DKK estimate assumed continued GLP-1 growth that has not materialised on the timeline we modelled. The article also ran a no-growth "value trap" scenario at 377 DKK; the stock is below that too. Competitive pressure in obesity drugs was underweighted.',
  },
  {
    slug: 'figma-intrinsic-valuation',
    company: 'Figma',
    ticker: 'NYSE: FIG',
    published: '2025-11-20',
    priceAtPublication: 34.0,
    fairValue: 82.03,
    currency: 'USD',
    currentPrice: 28.15,
    priceAsOf: '2026-08-05',
    status: 'open',
    assessment:
      'Wrong so far, and the article disclosed upfront that the author was a heavy Figma user, "very biased", and intended to buy. Revenue growth has held up — 48% year over year in the most recent quarter — but rising AI infrastructure costs have compressed margins, which our model did not adequately price. A case where the disclosed bias and the miss point the same direction.',
    disclosedPosition: 'Author disclosed intent to purchase at time of writing.',
  },
]

/** Percentage change from publication price to current price. */
export function priceReturn(c: Call): number | null {
  if (c.currentPrice == null) return null
  return (c.currentPrice / c.priceAtPublication - 1) * 100
}

/** Remaining implied upside/downside to the published fair value. */
export function impliedFromHere(c: Call): number | null {
  if (c.currentPrice == null) return null
  return (c.fairValue / c.currentPrice - 1) * 100
}
