'use client'

import React from 'react'
import { WinEntry } from '../profile/page'

export default function MyWins({ wins }: { wins: WinEntry[] }) {
  if (!wins || wins.length === 0) return null

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🏅 My Wins</h2>
      <div className="space-y-4">
        {wins.map((win) => (
          <div key={win.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-lg text-blue-700">{win.title}</h3>
            <p className="text-sm text-gray-600 mb-1">
              {new Date(win.createdAt).toLocaleDateString()}
            </p>
            <p className="text-gray-800">{win.preview}</p>
            <p className="text-xs text-gray-500 mt-2">Upvotes: {win.upvotes}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
