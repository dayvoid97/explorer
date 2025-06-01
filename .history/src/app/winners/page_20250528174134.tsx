'use client'

import React, { useEffect, useState } from 'react'
import { fetchWins } from '../lib/fetchWins'
import WinCard from '../components/WinCard'

export default function WinnersPage() {
  const [wins, setWins] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await fetchWins()
      setWins(data)
    }
    load()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <h1 className="text-3xl font-bold dark:text-blue-300">🏆 All Wins</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wins.map((win) => (
          <WinCard key={win.id} win={win} />
        ))}
      </div>
    </div>
  )
}
