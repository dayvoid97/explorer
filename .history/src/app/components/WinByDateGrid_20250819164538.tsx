import React, { useEffect, useState } from 'react'
import WinCard from '@/app/components/WinCard'
import AdUnit from '@/app/components/AdUnit'

// Types
interface Win {
  id: string
  username: string
  createdAt: string
  title: string
  paragraphs: string[]
  mediaUrls?: string[]
  mimeTypes?: string[]
  upvotes?: number
  previewImageUrl?: string
  commentCount?: number
}

interface WinsByDateGridProps {
  date: string
}

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Grid component that displays wins filtered by a specific date
 * Used in the /winners/date/[id]/page.tsx route
 */
export default function WinsByDateGrid({ date }: WinsByDateGridProps) {
  // State management
  const [wins, setWins] = useState<Win[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Ad slot configuration
  const adSlots = [
    '1234567890', // Replace with your actual ad slot IDs
    '2345678901',
    '3456789012',
    '4567890123',
  ]

  // Data fetching effect
  useEffect(() => {
    const fetchWinsByDate = async (): Promise<void> => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_BASE_URL}/gurkha/wins/explore/bydate/${date}`)

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || `Failed to fetch wins (${response.status})`)
        }

        setWins(Array.isArray(data) ? data : [])
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unexpected error occurred'
        setError(errorMessage)
        console.error('Error fetching wins by date:', err)
      } finally {
        setLoading(false)
      }
    }

    if (date && date !== 'Invalid Date') {
      fetchWinsByDate()
    } else {
      setLoading(false)
      setError('Invalid date provided')
    }
  }, [date])

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-300">Loading wins...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Error Loading Wins
        </h3>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Empty state
  if (wins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Wins Found</h3>
        <p className="text-gray-500 dark:text-gray-300 mb-4">
          No wins were found for this date. Check back later or try a different date.
        </p>
        <div className="text-sm text-gray-400">Date: {new Date(date).toLocaleDateString()}</div>
      </div>
    )
  }

  // Main render - Winners grid format
  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Found <span className="font-semibold text-gray-900 dark:text-white">{wins.length}</span>
          {wins.length === 1 ? ' win' : ' wins'} for this date
        </p>
      </div>

      {/* Wins grid - matches /winners format */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wins.map((win, index) => (
          <React.Fragment key={win.id}>
            <WinCard win={win} />
            {/* Insert ad unit after every 6th item with rotating ad slots */}
            {(index + 1) % 6 === 0 && (
              <div className="sm:col-span-2 lg:col-span-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-400 text-center mb-2">Advertisement</div>
                  <AdUnit
                    adSlot={adSlots[Math.floor(index / 6) % adSlots.length]}
                    className="w-full"
                    style={{
                      display: 'block',
                      width: '100%',
                      minHeight: '200px',
                      maxHeight: '300px',
                    }}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Load more placeholder (if pagination is needed later) */}
      {wins.length >= 20 && (
        <div className="text-center pt-8">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            That's all the wins for this date!
          </p>
        </div>
      )}
    </div>
  )
}
