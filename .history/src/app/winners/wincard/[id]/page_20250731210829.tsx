'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, PartyPopper, Bookmark } from 'lucide-react'
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
  const [upvotes, setUpvotes] = useState(0)
  const [isUpvoting, setIsUpvoting] = useState(false)

  const handleAuthRedirect = (msg = 'Session expired. Please log in again.') => {
    setApiError(msg)
    removeTokens()
    router.push('/login')
  }

  useEffect(() => {
    if (!winId) return

    fetch(`${API_URL}/gurkha/wins/${winId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject('Failed to fetch win')))
      .then((data) => {
        setWin(data)
        setUpvotes(data.upvotes || 0)
      })
      .catch((err) => {
        setApiError(err)
        setWin(null)
      })

    authFetch(`${API_URL}/gurkha/wins/increment-view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winId }),
    }).catch(() => {})
  }, [winId])

  const handleSave = async () => {
    try {
      const res = await authFetch(`${API_URL}/gurkha/wins/save/${win.id}`, { method: 'POST' })
      if (res.ok || res.status === 409) setSaved(true)
    } catch (err: any) {
      if (err.message?.includes('Authentication')) handleAuthRedirect(err.message)
    }
  }

  const handleCelebrate = async () => {
    if (isUpvoting) return
    setIsUpvoting(true)
    try {
      const count = await celebrateWin(win.id)
      setUpvotes(count)
    } catch (err: any) {
      if (err.message?.includes('Authentication')) handleAuthRedirect(err.message)
    } finally {
      setIsUpvoting(false)
    }
  }

  const handleDateClick = () => {
    const dateOnly = new Date(win.createdAt).toISOString().split('T')[0]
    router.push(`/wins/date/${dateOnly}`)
  }

  if (!win) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        {apiError || 'Loading…'}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sticky Header Box */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col items-center text-center space-y-1">
          <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
            Only Ws in the Chat 🏆
          </div>
          <div className="flex justify-between items-center w-full">
            <button
              onClick={() => router.push('/winners')}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg sm:text-xl font-bold mx-auto">{win.title}</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCelebrate}
                disabled={isUpvoting}
                className="flex items-center gap-1 px-3 py-1 text-xs rounded-full border border-gray-300 dark:border-gray-600"
              >
                <PartyPopper size={16} />
                {upvotes}
              </button>
              <button
                onClick={handleSave}
                disabled={saved}
                className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                  saved ? 'border-green-600 text-green-600' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
          <div className="text-sm text-center text-gray-500 dark:text-gray-400">
            Posted by{' '}
            <span
              className="font-semibold hover:underline cursor-pointer"
              onClick={() => router.push(`/publicprofile/${win.username}`)}
            >
              @{win.username}
            </span>{' '}
            on{' '}
            <span className="hover:underline cursor-pointer" onClick={handleDateClick}>
              {new Date(win.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Win Content */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-10">
        {/* Meta Info */}

        {/* Paragraphs */}
        <div className="space-y-4 text-center">
          {win.paragraphs?.map((text: string, idx: number) => (
            <p key={idx} className="text-lg leading-relaxed">
              {text}
            </p>
          ))}
        </div>

        {/* Media Section */}
        {win.mediaUrls?.length > 0 && win.mimeTypes?.length === win.mediaUrls.length && (
          <div className="grid gap-4 sm:grid-cols-2">
            {win.mediaUrls.map((url: string, idx: number) => {
              const type = win.mimeTypes[idx]
              return (
                <div key={idx} className="rounded-xl overflow-hidden border dark:border-gray-700">
                  {type.startsWith('image/') && (
                    <img src={url} alt={`Media ${idx}`} className="w-full object-contain" />
                  )}
                  {type.startsWith('video/') && (
                    <video controls src={url} className="w-full aspect-video object-contain" />
                  )}
                  {type.startsWith('audio/') && (
                    <audio controls className="w-full p-2">
                      <source src={url} type={type} />
                    </audio>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <CommentSection winId={winId} />
        <PromoBanner winId={winId} />
      </main>
    </div>
  )
}
