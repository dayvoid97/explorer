// components/StarButton.tsx
'use client'

import { Star, StarOff } from 'lucide-react'
import { useState } from 'react'
import { authFetch } from '@/app/lib/api'

interface Props {
  cardId: string
  initialStarred?: boolean
}

export default function StarButton({ cardId, initialStarred = false }: Props) {
  const [starred, setStarred] = useState(initialStarred)
  const [loading, setLoading] = useState(false)

  const toggleStar = async () => {
    setLoading(true)
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/companycard/star`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardId }),
        }
      )
      const data = await res.json()
      if (res.ok) {
        setStarred(data.starred)
      } else {
        console.error('Error toggling star:', data.message)
      }
    } catch (err) {
      console.error('Error toggling star:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggleStar}
      title={starred ? 'Unstar this card' : 'Star this card'}
      className={`ml-auto p-2 rounded-full ${
        starred ? 'text-yellow-500' : 'text-gray-400'
      } hover:scale-110 transition`}
      disabled={loading}
    >
      {starred ? <Star className="w-5 h-5 fill-yellow-500" /> : <StarOff className="w-5 h-5" />}
    </button>
  )
}
