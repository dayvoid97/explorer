'use client'
import React from 'react'

export interface Win {
  id: string
  title: string
  preview: string
  createdAt: string
  upvotes: number
  signedMediaUrls?: string[]
  externalLink?: { platform?: string; url: string; previewImage?: string; type?: string }
}

export default function ThreadItem({ win }: { win: Win }) {
  return (
    <div className="w-full rounded-xl border border-gray-700 bg-zinc-900 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{win.title}</h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>👍 {win.upvotes ?? 0}</span>
          <span>• {new Date(win.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {win.preview && <p className="mt-2 text-sm text-gray-300">{win.preview}</p>}

      {/* images grid */}
      {win.signedMediaUrls?.length ? (
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          {win.signedMediaUrls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`media-${i}`}
              className="w-full rounded-lg border border-gray-700 object-cover"
            />
          ))}
        </div>
      ) : null}

      {/* external link preview (yt/tiktok/article etc.) */}
      {win.externalLink?.url && (
        <a
          href={win.externalLink.url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center gap-3 rounded-lg border border-gray-700 p-3 hover:bg-gray-800"
        >
          {win.externalLink.previewImage ? (
            <img
              src={win.externalLink.previewImage}
              alt="preview"
              className="h-14 w-24 rounded object-cover"
            />
          ) : (
            <div className="h-14 w-24 rounded bg-gray-800" />
          )}
          <div className="flex-1">
            <div className="text-sm font-semibold text-white">
              {win.externalLink.platform ?? 'link'}
            </div>
            <div className="truncate text-xs text-gray-400">{win.externalLink.url}</div>
          </div>
        </a>
      )}
    </div>
  )
}
