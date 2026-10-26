/**
 * Financial Gurkha brand copy: the single source for how the site describes
 * itself. Page titles, meta descriptions, social cards and structured data all
 * read from here, so the line Google shows, the line AI answer engines quote
 * and the line on the page never drift apart.
 *
 * Change the wording here, not in individual pages.
 */
export const BRAND = {
  name: 'Financial Gurkha',
  site: 'https://financialgurkha.com',

  /** What we are, in one clause. Used in titles. */
  positioning: 'Financial Markets Reporting From Wall Street, New York',

  /** What we cover. */
  coverage: 'Equity Valuations, Earnings Analysis, Macro Research and Technical Analysis',

  /** The one-line bio: the homepage meta description and the brand description in structured data. */
  bio: 'Financial Markets Reporting From Wall Street, New York. Equity Valuations, Earnings Analysis, Macro Research and Technical Analysis.',

  /** Motto. */
  tagline: 'Financial Gurkha is for the winners.',

  founded: '2022',
} as const

/** Homepage and default title: "Financial Gurkha — Financial Markets Reporting From Wall Street, New York". */
export const BRAND_TITLE = `${BRAND.name} — ${BRAND.positioning}`
