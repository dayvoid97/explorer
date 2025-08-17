'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowUp, Bookmark, PartyPopper } from 'lucide-react'
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
      <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-400 text-xl">
        {apiError ? `Error: ${apiError}` : 'Loading…'}
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto space-y-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sticky Header */}
      <div
        className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-800 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 px-4 space-y-2 sm:space-y-0"
        style={{ backdropFilter: 'blur(6px)' }}
      >
        <div className="text-sm sm:text-base font-semibold tracking-widest text-center uppercase text-gray-700 dark:text-gray-300">
          ONLY WS IN THE CHAT 🏆
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCelebrate}
            disabled={isUpvoting}
            className="flex items-center gap-1 text-sm px-3 py-1.5 border border-black dark:border-white rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            <PartyPopper size={16} /> Celebrate
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <ArrowUp size={18} />
              {upvotes} upvotes
            </div>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-1 text-sm px-3 py-1.5 border ${
              saved
                ? 'border-gray-500 text-gray-500 cursor-not-allowed'
                : 'border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
            } rounded transition`}
          >
            <Bookmark size={16} />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* Title + Meta */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/winners')}
          className="text-2xl font-bold hover:opacity-70"
        >
          ←
        </button>
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight text-center w-full -ml-8">
          {win.title}
        </h1>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Posted by <span className="font-semibold">@{win.username}</span> on{' '}
        {new Date(win.createdAt).toLocaleDateString()}
      </div>

      {/* Paragraphs */}
      <div className="space-y-6">
        {win.paragraphs?.map((text: string, idx: number) => (
          <p key={idx} className="text-lg leading-relaxed tracking-wide">
            {text}
          </p>
        ))}
      </div>

      {/* Media */}
      {win.mediaUrls?.length > 0 && win.mimeTypes?.length === win.mediaUrls.length && (
        <section className="grid sm:grid-cols-2 gap-5">
          {win.mediaUrls.map((url: string, idx: number) => {
            const type = win.mimeTypes[idx]
            return (
              <div
                key={idx}
                className="group bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-xl border dark:border-gray-700 transition hover:shadow-lg p-2"
              >
                {type.startsWith('image/') && (
                  <img
                    src={url}
                    alt={`Media ${idx}`}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                )}
                {type.startsWith('video/') && (
                  <div className="aspect-[9/16] w-full relative">
                    <video
                      controls
                      src={url}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      playsInline
                      preload="metadata"
                    />
                  </div>
                )}
                {type.startsWith('audio/') && (
                  <audio controls className="w-full mt-4">
                    <source src={url} type={type} />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            )
          })}
        </section>
      )}

      {/* Upvotes */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
        <ArrowUp size={18} />
        {upvotes} upvotes
      </div>

      <CommentSection winId={winId} />
      <PromoBanner winId={winId} />
    </div>
  )
}
