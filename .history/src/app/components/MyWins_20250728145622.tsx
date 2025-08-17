'use client'

import React, { useState } from 'react'
import { Lock, Eye, Trash2 } from 'lucide-react'
import { authFetch } from '../lib/api'
import { removeTokens } from '../lib/auth'
import { useRouter } from 'next/navigation'
import Chronology from './Chronology'

export interface WinEntry {
  id: string
  title: string
  createdAt: string
  preview: string
  upvotes: number
  isPrivate: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface MyWinsProps {
  wins: WinEntry[]
  userChronologies: { id: string; name: string }[]
}

export default function MyWins({ wins, userChronologies }: MyWinsProps) {
  const router = useRouter()
  const [myWins, setMyWins] = useState(wins)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<{ title: string; preview: string }>({
    title: '',
    preview: '',
  })
  const [apiError, setApiError] = useState<string | null>(null)

  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setApiError(errMessage)
    removeTokens()
    router.push('/login')
  }

  const updateWinLocal = (id: string, update: Partial<WinEntry>) => {
    setMyWins((prev) => prev.map((win) => (win.id === id ? { ...win, ...update } : win)))
  }

  const removeWinLocal = (id: string) => {
    setMyWins((prev) => prev.filter((win) => win.id !== id))
  }

  const handleTogglePrivacy = async (id: string, current: boolean) => {
    setApiError(null)
    try {
      const res = await authFetch(`${API_URL}/gurkha/wins/${id}/privacy`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPrivate: !current }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to toggle privacy')
      }

      updateWinLocal(id, { isPrivate: data.isPrivate })
    } catch (err: any) {
      console.error('❌ Failed to toggle privacy', err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setApiError(err.message || 'Failed to toggle privacy.')
      }
    }
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this win?')
    if (!confirmDelete) return

    setApiError(null)
    try {
      const res = await authFetch(`${API_URL}/gurkha/wins/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || data.error || 'Failed to delete win')
      }

      removeWinLocal(id)
    } catch (err: any) {
      console.error('❌ Failed to delete win', err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setApiError(err.message || 'Failed to delete win.')
      }
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
    setApiError(null)
    try {
      const res = await authFetch(`${API_URL}/gurkha/wins/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      })

      const updated = await res.json()
      if (!res.ok) {
        throw new Error(updated.message || updated.error || 'Failed to update win')
      }

      updateWinLocal(id, { title: updated.title, preview: updated.preview })
      setEditingId(null)
    } catch (err: any) {
      console.error('❌ Failed to save edited win', err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setApiError(err.message || 'Failed to save edited win.')
      }
    }
  }

  if (!myWins || myWins.length === 0) {
    return (
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 tracking-tight">🏅 My Wins</h2>
        <p className="text-gray-500 dark:text-gray-400 italic">You haven't posted any wins yet.</p>
      </section>
    )
  }

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8 tracking-tight text-gray-900 dark:text-white">
        🏅 My Wins
      </h2>

      {apiError && <p className="text-red-500 dark:text-red-400 text-sm mb-4">{apiError}</p>}

      <div className="space-y-6">
        {myWins.map((win) => (
          <div
            key={win.id}
            className="relative border dark:border-gray-700 rounded-2xl p-6 bg-white dark:bg-gray-900 shadow-sm transition hover:shadow-md"
          >
            {/* Action Buttons */}
            <div className="absolute top-3 right-4 flex items-center gap-3">
              {/* Edit Button */}
              <button
                onClick={() => handleEditInit(win)}
                title="Edit Win"
                className="text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition text-xl"
              >
                ✏️
              </button>
              <div className="flex items-center gap-1">
                {win.isPrivate ? (
                  <>
                    <span className="text-red-600 dark:text-orange-400">Private</span>
                  </>
                ) : (
                  <>
                    <span className="text-green-600 dark:text-green-400">Public</span>
                  </>
                )}
              </div>

              {/* Privacy Toggle - Enhanced with better visual feedback */}
              <button
                onClick={() => handleTogglePrivacy(win.id, win.isPrivate)}
                title={
                  win.isPrivate
                    ? 'Make Public (Currently Private)'
                    : 'Make Private (Currently Public)'
                }
                className={`p-2 rounded-full transition-all duration-200 ${
                  win.isPrivate
                    ? 'bg-orange-100 text-orange-600 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-800/40'
                    : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-800/40'
                }`}
              >
                {win.isPrivate ? <Lock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(win.id)}
                title="Delete Win"
                className="p-1.5 rounded-full text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition"
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
                  className="w-full border rounded p-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="Title"
                />
                <textarea
                  value={editData.preview}
                  onChange={(e) => setEditData({ ...editData, preview: e.target.value })}
                  className="w-full border rounded p-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                  placeholder="Preview"
                  rows={4}
                />
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => handleEditSave(win.id)}
                    className="px-3 py-1.5 text-sm rounded bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="px-3 py-1.5 text-sm rounded bg-gray-300 text-black hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold leading-snug text-gray-900 dark:text-white">
                    {win.title}
                  </h3>
                  <Chronology
                    winId={win.id}
                    userChronologies={userChronologies}
                    winCreatedAt={win.createdAt}
                    onChronologyAdded={(chronologyId, name) => {
                      // Optionally update local state to include the new chronology
                      if (!userChronologies.some((c) => c.id === chronologyId)) {
                        userChronologies.push({ id: chronologyId, name })
                      }
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {new Date(win.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                  {win.preview}
                </p>
              </>
            )}

            {/* Footnotes - Enhanced privacy indicator */}
            <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between pt-2">
              <span>👍 {win.upvotes} upvotes</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
