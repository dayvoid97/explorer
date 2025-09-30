'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, PartyPopper, Bookmark, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react'
import PromoBanner from '@/app/components/PromoBanner'
import CommentSection from '@/app/components/CommentSection'
import { authFetch } from '@/app/lib/api'
import { removeTokens } from '@/app/lib/auth'
import { celebrateWin } from '@/app/hooks/useCelebrateWins'
import { updatePageMetadata, createSlug } from '@/app/lib/utils'
import { fetchExploreWins } from '@/app/lib/fetchWins'
import AdUnit from '@/app/components/AdUnit'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// Utility functions for media and social links
function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1)
    return parsed.searchParams.get('v') || null
  } catch {
    return null
  }
}

function extractTikTokVideoId(url: string): string | null {
  try {
    const match = url.match(
      /(?:tiktok\.com\/.*\/video\/|vm\.tiktok\.com\/|tiktok\.com\/@.*\/video\/)(\d+)/
    )
    return match ? match[1] : null
  } catch {
    return null
  }
}

function getTikTokEmbedUrl(videoId: string): string {
  return `https://www.tiktok.com/embed/v2/${videoId}`
}

// Media item interface
interface MediaItem {
  type: 'file' | 'youtube' | 'tiktok' | 'social'
  url: string
  mimeType?: string
  platform?: string
  title?: string
  previewImage?: string
}

// Media Carousel Component
interface MediaCarouselProps {
  mediaUrls?: string[]
  mimeTypes?: string[]
  externalLink?: {
    url: string
    platform: string
    type: string
    previewImage?: string
  }
  socialLinks?: Array<{
    url: string
    platform: string
    previewImage?: string
    title?: string
  }>
}

