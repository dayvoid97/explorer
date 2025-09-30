'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch } from '../lib/api'
import { getAccessToken } from '../lib/auth'
import { motion } from 'framer-motion'

// Import your card components
import MyCards from '../profile/MyCards'
import SavedCards from '../profile/SavedCards'
import SearchAndAddCard from '../profile/SearchAndAddCard'

// Default static cards for non-logged-in users
const DEFAULT_CARDS = [
  {
    id: 'demo-1',
    title: 'Sample Trading Card',
    description: 'This is an example of what cards look like on our platform',
    category: 'Demo',
    rarity: 'Common',
    imageUrl: '/api/placeholder/300/400',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Legendary Card',
    description: 'Premium cards with special abilities and rare artwork',
    category: 'Demo',
    rarity: 'Legendary',
    imageUrl: '/api/placeholder/300/400',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Epic Adventure',
    description: 'Embark on epic quests with this powerful card',
    category: 'Demo',
    rarity: 'Epic',
    imageUrl: '/api/placeholder/300/400',
    createdAt: new Date().toISOString(),
  },
]

export default function CardExplorerPage() {
  const router = useRouter()
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasToken, setHasToken] = useState(false)
  const [profile, setProfile] = useState<any>(null)

  // Active content state - similar to profile page
  const [activeContent, setActiveContent] = useState<'explore' | 'myCards' | 'savedCards'>(
    'explore'
  )

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setHasToken(false)
      setLoading(false)
      return
    }
    setHasToken(true)
    fetchUserCards()
  }, [])

  const fetchUserCards = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await authFetch(`${API_BASE}/gurkha/profile`)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to fetch profile')
      }
      setProfile(data)
    } catch (err: any) {
      console.error('Failed to fetch user cards:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderActiveContent = () => {
    if (!hasToken) {
      // Show default static content for non-logged-in users
      return (
        <div className="w-full max-w-5xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Discover Amazing Cards
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sign up to collect, trade, and create your own cards!
            </p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-transform duration-200"
            >
              Get Started →
            </button>
          </div>
          <MyCards cards={DEFAULT_CARDS} />
        </div>
      )
    }

    // Logged-in user content
    switch (activeContent) {
      case 'explore':
        return (
          <div className="w-full max-w-5xl space-y-8">
            <SearchAndAddCard />
            <div className="border-t pt-8">
              <h3 className="text-xl font-semibold mb-4 text-center">All Available Cards</h3>
              {/* You can add a component here to show all public cards */}
              <MyCards cards={DEFAULT_CARDS} />
            </div>
          </div>
        )
      case 'myCards':
        return <MyCards cards={profile?.myCards || []} />
      case 'savedCards':
        return <SavedCards />
      default:
        return (
          <div className="w-full max-w-5xl space-y-8">
            <SearchAndAddCard />
            <MyCards cards={DEFAULT_CARDS} />
          </div>
        )
    }
  }

  const handleLoginRedirect = () => {
    router.push('/login')
  }

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
          Card Explorer
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Discover, collect, and trade amazing cards. Build your ultimate collection.
        </p>
      </motion.div>

      {/* Content Toggle Buttons - Only show for logged-in users */}
      {hasToken && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center gap-2 flex-wrap"
        >
          <button
            onClick={() => setActiveContent('explore')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
                activeContent === 'explore'
                  ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
                  : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            Explore Cards
          </button>
          <button
            onClick={() => setActiveContent('myCards')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
                activeContent === 'myCards'
                  ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
                  : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            My Cards
          </button>
          <button
            onClick={() => setActiveContent('savedCards')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
              ${
                activeContent === 'savedCards'
                  ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
                  : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            Saved Cards
          </button>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: hasToken ? 0.4 : 0.2, duration: 0.6 }}
        className="w-full flex justify-center"
      >
        {loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading cards...</p>
        ) : error ? (
          <div className="text-center space-y-4">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchUserCards}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          renderActiveContent()
        )}
      </motion.div>

      {/* Call to Action for non-logged-in users */}
      {!hasToken && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center space-y-4 max-w-md"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4">Ready to Start Collecting?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Join thousands of collectors and traders. Create your account to unlock the full card
              experience.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => router.push('/register')}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-transform duration-200"
              >
                Sign Up
              </button>
              <button
                onClick={handleLoginRedirect}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Log In
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
