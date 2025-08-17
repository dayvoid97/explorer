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

      if (res.ok || res.status === 409) {
        setSaved(true)
      } else {
        const data = await res.json()
        throw new Error(data.message || `Save failed (Status: ${res.status})`)
      }
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
      {/* Header */}
      <div
        className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center py-2 px-4 space-y-1"
        style={{ backdropFilter: 'blur(6px)' }}
      >
        <div className="text-sm sm:text-base font-semibold tracking-widest text-center uppercase text-gray-700 dark:text-gray-300">
          ONLY WS IN THE CHAT 🏆
        </div>
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => router.push('/winners')}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Back"
          >
            <span className="text-2xl font-bold">←</span>
          </button>
          <h1 className="text-center flex-1 pr-10 text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight">
            {win.title}
          </h1>
        </div>
      </div>

      {/* Meta Info */}
      <div className="space-y-2 mt-2">
        <div
          className="text-gray-500 dark:text-gray-400 text-sm hover:underline cursor-pointer"
          onClick={() => router.push(`/publicprofile/${win.username}`)}
        >
          Posted by <span className="font-semibold">@{win.username}</span> on{' '}
          {new Date(win.createdAt).toLocaleDateString()}
        </div>
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
                    className="w-full h-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
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

      {/* Save / Celebrate */}
      <div className="flex gap-4 flex-wrap pt-4">
        <button
          onClick={handleCelebrate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          disabled={isUpvoting}
        >
          <PartyPopper size={18} /> Celebrate
        </button>
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-4 py-2 ${
            saved ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
          } text-white font-medium rounded-lg transition`}
        >
          <Bookmark size={18} />
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* Upvotes */}
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm pt-2">
        <ArrowUp size={18} />
        {upvotes} upvotes
      </div>

      {/* Comments */}
      <CommentSection winId={winId} />
      <PromoBanner winId={winId} />
    </div>
  )
}
