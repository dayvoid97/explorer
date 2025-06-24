import { useEffect, useRef } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function useHeatmapTracker(commentId: string, token: string | null) {
  const hasTrackedHover = useRef(false)
  const hasTrackedClick = useRef(false)

  const track = async (event: 'clicks' | 'hovers') => {
    if (!token) return
    await fetch(`${API_URL}/gurkha/comment/track-engagement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ commentId, event }),
    })
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
