'use client'
import React, { useState } from 'react'
import Link from 'next/link'

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
    <article className="border-border bg-card w-full rounded-xl border p-5">
      <header className="flex items-center justify-between gap-4">
        <h3 className="text-foreground text-base font-semibold leading-snug">
          <Link href={`/winners/wincard/${win.id}`} className="hover:underline">
            {win.title || 'Untitled'}
          </Link>
        </h3>
        <div className="text-muted-foreground flex items-center gap-3 text-[11px]">
          <span>👍 {win.upvotes ?? 0}</span>
          <span>💬 {win.commentCount ?? 0}</span>
          <span>🎉 {win.celebrationCount ?? 0}</span>
          <span>{new Date(win.createdAt).toLocaleDateString()}</span>
        </div>
      </header>

      {win.preview && (
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{win.preview}</p>
      )}

      {/* Enhanced media handling */}
      {win.signedMediaUrls?.length ? (
        <div className="mt-3 space-y-3">
          {win.signedMediaUrls.map((url, i) => (
            <MediaItem
              key={i}
              url={url}
              mimeType={win.mimeTypes?.[i]}
              index={i}
              title={win.title}
            />
          ))}
        </div>
      ) : null}

      {/* external link preview */}
      {win.externalLink?.url && (
        <a
          href={win.externalLink.url}
          target="_blank"
          rel="noreferrer"
          className="border-border hover:bg-muted mt-3 flex items-center gap-3 rounded-lg border p-3 transition-colors"
        >
          {win.externalLink.previewImage ? (
            <img
              src={win.externalLink.previewImage}
              alt="preview"
              className="h-14 w-24 rounded object-cover"
            />
          ) : (
            <div className="bg-muted h-14 w-24 rounded" />
          )}
          <div className="min-w-0 flex-1">
            <div className="text-foreground truncate text-sm font-medium">
              {win.externalLink.platform ?? 'External Link'}
            </div>
            <div className="text-muted-foreground truncate text-xs">{win.externalLink.url}</div>
          </div>
        </a>
      )}
    </article>
  )
}
