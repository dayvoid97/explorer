// lib/hooks/usePublicCard.ts
import { useEffect, useState } from 'react'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export interface CardItem {
  title: string
  description?: string
  type: string
  mimeType?: string
  externalLink?: string
  paragraphs?: string[] // ✅ Add this
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

        if (res.ok) {
          console.groupCollapsed('%c📄 PublicCard Fetched', 'color: green; font-weight: bold;')
          console.log('✅ Card ID:', json.cardId)
          console.log('🏢 Company Name:', json.companyName)
          console.log('👤 Posted By:', json.username)
          console.log('🗂 Items:', json.items?.length)
          json.items?.forEach((item: CardItem, idx: number) => {
            console.group(`📦 Item ${idx + 1}: ${item.title}`)
            console.log('Type:', item.type)
            console.log('MIME:', item.mimeType)
            console.log('Signed URL:', item.signedUrl)
            console.log('Uploaded At:', item.uploadedAt)
            console.groupEnd()
          })
          console.groupEnd()

          setData(json)
        } else {
          console.warn('⚠️ Failed to load card:', json)
        }
      } catch (err) {
        console.error('❌ Error loading public card:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [cardId])

  return { data, loading }
}
