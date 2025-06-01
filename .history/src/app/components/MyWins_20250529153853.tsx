'use client'

import React from 'react'
import { WinEntry } from '../profile/page'
import { EyeOff, Lock, Delete, Trash2 } from 'lucide-react'
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

/// fix api url
///hooks for make Private / public put  APUI item
/// hooks for delete DELETE API

export default function MyWins({ wins }: { wins: WinEntry[] }) {
  const handleMakePrivate = async (id: string) => {}

  const handleDelete = async (id: string) => {
    try {
      try {
        await fetch(`${API_URL}/gurkha/wins/${id}/privacy`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        })
        // Optional: trigger a refresh or state update
        console.log('Win marked private')
      } catch (err) {
        console.error('Failed to update win privacy', err)
      }
    } catch {}
  }

  if (!wins || wins.length === 0) return null

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🏅 My Wins</h2>
      <div className="space-y-4">
        {wins.map((win) => (
          <div
            key={win.id}
            className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-4"
          >
            {/* 🔒 Lock + 🗑️ Delete Buttons */}
            <div className="absolute top-2 right-2 flex gap-2">
              {!win.isPrivate && (
                <button
                  onClick={() => handleMakePrivate(win.id)}
                  title="Make Private"
                  className="p-1 text-gray-400 hover:text-black transition"
                >
                  <Lock className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => handleDelete(win.id)}
                title="Delete Win"
                className="p-1 text-gray-400 hover:text-red-600 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <h3 className="font-semibold text-lg text-blue-700">{win.title}</h3>
            <p className="text-sm text-gray-600 mb-1">
              {new Date(win.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-800">{win.preview}</p>
            <p className="text-xs text-gray-500 mt-2">Upvotes: {win.upvotes}</p>

            {win.isPrivate && <p className="text-xs text-red-500 mt-1 font-semibold">🔒 Private</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
