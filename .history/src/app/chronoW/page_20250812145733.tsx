'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, LogIn } from 'lucide-react'
import ChronologyCard from '../components/ChronologyCard'
import { authFetch } from '../lib/api'
import { getAccessToken } from '../lib/auth'

interface Chronology {
  id: string
  name: string
  description: string
  createdAt: number
  createdBy: string
  categories: string[]
  hitCount: number
  likeCount: number
  saveCount: number
  shareCount: number
  repostCount: number
  stats?: {
    winsCount: number
    totalUpvotes: number
    totalViews: number
    totalCelebrations: number
    totalComments: number
    lastWinAt: number
  }
  creator?: {
    display: string
    pfp: string | null
  }
  previewMedia?: string[] // Array of media URLs for preview
  // User interaction status (only present if user is authenticated)
  likedByUser?: boolean
  savedByUser?: boolean
  repostedByUser?: boolean
}

export default function ChronoWExplorer() {
  const [chronologies, setChronologies] = useState<Chronology[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false)

  useEffect(() => {
    const fetchChronologies = async () => {
      try {
        setLoading(true)
        setError(null)

        // Check if user is authenticated
        const accessToken = getAccessToken()
        const userIsAuthenticated = !!accessToken
        setIsAuthenticated(userIsAuthenticated)

        let res: Response

        if (userIsAuthenticated) {
          // Use authFetch for authenticated users to get interaction status
          try {
            res = await authFetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/explore?hydrate=1`
            )
          } catch (authError) {
            console.log('Auth failed, falling back to unauthenticated request:', authError)
            setIsAuthenticated(false)
            res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/explore?hydrate=1`
            )
          }
        } else {
          // Regular fetch for unauthenticated users
          res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/explore?hydrate=1`
          )
        }

        if (!res.ok) {
          throw new Error('Failed to load chronologies')
        }

        const data = await res.json()

        // Log data to see its structure
        console.log('Fetched chronologies:', data)

        // Setting chronologies with the hydrated data
        setChronologies(data.chronologies || [])
      } catch (err) {
        console.error('Error fetching chronologies:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchChronologies()
  }, [])

  // Handle interaction attempts from non-authenticated users
  const handleUnauthenticatedInteraction = () => {
    setShowLoginPrompt(true)
    setTimeout(() => setShowLoginPrompt(false), 5000) // Hide after 5 seconds
  }

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl mb-5">ChronoDubs by Financial Gurkha</h1>
        <div className="flex items-center justify-center py-20">
          <div className="text-neutral-400">Loading chronologies...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl mb-5">ChronoloWgy by Financial Gurkha</h1>
        <div className="flex items-center justify-center py-20">
          <div className="text-red-400">Error: {error}</div>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl">ChronoloWgy by Financial Gurkha</h1>

        {!isAuthenticated && (
          <Link
            href="/profile"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <User className="w-4 h-4" />
            Sign In
          </Link>
        )}
      </div>

      {/* Login prompt banner */}
      {showLoginPrompt && (
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogIn className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-blue-200 font-medium">Sign in to interact with chronologies</p>
              <p className="text-blue-300/70 text-sm">
                Like, save, and repost your favorite content
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}

      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-neutral-800/50 border border-neutral-700 rounded-lg">
          <p className="text-neutral-300 text-sm">
            <span className="text-neutral-200 font-medium">Not signed in?</span> You can still
            browse chronologies, but you'll need to{' '}
            <Link href="/profile" className="text-blue-400 hover:text-blue-300 underline">
              sign in
            </Link>{' '}
            to like, save, and interact with content.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {chronologies
          .filter((c) => c.id) // Ensure that the chronology has an ID
          .map((c) => (
            <ChronologyCard
              key={c.id}
              {...c}
              // Pass the user interaction status to the component
              likedByUser={c.likedByUser || false}
              savedByUser={c.savedByUser || false}
              repostedByUser={c.repostedByUser || false}
              // Pass callback for unauthenticated interaction attempts
              onUnauthenticatedInteraction={
                isAuthenticated ? undefined : handleUnauthenticatedInteraction
              }
            />
          ))}
      </div>

      {chronologies.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-neutral-400">No chronologies found</div>
        </div>
      )}
    </section>
  )
}
