'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar,
  Globe,
  User,
  TrendingUp,
  Building2,
  ArrowRight,
  Star,
  Bookmark,
  Share2,
} from 'lucide-react'

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
  const [isHovered, setIsHovered] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleCardClick = () => router.push(`/company/${card.cardId}`)

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Share functionality
  }

  const getSectorColor = (sector: string) => {
    return 'bg-black text-white'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full max-w-md mx-auto sm:mx-0 cursor-pointer  rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
    >
      {/* Hover overlay */}
      <div
        className={`absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Header with enhanced styling */}
      <div className="relative p-6 space-y-4">
        {/* Top row with user and date */}
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium">@{card.username}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(card.createdAt)}</span>
          </div>
        </div>

        {/* Company name and ticker with enhanced typography */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight group-hover:text-black dark:group-hover:text-white transition-colors">
            {card.companyName}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-lg font-mono font-bold text-black bg-gray-100 dark:bg-gray-700 dark:text-white px-3 py-1 rounded-lg">
              {card.cardTicker}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getSectorColor(
                card.primarySector
              )}`}
            >
              {card.primarySector}
            </span>
          </div>
        </div>

        {/* Company details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Building2 className="w-4 h-4" />
            <span className="truncate">{card.industryGroup}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Globe className="w-4 h-4" />
            <span className="truncate">{card.country}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-gray-600" />

        {/* Preview items with enhanced styling */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Key Insights
          </h3>
          <div className="space-y-2">
            {card.items.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-black rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {item.title || item.description || 'Untitled'}
                </p>
              </div>
            ))}
            {card.items.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                +{card.items.length - 3} more items
              </p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isSaved
                  ? 'bg-black text-white'
                  : 'text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* View details button */}
          <div className="flex items-center gap-1 text-black dark:text-white font-medium text-sm group-hover:gap-2 transition-all duration-200">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      {isHovered && <div className="absolute inset-0 bg-black/5 rounded-2xl pointer-events-none" />}
    </div>
  )
}
