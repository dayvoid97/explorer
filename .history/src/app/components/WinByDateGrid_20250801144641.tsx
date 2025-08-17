'use client'

import React, { useEffect, useState } from 'react'
import WinCard from './WinCard'

// Types
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

interface WinsByDateGridProps {
  date: string
}

// Constants
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/**
 * Grid component that displays wins filtered by a specific date
 * Used in the /winners/[date]/page.tsx route
 */
export default function WinsByDateGrid({ date }: WinsByDateGridProps) {
  // State management
  const [wins, setWins] = useState<Win[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data fetching effect
  useEffect(() => {
    const fetchWinsByDate = async (): Promise<void> => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_BASE_URL}/gurkha/wins/explore/bydate/${date}`)

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch wins')
        }

        setWins(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unexpected error occurred'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    if (date) {
      fetchWinsByDate()
    }
  }, [date])

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center text-gray-500 dark:text-gray-300">Loading wins...</div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  // Empty state
  if (wins.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center text-gray-500 dark:text-gray-300">
          No wins found for this date.
        </div>
      </div>
    )
  }

  // Main render
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wins.map((win, index) => (
          <React.Fragment key={win.id}>
            <WinCard win={win} />
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
