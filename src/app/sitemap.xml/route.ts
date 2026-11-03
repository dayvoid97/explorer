import { SITE, blogEntries, newestModified, newsEntries, w3cDate, xmlResponse } from '@/app/lib/feeds'

export const dynamic = 'force-static'

/**
 * Sitemap index served at /sitemap.xml: the one URL to give Search Console and
 * Bing Webmaster Tools. It points to a sitemap per section, so each section can
 * grow on its own and Search Console reports coverage per section.
 *
 * The Google News sitemap (/news-sitemap.xml) is listed here too; it only
 * carries briefs from the last two days, as Google News requires.
 */
export async function GET() {
  const [news, blog] = await Promise.all([newsEntries(), blogEntries()])
  const newsUpdated = newestModified(news)
  const blogUpdated = newestModified(blog)

  const sitemaps = [
    { loc: `${SITE}/sitemap-pages.xml`, lastmod: null },
    { loc: `${SITE}/news/sitemap.xml`, lastmod: newsUpdated },
    { loc: `${SITE}/blog/sitemap.xml`, lastmod: blogUpdated },
    { loc: `${SITE}/news-sitemap.xml`, lastmod: newsUpdated },
  ]

  return xmlResponse(`<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map((s) => `  <sitemap>\n    <loc>${s.loc}</loc>${s.lastmod ? `\n    <lastmod>${w3cDate(s.lastmod)}</lastmod>` : ''}\n  </sitemap>`)
  .join('\n')}
</sitemapindex>
`)
}
