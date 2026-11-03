import { SITE, newsEntries, rss, xmlResponse } from '@/app/lib/feeds'

export const dynamic = 'force-static'

/**
 * The Daily Brief as RSS 2.0, served at /rss.xml: the newest 50 briefs.
 * Feed readers, aggregators and automation tools (Zapier, IFTTT, Make…) pick
 * up each brief when it publishes; the WebSub hub pushes it to subscribers.
 */
export async function GET() {
  return xmlResponse(
    rss({
      path: '/rss.xml',
      title: 'Financial Gurkha — The Daily Brief',
      link: `${SITE}/news`,
      description:
        "The day's money news, explained like a friend would. No jargon, no panic — just what happened, what it means for you, and where we got it.",
      entries: (await newsEntries()).slice(0, 50),
    }),
    'application/rss+xml; charset=utf-8'
  )
}
