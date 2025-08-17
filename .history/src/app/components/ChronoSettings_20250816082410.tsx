'use client'

import React, { useEffect, useState } from 'react'
import { authFetch } from '@/lib/authFetch' // adjust path if needed

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
      <h2 className="text-xl font-semibold text-gray-900">My Chronologies</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {chronologies.map((chrono) => (
          <div
            key={chrono.id}
            className="border border-gray-200 rounded-xl shadow-sm p-4 hover:shadow-md transition"
          >
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
          </div>
        ))}
      </div>
    </div>
  )
}
