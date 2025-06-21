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
      className="cursor-pointer w-full max-w-[420px] aspect-[1.618] mx-auto sm:mx-0 p-6 bg-gradient-to-br from-white via-neutral-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-[1.618rem] shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
        <span>@{card.username}</span>
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(card.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
        {card.companyName} <span className="text-sm text-gray-500">({card.cardTicker})</span>
      </h2>

      {/* Meta Info */}
      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
        <div className="flex items-center gap-2"></div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-green-500" />
          <span>{card.primarySector}</span>
          <span className="text-gray-400">/</span>
          <span>{card.industryGroup}</span>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-4 border-gray-200 dark:border-gray-600" />

      {/* Item Teasers */}
      <div className="space-y-2">
        {card.items.slice(0, 2).map((item, idx) => (
          <p
            key={idx}
            className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2"
          >
            • {item.title || item.description || 'Untitled item'}
          </p>
        ))}
      </div>
    </div>
  )
}
