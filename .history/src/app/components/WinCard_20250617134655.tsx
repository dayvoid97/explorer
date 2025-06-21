'use client'

import React, { useState, useMemo } from 'react'
import { PartyPopper, MessageCircle, Bookmark } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { celebrateWin } from '../hooks/useCelebrateWins'
import { getToken } from '../lib/auth'
import Image from 'next/image'
import audio from '../../../public/audio.png'

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
  const [isUpvoting, setIsUpvoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLong = useMemo(() => win.paragraphs.join('').length > 200, [win.paragraphs])
  const isVideo = win.previewImageUrl?.endsWith('.mp4') || win.previewImageUrl?.endsWith('.webm')

  const goToDetail = () => router.push(`/winners/wincard/${win.id}`)

  const handleCelebrate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const token = getToken()
    if (!token) return router.push('/login')

    try {
      setIsUpvoting(true)
      const count = await celebrateWin(win.id, token)
      setUpvotes(count)
    } catch {
      setError('Celebrate failed.')
    } finally {
      setIsUpvoting(false)
    }
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const token = getToken()
    if (!token) return router.push('/login')

    try {
      const res = await fetch(`/api/gurkha/wins/save/${win.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok || res.status === 409) setSaved(true)
    } catch {
      setError('Save failed.')
    }
  }

  return (
    <div
      onClick={goToDetail}
      className="aspect-[1.618] w-full max-w-[420px] bg-gradient-to-br from-white via-yellow-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl border border-yellow-300 dark:border-yellow-600 p-6 shadow-lg hover:shadow-2xl transition-all space-y-4 cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
        <span>@{win.username}</span>
        <span>{new Date(win.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-400">{win.title}</h3>

      {/* Paragraphs + Media */}
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <div className={expanded ? '' : 'line-clamp-4'}>
            {win.paragraphs.map((p, idx) => (
              <p key={idx} className="text-sm text-gray-700 dark:text-gray-300">
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
              className="mt-2 text-sm text-blue-600 dark:text-yellow-300 hover:underline"
            >
              Read more
            </button>
          )}
        </div>

        {win.previewImageUrl && (
          <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {isVideo ? (
              <video
                src={win.previewImageUrl}
                className="object-cover w-full h-full"
                autoPlay
                loop
                muted
              />
            ) : win.previewImageUrl.match(/\\.(mp3|wav|ogg)$/) ? (
              <div className="flex flex-col items-center">
                <Image src={audio} alt="Audio" width={40} height={40} />
                <audio controls className="w-20">
                  <source src={win.previewImageUrl} />
                </audio>
              </div>
            ) : (
              <img src={win.previewImageUrl} alt="Preview" className="object-cover w-full h-full" />
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-2">
        <button
          onClick={handleCelebrate}
          disabled={isUpvoting}
          className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border border-yellow-400 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-800"
        >
          <PartyPopper className="w-4 h-4" /> {upvotes}
        </button>

        {win.commentCount !== undefined && (
          <div className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400">
            <MessageCircle className="w-4 h-4" /> {win.commentCount}
          </div>
        )}

        <button
          onClick={handleSave}
          className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border ${
            saved
              ? 'border-green-500 text-green-600 bg-green-100'
              : 'border-gray-400 text-gray-500 hover:bg-blue-50'
          }`}
        >
          <Bookmark className="w-4 h-4" />
        </button>
      </div>

      {error && <p className="text-xs text-red-500 italic mt-2">{error}</p>}
    </div>
  )
}
