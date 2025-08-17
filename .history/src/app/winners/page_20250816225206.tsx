'use client'

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { fetchExploreWins } from '../lib/fetchWins'
import WinCard from '../components/WinCard'
import AdUnit from '../components/AdUnit'
import { ChevronUp } from 'lucide-react'
import WinnersNavbar from '../components/WinnersNavBar'

const SORT_OPTIONS = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Most Celebrated', value: 'celebrated' },
  { label: 'Hottest', value: 'hottest' },
]

const SORT_LABELS: Record<'recent' | 'celebrated' | 'hottest', string> = {
  recent: 'LATEST DUBS IN THE CHAT.',
  celebrated: 'MOST CELEBRATED Ws IN THE CHAT',
  hottest: 'HOTTEST Ws IN THE CHAT',
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
const SCROLL_THRESHOLD = 300 // Distance from bottom to trigger auto-load

export default function WinnersPage() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [wins, setWins] = useState<Win[]>([])
  const [sortBy, setSortBy] = useState<'recent' | 'celebrated' | 'hottest'>('recent')
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [autoLoadTriggered, setAutoLoadTriggered] = useState(false)

  const lastCreatedAtRef = useRef<string | null>(null)
  const lastIdRef = useRef<string | null>(null)
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const autoLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Enhanced scroll handling with smooth behavior and infinite scroll
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const windowHeight = window.innerHeight
          const documentHeight = document.documentElement.scrollHeight

          setShowScrollTop(scrollY > 300)

          // Check if we're near the bottom for auto-loading
          const distanceFromBottom = documentHeight - (scrollY + windowHeight)

          if (
            distanceFromBottom < SCROLL_THRESHOLD &&
            hasMore &&
            !loading &&
            !loadingMore &&
            !autoLoadTriggered &&
            wins.length > 0
          ) {
            setAutoLoadTriggered(true)
            // Debounce auto-load to prevent multiple triggers
            if (autoLoadTimeoutRef.current) {
              clearTimeout(autoLoadTimeoutRef.current)
            }
            autoLoadTimeoutRef.current = setTimeout(() => {
              loadWins(false, true) // true indicates auto-load
            }, 100)
          }

          ticking = false
        })
        ticking = true
      }
    }

    // Enable smooth scrolling on the document
    document.documentElement.style.scrollBehavior = 'smooth'

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (autoLoadTimeoutRef.current) {
        clearTimeout(autoLoadTimeoutRef.current)
      }
      // Reset scroll behavior when component unmounts
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [hasMore, loading, loadingMore, autoLoadTriggered, wins.length])

  // Smooth scroll to top function
  const scrollToTop = useCallback(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [])

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

  const loadWins = useCallback(
    async (isInitialLoad: boolean, isAutoLoad: boolean = false) => {
      if (isInitialLoad) {
        setLoading(true)
        setWins([])
        setHasMore(true)
        setAutoLoadTriggered(false)
        lastCreatedAtRef.current = null
        lastIdRef.current = null
      } else {
        setLoadingMore(true)
      }

      try {
        const fetchedData = await fetchExploreWins({
          sortBy,
          limit: ITEMS_PER_LOAD,
          lastCreatedAt: isInitialLoad ? null : lastCreatedAtRef.current,
          lastId: isInitialLoad ? null : lastIdRef.current,
        })

        if (isInitialLoad) {
          setWins(fetchedData)
          // Smooth scroll to top when switching sort options
          if (topRef.current) {
            setTimeout(() => scrollToTop(), 100)
          }
        } else {
          setWins((prevWins) => {
            const newUniqueWins = fetchedData.filter(
              (newWin) => !prevWins.some((existingWin) => existingWin.id === newWin.id)
            )

            const combinedWins = [...prevWins, ...newUniqueWins]

            const uniqueMap = new Map()
            for (const win of combinedWins) {
              uniqueMap.set(win.id, win)
            }
            return Array.from(uniqueMap.values())
          })

          // Only scroll to new content if it's a manual load, not auto-load
          if (fetchedData.length > 0 && !isAutoLoad) {
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
        setHasMore(false)
      } finally {
        setLoading(false)
        setLoadingMore(false)
        // Reset auto-load trigger after a delay to allow for new triggers
        setTimeout(() => setAutoLoadTriggered(false), 1000)
      }
    },
    [sortBy, scrollToTop, scrollToNewContent]
  )

  useEffect(() => {
    loadWins(true)
  }, [sortBy, loadWins])

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadWins(false, false) // false indicates manual load
    }
  }, [loadingMore, hasMore, loadWins])

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
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8" style={{ scrollBehavior: 'smooth' }}>
      {/* Top reference point for smooth scrolling */}
      <div ref={topRef} className="absolute -top-10" />

      <WinnersNavbar />

      {/* Conditional Rendering for Loading/No Wins/Content */}
      {loading && wins.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-300 py-20">
          <div className="animate-pulse">Loading wins...</div>
        </div>
      ) : wins.length === 0 && !hasMore ? (
        <div className="text-center text-gray-500 dark:text-gray-300 py-20">
          No wins found for this category.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wins.map((win, index) => (
            <React.Fragment key={win.id}>
              <div className="transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
                <WinCard win={win} />
              </div>
              {adIndices.includes(index) && (
                <div className="transition-all duration-300 ease-in-out">
                  <AdUnit />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Auto-loading indicator */}
      {loadingMore && autoLoadTriggered && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading more wins automatically...</span>
          </div>
        </div>
      )}

      {/* Manual Load More Button */}
      {hasMore && wins.length > 0 && !loading && (
        <div className="flex flex-col items-center gap-4 mt-8">
          {/* Info text about auto-loading */}
          {!loadingMore && (
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Scroll down to auto-load more wins, or click below
            </p>
          )}

          <button
            ref={loadMoreButtonRef}
            onClick={handleLoadMore}
            disabled={loadingMore}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
              loadingMore
                ? 'bg-gray-400 cursor-not-allowed opacity-70'
                : 'bg-black text-white hover:bg-gray-800 shadow-md hover:shadow-lg dark:bg-white dark:text-black dark:hover:bg-gray-200'
            }`}
          >
            {loadingMore && !autoLoadTriggered ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Loading More Wins...
              </span>
            ) : (
              'Load More Wins'
            )}
          </button>
        </div>
      )}

      {/* Enhanced scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-lg hover:scale-110 transition-all duration-200 transform hover:shadow-xl backdrop-blur-sm"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* End of Wins Message */}
      {!hasMore && !loading && wins.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            <span>You've reached the end of the wins!</span>
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
          </div>
        </div>
      )}
    </div>
  )
}
