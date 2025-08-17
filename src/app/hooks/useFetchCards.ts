import { useState, useEffect } from 'react'
import { authFetch } from '../lib/api'

export interface CardData {
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

interface UseFetchCardsReturn {
  cards: CardData[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export default function useFetchCards(): UseFetchCardsReturn {
  const [cards, setCards] = useState<CardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCards = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/fetchCards`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Failed to fetch cards (Status: ${response.status})`)
      }

      const data = await response.json()
      setCards(data.cards || data || [])
    } catch (err: any) {
      console.error('Error fetching cards:', err)
      setError(err.message || 'Failed to fetch cards')
      setCards([]) // Reset cards on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  return {
    cards,
    loading,
    error,
    refetch: fetchCards,
  }
} 