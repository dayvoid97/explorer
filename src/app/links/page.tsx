import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import LinksGrid, { type LinkArticle } from './links-grid'

function parseDate(raw: unknown): { ts: number; label: string } {
  if (typeof raw !== 'string') return { ts: 0, label: '' }
  const trimmed = raw.trim()
  const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (iso) {
    const ts = new Date(
      Number(iso[1]),
      Number(iso[2]) - 1,
      Number(iso[3])
    ).getTime()
    const label = new Date(ts).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
    return { ts: Number.isNaN(ts) ? 0 : ts, label }
  }
  const m = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (!m) return { ts: 0, label: raw }
  const ts = new Date(Number(m[3]), Number(m[1]) - 1, Number(m[2])).getTime()
  const label = new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return { ts: Number.isNaN(ts) ? 0 : ts, label }
}

function readArticles(): LinkArticle[] {
  const appDir = path.join(process.cwd(), 'src', 'app')
  const out: LinkArticle[] = []

  // Blog posts
  const blogDir = path.join(appDir, 'blog', 'posts')
  if (fs.existsSync(blogDir)) {
    for (const file of fs.readdirSync(blogDir)) {
      if (!file.endsWith('.md')) continue
      try {
        const { data } = matter(
          fs.readFileSync(path.join(blogDir, file), 'utf8')
        )
        const slug = String(data.slug ?? file.replace(/\.md$/, ''))
        const { ts, label } = parseDate(data.date)
        out.push({
          title: String(data.title ?? slug),
          href: `https://financialgurkha.com/blog/${slug}`,
          image: String(data.image ?? ''),
          ts,
          dateLabel: label,
          kind: 'Research',
        })
      } catch {
        /* skip unreadable file */
      }
    }
  }

  // News briefs
  const newsDir = path.join(appDir, 'news', 'items')
  if (fs.existsSync(newsDir)) {
    for (const file of fs.readdirSync(newsDir)) {
      if (!file.endsWith('.md')) continue
      try {
        const { data } = matter(
          fs.readFileSync(path.join(newsDir, file), 'utf8')
        )
        const slug = file.replace(/\.md$/, '')
        const { ts, label } = parseDate(data.date)
        out.push({
          title: String(data.headline ?? data.title ?? slug),
          href: `https://financialgurkha.com/news/${slug}`,
          image: String(data.image ?? ''),
          ts,
          dateLabel: label,
          kind: 'News',
        })
      } catch {
        /* skip unreadable file */
      }
    }
  }

  out.sort((a, b) => b.ts - a.ts)
  return out
}

export default function LinksPage() {
  const articles = readArticles()
  return <LinksGrid articles={articles} />
}
