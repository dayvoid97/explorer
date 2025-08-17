'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowUp } from 'lucide-react'
import PromoBanner from '@/app/components/PromoBanner'
import CommentSection from '@/app/components/CommentSection'

import { authFetch } from '@/app/lib/api'
import { removeTokens } from '@/app/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function WinDetailPage() {
  const router = useRouter()
  const params = useParams()
  const winId = params?.id as string
  const [win, setWin] = useState<any>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setApiError(errMessage)
    removeTokens()
    router.push('/login')
  }

  useEffect(() => {
    if (!winId) return

    setApiError(null)

    fetch(`${API_URL}/gurkha/wins/${winId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch win (Status: ${res.status})`)
        }
        return res.json()
      })
      .then((data) => setWin(data))
      .catch((err) => {
        console.error('Failed to fetch win details:', err)
        setApiError(err.message || 'Failed to load win details.')
        setWin(null)
      })

    authFetch(`${API_URL}/gurkha/wins/increment-view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winId }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errData) => Promise.reject(errData.message || res.statusText))
        }
      })
      .catch((err) => {
        console.error('❌ Win view increment failed:', err)
      })
  }, [winId])

  if (!win) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-400 text-xl">
        {apiError ? `Error: ${apiError}` : 'Loading…'}
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto space-y-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Sticky Title/Header */}
      <div
        className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between py-4 px-2 md:px-4"
        style={{ backdropFilter: 'blur(6px)' }}
      >
        <button
          onClick={() => router.push('/winners')}
          aria-label="Back to winners"
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <span className="text-2xl font-bold">←</span>
        </button>
        <div className="flex-1 text-center pr-10">
          <h1 className="uppercase text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight">
            {win.title}
          </h1>
        </div>
      </div>

      <div className="space-y-2 mt-2">
        <div
          className="text-gray-500 dark:text-gray-400 text-sm hover:underline cursor-pointer"
          onClick={() => router.push(`/publicprofile/${win.username}`)}
        >
          Posted by <span className="font-semibold">@{win.username}</span> on{' '}
          {new Date(win.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Win Body */}
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
                  <div className="relative w-full overflow-hidden rounded-lg">
                    <img
                      src={url}
                      alt={`Media ${idx}`}
                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
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
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm pt-2">
        <ArrowUp size={18} />
        {win.upvotes || 0} upvotes
      </div>

      {/* Comment Section */}
      <CommentSection winId={winId} />
      <PromoBanner winId={winId} />
    </div>
  )
}
