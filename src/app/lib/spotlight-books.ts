import { getAllPosts } from './markdown'
import type { BlogPost } from '../blog/[slug]/metadata'

// Spotlight Books: a monthly featured book, reviewed in long form.
//
// The reviews themselves are ordinary, public blog posts at /blog/<slug>. A
// post becomes a Spotlight Book by carrying a `book:` block in its frontmatter
// (see the 600 Years of Capitalism post for the shape).
//
// The /spotlight-books route is the section index that collects those posts.
// It is PENDING PUBLICATION: it returns 404 everywhere, development included,
// until SPOTLIGHT_BOOKS_PUBLIC=true is set. Launching the section is that
// environment variable, plus adding /spotlight-books to the sitemap and IndexNow
// and linking it from navigation.

export type SpotlightBook = Omit<BlogPost, 'content'> & { book: NonNullable<BlogPost['book']> }

export function isSpotlightBooksPublic(): boolean {
  return process.env.SPOTLIGHT_BOOKS_PUBLIC === 'true'
}

export async function getAllSpotlightBooks(): Promise<SpotlightBook[]> {
  const posts = await getAllPosts()
  return posts
    .filter((p): p is SpotlightBook => Boolean(p.book))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
