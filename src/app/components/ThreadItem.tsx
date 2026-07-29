'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, PartyPopper, Calendar, ExternalLink } from 'lucide-react'

export interface Win {
  id: string
  title: string
  preview: string
  createdAt: string | number
  upvotes: number
  viewCount?: number
  celebrationCount?: number
  commentCount?: number
  signedMediaUrls?: string[]
  mimeTypes?: string[]
  externalLink?: { platform?: string; url: string; previewImage?: string; type?: string } | null
  username?: string
}

interface MediaItemProps {
  url: string
  mimeType?: string
  index: number
  title: string
}

function MediaItem({ url, mimeType, index, title }: MediaItemProps) {
  const [error, setError] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Determine media type from URL extension if mimeType is not available
  const getMediaTypeFromUrl = (url: string): string => {
    const extension = url.split('.').pop()?.toLowerCase() || ''

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
    const videoExtensions = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv', 'm4v']
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma']
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf']

    if (imageExtensions.includes(extension)) return 'image'
    if (videoExtensions.includes(extension)) return 'video'
    if (audioExtensions.includes(extension)) return 'audio'
    if (documentExtensions.includes(extension)) return 'document'

    return 'unknown'
  }

  // Determine media type
  const mediaType = mimeType ? mimeType.split('/')[0] : getMediaTypeFromUrl(url)

  const handleError = () => setError(true)

  if (error) {
    return (
      <div className="border-border bg-muted flex h-32 w-full items-center justify-center rounded-lg border">
        <div className="text-center">
          <div className="text-2xl">❌</div>
          <div className="text-muted-foreground text-xs">Failed to load</div>
        </div>
      </div>
    )
  }

  // Image handling
  if (mediaType === 'image') {
    return (
      <img
        src={url}
        alt={`${title} - media ${index + 1}`}
        loading="lazy"
        decoding="async"
        onError={handleError}
        className="border-border h-auto w-full rounded-lg border object-cover transition-opacity hover:opacity-90"
      />
    )
  }

  // Video handling
  if (mediaType === 'video') {
    return (
      <div className="relative">
        <video
          src={url}
          controls
          preload="metadata"
          onError={handleError}
          className="border-border h-auto w-full rounded-lg border object-cover"
          poster="" // You could add a thumbnail URL here
        >
          <source src={url} />
          Your browser does not support the video tag.
        </video>
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm">
              <div className="text-white text-xl">▶️</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Audio handling
  if (mediaType === 'audio') {
    return (
      <div className="border-border bg-card flex items-center gap-3 rounded-lg border p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <span className="text-xl">🎵</span>
        </div>
        <div className="flex-1">
          <div className="text-foreground text-sm font-medium">Audio File</div>
          <audio
            src={url}
            controls
            preload="metadata"
            onError={handleError}
            className="mt-1 w-full"
          >
            Your browser does not support the audio tag.
          </audio>
        </div>
      </div>
    )
  }

  // Document/PDF handling
  if (mediaType === 'document' || mimeType?.includes('pdf')) {
    const fileName = url.split('/').pop() || 'Document'
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="border-border hover:bg-muted flex items-center gap-3 rounded-lg border p-4 transition-colors"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
          <span className="text-xl">📄</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-foreground truncate text-sm font-medium">{fileName}</div>
          <div className="text-muted-foreground text-xs">Click to open</div>
        </div>
      </a>
    )
  }

  // Unknown/fallback handling
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="border-border hover:bg-muted flex items-center gap-3 rounded-lg border p-4 transition-colors"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
        <span className="text-xl">📎</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-foreground truncate text-sm font-medium">
          {url.split('/').pop() || 'Media File'}
        </div>
        <div className="text-muted-foreground text-xs">Click to open</div>
      </div>
    </a>
  )
}

export default function ThreadItem({ win }: { win: Win }) {
  return (
    <article className="group relative w-full transition-all duration-300">
      {/* Date floating for Desktop / inline for Mobile */}
      <div className="absolute -left-[108px] top-1 hidden w-20 text-right md:block">
        <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">
          {new Date(win.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      </div>

      <div className="bg-card hover:border-foreground/20 relative rounded-2xl border p-4 shadow-sm transition-all md:p-6">
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="bg-foreground/5 text-foreground rounded-full px-2.5 py-0.5 font-mono text-[10px] md:hidden">
              {new Date(win.createdAt).toLocaleDateString()}
            </span>
            <div className="text-muted-foreground flex items-center gap-3 text-[12px]">
              <span className="flex items-center gap-1">
                <Heart size={14} /> {win.upvotes}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={14} /> {win.commentCount}
              </span>
            </div>
          </div>

          <h3 className="text-foreground text-xl font-bold tracking-tight leading-tight">
            <Link
              href={`/winners/wincard/${win.id}`}
              className="hover:text-blue-500 transition-colors"
            >
              {win.title || 'Untitled Win'}
            </Link>
          </h3>
        </header>

        {win.preview && (
          <p className="text-muted-foreground/90 mt-3 text-sm leading-relaxed md:text-base">
            {win.preview}
          </p>
        )}

        {/* Media Grid - Using a smarter layout for multiple images */}
        {win.signedMediaUrls?.length ? (
          <div
            className={`mt-4 grid gap-2 ${
              win.signedMediaUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
            }`}
          >
            {win.signedMediaUrls.map((url, i) => (
              <div
                key={i}
                className={i === 0 && win.signedMediaUrls!.length % 2 !== 0 ? 'col-span-2' : ''}
              >
                <MediaItem url={url} mimeType={win.mimeTypes?.[i]} index={i} title={win.title} />
              </div>
            ))}
          </div>
        ) : null}

        {/* External Link Refined */}
        {win.externalLink?.url && (
          <a
            href={win.externalLink.url}
            target="_blank"
            rel="noreferrer"
            className="bg-muted/30 border-border hover:bg-muted mt-4 flex items-center gap-4 overflow-hidden rounded-xl border p-2 transition-all"
          >
            {win.externalLink.previewImage ? (
              <img
                src={win.externalLink.previewImage}
                className="h-16 w-16 rounded-lg object-cover md:h-20 md:w-32"
                alt="Link preview"
              />
            ) : (
              <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-lg md:h-20 md:w-32">
                <ExternalLink size={20} className="text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0 flex-1 pr-2">
              <p className="text-foreground truncate text-xs font-bold uppercase tracking-wider md:text-sm">
                {win.externalLink.platform || 'Source'}
              </p>
              <p className="text-muted-foreground truncate text-[11px] md:text-xs">
                {win.externalLink.url}
              </p>
            </div>
          </a>
        )}
      </div>
    </article>
  )
}
