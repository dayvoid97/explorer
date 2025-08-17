'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import { Heart, Repeat2, Share, Sparkles, TrendingUp, Eye } from 'lucide-react'

// Import the placeholder image
const placeholderPfp = '/audio.png'
const litt = '/bonfire-full.png'
const repost = '/reload-icon.png'
const comment = '/comment-icon.png'

export type ChronologyCardHydrated = {
  id: string
  name: string
  description: string
  createdAt: number
  createdBy: string
  categories: string[]
  collaborators?: string[]
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
}

// Mock function placeholders - replace with your actual implementations
const isLoggedIn = () => true
const getAccessToken = () => Promise.resolve('mock-token')

export default function ChronologyCard(props: ChronologyCardHydrated) {
  const {
    id,
    name,
    description,
    createdAt,
    createdBy,
    categories = [],
    stats,
    creator,
    previewMedia = [],
  } = props

  const [activeButton, setActiveButton] = useState<null | 'like' | 'repost' | 'share'>(null)
  const [isHovered, setIsHovered] = useState(false)

  const interact = async (type: 'like' | 'save' | 'share' | 'repost') => {
    if (!isLoggedIn()) return alert('Please log in to interact.')
    const token = await getAccessToken()
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/${id}/${type}`
    await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    if (type === 'share') {
      try {
        await navigator.share?.({ url: `/chronoW/${id}`, title: name })
      } catch {}
    }
  }

  const pfpUrl = creator?.pfp || placeholderPfp

  const handleButtonPress = (button: 'like' | 'repost' | 'share') => {
    setActiveButton(button)
    setTimeout(() => setActiveButton(null), 400)
  }

  return (
    <article
      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 p-8 transition-all duration-500 max-w-4xl mx-auto hover:scale-[1.02] hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 via-fuchsia-500/5 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Floating orbs */}
      <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-lg animate-bounce" />

      {/* Trending indicator */}
      {stats && stats.totalViews > 1000 && (
        <div className="absolute top-6 right-6 flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          <TrendingUp className="w-3 h-3" />
          HOT
        </div>
      )}

      <Link href={`/chronoW/${id}`} className="relative z-10">
        <div className="space-y-4">
          {/* Header with sparkle animation */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent line-clamp-2 group-hover:from-violet-300 group-hover:via-white group-hover:to-cyan-300 transition-all duration-500">
                {name}
              </h3>
              <p className="text-slate-300 mt-3 line-clamp-3 text-lg leading-relaxed group-hover:text-slate-200 transition-colors">
                {description}
              </p>
            </div>
            <Sparkles
              className={`w-6 h-6 text-violet-400 transition-all duration-500 ${
                isHovered ? 'animate-spin' : ''
              }`}
            />
          </div>
        </div>
      </Link>

      {/* Categories with glassmorphism */}
      {categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-3 relative z-10">
          {categories.slice(0, 4).map((cat, i) => (
            <span
              key={i}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-slate-200 rounded-2xl px-4 py-2 text-sm font-medium hover:bg-white/20 hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              #{cat}
            </span>
          ))}
          {categories.length > 4 && (
            <span className="bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 backdrop-blur-sm border border-violet-400/30 text-violet-300 rounded-2xl px-4 py-2 text-sm font-bold">
              +{categories.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Creator info with enhanced design */}
      <div className="mt-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full animate-pulse blur-sm opacity-50" />
            <Image
              src={pfpUrl}
              alt="Profile Picture"
              width={40}
              height={40}
              className="relative rounded-full border-2 border-white/30"
            />
          </div>
          <div>
            <span className="text-white font-semibold">@{creator?.display || createdBy}</span>
            <div className="text-slate-400 text-sm">
              {new Date(stats?.lastWinAt || createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Stats with icons */}
        {stats && (
          <div className="flex items-center gap-4 text-slate-400 text-sm">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{stats.totalViews?.toLocaleString() || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{stats.totalUpvotes?.toLocaleString() || 0}</span>
            </div>
          </div>
        )}
      </div>

      {/* Media preview with enhanced grid */}
      {previewMedia.length > 0 && (
        <div className="mt-6 relative z-10">
          <div className="grid grid-cols-3 gap-4">
            {previewMedia.slice(0, 3).map((u, i) => (
              <div
                key={i}
                className="group/media relative h-40 w-full overflow-hidden rounded-2xl border border-white/20 bg-slate-800/50 backdrop-blur-sm"
              >
                <Image
                  src={u}
                  alt="Media Preview"
                  fill
                  sizes="(max-width:768px) 33vw, 250px"
                  className="object-cover group-hover/media:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/media:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons with modern design */}
      <div className="mt-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              interact('like')
              handleButtonPress('like')
            }}
            className={`group/btn flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 ${
              activeButton === 'like' ? 'scale-105 bg-red-500/30' : ''
            }`}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                activeButton === 'like'
                  ? 'fill-red-500 text-red-500'
                  : 'text-slate-400 group-hover/btn:text-red-400'
              }`}
            />
            <span className="text-slate-400 text-sm group-hover/btn:text-red-400">
              {stats?.totalUpvotes || 0}
            </span>
          </button>

          <button
            onClick={() => {
              interact('repost')
              handleButtonPress('repost')
            }}
            className={`group/btn flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-green-500/20 hover:border-green-500/50 transition-all duration-300 ${
              activeButton === 'repost' ? 'scale-105 bg-green-500/30' : ''
            }`}
          >
            <Repeat2
              className={`w-5 h-5 transition-all duration-300 ${
                activeButton === 'repost'
                  ? 'text-green-500'
                  : 'text-slate-400 group-hover/btn:text-green-400'
              }`}
            />
          </button>

          <button
            onClick={() => {
              interact('share')
              handleButtonPress('share')
            }}
            className={`group/btn flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300 ${
              activeButton === 'share' ? 'scale-105 bg-blue-500/30' : ''
            }`}
          >
            <Share
              className={`w-5 h-5 transition-all duration-300 ${
                activeButton === 'share'
                  ? 'text-blue-500'
                  : 'text-slate-400 group-hover/btn:text-blue-400'
              }`}
            />
          </button>
        </div>

        {/* Engagement pulse */}
        <div className="text-slate-500 text-xs">{stats?.totalComments || 0} comments</div>
      </div>
    </article>
  )
}
