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

const ChronologyCard: React.FC<ChronologyCardProps> = ({
  id,
  name,
  description = '',
  createdAt,
  createdBy,
  categories = [],
}) => {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleInteraction = async (type: 'like' | 'save' | 'share') => {
    if (!isLoggedIn()) return alert('Please log in to interact.')
    const token = await getAccessToken()

    const endpoint = `/api/gurkha/chronology/${id}/${type}`
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    })

    if (type === 'like') setLiked((prev) => !prev)
    if (type === 'save') setSaved((prev) => !prev)
  }

  return (
    <div className="block bg-gradient-to-br from-gray-950 to-gray-900 border border-gray-800 p-4 rounded-xl hover:shadow-md transition">
      <Link href={`/chronoW/${id}`}>
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{description}</p>
      </Link>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {categories.map((cat, i) => (
            <span
              key={i}
              className="text-xs font-medium bg-blue-800/20 text-blue-400 px-2 py-0.5 rounded-full"
            >
              #{cat}
            </span>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-4 flex justify-between items-center">
        <span>👤 {createdBy}</span>
        <span>📅 {new Date(createdAt).toLocaleDateString()}</span>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => handleInteraction('like')}>
          <Heart className={`w-5 h-5 ${liked ? 'text-red-500' : 'text-gray-500'}`} />
        </button>
        <button onClick={() => handleInteraction('save')}>
          <Bookmark className={`w-5 h-5 ${saved ? 'text-yellow-400' : 'text-gray-500'}`} />
        </button>
        <button onClick={() => handleInteraction('share')}>
          <Share2 className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  )
}

export default ChronologyCard
