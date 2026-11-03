import { getAllPosts } from './markdown'
import { getAllNews } from './news'
import { WEBSUB_HUB } from './feed-links'

/**
 * Shared data and XML helpers for the sitemaps and RSS feeds.
 *
 * Content lives in markdown files, so every sitemap and feed is rebuilt on each
 * deploy: publishing a brief or an article updates all of them, and the
 * Broadcast workflow (.github/workflows/broadcast.yml) then tells search
 * engines and feed hubs.
 */
export const SITE = 'https://financialgurkha.com'
export const PUBLISHER = 'Financial Gurkha'
const NEW_YORK = 'America/New_York'


export function escapeXml(s: string): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

type Ymd = { y: number; m: number; d: number }

/** Frontmatter dates are MM/DD/YYYY or YYYY-MM-DD, with no time. Read them as calendar dates. */
export function parseYmd(date: unknown): Ymd | null {
  const s = String(date ?? '').trim()
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (iso) return { y: +iso[1], m: +iso[2], d: +iso[3] }
  const us = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (us) return { y: +us[3], m: +us[1], d: +us[2] }
  return null
}

/** W3C date (YYYY-MM-DD): valid for sitemap lastmod and Google News, with no fake time or timezone. */
export const w3cDate = ({ y, m, d }: Ymd) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`

const ymdValue = ({ y, m, d }: Ymd) => y * 10000 + m * 100 + d

/** Noon in New York on that date, with the right EST/EDT offset, as an instant. */
export function newYorkNoon({ y, m, d }: Ymd): Date {
  const probe = new Date(Date.UTC(y, m - 1, d, 17))
  const zone = new Intl.DateTimeFormat('en-US', { timeZone: NEW_YORK, timeZoneName: 'shortOffset' })
    .formatToParts(probe)
    .find((p) => p.type === 'timeZoneName')?.value
  const offset = Number(zone?.match(/GMT([+-]\d+)/)?.[1] ?? -5)
  return new Date(Date.UTC(y, m - 1, d, 12 - offset))
}

export const absoluteUrl = (pathOrUrl: string) => (/^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${SITE}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`)

export interface Entry {
  kind: 'news' | 'blog'
  url: string
  title: string
  summary: string
  published: Ymd
  /** Last real change: frontmatter `updated`, else the publish date. */
  modified: Ymd
  image?: string
  tags: string[]
  author: string
}

const latest = (a: Ymd, b: Ymd | null) => (b && ymdValue(b) > ymdValue(a) ? b : a)

/** Entries are skipped, not guessed, when their date doesn't parse. */
export async function newsEntries(): Promise<Entry[]> {
  const items = await getAllNews()
  return items
    .map((item): Entry | null => {
      const published = parseYmd(item.date)
      if (!published) return null
      const extra = item as typeof item & { updated?: string; author?: string }
      return {
        kind: 'news',
        url: `${SITE}/news/${item.slug}`,
        title: item.headline,
        summary: item.dek,
        published,
        modified: latest(published, parseYmd(extra.updated)),
        image: item.image ? absoluteUrl(item.image) : undefined,
        tags: item.tags ?? [],
        author: extra.author || PUBLISHER,
      }
    })
    .filter((e): e is Entry => e !== null)
    .sort(byNewest)
}

export async function blogEntries(): Promise<Entry[]> {
  const posts = await getAllPosts()
  return posts
    .map((post): Entry | null => {
      const published = parseYmd(post.date)
      if (!post.slug || !published) return null
      const extra = post as typeof post & { updated?: string }
      return {
        kind: 'blog',
        url: `${SITE}/blog/${post.slug}`,
        title: post.title,
        summary: post.subtitle,
        published,
        modified: latest(published, parseYmd(extra.updated)),
        image: post.image ? absoluteUrl(post.image) : undefined,
        tags: post.categories ?? [],
        author: post.author || PUBLISHER,
      }
    })
    .filter((e): e is Entry => e !== null)
    .sort(byNewest)
}

export function byNewest(a: Entry, b: Entry) {
  return ymdValue(b.published) - ymdValue(a.published) || b.url.localeCompare(a.url)
}

export const newestModified = (entries: Entry[]) =>
  entries.reduce<Ymd | null>((max, e) => (max && ymdValue(max) >= ymdValue(e.modified) ? max : e.modified), null)

/* ---------- sitemaps ---------- */

export interface SitemapUrl {
  loc: string
  lastmod?: Ymd | null
  images?: { loc: string; title?: string }[]
}

export function urlset(urls: SitemapUrl[]): string {
  const hasImages = urls.some((u) => u.images?.length)
  const body = urls
    .map((u) => {
      const lines = [`    <loc>${escapeXml(u.loc)}</loc>`]
      if (u.lastmod) lines.push(`    <lastmod>${w3cDate(u.lastmod)}</lastmod>`)
      for (const img of u.images ?? []) {
        lines.push(`    <image:image><image:loc>${escapeXml(img.loc)}</image:loc></image:image>`)
      }
      return `  <url>\n${lines.join('\n')}\n  </url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${hasImages ? '\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : ''}>
${body}
</urlset>
`
}

export const entryToUrl = (e: Entry): SitemapUrl => ({
  loc: e.url,
  lastmod: e.modified,
  images: e.image ? [{ loc: e.image }] : undefined,
})

export function xmlResponse(body: string, contentType = 'application/xml; charset=utf-8') {
  return new Response(body, {
    headers: { 'Content-Type': contentType, 'Cache-Control': 'public, max-age=600' },
  })
}

/* ---------- RSS 2.0 ---------- */

export function rss({
  path,
  title,
  link,
  description,
  entries,
}: {
  path: string
  title: string
  link: string
  description: string
  entries: Entry[]
}): string {
  const updated = newestModified(entries)
  const lastBuild = (updated ? newYorkNoon(updated) : new Date(0)).toUTCString()
  const items = entries
    .map((e) => {
      const lines = [
        `      <title>${escapeXml(e.title)}</title>`,
        `      <link>${escapeXml(e.url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(e.url)}</guid>`,
        `      <pubDate>${newYorkNoon(e.published).toUTCString()}</pubDate>`,
        `      <dc:creator>${escapeXml(e.author)}</dc:creator>`,
        `      <description>${escapeXml(e.summary)}</description>`,
        ...e.tags.map((t) => `      <category>${escapeXml(t)}</category>`),
      ]
      if (e.image) lines.push(`      <media:content url="${escapeXml(e.image)}" medium="image"/>`)
      return `    <item>\n${lines.join('\n')}\n    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(link)}</link>
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE}${path}" rel="self" type="application/rss+xml"/>
    <atom:link href="${WEBSUB_HUB}" rel="hub"/>
    <image>
      <url>${SITE}/logo.png</url>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
    </image>
${items}
  </channel>
</rss>
`
}
