import { SITE, blogEntries, byNewest, newsEntries, rss, xmlResponse } from '@/app/lib/feeds'

export const dynamic = 'force-static'

/** Everything Financial Gurkha publishes, briefs and research, as RSS 2.0 at /feed.xml: the newest 50. */
export async function GET() {
  const [news, blog] = await Promise.all([newsEntries(), blogEntries()])
  return xmlResponse(
    rss({
      path: '/feed.xml',
      title: 'Financial Gurkha',
      link: SITE,
      description:
        'Financial markets reporting from Wall Street, New York: daily briefs, equity valuations, earnings analysis and macro research.',
      entries: [...news, ...blog].sort(byNewest).slice(0, 50),
    }),
    'application/rss+xml; charset=utf-8'
  )
}
