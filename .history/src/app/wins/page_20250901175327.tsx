'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWins } from '../lib/fetchWins'
import PostWinForm from '../components/PostWins'
import WinPreviewGrid from '../components/WinPreviewGrid'
import { motion } from 'framer-motion'

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
    <div className="min-h-screen px-6 py-16 flex flex-col items-center space-y-16 bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 max-w-2xl"
      >
        <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Only Ws in the Chat
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Drop your latest wins. Big or small, they all count.
        </p>
      </motion.div>

      {/* Post Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full max-w-3xl"
      >
        <PostWinForm />
      </motion.div>

      {/* Preview Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="w-full max-w-5xl space-y-8"
      >
        <WinPreviewGrid />
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/winners')}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-200"
          >
            Explore More Wins →
          </button>
        </div>
      </motion.div>
    </div>
  )
}
