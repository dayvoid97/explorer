import { useState } from 'react'
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

// 1. Chronology Pillar (The Chains)
export interface ChronologyItem {
  type: 'chronology'
  id: string
  name: string
  description: string
  categories: string[]
  createdBy: string
  createdAt: number | string
  winIds: string[]
  viewCount?: number
  hitCount?: number
  upvotes?: number
  likeCount?: number
}

// 2. Win Pillar (The Dubs)
export interface WinItem {
  type: 'win'
  id: string
  title: string
  paragraphs: string[]
  createdAt: string
  username: string
  mediaUrls?: string[]
  upvotes?: number
  viewCount?: number
  commentCount?: number
}

// 3. Single Unified Type
export type ExplorerItem = WinItem | ChronologyItem

export default function useExplorerSearch() {
  const [data, setData] = useState<ExplorerItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Single Query Search (q)
   * Optimized for Chronos and Wins only.
   */
  const search = async (query: string) => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setData([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const url = new URL(`${API_URL}/gurkha/search`)

      // We only use 'q' now. This matches your revamped explorer.js backend.
      url.searchParams.set('q', trimmedQuery.toLowerCase())

      const res = await fetch(url.toString())
      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Network response failed')

      // Results are already ranked by the backend
      setData(json.results || [])
    } catch (err: any) {
      console.error('Frontend Search Error:', err)
      setError(err.message)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, search }
}
