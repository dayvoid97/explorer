import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { BlogPost } from '../blog/[slug]/metadata'

const postsDir = path.join(process.cwd(), 'src/app/blog/posts')

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const filePath = path.join(postsDir, `${slug}.md`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  // Convert Markdown → HTML using remark → rehype → string
  const processedContent = await remark()
    .use(remarkRehype) // Convert Markdown AST to HTML AST
    .use(rehypeStringify) // Convert HTML AST to HTML string
    .process(content)

  const contentHtml = processedContent.toString()

  return {
    ...(data as Omit<BlogPost, 'contentHtml'>),
    contentHtml,
  }
}
