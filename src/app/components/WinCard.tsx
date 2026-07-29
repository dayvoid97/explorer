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
import videoIcon from '../../../public/video.png'
import Image from 'next/image'
import { authFetch } from '../lib/api'
import { removeTokens } from '../lib/auth'
import { toggleCelebrate } from '../hooks/useCelebrateWins'
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
    isSaved?: boolean
    hasCelebrated?: boolean
    previewImageUrl?: string
    previewMimeType?: string
    commentCount?: number
    externalLink?: {
      url: string
      type: 'channel' | 'content'
      platform: 'youtube' | 'tiktok' | 'other'
      previewImage?: string | null
    }
  }
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
    if (disabled) return 'text-opacity-50 cursor-not-allowed opacity-50'

    // PROFESSIONAL MONOCHROME LIGHT-UP LOGIC
    // Instead of orange, we use high-contrast (White/Black) or subtle borders
    if (isActive) {
      return 'text-white bg-gray-700 shadow-sm' // The "Light Up" state
    }

    return 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' // The "Idle" state
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
  mimeType,
  hasExternalLink,
  size = 'normal',
}: {
  src: string
  mimeType: string | undefined
  hasExternalLink?: boolean
  size?: 'normal' | 'large'
}) => {
  const sizeMap = {
    normal: { height: 160, className: 'h-40' },
    large: { height: 288, className: 'h-64 sm:h-72' },
  }
  const { height, className: heightClass } = sizeMap[size]
  // 1. Determine the source to use
  let imageSource = src
  let mediaType: 'video' | 'audio' | 'image' = 'image'
  let isPlaceholder = false
  let imgAlt = 'Financial Gurkha is for the Winners'

  if (mimeType && mimeType.startsWith('video/')) {
    mediaType = 'video'
    imageSource = videoIcon.src
    isPlaceholder = true
    imgAlt = 'Error loading Media. Please open the card to display media.'
  } else if (mimeType && mimeType.startsWith('audio/')) {
    mediaType = 'audio'
    imageSource = audioIcon.src
    isPlaceholder = true
    imgAlt = 'Error loading Media. Please open the card to display media.'
  }

  const layoutClasses = `${heightClass} w-full`

  return (
    <div
      className={`relative ${layoutClasses} flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200`}
      style={{ minHeight: height }} // Ensure height is applied
    >
      <Image
        src={imageSource}
        alt={imgAlt}
        fill={!isPlaceholder}
        width={isPlaceholder ? 100 : undefined}
        height={isPlaceholder ? 100 : undefined}
        className={`w-full h-full ${isPlaceholder ? 'object-contain p-2' : 'object-cover'}`}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        priority={false}
      />

      {/* Play Icon Overlay: Show ONLY if it's a video (even if it's a placeholder) */}
      {mediaType === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
            <Play className="w-3 h-3 sm:w-4 sm:h-4" />
          </div>
        </div>
      )}

      {/* External Link Icon Overlay: Show if it's an external link */}
      {hasExternalLink && (
        <div className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
          <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3" />
        </div>
      )}
    </div>
  )
}

