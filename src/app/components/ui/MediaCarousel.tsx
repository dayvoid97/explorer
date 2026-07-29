// @/app/components/MediaCarousel.tsx
'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

// Assuming these interfaces are imported or defined:
export interface MediaItem {
  type: 'file' | 'youtube' | 'tiktok' | 'social'
  url: string
  mimeType?: string
  platform?: string
  title?: string
  previewImage?: string
}

export interface MediaCarouselProps {
  mediaUrls?: string[]
  mimeTypes?: string[]
  externalLink?: {
    url: string
    platform: string
    type: string
    previewImage?: string
    title?: string
  }
  socialLinks?: Array<{
    url: string
    platform: string
    previewImage?: string
    title?: string
  }>
}

// --- Utility Functions ---

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

function normalizeLinkToMediaItem(link: {
  url: string
  platform: string
  previewImage?: string
  title?: string
}): MediaItem {
  let type: MediaItem['type'] = 'social'
  if (link.platform === 'youtube') {
    type = 'youtube'
  } else if (link.platform === 'tiktok') {
    type = 'tiktok'
  }

  // --- Smart URL Logic ---
  let finalUrl = link.url.trim()

  // Check if it already has a protocol (http:// or https://)
  // If not, prepend https://
  if (!/^https?:\/\//i.test(finalUrl)) {
    finalUrl = `https://${finalUrl}`
  }
  // -----------------------

  return {
    type,
    url: finalUrl,
    platform: link.platform,
    previewImage: link.previewImage,
    title: link.title,
  }
}

// --- Render Media Item Function ---

function renderMediaItem(item: MediaItem, onExpand?: (item: MediaItem) => void) {
  const isExpandable = item.type === 'file'

  switch (item.type) {
    case 'file':
      const content = item.mimeType?.startsWith('image/') ? (
        <img
          src={item.url}
          alt="Media"
          className="max-w-full max-h-full object-contain cursor-zoom-in"
        />
      ) : item.mimeType?.startsWith('video/') ? (
        <video controls src={item.url} className="w-full max-h-full object-contain" />
      ) : (
        <div className="w-full p-4 flex items-center justify-center">
          <audio controls src={item.url} />
        </div>
      )

      return (
        <div
          className="group relative flex items-center justify-center w-full h-full"
          onClick={() => onExpand?.(item)}
        >
          {content}
          {onExpand && (
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-2 rounded-full text-white pointer-events-none">
              <Maximize2 size={20} />
            </div>
          )}
        </div>
      )

    case 'youtube':
      const youtubeId = extractYouTubeVideoId(item.url)
      return youtubeId ? (
        <iframe
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          allowFullScreen
          className="rounded-lg aspect-video"
        />
      ) : null

    case 'tiktok':
      const tiktokId = extractTikTokVideoId(item.url)
      return tiktokId ? (
        <iframe
          width="100%"
          height="500"
          src={getTikTokEmbedUrl(tiktokId)}
          allowFullScreen
          className="rounded-lg"
        />
      ) : null

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
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Open Link
            </a>
          </div>
        </div>
      )
  }
}

// --- Media Carousel Component ---

export function MediaCarousel({
  mediaUrls = [],
  mimeTypes = [],
  externalLink,
  socialLinks = [],
}: MediaCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  // OPTIMIZED MEDIA AGGREGATION
  const fileItems: MediaItem[] = mediaUrls
    .filter((url, idx) => url && mimeTypes[idx])
    .map((url, idx) => ({
      type: 'file',
      url,
      mimeType: mimeTypes[idx],
    }))

  const linkItems: MediaItem[] = []
  if (externalLink?.url) {
    linkItems.push(normalizeLinkToMediaItem(externalLink as any)) // Cast to fix type mismatch on 'type' property
  }
  socialLinks.forEach((link) => linkItems.push(normalizeLinkToMediaItem(link)))

  const allMediaItems = [...fileItems, ...linkItems]
  // END OPTIMIZED MEDIA AGGREGATION

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  // SWIPE LOGIC
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    const totalItems = allMediaItems.length

    if (isLeftSwipe) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems)
    }
    if (isRightSwipe) {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems)
    }
  }

  // CHEVRON LOGIC
  const goToPrevious = () => {
    const totalItems = allMediaItems.length
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems)
  }

  const goToNext = () => {
    const totalItems = allMediaItems.length
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems)
  }

  if (allMediaItems.length === 0) return null

  // Special case for single item
  if (allMediaItems.length === 1) {
    const item = allMediaItems[0]

    return (
      <div className="rounded-xl overflow-hidden border dark:border-gray-700">
        {renderMediaItem(item)}
      </div>
    )
  }

  // NOTE: Renamed 'shuffledItems' to 'allMediaItems' for clarity, as they aren't shuffled here.
  const mediaItems = allMediaItems

  return (
    <div className="relative">
      <div
        className="rounded-xxl relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative w-full min-h-[300px] flex items-center justify-center bg-black dark:bg-gray-900">
          {mediaItems.map((item, idx) => {
            const isActive = idx === currentIndex

            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center ${
                  isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <div className="flex items-center justify-center w-full h-full max-h-[80vh]">
                  {renderMediaItem(item)}
                </div>
              </div>
            )
          })}
        </div>

        {/* Chevron Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-200/80 text-gray-800 rounded-full flex items-center justify-center transition-colors duration-150 hover:bg-white sm:flex z-10"
          aria-label="Previous media"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-200/80 text-gray-800 rounded-full flex items-center justify-center transition-colors duration-150 hover:bg-white sm:flex z-10"
          aria-label="Next media"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Dots and Counter */}
      <div className="flex justify-center mt-4 space-x-2">
        {mediaItems.map((_, idx) => (
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
        **{currentIndex + 1}** / **{mediaItems.length}**
      </div>
    </div>
  )
}
