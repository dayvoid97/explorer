'use client'

import React, { useState, useEffect } from 'react'
import { Bookmark } from 'lucide-react'
import { Button } from './ui/Button'
import { useRouter } from 'next/navigation'
import { authFetch } from '@/app/lib/api' // Adjust path
import { isLoggedIn, removeTokens } from '@/app/lib/auth' // Adjust path

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface SaveCardButtonProps {
  cardId: string
  // Optional: Pass initial saved status if available (e.g., from user's profile data)
  initialSavedStatus?: boolean
}

export default function SaveCardButton({
  cardId,
  initialSavedStatus = false,
}: SaveCardButtonProps) {
  const router = useRouter()
  const [isSaved, setIsSaved] = useState<boolean>(initialSavedStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setError(errMessage) // Display error on the button or nearby
    removeTokens()
    router.push('/login')
  }

  // Check saved status on mount if not provided initially
  useEffect(() => {
    if (initialSavedStatus !== undefined) {
      setIsSaved(initialSavedStatus)
      return
    }

    // If not explicitly set, fetch status for logged in users
    const fetchStatus = async () => {
      if (!isLoggedIn()) {
        setIsSaved(false) // If not logged in, it's definitely not saved
        return
      }
      setLoading(true)
      setError(null)
      try {
        // Assuming an endpoint to check if a single card is saved
        // You might need to implement this backend endpoint GET /gurkha/cards/is-saved/:cardId
        // For simplicity, we'll assume the /saved endpoint gives enough info, or the backend check is part of it.
        // If not, you might query the user's /profile or /cards/saved for this specific cardId
        // For now, let's assume `isSaved` is passed or this button exists where `savedCards` are available.
        // If not, you'd fetch the user's saved cards and check if cardId is in the list.
        // Or you could have a dedicated endpoint like:
        // const res = await authFetch(`${API_BASE}/gurkha/cards/is-saved/${cardId}`);
        // const data = await res.json();
        // setIsSaved(data.isSaved);
        // For now, we default to initialSavedStatus or assume parent checks.
      } catch (err: any) {
        console.error('Error checking save status:', err)
        if (
          err.message === 'Authentication required. Please log in again.' ||
          err.message.includes('No authentication token')
        ) {
          // Don't redirect here, just show as not saved and maybe a tooltip
          setIsSaved(false)
          // handleAuthRedirect(err.message); // If you want to force redirect on this background check
        } else {
          setError('Could not check save status.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
  }, [cardId, initialSavedStatus, router]) // Add router to dependencies

  const handleToggleSave = async () => {
    if (!isLoggedIn()) {
      handleAuthRedirect('Log in to save cards.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const endpoint = isSaved ? `/gurkha/cards/unsave/${cardId}` : `/gurkha/cards/save/${cardId}`
      const method = 'PUT'

      const res = await authFetch(`${API_BASE}${endpoint}`, { method })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(
          errorData.message || errorData.error || `Failed to ${isSaved ? 'unsave' : 'save'} card.`
        )
      }

      setIsSaved((prev) => !prev) // Optimistic UI update
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
      disabled={loading || !isLoggedIn()} // Disable if loading or not logged in
      variant={isSaved ? 'default' : 'outline'} // Change variant based on saved status
      className="flex items-center gap-2"
    >
      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />

      {error && <span className="ml-2 text-green-500 text-xs">{error}</span>}
    </Button>
  )
}
