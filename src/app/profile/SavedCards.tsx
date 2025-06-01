'use client'

import React, { useEffect, useState } from 'react'
import { getToken } from '@/app/lib/auth'

interface Card {
  id: string
  companyName: string
  ticker: string
  content: string
  savedAt: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function SavedCards() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCards = async () => {
      const token = getToken()
      if (!token) return

      try {
        const res = await fetch(`${API_BASE}/gurkha/cards/saved`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setCards(data.cards)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [])

  if (loading) return <p>Loading saved cards...</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!cards.length) return <p>No saved cards yet.</p>

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Saved Cards</h2>
      <ul className="space-y-4">
        {cards.map((card) => (
          <li key={card.id} className="border p-4 rounded-md">
            <h3 className="font-bold">
              {card.companyName} ({card.ticker})
            </h3>
            <p>{card.content}</p>
            <p className="text-xs text-gray-500">
              Saved on {new Date(card.savedAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
