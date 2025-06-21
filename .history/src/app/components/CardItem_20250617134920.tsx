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

  return (
    <div
      onClick={() => router.push(`/company/${card.cardId}`)}
      className="aspect-[1.618] w-full max-w-[420px] cursor-pointer bg-gradient-to-br from-white via-slate-50 to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <span>@{card.username}</span>
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" /> {new Date(card.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white leading-snug">
        {card.companyName} <span className="text-sm text-gray-500">({card.cardTicker})</span>
      </h2>

      {/* Sector + Country */}
      <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-green-600" />
          {card.primarySector} / {card.industryGroup}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200 dark:border-gray-600" />

      {/* Preview items */}
      <div className="space-y-1">
        {card.items.slice(0, 2).map((item, idx) => (
          <p key={idx} className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            • {item.title || item.description || 'Untitled'}
          </p>
        ))}
      </div>
    </div>
  )
}
