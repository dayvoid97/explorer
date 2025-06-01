'use client'

import React, { useState } from 'react'
import { WinProps } from './WinCard'
import { Lock, Eye, Trash2 } from 'lucide-react'
import { getToken } from '../lib/auth'
export interface WinEntry {
  id: string
  title: string
  createdAt: string // ISO string or timestamp
  preview: string // short text/summary for display
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
      await fetch(`${API_URL}/gurkha/wins/${id}/privacy`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isPrivate: !current }),
      })
      updateWinLocal(id, { isPrivate: !current })
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
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">🏅 My Wins</h2>
      <div className="space-y-4">
        {myWins.map((win) => (
          <div key={win.id} className="relative border border-gray-200 rounded-lg shadow-sm p-4">
            {/* 🔒 Lock + 🗑️ Delete Buttons */}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => handleTogglePrivacy(win.id, win.isPrivate)}
                title={win.isPrivate ? 'Make Public' : 'Make Private'}
                className="p-1 text-gray-400 hover:text-black transition"
              >
                {win.isPrivate ? <Lock className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>

              <button
                onClick={() => handleDelete(win.id)}
                title="Delete Win"
                className="p-1 hover:text-red-600 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Win Content */}
            <h3 className="font-semibold text-3xl">{win.title}</h3>
            <p className="text-sm mb-1">{new Date(win.createdAt).toLocaleDateString()}</p>
            <p className="">{win.preview}</p>
            <p className="text-xs mt-2">Upvotes: {win.upvotes}</p>

            <p className="text-xs mt-1">{win.isPrivate ? '🔒 Private' : '🌐 Public'}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
