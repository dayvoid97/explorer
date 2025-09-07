'use client'
import React, { useMemo, useState } from 'react'
import { Bookmark, PartyPopper, MessageCircle, ExternalLink, Play } from 'lucide-react'
import { useRouter } from 'next/navigation'
import audioIcon from '../../../public/audio.png'
import { authFetch } from '../lib/api'
import { removeTokens } from '../lib/auth'

import { celebrateWin } from '../hooks/useCelebrateWins'
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
    previewImageUrl?: string
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

// Enhanced Action Button with better styling
const ActionButton = ({
  icon,
  label,
  onClick,
  disabled = false,
  variant = 'default',
  isActive = false,
  title = '',
}: {
  icon: React.ReactNode
  label?: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
  variant?: 'default' | 'celebrate' | 'save' | 'comment'
  isActive?: boolean
  title?: string
}) => {
  const getVariantStyles = () => {
    if (disabled) return 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'

    switch (variant) {
      case 'celebrate':
        return isActive
          ? 'text-orange-600 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-300 shadow-sm'
          : 'text-gray-600 bg-white border-gray-200 hover:text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 hover:border-orange-300 hover:shadow-sm'
      case 'save':
        return isActive
          ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300 shadow-sm'
          : 'text-gray-600 bg-white border-gray-200 hover:text-blue-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 hover:shadow-sm'
      case 'comment':
        return 'text-gray-500 bg-gray-50 border-gray-200'
      default:
        return 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50'
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${getVariantStyles()}`}
      title={title}
    >
      {icon}
      {label && <span className="min-w-0">{label}</span>}
    </button>
  )
}

// Media component with consistent sizing
const MediaThumbnail = ({
  src,
  mediaType,
  hasExternalLink,
}: {
  src: string
  mediaType: 'video' | 'audio' | 'image'
  hasExternalLink?: boolean
}) => (
  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
    {mediaType === 'audio' ? (
      <div className="w-full h-full flex items-center justify-center">
        <img src={audioIcon.src} alt="Audio" className="w-8 h-8 object-contain opacity-70" />
      </div>
    ) : (
      <>
        <img src={src} alt="Preview" className="w-full h-full object-cover" />
        {mediaType === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
            <div className="w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-gray-800 ml-0.5" />
            </div>
          </div>
        )}
        {hasExternalLink && (
          <div className="absolute top-1 right-1 w-5 h-5 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
            <ExternalLink className="w-3 h-3 text-gray-600" />
          </div>
        )}
      </>
    )}
  </div>
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
    () =>
      new Date(win.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year:
          new Date(win.createdAt).getFullYear() !== new Date().getFullYear()
            ? 'numeric'
            : undefined,
      }),
    [win.createdAt]
  )

  const imageSrc: string | undefined = win.externalLink?.previewImage || win.previewImageUrl
  const truncatedText = useMemo(() => {
    const fullText = win.paragraphs.join('\n')
    return fullText.length > 200 ? fullText.substring(0, 200) + '...' : fullText
  }, [win.paragraphs])

  const goToDetail = () => {
    const slug = createSlug(win.title)
    router.push(`/winners/wincard/${win.id}/${slug}`)
  }

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Please log in again to perform action') => {
    setState((s) => ({ ...s, error: errMessage }))
    removeTokens()
    router.push('/login')
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setState((s) => ({ ...s, error: null }))

    try {
      const res = await authFetch(`${API_BASE_URL}/gurkha/wins/save/${win.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok || res.status === 409) {
        setState((s) => ({ ...s, saved: true }))
      } else {
        const data = await res.json()
        throw new Error(data.message || data.error || `Failed to save win (Status: ${res.status}).`)
      }
    } catch (err: any) {
      console.error('WinCard save error:', err)
      if (
        err.message === ' Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setState((s) => ({ ...s, error: err.message || 'Save failed.' }))
      }
    }
  }

  const handleRepost = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setState((s) => ({ ...s, error: null }))

    try {
      const res = await authFetch(`${API_BASE_URL}/gurkha/wins/repost/${win.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (res.ok || res.status === 409) {
        setState((s) => ({ ...s, saved: true }))
      } else {
        const data = await res.json()
        throw new Error(data.message || data.error || `Failed to save win (Status: ${res.status}).`)
      }
    } catch (err: any) {
      console.error('WinCard save error:', err)
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
    e.stopPropagation()
    if (state.isUpvoting) return
    setState((s) => ({ ...s, isUpvoting: true, error: null }))

    try {
      const count = await celebrateWin(win.id)
      setState((s) => ({ ...s, upvotes: count }))
    } catch (err: any) {
      console.error('WinCard celebrate error:', err)
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
      className="group relative w-full max-w-sm mx-auto cursor-pointer bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Card Content */}
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {win.username.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium">@{win.username}</span>
          </div>
          <span>{formattedDate}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
          {win.title}
        </h3>

        {/* Content Area */}
        <div className="flex gap-3">
          {/* Text Content */}
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {state.expanded ? (
                win.paragraphs.map((p, i) => (
                  <p key={i} className="whitespace-pre-line mb-2 last:mb-0">
                    {p}
                  </p>
                ))
              ) : (
                <p className="whitespace-pre-line">{truncatedText}</p>
              )}
            </div>

            {!state.expanded && isLong && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setState((s) => ({ ...s, expanded: true }))
                }}
                className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Show more
              </button>
            )}
          </div>

          {/* Media Thumbnail */}
          {imageSrc && (
            <MediaThumbnail
              src={imageSrc}
              mediaType={mediaType}
              hasExternalLink={!!win.externalLink}
            />
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 pb-4 flex items-center gap-2">
        <ActionButton
          icon={<PartyPopper className="w-4 h-4" />}
          label={state.upvotes || '0'}
          onClick={handleCelebrate}
          disabled={state.isUpvoting}
          variant="celebrate"
          isActive={state.isUpvoting}
          title="Celebrate this win!"
        />

        {win.commentCount !== undefined && (
          <ActionButton
            icon={<MessageCircle className="w-4 h-4" />}
            label={win.commentCount}
            variant="comment"
            title="View comments"
          />
        )}

        <ActionButton
          icon={<Bookmark className="w-4 h-4" />}
          onClick={handleSave}
          variant="save"
          isActive={state.saved}
          title={state.saved ? 'Saved!' : 'Save win'}
        />
      </div>

      {/* Error Message */}
      {state.error && (
        <div className="px-5 pb-3">
          <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">
            {state.error}
          </p>
        </div>
      )}

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800 rounded-2xl transition-colors duration-300 pointer-events-none" />
    </div>
  )
}
