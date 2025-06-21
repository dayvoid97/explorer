'use client'

import React, { useEffect, useState } from 'react'
// import { Carousel } from 'react-responsive-carousel' // No longer needed for WinCard preview
// import 'react-responsive-carousel/lib/styles/carousel.min.css' // No longer needed
import { Bookmark, PartyPopper, MessageCircle } from 'lucide-react' // Import MessageCircle for comments
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
    // --- NEW PROPS FROM BACKEND ---
    previewImageUrl?: string // URL for a preview image (first signed URL)
    commentCount?: number // Total count of comments
  }
}

export default function WinCard({ win }: WinProps) {
  const router = useRouter()
  // No need for signedUrls state if only using previewImageUrl
  // const [signedUrls, setSignedUrls] = useState<string[]>([])
  const [upvotes, setUpvotes] = useState<number>(win.upvotes ?? 0)
  const [expanded, setExpanded] = useState(false) // This is for 'Read more'
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUpvoting, setIsUpvoting] = useState(false) // State to prevent multiple upvote clicks

  // 👉 Navigate to detail page
  const goToDetail = () => {
    router.push(`/winners/wincard/${win.id}`)
  }

  // 👉 Save win
  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent goToDetail from firing
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
        // 409 Conflict typically means already saved
        setSaved(true)
        setError(null) // Clear any previous errors
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
    e.stopPropagation() // Prevent goToDetail from firing
    const token = getToken()
    if (!token) {
      setError('You must be logged in to celebrate a win.')
      router.push('/login')
      return
    }

    if (isUpvoting) return // Prevent double clicks
    setIsUpvoting(true)

    try {
      const count = await celebrateWin(win.id, token)
      setUpvotes(count)
      setError(null) // Clear any previous errors
    } catch (err: any) {
      console.error('Could not celebrate', err)
      setError(err.message || 'Celebrate failed.')
      // Optionally, check for 401 Unauthorized here if celebrateWin doesn't handle it
    } finally {
      setIsUpvoting(false)
    }
  }

  // 👉 Long text detection
  const fullText = win.paragraphs.join('\n')
  const isLong = fullText.length > 200

  // The useEffect for signedUrls is no longer needed if using previewImageUrl directly
  // useEffect(() => {
  //   if (win.mediaUrls?.length) {
  //     setSignedUrls(win.mediaUrls)
  //   }
  // }, [win.mediaUrls])

  return (
    <div
      onClick={goToDetail}
      className={`relative cursor-pointer bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-5 shadow-md space-y-4 transition-all duration-300 ${
        expanded ? '' : 'max-h-[400px] overflow-hidden'
      }`}
    >
      {/* Header */}
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>@{win.username}</span>
        <span>{new Date(win.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">{win.title}</h3>

      {/* Preview Image (if available) */}
      {win.previewImageUrl && (
        <div className="w-full h-48 sm:h-56 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
          {/* Basic check if it's a video or image based on common extensions */}
          {win.previewImageUrl.endsWith('.mp4') ||
          win.previewImageUrl.endsWith('.webm') ||
          win.previewImageUrl.endsWith('.ogg') ? (
            <video
              src={win.previewImageUrl}
              className="max-h-full max-w-full object-contain"
              controls={false} // Autoplay/mute for preview, no full controls
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

      {/* Paragraphs */}
      <div>
        <div className={expanded ? '' : 'line-clamp-5'}>
          {win.paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-gray-800 dark:text-gray-300 whitespace-pre-line">
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
        {win.commentCount !== undefined && ( // Only show if commentCount is provided
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
