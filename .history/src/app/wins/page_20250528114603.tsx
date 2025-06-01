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
    <div className="min-h-screen px-4 py-12 flex flex-col items-center space-y-12">
      {/* Heading */}
      <div className="text-center space-y-3 max-w-2xl">
        <h1 className="text-4xl font-extrabold text-white">🏆 Celebrate the Wins</h1>
        <p className="text-md text-gray-300">
          From personal growth to joyful milestones — this wall celebrates every kind of win.
        </p>
      </div>

      {/* Post Form */}
      <div className="w-full max-w-3xl">
        <PostWinForm />
      </div>

      {/* Preview Section */}
      <div className="w-full max-w-5xl space-y-6">
        <h2 className="text-center text-2xl font-semibold text-white">
          🌟 See what other winners are sharing
        </h2>
        <WinPreviewGrid />
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/winners')}
            className="px-6 py-2 rounded-full bg-white text-black font-semibold shadow hover:bg-gray-200 transition"
          >
            Explore More Wins →
          </button>
        </div>
      </div>
    </div>
  )
}
