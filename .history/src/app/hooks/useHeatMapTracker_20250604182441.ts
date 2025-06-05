// hooks/useHeatmapTracker.ts
import { useRef, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export function useHeatmapTracker(commentId: string, token: string | null) {
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)
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
    if (hasTrackedHover.current) return
    hoverTimeout.current = setTimeout(() => {
      ;``
      track('hovers')
      hasTrackedHover.current = true
    }, 1000)
  }

  const onMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
  }

  const onClick = () => {
    if (hasTrackedClick.current) return
    track('clicks')
    hasTrackedClick.current = true
  }

  return { onMouseEnter, onMouseLeave, onClick }
}
