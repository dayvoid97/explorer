// ✅ Finalized WinnersPage with Sorting and Load More
'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { fetchExploreWins } from '../lib/fetchWins' // Assuming this is the correct path and file
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

// Define the shape of a Win item for type safety
interface Win {
  id: string
  username: string
  createdAt: string // Crucial for pagination
  title: string
  paragraphs: string[]
  mediaUrls?: string[]
  upvotes?: number
  // Add any other properties your Win object might have
}

const ITEMS_PER_LOAD = 20 // This should match your backend's default limit

export default function WinnersPage() {
  const [wins, setWins] = useState<Win[]>([]) // Ensure Win type
  const [sortBy, setSortBy] = useState<'recent' | 'celebrated' | 'hottest'>('recent')
  const [loading, setLoading] = useState(false) // For initial load or full sort change
  const [loadingMore, setLoadingMore] = useState(false) // For subsequent "Load More" clicks
  const [hasMore, setHasMore] = useState(true) // Tracks if there's more data to fetch
  const [lastCreatedAt, setLastCreatedAt] = useState<string | null>(null) // Pagination cursor

  // Memoized function to fetch and update wins, handling initial vs. load more
  const loadWins = useCallback(
    async (isInitialLoad: boolean) => {
      if (isInitialLoad) {
        setLoading(true)
        setWins([]) // Clear previous wins for a fresh start
        setHasMore(true) // Assume there's more until proven otherwise
        setLastCreatedAt(null) // Reset cursor for initial load
      } else {
        setLoadingMore(true)
      }

      try {
        const fetchedData = await fetchExploreWins({
          sortBy,
          limit: ITEMS_PER_LOAD,
          lastCreatedAt: isInitialLoad ? null : lastCreatedAt, // Only pass lastCreatedAt for subsequent loads
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
            setLastCreatedAt(lastWin.createdAt)
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
    [sortBy, lastCreatedAt]
  ) // Dependencies for useCallback

  // Effect to trigger initial load when component mounts or sortBy changes
  useEffect(() => {
    loadWins(true) // Call with true for initial load
  }, [sortBy, loadWins]) // `loadWins` is memoized by useCallback

  // Handler for the "Load More" button
  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      // Prevent multiple clicks and ensure there's more to load
      loadWins(false) // Call with false for subsequent loads
    }
  }

  // Ad injection logic, now dynamic based on current wins length
  const adIndices = useMemo(() => {
    const indices = new Set<number>()
    // Define how often you want an ad to appear. E.g., every 5-7 wins.
    // Let's place ads at somewhat dynamic intervals, for example, after every 5th or 6th win.
    const adInterval = 6 // Place an ad roughly every 6 wins

    // Start placing ads after the first few wins, e.g., after the 3rd win
    const startAdAfter = 3

    for (let i = startAdAfter; i < wins.length; i += adInterval) {
      if (i < wins.length) {
        // Ensure the index is within bounds of current wins
        indices.add(i)
      }
    }
    return [...indices].sort((a, b) => a - b) // Sort to ensure consistent insertion
  }, [wins]) // Recalculate ad indices when wins change

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

      {loading &&
        wins.length === 0 && ( // Only show "Loading wins..." on initial empty load
          <div className="text-center text-gray-500 dark:text-gray-300">Loading wins...</div>
        )}

      {!loading &&
        wins.length === 0 && ( // Display message if no wins are found after loading
          <div className="text-center text-gray-500 dark:text-gray-300">
            No wins found for this category.
          </div>
        )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wins.map((win, index) => (
          <React.Fragment key={win.id}>
            <WinCard win={win} />
            {/* Inject AdUnit after the WinCard at specified indices */}
            {adIndices.includes(index) && <AdUnit />}
          </React.Fragment>
        ))}
      </div>

      {hasMore && ( // Show Load More button only if there's potentially more data
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore} // Disable when loading more to prevent multiple clicks
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

      {!hasMore &&
        !loading &&
        wins.length > 0 && ( // Show "End of wins" message only when no more data AND not initially loading
          <p className="text-center text-gray-500 dark:text-gray-300 mt-8">
            You've reached the end of the wins!
          </p>
        )}
    </div>
  )
}
