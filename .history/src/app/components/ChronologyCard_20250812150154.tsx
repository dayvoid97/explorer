'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import { Heart, Repeat2, Share, Eye, Bookmark } from 'lucide-react'
import { authFetch } from '../lib/api'
import { getAccessToken } from '../lib/auth'

const placeholderPfp = '/audio.png'

export type ChronologyCardHydrated = {
  id: string
  name: string
  description: string
  createdAt: number
  createdBy: string
  categories: string[]
  likeCount: number
  saveCount: number
  sharedCount: number
  hitCount: number
  repostCount: number
  stats?: {
    winsCount: number
    totalUpvotes: number
    totalViews: number
    totalCelebrations: number
    totalComments: number
    lastWinAt: number
  }
  creator?: { display: string; pfp?: string | null }
  previewMedia?: string[]
  savedByUser?: boolean
  likedByUser?: boolean
  repostedByUser?: boolean
  onUnauthenticatedInteraction?: () => void // Callback for when unauthenticated users try to interact
}

export default function ChronologyCard(props: ChronologyCardHydrated) {
  const {
    id,
    name,
    description,
    createdAt,
    createdBy,
    likeCount,
    saveCount,
    sharedCount,
    hitCount,
    repostCount,
    categories = [],
    stats,
    creator,
    previewMedia = [],
    savedByUser = false,
    likedByUser = false,
    repostedByUser = false,
    onUnauthenticatedInteraction,
  } = props

  const [activeButton, setActiveButton] = useState<null | 'like' | 'save' | 'repost' | 'share'>(
    null
  )
  const [isSaved, setIsSaved] = useState(savedByUser)
  const [isLiked, setIsLiked] = useState(likedByUser)
  const [isReposted, setIsReposted] = useState(repostedByUser)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)
  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000) // Hide after 3 seconds
  }

  const interact = async (type: 'like' | 'save' | 'repost' | 'share') => {
    // Handle share separately since it doesn't require API call
    if (type === 'share') {
      try {
        if (navigator.share) {
          await navigator.share({
            url: `${window.location.origin}/chronoW/${id}`,
            title: name,
          })
          // Only show success message if share was completed (not cancelled)
          showNotification('🔗 Shared successfully!', 'success')
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(`${window.location.origin}/chronoW/${id}`)
          showNotification('🔗 Link copied to clipboard!', 'success')
        }
      } catch (shareError: unknown) {
        // Check if it's user cancellation (AbortError) or actual error
        if (shareError instanceof Error && shareError.name === 'AbortError') {
          // User cancelled the share - don't show error notification
          console.log('Share was cancelled by user')
        } else {
          // Actual error occurred
          console.error('Share failed:', shareError)
          showNotification('Failed to share', 'error')
        }
      }
      return // Exit early for share
    }

    // For like, save, and repost - check authentication and make API calls
    const accessToken = getAccessToken()
    if (!accessToken) {
      // User is not authenticated, trigger the callback
      if (onUnauthenticatedInteraction) {
        onUnauthenticatedInteraction()
      }
      return
    }

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/${id}/${type}`,
        { method: 'POST' }
      )

      if (!res.ok) {
        throw new Error(`Failed to ${type}`)
      }

      const data = await res.json()

      // Update local state based on response
      if (type === 'like') {
        setIsLiked(data.liked)
        showNotification(data.liked ? '❤️ Dubbed!' : 'Removed', 'success')
      } else if (type === 'save') {
        setIsSaved(data.saved)
        showNotification(data.saved ? '📚 Noted!' : 'Removed ', 'success')
      } else if (type === 'repost') {
        setIsReposted(data.reposted)
        showNotification(data.reposted ? '🔄 Reposted!' : 'Removed repost', 'success')
      }
    } catch (err: any) {
      console.error(`Error performing ${type}:`, err)

      // Check if it's an authentication error
      if (err.message.includes('Authentication required') || err.message.includes('log in again')) {
        // User needs to re-authenticate
        if (onUnauthenticatedInteraction) {
          onUnauthenticatedInteraction()
        }
      } else {
        alert(err.message || `Error performing ${type}`)
      }
    }
  }

  const pfpUrl = creator?.pfp || placeholderPfp

  const handleButtonPress = (button: 'like' | 'save' | 'repost' | 'share') => {
    setActiveButton(button)
    setTimeout(() => setActiveButton(null), 400)
  }

  return (
    <article className="group relative overflow-hidden rounded-xl bg-neutral-900 border border-neutral-700 p-6 transition-all duration-300 hover:shadow-lg hover:border-neutral-500 max-w-4xl mx-auto">
      {/* Notification Toast */}
      {notification && (
        <div
          className={`absolute top-4 right-4 z-10 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-green-600 text-white border border-green-500'
              : 'bg-red-600 text-white border border-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      <Link href={`/chronoW/${id}`} className="block space-y-3">
        <h3 className="text-xl font-semibold text-white line-clamp-2 group-hover:text-neutral-200 transition-colors">
          {name}
        </h3>
        <p className="text-neutral-400 text-sm line-clamp-3 group-hover:text-neutral-300 transition-colors">
          {description}
        </p>
      </Link>

      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.slice(0, 4).map((cat, i) => (
            <span
              key={i}
              className="bg-neutral-800 border border-neutral-600 text-neutral-300 rounded-full px-3 py-1 text-xs"
            >
              #{cat}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={pfpUrl}
            alt="Profile Picture"
            width={36}
            height={36}
            className="rounded-full border border-neutral-600"
          />
          <div>
            <span className="text-neutral-200 text-sm font-medium">
              @{creator?.display || createdBy}
            </span>
            <div className="text-neutral-500 text-xs">
              {new Date(stats?.lastWinAt || createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        {stats && (
          <div className="flex items-center gap-4 text-neutral-500 text-xs">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {hitCount || 0}
            </div>
          </div>
        )}
      </div>

      {previewMedia.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          {previewMedia.slice(0, 3).map((u, i) => (
            <div key={i} className="relative h-28 rounded-lg overflow-hidden bg-neutral-800">
              <Image
                src={u}
                alt="Media Preview"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Like Button */}
            <button
              onClick={() => {
                interact('like')
                handleButtonPress('like')
              }}
              className={`group flex items-center gap-2 p-3 rounded-full transition-all duration-300 ease-in-out ${
                isLiked ? 'text-red-400 bg-red-950/30' : 'text-neutral-400'
              } ${activeButton === 'like' ? 'scale-105' : ''}`}
              title={!getAccessToken() ? 'Sign in to like this chronology' : undefined}
            >
              <Heart
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isLiked
                    ? 'fill-current text-red-400'
                    : 'text-neutral-500 group-hover:text-red-400'
                }`}
              />
              <span
                className={`text-base font-medium transition-colors ${
                  isLiked ? 'text-red-400' : 'text-neutral-400 group-hover:text-red-400'
                }`}
              >
                {likeCount || 0}
              </span>
            </button>

            {/* Save Button */}
            <button
              onClick={() => {
                interact('save')
                handleButtonPress('save')
              }}
              className={`group flex items-center gap-2 p-3 rounded-full transition-all duration-300 ease-in-out ${
                isSaved ? 'text-yellow-400 bg-yellow-950/30' : 'text-neutral-400'
              } ${activeButton === 'save' ? 'scale-105' : ''}`}
              title={!getAccessToken() ? 'Sign in to save this chronology' : undefined}
            >
              <Bookmark
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isSaved
                    ? 'fill-current text-yellow-400'
                    : 'text-neutral-500 group-hover:text-yellow-400'
                }`}
              />
              <span
                className={`text-base font-medium transition-colors ${
                  isSaved ? 'text-yellow-400' : 'text-neutral-400 group-hover:text-yellow-400'
                }`}
              >
                {saveCount || 0}
              </span>
            </button>

            {/* Repost Button */}
            <button
              onClick={() => {
                interact('repost')
                handleButtonPress('repost')
              }}
              className={`group flex items-center gap-2 p-3 rounded-full transition-all duration-300 ease-in-out ${
                isReposted ? 'text-green-400 bg-green-950/30' : 'text-neutral-400'
              } ${activeButton === 'repost' ? 'scale-105' : ''}`}
              title={!getAccessToken() ? 'Sign in to repost this chronology' : undefined}
            >
              <Repeat2
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isReposted ? 'text-green-400' : 'text-neutral-500 group-hover:text-green-400'
                }`}
              />
              <span
                className={`text-base font-medium transition-colors ${
                  isReposted ? 'text-green-400' : 'text-neutral-400 group-hover:text-green-400'
                }`}
              >
                {repostCount || 0}
              </span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                interact('share')
                handleButtonPress('share')
              }}
              className={`group flex items-center gap-2 p-3 rounded-full transition-all duration-300 ease-in-out ${
                activeButton === 'share'
                  ? 'text-blue-400 bg-blue-950/30 scale-105'
                  : 'text-neutral-400'
              }`}
              title="Share this chronology"
            >
              <Share
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  activeButton === 'share'
                    ? 'text-blue-400'
                    : 'text-neutral-500 group-hover:text-blue-400'
                }`}
              />
              <span
                className={`text-base font-medium transition-colors ${
                  activeButton === 'share'
                    ? 'text-blue-400'
                    : 'text-neutral-400 group-hover:text-blue-400'
                }`}
              >
                {sharedCount || 0}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
