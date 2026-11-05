import { Suspense } from 'react'
import SearchResults from './SearchResults'

export const metadata = {
  title: 'Search',
  description: 'Search every Financial Gurkha news brief and research article.',
  // Search results pages stay out of Google's index (its guidance for internal
  // search); the articles they link to are indexed through the sitemaps.
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://financialgurkha.com/search' },
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  )
}