const WinCard: React.FC<WinProps> = ({ win }) => {
  const router = useRouter()
  const [state, setState] = useState({
    upvotes: win.upvotes ?? 0,
    expanded: false,
    saved: win.isSaved ?? false,
    isCelebrated: win.hasCelebrated ?? false,
    isSaving: false,
    isUpvoting: false,
    error: null as string | null,
  })

  const isLong = useMemo(() => win.paragraphs.join('\n').length > 280, [win.paragraphs])
  const previewMimeType = win.previewMimeType
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

  // WinCard Component Code (Refactored handleSave)

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (state.isSaving) return // Prevent double-clicking

    setState((s) => ({ ...s, isSaving: true, error: null })) // Start loading

    try {
      // 1. Use the new combined toggle route
      const res = await authFetch(`${API_BASE_URL}/gurkha/wins/toggle-save/${win.id}`, {
        method: 'POST', // Always POST for toggles
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()

      if (res.ok) {
        // 2. Use the 'isSaved' flag returned by the backend to update state
        // Backend returns: { success: true, action: 'SAVED'/'UNSAVED', isSaved: true/false }
        setState((s) => ({ ...s, saved: data.isSaved }))
      } else {
        throw new Error(
          data.message || data.error || `Failed to toggle save state (Status: ${res.status}).`
        )
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
    } finally {
      setState((s) => ({ ...s, isSaving: false })) // End loading
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

    // Determine the action based on current local state
    const action = state.isCelebrated ? 'unvote' : 'upvote'

    setState((s) => ({
      ...s,
      isUpvoting: true,
      error: null,
    }))

    try {
      // 1. Call the new high-scale toggle hook
      const result = await toggleCelebrate(win.id, action)

      let newUpvotes = state.upvotes
      let newIsCelebrated = state.isCelebrated

      // 2. Update state based on the result action
      if (result.action === 'VOTED') {
        newUpvotes += 1
        newIsCelebrated = true
      } else if (result.action === 'UNVOTED') {
        // Ensure count doesn't go below zero
        newUpvotes = Math.max(0, newUpvotes - 1)
        newIsCelebrated = false
      }
      // If result.action is ALREADY_VOTED/UNVOTED, the state matches the DB, so no change.

      setState((s) => ({
        ...s,
        upvotes: newUpvotes,
        isCelebrated: newIsCelebrated, // <-- Update the celebration status
      }))
    } catch (err: any) {
      console.error('WinCard celebrate error:', err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        // Use the error message returned from the backend (if any)
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
      className="relative bg-[#161616] rounded-2xl backdrop-blur-xl p-6 transition-all duration-500 hover:shadow-xl hover:scale-[1.02] flex flex-col h-full w-full"
    >
      {/* Main Content Area */}
      <div className="flex gap-3 sm:gap-1">
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            {/* Removed dark mode text colors */}

            <span
              className=" text-sm "
              style={{
                fontFamily: "'Roboto Mono', monospace",
                fontWeight: 400,
                color: '#d9d8d3',
                fontStyle: 'normal',
                letterSpacing: '-0.05em',
              }}
            >
              @{win.username}
            </span>
            <span className="text-gray-500 text-xs sm:text-sm">·</span>
            <span
              className="text-gray-500 text-xs sm:text-sm"
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
                // Removed dark mode hover color
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h3
            className=" text-[#eff0f2] text-xl font-bold line-clamp-2 transition-colors leading-tight"
            style={{
              fontFamily: "'Freight Big Pro', serif",
              fontWeight: 500,
              letterSpacing: '-0.05em',
            }}
          >
            {win.title}
          </h3>

          {/* Text Content */}
          {/* Removed dark mode text color */}
          <div className="text-sm sm:text-base leading-relaxed mb-3 text-[#d9d8d3]">
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
                className="mt-2 px-3 py-1 rounded-md bg-gray-800/50 hover:bg-blue-900/30 text-blue-400 hover:text-blue-300 border border-gray-700 hover:border-blue-500/50 transition-all duration-200 shadow-sm flex items-center gap-1"
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontWeight: 500, // Slightly heavier for emphasis
                  fontStyle: 'normal',
                  letterSpacing: '-0.02rem', // Adjusted slightly for readability
                  fontSize: '15px', // Keep it small but punchy
                }}
              >
                <span className="opacity-70">...</span> Read more
              </button>
            )}
          </div>

          {/* Media */}
          {imageSrc && (
            <div className="mb-5">
              <MediaThumbnail
                src={imageSrc}
                mimeType={previewMimeType} // 💡 Pass the mime type
                hasExternalLink={!!win.externalLink}
              />
            </div>
          )}

          {/* Actions */}
          <div
            className="flex items-center gap-1 sm:gap-1"
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 400,
              fontStyle: 'normal',
              letterSpacing: '-0.05rem',
            }}
          >
            <ActionButton
              icon={<PartyPopper />}
              label={state.upvotes} // The number lives here
              onClick={handleCelebrate}
              disabled={state.isUpvoting}
              variant="celebrate"
              isActive={state.isCelebrated} // This now triggers the light-up
              title={state.isCelebrated ? 'Remove celebration' : 'Celebrate this win!'}
              compact
            />
            {win.upvotes}

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
              disabled={state.isSaving}
              variant="save"
              isActive={state.saved || state.isSaving}
              title={state.saved ? 'Unsave win' : 'Save win'}
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
              {/* Removed all specific color/background classes */}
              <p className="text-xs px-2 py-1 rounded-lg inline-block">{state.error}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
export default React.memo(WinCard)
