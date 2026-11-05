import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getAllPosts } from './markdown'
import { getAllNews } from './news'
import { SITE, absoluteUrl, parseYmd, w3cDate } from './feeds'

/**
 * Content for the Financial Gurkha mobile app, served as JSON under /api/app/v1.
 *
 * Built from the same markdown files as the website on every deploy, so pushing
 * a brief or an article to `main` publishes it to the app too. The site's MDX
 * components are rewritten into plain markdown the app can render.
 */
export type AppKind = 'news' | 'research'

export interface AppItem {
  id: string // "<kind>/<slug>"
  kind: AppKind
  slug: string
  title: string
  summary: string
  date: string // YYYY-MM-DD
  image?: string
  tags: string[]
  author: string
  readMinutes: number
  url: string // the article on the website
}

const DIRS: Record<AppKind, string> = {
  news: path.join(process.cwd(), 'src', 'app', 'news', 'items'),
  research: path.join(process.cwd(), 'src', 'app', 'blog', 'posts'),
}
const WEB_PATH: Record<AppKind, string> = { news: '/news', research: '/blog' }

const readMinutes = (text: string) => Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / 230))

/** Every brief and article, newest first. */
export async function appItems(): Promise<AppItem[]> {
  const [news, posts] = await Promise.all([getAllNews(), getAllPosts()])
  const items: AppItem[] = []

  for (const n of news) {
    const ymd = parseYmd(n.date)
    if (!ymd) continue
    items.push({
      id: `news/${n.slug}`,
      kind: 'news',
      slug: n.slug,
      title: n.headline,
      summary: n.dek,
      date: w3cDate(ymd),
      image: n.image ? absoluteUrl(n.image) : undefined,
      tags: n.tags ?? [],
      author: (n as typeof n & { author?: string }).author || 'Financial Gurkha',
      readMinutes: n.readMinutes,
      url: `${SITE}/news/${n.slug}`,
    })
  }

  for (const p of posts) {
    const ymd = parseYmd(p.date)
    if (!ymd || !p.slug) continue
    const raw = fs.readFileSync(path.join(DIRS.research, `${p.slug}.md`), 'utf8')
    items.push({
      id: `research/${p.slug}`,
      kind: 'research',
      slug: p.slug,
      title: p.title,
      summary: p.subtitle,
      date: w3cDate(ymd),
      image: p.image ? absoluteUrl(p.image) : undefined,
      tags: p.categories ?? [],
      author: p.author || 'Financial Gurkha',
      readMinutes: readMinutes(matter(raw).content),
      url: `${SITE}/blog/${p.slug}`,
    })
  }

  return items.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id))
}

const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`))?.[1] ?? ''

/**
 * Site MDX -> plain markdown for the app:
 *   <Info label="X">definition</Info>  ->  [X](fg-info:<definition>)   (the app shows it as a pop-up)
 *   <Paper … />                         ->  a quoted citation card
 *   <AdSenseInArticle … />              ->  removed (the app places its own ads)
 *   /relative images and links          ->  absolute financialgurkha.com URLs
 */
export function toAppMarkdown(body: string): string {
  return body
    .replace(/<AdSenseInArticle[^>]*\/>/g, '')
    .replace(/<Info\s+label\s*=\s*"([^"]*)"\s*>([\s\S]*?)<\/Info>/g, (_, label: string, def: string) =>
      `[${label}](fg-info:${encodeURIComponent(def.trim())})`
    )
    .replace(/<Paper[\s\S]*?\/>/g, (tag) => {
      const lines = [`> **${attr(tag, 'title')}**`, `> ${[attr(tag, 'authors'), attr(tag, 'venue')].filter(Boolean).join(' · ')}`]
      const abstract = attr(tag, 'abstract')
      if (abstract) lines.push('>', `> ${abstract}`)
      const href = attr(tag, 'href')
      if (href) lines.push('>', `> [Read the paper](${href})`)
      return lines.join('\n')
    })
    .replace(/\]\(\/(?!\/)/g, `](${SITE}/`)
    .replace(/src="\/(?!\/)/g, `src="${SITE}/`)
}

export async function appArticle(kind: AppKind, slug: string) {
  const item = (await appItems()).find((i) => i.kind === kind && i.slug === slug)
  if (!item) return null
  const { content } = matter(fs.readFileSync(path.join(DIRS[kind], `${slug}.md`), 'utf8'))
  return { ...item, body: toAppMarkdown(content), webPath: `${WEB_PATH[kind]}/${slug}` }
}

/** JSON for the app. Content is public, so any origin may read it (the web build of the app included). */
export function appJson(data: unknown) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
