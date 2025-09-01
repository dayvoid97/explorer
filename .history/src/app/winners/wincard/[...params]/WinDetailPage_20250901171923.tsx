'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, PartyPopper, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react'
import PromoBanner from '@/app/components/PromoBanner'
import CommentSection from '@/app/components/CommentSection'
import { authFetch } from '@/app/lib/api'
import { removeTokens } from '@/app/lib/auth'
import { celebrateWin } from '@/app/hooks/useCelebrateWins'
import { updatePageMetadata } from '@/app/lib/utils'
import SocialShareButtons from '@/app/components/SocialShareButton'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1)
    return parsed.searchParams.get('v') || null
  } catch {
    return null
  }
}

// Media Carousel Component
interface MediaCarouselProps {
  mediaUrls: string[]
  mimeTypes: string[]
  externalLink?: string
  socialLinks?: string
}

function MediaCarousel({ mediaUrls, mimeTypes }: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentIndex < mediaUrls.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : mediaUrls.length - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex < mediaUrls.length - 1 ? currentIndex + 1 : 0)
  }

  if (mediaUrls.length === 0) return null

  // Single media item - no carousel needed
  if (mediaUrls.length === 1) {
    const type = mimeTypes[0]
    const url = mediaUrls[0]

    return (
      <div className="rounded-xl overflow-hidden border dark:border-gray-700">
        {type.startsWith('image/') && (
          <img src={url} alt="Media" className="w-full object-contain" />
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
  }

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div
        className="relative rounded-xl overflow-hidden border dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Media Display */}
        <div className="relative w-full min-h-[300px] flex items-center justify-center">
          {mediaUrls.map((url, idx) => {
            const type = mimeTypes[idx]
            const isActive = idx === currentIndex

            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {type.startsWith('image/') && (
                  <img
                    src={url}
                    alt={`Media ${idx + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
                {type.startsWith('video/') && (
                  <video
                    controls
                    src={url}
                    className="w-full max-h-full object-contain"
                    poster=""
                  />
                )}
                {type.startsWith('audio/') && (
                  <div className="w-full p-4 flex items-center justify-center">
                    <audio controls className="w-full max-w-md">
                      <source src={url} type={type} />
                    </audio>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Navigation Arrows - Hidden on touch devices, visible on hover for desktop */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 hidden sm:flex"
          aria-label="Previous media"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 hidden sm:flex"
          aria-label="Next media"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {mediaUrls.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              idx === currentIndex ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Go to media ${idx + 1}`}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
        {currentIndex + 1} / {mediaUrls.length}
      </div>
    </div>
  )
}

interface Props {
  winId: string // Now passed as prop instead of from useParams\
}

export default function WinDetailPage({ winId }: Props) {
  const router = useRouter()

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
        // Update page metadata for social sharing
        updatePageMetadata(data)
      })
      .catch((err) => {
        setApiError(err.toString())
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
    const dateStr = win.createdAt.split('T')[0]
    router.push(`/winners/date/${dateStr}`)
  }

  if (!win) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        {apiError || 'Loading…'}
      </div>
    )
  }

  const youTubeEmbedId =
    win.externalLink?.platform === 'youtube' && win.externalLink?.type === 'content'
      ? extractYouTubeVideoId(win.externalLink.url)
      : null

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col items-center text-center space-y-1">
          <div className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
            Only Ws in the Chat 🏆
          </div>
          <div className="flex justify-between items-center w-full">
            <button
              onClick={() => router.push('/winners')}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
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
          <div>
            <SocialShareButtons win={win} />
          </div>
          {win.chronologies?.length > 0 && (
            <div className="text-xs mt-2 text-blue-400 flex flex-wrap justify-center gap-2">
              🧵 Part of {win.chronologies.length} thread{win.chronologies.length > 1 ? 's' : ''}:{' '}
              {win.chronologies
                .filter((c: any) => !c.isPrivate)
                .map((c: any, i: number) => (
                  <span
                    key={i}
                    className="underline cursor-pointer"
                    onClick={() => router.push(`/chronoW/${c.id}`)}
                  >
                    {c.name}
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-10">
        {/* Paragraphs */}
        <div className="space-y-4 text-center">
          {win.paragraphs?.map((text: string, idx: number) => (
            <p key={idx} className="text-lg leading-relaxed">
              {text}
            </p>
          ))}
        </div>

        {/* Unified Media Carousel - Includes files, external links, and social links */}
        {((win.mediaUrls?.length > 0 && win.mimeTypes?.length === win.mediaUrls.length) ||
          win.externalLink?.url ||
          win.socialLinks?.length > 0) && (
          <MediaCarousel
            mediaUrls={win.mediaUrls}
            mimeTypes={win.mimeTypes}
            externalLink={win.externalLink}
            socialLinks={win.socialLinks}
          />
        )}

        <CommentSection winId={winId} />
        <PromoBanner winId={winId} />
      </main>
    </div>
  )
}
