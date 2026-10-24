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
 * Google News sitemap served at /news-sitemap.xml.
 *
 * Google News only accepts URLs published in the last 2 days, so older
 * briefs are excluded. publication_date is rendered at noon Eastern on the
 * brief's date (frontmatter is date-only).
 */
export async function GET() {
  const items = await getAllNews()
  const cutoff = Date.now() - 2 * 86_400_000

  const urls = items
    .map((item) => {
      const parsed = new Date(newsTimestamp(item.date) || NaN)
      if (isNaN(parsed.getTime())) return null
      if (parsed.getTime() < cutoff) return null
      const ymd = `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}`
      return {
        loc: `${SITE}/news/${item.slug}`,
        pubDate: `${ymd}T12:00:00-04:00`,
        title: item.headline,
      }
    })
    .filter((u): u is NonNullable<typeof u> => u !== null)
    .sort((a, b) => (a.pubDate < b.pubDate ? 1 : -1))

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <news:news>
      <news:publication>
        <news:name>Financial Gurkha</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${u.pubDate}</news:publication_date>
      <news:title>${escapeXml(u.title)}</news:title>
    </news:news>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
