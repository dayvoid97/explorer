'use client'

import React, { useEffect, useState } from 'react'
import { getToken } from '../lib/auth'

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface SavedWin {
  id: string
  title: string
  paragraphs: string[]
  upvotes: number
  isPrivate: boolean
  createdAt: string
  savedAt: string
}

export default function SavedWins() {
  const [wins, setWins] = useState<SavedWin[]>([])

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const token = getToken()
        const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/gurkha/wins/fetchSaves`, {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const data = await res.json()

        if (!Array.isArray(data)) {
          if (Array.isArray(data.savedWins)) {
            setWins(data.savedWins)
          } else {
            console.error('Expected an array, got:', data)
            setWins([])
          }
          return
        }

        setWins(data)
      } catch (err) {
        console.error('Failed to fetch saved wins:', err)
        setWins([]) // fallback
      }
    }

    fetchSaved()
  }, [])

  if (wins.length === 0) return null

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">🔖 Saved Wins</h2>
      <div className="space-y-4">
        {wins.map((win) => (
          <div key={win.id} className="relative border border-gray-200 rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-2xl">{win.title}</h3>
            <p className="text-sm">Saved on: {new Date(win.savedAt).toLocaleString()}</p>
            <p className="text-xs mb-2">
              Originally posted: {new Date(win.createdAt).toLocaleDateString()}
            </p>
            <p className="line-clamp-3">{win.paragraphs[0]}</p>
            <p className="text-xs mt-2">Upvotes: {win.upvotes}</p>
            <p className="text-xs mt-1">{win.isPrivate ? '🔒 Private' : '🌐 Public'}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