function MediaCarousel({
  mediaUrls = [],
  mimeTypes = [],
  externalLink,
  socialLinks = [],
}: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const allMediaItems: MediaItem[] = []
  if (mediaUrls && mimeTypes && mediaUrls.length === mimeTypes.length) {
    mediaUrls.forEach((url, idx) => {
      allMediaItems.push({
        type: 'file',
        url,
        mimeType: mimeTypes[idx],
      })
    })
  }
  if (externalLink?.url) {
    if (externalLink.platform === 'youtube') {
      allMediaItems.push({
        type: 'youtube',
        url: externalLink.url,
        platform: externalLink.platform,
        previewImage: externalLink.previewImage,
      })
    } else if (externalLink.platform === 'tiktok') {
      allMediaItems.push({
        type: 'tiktok',
        url: externalLink.url,
        platform: externalLink.platform,
        previewImage: externalLink.previewImage,
      })
    } else {
      allMediaItems.push({
        type: 'social',
        url: externalLink.url,
        platform: externalLink.platform,
        previewImage: externalLink.previewImage,
      })
    }
  }
  socialLinks.forEach((link) => {
    if (link.platform === 'youtube') {
      allMediaItems.push({
        type: 'youtube',
        url: link.url,
        platform: link.platform,
        previewImage: link.previewImage,
        title: link.title,
      })
    } else if (link.platform === 'tiktok') {
      allMediaItems.push({
        type: 'tiktok',
        url: link.url,
        platform: link.platform,
        previewImage: link.previewImage,
        title: link.title,
      })
    } else {
      allMediaItems.push({
        type: 'social',
        url: link.url,
        platform: link.platform,
        previewImage: link.previewImage,
        title: link.title,
      })
    }
  })

  const shuffledItems = [...allMediaItems]

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

    if (isLeftSwipe && currentIndex < shuffledItems.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : shuffledItems.length - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex < shuffledItems.length - 1 ? currentIndex + 1 : 0)
  }

  if (shuffledItems.length === 0) return null

  if (shuffledItems.length === 1) {
    const item = shuffledItems[0]

    return (
      <div className="rounded-xl overflow-hidden border dark:border-gray-700">
        {renderMediaItem(item)}
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        className="rounded-xxl relative overflow-hidden "
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative w-full min-h-[300px] flex items-center justify-center">
          {shuffledItems.map((item, idx) => {
            const isActive = idx === currentIndex

            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="flex items-center justify-center w-full h-full">
                  {renderMediaItem(item)}
                </div>
              </div>
            )
          })}
        </div>
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
      <div className="flex justify-center mt-4 space-x-2">
        {shuffledItems.map((_, idx) => (
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
      <div className="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
        {currentIndex + 1} / {shuffledItems.length}
      </div>
    </div>
  )
}

function renderMediaItem(item: MediaItem) {
  // Omitted for brevity, this part of the code remains unchanged.
  switch (item.type) {
    case 'file':
      if (item.mimeType?.startsWith('image/')) {
        return <img src={item.url} alt="Media" className="max-w-full max-h-full object-contain" />
      }
      if (item.mimeType?.startsWith('video/')) {
        return (
          <video controls src={item.url} className="w-full max-h-full object-contain" poster="" />
        )
      }
      if (item.mimeType?.startsWith('audio/')) {
        return (
          <div className="w-full p-4 flex items-center justify-center">
            <audio controls className="w-full max-w-md">
              <source src={item.url} type={item.mimeType} />
            </audio>
          </div>
        )
      }
      break

    case 'youtube':
      const youtubeId = extractYouTubeVideoId(item.url)
      if (youtubeId) {
        return (
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title="YouTube video player"
            allowFullScreen
            className="rounded-lg aspect-video"
          />
        )
      }
      break

    case 'tiktok':
      const tiktokId = extractTikTokVideoId(item.url)
      if (tiktokId) {
        return (
          <iframe
            width="100%"
            height="500"
            src={getTikTokEmbedUrl(tiktokId)}
            title="TikTok video player"
            allowFullScreen
            className="rounded-lg"
          />
        )
      }
      break

    case 'social':
      return (
        <div className="w-full p-4 text-center space-y-3">
          {item.previewImage && (
            <img
              src={item.previewImage}
              alt="Preview"
              className="max-w-full h-64 object-cover rounded-lg mx-auto"
            />
          )}
          <div className="space-y-2">
            {item.title && <h3 className="font-semibold text-lg">{item.title}</h3>}
            <p className="text-sm text-gray-700 dark:text-gray-300 capitalize">
              {item.platform === 'youtube' && item.url.includes('/channel/')
                ? `Explore more on ${item.platform}`
                : `View on ${item.platform}`}
            </p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Open Link
            </a>
          </div>
        </div>
      )
  }

  return (
    <div className="w-full p-4 text-center">
      <p className="text-gray-500">Unsupported media type</p>
    </div>
  )
}

interface Props {
  winId: string
}

function SocialShareButtons({ win }: { win: any }) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareOnTwitter = () => {
    const tweetText = `Redub @${win.username} ${win.title}\n\n${shareUrl}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
    window.open(twitterUrl, '_blank')
  }
  return (
    <div className="flex justify-center mt-2 ">
      <button
        onClick={shareOnTwitter}
        className="text-m text-white flex items-center gap-2 px-2 py-1 font-bold bg-black rounded-lg hover:bg-gray-800 "
      >
        Redub on X
      </button>
    </div>
  )
}

function SortToggle({
  sortMode,
  onToggle,
  show,
}: {
  sortMode: 'shuffle' | 'recent' | 'hottest'
  onToggle: () => void
  show: boolean
}) {
  if (!show) return null
  const buttonText = sortMode === 'hottest' ? 'Hot' : sortMode === 'recent' ? 'Recent' : 'Shuffle'
  const buttonClasses = `
    flex items-center gap-2 px-3 py-1 rounded-full border text-xs transition-colors
    ${
      sortMode !== 'recent'
        ? 'border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-900/20'
        : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-orange-300'
    }
  `

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className={`${buttonClasses} group relative overflow-hidden rounded-lg px-3 py-1 transition-all duration-300 
                hover:scale-105 hover:shadow-[0_0_12px_rgba(255,165,0,0.6)] 
                active:scale-95`}
        title={`Change to ${buttonText}`}
      >
        {/* Glow behind */}
        <span className="absolute inset-0 rounded-lg bg-orange-500 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-30"></span>

        <span className="relative z-10 flex items-center gap-1 text-sm font-medium">
          <Shuffle
            size={14}
            className={`transition-transform duration-300 ${
              sortMode !== 'recent' ? 'text-orange-500 group-hover:rotate-12' : 'text-gray-500'
            }`}
          />
          {buttonText}
        </span>
      </button>
    </div>
  )
}

export default function WinDetailPage({ winId }: Props) {
  const router = useRouter()
  const [win, setWin] = useState<any>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [upvotes, setUpvotes] = useState(0)
  const [isUpvoting, setIsUpvoting] = useState(false)
  const [navigationData, setNavigationData] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isLoadingNavigation, setIsLoadingNavigation] = useState(false)
  const [sortMode, setSortMode] = useState<'recent' | 'hottest' | 'shuffle'>('recent')

  const [exploreCache, setExploreCache] = useState<{
    recent: { data: any[]; timestamp: number }
    hottest: { data: any[]; timestamp: number }
  }>({ recent: { data: [], timestamp: 0 }, hottest: { data: [], timestamp: 0 } })

  const handleAuthRedirect = (msg = 'Session expired. Please log in again.') => {
    setApiError(msg)
    removeTokens()
    router.push('/login')
  }

  function shuffleArray(array: any[]) {
    let currentIndex = array.length,
      randomIndex

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array
  }

  const loadNavigationData = async (winData: any, forceReload = false) => {
    setIsLoadingNavigation(true)
    try {
      let exploreData: any[] = []
      const sortBy = sortMode === 'hottest' ? 'hottest' : 'recent'
      const cacheKey = sortBy
      const cacheEntry = exploreCache[cacheKey]
      const isCacheStale = !cacheEntry || Date.now() - cacheEntry.timestamp > 3600000

      if (forceReload || isCacheStale) {
        exploreData = await fetchExploreWins({
          sortBy,
          limit: 20,
        })
        setExploreCache((prev) => ({
          ...prev,
          [cacheKey]: { data: exploreData, timestamp: Date.now() },
        }))
      } else {
        exploreData = cacheEntry.data
      }

      const navData = sortMode === 'shuffle' ? shuffleArray([...exploreData]) : exploreData
      setNavigationData(navData)
      const currentPos = navData.findIndex((item) => item.id === winData.id)
      setCurrentIndex(currentPos)
    } catch (error) {
      console.error('❌ Error loading navigation data:', error)
    } finally {
      setIsLoadingNavigation(false)
    }
  }

  useEffect(() => {
    if (!winId) return
    fetch(`${API_URL}/gurkha/wins/${winId}`)
      .then((res) => (res.ok ? res.json() : Promise.reject('Failed to fetch win')))
      .then((data) => {
        setWin(data)
        setUpvotes(data.upvotes || 0)
        updatePageMetadata(data)
        loadNavigationData(data)
      })
      .catch((err) => {
        setApiError(err.toString())
        setWin(null)
      })
  }, [winId])

  useEffect(() => {
    if (win) {
      loadNavigationData(win)
    }
  }, [sortMode])

  const navigateToWin = (targetWin: any) => {
    const slug = createSlug(targetWin.title)
    router.push(`/winners/wincard/${targetWin.id}/${slug}`)
  }

  const goToPrevious = () => {
    if (currentIndex > 0 && navigationData.length > 0) {
      const previousWin = navigationData[currentIndex - 1]
      navigateToWin(previousWin)
    }
  }

  const goToNext = () => {
    if (currentIndex < navigationData.length - 1 && navigationData.length > 0) {
      const nextWin = navigationData[currentIndex + 1]
      navigateToWin(nextWin)
    }
  }

  const handleSave = async () => {
    try {
      const res = await authFetch(`${API_URL}/gurkha/wins/save/${win.id}`, { method: 'POST' })
      if (res.ok || res.status === 409) setSaved(true)
    } catch (err: any) {
      if (err.message?.includes('Authentication')) handleAuthRedirect(err.message)
    }
  }

  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < navigationData.length - 1
  const getNavigationContext = () => {
    return { section: 'explore', position: currentIndex + 1, total: navigationData.length }
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

  const showSortToggle = navigationData.length > 1

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-[#3b3a3c]  dark:text-white">
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
            <h1
              className=" text-xl sm:text-xl mx-auto"
              style={{
                fontFamily: "'Freight Big Pro', serif",
                fontWeight: 500,
                letterSpacing: '-0.1rem',
              }}
            >
              {win.title}
            </h1>
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

          {!isLoadingNavigation && navigationData.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-1">
              <button
                onClick={goToPrevious}
                disabled={!hasPrevious}
                className={`flex items-center gap-1 px-3 py-1  border transition-colors ${
                  hasPrevious
                    ? 'border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                title={hasPrevious ? 'Previous win' : 'No previous win'}
              >
                <ChevronLeft size={30} />
              </button>

              <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                {(() => {
                  const context = getNavigationContext()
                  return <></>
                })()}
              </div>

              <button
                onClick={goToNext}
                disabled={!hasNext}
                className={`flex items-center gap-1 px-3 py-1 border transition-colors ${
                  hasNext
                    ? 'border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                title={hasNext ? 'Next win' : 'No next win'}
              >
                <ChevronRight size={30} />
              </button>
            </div>
          )}

          <div
            className="text-sm text-center"
            style={{
              fontFamily: "'Freight Big Pro', serif",
              fontWeight: 500,
              letterSpacing: '-0.1rem',
            }}
          >
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
          <SortToggle
            sortMode={sortMode}
            onToggle={() => {
              setSortMode((prev) => {
                if (prev === 'recent') return 'hottest'
                if (prev === 'hottest') return 'shuffle'
                return 'recent'
              })
            }}
            show={showSortToggle}
          />

          {isLoadingNavigation && <div className="text-xs mt-2">Loading navigation...</div>}
          <div>
            <SocialShareButtons win={win} />
          </div>
        </div>
      </div>
      <main className="max-w-2xl mx-auto  space-y-10 bg-[#161616]">
        <div className="space-y-4 text-center px-4 py-4">
          {win.paragraphs?.map((text: string, idx: number) => (
            <p key={idx} className="text-lg leading-relaxed text-[#eff0f2]">
              {text}
            </p>
          ))}
        </div>

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
