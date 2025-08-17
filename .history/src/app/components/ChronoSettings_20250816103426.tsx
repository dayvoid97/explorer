'use client'

import React, { useEffect, useState, useRef } from 'react'
import { authFetch } from '../lib/api'
import { Edit3, Trash2, Plus, Save, X, Clock, ChevronDown, ChevronUp, Calendar } from 'lucide-react'

type Win = {
  winId: string
  addedAt?: number
  addedToChronologyAt?: number
  createdAt?: number
  title?: string
  description?: string
  category?: string
}

type Chronology = {
  id: string
  name: string
  description?: string
  categories?: string[]
  createdAt: number
  winIds: { winId: string; addedAt?: number }[]
  wins?: Win[]
}

export default function MyChronologies() {
  const [chronologies, setChronologies] = useState<Chronology[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Chronology>>({})
  const [expandedChronology, setExpandedChronology] = useState<string | null>(null)
  const [newWinId, setNewWinId] = useState('')
  const [operationLoading, setOperationLoading] = useState<string | null>(null)
  const [swipingWin, setSwipingWin] = useState<string | null>(null)
  const [swipeDistance, setSwipeDistance] = useState(0)
  const swipeStartX = useRef(0)
  const swipeThreshold = 100 // pixels

  // Fetch chronologies from your API
  useEffect(() => {
    const fetchChronologies = async () => {
      try {
        const res = await authFetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/chronologies`,
          { method: 'GET' }
        )

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.message || 'Failed to fetch chronologies')
        }

        const data = await res.json()
        setChronologies(data.chronologies || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchChronologies()
  }, [])

  // Delete chronology
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will remove all win references.')) return

    setOperationLoading(`delete-${id}`)
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/chronologies/${id}`,
        { method: 'DELETE' }
      )

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Failed to delete chronology')
      }

      setChronologies((prev) => prev.filter((c) => c.id !== id))
      if (expandedChronology === id) setExpandedChronology(null)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setOperationLoading(null)
    }
  }

  // Start editing
  const startEdit = (chrono: Chronology) => {
    setEditingId(chrono.id)
    setFormData({
      name: chrono.name,
      description: chrono.description,
      categories: chrono.categories || [],
    })
  }

  // Save edit
  const handleEditSubmit = async (id: string) => {
    setOperationLoading(`edit-${id}`)
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/chronologies/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Failed to update chronology')
      }

      setChronologies((prev) => prev.map((c) => (c.id === id ? { ...c, ...formData } : c)))
      setEditingId(null)
      setFormData({})
    } catch (err: any) {
      alert(err.message)
    } finally {
      setOperationLoading(null)
    }
  }

  // Add win to chronology
  const handleAddWin = async (chronologyId: string) => {
    if (!newWinId.trim()) return

    setOperationLoading(`add-win-${chronologyId}`)
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/chronologies/${chronologyId}/wins/${newWinId}`,
        { method: 'POST' }
      )

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Failed to add win')
      }

      // Refresh chronologies to get updated win data
      const refreshRes = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/chronologies`,
        { method: 'GET' }
      )
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json()
        setChronologies(refreshData.chronologies || [])
      }

      setNewWinId('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setOperationLoading(null)
    }
  }

  // Remove win from chronology
  const handleRemoveWin = async (chronologyId: string, winId: string) => {
    setOperationLoading(`remove-win-${winId}`)
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/chronologies/${chronologyId}/wins/${winId}`,
        { method: 'DELETE' }
      )

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Failed to remove win')
      }

      // Update local state
      setChronologies((prev) =>
        prev.map((c) =>
          c.id === chronologyId
            ? {
                ...c,
                winIds: c.winIds.filter((w) => w.winId !== winId),
                wins: c.wins?.filter((w) => w.winId !== winId) || [],
              }
            : c
        )
      )
    } catch (err: any) {
      alert(err.message)
    } finally {
      setOperationLoading(null)
      setSwipingWin(null)
      setSwipeDistance(0)
    }
  }

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent, winId: string) => {
    swipeStartX.current = e.touches[0].clientX
    setSwipingWin(winId)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swipingWin) return

    const currentX = e.touches[0].clientX
    const distance = swipeStartX.current - currentX

    if (distance > 0) {
      // Only swipe left
      setSwipeDistance(Math.min(distance, 120)) // Cap at 120px
    }
  }

  const handleTouchEnd = () => {
    if (swipeDistance > swipeThreshold && swipingWin) {
      // Auto-remove if swiped far enough
      const chronology = chronologies.find((c) => c.wins?.some((w) => w.winId === swipingWin))
      if (chronology) {
        handleRemoveWin(chronology.id, swipingWin)
      }
    } else {
      // Reset swipe
      setSwipingWin(null)
      setSwipeDistance(0)
    }
  }

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent, winId: string) => {
    swipeStartX.current = e.clientX
    setSwipingWin(winId)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!swipingWin) return

    const distance = swipeStartX.current - e.clientX
    if (distance > 0) {
      setSwipeDistance(Math.min(distance, 120))
    }
  }

  const handleMouseUp = () => {
    handleTouchEnd()
  }

  const toggleChronology = (chronologyId: string) => {
    setExpandedChronology((prev) => (prev === chronologyId ? null : chronologyId))
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chronologies...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Chronology Management</h1>
        <p className="text-gray-600">Edit your Chronology Metadata and Dubs</p>
      </div>

      {chronologies.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No chronologies yet</h3>
          <p className="text-gray-500">Create your first chronology to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {chronologies.map((chrono) => (
            <div key={chrono.id} className="border rounded-lg overflow-hidden">
              {editingId === chrono.id ? (
                // Edit mode
                <div className="p-4 bg-gray-50">
                  <div className="space-y-3">
                    <input
                      value={formData.name || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Chronology name"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      placeholder="Description"
                      rows={2}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditSubmit(chrono.id)}
                        disabled={operationLoading === `edit-${chrono.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        {operationLoading === `edit-${chrono.id}` ? (
                          <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full"></div>
                        ) : (
                          <Save className="w-3 h-3" />
                        )}
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Chronology Header */}
                  <div className="p-4 bg-white hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center gap-3 cursor-pointer flex-1"
                        onClick={() => toggleChronology(chrono.id)}
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg">{chrono.name}</h3>
                          {chrono.description && (
                            <p className="text-sm text-gray-600 mt-1">{chrono.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {chrono.wins?.length || 0} wins
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(chrono.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-gray-400">
                          {expandedChronology === chrono.id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            startEdit(chrono)
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(chrono.id)
                          }}
                          disabled={operationLoading === `delete-${chrono.id}`}
                          className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {operationLoading === `delete-${chrono.id}` ? (
                            <div className="animate-spin h-4 w-4 border border-gray-400 border-t-transparent rounded-full"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Win Management */}
                  {expandedChronology === chrono.id && (
                    <div className="border-t bg-gray-50">
                      {/* Add Win Section */}
                      <div className="p-4 border-b bg-white">
                        <div className="flex gap-2 items-end">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Add Win to Chronology
                            </label>
                            <input
                              type="text"
                              value={newWinId}
                              onChange={(e) => setNewWinId(e.target.value)}
                              placeholder="Enter Win ID"
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddWin(chrono.id)
                                }
                              }}
                            />
                          </div>
                          <button
                            onClick={() => handleAddWin(chrono.id)}
                            disabled={
                              !newWinId.trim() || operationLoading === `add-win-${chrono.id}`
                            }
                            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 h-fit"
                          >
                            {operationLoading === `add-win-${chrono.id}` ? (
                              <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full"></div>
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Wins List */}
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Wins in Chronology ({chrono.wins?.length || 0})
                        </h4>
                        {!chrono.wins || chrono.wins.length === 0 ? (
                          <p className="text-gray-500 text-sm italic">
                            No wins in this chronology yet.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {chrono.wins.map((win) => (
                              <div
                                key={win.winId}
                                className="relative bg-white border border-gray-200 rounded-lg overflow-hidden"
                                onTouchStart={(e) => handleTouchStart(e, win.winId)}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onMouseDown={(e) => handleMouseDown(e, win.winId)}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                                style={{
                                  transform:
                                    swipingWin === win.winId
                                      ? `translateX(-${swipeDistance}px)`
                                      : 'translateX(0)',
                                  transition:
                                    swipingWin === win.winId ? 'none' : 'transform 0.2s ease-out',
                                }}
                              >
                                <div className="p-3 flex items-center justify-between">
                                  <div className="flex-1">
                                    {win.title && (
                                      <div className="text-sm text-gray-600">{win.title}</div>
                                    )}
                                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                                      {win.createdAt && (
                                        <span className="flex items-center gap-1">
                                          <Calendar className="w-3 h-3" />
                                          Created {new Date(win.createdAt).toLocaleDateString()}
                                        </span>
                                      )}
                                      {win.addedToChronologyAt && (
                                        <span>
                                          Added{' '}
                                          {new Date(win.addedToChronologyAt).toLocaleDateString()}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {swipingWin === win.winId && swipeDistance > 50 && (
                                    <div className="text-red-600 text-sm font-medium">
                                      {swipeDistance > swipeThreshold
                                        ? 'Release to remove'
                                        : 'Swipe to remove'}
                                    </div>
                                  )}
                                </div>

                                {/* Swipe reveal delete button */}
                                <div
                                  className="absolute top-0 right-0 h-full w-20 bg-red-500 flex items-center justify-center"
                                  style={{
                                    transform: `translateX(${
                                      swipingWin === win.winId
                                        ? Math.max(0, 80 - swipeDistance)
                                        : 80
                                    }px)`,
                                    transition:
                                      swipingWin === win.winId ? 'none' : 'transform 0.2s ease-out',
                                  }}
                                >
                                  {operationLoading === `remove-win-${win.winId}` ? (
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                  ) : (
                                    <Trash2 className="w-5 h-5 text-white" />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {(chrono.wins?.length || 0) > 0 && (
                          <p className="text-xs text-gray-500 mt-4 italic">
                            💡 Tip: Swipe left on any win to remove it from this chronology
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
