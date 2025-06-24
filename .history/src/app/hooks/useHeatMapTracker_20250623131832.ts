import { useEffect, useRef } from 'react'
// UPDATED IMPORT: Use authFetch for API calls
import { authFetch } from '@/app/lib/api' // Make sure this path is correct relative to this hook

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// REMOVED: 'token: string | null' parameter. authFetch handles it internally.
export function useHeatmapTracker(commentId: string) {
  const hasTrackedHover = useRef(false)
  const hasTrackedClick = useRef(false)

  const track = async (event: 'clicks' | 'hovers') => {
    // REMOVED: if (!token) return; - authFetch will handle if no token is available or if it's expired.
    try {
      // CHANGED: Use authFetch instead of fetch
      const res = await authFetch(`${API_URL}/gurkha/comment/track-engagement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // REMOVED: Authorization header here. authFetch adds it automatically.
        },
        body: JSON.stringify({ commentId, event }),
      })

      if (!res.ok) {
        const data = await res.json()
        // For tracking, we might not want to throw a hard error or redirect immediately,
        // but it's good to log more detail if it fails.
        // However, if authFetch threw an error for 'Authentication required', it's already re-thrown.
        throw new Error(
          data.message || data.error || `Failed to track engagement (Status: ${res.status})`
        )
      }
    } catch (error: any) {
      // Log the error. If authFetch threw an 'Authentication required' error,
      // the parent component (Comment.tsx) can catch and handle it if needed.
      // For a non-critical background task like tracking, it's often okay
      // to just log the error and not break the UI.
      // However, if the error is due to authFetch signalling a full re-login,
      // ensure the calling component (Comment.tsx) is equipped to catch it.
      console.error(
        `❌ Failed to track engagement (${event}) for comment ${commentId}:`,
        error.message
      )
      // You could optionally re-throw here if you want the calling component
      // to react more strongly to tracking failures, but typically for tracking
      // it's considered non-critical for user experience.
      // If `authFetch` returns `null` or throws 'Auth Required' the `Comment`
      // component (which calls this hook via props) should handle that.
    }
  }

  const onMouseEnter = () => {
    if (!hasTrackedHover.current) {
      track('hovers')
      hasTrackedHover.current = true
    }
  }

  const onClick = () => {
    if (!hasTrackedClick.current) {
      track('clicks')
      hasTrackedClick.current = true
    }
  }

  return { onMouseEnter, onClick }
}
