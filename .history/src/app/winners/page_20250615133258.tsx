// ✅ Finalized WinnersPage with Sorting and Load More
'use client'

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { fetchExploreWins } from '../lib/fetchWins'
import WinCard from '../components/WinCard'
import AdUnit from '../components/AdUnit'
import { ChevronUp } from 'lucide-react'

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
  previewImageUrl?: string
  commentCount?: number
}

const ITEMS_PER_LOAD = 20

export default function WinnersPage() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  const [wins, setWins] = useState<Win[]>([])
  const [sortBy, setSortBy] = useState<'recent' | 'celebrated' | 'hottest'>('recent')
  const [loading, setLoading] = useState(false) // True during initial fetch
  const [loadingMore, setLoadingMore] = useState(false) // True when 'Load More' is clicked
  const [hasMore, setHasMore] = useState(true)

  const lastCreatedAtRef = useRef<string | null>(null)
  const lastIdRef = useRef<string | null>(null)

  const winsRef = useRef<Win[]>(wins)
  useEffect(() => {
    winsRef.current = wins
  }, [wins])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const loadWins = useCallback(
    async (isInitialLoad: boolean) => {
      if (isInitialLoad) {
        setLoading(true) // Set initial loading
        setWins([])
        setHasMore(true)
        lastCreatedAtRef.current = null
        lastIdRef.current = null
      } else {
        setLoadingMore(true) // Set loading for 'Load More' button
      }

      try {
        const fetchedData = await fetchExploreWins({
          sortBy,
          limit: ITEMS_PER_LOAD,
          lastCreatedAt: isInitialLoad ? null : lastCreatedAtRef.current,
          lastId: isInitialLoad ? null : lastIdRef.current,
        })

        const newUniqueWins = fetchedData.filter(
          (newWin) => !winsRef.current.some((existingWin) => existingWin.id === newWin.id)
        )

        if (isInitialLoad) {
          setWins(newUniqueWins)
        } else {
          setWins((prevWins) => {
            const combinedWins = [...prevWins, ...newUniqueWins]
            const uniqueMap = new Map()
            for (const win of combinedWins) {
              uniqueMap.set(win.id, win)
            }
            return Array.from(uniqueMap.values())
          })
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
        setHasMore(false)
      } finally {
        setLoading(false) // Clear initial loading
        setLoadingMore(false) // Clear 'Load More' loading
      }
    },
    [sortBy]
  )

  useEffect(() => {
    loadWins(true)
  }, [sortBy, loadWins])

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadWins(false)
    }
  }

  const adIndices = useMemo(() => {
    const indices = new Set<number>()
    const adInterval = 6
    const startAdAfter = 3

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

      {/* Conditional Rendering for Loading/No Wins/Content */}
      {loading && wins.length === 0 ? ( // Show 'Loading...' only during initial fetch if no wins yet
        <div className="text-center text-gray-500 dark:text-gray-300">Loading wins...</div>
      ) : wins.length === 0 && !hasMore ? ( // Show 'No wins found' if no wins and no more data (finished loading and found nothing)
        <div className="text-center text-gray-500 dark:text-gray-300">
          No wins found for this category.
        </div>
      ) : (
        // Otherwise, render the grid of wins
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wins.map((win, index) => (
            <React.Fragment key={win.id}>
              <WinCard win={win} />
              {adIndices.includes(index) && <AdUnit />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Load More Button: Only appears if there is more data AND content is already displayed AND not currently loading more */}
      {hasMore && wins.length > 0 && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className={`px-8 py-3 rounded-lg font-semibold  transition ${
              loadingMore ? 'bg-black-400 cursor-not-allowed' : 'hover:bg-black-700 shadow-md'
            }`}
          >
            {loadingMore ? 'Loading More Wins...' : 'Load More Wins'}
          </button>
          {showScrollTop && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-lg hover:scale-105 transition-transform"
              aria-label="Scroll to top"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

      {/* End of Wins Message: Only appears if no more data AND content was loaded AND not currently loading anything */}
      {!hasMore && !loading && wins.length > 0 && (
        <p className="text-center text-gray-500 dark:text-gray-300 mt-8">
          You've reached the end of the wins!
        </p>
      )}
    </div>
  )
}
