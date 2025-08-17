'use client'

import React, { useEffect, useState } from 'react'
import { authFetch } from '../lib/api'

type Chronology = {
  id: string
  name: string
  description?: string
  categories?: string[]
  createdAt: number
}

export default function MyChronologies() {
  const [chronologies, setChronologies] = useState<Chronology[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Chronology>>({})

  // fetch chronologies
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chronology?')) return

    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/chronologies/${id}`,
        { method: 'DELETE' }
      )
      if (!res.ok) throw new Error('Failed to delete chronology')

      setChronologies((prev) => prev.filter((c) => c.id !== id))
    } catch (err: any) {
      alert(err.message)
    }
  }

  const startEdit = (chrono: Chronology) => {
    setEditingId(chrono.id)
    setFormData({
      name: chrono.name,
      description: chrono.description,
      categories: chrono.categories || [],
    })
  }

  const handleEditSubmit = async (id: string) => {
    try {
      const res = await authFetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/users/chronologies/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )

      if (!res.ok) throw new Error('Failed to update chronology')

      const updated = await res.json()
      setChronologies((prev) => prev.map((c) => (c.id === id ? updated.chronology : c)))
      setEditingId(null)
      setFormData({})
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (loading) {
    return <div className="p-4 text-gray-500">Loading your chronologies...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>
  }

  if (chronologies.length === 0) {
    return (
      <div className="p-4 text-gray-600 text-sm">You haven’t created any chronologies yet.</div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Manage Chronologies</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {chronologies.map((chrono) => (
          <div
            key={chrono.id}
            className="border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition"
          >
            {editingId === chrono.id ? (
              <div className="space-y-2">
                <input
                  className="w-full border rounded p-2 text-sm"
                  value={formData.name || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Chronology Name"
                />
                <textarea
                  className="w-full border rounded p-2 text-sm"
                  value={formData.description || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Description"
                />
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                  onClick={() => handleEditSubmit(chrono.id)}
                >
                  Save
                </button>
                <button
                  className="px-3 py-1 bg-gray-400 text-white rounded text-sm ml-2"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-medium text-lg text-gray-800">{chrono.name}</h3>

                {chrono.description && (
                  <p className="text-sm text-gray-600 mt-1">{chrono.description}</p>
                )}

                {chrono.categories && chrono.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {chrono.categories.map((cat) => (
                      <span
                        key={cat}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3">
                  Created {new Date(chrono.createdAt).toLocaleDateString()}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                    onClick={() => startEdit(chrono)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                    onClick={() => handleDelete(chrono.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
