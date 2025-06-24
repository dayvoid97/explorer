'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
// UPDATED IMPORTS: Use authFetch for API calls, and removeTokens/isLoggedIn for checks/redirect
import { authFetch } from '../lib/api' // Make sure this path is correct
import { removeTokens, isLoggedIn } from '../lib/auth' // isLoggedIn for initial check

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
  const router = useRouter()
  const [error, setError] = useState<string | null>(null) // State for API errors

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setError(errMessage) // Display error message
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  useEffect(() => {
    const fetchSaved = async () => {
      setError(null) // Clear previous errors

      // Check if user is logged in before attempting authenticated fetch
      if (!isLoggedIn()) {
        // If user is not logged in, but this component is rendered, we can redirect or show a message.
        // For 'Saved Wins', it implies authentication, so redirection is appropriate.
        handleAuthRedirect('You must be logged in to view saved wins.')
        return
      }

      try {
        // CHANGED: Use authFetch for this authenticated call
        const res = await authFetch(`${API_BASE_URL}/gurkha/wins/fetchSaves`, {
          method: 'GET',
        })

        const data = await res.json()
        if (!res.ok) {
          // Handles non-401/403 errors (e.g., 500 server error, or backend specific error)
          throw new Error(
            data.message || data.error || `Failed to load saved wins (Status: ${res.status})`
          )
        }

        if (Array.isArray(data.savedWins)) {
          // Assuming backend sends { savedWins: [...] }
          setWins(data.savedWins)
        } else if (Array.isArray(data)) {
          // Fallback if backend just sends array directly
          setWins(data)
        } else {
          console.error('Expected an array of saved wins, got:', data)
          setWins([])
          throw new Error('Unexpected data format for saved wins.')
        }
      } catch (err: any) {
        console.error('Error fetching saved wins:', err)
        // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
        if (
          err.message === 'Authentication required. Please log in again.' ||
          err.message.includes('No authentication token')
        ) {
          handleAuthRedirect(err.message)
        } else {
          setError(err.message || 'Failed to load saved wins.') // Set other non-auth related errors
        }
        setWins([]) // Ensure wins array is empty on error
      }
    }

    fetchSaved()
  }, [router]) // Add router to dependency array for handleAuthRedirect

  if (error) return <p className="p-4 text-red-500 dark:text-red-400">Error: {error}</p>
  if (wins.length === 0) return null // If no wins or still loading

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">🔖 Saved Wins</h2>

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
            className="group relative px-6 py-10 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow transition-all duration-300 hover:shadow-lg"
          >
            {/* Remove button */}
            <button
              onClick={async (e) => {
                e.stopPropagation() // Prevent carousel or card click
                setError(null) // Clear previous errors
                try {
                  // CHANGED: Use authFetch for this authenticated call
                  const res = await authFetch(`${API_BASE_URL}/gurkha/wins/unsave/${win.id}`, {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    }, // authFetch adds Authorization header
                  })
                  if (res.ok) {
                    setWins((prev) => prev.filter((w) => w.id !== win.id))
                  } else {
                    const data = await res.json()
                    throw new Error(data.message || data.error || 'Failed to remove saved win.')
                  }
                } catch (err: any) {
                  console.error('Error removing saved win:', err)
                  // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
                  if (
                    err.message === 'Authentication required. Please log in again.' ||
                    err.message.includes('No authentication token')
                  ) {
                    handleAuthRedirect(err.message)
                  } else {
                    setError(err.message || 'Error removing saved win.')
                  }
                }
              }}
              // Dark mode styles for button
              className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-md text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-red-600 dark:hover:bg-red-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Remove
            </button>

            {/* Clickable card */}
            <div
              onClick={() => router.push(`/winners/wincard/${win.id}`)}
              className="cursor-pointer space-y-2"
            >
              <h3 className="text-xl font-semibold line-clamp-2 text-gray-900 dark:text-white">
                {win.title}
              </h3>{' '}
              {/* Dark mode text */}
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {' '}
                {/* Dark mode text */}
                Originally posted: {new Date(win.createdAt).toLocaleDateString()}
              </p>
              <p className="line-clamp-4 text-sm text-gray-700 dark:text-gray-300">
                {win.paragraphs[0]}
              </p>{' '}
              {/* Dark mode text */}
              <p>Upvotes: {win.upvotes}</p>{' '}
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  )
}
