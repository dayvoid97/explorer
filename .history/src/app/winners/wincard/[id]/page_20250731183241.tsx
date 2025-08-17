'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowUp, Bookmark, PartyPopper, ArrowLeft } from 'lucide-react'
import PromoBanner from '@/app/components/PromoBanner'
import CommentSection from '@/app/components/CommentSection'
import { authFetch } from '@/app/lib/api'
import { removeTokens } from '@/app/lib/auth'
import { celebrateWin } from '@/app/hooks/useCelebrateWins'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function WinDetailPage() {
  const router = useRouter()
  const params = useParams()
  const winId = params?.id as string

  const [win, setWin] = useState<any>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [upvotes, setUpvotes] = useState<number>(0)
  const [isUpvoting, setIsUpvoting] = useState(false)

  const handleAuthRedirect = (msg = 'Session expired. Please log in again.') => {
    setApiError(msg)
    removeTokens()
    router.push('/login')
  }

  useEffect(() => {
    if (!winId) return

    setApiError(null)

    fetch(`${API_URL}/gurkha/wins/${winId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch win (Status: ${res.status})`)
        return res.json()
      })
      .then((data) => {
        setWin(data)
        setUpvotes(data.upvotes || 0)
      })
      .catch((err) => {
        console.error('Win fetch error:', err)
        setApiError(err.message || 'Failed to load win details.')
        setWin(null)
      })

    authFetch(`${API_URL}/gurkha/wins/increment-view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winId }),
    }).catch((err) => console.error('View increment failed:', err))
  }, [winId])

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const res = await authFetch(`${API_URL}/gurkha/wins/save/${win.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (res.ok || res.status === 409) setSaved(true)
      else throw new Error((await res.json()).message || 'Save failed.')
    } catch (err: any) {
      console.error('Save error:', err)
      if (err.message?.includes('Authentication')) handleAuthRedirect(err.message)
    }
  }

  const handleCelebrate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isUpvoting) return
    setIsUpvoting(true)

    try {
      const count = await celebrateWin(win.id)
      setUpvotes(count)
    } catch (err: any) {
      console.error('Celebrate error:', err)
      if (err.message?.includes('Authentication')) handleAuthRedirect(err.message)
    } finally {
      setIsUpvoting(false)
    }
  }

  if (!win) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-6 text-center">
        <div className="text-xl font-medium text-gray-600 dark:text-gray-400">
          {apiError ? `Error: ${apiError}` : 'Loading your win...'}
        </div>
        {!apiError && (
          <div className="mt-4 w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Mobile-Optimized Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Back Button */}
          <button
            onClick={() => router.push('/winners')}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </button>

          {/* Center Title */}
          <div className="flex-1 text-center px-4">
            <div className="text-sm font-bold tracking-wider uppercase text-gray-600 dark:text-gray-400">
              🏆 Only Ws in the Chat 🏆
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCelebrate}
              disabled={isUpvoting}
              className="flex items-center gap-1 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-full text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors touch-manipulation disabled:opacity-50"
              aria-label={`Celebrate this win - ${upvotes} upvotes`}
            >
              <PartyPopper size={16} />
              <span className="text-sm font-medium">{upvotes}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saved}
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-colors touch-manipulation ${
                saved
                  ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
              aria-label={saved ? 'Win saved' : 'Save win'}
            >
              <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Win Title */}
        <div className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-gray-900 dark:text-white px-2">
            {win.title}
          </h1>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>by</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">@{win.username}</span>
            <span>•</span>
            <span>{new Date(win.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Win Content */}
        <div className="space-y-6">
          {win.paragraphs?.map((text: string, idx: number) => (
            <p
              key={idx}
              className="text-lg leading-relaxed text-gray-800 dark:text-gray-200 text-center sm:text-left"
            >
              {text}
            </p>
          ))}
        </div>

        {/* Media Gallery */}
        {win.mediaUrls?.length > 0 && win.mimeTypes?.length === win.mediaUrls.length && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {win.mediaUrls.map((url: string, idx: number) => {
                const type = win.mimeTypes[idx]
                return (
                  <div
                    key={idx}
                    className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                  >
                    {type.startsWith('image/') && (
                      <img
                        src={url}
                        alt={`Win media ${idx + 1}`}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    )}
                    {type.startsWith('video/') && (
                      <div className="aspect-video w-full bg-black">
                        <video
                          controls
                          src={url}
                          className="w-full h-full object-contain"
                          playsInline
                          preload="metadata"
                        />
                      </div>
                    )}
                    {type.startsWith('audio/') && (
                      <div className="p-4">
                        <audio controls className="w-full">
                          <source src={url} type={type} />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Engagement Stats */}
        {/* <div className="flex items-center justify-center gap-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <ArrowUp size={20} />
            <span className="font-medium">{upvotes}</span>
            <span className="text-sm">upvotes</span>
          </div>
        </div> */}

        {/* Comments Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <CommentSection winId={winId} />
        </div>

        {/* Promo Banner */}
        <div className="pt-8">
          <PromoBanner winId={winId} />
        </div>
      </div>
    </div>
  )
}
