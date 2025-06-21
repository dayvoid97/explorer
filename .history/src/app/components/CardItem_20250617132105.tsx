'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Globe, User } from 'lucide-react'

export interface CardItemProps {
  card: {
    id: string
    type: 'card'
    cardId: string
    cardTicker: string
    companyName: string
    isPublished: boolean
    items: any[]
    country: string
    createdAt: string
    exchange: string
    industryGroup: string
    primarySector: string
    broadGroup: string
    username: string
    searchName: string
    searchTicker: string
    searchCountry: string
  }
}

export default function CardItem({ card }: CardItemProps) {
  const router = useRouter()

  const goToCard = () => {
    router.push(`company/${card.cardId}`)
  }

  return (
    <div
      onClick={goToCard}
      className="cursor-pointer w-full max-w-md mx-auto sm:mx-0 p-5 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition"
    >
      {/* Header */}
      <div className="text-muted-foreground flex justify-between text-sm">
        <span>@{card.username}</span>
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(card.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Title */}
      <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
        {card.companyName} ({card.cardTicker})
      </h2>

      {/* Meta Info */}
      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-1">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" /> {card.country}
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" /> {card.primarySector} — {card.industryGroup}
        </div>
      </div>

      {/* Item Teasers */}
      <div className="mt-4">
        {card.items.slice(0, 2).map((item, idx) => (
          <p key={idx} className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            • {item.title || item.description || 'Untitled item'}
          </p>
        ))}
      </div>
    </div>
  )
}
