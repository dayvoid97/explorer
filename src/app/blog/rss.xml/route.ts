import { SITE, blogEntries, rss, xmlResponse } from '@/app/lib/feeds'

export const dynamic = 'force-static'

/** Research articles as RSS 2.0, served at /blog/rss.xml: the newest 50. */
export async function GET() {
  return xmlResponse(
    rss({
      path: '/blog/rss.xml',
      title: 'Financial Gurkha — Research',
      link: `${SITE}/blog`,
      description:
        'Intrinsic valuations, earnings breakdowns from primary SEC filings, and macro analysis. Financial markets reporting from Wall Street, New York.',
      entries: (await blogEntries()).slice(0, 50),
    }),
    'application/rss+xml; charset=utf-8'
  )
}
