import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { BlogPost } from '../blog/[slug]/metadata'

const postsDir = path.join(process.cwd(), 'src/app/blog/posts')

export async function getAllPosts(): Promise<Omit<BlogPost, 'contentHtml'>[]> {
  const files = fs.readdirSync(postsDir)

  return files.map((filename) => {
    const filePath = path.join(postsDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)

    return data as Omit<BlogPost, 'contentHtml'>
  })
}

// Get full post with rendered HTML
export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const filePath = path.join(postsDir, `${slug}.md`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  const processedContent = await remark().use(remarkRehype).use(rehypeStringify).process(content)

  const contentHtml = processedContent.toString()

  return {
    ...(data as Omit<BlogPost, 'contentHtml'>),
    contentHtml,
  }
}
