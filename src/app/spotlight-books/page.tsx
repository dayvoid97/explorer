import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllSpotlightBooks, isSpotlightBooksPublic } from '../lib/spotlight-books'

export const metadata = {
  title: 'Spotlight Books',
  description:
    'Financial Gurkha Spotlight Books: one book a month on economic history, markets and how capital moves, reviewed in long form.',
}

export default async function SpotlightBooksPage() {
  // Pending publication: inaccessible everywhere until launch.
  if (!isSpotlightBooksPublic()) notFound()

  const books = await getAllSpotlightBooks()

  return (
    <main className="mx-auto max-w-3xl px-4">
      <div className="flex gap-3 mb-2">
        <div className="h-px flex-grow bg-white/10" />
        <h2 className="text-[20px] font-black uppercase tracking-[0.3em] bg-[#C9A24B]">
          FINANCIAL GURKHA SPOTLIGHT BOOKS
        </h2>
        <div className="h-px flex-grow bg-white/10" />
      </div>
      <p className="mb-8 text-center text-sm text-gray-600">
        One book a month on economic history, markets and how capital moves.
      </p>

      <div className="space-y-8">
        {books.map((book) => (
          <Link
            key={book.slug}
            href={`/blog/${book.slug}`}
            className="block hover:opacity-90 transition"
          >
            {book.image && (
              <img src={book.image} alt={book.title} className="h-80 w-full object-cover" />
            )}
            <div className="py-4">
              <div className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#8a6d2b]">
                Spotlight · {book.month}
              </div>
              <h2
                className="text-2xl font-semibold mb-2"
                style={{
                  fontFamily: "'Freight Big Pro', serif",
                  fontWeight: 800,
                  letterSpacing: '-0.05rem',
                }}
              >
                {book.title}
              </h2>
              <p className="text-sm text-gray-700">
                <em>{book.book.title}</em> by {book.book.author} · {book.book.publisher},{' '}
                {book.book.year}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
