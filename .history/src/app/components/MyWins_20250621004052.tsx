'use client'

import React, { useState } from 'react'
import { Lock, Eye, Trash2 } from 'lucide-react'
import { getToken } from '../lib/auth'

export interface WinEntry {
  id: string
  title: string
  createdAt: string
  preview: string
  upvotes: number
  isPrivate: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function MyWins({ wins }: { wins: WinEntry[] }) {
  const [myWins, setMyWins] = useState(wins)

  const updateWinLocal = (id: string, update: Partial<WinEntry>) => {
    setMyWins((prev) => prev.map((win) => (win.id === id ? { ...win, ...update } : win)))
  }

  const removeWinLocal = (id: string) => {
    setMyWins((prev) => prev.filter((win) => win.id !== id))
  }

  const handleTogglePrivacy = async (id: string, current: boolean) => {
    const token = getToken()
    try {
      const res = await fetch(`${API_URL}/gurkha/wins/${id}/privacy`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPrivate: !current }),
      })

      if (!res.ok) throw new Error('Failed to toggle privacy')

      const data = await res.json()
      updateWinLocal(id, { isPrivate: data.isPrivate })
    } catch (err) {
      console.error('❌ Failed to toggle privacy', err)
    }
  }

  const handleDelete = async (id: string) => {
    const token = getToken()
    const confirmDelete = window.confirm('Are you sure you want to delete this win?')
    if (!confirmDelete) return

    try {
      await fetch(`${API_URL}/gurkha/wins/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      removeWinLocal(id)
    } catch (err) {
      console.error('❌ Failed to delete win', err)
    }
  }

  if (!myWins || myWins.length === 0) return null

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 tracking-tight">🏅 My Wins</h2>

      <div className="space-y-6">
        {myWins.map((win) => (
          <div
            key={win.id}
            className="relative border rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-sm transition hover:shadow-md"
          >
            {/* Action Buttons */}
            <div className="absolute top-3 right-4 flex items-center gap-3">
              {/* Privacy Toggle */}
              <button
                onClick={() => handleTogglePrivacy(win.id, win.isPrivate)}
                title={win.isPrivate ? 'Make Public (🌐)' : 'Make Private (🔒)'}
                className={`p-1.5 rounded-full transition ${
                  win.isPrivate
                    ? 'text-yellow-600 hover:text-yellow-800'
                    : 'text-green-600 hover:text-green-800'
                }`}
              >
                {win.isPrivate ? (
                  <Lock className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Eye className="w-5 h-5" aria-hidden="true" />
                )}
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(win.id)}
                title="Delete Win"
                className="p-1.5 rounded-full text-gray-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold leading-snug mb-2">{win.title}</h3>

            {/* Meta */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {new Date(win.createdAt).toLocaleDateString()}
            </p>

            {/* Preview */}
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {win.preview}
            </p>

            {/* Footnotes */}
            <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between pt-2">
              <span>👍 {win.upvotes} upvotes</span>
              <span>{win.isPrivate ? '🔒 Private' : '🌐 Public'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
