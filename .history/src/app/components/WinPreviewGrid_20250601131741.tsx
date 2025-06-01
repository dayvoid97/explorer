'use client'

import React, { useEffect, useState } from 'react'
import { fetchWins } from '../lib/fetchWins'
import WinCard from './WinCard'

export default function WinPreviewGrid() {
  const [wins, setWins] = useState<any[]>([])

  useEffect(() => {
    const getData = async () => {
      const data = await fetchWins()
      setWins(data.slice(0, 3)) // preview only 3
    }
    getData()
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4">
      <h2 className="text-2xl font-bold dark:text-white">🎖️ Recent Wins</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {wins.map((win) => (
          <WinCard key={win.id} win={win} />
        ))}
      </div>
    </div>
  )
}
