'use client'
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { fetchExploreWins } from '../lib/fetchWins'
import WinCard from '../components/WinCard'
import AdUnit from '../components/AdUnit'
import { Win } from '../lib/utils'
import SortHeader from './SortHeader'

export const SORT_OPTIONS = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Most Celebrated', value: 'celebrated' },
  { label: 'Hottest', value: 'hottest' },
]

const ITEMS_PER_LOAD = 20

interface WinFeedProps {
  initialWins: Win[]
  initialHasMore: boolean
  initialSortBy: 'recent' | 'celebrated' | 'hottest'
}

export default function WinFeed({ initialWins, initialHasMore, initialSortBy }: WinFeedProps) {
  const [wins, setWins] = useState<Win[]>(initialWins)
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [loading, setLoading] = useState(initialWins.length === 0 && initialHasMore)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [apiError, setApiError] = useState<string | null>(null) // State for API error messages
  const lastCreatedAtRef = useRef<string | null>(null)
  const lastIdRef = useRef<string | null>(null)
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const [adIndices, setAdIndices] = useState<Set<number>>(new Set())

  // Initialization: Set refs based on initial server data
  useEffect(() => {
    if (initialWins.length > 0) {
      const lastWin = initialWins[initialWins.length - 1]
      lastCreatedAtRef.current = lastWin.createdAt
      lastIdRef.current = lastWin.id
    }
  }, [initialWins])

  const calculateAdIndices = useCallback((currentWins: Win[]) => {
    if (currentWins.length === 0) return new Set<number>()

    const indices = new Set<number>()
    const minAdSpacing = 6 // Minimum wins between ads
    const maxAdSpacing = 10 // Maximum wins between ads
    const adProbability = 0.15 // 15% chance of ad after each win (after minimum spacing)

    let lastAdIndex = -minAdSpacing // Start allowing ads from the beginning

    for (let i = 2; i < currentWins.length; i++) {
      // Start from index 2 (3rd item)
      const spacing = i - lastAdIndex

      if (spacing >= minAdSpacing) {
        // Calculate probability based on spacing
        const spacingFactor = Math.min(spacing / maxAdSpacing, 1)
        const adjustedProbability = adProbability * spacingFactor

        // The use of Math.random() is now safely encapsulated
        if (Math.random() < adjustedProbability) {
          indices.add(i)
          lastAdIndex = i
        }
      }
    }

    return indices
  }, []) // Empty dependency array means this function reference is stable

  // 3. useEffect to run the calculation ONLY after the component mounts
  // and whenever the 'wins' array updates (e.g., Load More).
  useEffect(() => {
    // This code block only runs client-side, avoiding the hydration mismatch.
    setAdIndices(calculateAdIndices(wins))
  }, [wins, calculateAdIndices])

  // Smooth scroll to load more section when new content is loaded
  const scrollToNewContent = useCallback(() => {
    if (loadMoreButtonRef.current) {
      const rect = loadMoreButtonRef.current.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const targetPosition = rect.top + scrollTop - window.innerHeight + 200 // Offset to show some new content

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth',
      })
    }
  }, [])

  const handleSortChange = useCallback(
    (newSort: 'recent' | 'celebrated' | 'hottest') => {
      if (newSort === sortBy) return // Prevent double click or unnecessary work

      // Reset pagination state immediately
      setWins([])
      setHasMore(true)

      lastCreatedAtRef.current = null
      lastIdRef.current = null
      setSortBy(newSort)
    },
    [sortBy] // Only depends on sortBy state
  )

  const loadWins = useCallback(
    async (isInitialLoad: boolean, sortModeOverride?: 'recent' | 'celebrated' | 'hottest') => {
      const currentSort = sortModeOverride || sortBy

      if (isInitialLoad) {
        setLoading(true)
        setWins([])
        setHasMore(true)
        setApiError(null)
      } else {
        setLoadingMore(true)
      }

      try {
        const fetchedData = await fetchExploreWins({
          sortBy: currentSort, // Use currentSort,
          limit: ITEMS_PER_LOAD,
          lastCreatedAt: isInitialLoad ? null : lastCreatedAtRef.current,
          lastId: isInitialLoad ? null : lastIdRef.current,
        })

        if (isInitialLoad) {
          setWins(fetchedData)
        } else {
          setWins((prevWins) => {
            const newUniqueWins = fetchedData.filter(
              (newWin) => !prevWins.some((existingWin) => existingWin.id === newWin.id)
            )
            return [...prevWins, ...newUniqueWins]
          })

          // Smooth scroll to show new content after a brief delay
          if (fetchedData.length > 0) {
            setTimeout(() => scrollToNewContent(), 300)
          }
        }

        if (fetchedData.length < ITEMS_PER_LOAD) {
          setHasMore(false)
        } else {
          const lastWin = fetchedData[fetchedData.length - 1]
          if (lastWin && lastWin.createdAt && lastWin.id) {
            lastCreatedAtRef.current = lastWin.createdAt
            lastIdRef.current = lastWin.id
          } else {
            setHasMore(false)
            console.warn(
              "Could not find 'createdAt' or 'id' for the last fetched win. Stopping pagination."
            )
          }
        }
      } catch (err) {
        console.error('Error loading wins:', err)
        let errorMessage = 'Failed to load wins.'
        if (err instanceof Error) {
          errorMessage = err.message
          // 2. Fallback check if it's a string (though less common in modern JS/TS)
        } else if (typeof err === 'string') {
          errorMessage = err
        }

        setApiError(errorMessage)
        setHasMore(false)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [sortBy, scrollToNewContent]
  )

  // Effect to load wins on sort change
  useEffect(() => {
    const hasDataForCurrentSort = wins.length > 0

    if (!hasDataForCurrentSort && (sortBy !== initialSortBy || wins.length === 0)) {
      loadWins(true)
    }
    return () => {}
  }, [sortBy, loadWins, wins.length])

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadWins(false)
    }
  }, [loadingMore, hasMore, loadWins])

  return (
    <div className=" flex-grow" style={{ scrollBehavior: 'smooth' }}>
      <SortHeader sortBy={sortBy} setSortBy={handleSortChange} />{' '}
      <div ref={topRef} className="absolute -top-10 min-h-screen" />
      {loading && wins.length === 0 ? (
        <div className=" text-center text-gray-500 py-20">
          <div className="animate-pulse">Loading wins...</div>
        </div>
      ) : wins.length === 0 && !hasMore ? (
        <div className="text-center py-20">No wins found for this category.</div>
      ) : (
        <div
          className="flex-grow mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-5 
                      px-4 md:px-6 lg:max-w-7xl lg:mx-auto items-start"
        >
          {wins.map((win, index) => {
            const elements: React.ReactNode[] = []

            // Always render the win card
            elements.push(
              <div key={win.id} className=" w-full flex h-full">
                <WinCard win={win} />
              </div>
            )

            // Insert an ad after this win if its index is in randomAdIndices
            if (adIndices.has(index)) {
              // <-- CHANGED from randomAdIndices.has(index)
              elements.push(
                <div key={`ad-${index}`} className="w-full h-full">
                  <AdUnit adSlot="5884450985" />
                </div>
              )
            }

            return <React.Fragment key={win.id}>{elements}</React.Fragment>
          })}
        </div>
      )}
      {apiError && <div className="text-center text-red-500 py-4 px-4">Error: {apiError}</div>}
      {/* Load More Button (The infinite scroll trigger) */}
      {hasMore && wins.length > 0 && !loading && (
        <div className="flex justify-center mt-8 mb-4">
          <button
            ref={loadMoreButtonRef}
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 bg-black text-white hover:bg-gray-800"
          >
            {loadingMore ? 'Loading More Wins...' : 'Load More Wins'}
          </button>
        </div>
      )}
      {/* End of Wins Message */}
      {!hasMore && !loading && wins.length > 0 && (
        <div className="text-center py-8">
          <div
            // Removed specific background/text colors
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
          >
            <div className="w-2 h-2 rounded-full" />
            <span>You've reached the end of the wins!</span>
            <div className="w-2 h-2 rounded-full" />
          </div>
        </div>
      )}
    </div>
  )
}
