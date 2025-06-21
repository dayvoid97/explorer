// hooks/useExplorersearch.ts
import { useState } from 'react'
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export type ExplorerItem = CardItem | WinItem

export interface CardItem {
  type: 'card'
  id: string
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

export interface WinItem {
  type: 'win'
  id: string
  title: string
  paragraphs: string[]
  createdAt: string
  username: string
  mediaUrls?: string[]
  upvotes?: number
  previewImageUrl?: string
  commentCount?: number
}

export default function useExplorerSearch() {
  const [data, setData] = useState<ExplorerItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (query: string, country: string, username: string) => {
    setLoading(true)
    setError(null)
    try {
      const url = new URL(`${API_URL}/gurkha/search`)

      // 🔻 Normalize inputs to lowercase
      const q = query.trim().toLowerCase()
      const c = country.trim().toLowerCase()
      const u = username.trim().toLowerCase().replace(/^@/, '') // remove leading @ if present

      if (q) url.searchParams.set('q', q)
      if (c) url.searchParams.set('country', c)
      if (u) url.searchParams.set('username', u)

      const res = await fetch(url.toString())
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Unknown error')
      setData(json.results)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, search }
}
