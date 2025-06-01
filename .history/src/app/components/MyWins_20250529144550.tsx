'use client'

import React from 'react'
import { WinEntry } from '../profile/page'
import { EyeOff, Lock, Delete } from 'lucide-react' // or use 🔒 emoji instead

export default function MyWins({ wins }: { wins: WinEntry[] }) {
  const handleMakePrivate = async (id: string) => {
    try {
      await fetch(`/api/wins/${id}/privacy`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPrivate: true }),
      })
      // Optional: trigger a refresh or state update
      console.log('Win marked private')
    } catch (err) {
      console.error('Failed to update win privacy', err)
    }
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
            {/* Lock Button */}
            {!win.isPrivate && (
              <button
                onClick={() => handleMakePrivate(win.id)}
                title="Make Private"
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-black transition"
              >
                <Lock className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => handleMakePrivate(win.id)}
              title="Make Private"
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-black transition"
            >
              <Delete className="w-5 h-5" />
            </button>

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
