import { SITE, blogEntries, newestModified, newsEntries, urlset, xmlResponse } from '@/app/lib/feeds'

export const dynamic = 'force-static'

/**
 * The site's standing pages. Only routes that actually render are listed: most
 * legacy app routes redirect to /winners (next.config.ts), and redirects in a
 * sitemap waste crawl budget and show up as errors in Search Console.
 *
 * No lastmod on pages without a real modified date. Stamping the build time on
 * every page told Google everything changed on every deploy, and Google ignores
 * lastmod site-wide once it finds it unreliable. The section fronts carry the
 * date of their newest piece, which is when they really changed.
 */
export async function GET() {
  const [news, blog] = await Promise.all([newsEntries(), blogEntries()])
  const newsUpdated = newestModified(news)
  const blogUpdated = newestModified(blog)
  const latest = newestModified([...news, ...blog])

  return xmlResponse(
    urlset([
      { loc: SITE, lastmod: latest },
      { loc: `${SITE}/news`, lastmod: newsUpdated },
      { loc: `${SITE}/blog`, lastmod: blogUpdated },
      { loc: `${SITE}/links`, lastmod: latest },
      { loc: `${SITE}/consult` },
      { loc: `${SITE}/about` },
      // Author pages carry the credentials and methodology that Google's E-E-A-T
      // evaluation and AI assistants look for on finance content.
      { loc: `${SITE}/about/kanchan` },
      { loc: `${SITE}/about/niraj` },
      // Every published valuation with outcomes, including the misses.
      { loc: `${SITE}/track-record` },
      { loc: `${SITE}/legal/editorial` },
      { loc: `${SITE}/how-does-financial-gurkha-make-money` },
      { loc: `${SITE}/where-does-financial-gurkha-provision-its-financial-data` },
      { loc: `${SITE}/legal/terms` },
      { loc: `${SITE}/legal/privacy` },
      { loc: `${SITE}/winners` },
    ])
  )
}
