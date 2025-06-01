'use client'
import ExplorerPage from './explorer/page'
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
        Explore public equities by name, ticker, or region.
      </p>
      <ExplorerPage />
    </main>
  )
}
