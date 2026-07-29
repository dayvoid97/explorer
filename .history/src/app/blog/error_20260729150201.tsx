'use client'

import Link from 'next/link'

// Catches rendering errors in blog pages (e.g. a malformed post) so a bad
// article shows a friendly message instead of crashing the whole site.
export default function BlogError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">Something went wrong loading this post</h1>
      <p className="text-gray-500">
        The article could not be displayed. It may contain a formatting error.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white transition hover:bg-green-600"
        >
          Try again
        </button>
        <Link
          href="/blog"
          className="rounded-lg border border-gray-400 px-4 py-2 font-semibold transition hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Back to Blog
        </Link>
      </div>
    </div>
  )
}
