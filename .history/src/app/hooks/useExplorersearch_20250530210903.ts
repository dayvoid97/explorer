import { useState } from 'react'
import { fetchExplorerData } from '../lib/fetcher'
import { trackEvent } from '../lib/analytics'

export interface ExplorerItem {
  cardId: string
  cardTicker: string
  companyName: string
  username?: string
  createdAt: string
  isPublished: boolean
  items: {
    unitId: string
    title: string
    isDraft: boolean
    type: string
    mimeType: string
    viewCount: number
    saveCount: number
    uploadedAt: string
  }[]
}

interface ExplorerSearchHook {
  search: (query: string, countries: string[]) => Promise<void>
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

    trackEvent('search_performed', {
      query,
      countries,
      source: 'explorer_search',
    })

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
