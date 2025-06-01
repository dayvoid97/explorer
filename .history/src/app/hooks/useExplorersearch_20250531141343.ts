// hooks/useExplorersearch.ts
import { useState } from 'react'
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export interface ExplorerItem {
  cardId: string
  companyName: string
  ticker: string
  country: string
  username: string
  exchange?: string
  items?: any[]
  [key: string]: any
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
      if (query) url.searchParams.set('q', query)
      if (country) url.searchParams.set('country', country)
      if (username) url.searchParams.set('username', username)

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
