import type { Metadata } from 'next'
import { isSpotlightBooksPublic } from '../lib/spotlight-books'

// While the section is private, tell crawlers not to index or follow anything
// under /spotlight-books, even if a URL leaks. This flips automatically when
// SPOTLIGHT_BOOKS_PUBLIC=true is set at launch.
export async function generateMetadata(): Promise<Metadata> {
  return isSpotlightBooksPublic()
    ? {}
    : { robots: { index: false, follow: false, googleBot: { index: false, follow: false } } }
}

export default function SpotlightBooksLayout({ children }: { children: React.ReactNode }) {
  return <div className="py-8">{children}</div>
}
