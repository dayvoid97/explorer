import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import LinksGrid, { type LinkArticle } from './links-grid'
import { formatNewsDate, newsTimestamp } from '@/app/lib/news'

// One date parser for the whole site (handles MM/DD/YYYY and YYYY-MM-DD as local dates).
function parseDate(raw: unknown): { ts: number; label: string } {
  if (typeof raw !== 'string') return { ts: 0, label: '' }
  const ts = newsTimestamp(raw)
  return { ts, label: ts ? formatNewsDate(raw) : raw }
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
        const { data } = matter(fs.readFileSync(path.join(blogDir, file), 'utf8'))
        const slug = file.replace(/\.md$/, '')
        const { ts, label } = parseDate(data.date)
        out.push({
          title: String(data.title ?? slug),
          href: `/blog/${slug}`,
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
        const { data } = matter(fs.readFileSync(path.join(newsDir, file), 'utf8'))
        const slug = file.replace(/\.md$/, '')
        const { ts, label } = parseDate(data.date)
        out.push({
          title: String(data.headline ?? data.title ?? slug),
          href: `/news/${slug}`,
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
