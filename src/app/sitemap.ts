import type { MetadataRoute } from 'next'
import { getAllPosts } from './lib/markdown'

export const dynamic = 'force-static'

const SITE = 'https://financialgurkha.com'

/**
 * Dynamic sitemap served at /sitemap.xml.
 *
 * Only routes that actually render are listed. Most legacy app routes
 * (/explorer, /inbox, /chronology, etc.) are currently 307-redirected to
 * /winners in next.config.ts, and listing redirects in a sitemap wastes crawl
 * budget and generates "Page with redirect" errors in Search Console.
 *
 * Post dates come from frontmatter (MM/DD/YYYY), which gives Google a real
 * lastModified signal rather than a build timestamp.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()

  const postEntries: MetadataRoute.Sitemap = posts
    .filter((p) => p.slug)
    .map((post) => {
      const parsed = new Date(post.date)
      const lastModified = isNaN(parsed.getTime()) ? new Date() : parsed

      // Recent analysis gets crawled more aggressively; evergreen valuations
      // change rarely, so they signal monthly.
      const ageDays = (Date.now() - lastModified.getTime()) / 86_400_000

      return {
        url: `${SITE}/blog/${post.slug}`,
        lastModified,
        changeFrequency: ageDays < 30 ? ('daily' as const) : ('monthly' as const),
        priority: ageDays < 30 ? 0.9 : 0.7,
      }
    })
    .sort((a, b) => b.lastModified!.valueOf() - a.lastModified!.valueOf())

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: SITE,
      lastModified: postEntries[0]?.lastModified ?? new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE}/blog`,
      lastModified: postEntries[0]?.lastModified ?? new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE}/consult`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      // The author page carries the credentials and methodology that Google's
      // E-E-A-T evaluation and AI assistants both look for on finance content.
      url: `${SITE}/about/kanchan`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      // Track record: every published valuation with outcomes, including the
      // misses. The strongest transparency signal available to an independent
      // analyst, and the direct answer to "accuracy is unproven".
      url: `${SITE}/track-record`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      // Editorial standards: sourcing, disclosure and corrections policy. This
      // is the page that answers "is this publication trustworthy" directly.
      url: `${SITE}/legal/editorial`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${SITE}/legal/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE}/legal/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE}/winners`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]

  return [...staticEntries, ...postEntries]
}
