'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Calendar, TrendingUp, ExternalLink, Trash2, Eye, Lock } from 'lucide-react'
import { authFetch } from '../lib/api'
import { removeTokens, isLoggedIn } from '../lib/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface SavedWin {
  id: string
  title: string
  paragraphs: string[]
  upvotes: number
  isPrivate: boolean
  createdAt: string
  savedAt: string
}

export default function SavedWins() {
  const [wins, setWins] = useState<SavedWin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'savedDate' | 'createdDate' | 'popularity'>('savedDate')
  const [visibleCount, setVisibleCount] = useState(6)
  const router = useRouter()

  // Sort wins based on selected criteria
  const sortedWins = useMemo(() => {
    const winsCopy = [...wins]
    switch (sortBy) {
      case 'savedDate':
        return winsCopy.sort(
          (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        )
      case 'createdDate':
        return winsCopy.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      case 'popularity':
        return winsCopy.sort((a, b) => b.upvotes - a.upvotes)
      default:
        return winsCopy
    }
  }, [wins, sortBy])

  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setError(errMessage)
    removeTokens()
    router.push('/login')
  }

  const handleRemoveSave = async (winId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setError(null)

    if (!window.confirm('Remove this win from your saved list?')) return

    try {
      const res = await authFetch(`${API_BASE_URL}/gurkha/wins/unsave/${winId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.ok) {
        setWins((prev) => prev.filter((w) => w.id !== winId))
      } else {
        const data = await res.json()
        throw new Error(data.message || data.error || 'Failed to remove saved win.')
      }
    } catch (err: any) {
      console.error('Error removing saved win:', err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setError(err.message || 'Error removing saved win.')
      }
    }
  }

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  useEffect(() => {
    const fetchSaved = async () => {
      setError(null)
      setLoading(true)

      if (!isLoggedIn()) {
        handleAuthRedirect('You must be logged in to view saved wins.')
        return
      }

      try {
        const res = await authFetch(`${API_BASE_URL}/gurkha/wins/fetchSaves`, {
          method: 'GET',
        })

        const data = await res.json()
        if (!res.ok) {
          throw new Error(
            data.message || data.error || `Failed to load saved wins (Status: ${res.status})`
          )
        }

        if (Array.isArray(data.savedWins)) {
          setWins(data.savedWins)
        } else if (Array.isArray(data)) {
          setWins(data)
        } else {
          console.error('Expected an array of saved wins, got:', data)
          setWins([])
          throw new Error('Unexpected data format for saved wins.')
        }
      } catch (err: any) {
        console.error('Error fetching saved wins:', err)
        if (
          err.message === 'Authentication required. Please log in again.' ||
          err.message.includes('No authentication token')
        ) {
          handleAuthRedirect(err.message)
        } else {
          setError(err.message || 'Failed to load saved wins.')
        }
        setWins([])
      } finally {
        setLoading(false)
      }
    }

    fetchSaved()
  }, [router])

  if (loading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading saved wins...</span>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="mb-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-400">Error: {error}</p>
        </div>
      </section>
    )
  }

  if (wins.length === 0) {
    return (
      <section className="mb-12">
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Saved Wins Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Start exploring and save wins that inspire you. They'll appear here for easy access
            later.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-12">
      {/* Header with sorting controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-red-500" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Wins</h2>
          <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm px-2 py-1 rounded-full">
            {wins.length}
          </span>
        </div>

        {/* Sorting Controls */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setSortBy('savedDate')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'savedDate'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
            Recently Saved
          </button>
          <button
            onClick={() => setSortBy('createdDate')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'createdDate'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Latest Posts
          </button>
          <button
            onClick={() => setSortBy('popularity')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'popularity'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Most Popular
          </button>
        </div>
      </div>

      {/* Grid of saved wins */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedWins.slice(0, visibleCount).map((win) => (
          <div
            key={win.id}
            className="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Card Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {win.isPrivate ? (
                    <>
                      <Lock className="w-3 h-3" />
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Public</span>
                    </>
                  )}
                </div>
                <button
                  onClick={(e) => handleRemoveSave(win.id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 leading-tight">
                {win.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                {truncateText(win.paragraphs[0] || 'No preview available')}
              </p>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    👍 <span className="font-medium">{win.upvotes}</span>
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {new Date(win.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <button
                  onClick={() => router.push(`/winners/wincard/${win.id}`)}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  <span className="text-xs font-medium">View</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Saved{' '}
                {new Date(win.savedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>

            {/* Clickable overlay */}
            <div
              onClick={() => router.push(`/winners/wincard/${win.id}`)}
              className="absolute inset-0 cursor-pointer"
            />
          </div>
        ))}
      </div>

      {/* Load More / Show Less Button */}
      {wins.length > 6 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setVisibleCount((prev) => (prev < wins.length ? wins.length : 6))}
            className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            {visibleCount < wins.length
              ? `Show All (${wins.length - visibleCount} more)`
              : 'Show Less'}
          </button>
        </div>
      )}
    </section>
  )
}
