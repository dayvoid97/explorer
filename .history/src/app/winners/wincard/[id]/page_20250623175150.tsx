'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowUp } from 'lucide-react'
import PromoBanner from '@/app/components/PromoBanner' // Already updated
import CommentSection from '@/app/components/CommentSection' // Already updated

// UPDATED IMPORTS: Use authFetch for API calls, and removeTokens for handling auth errors
import { authFetch } from '@/app/lib/api' // Make sure this path is correct
import { removeTokens } from '@/app/lib/auth' // Add removeTokens for handling auth errors

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL // Renamed from API_BASE for consistency

export default function WinDetailPage() {
  const router = useRouter()
  const params = useParams()
  const winId = params?.id as string
  const [win, setWin] = useState<any>(null)
  const [apiError, setApiError] = useState<string | null>(null) // State for API errors

  // Helper for consistent auth redirection
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setApiError(errMessage) // Display error
    removeTokens() // Clear both access and refresh tokens
    router.push('/login') // Redirect to login page
  }

  useEffect(() => {
    if (!winId) return

    setApiError(null) // Clear previous errors

    // Fetch win details (public, so uses standard fetch, no auth required)
    // NOTE: This call typically would be public for a public win detail page.
    // If it *requires* auth, then use authFetch and handleAuthRedirect.
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
        setWin(null) // Clear win data on error
      })

    // Increment view count (requires auth if you want to track by logged-in user, otherwise public)
    // Assuming this might be an authenticated action, so using authFetch.
    // If it's a public view count, revert to standard fetch and omit authFetch error handling.
    authFetch(`${API_URL}/gurkha/wins/increment-view`, {
      // CHANGED: Use authFetch
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
        // Auth errors for background tasks like this don't usually force a redirect.
        // The main fetchWin above (if it needs auth) would handle that.
        // Here, just log and don't affect UI.
      })
  }, [winId]) // No need for router in dependencies here

  if (!win) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-400 text-xl">
        {apiError ? `Error: ${apiError}` : 'Loading…'} {/* Display API error or loading */}
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto space-y-10 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {' '}
      {/* Added dark mode bg/text */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{win.title}</h1>

        <div
          className="text-gray-500 dark:text-gray-400 text-sm hover:underline cursor-pointer" // Dark mode text
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
                className="group bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-xl border dark:border-gray-700 transition hover:shadow-lg p-2" // Dark mode bg/border
              >
                {type.startsWith('image/') && (
                  <img
                    src={url}
                    alt={`Media ${idx}`}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                {type.startsWith('video/') && (
                  <video
                    controls // Provides browser's native controls including volume
                    src={url}
                    className="w-full h-64 object-cover rounded-lg"
                    playsInline // Recommended for mobile playback
                    preload="metadata" // Load only enough to get duration/dimensions
                    // If you want it to try to play immediately with sound (often blocked by browsers):
                    // autoPlay
                    // If you want it to autoplay silently then allow user to unmute:
                    // autoPlay muted
                  />
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
      {/* Comment Section will be rendered here */}
      <CommentSection winId={winId} /> {/* <-- CommentSection added here */}
      <PromoBanner winId={winId} />
    </div>
  )
}
