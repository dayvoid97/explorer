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

      <Carousel showThumbs={false} infiniteLoop emulateTouch showIndicators={wins.length > 1}>
        {wins.map((win) => (
          <div
            key={win.id}
            className="group relative px-6 py-5 rounded-xl border border-gray-300 dark:border-gray-700 shadow transition-all duration-300 hover:shadow-lg"
          >
            {/* Remove button */}
            <button
              onClick={async (e) => {
                e.stopPropagation()
                const token = getToken()
                try {
                  const res = await fetch(
                    `${NEXT_PUBLIC_API_BASE_URL}/gurkha/wins/unsave/${win.id}`,
                    {
                      method: 'DELETE',
                      headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                    }
                  )
                  if (res.ok) {
                    setWins((prev) => prev.filter((w) => w.id !== win.id))
                  } else {
                    const data = await res.json()
                    console.error('Failed to remove saved win:', data)
                  }
                } catch (err) {
                  console.error('Error removing saved win:', err)
                }
              }}
              className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Remove
            </button>

            {/* Clickable card */}
            <div
              onClick={() => router.push(`/winners/wincard/${win.id}`)}
              className="cursor-pointer space-y-2"
            >
              <h3 className="text-xl font-semibold line-clamp-2">{win.title}</h3>
              <p className="text-muted-foreground text-sm">
                Originally posted: {new Date(win.createdAt).toLocaleDateString()}
              </p>
              <p className="line-clamp-4 text-sm">{win.paragraphs[0]}</p>
              <p className="text-xs mt-2">Upvotes: {win.upvotes}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  )
}
