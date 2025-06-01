'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWins } from '../lib/fetchWins'
import WinCard from './WinCard'
import { ArrowRight } from 'lucide-react'

export default function WinPreviewGrid() {
  const [wins, setWins] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const getData = async () => {
      const data = await fetchWins()
      setWins(data) // ⬅️ no slicing — display all 6 wins
    }
    getData()
  }, [])

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold dark:text-white">🎖️ Recent Wins</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {wins.map((win) => (
          <WinCard key={win.id} win={win} />
        ))}
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => router.push('/wins')}
          className="inline-flex items-center text-blue-600 hover:underline text-sm font-medium"
        >
          See all wins <ArrowRight className="ml-1 w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
