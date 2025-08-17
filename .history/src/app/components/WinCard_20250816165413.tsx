'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Bookmark,
  PartyPopper,
  MessageCircle,
  Save,
  Repeat2,
  Play,
  Music,
  ImageIcon,
  FileText,
  Download,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { authFetch } from '../lib/api'
import { removeTokens } from '../lib/auth'
import { celebrateWin } from '../hooks/useCelebrateWins'

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

// Enhanced media type detection
const getMediaType = (url: string, mimeType?: string): 'video' | 'audio' | 'image' | 'document' => {
  if (!url) return 'image'

  if (mimeType) {
    if (mimeType.startsWith('video/')) return 'video'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.includes('pdf') || mimeType.includes('document')) return 'document'
  }

  if (url.match(/\.(mp4|webm|ogg|quicktime|avi|mov|wmv|flv|m4v)$/i)) return 'video'
  if (url.match(/\.(mp3|wav|aac|flac|m4a|wma|ogg)$/i)) return 'audio'
  if (url.match(/\.(pdf|doc|docx|txt|rtf)$/i)) return 'document'
  return 'image'
}

// Media icon component with cool animations
const MediaIcon = ({ type, className = '' }: { type: string; className?: string }) => {
  const baseClasses = `w-8 h-8 transition-all duration-300 ${className}`

  switch (type) {
    case 'video':
      return (
        <div className="relative">
          <Play className={`${baseClasses} text-red-500`} fill="currentColor" />
          <div className="absolute -inset-1 bg-red-500/20 rounded-full animate-pulse" />
        </div>
      )
    case 'audio':
      return (
        <div className="relative">
          <Music className={`${baseClasses} text-purple-500`} />
          <div className="absolute -inset-1 bg-purple-500/20 rounded-full animate-pulse" />
        </div>
      )
    case 'document':
      return (
        <div className="relative">
          <FileText className={`${baseClasses} text-blue-500`} />
          <div className="absolute -inset-1 bg-blue-500/20 rounded-full animate-pulse" />
        </div>
      )
    default:
      return <ImageIcon className={`${baseClasses} text-green-500`} />
  }
}

// Reusable Action Button with enhanced styling
const ActionButton = ({
  icon,
  label,
  onClick,
  disabled = false,
  className = '',
  title = '',
  variant = 'default',
}: {
  icon: React.ReactNode
  label?: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
  className?: string
  title?: string
  variant?: 'default' | 'celebrate' | 'save' | 'comment'
}) => {
  const variants = {
    default:
      'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700',
    celebrate:
      'border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400',
    save: 'border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400',
    comment:
      'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all duration-200 transform hover:scale-105 active:scale-95 ${variants[variant]} ${className}`}
      title={title}
    >
      {icon}
      {label}
    </button>
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

  const isLong = useMemo(() => win.paragraphs.join('\n').length > 200, [win.paragraphs])

  // Determine primary media type from all media
  const primaryMediaType = useMemo(() => {
    if (win.mediaUrls?.length) {
      return getMediaType(win.mediaUrls[0], win.mimeTypes?.[0])
    }
    if (win.previewImageUrl) {
      return getMediaType(win.previewImageUrl)
    }
    return null
  }, [win.mediaUrls, win.mimeTypes, win.previewImageUrl])

  const formattedDate = useMemo(
    () => new Date(win.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    [win.createdAt]
  )

  // Only show image for image types, icons for others
  const showImage = primaryMediaType === 'image'
  const imageSrc: string | undefined = showImage
    ? win.externalLink?.previewImage || win.previewImageUrl || win.mediaUrls?.[0]
    : undefined

  const goToDetail = () => router.push(`/winners/wincard/${win.id}`)

  const handleAuthRedirect = (
    errMessage: string = 'Authentication required. Please log in again.'
  ) => {
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
        throw new Error(
          data.message || data.error || `Failed to repost win (Status: ${res.status}).`
        )
      }
    } catch (err: any) {
      console.error('WinCard repost error:', err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setState((s) => ({ ...s, error: err.message || 'Repost failed.' }))
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
      className="group relative w-full max-w-md mx-auto sm:mx-0 cursor-pointer border border-gray-200 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 hover:scale-[1.02]"
    >
      {/* Gradient overlay for extra sexy effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-500/5 dark:to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 p-6 space-y-4">
        {/* Header with enhanced styling */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              @{win.username}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
            {formattedDate}
          </span>
        </div>

        {/* Title with gradient text */}
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent line-clamp-2 leading-tight">
          {win.title}
        </h3>

        {/* Content section */}
        <div className="flex gap-4 items-start">
          <div className="flex-1 min-w-0">
            <div className={state.expanded ? '' : 'line-clamp-4'}>
              {win.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed whitespace-pre-line text-gray-700 dark:text-gray-300"
                >
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
                className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
              >
                Read more
              </button>
            )}
          </div>

          {/* Enhanced media preview */}
          {(imageSrc || primaryMediaType) && (
            <div className="group/media relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center border-2 border-white dark:border-gray-600 shadow-lg transform transition-transform duration-200 group-hover/media:scale-110">
                {showImage && imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt="Win Preview"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                ) : primaryMediaType ? (
                  <MediaIcon type={primaryMediaType} className="w-8 h-8" />
                ) : null}
              </div>

              {/* Media count indicator */}
              {win.mediaUrls && win.mediaUrls.length > 1 && (
                <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {win.mediaUrls.length}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced footer with glassmorphism effect */}
        <div className="flex gap-2 pt-2 -mx-2">
          <ActionButton
            icon={<PartyPopper className="w-4 h-4" />}
            label={state.upvotes}
            onClick={handleCelebrate}
            disabled={state.isUpvoting}
            title="Celebrate this win!"
            variant="celebrate"
            className={state.isUpvoting ? 'opacity-60 cursor-not-allowed' : ''}
          />

          {win.commentCount !== undefined && (
            <ActionButton
              icon={<MessageCircle className="w-4 h-4" />}
              label={win.commentCount}
              variant="comment"
            />
          )}

          <ActionButton
            icon={<Bookmark className="w-4 h-4" />}
            onClick={handleSave}
            title={state.saved ? 'Saved!' : 'Save win'}
            variant="save"
            className={
              state.saved
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600'
                : ''
            }
          />

          <ActionButton
            icon={<Repeat2 className="w-4 h-4" />}
            onClick={handleRepost}
            title="Repost win"
            variant="default"
          />
        </div>

        {/* Error message with better styling */}
        {state.error && (
          <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
