import { useState } from 'react'
export interface ExplorerItem {
  companyName: string
  ticker: string
  primarySector: string
  region: string
  marketType: string
  exchange: string
}

export default function useExplorerSearch() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const search = async (query) => {
    if (!query) return

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const res = await fetch(`http://localhost:8000/api/explorer?q=${encodeURIComponent(query)}`)
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Unknown error')
      }

      setData(json.result || json.results || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { search, data, loading, error }
}
