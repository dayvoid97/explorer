import { PUBLISHER, escapeXml, newsEntries, w3cDate, xmlResponse } from '@/app/lib/feeds'

export const dynamic = 'force-static'

/**
 * Google News sitemap served at /news-sitemap.xml.
 *
 * Google News only accepts articles published in the last two days, so older
 * briefs are left out (they stay in /news/sitemap.xml). The window is measured
 * at build time, and the site rebuilds on every publish.
 *
 * publication_date is the brief's calendar date (W3C allows a date alone).
 * Frontmatter has no time, and a made-up time with a fixed offset was wrong
 * for half the year (EDT vs EST).
 */
export async function GET() {
  const cutoff = Date.now() - 2 * 86_400_000
  const recent = (await newsEntries()).filter((e) => Date.UTC(e.published.y, e.published.m - 1, e.published.d + 1) >= cutoff)

  return xmlResponse(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recent
  .map(
    (e) => `  <url>
    <loc>${escapeXml(e.url)}</loc>
    <news:news>
      <news:publication>
        <news:name>${PUBLISHER}</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${w3cDate(e.published)}</news:publication_date>
      <news:title>${escapeXml(e.title)}</news:title>
    </news:news>
  </url>`
  )
  .join('\n')}
</urlset>
`)
}
