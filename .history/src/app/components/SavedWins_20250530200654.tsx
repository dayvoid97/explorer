'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
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
  const router = useRouter()

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
        setWins([])
      }
    }

    fetchSaved()
  }, [])

  if (wins.length === 0) return null

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">🔖 Saved Wins</h2>
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        emulateTouch
        showIndicators={wins.length > 1}
        className="rounded-xl border dark:border-gray-700"
      >
        {wins.map((win) => (
          <div
            key={win.id}
            onClick={() => router.push(`/winners/wincard/${win.id}`)}
            className="cursor-pointer px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-md transition hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
              {win.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Saved on: {new Date(win.savedAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Originally posted: {new Date(win.createdAt).toLocaleDateString()}
            </p>
            <p className="line-clamp-3 text-gray-700 dark:text-gray-300 text-sm">
              {win.paragraphs[0]}
            </p>
            <p className="text-xs mt-2 text-blue-600 dark:text-blue-400">Upvotes: {win.upvotes}</p>
            <p className="text-xs text-gray-500">{win.isPrivate ? '🔒 Private' : '🌐 Public'}</p>
          </div>
        ))}
      </Carousel>
    </section>
  )
}
