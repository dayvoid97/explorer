'use client'

import React from 'react'

interface Win {
  id: string
  user: string
  content: string
  date: string
}

const mockWins: Win[] = [
  {
    id: '1',
    user: 'Jules',
    content: 'Today marks 10 days sober. I’m proud of myself.',
    date: '2025-05-25',
  },
  {
    id: '2',
    user: 'Alex',
    content: 'Just won $1000 on a sports bet. Manifestation is real.',
    date: '2025-05-24',
  },
  {
    id: '3',
    user: 'Sam',
    content: 'Reconnected with my partner after 8 months apart.',
    date: '2025-05-23',
  },
]

export default function WinsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-4">Post Your Ws 🏆</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8">
        Life’s full of battles, and this is where we celebrate the wins — big or small. Share your
        journey. Inspire others.
      </p>

      <div className="space-y-6">
        {mockWins.map((win) => (
          <div
            key={win.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-100 dark:border-gray-700"
          >
            <p className="text-gray-800 dark:text-gray-200 text-lg italic">“{win.content}”</p>
            <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              — {win.user} on {new Date(win.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
