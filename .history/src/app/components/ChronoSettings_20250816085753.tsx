'use client'

import React, { useEffect, useState } from 'react'
import { authFetch } from '../lib/api'
import { Edit3, Trash2, Plus, Save, X, Clock } from 'lucide-react'

type Win = {
  winId: string
  addedAt: number
}
type Chronology = {
  id: string
  name: string
  description?: string
  categories?: string[]
  createdAt: number
  winIds: Win[]
}

export default function MyChronologies() {
  const [chronologies, setChronologies] = useState<Chronology[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Chronology>>({})
  const [selectedChronology, setSelectedChronology] = useState<string | null>(null)
  const [newWinId, setNewWinId] = useState('')
  const [operationLoading, setOperationLoading] = useState<string | null>(null)

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
      if (selectedChronology === id) setSelectedChronology(null)
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

      const updated = await res.json()
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

      // Update local state
      setChronologies((prev) =>
        prev.map((c) =>
          c.id === chronologyId
            ? { ...c, winIds: [...c.winIds, { winId: newWinId, addedAt: Date.now() }] }
            : c
        )
      )
      setNewWinId('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setOperationLoading(null)
    }
  }

  // Remove win from chronology
  const handleRemoveWin = async (chronologyId: string, winId: string) => {
    if (!confirm('Remove this win from the chronology?')) return

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
          c.id === chronologyId ? { ...c, winIds: c.winIds.filter((w) => w.winId !== winId) } : c
        )
      )
    } catch (err: any) {
      alert(err.message)
    } finally {
      setOperationLoading(null)
    }
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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Manage Chronologies</h1>
        <p className="text-gray-600">Edit your chronologies and manage their wins</p>
      </div>

      {chronologies.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No chronologies yet</h3>
          <p className="text-gray-500">Create your first chronology to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Chronologies List */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Chronologies</h2>
            {chronologies.map((chrono) => (
              <div
                key={chrono.id}
                className={`border rounded-lg p-4 transition-colors ${
                  selectedChronology === chrono.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {editingId === chrono.id ? (
                  // Edit mode
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
                ) : (
                  // Display mode
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3
                        className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                        onClick={() =>
                          setSelectedChronology(selectedChronology === chrono.id ? null : chrono.id)
                        }
                      >
                        {chrono.name}
                      </h3>
                      <div className="flex gap-1">
                        <button
                          onClick={() => startEdit(chrono)}
                          className="p-1 text-gray-400 hover:text-blue-600 rounded"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(chrono.id)}
                          disabled={operationLoading === `delete-${chrono.id}`}
                          className="p-1 text-gray-400 hover:text-red-600 rounded disabled:opacity-50"
                        >
                          {operationLoading === `delete-${chrono.id}` ? (
                            <div className="animate-spin h-4 w-4 border border-gray-400 border-t-transparent rounded-full"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {chrono.description && (
                      <p className="text-sm text-gray-600 mb-2">{chrono.description}</p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{chrono.winIds.length} wins</span>
                      <span>Created {new Date(chrono.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Win Management Panel */}
          <div>
            {selectedChronology ? (
              <div className="border rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Manage Wins: {chronologies.find((c) => c.id === selectedChronology)?.name}
                </h2>

                {/* Add Win */}
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Win to Chronology
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newWinId}
                      onChange={(e) => setNewWinId(e.target.value)}
                      placeholder="Enter Win ID"
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleAddWin(selectedChronology)}
                      disabled={
                        !newWinId.trim() || operationLoading === `add-win-${selectedChronology}`
                      }
                      className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      {operationLoading === `add-win-${selectedChronology}` ? (
                        <div className="animate-spin h-3 w-3 border border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                      Add
                    </button>
                  </div>
                </div>

                {/* Current Wins */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Current Wins</h3>
                  {chronologies.find((c) => c.id === selectedChronology)?.winIds.length === 0 ? (
                    <p className="text-gray-500 text-sm">No wins in this chronology yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {chronologies
                        .find((c) => c.id === selectedChronology)
                        ?.winIds.map((win) => (
                          <div
                            key={win.winId}
                            className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded"
                          >
                            <div>
                              <span className="text-sm font-medium">{win.winId}</span>
                              <p className="text-xs text-gray-500">
                                Added {new Date(win.addedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveWin(selectedChronology, win.winId)}
                              disabled={operationLoading === `remove-win-${win.winId}`}
                              className="p-1 text-gray-400 hover:text-red-600 rounded disabled:opacity-50"
                            >
                              {operationLoading === `remove-win-${win.winId}` ? (
                                <div className="animate-spin h-4 w-4 border border-gray-400 border-t-transparent rounded-full"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-8 text-center text-gray-500">
                <Clock className="mx-auto h-8 w-8 mb-2" />
                <p>Select a chronology to manage its wins</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
