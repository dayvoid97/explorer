'use client'

import React, { useState } from 'react'
import { Lock, Eye, Trash2 } from 'lucide-react'
import { getToken } from '../lib/auth'

export interface WinEntry {
  id: string
  title: string
  createdAt: string
  preview: string // stringified version of paragraphs.join('\n')
  upvotes: number
  isPrivate: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function MyWins({ wins }: { wins: WinEntry[] }) {
  const [myWins, setMyWins] = useState(wins)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ title: string; preview: string }>({
    title: '',
    preview: '',
  })

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

  const handleEditInit = (win: WinEntry) => {
    setEditingId(win.id)
    setEditData({ title: win.title, preview: win.preview })
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditData({ title: '', preview: '' })
  }

  const handleEditSave = async (id: string) => {
    const token = getToken()
    try {
      const res = await fetch(`${API_URL}/gurkha/wins/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      })

      if (!res.ok) throw new Error('Failed to update win')

      const updated = await res.json()
      updateWinLocal(id, { title: updated.title, preview: updated.preview })
      setEditingId(null)
    } catch (err) {
      console.error('❌ Failed to save edited win', err)
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
              {/* Edit Button */}
              <button
                onClick={() => handleEditInit(win)}
                title="Edit Win"
                className="text-gray-400 hover:text-blue-500 transition text-xl"
              >
                ✏️
              </button>

              {/* Privacy Toggle */}
              <button
                onClick={() => handleTogglePrivacy(win.id, win.isPrivate)}
                title={win.isPrivate ? 'Make Public' : 'Make Private'}
                className={`p-1.5 rounded-full transition ${
                  win.isPrivate
                    ? 'text-yellow-600 hover:text-yellow-800'
                    : 'text-green-600 hover:text-green-800'
                }`}
              >
                {win.isPrivate ? <Lock className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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

            {/* Editable or Static Content */}
            {editingId === win.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full border rounded p-2 text-sm"
                  placeholder="Title"
                />
                <textarea
                  value={editData.preview}
                  onChange={(e) => setEditData({ ...editData, preview: e.target.value })}
                  className="w-full border rounded p-2 text-sm"
                  placeholder="Preview"
                  rows={4}
                />
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => handleEditSave(win.id)}
                    className="px-3 py-1.5 text-sm rounded bg-green-600 text-white hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="px-3 py-1.5 text-sm rounded bg-gray-300 text-black hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold leading-snug mb-2">{win.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {new Date(win.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  {win.preview}
                </p>
              </>
            )}

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
