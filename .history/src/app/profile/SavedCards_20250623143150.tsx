'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // Import useRouter
// UPDATED IMPORTS: Use authFetch for API calls, and removeTokens/isLoggedIn for checks/redirect
import { authFetch } from '@/app/lib/api' // Make sure this path is correct
import { removeTokens, isLoggedIn } from '@/app/lib/auth' // isLoggedIn for initial check

interface Card {
  id: string
  companyName: string
  ticker: string
  content: string
  savedAt: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function SavedCards() {
  const router = useRouter() // Initialize useRouter
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setError(errMessage) // Display error
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true) // Ensure loading is true before fetch
      setError('') // Clear previous errors

      // Check if user is logged in before attempting authenticated fetch
      if (!isLoggedIn()) {
        handleAuthRedirect('You must be logged in to view saved cards.')
        setLoading(false) // Stop loading state
        return
      }

      try {
        // CHANGED: Use authFetch for the authenticated call
        const res = await authFetch(`${API_BASE}/gurkha/cards/saved`, {
          headers: {
            /* authFetch adds Authorization header */
          },
        })
        const data = await res.json()
        if (!res.ok) {
          // Handles non-401/403 errors (e.g., 500 server error, or backend specific error)
          throw new Error(
            data.message || data.error || `Failed to load saved cards (Status: ${res.status})`
          )
        }
        // Assuming data.cards is the array, as per your usage `setCards(data.cards)`
        // If the backend directly returns the array, use `setCards(data)`
        setCards(data.cards || data)
      } catch (err: any) {
        console.error('Error fetching saved cards:', err)
        // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
        if (
          err.message === 'Authentication required. Please log in again.' ||
          err.message.includes('No authentication token')
        ) {
          handleAuthRedirect(err.message)
        } else {
          setError(err.message || 'Failed to load saved cards.') // Set other non-auth related errors
        }
        setCards([]) // Ensure cards array is empty on error
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [router]) // Add router to dependency array for handleAuthRedirect

  if (loading)
    return (
      <p className="text-center p-4 text-gray-500 dark:text-gray-400">Loading saved cards...</p>
    )
  if (error) return <p className="text-center p-4 text-red-600 dark:text-red-400">Error: {error}</p>
  if (!cards.length)
    return <p className="text-center p-4 text-gray-500 dark:text-gray-400">No saved cards yet.</p>

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Saved Cards</h2>{' '}
      {/* Dark mode text */}
      <ul className="space-y-4">
        {cards.map((card) => (
          <li
            key={card.id}
            className="border border-gray-200 dark:border-gray-700 p-4 rounded-md bg-white dark:bg-gray-800 shadow-sm"
          >
            {' '}
            {/* Dark mode styles */}
            <h3 className="font-bold text-gray-900 dark:text-white">
              {' '}
              {/* Dark mode text */}
              {card.companyName} ({card.ticker})
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{card.content}</p>{' '}
            {/* Dark mode text */}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {' '}
              {/* Dark mode text */}
              Saved on {new Date(card.savedAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
