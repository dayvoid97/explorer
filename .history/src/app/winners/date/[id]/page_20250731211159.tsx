'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'
import WinCard from '@/app/components/WinCard'
import AdUnit from '@/app/components/AdUnit'
import WinnersNavbar from '@/app/components/WinnersNavBar'

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

export default function WinnersByDatePage() {
  const { date } = useParams<{ date: string }>()
  const [wins, setWins] = useState<Win[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWinsByDate = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/gurkha/wins/date/${date}`)
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

    if (date) {
      fetchWinsByDate()
    }
  }, [date])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <WinnersNavbar />

      <h2 className="text-2xl font-bold text-center">
        Ws on {new Date(date).toLocaleDateString()}
      </h2>

      {loading ? (
        <div className="text-center text-gray-500 dark:text-gray-300">Loading wins...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : wins.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-300">
          No wins found for this date.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wins.map((win, index) => (
            <React.Fragment key={win.id}>
              <WinCard win={win} />
              {index === 2 && <AdUnit />}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}
