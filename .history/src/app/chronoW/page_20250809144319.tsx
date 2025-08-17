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
}

export default function ChronoWExplorer() {
  const [chronologies, setChronologies] = useState<Chronology[]>([])

  useEffect(() => {
    const fetchChronologies = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/explore`)
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      console.log(data)
      setChronologies((data.chronologies || []).filter((c: any) => c.id))
      setChronologies(data.chronologies || [])
    }
    fetchChronologies()
  }, [])

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-white">🔥 chronoDubs Explorer</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {chronologies
          .filter((c) => c.id)
          .map((c) => (
            <ChronologyCard key={c.id} {...c} />
          ))}
      </div>
    </section>
  )
}
