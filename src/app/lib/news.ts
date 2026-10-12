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

export async function getAllNews(): Promise<Omit<NewsItem, 'content'>[]> {
  if (!fs.existsSync(newsDir)) return []

  const files = fs.readdirSync(newsDir)

  return files
    .filter((file) => file.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(newsDir, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)

      return {
        ...(data as Omit<NewsItem, 'content' | 'slug'>),
        slug: filename.replace(/\.md$/, ''),
      }
    })
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
