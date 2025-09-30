'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
// UPDATED IMPORTS: Use authFetch for API calls, and removeTokens/isLoggedIn for checks/redirect
import { authFetch } from '../lib/api' // Make sure this path is correct
import { removeTokens, isLoggedIn } from '../lib/auth' // isLoggedIn for initial check

export default function SearchAndAddCard() {
  const router = useRouter()
  const [titleInput, setTitleInput] = useState('')
  const [tickerInput, setTickerInput] = useState('')
  // const [countryInput, setCountryInput] = useState('') // This state is declared but not used
  const [actionStatus, setActionStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setActionStatus(`🚨 ${errMessage}`) // Display error
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  const handleSearchAndLaunch = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check if user is logged in before attempting authenticated fetch
    if (!isLoggedIn()) {
      handleAuthRedirect('Please log in to add a card.')
      return
    }

    if (!titleInput.trim()) {
      setActionStatus('⚠️ A title is required.')
      return
    }

    setLoading(true)
    setActionStatus(null) // Clear previous status

    const payload = {
      company: {
        companyName: titleInput.trim(),
        ticker: tickerInput.trim().toUpperCase(),
        searchTitle: titleInput.trim().toLowerCase(),
        searchTicker: tickerInput.trim().toLowerCase(),
      },
    }

    try {
      // CHANGED: Use authFetch for the authenticated call
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/companycard/launch`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }, // authFetch adds Authorization header
          body: JSON.stringify(payload),
        }
      )

      const data = await res.json()

      if (res.ok && data.card?.cardId) {
        setActionStatus('✅ Card launched successfully!')
        router.push(`/companycard/${data.card.cardId}`)
      } else {
        // Handles non-401/403 errors (e.g., backend validation errors, or specific messages)
        throw new Error(data.message || data.error || 'Could not launch card')
      }
    } catch (err: any) {
      console.error('Search and launch failed:', err)
      // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setActionStatus(`🚨 ${err.message || 'Server error'}`) // Set other non-auth related errors
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-screen-md mx-auto px-6 py-10">
      {' '}
      {/* Added padding for consistency */}
      <h2 className="text-center text-4xl font-extrabold tracking-tight mb-6 leading-snug  ">
        Search & Add a Card
      </h2>
      <form onSubmit={handleSearchAndLaunch}>
        <div className="space-y-8 text-center">
          <div className="rounded-2xl space-y-2   p-6 shadow-md border dark:border-gray-700">
            {' '}
            {/* Dark mode background/border/shadow */}
            <input
              type="text"
              placeholder="Type to add a card"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              // Dark mode styles for input
              className=" rounded-full border  px-6 py-3 text-center w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 "
              required
            />
            <br />
            <input
              type="text"
              placeholder="Add a ticker"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
              // Dark mode styles for input
              className="rounded-full border  px-6 py-3 text-center text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 "
            />
            <p className="italic text-sm text-gray-500 dark:text-gray-400">
              How to be an elite soccer player?
            </p>{' '}
            {/* Dark mode text */}
            <p className="italic text-sm text-gray-500 dark:text-gray-400">
              Strength in Consistency
            </p>{' '}
            {/* Dark mode text */}
            <div>
              <button
                type="submit"
                disabled={loading || !titleInput.trim()}
                className="hover:bg-blue-700 transition disabled:opacity-50 inline-flex items-center justify-center p-3 rounded-full bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:text-gray-200 dark:disabled:text-gray-500"
              >
                <ArrowRight className="w-6 h-6" /> {/* Adjusted icon size */}
              </button>
            </div>
          </div>
        </div>

        {actionStatus && (
          <p
            className={`text-center text-sm font-medium mt-4 ${
              actionStatus.startsWith('❌') || actionStatus.startsWith('🚨')
                ? 'text-red-600 dark:text-red-400'
                : 'text-green-600 dark:text-green-400'
            }`}
          >
            {actionStatus}
          </p>
        )}
      </form>
    </section>
  )
}
