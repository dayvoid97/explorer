'use client'

import React, { useState, useMemo } from 'react'
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
  const [upvotes, setUpvotes] = useState(win.upvotes ?? 0)
  const [expanded, setExpanded] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUpvoting, setIsUpvoting] = useState(false)

  const isLong = useMemo(() => win.paragraphs.join('\n').length > 200, [win.paragraphs])
  const isVideo = useMemo(() => {
    const url = win.previewImageUrl ?? ''
    return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg')
  }, [win.previewImageUrl])

  const goToDetail = () => router.push(`/winners/wincard/${win.id}`)

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const token = getToken()
    if (!token) return router.push('/login')

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
      setError('Save failed.')
    }
  }

  const handleCelebrate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const token = getToken()
    if (!token) return router.push('/login')
    if (isUpvoting) return

    setIsUpvoting(true)
    try {
      const count = await celebrateWin(win.id, token)
      setUpvotes(count)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Celebrate failed.')
    } finally {
      setIsUpvoting(false)
    }
  }

  return (
    <div
      onClick={goToDetail}
      className="relative cursor-pointer  dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-6 shadow-md transition-all duration-300 space-y-4"
    >
      {/* Header */}
      <div className="text-muted-foreground flex justify-between text-sm">
        <span>@{win.username}</span>
        <span>{new Date(win.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">{win.title}</h3>

      {/* Content Section */}
      {/* Content + Media aligned in a single row across all sizes */}
      <div className="flex flex-row gap-4 items-start">
        {/* Text Block */}
        <div className="flex-1 min-w-0">
          <div className={expanded ? '' : 'line-clamp-5'}>
            {win.paragraphs.map((p, idx) => (
              <p key={idx} className="text-sm leading-relaxed whitespace-pre-line">
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
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Read more
            </button>
          )}
        </div>

        {/* Media Preview */}
        {win.previewImageUrl && (
          <div className="w-32 sm:w-40 md:w-1/3 flex-shrink-0 rounded-lg overflow-hidden h-32 sm:h-36 md:h-40 dark:bg-gray-700 flex items-center justify-center">
            {isVideo ? (
              <video
                src={win.previewImageUrl}
                className="max-h-full max-w-full object-contain"
                autoPlay
                loop
                muted
              />
            ) : win.previewImageUrl.endsWith('.mp3') ||
              win.previewImageUrl.endsWith('.wav') ||
              win.previewImageUrl.endsWith('.ogg') ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                {/* Static waveform or speaker image */}
                <img
                  src="/sound-placeholder.png" // Place your static audio icon in /public/
                  alt="Audio Preview"
                  className="w-12 h-12 object-contain"
                />
                <audio controls className="w-28 sm:w-32">
                  <source src={win.previewImageUrl} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              <img
                src={win.previewImageUrl}
                alt="Win preview"
                className="rounded max-h-full max-w-full object-contain"
              />
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {/* Action Buttons Section */}
      <div className="flex gap-4 pt-3">
        {/* Celebrate */}
        <button
          onClick={handleCelebrate}
          disabled={isUpvoting}
          title={isUpvoting ? 'Processing...' : 'Celebrate this win!'}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition border ${
            isUpvoting
              ? 'text-blue-400 border-blue-200 bg-blue-50 cursor-not-allowed opacity-60'
              : 'text-blue-600 dark:text-blue-400 border-blue-300 bg-blue-50 hover:bg-green-50 hover:text-green-600'
          }`}
        >
          <PartyPopper className="w-4 h-4" />
          {upvotes}
        </button>

        {/* Comments */}
        {win.commentCount !== undefined && (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
            <MessageCircle className="w-4 h-4" /> {win.commentCount}
          </div>
        )}

        {/* Save */}
        <button
          onClick={handleSave}
          title={saved ? 'Saved!' : 'Save win'}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition border ${
            saved
              ? 'text-green-600 bg-green-50 border-green-400'
              : 'text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border-gray-300'
          }`}
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      {/* Error Notice */}
      {error && <p className="mt-2 text-xs text-red-500 dark:text-red-400 italic">{error}</p>}
    </div>
  )
}
