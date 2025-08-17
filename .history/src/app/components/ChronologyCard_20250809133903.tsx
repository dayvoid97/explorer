'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Heart, Bookmark, Share2 } from 'lucide-react'
import { isLoggedIn, getAccessToken } from '../lib/auth'

interface ChronologyCardProps {
  id: string
  name: string
  description?: string
  createdAt: number
  createdBy: string
  categories?: string[]
}

export default function ChronologyCard({
  id,
  name,
  description = '',
  createdAt,
  createdBy,
  categories = [],
}: ChronologyCardProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [busy, setBusy] = useState<'like' | 'save' | 'share' | null>(null)

  const interact = async (type: 'like' | 'save' | 'share') => {
    if (!isLoggedIn()) return alert('Please log in to interact.')
    setBusy(type)
    try {
      const token = await getAccessToken()
      // ✅ consistent route (no extra /api)
      const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/${id}/${type}`
      await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      if (type === 'like') setLiked((v) => !v)
      if (type === 'save') setSaved((v) => !v)
      if (type === 'share')
        navigator.share?.({ url: `/chronoW/${id}`, title: name }).catch(() => {})
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="block rounded-xl border border-gray-800 bg-gradient-to-br from-gray-950 to-gray-900 p-4 transition hover:shadow-md">
      <Link href={`/chronoW/${id}`}>
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-400">{description}</p>
      </Link>

      {categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((cat, i) => (
            <span
              key={i}
              className="rounded-full bg-blue-800/20 px-2 py-0.5 text-xs font-medium text-blue-400"
            >
              #{cat}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>👤 {createdBy}</span>
        <span>📅 {new Date(createdAt).toLocaleDateString()}</span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button disabled={busy === 'like'} onClick={() => interact('like')} aria-label="Like">
          <Heart className={`h-5 w-5 ${liked ? 'text-red-500' : 'text-gray-500'}`} />
        </button>
        <button disabled={busy === 'save'} onClick={() => interact('save')} aria-label="Save">
          <Bookmark className={`h-5 w-5 ${saved ? 'text-yellow-400' : 'text-gray-500'}`} />
        </button>
        <button disabled={busy === 'share'} onClick={() => interact('share')} aria-label="Share">
          <Share2 className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  )
}
