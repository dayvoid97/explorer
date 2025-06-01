// WinCard.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Bookmark, PartyPopper } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getToken } from '../lib/auth'
import { celebrateWin } from '../hooks/useCelebrateWins'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface WinProps {
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

  const goToDetail = () => {
    router.push(`/wins/wincard/${win.id}`)
  }

  const handleSave = async () => {
    const token = getToken()
    if (!token) return alert('⚠️ Please log in to save wins.')
    try {
      const res = await fetch(`${API_BASE_URL}/gurkha/wins/${win.id}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error()
      alert('✅ Win saved!')
    } catch {
      alert('❌ Could not save.')
    }
  }

  const handleCelebrate = async () => {
    const token = getToken()
    if (!token) return alert('⚠️ Please log in to celebrate.')
    try {
      const count = await celebrateWin(win.id, token)
      setUpvotes(count)
      alert('🎉 Celebrated!')
    } catch {
      alert('❌ Could not celebrate.')
    }
  }

  useEffect(() => {
    const fetchUrls = async () => {
      if (!win.mediaUrls?.length) return
      const res = await fetch(`${API_BASE_URL}/gurkha/wins/public-media-url`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (res.ok && data.signedUrls) setSignedUrls(data.signedUrls)
    }
    fetchUrls()
  }, [win.mediaUrls])

  // determine if content is “long”
  const fullText = win.paragraphs.join('\n')
  const isLong = fullText.length > 200

  return (
    <div
      onClick={goToDetail}
      className={`relative cursor-pointer bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-5 shadow-md space-y-4 transition-all duration-300 ${
        expanded ? '' : 'max-h-[400px] overflow-hidden'
      }`}
    >
      {/* header */}
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>@{win.username}</span>
        <span>{new Date(win.createdAt).toLocaleDateString()}</span>
      </div>

      {/* title */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">{win.title}</h3>

      {/* paragraphs + Read more */}
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

      {/* carousel */}
      {signedUrls.length > 0 && (
        <Carousel
          showThumbs={false}
          showStatus={false}
          showIndicators={signedUrls.length > 1}
          infiniteLoop
          emulateTouch
          className="rounded-xl border border-gray-300 dark:border-gray-700 max-h-[300px]"
        >
          {signedUrls.map((url, i) => (
            <div key={i} className="flex justify-center items-center bg-black h-[300px]">
              <img src={url} alt={`media-${i}`} className="object-contain h-[300px]" />
            </div>
          ))}
        </Carousel>
      )}

      {/* actions */}
      <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400 mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleCelebrate()
          }}
          className="flex items-center gap-1 hover:text-green-500"
        >
          <PartyPopper className="w-5 h-5" /> {upvotes}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleSave()
          }}
          className="hover:text-blue-600"
          title="Save"
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
