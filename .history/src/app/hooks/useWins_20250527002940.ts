// src/hooks/useWins.ts
import { useState } from 'react'

export interface WinFormInput {
  alias: string
  title: string
  description: string
  mediaUrl?: string
  mimeType?: string
}

export const useWins = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [wins, setWins] = useState<any[]>([])

  const submitWin = async (data: WinFormInput) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/wins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Failed to post win')

      const win = await res.json()
      setWins((prev) => [win, ...prev])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchWins = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/wins')
      const data = await res.json()
      setWins(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { submitWin, fetchWins, wins, loading, error }
}
