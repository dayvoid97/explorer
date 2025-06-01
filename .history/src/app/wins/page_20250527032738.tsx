'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWins } from '../lib/fetchWins'
import WinCard from '../components/WinCard'
import PostWinForm from '../components/PostWins'
import WinPreviewGrid from '../components/WinPreviewGrid'

export default function WinnersPage() {
  const [wins, setWins] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const data = await fetchWins()
      setWins(data)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-yellow-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12 flex flex-col items-center space-y-12">
      <div className="text-center space-y-3 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-yellow-700 dark:text-yellow-300">
          🏆 Celebrate the Wins
        </h1>
        <p className="text-md text-gray-700 dark:text-gray-300">
          From personal growth to joyful milestones — this wall celebrates every kind of win.
        </p>
      </div>

      <div className="w-full max-w-3xl">
        <PostWinForm />
      </div>

      <div className="w-full max-w-5xl space-y-6">
        <h2 className="text-center text-2xl font-semibold text-yellow-800 dark:text-yellow-200">
          🌟 See what other winners are sharing
        </h2>
        <WinPreviewGrid />
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/winners')}
            className="px-6 py-2 rounded-full bg-yellow-600 text-white font-medium shadow hover:bg-yellow-700 transition"
          >
            Explore More Wins →
          </button>
        </div>
      </div>
    </div>
  )
}
