import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost } from '../blog/[slug]/metadata'

// src/app/lib/markdown.ts

export async function getAllPosts(): Promise<Omit<BlogPost, 'content'>[]> {
  if (!fs.existsSync(postsDir)) return []

  const files = fs.readdirSync(postsDir)

  return files
    .filter((file) => file.endsWith('.md'))
    .map((filename) => {
      const filePath = path.join(postsDir, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)

      return {
        ...(data as Omit<BlogPost, 'content'>),
        // Ensure the slug is exactly the filename minus .md
        slug: filename.replace(/\.md$/, ''),
      }
    })
}

// Get full post with raw MDX content
// This ensures it looks in the correct place regardless of where the process starts
const postsDir = path.join(process.cwd(), 'src', 'app', 'blog', 'posts')

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  // Add a .md extension check
  const filePath = path.join(postsDir, `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    console.error(`File not found at: ${filePath}`)
    throw new Error(`Post not found: ${slug}`)
  }

  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    ...(data as Omit<BlogPost, 'content'>),
    slug,
    content,
  }
}
