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
  onUnauthenticatedInteraction?: () => void
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
    setTimeout(() => setNotification(null), 3000)
  }

  const interact = async (type: 'like' | 'save' | 'repost' | 'share') => {
    if (type === 'share') {
      try {
        if (navigator.share) {
          await navigator.share({
            url: `${window.location.origin}/chronoW/${id}`,
            title: name,
          })
          showNotification('🔗 Shared successfully!', 'success')
        } else {
          await navigator.clipboard.writeText(`${window.location.origin}/chronoW/${id}`)
          showNotification('🔗 Link copied to clipboard!', 'success')
        }
      } catch (shareError: unknown) {
        if (shareError instanceof Error && shareError.name === 'AbortError') {
          console.log('Share was cancelled by user')
        } else {
          console.error('Share failed:', shareError)
          showNotification('Failed to share', 'error')
        }
      }
      return
    }

    const accessToken = getAccessToken()
    if (!accessToken) {
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

      if (err.message.includes('Authentication required') || err.message.includes('log in again')) {
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
    <article className="group relative overflow-hidden rounded-3xl bg-white/30 backdrop-blur-2xl border border-white/20 p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 max-w-4xl mx-auto">
      {/* Subtle Gradient Background */}
      <div
        className="absolute inset-0 z-[-1] rounded-3xl opacity-20 transition-all duration-500 group-hover:opacity-40"
        style={{ background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4, #4CB6FF)' }}
      ></div>

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

      <Link href={`/chronoW/${id}`} className="block space-y-4">
        <h3 className="text-2xl font-bold text-gray-800 line-clamp-2 group-hover:text-gray-950 transition-colors">
          {name}
        </h3>
        <p className="text-gray-600 text-base line-clamp-3 group-hover:text-gray-700 transition-colors">
          {description}
        </p>
      </Link>

      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.slice(0, 4).map((cat, i) => (
            <span
              key={i}
              className="bg-white/50 backdrop-blur-md text-gray-600 rounded-full px-4 py-1 text-xs font-semibold border border-white/40"
            >
              #{cat}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={pfpUrl}
            alt="Profile Picture"
            width={40}
            height={40}
            className="rounded-full border border-white/50"
          />
          <div>
            <span className="text-gray-700 text-base font-semibold">
              @{creator?.display || createdBy}
            </span>
            <div className="text-gray-500 text-sm">
              {new Date(stats?.lastWinAt || createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
        {stats && (
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <Eye className="w-5 h-5" />
              {hitCount || 0}
            </div>
          </div>
        )}
      </div>

      {previewMedia.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          {previewMedia.slice(0, 3).map((u, i) => (
            <div key={i} className="relative h-32 rounded-xl overflow-hidden bg-white/50">
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

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Like Button */}
          <button
            onClick={() => {
              interact('like')
              handleButtonPress('like')
            }}
            className={`group flex items-center gap-2 p-3 rounded-full transition-all duration-300 ease-in-out ${
              isLiked ? 'text-red-600 bg-red-100' : 'text-gray-500 hover:bg-gray-100'
            } ${activeButton === 'like' ? 'scale-105' : ''}`}
            title={!getAccessToken() ? 'Sign in to like this chronology' : undefined}
          >
            <Heart
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                isLiked ? 'fill-current text-red-600' : 'text-gray-500 group-hover:text-red-600'
              }`}
            />
            <span
              className={`text-base font-semibold transition-colors ${
                isLiked ? 'text-red-600' : 'text-gray-500 group-hover:text-red-600'
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
              isSaved ? 'text-yellow-600 bg-yellow-100' : 'text-gray-500 hover:bg-gray-100'
            } ${activeButton === 'save' ? 'scale-105' : ''}`}
            title={!getAccessToken() ? 'Sign in to save this chronology' : undefined}
          >
            <Bookmark
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                isSaved
                  ? 'fill-current text-yellow-600'
                  : 'text-gray-500 group-hover:text-yellow-600'
              }`}
            />
            <span
              className={`text-base font-semibold transition-colors ${
                isSaved ? 'text-yellow-600' : 'text-gray-500 group-hover:text-yellow-600'
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
              isReposted ? 'text-green-600 bg-green-100' : 'text-gray-500 hover:bg-gray-100'
            } ${activeButton === 'repost' ? 'scale-105' : ''}`}
            title={!getAccessToken() ? 'Sign in to repost this chronology' : undefined}
          >
            <Repeat2
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                isReposted ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'
              }`}
            />
            <span
              className={`text-base font-semibold transition-colors ${
                isReposted ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'
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
                ? 'text-blue-600 bg-blue-100 scale-105'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
            title="Share this chronology"
          >
            <Share
              className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                activeButton === 'share'
                  ? 'text-blue-600'
                  : 'text-gray-500 group-hover:text-blue-600'
              }`}
            />
            <span
              className={`text-base font-semibold transition-colors ${
                activeButton === 'share'
                  ? 'text-blue-600'
                  : 'text-gray-500 group-hover:text-blue-600'
              }`}
            >
              {sharedCount || 0}
            </span>
          </button>
        </div>
      </div>
    </article>
  )
}
