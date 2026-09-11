// Author registry.
//
// Until now every article was implicitly Kanchan's: the byline in frontmatter was
// a display string, while the Person schema on the article page hard-coded one
// name, one profile URL and one set of expertise. The moment a second person
// publishes here, that markup starts telling Google and the answer engines that
// the wrong human wrote the piece — which on YMYL finance content is the single
// most expensive attribution error available.
//
// This maps the frontmatter `author` value onto a real profile: the page we host
// for them, what they actually do, and the external identities (SSRN, LinkedIn)
// that let a crawler tie the byline to a person who exists off this site.
// `sameAs` is what turns a name into an entity.

export interface Author {
  /** Route segment under /about — also the canonical lookup key. */
  key: string
  name: string
  /** Shown under the byline on an article. Keep it short. */
  role: string
  url: string
  jobTitle: string
  knowsAbout: string[]
  /** External profiles that establish the person exists independently of us. */
  sameAs?: string[]
}

const SITE = 'https://financialgurkha.com'

export const AUTHORS: Record<string, Author> = {
  kanchan: {
    key: 'kanchan',
    name: 'Kanchan Sharma',
    role: 'Founder & Analyst, Financial Gurkha',
    url: `${SITE}/about/kanchan`,
    jobTitle: 'Independent Markets Analyst',
    knowsAbout: ['Equity Valuation', 'Discounted Cash Flow Analysis', 'Macroeconomics'],
  },
  niraj: {
    key: 'niraj',
    name: 'Niraj Neupane',
    role: 'Quantitative Researcher · Contributing Author',
    url: `${SITE}/about/niraj`,
    jobTitle: 'Quantitative Researcher',
    knowsAbout: [
      'Value at Risk',
      'Financial Econometrics',
      'GARCH Models',
      'Extreme Value Theory',
      'Machine Learning in Finance',
      'Model Validation',
      'Market Risk Management',
    ],
    sameAs: [
      'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7222958',
      'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7170418',
      'https://www.linkedin.com/in/nirajneupane17/',
    ],
  },
}

export const DEFAULT_AUTHOR = AUTHORS.kanchan

/**
 * Resolve a frontmatter byline to a registered author.
 *
 * Frontmatter is hand-written and inconsistent by nature — existing posts say
 * "Kanchan", a new one may say "Niraj Neupane, CA (ICAI)". Match on the key
 * first, then on any word of the registered name, so a byline only has to
 * contain the person to resolve to them. Unknown bylines fall back to the
 * founder rather than emitting a Person with no profile behind it.
 */
export function getAuthor(byline?: string): Author {
  if (!byline) return DEFAULT_AUTHOR

  const needle = byline.toLowerCase()
  const match = Object.values(AUTHORS).find(
    (a) =>
      needle.includes(a.key) ||
      a.name
        .toLowerCase()
        .split(' ')
        .some((part) => needle.includes(part))
  )

  return match ?? DEFAULT_AUTHOR
}
