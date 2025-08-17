'use client'

import React, { useEffect, useState } from 'react'
import WinCard from '../components/WinCard'
import { fetchExploreWins } from '../lib/fetchWins'

const SORT_OPTIONS = [
  { label: 'Most Recent', value: 'recent' },
  { label: 'Most Celebrated', value: 'celebrated' },
  { label: 'Hottest', value: 'hottest' },
]

export default function Explore() {
  const [wins, setWins] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<'recent' | 'celebrated' | 'hottest'>('recent')
  const [loading, setLoading] = useState(false)
  const [lastCreatedAt, setLastCreatedAt] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  const SORT_LABELS: Record<'recent' | 'celebrated' | 'hottest', string> = {
    recent: 'These are the latest wins shared by the community.',
    celebrated: 'These wins received the most upvotes — the most celebrated moments!',
    hottest: 'These are the hottest wins based on views and votes combined.',
  }

  useEffect(() => {
    loadInitial()
  }, [sortBy])

  async function loadInitial() {
    setLoading(true)
    try {
      const data = await fetchExploreWins({ sortBy, limit: 20 })
      setWins(data)
      setLastCreatedAt(data[data.length - 1]?.createdAt || null)
      setHasMore(data.length === 20)
    } finally {
      setLoading(false)
    }
  }

  async function loadMore() {
    if (!hasMore || loading) return
    setLoading(true)
    try {
      const more = await fetchExploreWins({ sortBy, limit: 20, lastCreatedAt })
      setWins((prev) => [...prev, ...more])
      setLastCreatedAt(more[more.length - 1]?.createdAt || null)
      setHasMore(more.length === 20)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-6 py-12 space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-white">🏆 Explore Wins</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{SORT_LABELS[sortBy]}</p>

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

      <div className="gap-200 grid sm:grid-cols-2 md:grid-cols-3">
        {wins.map((win) => (
          <WinCard key={win.id} win={win} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="mt-6 inline-flex items-center px-4 py-2 border rounded text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  )
}
