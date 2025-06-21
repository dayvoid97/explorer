'use client'

import React, { useMemo, useState } from 'react'
import { Bookmark, PartyPopper, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import audioIcon from '../../../public/audio.png'
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
    mimeTypes?: string[]
    upvotes?: number
    previewImageUrl?: string
    commentCount?: number
  }
}

// Utility to detect media type
const getMediaType = (url: string): 'video' | 'audio' | 'image' => {
  if (!url) return 'image'
  if (url.match(/\.(mp4|webm|ogg)$/i)) return 'video'
  if (url.match(/\.(mp3|wav)$/i)) return 'audio'
  return 'image'
}

// Reusable Action Button
const ActionButton = ({
  icon,
  label,
  onClick,
  disabled = false,
  className = '',
  title = '',
}: {
  icon: React.ReactNode
  label?: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
  className?: string
  title?: string
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border transition ${className}`}
    title={title}
  >
    {icon}
    {label}
  </button>
)

export default function WinCard({ win }: WinProps) {
  const router = useRouter()
  const [state, setState] = useState({
    upvotes: win.upvotes ?? 0,
    expanded: false,
    saved: false,
    isUpvoting: false,
    error: null as string | null,
  })

  const isLong = useMemo(() => win.paragraphs.join('\n').length > 200, [win.paragraphs])
  const mediaType = useMemo(() => getMediaType(win.previewImageUrl ?? ''), [win.previewImageUrl])
  const formattedDate = useMemo(
    () => new Date(win.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    [win.createdAt]
  )

  const goToDetail = () => router.push(`/winners/wincard/${win.id}`)

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const token = getToken()
    if (!token) return router.push('/login')
    try {
      const res = await fetch(`${API_BASE_URL}/gurkha/wins/save/${win.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (res.ok || res.status === 409) {
        setState((s) => ({ ...s, saved: true, error: null }))
      } else {
        const data = await res.json()
        setState((s) => ({ ...s, error: data.error || 'Failed to save win.' }))
      }
    } catch {
      setState((s) => ({ ...s, error: 'Save failed.' }))
    }
  }

  const handleCelebrate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const token = getToken()
    if (!token) return router.push('/login')
    if (state.isUpvoting) return

    setState((s) => ({ ...s, isUpvoting: true }))
    try {
      const count = await celebrateWin(win.id, token)
      setState((s) => ({ ...s, upvotes: count, error: null }))
    } catch (err: any) {
      setState((s) => ({ ...s, error: err.message || 'Celebrate failed.' }))
    } finally {
      setState((s) => ({ ...s, isUpvoting: false }))
    }
  }

  return (
    <div
      onClick={goToDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && goToDetail()}
      className="relative w-full max-w-md mx-auto sm:mx-0 cursor-pointer border dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 space-y-4 p-5"
    >
      {/* Header */}
      <div className="text-muted-foreground flex justify-between text-sm">
        <span>@{win.username}</span>
        <span>{formattedDate}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">{win.title}</h3>

      {/* Text + Media Content */}
      <div className="flex gap-4 items-start">
        <div className="flex-1 min-w-0">
          <div className={state.expanded ? '' : 'line-clamp-5'}>
            {win.paragraphs.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>
          {!state.expanded && isLong && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setState((s) => ({ ...s, expanded: true }))
              }}
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Read more
            </button>
          )}
        </div>

        {/* Media */}
        {win.previewImageUrl && (
          <div className="w-24 sm:w-28 md:w-32 h-24 md:h-28 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            {mediaType === 'video' ? (
              <video
                src="audio.png"
                className="max-w-full max-h-full object-cover"
                autoPlay
                loop
                muted
              />
            ) : mediaType === 'audio' ? (
              <div className="flex flex-col items-center justify-center">
                <Image src={audioIcon} alt="Audio Icon" width={36} height={36} />
                <audio controls className="w-24">
                  <source src={win.previewImageUrl} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : (
              <Image
                src={win.previewImageUrl}
                alt="Win Preview"
                width={128}
                height={128}
                className="object-cover rounded"
              />
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-4 pt-3">
        <ActionButton
          icon={<PartyPopper className="w-4 h-4" />}
          label={state.upvotes}
          onClick={handleCelebrate}
          disabled={state.isUpvoting}
          title="Celebrate this win!"
          className={
            state.isUpvoting
              ? 'text-blue-400 border-blue-200 bg-blue-50 cursor-not-allowed opacity-60'
              : 'text-blue-600 dark:text-blue-400 border-blue-300 bg-blue-50 hover:bg-green-50 hover:text-green-600'
          }
        />

        {win.commentCount !== undefined && (
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
            <MessageCircle className="w-4 h-4" />
            {win.commentCount}
          </div>
        )}

        <ActionButton
          icon={<Bookmark className="w-4 h-4" />}
          onClick={handleSave}
          title={state.saved ? 'Saved!' : 'Save win'}
          className={
            state.saved
              ? 'text-green-600 bg-green-50 border-green-400'
              : 'text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 border-gray-300'
          }
        />
      </div>

      {state.error && (
        <p className="mt-2 text-xs text-red-500 dark:text-red-400 italic">{state.error}</p>
      )}
    </div>
  )
}
