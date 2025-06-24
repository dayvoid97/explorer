'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // Import useRouter
// UPDATED IMPORTS: Use authFetch for API calls, getAccessToken and removeTokens for local checks/redirect
import { authFetch } from '../lib/api' // Make sure this path is correct
import { getAccessToken, removeTokens, isLoggedIn } from '../lib/auth' // Assuming isLoggedIn is needed for initial render
import { Button } from './ui/Button' // Assuming Button component handles its own dark/light mode

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function FollowButton({ targetUsername }: { targetUsername: string }) {
  const router = useRouter() // Initialize useRouter
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null) // To display auth errors locally

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    console.error('Auth error in FollowButton:', errMessage)
    setAuthError(errMessage) // Display error on the button or nearby
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  // Check initial follow status on mount
  useEffect(() => {
    const checkAuthAndFetchStatus = async () => {
      // Check if user appears logged in before attempting to fetch status
      // authFetch will internally handle if the token is truly missing or expired
      if (!isLoggedIn()) {
        setIsFollowing(false) // Assume not following if not logged in
        // No redirect here, just show "Log in to follow"
        return
      }

      setLoading(true)
      setAuthError(null) // Clear previous errors

      try {
        // CHANGED: Use authFetch for this authenticated call
        const res = await authFetch(
          `${API_BASE}/gurkha/users/follow-status?username=${targetUsername}`
        )
        const data = await res.json()

        if (!res.ok) {
          // This handles non-401/403 errors (e.g., 404 target user not found)
          throw new Error(
            data.message || data.error || `Failed to fetch follow status (Status: ${res.status})`
          )
        }
        setIsFollowing(data.isFollowing)
      } catch (err: any) {
        console.error('Failed to fetch follow status:', err)
        // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
        if (
          err.message === 'Authentication required. Please log in again.' ||
          err.message.includes('No authentication token')
        ) {
          handleAuthRedirect(err.message)
        } else {
          // For other non-auth errors, you might display them or handle differently
          setAuthError(err.message || 'Error checking follow status.')
        }
        setIsFollowing(false) // Assume not following on error
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndFetchStatus()
  }, [targetUsername, router]) // Depend on targetUsername and router

  const handleToggleFollow = async () => {
    // If not logged in or an auth error occurred, prevent action and redirect if not already.
    if (!isLoggedIn() || authError) {
      handleAuthRedirect() // This will handle the redirect
      return
    }
    setLoading(true)
    setAuthError(null) // Clear previous errors

    const endpoint = isFollowing ? '/gurkha/users/unfollow' : '/gurkha/users/follow'

    try {
      // CHANGED: Use authFetch for this authenticated call
      const res = await authFetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, // authFetch adds Authorization header
        body: JSON.stringify({ targetUsername }),
      })

      if (!res.ok) {
        const data = await res.json()
        // Backend might throw "THINK YOU TRIED FOLLOWING YOURSELF" as an error message
        throw new Error(data.message || data.error || 'Failed to toggle follow status.')
      }

      setIsFollowing((prev) => !prev) // Optimistic UI update
    } catch (err: any) {
      console.error('Follow/unfollow failed:', err)
      // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        // For other specific errors (like the "following yourself" error from backend)
        setAuthError(err.message || 'Failed to toggle follow status.')
      }
    } finally {
      setLoading(false)
    }
  }

  // Display specific auth error message if present
  if (authError) {
    return (
      <Button variant="outline" disabled className="text-red-500 border-red-500">
        {authError.includes('Authentication') ? 'Log in to follow' : authError}
      </Button>
    )
  }

  // Render button based on follow status and loading
  // Check isLoggedIn() here to show 'Log in to follow' initially if user is not logged in.
  if (!isLoggedIn()) {
    return (
      <Button variant="outline" disabled>
        Log in to follow
      </Button>
    )
  }

  if (isFollowing === null) {
    return (
      <Button variant="outline" disabled>
        Checking...
      </Button>
    )
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      onClick={handleToggleFollow}
      disabled={loading}
    >
      {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
