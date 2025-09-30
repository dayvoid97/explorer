'use client'
import React, { useMemo, useState } from 'react'
import {
  Bookmark,
  PartyPopper,
  MessageCircle,
  ExternalLink,
  Play,
  Share,
  MoreHorizontal,
} from 'lucide-react'
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

// Utility to format relative time
const getRelativeTime = (dateString: string): string => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  if (diffInMinutes < 1) return 'just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  if (diffInWeeks < 4) return `${diffInWeeks}w ago`
  if (diffInMonths < 12) return `${diffInMonths}mo ago`
  return `${diffInYears}y ago`
}

// Compact Action Button for horizontal layout
const ActionButton = ({
  icon,
  label,
  onClick,
  disabled = false,
  variant = 'default',
  isActive = false,
  title = '',
  compact = false,
}: {
  icon: React.ReactNode
  label?: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
  variant?: 'default' | 'celebrate' | 'save' | 'comment'
  isActive?: boolean
  title?: string
  compact?: boolean
}) => {
  const getVariantStyles = () => {
    if (disabled) return 'text-gray-400 hover:bg-gray-100 cursor-not-allowed'

    switch (variant) {
      case 'celebrate':
        return isActive
          ? 'text-orange-600 bg-orange-50'
          : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
      case 'save':
        return isActive
          ? 'text-blue-600 bg-blue-50'
          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      case 'comment':
        return 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      default:
        return 'text-gray-600 hover:bg-gray-50'
    }
  }

  if (compact) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${getVariantStyles()}`}
        title={title}
      >
        {icon}
        {label && <span className="text-xs">{label}</span>}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${getVariantStyles()}`}
      title={title}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  )
}

// Media component optimized for horizontal layout
const MediaThumbnail = ({
  src,
  mediaType,
  hasExternalLink,
  size = 'normal',
}: {
  src: string
  mediaType: 'video' | 'audio' | 'image'
  hasExternalLink?: boolean
  size?: 'normal' | 'large'
}) => {
  const sizeMap = {
    normal: 'w-16 h-16 sm:w-20 sm:h-20',
    large: 'w-32 h-24 sm:w-40 sm:h-28',
  }
  const sizeClasses = sizeMap

  return (
    <div
      className={`relative ${sizeClasses} flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600`}
    >
      {mediaType === 'audio' ? (
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={audioIcon.src}
            alt="Audio"
            className="w-6 h-6 sm:w-8 sm:h-8 object-contain opacity-70"
          />
        </div>
      ) : (
        <>
          <img src={src} alt="Preview" className="w-full h-full object-cover" />
          {mediaType === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                <Play className="w-3 h-3 sm:w-4 sm:h-4 text-gray-800 ml-0.5" />
              </div>
            </div>
          )}
          {hasExternalLink && (
            <div className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3 text-gray-600" />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function WinCard({ win }: WinProps) {
  const router = useRouter()
  const [state, setState] = useState({
    upvotes: win.upvotes ?? 0,
    expanded: false,
    saved: false,
    isUpvoting: false,
    error: null as string | null,
  })

  const isLong = useMemo(() => win.paragraphs.join('\n').length > 280, [win.paragraphs])
  const mediaType = useMemo(() => getMediaType(win.previewImageUrl ?? ''), [win.previewImageUrl])
  const relativeTime = useMemo(() => getRelativeTime(win.createdAt), [win.createdAt])

  const imageSrc: string | undefined = win.externalLink?.previewImage || win.previewImageUrl
  const truncatedText = useMemo(() => {
    const fullText = win.paragraphs.join('\n')
    return fullText.length > 280 ? fullText.substring(0, 280) + '...' : fullText
  }, [win.paragraphs])

  const goToDetail = () => {
    const slug = createSlug(win.title)
    router.push(`/winners/wincard/${win.id}/${slug}`)
  }

  const goToShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const slug = createSlug(win.title)
    const shareUrl = `${window.location.origin}/winners/wincard/${win.id}/${slug}`

    // Use first paragraph if available
    const shareText =
      win.paragraphs && win.paragraphs.length > 0 ? win.paragraphs[0] : 'Check out this win!'

    try {
      // 2. Try native share API
      if (navigator.share) {
        await navigator.share({
          title: win.title,
          text: shareText,
          url: shareUrl,
        })
      } else {
        // fallback: copy link to clipboard
        await navigator.clipboard.writeText(shareUrl)
        alert('Link copied to clipboard!')
      }
    } catch (err) {
      console.error('Share failed:', err)
    }
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
    <article
      onClick={goToDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && goToDetail()}
      className="mb-20"
    >
      {/* Main Content Area */}
      <div className="flex gap-3 sm:gap-4">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
              @{win.username}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">·</span>
            <span
              className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm"
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontWeight: 400,
                fontStyle: 'normal',
                letterSpacing: '-0.05rem',
              }}
            >
              {relativeTime}
            </span>
            <div className="ml-auto">
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h2
            className=" sm:text-lg  mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
            style={{
              fontFamily: "'Freight Big Pro', serif",
              fontWeight: 500,
              letterSpacing: '-0.1rem',
            }}
          >
            {win.title}
          </h2>

          {/* Text Content */}
          <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
            {state.expanded ? (
              win.paragraphs.map((p, i) => (
                <p key={i} className="whitespace-pre-line mb-2 last:mb-0">
                  {p}
                </p>
              ))
            ) : (
              <p className="whitespace-pre-line">{truncatedText}</p>
            )}

            {!state.expanded && isLong && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setState((s) => ({ ...s, expanded: true }))
                }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontWeight: 400,
                  fontStyle: 'normal',
                  letterSpacing: '-0.05rem',
                }}
              >
                Show more
              </button>
            )}
          </div>

          {/* Media */}
          {imageSrc && (
            <div className="mb-5">
              <MediaThumbnail
                src={imageSrc}
                mediaType={mediaType}
                hasExternalLink={!!win.externalLink}
                size="large"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-1">
            <ActionButton
              icon={<PartyPopper className="w-6 h-6" />}
              label={state.upvotes || '0'}
              onClick={handleCelebrate}
              disabled={state.isUpvoting}
              variant="celebrate"
              isActive={state.isUpvoting}
              title="Celebrate this win!"
              compact
            />

            {win.commentCount !== undefined && (
              <ActionButton
                icon={<MessageCircle className="w-6 h-6" />}
                label={win.commentCount}
                variant="comment"
                title="View comments"
                compact
              />
            )}

            <ActionButton
              icon={<Bookmark className="w-6 h-6" />}
              onClick={handleSave}
              variant="save"
              isActive={state.saved}
              title={state.saved ? 'Saved!' : 'Save win'}
              compact
            />
            <ActionButton
              icon={<Share className="w-6 h-6" />}
              onClick={goToShare}
              variant="save"
              isActive={state.saved}
              title={state.saved ? 'Saved!' : 'Save win'}
              compact
            />
          </div>

          {/* Error Message */}
          {state.error && (
            <div className="mt-2">
              <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg inline-block">
                {state.error}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
