import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface NewsSource {
  name: string
  url: string
}

export interface NewsItem {
  slug: string
  date: string
  headline: string
  dek: string
  sources: NewsSource[]
  tags: string[]
  image?: string
  content: string
}

const newsDir = path.join(process.cwd(), 'src', 'app', 'news', 'items')

/**
 * Briefs carry dates as either MM/DD/YYYY or YYYY-MM-DD. `new Date()` reads the
 * ISO form as UTC midnight, which in New York is the evening before, so mixed
 * formats sort and display a day apart. Both are parsed here as local dates.
 */
export function newsTimestamp(date: string): number {
  const s = String(date ?? '').trim()
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3]).getTime()
  const us = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (us) return new Date(+us[3], +us[1] - 1, +us[2]).getTime()
  const t = new Date(s).getTime()
  return Number.isNaN(t) ? 0 : t
}

export function formatNewsDate(date: string, style: 'short' | 'long' = 'short'): string {
  const ts = newsTimestamp(date)
  if (!ts) return String(date ?? '')
  return new Date(ts).toLocaleDateString(
    'en-US',
    style === 'long'
      ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
      : { month: 'short', day: 'numeric', year: 'numeric' }
  )
}

export type NewsSummary = Omit<NewsItem, 'content'> & { readMinutes: number }

/** All briefs, newest first. */
export async function getAllNews(): Promise<NewsSummary[]> {
  if (!fs.existsSync(newsDir)) return []

  const files = fs.readdirSync(newsDir)

  return files
    .filter((file) => file.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(newsDir, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      const words = content.split(/\s+/).filter(Boolean).length

      return {
        ...(data as Omit<NewsItem, 'content' | 'slug'>),
        slug: filename.replace(/\.md$/, ''),
        readMinutes: Math.max(1, Math.round(words / 230)),
      }
    })
    .sort((a, b) => newsTimestamp(b.date) - newsTimestamp(a.date) || b.slug.localeCompare(a.slug))
}

export async function getNewsBySlug(slug: string): Promise<NewsItem> {
  const filePath = path.join(newsDir, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    throw new Error(`News item not found: ${slug}`)
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    ...(data as Omit<NewsItem, 'content' | 'slug'>),
    slug,
    content,
  }
}
