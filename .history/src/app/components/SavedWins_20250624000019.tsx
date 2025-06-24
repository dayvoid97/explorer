'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
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
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAuthRedirect = (message = 'Session expired. Please log in again.') => {
    setError(message)
    removeTokens()
    router.push('/login')
  }

  useEffect(() => {
    const fetchSaved = async () => {
      setError(null)

      if (!isLoggedIn()) {
        handleAuthRedirect('You must be logged in to view saved wins.')
        return
      }

      try {
        const res = await authFetch(`${API_BASE_URL}/gurkha/wins/fetchSaves`, { method: 'GET' })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || data.error || `Fetch failed: ${res.status}`)
        }

        setWins(Array.isArray(data.savedWins) ? data.savedWins : data)
      } catch (err: any) {
        console.error('Saved wins fetch error:', err)
        const msg = err.message || 'Failed to load saved wins.'
        if (msg.includes('Authentication')) {
          handleAuthRedirect(msg)
        } else {
          setError(msg)
        }
        setWins([])
      }
    }

    fetchSaved()
  }, [router])

  const handleUnsave = async (id: string) => {
    try {
      setError(null)
      const res = await authFetch(`${API_BASE_URL}/gurkha/wins/unsave/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to remove saved win.')
      }
      setWins((prev) => prev.filter((w) => w.id !== id))
    } catch (err: any) {
      const msg = err.message || 'Error removing saved win.'
      if (msg.includes('Authentication')) {
        handleAuthRedirect(msg)
      } else {
        setError(msg)
      }
    }
  }

  if (error) {
    return (
      <p className="text-center text-red-500 dark:text-red-400 px-4 py-6">{`Error: ${error}`}</p>
    )
  }

  if (wins.length === 0) return null

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        🔖 Saved Wins
      </h2>

      <div className="max-w-4xl mx-auto">
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          emulateTouch
          showIndicators={wins.length > 1}
        >
          {wins.map((win) => (
            <div
              key={win.id}
              className="relative p-6 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Unsave button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleUnsave(win.id)
                }}
                className="absolute top-3 right-3 text-xs px-3 py-1 rounded-md text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-red-600 hover:text-white dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Remove
              </button>

              {/* Card content */}
              <div
                onClick={() => router.push(`/winners/wincard/${win.id}`)}
                className="cursor-pointer space-y-3"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {win.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Originally posted: {new Date(win.createdAt).toLocaleDateString()}
                </p>
                <p className="line-clamp-4 text-sm text-gray-700 dark:text-gray-300">
                  {win.paragraphs[0]}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Upvotes: {win.upvotes}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}
