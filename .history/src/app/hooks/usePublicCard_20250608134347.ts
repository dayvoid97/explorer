// lib/hooks/usePublicCard.ts
import { useEffect, useState } from 'react'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export interface CardItem {
  title: string
  description?: string
  type: string
  mimeType?: string
  externalLink?: string
  content?: string
  categories?: string
  unitId?: string
  uploadedAt?: string
  viewCount?: number
  saveCount?: number
  signedUrl?: string
}

export interface PublicCard {
  cardId: string
  cardTicker: string
  companyName: string
  username: string
  createdAt: string
  items: CardItem[]
}

export function usePublicCard(cardId: string) {
  const [data, setData] = useState<PublicCard | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cardId) return
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/gurkha/exploreCard?id=${cardId}`)
        const json = await res.json()
        if (res.ok) setData(json)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [cardId])

  return { data, loading }
}
