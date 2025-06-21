'use client'

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
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
  previewImageUrl?: string
  commentCount?: number
}

const ITEMS_PER_LOAD = 20

export default function WinnersPage() {
  const [wins, setWins] = useState<Win[]>([])
  const [sortBy, setSortBy] = useState<'recent' | 'celebrated' | 'hottest'>('recent')
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const lastCreatedAtRef = useRef<string | null>(null)
  const lastIdRef = useRef<string | null>(null)

  const winsRef = useRef<Win[]>(wins)
  useEffect(() => {
    winsRef.current = wins
  }, [wins])

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

        console.log('Fetched wins:', fetchedData)

        const newUniqueWins = fetchedData.filter(
          (newWin) => !winsRef.current.some((existingWin) => existingWin.id === newWin.id)
        )

        if (isInitialLoad) {
          setWins(newUniqueWins)
        } else {
          setWins((prevWins) => {
            const combined = [...prevWins, ...newUniqueWins]
            const uniqueMap = new Map()
            for (const win of combined) uniqueMap.set(win.id, win)
            return Array.from(uniqueMap.values())
          })
        }

        if (fetchedData.length < ITEMS_PER_LOAD) {
          setHasMore(false)
        } else {
          const last = fetchedData[fetchedData.length - 1]
          if (last?.createdAt && last?.id) {
            lastCreatedAtRef.current = last.createdAt
            lastIdRef.current = last.id
          } else {
            setHasMore(false)
            console.warn('Missing createdAt or id for last win. Pagination halted.')
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
    [sortBy]
  )

  useEffect(() => {
    loadWins(true)
  }, [sortBy, loadWins])

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) loadWins(false)
  }

  const adIndices = useMemo(() => {
    const indices = new Set<number>()
    const adInterval = 6
    const startAdAfter = 3

    for (let i = startAdAfter; i < wins.length; i += adInterval) {
      indices.add(i)
    }
    return [...indices].sort((a, b) => a - b)
  }, [wins])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
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

      {/* Content */}
      {loading && wins.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-300">Loading wins...</div>
      ) : wins.length === 0 && !hasMore ? (
        <div className="text-center text-gray-500 dark:text-gray-300 mt-6 space-y-2">
          <p>No wins found for this category.</p>
          <button
            onClick={() => loadWins(true)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wins.map((win, index) => (
            <React.Fragment key={win.id}>
              {(() => {
                try {
                  return <WinCard win={win} />
                } catch (e) {
                  console.error('WinCard render error:', e, win)
                  return (
                    <div className="p-4 border border-red-300 text-sm text-red-500 rounded-lg">
                      Failed to load this win.
                    </div>
                  )
                }
              })()}
              {adIndices.includes(index) && <AdUnit />}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && wins.length > 0 && !loading && (
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

      {/* End Message */}
      {!hasMore && !loading && wins.length > 0 && (
        <p className="text-center text-gray-500 dark:text-gray-300 mt-8">
          You&apos;ve reached the end of the wins!
        </p>
      )}
    </div>
  )
}
