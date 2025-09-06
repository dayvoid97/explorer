'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Building2 } from 'lucide-react'
import { ArrowRight } from 'lucide-react'

import useFetchCards from '../hooks/useFetchCards'
import CardPreview from './CardPreview'

export default function CardPreviewGrid() {
  const { cards, loading, error, refetch } = useFetchCards()
  const router = useRouter()

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto" />
        <p className="text-gray-600 dark:text-gray-400">Loading company cards...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Building2 className="w-8 h-8 text-black dark:text-white" />
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
            Explore Knowledge Cards
          </h2>
          <TrendingUp className="w-8 h-8 text-black dark:text-white" />
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          In-depth analysis and insights from the FG Community
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <CardPreview key={card.id || card.cardId} card={card} />
        ))}
      </div>

      {/* Call to Action */}

      <div className="flex justify-end">
        <button
          onClick={() => router.push('/explorer')}
          className="inline-flex items-center gap-2 bg-black text-white text-base sm:text-lg font-semibold px-5 py-2 hover:bg-gray-900 transition"
        >
          Explore All Cards
          <ArrowRight className="w-5 h-5" />{' '}
        </button>
      </div>
    </div>
  )
}
