'use client'

import React, { useState, useMemo } from 'react'
import { Lock, Eye, Trash2, Calendar, TrendingUp } from 'lucide-react'
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
  const [visibleCount, setVisibleCount] = useState<number>(8)
  const [sortBy, setSortBy] = useState<'date' | 'popularity'>('date')

  // Sort wins based on selected criteria
  const sortedWins = useMemo(() => {
    const winsCopy = [...myWins]
    if (sortBy === 'date') {
      return winsCopy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } else {
      return winsCopy.sort((a, b) => b.upvotes - a.upvotes)
    }
  }, [myWins, sortBy])

  const handleAuthRedirect = (errMessage = 'Session expired. Please log in again.') => {
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
      if (!res.ok) throw new Error(data.message || data.error || 'Failed to toggle privacy')

      updateWinLocal(id, { isPrivate: data.isPrivate })
    } catch (err: any) {
      console.error('❌ Failed to toggle privacy', err)
      if (err.message.includes('Authentication') || err.message.includes('token')) {
        handleAuthRedirect(err.message)
      } else {
        setApiError(err.message || 'Failed to toggle privacy.')
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this win?')) return
    setApiError(null)
    try {
      const res = await authFetch(`${API_URL}/gurkha/wins/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || data.error || 'Failed to delete win')
      }

      removeWinLocal(id)
    } catch (err: any) {
      console.error('❌ Failed to delete win', err)
      if (err.message.includes('Authentication') || err.message.includes('token')) {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })

      const updated = await res.json()
      if (!res.ok) throw new Error(updated.message || updated.error || 'Failed to update win')

      updateWinLocal(id, { title: updated.title, preview: updated.preview })
      setEditingId(null)
    } catch (err: any) {
      console.error('❌ Failed to save edited win', err)
      if (err.message.includes('Authentication') || err.message.includes('token')) {
        handleAuthRedirect(err.message)
      } else {
        setApiError(err.message || 'Failed to save edited win.')
      }
    }
  }

  return (
    <section className="mb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h2 className="text-3xl font-bold tracking-tight">🥇MY POSTS🥇</h2>

        {/* Sorting Toggle */}
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setSortBy('date')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'date'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Latest
          </button>
          <button
            onClick={() => setSortBy('popularity')}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              sortBy === 'popularity'
                ? 'bg-gray-700 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Popular
          </button>
        </div>
      </div>

      {apiError && <p className="text-red-500 text-sm mb-4">{apiError}</p>}

      {myWins.length === 0 ? (
        <p className="text-gray-500 italic">You haven't posted any wins yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sortedWins.slice(0, visibleCount).map((win) => {
              const isEditing = editingId === win.id
              return (
                <div
                  key={win.id}
                  className="relative rounded-2xl border border-gray-800 p-4 bg-gradient-to-br from-gray-950 to-black shadow-md hover:shadow-lg transition-all"
                >
                  {/* Header & Actions */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1 flex-1 mr-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded p-2 text-sm"
                        />
                      ) : (
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 flex-wrap">
                          {win.title}
                          <Chronology
                            winId={win.id}
                            userChronologies={userChronologies}
                            winCreatedAt={win.createdAt}
                            onChronologyAdded={(chronologyId, name) => {
                              if (!userChronologies.some((c) => c.id === chronologyId)) {
                                userChronologies.push({ id: chronologyId, name })
                              }
                            }}
                          />
                        </h3>
                      )}
                      <p className="text-xs text-gray-500">
                        {new Date(win.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditInit(win)}
                        className="text-gray-400 hover:text-blue-400 transition"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleTogglePrivacy(win.id, win.isPrivate)}
                        className={`rounded-full p-1.5 ${
                          win.isPrivate
                            ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                            : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                        }`}
                        title={win.isPrivate ? 'Make Public' : 'Make Private'}
                      >
                        {win.isPrivate ? <Lock className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(win.id)}
                        className="text-gray-400 hover:text-red-400 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="mt-4">
                    {isEditing ? (
                      <textarea
                        rows={4}
                        value={editData.preview}
                        onChange={(e) => setEditData({ ...editData, preview: e.target.value })}
                        className="w-full bg-gray-800 text-white border border-gray-600 rounded p-2 text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-300">{win.preview}</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex justify-between items-center text-xs text-gray-500 border-t border-gray-800 pt-2">
                    <span className="flex items-center gap-1">
                      👍 <span className="font-medium">{win.upvotes}</span> upvotes
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide font-semibold ${
                        win.isPrivate
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-green-500/10 text-green-400'
                      }`}
                    >
                      {win.isPrivate ? 'Private' : 'Public'}
                    </span>
                  </div>

                  {/* Edit Save/Cancel Buttons */}
                  {isEditing && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleEditSave(win.id)}
                        className="text-sm px-3 py-1.5 rounded bg-green-700 text-white hover:bg-green-600"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="text-sm px-3 py-1.5 rounded bg-gray-600 text-white hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Expand / Collapse Button */}
          {myWins.length > 4 && (
            <div className="mt-6 text-center">
              <button
                onClick={() =>
                  setVisibleCount((prev) => (prev < myWins.length ? myWins.length : 4))
                }
                className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-700 transition"
              >
                {visibleCount < myWins.length ? 'Show More' : 'Show Less'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
