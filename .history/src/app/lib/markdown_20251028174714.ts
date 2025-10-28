import { fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost } from '../blog/[slug]/metadata'

const postsDir = path.join(process.cwd(), 'src/app/blog/posts')

export async function getAllPosts(): Promise<Omit<BlogPost, 'content'>[]> {
  const files = fs.readdirSync(postsDir)

  return files.map((filename) => {
    const filePath = path.join(postsDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)

    return data as Omit<BlogPost, 'content'>
  })
}

// Get full post with raw MDX content
export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const filePath = path.join(postsDir, `${slug}.md`)
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    ...(data as Omit<BlogPost, 'content'>),
    content,
  }
}
