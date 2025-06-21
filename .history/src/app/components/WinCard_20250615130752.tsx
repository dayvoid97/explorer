'use client'

import React, { useEffect, useState } from 'react'
import { Bookmark, PartyPopper, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getToken } from '../lib/auth'
import { celebrateWin } from '../hooks/useCelebrateWins'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface WinProps {
  win: {
    id: string
    username: string
    createdAt: string
    title: string
    paragraphs: string[]
    mediaUrls?: string[]
    upvotes?: number
    previewImageUrl?: string
    commentCount?: number
  }
}

export default function WinCard({ win }: WinProps) {
  const router = useRouter()
  const [upvotes, setUpvotes] = useState<number>(win.upvotes ?? 0)
  const [expanded, setExpanded] = useState(false) // For 'Read more' text expansion
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUpvoting, setIsUpvoting] = useState(false)

  // 👉 Navigate to detail page
  const goToDetail = () => {
    router.push(`/winners/wincard/${win.id}`)
  }

  // 👉 Save win
  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const token = getToken()
    if (!token) {
      setError('You must be logged in to save wins.')
      router.push('/login')
      return
    }

    try {
      const res = await fetch(`${API_BASE_URL}/gurkha/wins/save/${win.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok || res.status === 409) {
        setSaved(true)
        setError(null)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save win.')
      }
    } catch (err) {
      console.error('Could not save win', err)
      setError('Save failed.')
    }
  }

  // 👉 Celebrate win
  const handleCelebrate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const token = getToken()
    if (!token) {
      setError('You must be logged in to celebrate a win.')
      router.push('/login')
      return
    }

    if (isUpvoting) return
    setIsUpvoting(true)

    try {
      const count = await celebrateWin(win.id, token)
      setUpvotes(count)
      setError(null)
    } catch (err: any) {
      console.error('Could not celebrate', err)
      setError(err.message || 'Celebrate failed.')
    } finally {
      setIsUpvoting(false)
    }
  }

  // 👉 Long text detection
  const fullText = win.paragraphs.join('\n')
  const isLong = fullText.length > 200

  return (
    <div
      onClick={goToDetail}
      className={`relative cursor-pointer bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-5 shadow-md space-y-4 transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>@{win.username}</span>
        <span>{new Date(win.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">{win.title}</h3>

      {/* --- Responsive Content Area: Paragraphs & Media Preview --- */}
      <div className="flex flex-col md:flex-row md:gap-4 items-start">
        {' '}
        {/* flex-col on mobile, flex-row on md+ */}
        {/* Paragraphs */}
        <div className="flex-grow min-w-0">
          {' '}
          {/* flex-grow allows it to take available space */}
          <div className={expanded ? '' : 'line-clamp-5'}>
            {win.paragraphs.map((p, i) => (
              <p key={i} className="text-sm  whitespace-pre-line leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          {!expanded && isLong && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(true)
              }}
              className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Read more
            </button>
          )}
        </div>
        {/* Media Preview (if available) */}
        {win.previewImageUrl && (
          <div className="w-full mt-4 md:mt-0 md:w-2/5 lg:w-1/3 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center h-40 md:h-32 lg:h-40">
            {/* The height and width adjustments here ensure it's a "preview" */}
            {win.previewImageUrl.endsWith('.mp4') ||
            win.previewImageUrl.endsWith('.webm') ||
            win.previewImageUrl.endsWith('.ogg') ? (
              <video
                src={win.previewImageUrl}
                className="max-h-full max-w-full object-contain"
                controls={false}
                autoPlay
                loop
                muted
              />
            ) : (
              <img
                src={win.previewImageUrl}
                alt="Win preview"
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
        )}
      </div>
      {/* --- End Responsive Content Area --- */}

      {/* Action buttons */}
      <div className="flex justify-between items-center text-sm mt-4">
        {/* Celebrate Button */}
        <button
          onClick={handleCelebrate}
          disabled={isUpvoting}
          className={`flex items-center gap-1 text-blue-600 dark:text-blue-400 transition
            ${isUpvoting ? 'opacity-60 cursor-not-allowed' : 'hover:text-green-500'}
          `}
          title={isUpvoting ? 'Processing...' : 'Celebrate this win!'}
        >
          <PartyPopper className="w-5 h-5" /> {upvotes}
        </button>

        {/* Comments Count */}
        {win.commentCount !== undefined && (
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <MessageCircle className="w-4 h-4" /> {win.commentCount}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`${saved ? 'text-green-500' : 'text-gray-400 hover:text-blue-600'} transition`}
          title={saved ? 'Saved!' : 'Save win'}
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Optional Error Display */}
      {error && <div className="mt-3 text-xs text-red-500 dark:text-red-400 italic">{error}</div>}
    </div>
  )
}
