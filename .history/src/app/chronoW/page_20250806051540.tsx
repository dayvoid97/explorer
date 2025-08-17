'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface Chronology {
  id: string
  name: string
  createdAt: number
  createdBy: string
}

export default function ChronoWExplorer() {
  const [chronologies, setChronologies] = useState<Chronology[]>([])

  useEffect(() => {
    const fetchChronologies = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/explore`)
      const data = await res.json()
      setChronologies(data.chronologies || [])
    }
    fetchChronologies()
  }, [])

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-white"> ChronoDubs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {chronologies.map((c) => (
          <Link
            key={c.id}
            href={`/chronoW/${c.id}`}
            className="block bg-gradient-to-br from-gray-900 to-black border border-gray-700 p-4 rounded-lg hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-white">{c.name}</h3>
            <p className="text-sm text-gray-400 mt-1">By {c.createdBy}</p>
            <p className="text-xs text-gray-600 mt-2">
              Created {new Date(c.createdAt).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
