'use client'

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { fetchExploreWins } from '../lib/fetchWins'
import WinCard from '../components/WinCard'
// import AdUnit from '../components/AdUnit'
import { ChevronUp } from 'lucide-react'
import Navbar from '../components/NavBar'
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

export interface Win {
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
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const lastCreatedAtRef = useRef<string | null>(null)
  const lastIdRef = useRef<string | null>(null)
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null)
  const topRef = useRef<HTMLDivElement>(null)

  // Enhanced scroll handling with smooth behavior
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          setShowScrollTop(scrollY > 300)
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
      // Reset scroll behavior when component unmounts
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

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
    async (isInitialLoad: boolean) => {
      if (isInitialLoad) {
        setLoading(true)
        setWins([])
        setHasMore(true)
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

        console.log(fetchedData)

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
        setHasMore(false)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [sortBy, scrollToTop, scrollToNewContent]
  )

  useEffect(() => {
    loadWins(true)
  }, [sortBy, loadWins])

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      loadWins(false)
    }
  }, [loadingMore, hasMore, loadWins])

  // Random ad placement with multiple ad slots
  const randomAdIndices = useMemo(() => {
    if (wins.length === 0) return new Set<number>()

    const indices = new Set<number>()
    const minAdSpacing = 4 // Minimum wins between ads
    const maxAdSpacing = 8 // Maximum wins between ads
    const adProbability = 0.15 // 15% chance of ad after each win (after minimum spacing)

    let lastAdIndex = -minAdSpacing // Start allowing ads from the beginning

    for (let i = 2; i < wins.length; i++) {
      // Start from index 2 (3rd item)
      const spacing = i - lastAdIndex

      if (spacing >= minAdSpacing) {
        // Calculate probability based on spacing
        const spacingFactor = Math.min(spacing / maxAdSpacing, 1)
        const adjustedProbability = adProbability * spacingFactor

        if (Math.random() < adjustedProbability) {
          indices.add(i)
          lastAdIndex = i
        }
      }
    }

    return indices
  }, [wins])

  // Array of different ad slot IDs for variety
  const adSlots = [
    '1491551118', // Replace with your actual ad slot IDs
  ]

  return (
    <div style={{ scrollBehavior: 'smooth' }}>
      <Navbar />

      {/* Top reference point for smooth scrolling */}
      <div ref={topRef} className="absolute -top-10 min-h-screen  bg-[#3b3a3c]" />

      {loading && wins.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-300 py-20">
          <div className="animate-pulse">Loading wins...</div>
        </div>
      ) : wins.length === 0 && !hasMore ? (
        <div className="text-center text-gray-500 dark:text-gray-300 py-20">
          No wins found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wins.map((win, index) => (
            <React.Fragment key={win.id}>
              {/* Win Card */}
              <div className="min-h-screen  bg-[#3b3a3c] transition-all duration-300 ease-in-out transform hover:scale-[1.02]">
                <WinCard win={win} />
              </div>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Optional fallback button if auto-load fails */}
      {hasMore && wins.length > 0 && !loading && (
        <div className="flex justify-center mt-8">
          <button
            ref={loadMoreButtonRef}
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingMore ? 'Loading More Wins...' : 'Load More Wins'}
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
