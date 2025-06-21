// ✅ Finalized WinnersPage with Sorting and Load More
'use client'

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react' // Import useRef
import { fetchExploreWins } from '../lib/fetchWins'
import WinCard from '../components/WinCard'
import AdUnit from '../components/AdUnit'

const SORT_OPTIONS = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Most Celebrated', value: 'celebrated' },
  { label: 'Hottest', value: 'hottest' },
]

const SORT_LABELS: Record<'recent' | 'celebrated' | 'hottest', string> = {
  recent: 'These are the latest wins shared by the community.',
  celebrated: 'These wins received the most upvotes — the most celebrated moments!',
  hottest: 'These are the hottest wins based on views and votes combined.',
}

interface Win {
  id: string
  username: string
  createdAt: string
  title: string
  paragraphs: string[]
  mediaUrls?: string[]
  upvotes?: number
  // Add any other properties your Win object might have
}

const ITEMS_PER_LOAD = 20 // This should match your backend's default limit

export default function WinnersPage() {
  const [wins, setWins] = useState<Win[]>([])
  const [sortBy, setSortBy] = useState<'recent' | 'celebrated' | 'hottest'>('recent')
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Use a ref to store the lastCreatedAt. Refs don't cause re-renders when updated.
  const lastCreatedAtRef = useRef<string | null>(null)

  // Memoized function to fetch and update wins, handling initial vs. load more
  const loadWins = useCallback(
    async (isInitialLoad: boolean) => {
      if (isInitialLoad) {
        setLoading(true)
        setWins([]) // Clear previous wins for a fresh start
        setHasMore(true) // Assume there's more until proven otherwise
        lastCreatedAtRef.current = null // Reset cursor in ref for initial load
      } else {
        setLoadingMore(true)
      }

      try {
        const fetchedData = await fetchExploreWins({
          sortBy,
          limit: ITEMS_PER_LOAD,
          lastCreatedAt: isInitialLoad ? null : lastCreatedAtRef.current, // Read from ref.current
        })

        if (isInitialLoad) {
          setWins(fetchedData)
        } else {
          setWins((prevWins) => [...prevWins, ...fetchedData])
        }

        // Check if we received less than the requested limit, indicating no more data
        if (fetchedData.length < ITEMS_PER_LOAD) {
          setHasMore(false)
        } else {
          // Update the cursor for the next fetch
          const lastWin = fetchedData[fetchedData.length - 1]
          if (lastWin && lastWin.createdAt) {
            lastCreatedAtRef.current = lastWin.createdAt // Update ref.current for the next call
          } else {
            // Fallback if the last win doesn't have createdAt (shouldn't happen with proper backend)
            setHasMore(false)
            console.warn(
              "Could not find 'createdAt' for the last fetched win. Stopping pagination."
            )
          }
        }
      } catch (err) {
        console.error('Error loading wins:', err)
        setHasMore(false) // Stop trying to load more on error
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [sortBy]
  ) // Only `sortBy` is a dependency. `lastCreatedAtRef.current` is mutable.

  // Effect to trigger initial load when component mounts or sortBy changes
  useEffect(() => {
    loadWins(true) // Call with true for initial load
  }, [sortBy, loadWins]) // `loadWins` is memoized by useCallback, so this is safe

  // Handler for the "Load More" button
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadWins(false) // Call with false for subsequent loads
    }
  }

  // Ad injection logic, now dynamic based on current wins length
  const adIndices = useMemo(() => {
    const indices = new Set<number>()
    const adInterval = 6 // Place an ad roughly every 6 wins
    const startAdAfter = 3 // Start placing ads after the first few wins

    for (let i = startAdAfter; i < wins.length; i += adInterval) {
      if (i < wins.length) {
        indices.add(i)
      }
    }
    return [...indices].sort((a, b) => a - b)
  }, [wins])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">ONLY WS IN THE CHAT 🏆 🏆 🏆</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{SORT_LABELS[sortBy]}</p>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'recent' | 'celebrated' | 'hottest')}
          className="border rounded px-3 py-1 dark:bg-zinc-800 dark:text-white"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {loading && wins.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-300">Loading wins...</div>
      )}

      {!loading && wins.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-300">
          No wins found for this category.
        </div>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wins.map((win, index) => (
          <React.Fragment key={win.id}>
            <WinCard win={win} />
            {adIndices.includes(index) && <AdUnit />}
          </React.Fragment>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition ${
              loadingMore
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-md'
            }`}
          >
            {loadingMore ? 'Loading More Wins...' : 'Load More Wins'}
          </button>
        </div>
      )}

      {!hasMore && !loading && wins.length > 0 && (
        <p className="text-center text-gray-500 dark:text-gray-300 mt-8">
          You've reached the end of the wins!
        </p>
      )}
    </div>
  )
}
