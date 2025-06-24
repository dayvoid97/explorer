'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch } from '@/app/lib/api'
import { removeTokens, isLoggedIn } from '@/app/lib/auth'
import { ArrowRight } from 'lucide-react'

interface Card {
  id: string // This maps to cardId from backend Firestore document
  companyName: string
  ticker: string
  content?: string
  savedAt: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function SavedCards() {
  const router = useRouter()
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setError(errMessage)
    removeTokens()
    router.push('/login')
  }

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true)
      setError('')

      if (!isLoggedIn()) {
        handleAuthRedirect('You must be logged in to view saved cards.')
        setLoading(false)
        return
      }

      try {
        const res = await authFetch(`${API_BASE}/gurkha/cards/saved`, {
          headers: {},
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(
            data.message || data.error || `Failed to load saved cards (Status: ${res.status})`
          )
        }
        setCards(data.cards || [])
      } catch (err: any) {
        console.error('Error fetching saved cards:', err)
        if (
          err.message === 'Authentication required. Please log in again.' ||
          err.message.includes('No authentication token')
        ) {
          handleAuthRedirect(err.message)
        } else {
          setError(err.message || 'Failed to load saved cards.')
        }
        setCards([])
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [router])

  // Function to handle navigation to the card detail page
  // CHANGED: Pass the entire 'card' object, or explicitly pass ticker and id.
  // We'll explicitly pass ticker and id to make it clear.
  const goToCardDetail = (ticker: string, cardId: string) => {
    // Construct the URL: /company/{ticker}_{cardId}
    router.push(`/company/${ticker}_${cardId}`)
  }

  if (loading)
    return (
      <p className="text-center p-4 text-gray-500 dark:text-gray-400">Loading saved cards...</p>
    )
  if (error) return <p className="text-center p-4 text-red-600 dark:text-red-400">Error: {error}</p>
  if (!cards.length)
    return <p className="text-center p-4 text-gray-500 dark:text-gray-400">No saved cards yet.</p>

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Saved Cards</h2>
      <ul className="space-y-4">
        {cards.map((card) => (
          <li
            key={card.id}
            // CHANGED: Pass card.ticker and card.id to goToCardDetail
            onClick={() => goToCardDetail(card.ticker, card.id)}
            className="group relative border border-gray-200 dark:border-gray-700 p-4 rounded-md bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  {card.companyName} ({card.ticker})
                </h3>
                {card.content && (
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{card.content}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Saved on {new Date(card.savedAt).toLocaleString()}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform group-hover:translate-x-1" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
