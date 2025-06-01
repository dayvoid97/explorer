'use client'

import React, { useEffect, useState } from 'react'
import { getToken } from '@/app/lib/auth'
import Link from 'next/link'

interface Card {
  cardId: string
  cardTicker: string
  companyName: string
  createdAt: string
  isPublished: boolean
  items?: any[]
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function MyCards() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCards = async () => {
      const token = getToken()
      if (!token) return

      try {
        const res = await fetch(`${API_BASE}/gurkha/cards/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setCards(data.myCards || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [])

  if (loading) return <p className="p-6 text-sm text-gray-500">Loading your cards...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>
  if (!cards.length) return <p className="p-6 text-sm text-gray-500">You have no cards yet.</p>

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold mb-6">My Company Cards</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.cardId}
            className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-bold mb-1">{card.companyName}</h3>
              <p className="text-sm text-gray-500 mb-2">Ticker: {card.cardTicker}</p>
              <span
                className={`inline-block text-xs font-medium px-2 py-1 rounded ${
                  card.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {card.isPublished ? 'Public' : 'Private'}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">
                Created: {new Date(card.createdAt).toLocaleString()}
              </p>
              <Link
                href={`/companycard/${card.cardId}`}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Open Card →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
