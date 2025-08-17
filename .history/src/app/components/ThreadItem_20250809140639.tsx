'use client'
import React from 'react'
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
  externalLink?: { platform?: string; url: string; previewImage?: string; type?: string } | null
  username?: string
}

export default function ThreadItem({ win }: { win: Win }) {
  return (
    <article className="border-border bg-card w-full rounded-xl border p-5">
      <header className="flex items-center justify-between gap-4">
        <h3 className="text-foreground text-base font-semibold leading-snug">
          <Link href={`/wins/${win.id}`} className="hover:underline">
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

      {/* media (monochrome chrome only) */}
      {win.signedMediaUrls?.length ? (
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          {win.signedMediaUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`media-${i}`}
              loading="lazy"
              decoding="async"
              className="border-border h-auto w-full rounded-lg border object-cover"
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
          className="border-border hover:bg-muted mt-3 flex items-center gap-3 rounded-lg border p-3"
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
              {win.externalLink.platform ?? 'link'}
            </div>
            <div className="text-muted-foreground truncate text-xs">{win.externalLink.url}</div>
          </div>
        </a>
      )}
    </article>
  )
}
