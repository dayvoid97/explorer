// src/hooks/useCompanyCard.ts
import { useState } from 'react'
import { ExplorerItem } from '@/types/company'

export function useCompanyCard() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCompanyCard = async (company: ExplorerItem) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/companycard/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to create card')
      return data
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { createCompanyCard, loading, error }
}
