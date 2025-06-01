import { useState } from 'react'
import { fetchExplorerData } from '../lib/fetcher'

export interface ExplorerItem {
  companyName: string
  ticker: string
  primarySector: string
  region: string
  marketType: string
  exchange: string
}

interface ExplorerSearchHook {
  search: (query: string) => Promise<void>
  data: ExplorerItem[] | ExplorerItem | null
  loading: boolean
  error: string | null
}

export default function useExplorerSearch(): ExplorerSearchHook {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ExplorerItem[] | ExplorerItem | null>(null)
  const [error, setError] = useState<string | null>(null)

  const search = async (query: string, countries: string[]) => {
    if (!query && countries.length === 0) return
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const result = await fetchExplorerData(query, countries)
      setData(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { search, data, loading, error }
}
