import { getAllNews, newsTimestamp } from '@/app/lib/news'

export const dynamic = 'force-static'

const SITE = 'https://financialgurkha.com'

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * RSS 2.0 feed served at /rss.xml — every Daily Brief, newest first.
 * Lets feed readers, aggregators, and automation tools (Zapier, IFTTT, …)
 * pick up each brief the moment it publishes.
 */
export async function GET() {
  const items = await getAllNews()

  const sorted = [...items]
    .map((item) => {
      const parsed = new Date(newsTimestamp(item.date) || NaN)
      return { ...item, ts: isNaN(parsed.getTime()) ? 0 : parsed.getTime() }
    })
    .sort((a, b) => b.ts - a.ts)
    .slice(0, 30)

  const lastBuild = sorted.length
    ? new Date(sorted[0].ts).toUTCString()
    : new Date().toUTCString()

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Financial Gurkha — The Daily Brief</title>
    <link>${SITE}/news</link>
    <description>The day's money news, explained like a friend would. No jargon, no panic — just what happened, what it means for you, and where we got it.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${sorted
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.headline)}</title>
      <link>${SITE}/news/${item.slug}</link>
      <guid isPermaLink="true">${SITE}/news/${item.slug}</guid>
      <pubDate>${new Date(item.ts).toUTCString()}</pubDate>
      <description>${escapeXml(item.dek)}</description>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
