// hooks/useExplorersearch.ts
import { useState } from 'react'

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

  const search = async (query: string, countries: string[]) => {
    setLoading(true)
    setError(null)
    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/explore`)
      url.searchParams.set('q', [query, ...countries].join(','))
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
