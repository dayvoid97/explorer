'use client'

import React, { useEffect, useState } from 'react'
import { fetchWins } from '@/lib/api/fetchWins'
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">🎖️ Recent Wins</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wins.map((win) => (
          <WinCard key={win.id} win={win} />
        ))}
      </div>
    </div>
  )
}
