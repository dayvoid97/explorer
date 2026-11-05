import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { appItems } from '../app-content'

/**
 * The site search index: every news brief and research article, with its body
 * as plain text. Built on each deploy (served statically at /api/search-index),
 * so new content is searchable as soon as it publishes.
 */
export interface SearchDoc {
  id: string
  kind: 'news' | 'research'
  title: string
  summary: string
  tags: string[]
  body: string
  date: string // YYYY-MM-DD
  url: string // site path
  image?: string
}

// Long reports are cut here; the opening sections carry the substance and the index stays light
const BODY_CHARS = 4500

const DIRS = {
  news: path.join(process.cwd(), 'src', 'app', 'news', 'items'),
  research: path.join(process.cwd(), 'src', 'app', 'blog', 'posts'),
}

/** Markdown and the site's MDX components down to readable text. */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/<Info\s+label\s*=\s*"([^"]*)"\s*>([\s\S]*?)<\/Info>/g, '$1 ($2)')
    .replace(/<Paper[\s\S]*?title="([^"]*)"[\s\S]*?\/>/g, '$1')
    .replace(/<[^>]+>/g, ' ') // other tags and components
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> their text
    .replace(/^\s*\|?\s*:?-{3,}.*$/gm, ' ') // table rules
    .replace(/[|#>*_`~]/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function searchDocs(): Promise<SearchDoc[]> {
  const items = await appItems()
  return items.map((item) => {
    const file = path.join(DIRS[item.kind], `${item.slug}.md`)
    const { content } = matter(fs.readFileSync(file, 'utf8'))
    return {
      id: item.id,
      kind: item.kind,
      title: item.title,
      summary: item.summary,
      tags: item.tags,
      body: toPlainText(content).slice(0, BODY_CHARS),
      date: item.date,
      url: item.kind === 'news' ? `/news/${item.slug}` : `/blog/${item.slug}`,
      image: item.image?.replace('https://financialgurkha.com', ''),
    }
  })
}
