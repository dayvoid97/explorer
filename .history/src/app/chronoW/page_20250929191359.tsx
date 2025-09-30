'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, Brain, TrendingUp, Eye } from 'lucide-react'
import ChronologyCard from '../components/ChronologyCard'
import { authFetch } from '../lib/api'
import { getAccessToken } from '../lib/auth'

// Import our new components and hook
import { useUnauthenticatedPrompt } from '../hooks/useUnauthenticatedPrompt'
import { KnowledgeAccessPrompt } from '../components/KnowledgeAccessPrompt'
import { KnowledgeWelcomeSection } from '../components/KnowledgeWelcomeSection'
import { KnowledgeFeatureGrid } from '../components/KnowledgeFeatureGrid'
import { KnowledgeBottomCTA } from '../components/KnowledgeBottomCTA'

interface Chronology {
  id: string
  name: string
  description: string
  createdAt: number
  createdBy: string
  categories: string[]
  hitCount: number
  likeCount: number
  saveCount: number
  sharedCount: number
  repostCount: number
  stats?: {
    winsCount: number
    totalUpvotes: number
    totalViews: number
    totalCelebrations: number
    totalComments: number
    lastWinAt: number
  }
  creator?: {
    display: string
    pfp: string | null
  }
  previewMedia?: string[]
  likedByUser?: boolean
  savedByUser?: boolean
  repostedByUser?: boolean
}

export default function ChronoWExplorer() {
  const [chronologies, setChronologies] = useState<Chronology[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Use our custom hook for handling unauthenticated prompts
  const { showPrompt, interactionCount, triggerPrompt, dismissPrompt } =
    useUnauthenticatedPrompt(6000)

  useEffect(() => {
    const fetchChronologies = async () => {
      try {
        setLoading(true)
        setError(null)

        const accessToken = getAccessToken()
        const userIsAuthenticated = !!accessToken
        setIsAuthenticated(userIsAuthenticated)

        let res: Response

        if (userIsAuthenticated) {
          try {
            res = await authFetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/explore?hydrate=1`
            )
          } catch (authError) {
            console.log('Auth failed, falling back to unauthenticated request:', authError)
            setIsAuthenticated(false)
            res = await fetch(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/explore?hydrate=1`
            )
          }
        } else {
          res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/explore?hydrate=1`
          )
        }

        if (!res.ok) {
          throw new Error('Failed to load chronologies')
        }

        const data = await res.json()
        console.log('Fetched chronologies:', data)
        setChronologies(data.chronologies || [])
      } catch (err) {
        console.error('Error fetching chronologies:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchChronologies()
  }, [])

  // Calculate knowledge metrics
  const knowledgeMetrics = chronologies.reduce(
    (acc, c) => ({
      totalWins: acc.totalWins + (c.stats?.winsCount || 0),
      totalViews: acc.totalViews + c.hitCount,
      totalLikes: acc.totalLikes + c.likeCount,
    }),
    { totalWins: 0, totalViews: 0, totalLikes: 0 }
  )

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl mb-5">ChronoDUBS by Financial Gurkha</h1>
        <div className="flex items-center justify-center py-20">
          <div className="text-neutral-400">Loading trading knowledge...</div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl mb-5">ChronoDUBS by Financial Gurkha</h1>
        <div className="flex items-center justify-center py-20">
          <div className="text-red-400">Error loading chronologies: {error}</div>
        </div>
        {/* Show knowledge access prompt even on error for unauthenticated users */}
        {!isAuthenticated && (
          <div className="mt-8">
            <KnowledgeAccessPrompt
              show={true}
              interactionCount={1}
              onDismiss={() => {}}
              totalChronologies={0}
              totalWins={0}
            />
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 bg-[#1a1a1a] ">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="justify-center text-4xl font-bold mb-2">ChronoDUBS by Financial Gurkha</h1>
          <h3 className="text-2xl mb-2">ONLY FOR THE WINNERS</h3>
          {!isAuthenticated && (
            <p className="text-neutral-400 text-lg flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Brain className="w-4 h-4 text-blue-400" />
                {chronologies.length} Learning Cases
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-400" />
                {knowledgeMetrics.totalWins} Documented Wins
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-purple-400" />
                {Math.floor(knowledgeMetrics.totalViews / 1000)}K Studies
              </span>
            </p>
          )}
        </div>

        {!isAuthenticated && (
          <Link
            href="/profile"
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Brain className="w-4 h-4" />
            Access Knowledge
          </Link>
        )}
      </div>

      {/* Knowledge Access Prompt - only shows when triggered */}
      {!isAuthenticated && (
        <KnowledgeAccessPrompt
          show={showPrompt}
          interactionCount={interactionCount}
          onDismiss={dismissPrompt}
          totalChronologies={chronologies.length}
          totalWins={knowledgeMetrics.totalWins}
        />
      )}

      {/* Knowledge Welcome Section for unauthenticated users */}
      {!isAuthenticated && (
        <KnowledgeWelcomeSection
          totalChronologies={chronologies.length}
          totalWins={knowledgeMetrics.totalWins}
          totalViews={knowledgeMetrics.totalViews}
        />
      )}

      {/* Knowledge Feature Grid for unauthenticated users */}
      {!isAuthenticated && <KnowledgeFeatureGrid />}

      {/* Main chronologies grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {chronologies
          .filter((c) => c.id)
          .map((c) => (
            <div key={c.id}>
              <ChronologyCard
                {...c}
                likedByUser={c.likedByUser || false}
                savedByUser={c.savedByUser || false}
                repostedByUser={c.repostedByUser || false}
                onUnauthenticatedInteraction={isAuthenticated ? undefined : triggerPrompt}
              />
            </div>
          ))}
      </div>

      {chronologies.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <div className="text-neutral-400">No chronologies found</div>
        </div>
      )}

      {/* Bottom CTA - only show if there are many chronologies and user isn't authenticated */}
      {!isAuthenticated && (
        <KnowledgeBottomCTA
          totalChronologies={chronologies.length}
          show={chronologies.length > 6}
        />
      )}
    </section>
  )
}
