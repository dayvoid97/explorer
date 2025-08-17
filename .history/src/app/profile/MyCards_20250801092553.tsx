'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export interface Card {
  cardId: string
  companyName: string
  cardTicker: string
  isPublished: boolean
  createdAt: string
  isStarred?: boolean
}

export default function MyCards({ cards }: { cards: Card[] }) {
  const [showAll, setShowAll] = useState(false)

  if (!cards.length) return <p className="p-6 text-sm">You have no cards yet.</p>

  const sorted = [...cards].sort((a, b) => {
    if (a.isStarred && !b.isStarred) return -1
    if (!a.isStarred && b.isStarred) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const visibleCards = showAll ? sorted : sorted.slice(0, 10)

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">My Company Cards</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visibleCards.map((card) => (
          <div
            key={card.cardId}
            className="relative border hover:shadow-md transition rounded-xl p-5 flex flex-col justify-between"
          >
            {card.isStarred && (
              <div className="absolute top-2 right-2 text-yellow-500" title="Starred">
                ⭐
              </div>
            )}
            <div className="space-y-1">
              <h3 className="text-base font-semibold line-clamp-2">{card.companyName}</h3>
              <p className="text-sm">Ticker: {card.cardTicker}</p>
              <span
                className={`inline-block text-xs font-medium mt-1 px-2 py-1 rounded ${
                  card.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {card.isPublished ? 'Public' : 'Private'}
              </span>
            </div>

            <div className="mt-4 text-sm">
              <p className="mb-2">Created: {new Date(card.createdAt).toLocaleDateString()}</p>
              <Link href={`/companycard/${card.cardId}`} className="hover:underline font-medium">
                Open Card →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {sorted.length > 10 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            {showAll ? 'Show Less' : 'Explore All →'}
          </button>
        </div>
      )}
    </section>
  )
}
