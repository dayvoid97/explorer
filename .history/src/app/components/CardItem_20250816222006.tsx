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
  Copy,
  Twitter,
  Linkedin,
  Mail,
  Link,
  Check,
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
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCardClick = () => router.push(`/company/${card.cardId}`)

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowShareMenu(!showShareMenu)
  }

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/company/${
    card.cardId
  }`
  const shareText = `Check out this analysis of ${card.companyName} (${card.cardTicker}) by @${card.username}`

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const shareToTwitter = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setShowShareMenu(false)
  }

  const shareToLinkedIn = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      shareUrl
    )}`
    window.open(url, '_blank', 'noopener,noreferrer')
    setShowShareMenu(false)
  }

  const shareViaEmail = (e: React.MouseEvent) => {
    e.stopPropagation()
    const subject = `Analysis: ${card.companyName} (${card.cardTicker})`
    const body = `${shareText}\n\n${shareUrl}`
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      body
    )}`
    window.location.href = mailtoUrl
    setShowShareMenu(false)
  }

  const useNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.companyName} (${card.cardTicker}) Analysis`,
          text: shareText,
          url: shareUrl,
        })
        setShowShareMenu(false)
      } catch (err) {
        console.error('Error sharing:', err)
      }
    }
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
      className="group relative w-full max-w-md mx-auto sm:mx-0 cursor-pointer rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
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
          <h2 className="text-2xl font-bold leading-tight group-hover:text-black dark:group-hover:text-white transition-colors">
            {card.companyName}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-lg font-mono font-bold px-3 py-1 rounded-lg">
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
          <div className="flex items-center gap-2 relative">
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

            {/* Share button with dropdown */}
            <div className="relative">
              <button
                onClick={handleShare}
                className="p-2 rounded-lg text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {/* Share dropdown menu */}
              {showShareMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  <button
                    onClick={copyToClipboard}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    {copySuccess ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copySuccess ? 'Copied!' : 'Copy link'}</span>
                  </button>

                  <button
                    onClick={shareToTwitter}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Share on Twitter</span>
                  </button>

                  <button
                    onClick={shareToLinkedIn}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>Share on LinkedIn</span>
                  </button>

                  <button
                    onClick={shareViaEmail}
                    className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Share via email</span>
                  </button>

                  {navigator.share && (
                    <button
                      onClick={useNativeShare}
                      className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>More options</span>
                    </button>
                  )}
                </div>
              )}
            </div>
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

      {/* Backdrop to close share menu */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={(e) => {
            e.stopPropagation()
            setShowShareMenu(false)
          }}
        />
      )}
    </div>
  )
}
