'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Win {
  id: string
  title: string
  preview: string
  createdAt: string
  upvotes: number
}

interface Chronology {
  id: string
  name: string
  createdBy: string
  createdAt: number
}

export default function ChronologyDetailPage() {
  const { chronologyId } = useParams()
  const [chronology, setChronology] = useState<Chronology | null>(null)
  const [wins, setWins] = useState<Win[]>([])

  useEffect(() => {
    const fetchChain = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/${chronologyId}/chain`
      )
      const data = await res.json()
      setChronology(data.chronology)
      setWins(data.wins)
    }
    if (chronologyId) fetchChain()
  }, [chronologyId])

  if (!chronology) return <p className="text-center text-white">Loading...</p>

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-2">{chronology.name}</h1>
      <p className="text-sm text-gray-400 mb-6">By {chronology.createdBy}</p>

      <div className="space-y-6 border-l-2 border-blue-500 pl-6 relative">
        {wins.map((win, i) => (
          <div key={win.id} className="relative">
            <div className="absolute -left-[18px] top-2 w-3 h-3 bg-blue-500 rounded-full"></div>
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
              <h3 className="text-white font-semibold">{win.title}</h3>
              <p className="text-gray-300 text-sm mt-1">{win.preview}</p>
              <p className="text-xs text-gray-500 mt-2">
                🗓 {new Date(win.createdAt).toLocaleDateString()} • 👍 {win.upvotes}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
