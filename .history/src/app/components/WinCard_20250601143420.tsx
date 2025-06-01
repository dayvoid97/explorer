'use client'

import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Bookmark, PartyPopper } from 'lucide-react'
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
  }
}

export default function WinCard({ win }: WinProps) {
  const router = useRouter()
  const [signedUrls, setSignedUrls] = useState<string[]>([])
  const [upvotes, setUpvotes] = useState<number>(win.upvotes ?? 0)
  const [expanded, setExpanded] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 👉 Navigate to detail page
  const goToDetail = () => {
    router.push(`/winners/wincard/${win.id}`)
  }

  // 👉 Save win
  const handleSave = async () => {
    const token = getToken()
    if (!token) return

    try {
      const res = await fetch(`${API_BASE_URL}/gurkha/wins/save/${win.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok || res.status === 409) {
        setSaved(true)
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
  const handleCelebrate = async () => {
    const token = getToken()
    if (!token) return

    try {
      const count = await celebrateWin(win.id, token)
      setUpvotes(count)
    } catch (err) {
      console.error('Could not celebrate', err)
      setError('Celebrate failed.')
    }
  }

  // 👉 Use provided mediaUrls if signed
  useEffect(() => {
    if (win.mediaUrls?.length) {
      setSignedUrls(win.mediaUrls)
    }
  }, [win.mediaUrls])

  // 👉 Long text detection
  const fullText = win.paragraphs.join('\n')
  const isLong = fullText.length > 200

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
      <div className="flex justify-between text-sm mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleCelebrate()
          }}
          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-green-500"
        >
          <PartyPopper className="w-5 h-5" /> {upvotes}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handleSave()
          }}
          className={`${saved ? 'text-green-500' : 'text-gray-400 hover:text-blue-600'} transition`}
          title="Save"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      {/* Optional Error Display */}
      {error && <div className="mt-3 text-xs text-red-500 dark:text-red-400 italic">{error}</div>}
    </div>
  )
}
