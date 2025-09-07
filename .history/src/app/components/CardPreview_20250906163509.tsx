import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, User, Building2, Share2, TrendingUp } from 'lucide-react'
import type { CardData } from '../hooks/useFetchCards'

interface CardPreviewProps {
  card: CardData
}

export default function CardPreview({ card }: CardPreviewProps) {
  const router = useRouter()
  const [showShareMenu, setShowShareMenu] = useState(false)
  const shareMenuRef = useRef<HTMLDivElement>(null)

  const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/company/${
    card.cardId
  }`
  const title = `Check out this card on Financial Gurkha: ${card.companyName}`
  const text = card.items?.[0]?.title || card.items?.[0]?.description || ''

  useEffect(() => {
    if (!showShareMenu) return
    function handleClick(e: MouseEvent) {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        setShowShareMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showShareMenu])

  const handleShare = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (navigator.share) {
      navigator.share({ title, text, url }).catch(() => {})
    } else {
      setShowShareMenu((v) => !v)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setShowShareMenu(false)
  }

  return (
    <div
      onClick={() => router.push(`/company/${card.cardId}`)}
      className="group w-full max-w-md mx-auto sm:mx-0 cursor-pointer bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.01] transition-all duration-200 ease-in-out p-6"
    >
      {/* Top Row: User, Date, Share */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
          <User className="w-4 h-4" />
          <span className="font-medium">@{card.username}</span>
          <Calendar className="w-4 h-4 ml-2" />
          <span>{new Date(card.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="relative">
          <button
            onClick={handleShare}
            aria-label="Share card"
            className="p-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Share2 className="w-4 h-4 text-gray-500" />
          </button>
          {showShareMenu && (
            <div
              ref={shareMenuRef}
              className="absolute right-0 top-8 z-50 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-2 flex flex-col gap-1 min-w-[160px]"
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  url
                )}&text=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs"
              >
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-200 text-xs"
              >
                Facebook
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  url
                )}&title=${encodeURIComponent(title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs"
              >
                LinkedIn
              </a>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-700 dark:text-gray-200 w-full text-xs"
              >
                Copy Link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Labels */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[11px] font-semibold bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wide">
          {card.cardTicker}
        </span>
        <span className="text-[11px] font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full tracking-wide">
          {card.primarySector}
        </span>
        <TrendingUp className="w-4 h-4 text-green-500 ml-2" />
      </div>

      {/* Industry Group */}
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
        <Building2 className="w-4 h-4" />
        <span className="font-medium">{card.industryGroup}</span>
      </div>

      {/* Company Title */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:underline underline-offset-4 decoration-blue-400">
        {card.companyName}
      </h2>

      {/* Description */}
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
        {card.items?.[0]?.title || card.items?.[0]?.description || 'No insights yet.'}
      </p>

      {/* More Insights */}
      {card.items && card.items.length > 1 && (
        <div className="inline-block bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-400 text-white text-[11px] px-2 py-1 rounded-full font-semibold shadow-md">
          +{card.items.length - 1} more insight{card.items.length - 1 > 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}
