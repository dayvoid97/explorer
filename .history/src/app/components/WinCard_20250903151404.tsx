'use client'

import React, { useMemo, useState } from 'react' // Added useEffect for potential auth redirect
import { Bookmark, PartyPopper, MessageCircle, Save, Repeat2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import audioIcon from '../../../public/audio.png'
// UPDATED IMPORTS: Use authFetch for API calls, and removeTokens (plural) for logout
import { authFetch } from '../lib/api' // Assuming lib/api.ts is in this relative path
import { removeTokens } from '../lib/auth' // Assuming lib/auth.ts is in this relative path

// IMPORTANT: Your 'celebrateWin' hook/function also needs to be updated internally
// to use 'authFetch' for its API calls, otherwise it will still break on token expiry.
import { celebrateWin } from '../hooks/useCelebrateWins' // This hook needs to be updated separately
import { createSlug } from '../lib/utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface WinProps {
  win: {
    id: string
    username: string
    createdAt: string
    title: string
    paragraphs: string[]
    mediaUrls?: string[]
    mimeTypes?: string[]
    upvotes?: number
    previewImageUrl?: string // this can still be computed upstream for convenience
    commentCount?: number
    externalLink?: {
      url: string
      type: 'channel' | 'content'
      platform: 'youtube' | 'tiktok' | 'other'
      previewImage?: string | null
    }
  }
}

// Utility to detect media type
const getMediaType = (url: string): 'video' | 'audio' | 'image' => {
  if (!url) return 'image'
  if (url.match(/\.(mp4|webm|ogg|quicktime)$/i)) return 'video'
  if (url.match(/\.(mp3|wav)$/i)) return 'audio'
  return 'image'
}

// Reusable Action Button (no changes needed here)
const ActionButton = ({
  icon,
  label,
  onClick,
  disabled = false,
  className = '',
  title = '',
}: {
  icon: React.ReactNode
  label?: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
  className?: string
  title?: string
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border transition ${className}`}
    title={title}
  >
    {icon}
    {label}
  </button>
)

export default function WinCard({ win }: WinProps) {
  const router = useRouter()
  const [state, setState] = useState({
    upvotes: win.upvotes ?? 0,
    expanded: false,
    saved: false,
    isUpvoting: false,
    error: null as string | null,
  })

  const isLong = useMemo(() => win.paragraphs.join('\n').length > 200, [win.paragraphs])
  const mediaType = useMemo(() => getMediaType(win.previewImageUrl ?? ''), [win.previewImageUrl])
  const formattedDate = useMemo(
    () => new Date(win.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    [win.createdAt]
  )

  const imageSrc: string | undefined = win.externalLink?.previewImage || win.previewImageUrl

  const goToDetail = () => {
    const slug = createSlug(win.title)
    router.push(`/winners/wincard/${win.id}/${slug}`)
  }

  // Helper for consistent auth redirection
  const handleAuthRedirect = (
    errMessage: string = 'Authentication required. Please log in again.'
  ) => {
    setState((s) => ({ ...s, error: errMessage })) // Display error on card
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click event from firing
    setState((s) => ({ ...s, error: null })) // Clear previous errors

    try {
      // CHANGED: Use authFetch for this authenticated call
      const res = await authFetch(`${API_BASE_URL}/gurkha/wins/save/${win.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok || res.status === 409) {
        // 409 Conflict might mean already saved
        setState((s) => ({ ...s, saved: true }))
      } else {
        const data = await res.json()
        throw new Error(data.message || data.error || `Failed to save win (Status: ${res.status}).`)
      }
    } catch (err: any) {
      console.error('WinCard save error:', err)
      // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setState((s) => ({ ...s, error: err.message || 'Save failed.' }))
      }
    }
  }

  const handleRepost = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click event from firing
    setState((s) => ({ ...s, error: null })) // Clear previous errors

    try {
      // CHANGED: Use authFetch for this authenticated call
      const res = await authFetch(`${API_BASE_URL}/gurkha/wins/repost/${win.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok || res.status === 409) {
        // 409 Conflict might mean already saved
        setState((s) => ({ ...s, saved: true }))
      } else {
        const data = await res.json()
        throw new Error(data.message || data.error || `Failed to save win (Status: ${res.status}).`)
      }
    } catch (err: any) {
      console.error('WinCard save error:', err)
      // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setState((s) => ({ ...s, error: err.message || 'Save failed.' }))
      }
    }
  }

  const handleCelebrate = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click event from firing
    if (state.isUpvoting) return // Prevent double clicks
    setState((s) => ({ ...s, isUpvoting: true, error: null })) // Clear previous errors

    try {
      // IMPORTANT: 'celebrateWin' hook/function needs to be updated internally to use 'authFetch'
      // It should also propagate errors (including specific auth errors) for consistent handling.
      const count = await celebrateWin(win.id) // Assuming celebrateWin now uses authFetch internally and handles tokens
      setState((s) => ({ ...s, upvotes: count }))
    } catch (err: any) {
      console.error('WinCard celebrate error:', err)
      // Catch errors that celebrateWin might throw (e.g., from authFetch failing)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setState((s) => ({ ...s, error: err.message || 'Celebrate failed.' }))
      }
    } finally {
      setState((s) => ({ ...s, isUpvoting: false }))
    }
  }

  return (
    <div
      onClick={goToDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && goToDetail()}
      className="relative w-full max-w-md mx-auto sm:mx-0 cursor-pointer border dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 space-y-4 p-5"
    >
      {/* Header */}
      <div className="text-muted-foreground flex justify-between text-sm">
        <span>@{win.username}</span>
        <span>{formattedDate}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">{win.title}</h3>

      {/* Text + Media Content */}
      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0">
          <div className={state.expanded ? '' : 'line-clamp-5'}>
            {win.paragraphs.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>
          {!state.expanded && isLong && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setState((s) => ({ ...s, expanded: true }))
              }}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Read more
            </button>
          )}
        </div>

        {/* Media */}
        {/* 🖼️ Thumbnail (from external link or uploaded media) */}
        {imageSrc && (
          <div className="w-24 sm:w-28 md:w-32 h-24 md:h-28 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {mediaType === 'audio' || mediaType === 'video' ? (
              <Image
                src={audioIcon}
                alt="Media Placeholder"
                width={48}
                height={48}
                className="object-contain"
              />
            ) : (
              <Image
                src={imageSrc}
                alt="Win Preview"
                width={128}
                height={128}
                className="object-cover rounded"
              />
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-4 pt-3">
        <ActionButton
          icon={<PartyPopper className="w-4 h-4" />}
          label={state.upvotes}
          onClick={handleCelebrate}
          disabled={state.isUpvoting}
          title="Celebrate this win!"
          className={
            state.isUpvoting
              ? 'text-blue-400 border-blue-200 bg-blue-50 cursor-not-allowed opacity-60'
              : ' border-blue-300  hover:bg-green-50 hover:text-green-600'
          }
        />

        {win.commentCount !== undefined && (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
            <MessageCircle className="w-4 h-4" />
            {win.commentCount}
          </div>
        )}

        <ActionButton
          icon={<Bookmark className="w-4 h-4" />}
          onClick={handleSave}
          title={state.saved ? 'Saved!' : 'Save win'}
          className={
            state.saved
              ? 'text-green-600 bg-green-50 border-green-400'
              : ' hover:text-blue-600  hover:bg-blue-50 '
          }
        />
      </div>

      {state.error && (
        <p className="mt-2 text-xs text-red-500 dark:text-red-400 italic">{state.error}</p>
      )}
    </div>
  )
}
