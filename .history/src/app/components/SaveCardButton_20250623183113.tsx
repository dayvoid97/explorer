'use client'

import React, { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from './ui/Button'
import { useRouter } from 'next/navigation'
import { authFetch } from '@/app/lib/api'
import { isLoggedIn, removeTokens } from '@/app/lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface SaveCardButtonProps {
  cardId: string
  initialSavedStatus?: boolean
}

export default function SaveCardButton({
  cardId,
  initialSavedStatus = false,
}: SaveCardButtonProps) {
  const router = useRouter()
  const [isSaved, setIsSaved] = useState<boolean>(initialSavedStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // State for API errors

  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setError(errMessage)
    removeTokens()
    router.push('/login')
  }

  // Check saved status on mount if not provided initially
  useEffect(() => {
    if (initialSavedStatus !== undefined) {
      setIsSaved(initialSavedStatus)
      return
    }

    const fetchStatus = async () => {
      if (!isLoggedIn()) {
        setIsSaved(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        // You mentioned this endpoint exists: GET /gurkha/cards/saved
        // We need to fetch the user's saved cards and check if 'cardId' is in the list
        const res = await authFetch(`${API_BASE}/gurkha/cards/saved`)
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.message || data.error || 'Failed to fetch saved status.')
        }
        // Assuming data.cards is an array of saved card objects
        const userSavedCards = data.cards || []
        setIsSaved(userSavedCards.some((savedCard: any) => savedCard.cardId === cardId))
      } catch (err: any) {
        console.error('Error checking save status:', err)
        if (
          err.message === 'Authentication required. Please log in again.' ||
          err.message.includes('No authentication token')
        ) {
          setIsSaved(false)
          // handleAuthRedirect(err.message); // Consider if you want to force redirect here for this background check
        } else {
          setError('Could not check save status.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [cardId, initialSavedStatus, router])

  const handleToggleSave = async () => {
    if (!isLoggedIn()) {
      handleAuthRedirect('Log in to save cards.')
      return
    }
    setLoading(true)
    setError(null) // Clear previous error

    try {
      const endpoint = isSaved ? `/gurkha/cards/unsave/${cardId}` : `/gurkha/cards/save/${cardId}`
      // FIX: Ensure method is 'POST' for both save and unsave as per your backend
      const method = 'POST'

      const res = await authFetch(`${API_BASE}${endpoint}`, { method })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(
          errorData.message || errorData.error || `Failed to ${isSaved ? 'unsave' : 'save'} card.`
        )
      }

      setIsSaved((prev) => !prev) // Optimistic UI update on success
    } catch (err: any) {
      console.error(`Error toggling save status for card ${cardId}:`, err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setError(err.message || `Failed to ${isSaved ? 'unsave' : 'save'} card.`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleToggleSave}
      disabled={loading || !isLoggedIn()}
      variant={isSaved ? 'default' : 'outline'}
      className="flex items-center gap-2"
    >
      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
      {loading ? '...' : isSaved ? 'Saved' : 'Save Card'}
      {error && <span className="ml-2 text-red-500 text-xs">{error}</span>}
    </Button>
  )
}
