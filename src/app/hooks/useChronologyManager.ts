// hooks/useChronologyManager.ts
import { useState, useEffect, useRef } from 'react'
import { authFetch } from '../lib/api'

export function useChronologyManager() {
  const [chronologies, setChronologies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<any>({})
  const [operationLoading, setOperationLoading] = useState<string | null>(null)

  // Swipe State
  const [swipingWin, setSwipingWin] = useState<string | null>(null)
  const [swipeDistance, setSwipeDistance] = useState(0)
  const swipeStartX = useRef(0)

  const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/manage`

  const fetchChronos = async () => {
    try {
      const res = await authFetch(API_BASE, { method: 'GET' })
      const data = await res.json()
      setChronologies(data.chronologies || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChronos()
  }, [])

  const deleteChrono = async (id: string) => {
    setOperationLoading(`delete-${id}`)
    try {
      await authFetch(`${API_BASE}/${id}`, { method: 'DELETE' })
      setChronologies((prev) => prev.filter((c) => c.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
    setOperationLoading(null)
  }

  const updateChrono = async (id: string) => {
    setOperationLoading(`edit-${id}`)
    try {
      await authFetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      setChronologies((prev) => prev.map((c) => (c.id === id ? { ...c, ...formData } : c)))
      setEditingId(null)
    } catch (err: any) {
      alert(err.message)
    }
    setOperationLoading(null)
  }

  const addWin = async (chronoId: string, winId: string) => {
    setOperationLoading(`add-win-${chronoId}`)
    try {
      const res = await authFetch(`${API_BASE}/${chronoId}/wins/${winId}`, {
        method: 'POST',
      })
      if (res.ok) await fetchChronos() // Re-hydrate
    } catch (err: any) {
      alert(err.message)
    }
    setOperationLoading(null)
  }

  const removeWin = async (chronoId: string, winId: string) => {
    // Optimistic UI update
    setChronologies((prev) =>
      prev.map((c) =>
        c.id === chronoId ? { ...c, wins: c.wins?.filter((w: any) => w.id !== winId) } : c
      )
    )

    try {
      await authFetch(`${API_BASE}/${chronoId}/wins/${winId}`, { method: 'DELETE' })
    } catch (err: any) {
      fetchChronos()
    } // Rollback on error
  }

  return {
    chronologies,
    loading,
    error,
    editingId,
    formData,
    operationLoading,
    swipingWin,
    swipeDistance,
    swipeStartX,
    setEditingId,
    setFormData,
    setSwipingWin,
    setSwipeDistance,
    deleteChrono,
    updateChrono,
    addWin,
    removeWin,
    fetchChronos,
  }
}
