'use client'

import React, { useEffect, useState } from 'react'
import WinCard from './WinCard'
import AdUnit from './AdUnit'
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

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

interface Props {
  date: string
}

export default function WinsByDateGrid({ date }: Props) {
  const [wins, setWins] = useState<Win[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWinsByDate = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${API_URL}/gurkha/wins/explore/bydate/${date}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch wins')
        }

        setWins(data)
      } catch (err: any) {
        setError(err.message || 'Unexpected error')
      } finally {
        setLoading(false)
      }
    }

    if (date) fetchWinsByDate()
  }, [date])

  if (loading) {
    return <div className="text-center text-gray-500 dark:text-gray-300">Loading wins...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (wins.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-300">
        No wins found for this date.
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {wins.map((win, index) => (
        <React.Fragment key={win.id}>
          <WinCard win={win} />
          {index === 2 && <AdUnit />}
        </React.Fragment>
      ))}
    </div>
  )
}
