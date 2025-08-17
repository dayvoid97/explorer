'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWins } from '../lib/fetchWins'
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
        <h1 className="text-4xl">Only Ws in the Chat</h1>
      </div>

      {/* Post Form */}
      <div className="w-full max-w-3xl">
        <PostWinForm />
      </div>

      {/* Preview Section */}
      <div className="w-full max-w-5xl space-y-6">
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
