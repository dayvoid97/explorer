'use client'

import React, { useEffect, useState } from 'react'
import ChronologyCard from '../components/ChronologyCard'

interface Chronology {
  id: string
  name: string
  description: string
  createdAt: number
  createdBy: string
  categories: string[]
  collaborators?: string[]
  stats?: {
    winsCount: number
    totalUpvotes: number
    totalViews: number
    totalCelebrations: number
    totalComments: number
    lastWinAt: number
  }
  creator?: {
    display: string
    pfp: string | null
  }
  previewMedia?: string[] // Array of media URLs for preview
}

export default function ChronoWExplorer() {
  const [chronologies, setChronologies] = useState<Chronology[]>([])

  useEffect(() => {
    const fetchChronologies = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/explore?hydrate=1`
      )
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()

      // Log data to see its structure
      console.log(data)

      // Setting chronologies with the hydrated data (if any)
      setChronologies(data.chronologies || [])
    }

    fetchChronologies()
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl mb-10">ChronoloWgy by Financial Gurkha</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {chronologies
          .filter((c) => c.id) // Ensure that the chronology has an ID
          .map((c) => (
            <ChronologyCard key={c.id} {...c} />
          ))}
      </div>
    </section>
  )
}
