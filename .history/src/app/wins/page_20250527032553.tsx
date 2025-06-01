'use client'

import React, { useEffect, useState } from 'react'
import { fetchWins } from '../lib/fetchWins'
import WinCard from '../components/WinCard'
import PostWinForm from '../components/PostWins'
import { getToken } from '../lib/auth'
import WinPreviewGrid from '../components/WinPreviewGrid'

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
    <div className="min-h-screen max-w-7xl mx-auto px-6 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-300">
          🏆 Celebrate the Wins
        </h1>
        <p className="text-md text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          From recovery milestones to life breakthroughs — this wall celebrates every kind of win.
        </p>
      </div>
      <PostWinForm />

      <div className="grid ">
        {wins.map((win) => (
          <WinPreviewGrid key={win.id} />
        ))}
      </div>
    </div>
  )
}
