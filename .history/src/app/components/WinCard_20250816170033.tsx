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

// Media icon component with EPIC animations
const MediaIcon = ({ type, className = '' }: { type: string; className?: string }) => {
  const baseClasses = `transition-all duration-500 ${className}`

  switch (type) {
    case 'video':
      return (
        <div className="relative flex items-center justify-center">
          <Play className={`${baseClasses} text-red-500 drop-shadow-lg`} fill="currentColor" />
          <div className="absolute -inset-3 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-full animate-pulse blur-lg" />
          <div className="absolute -inset-1 bg-red-500/40 rounded-full animate-ping" />
        </div>
      )
    case 'audio':
      return (
        <div className="relative flex items-center justify-center">
          <Music className={`${baseClasses} text-purple-500 drop-shadow-lg`} />
          <div className="absolute -inset-3 bg-gradient-to-r from-purple-500/30 to-violet-500/30 rounded-full animate-pulse blur-lg" />
          <div className="absolute -inset-1 bg-purple-500/40 rounded-full animate-ping" />
        </div>
      )
    case 'document':
      return (
        <div className="relative flex items-center justify-center">
          <FileText className={`${baseClasses} text-blue-500 drop-shadow-lg`} />
          <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full animate-pulse blur-lg" />
          <div className="absolute -inset-1 bg-blue-500/40 rounded-full animate-ping" />
        </div>
      )
    default:
      return (
        <div className="relative flex items-center justify-center">
          <ImageIcon className={`${baseClasses} text-green-500 drop-shadow-lg`} />
          <div className="absolute -inset-3 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full animate-pulse blur-lg" />
        </div>
      )
  }
}

// Reusable Action Button with LEGENDARY styling
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
      'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-lg',
    celebrate:
      'border-green-300 dark:border-green-600 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-800/30 dark:hover:to-emerald-800/30 hover:text-green-700 dark:hover:text-green-300 hover:border-green-400 dark:hover:border-green-500',
    save: 'border-blue-300 dark:border-blue-600 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/20 dark:to-sky-900/20 backdrop-blur-sm hover:from-blue-100 hover:to-sky-100 dark:hover:from-blue-800/30 dark:hover:to-sky-800/30 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-400 dark:hover:border-blue-500',
    comment:
      'border-gray-300 dark:border-gray-600 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/80 dark:to-slate-800/80 backdrop-blur-sm text-gray-600 dark:text-gray-400',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 rounded-2xl font-bold border-2 transition-all duration-300 transform hover:scale-105 active:scale-95 hover:-translate-y-1 ${variants[variant]} ${className}`}
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
      className="group relative w-full max-w-2xl mx-auto cursor-pointer border border-gray-200/50 dark:border-gray-700/50 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 overflow-hidden transform hover:-translate-y-2 hover:scale-[1.02] hover:rotate-[0.5deg]"
    >
      {/* Epic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700 -z-10" />

      <div className="relative z-10 p-8 space-y-6">
        {/* Header with enhanced styling */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
              <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              @{win.username}
            </span>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-700/80 backdrop-blur-sm px-4 py-2 rounded-2xl font-medium shadow-lg">
            {formattedDate}
          </span>
        </div>

        {/* Title with epic gradient */}
        <h3 className="text-3xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 dark:from-violet-400 dark:via-purple-400 dark:to-cyan-400 bg-clip-text text-transparent line-clamp-3 leading-tight tracking-tight">
          {win.title}
        </h3>

        {/* Content section */}
        <div className="flex gap-6 items-start">
          <div className="flex-1 min-w-0">
            <div className={state.expanded ? '' : 'line-clamp-6'}>
              {win.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-lg leading-relaxed whitespace-pre-line text-gray-700 dark:text-gray-300 font-medium"
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
                className="mt-4 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Read more
              </button>
            )}
          </div>

          {/* EPIC media preview */}
          {(imageSrc || primaryMediaType) && (
            <div className="group/media relative">
              <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800 flex items-center justify-center border-4 border-white dark:border-gray-600 shadow-2xl transform transition-all duration-300 group-hover/media:scale-110 group-hover/media:rotate-3 group-hover/media:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)]">
                {showImage && imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt="Win Preview"
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                ) : primaryMediaType ? (
                  <MediaIcon type={primaryMediaType} className="w-12 h-12" />
                ) : null}
              </div>

              {/* Epic media count indicator */}
              {win.mediaUrls && win.mediaUrls.length > 1 && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-black rounded-full w-8 h-8 flex items-center justify-center shadow-xl shadow-purple-500/50 animate-bounce">
                  {win.mediaUrls.length}
                </div>
              )}

              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/30 to-cyan-500/30 opacity-0 group-hover/media:opacity-100 blur-xl transition-all duration-300 -z-10" />
            </div>
          )}
        </div>

        {/* LEGENDARY footer */}
        <div className="flex gap-3 pt-4">
          <ActionButton
            icon={<PartyPopper className="w-5 h-5" />}
            label={<span className="font-bold text-lg">{state.upvotes}</span>}
            onClick={handleCelebrate}
            disabled={state.isUpvoting}
            title="Celebrate this win!"
            variant="celebrate"
            className={`px-6 py-3 text-base ${
              state.isUpvoting ? 'opacity-60 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
            }`}
          />

          {win.commentCount !== undefined && (
            <ActionButton
              icon={<MessageCircle className="w-5 h-5" />}
              label={<span className="font-bold text-lg">{win.commentCount}</span>}
              variant="comment"
              className="px-6 py-3 text-base shadow-lg"
            />
          )}

          <ActionButton
            icon={<Bookmark className="w-5 h-5" />}
            onClick={handleSave}
            title={state.saved ? 'Saved!' : 'Save win'}
            variant="save"
            className={`px-6 py-3 text-base shadow-lg hover:shadow-xl ${
              state.saved
                ? 'bg-gradient-to-r from-blue-400 to-blue-600 text-white border-blue-500 shadow-blue-500/50'
                : ''
            }`}
          />

          <ActionButton
            icon={<Repeat2 className="w-5 h-5" />}
            onClick={handleRepost}
            title="Repost win"
            variant="default"
            className="px-6 py-3 text-base shadow-lg hover:shadow-xl"
          />
        </div>

        {/* Error message with EPIC styling */}
        {state.error && (
          <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl shadow-lg">
            <p className="text-sm text-red-600 dark:text-red-400 font-bold">{state.error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
