'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { Heart, Repeat2, Share, Eye, Bookmark, Palette, MessageCircle } from 'lucide-react'
import { getAccessToken } from '../lib/auth'
import { chronologyService } from '../lib/chronologyService'

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

const themes = [
  {
    name: 'Ocean',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    accent: 'from-blue-400/20 to-purple-400/20',
  },
  {
    name: 'Twilight',
    gradient: 'linear-gradient(135deg, #000000ff 0%, #363536ff 100%)',
    accent: 'from-blue-400/20 to-purple-400/20',
  },
  {
    name: 'Sunset',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    accent: 'from-pink-400/20 to-red-400/20',
  },
  {
    name: 'Forest',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    accent: 'from-cyan-400/20 to-blue-400/20',
  },
  {
    name: 'Mint',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    accent: 'from-teal-400/20 to-pink-400/20',
  },
]

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

  const [isHovered, setIsHovered] = useState(false)
  const [activeButton, setActiveButton] = useState<null | 'like' | 'save' | 'repost' | 'share'>(
    null
  )
  const [isSaved, setIsSaved] = useState(savedByUser)
  const [isLiked, setIsLiked] = useState(likedByUser)
  const [isReposted, setIsReposted] = useState(repostedByUser)
  const [currentTheme, setCurrentTheme] = useState(0)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  // Inside ChronologyCard.tsx
  const interact = async (type: 'like' | 'save' | 'repost' | 'share') => {
    // 1. Browser Native Share
    if (type === 'share') {
      try {
        if (navigator.share) {
          await navigator.share({ url: `${window.location.origin}/chronoW/${id}`, title: name })
          await chronologyService.interact(id, 'share') // Track share on backend
          showNotification('🔗 Shared to the world!', 'success')
        } else {
          await navigator.clipboard.writeText(`${window.location.origin}/chronoW/${id}`)
          showNotification('🔗 Link copied!', 'success')
        }
      } catch (e) {
        /* user cancelled */
      }
      return
    }

    // 2. Auth Check
    // 2. AUTH GUARD: Nice message + trigger the prompt from page.tsx
    if (!getAccessToken()) {
      showNotification('🔒 Log in to interact', 'error')
      if (onUnauthenticatedInteraction) {
        // This triggers the KnowledgeAccessPrompt on the main page
        onUnauthenticatedInteraction()
      }
      return
    }

    // 3. Backend Interaction
    try {
      const data = await chronologyService.interact(id, type)

      // Update local state based on the 'active' status returned by backend
      if (type === 'like') {
        setIsLiked(data.liked)
        showNotification(data.liked ? '❤️ Dubbed!' : 'Removed', 'success')
      }
      if (type === 'save') {
        setIsSaved(data.saved)
        showNotification(data.saved ? '📚 Noted!' : 'Removed', 'success')
      }
      if (type === 'repost') {
        setIsReposted(data.reposted)
        showNotification(data.reposted ? '🔄 Reposted!' : 'Removed', 'success')
      }
    } catch (err: any) {
      showNotification(err.message || 'Action failed', 'error')
    }
  }

  const pfpUrl = creator?.pfp || placeholderPfp

  const handleButtonPress = (button: 'like' | 'save' | 'repost' | 'share') => {
    setActiveButton(button)
    setTimeout(() => setActiveButton(null), 200)
  }

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev + 1) % themes.length)
  }

  const theme = themes[currentTheme]

  return (
    <article
      className="relative bg-[#161616] overflow-hidden rounded-2xl backdrop-blur-xl p-6 transition-all duration-500 hover:shadow-xl hover:shadow-black/10 hover:scale-[1.02] max-w-sm mx-auto flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: '0 0 2px 2px #1c1c1c',
      }}
    >
      {/* Theme Background */}
      <div
        className={`absolute inset-0 opacity-0 transition-all duration-700 rounded-2xl ${
          isHovered ? 'opacity-10' : ''
        }`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          theme.accent
        } opacity-0 rounded-2xl transition-all duration-500 ${isHovered ? 'opacity-30' : ''}`}
      />

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 z-20 p-2 rounded-lg bg-white/60 hover:bg-white/80 backdrop-blur-md border border-white/40 transition-all duration-300 hover:scale-105 opacity-0 ${
          isHovered ? 'opacity-100' : ''
        }`}
        title={`Switch to ${themes[(currentTheme + 1) % themes.length].name} theme`}
      >
        <Palette className="w-4 h-4 text-gray-600" />
      </button>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`absolute top-4 left-4 z-30 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-md ${
            notification.type === 'success'
              ? 'bg-green-500/90 text-white border border-green-400/50'
              : 'bg-blue-500/90 text-white border border-red-400/50'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="text-[#eff0f2] relative z-10">
        <Link href={`/chronoW/${id}`} className="block space-y-3">
          <h3
            className="text-xl font-bold line-clamp-2 transition-colors leading-tight"
            style={{
              fontFamily: "'Freight Big Pro', serif",
              fontWeight: 500,
              letterSpacing: '-0.05em',
            }}
          >
            {name}
          </h3>
          <p className="text-l line-clamp-3 transition-colors leading-relaxed text-[#d9d8d3]">
            {description}
          </p>
        </Link>

        {categories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-[#d9d8d3]">
            {categories.slice(0, 3).map((cat, i) => (
              <span
                key={i}
                className=" backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium border border-white/50 hover:bg-white/70 transition-colors"
              >
                #{cat}
              </span>
            ))}
            {categories.length > 3 && (
              <span
                className="text-s px-2 py-1"
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontWeight: 400,
                  fontStyle: 'normal',
                  letterSpacing: '-0.05em',
                }}
              >
                +{categories.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between text-[#d9d8d3]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={pfpUrl}
                alt="Profile Picture"
                className="w-9 h-9 rounded-full border-2 border-white/60 shadow-sm object-cover"
              />
            </div>
            <div>
              <span
                className=" text-sm "
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontWeight: 400,
                  fontStyle: 'normal',
                  letterSpacing: '-0.05em',
                }}
              >
                @{creator?.display || createdBy}
              </span>
              <div className="text-gray-500 text-xs">
                {new Date(stats?.lastWinAt || createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          {stats && (
            <div className="flex items-center gap-1 text-xs bg-white/50 rounded-full px-2 py-1 backdrop-blur-sm">
              <Eye className="w-3 h-3" />
              <span>{hitCount || 0}</span>
            </div>
          )}
        </div>

        {previewMedia.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {previewMedia.slice(0, 3).map((u, i) => (
              <div
                key={i}
                className="relative h-24 rounded-lg overflow-hidden bg-white/40 border border-white/40"
              >
                <img
                  src={u}
                  alt={`Media Preview ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-center">
          <div className="flex items-center gap-1   rounded-full p-1 border border-transparent">
            {/* Like Button */}
            <button
              onClick={() => {
                interact('like')
                handleButtonPress('like')
              }}
              className={`group flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200 ${
                isLiked
                  ? 'text-red-600 bg-red-50/80'
                  : 'text-gray-500 hover:bg-white/60 hover:text-red-500'
              } ${activeButton === 'like' ? 'scale-95' : ''}`}
              title={!getAccessToken() ? 'Sign in to like this chronology' : undefined}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-200 ${
                  isLiked ? 'fill-current text-red-600' : 'group-hover:scale-110'
                }`}
              />
            </button>

            {/* Save Button */}
            <button
              onClick={() => {
                interact('save')
                handleButtonPress('save')
              }}
              className={`group flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200 ${
                isSaved
                  ? 'text-yellow-600 bg-yellow-50/80'
                  : 'text-gray-500 hover:bg-white/60 hover:text-yellow-600'
              } ${activeButton === 'save' ? 'scale-95' : ''}`}
              title={!getAccessToken() ? 'Sign in to save this chronology' : undefined}
            >
              <Bookmark
                className={`w-5 h-5 transition-all duration-200 ${
                  isSaved ? 'fill-current text-yellow-600' : 'group-hover:scale-110'
                }`}
              />
            </button>

            {/* Repost Button */}
            <button
              onClick={() => {
                interact('repost')
                handleButtonPress('repost')
              }}
              className={`group flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200 ${
                isReposted
                  ? 'text-green-600 bg-green-50/80'
                  : 'text-gray-500 hover:bg-white/60 hover:text-green-600'
              } ${activeButton === 'repost' ? 'scale-95' : ''}`}
              title={!getAccessToken() ? 'Sign in to repost this chronology' : undefined}
            >
              <Repeat2
                className={`w-5 h-5 transition-all duration-200 ${
                  isReposted ? 'text-green-600' : 'group-hover:scale-110'
                }`}
              />
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                interact('share')
                handleButtonPress('share')
              }}
              className={`group flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-200 ${
                activeButton === 'share'
                  ? 'text-blue-600 bg-blue-50/80 scale-95'
                  : 'text-gray-500 hover:bg-white/60 hover:text-blue-600'
              }`}
              title="Share this chronology"
            >
              <Share
                className={`w-5 h-5 transition-all duration-200 ${
                  activeButton === 'share' ? 'text-blue-600' : 'group-hover:scale-110'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
