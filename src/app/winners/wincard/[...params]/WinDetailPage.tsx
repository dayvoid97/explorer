'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, PartyPopper, Bookmark, ChevronRight, Shuffle, Loader2 } from 'lucide-react'
import { isLoggedIn as checkIsLoggedIn } from '@/app/lib/auth' // Import utility to check token presence

import { MediaCarousel } from '@/app/components/ui/MediaCarousel'
import ArticleAdUnit from '@/app/components/in-between-wins'
import PromoBanner from '@/app/components/PromoBanner'
import CommentSection from '@/app/components/CommentSection'
import { authFetch } from '@/app/lib/api'
import { removeTokens } from '@/app/lib/auth'
import { toggleCelebrate } from '@/app/hooks/useCelebrateWins'
import { updatePageMetadata, createSlug } from '@/app/lib/utils'

interface Props {
  winId: string
  initialWinData: any // Use a more specific type if possible
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface Props {
  winId: string
}

function SocialShareButtons({ win }: { win: any }) {
  // ... (SocialShareButtons logic remains unchanged)
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareOnTwitter = () => {
    const tweetText = `Redub @${win.username} ${win.title}\n\n${shareUrl}`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
    window.open(twitterUrl, '_blank')
  }
  return (
    <div className="flex justify-center mt-2 ">
      <button
        onClick={shareOnTwitter}
        className="text-m text-white flex items-center gap-2 px-2 py-1 font-bold bg-black rounded-lg hover:bg-gray-800 "
      >
        Redub on X
      </button>
    </div>
  )
}

function SortToggle({
  sortMode,
  onToggle,
  show,
}: {
  sortMode: string
  onToggle: () => void
  show: boolean
}) {
  if (!show) return null
  const labels: Record<string, string> = { hottest: 'Hot', recent: 'Recent', shuffle: 'Shuffle' }

  return (
    <button
      onClick={onToggle}
      className="group flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all hover:border-black dark:hover:border-white active:scale-95"
    >
      <Shuffle size={14} className={sortMode !== 'recent' ? 'text-blue-500' : 'text-gray-400'} />
      <span className="text-xs font-semibold uppercase tracking-wider">{labels[sortMode]}</span>
    </button>
  )
}

export default function WinDetailPage({ winId, initialWinData }: Props) {
  const router = useRouter()
  const [win, setWin] = useState<any>(initialWinData)
  const [apiError, setApiError] = useState<string | null>(null)
  const [saved, setSaved] = useState(initialWinData.isSaved || false)
  const [isSaving, setIsSaving] = useState(false)
  const [upvotes, setUpvotes] = useState(initialWinData.upvotes || 0)
  const [isCelebrated, setIsCelebrated] = useState(initialWinData.hasCelebrated || false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isUpvoting, setIsUpvoting] = useState(false)
  const [isLoadingNavigation, setIsLoadingNavigation] = useState(false)
  const [sortMode, setSortMode] = useState<'recent' | 'hottest' | 'shuffle'>('recent')

  const ARTICLE_AD_SLOT_ID = '2753749283'
  const AD_PARAGRAPH_INTERVAL = 4 // Insert ad every 4 paragraphs

  const [exploreCache, setExploreCache] = useState<{
    recent: { data: any[]; timestamp: number }
    hottest: { data: any[]; timestamp: number }
  }>({ recent: { data: [], timestamp: 0 }, hottest: { data: [], timestamp: 0 } })

  const handleAuthRedirect = (msg = 'Session expired. Please log in again.') => {
    setApiError(msg)
    removeTokens()
    router.push('/login')
  }

  // Session history tracking
  useEffect(() => {
    setIsLoggedIn(checkIsLoggedIn())
    const seen = JSON.parse(sessionStorage.getItem('seenWins') || '[]')
    if (!seen.includes(winId)) {
      const updatedSeen = [...seen, winId].slice(-50)
      sessionStorage.setItem('seenWins', JSON.stringify(updatedSeen))
    }
  }, [winId])

  const handleLoginRedirect = () => {
    router.push('/login?redirect=' + window.location.pathname)
  }

  // Brick 1: The Stumble Function
  const stumbleToNext = async () => {
    if (isLoadingNavigation) return
    setIsLoadingNavigation(true)
    setApiError(null)

    const seen = JSON.parse(sessionStorage.getItem('seenWins') || '[]')

    try {
      const res = await fetch(
        `${API_URL}/gurkha/wins/${winId}/next?sortMode=${sortMode}&seenIds=${JSON.stringify(seen)}`
      )
      const nextWin = await res.json()

      if (nextWin.id) {
        // Track the current win in history before leaving
        const updatedSeen = [...new Set([...seen, winId])].slice(-50)
        sessionStorage.setItem('seenWins', JSON.stringify(updatedSeen))

        const slug = createSlug(nextWin.title)
        router.push(`/winners/wincard/${nextWin.id}/${slug}`)
      } else {
        setApiError("You've reached the end of this category!")
      }
    } catch (error) {
      console.error('Stumble failed', error)
      setApiError('Failed to find the next win. Try changing the sort!')
    } finally {
      setIsLoadingNavigation(false)
    }
  }

  useEffect(() => {
    setIsLoggedIn(checkIsLoggedIn())
  }, [])

  useEffect(() => {
    setIsLoggedIn(checkIsLoggedIn())

    const seen = JSON.parse(sessionStorage.getItem('seenWins') || '[]')
    if (!seen.includes(winId)) {
      const updatedSeen = [...seen, winId].slice(-50)
      sessionStorage.setItem('seenWins', JSON.stringify(updatedSeen))
    }
  }, [winId])

  const renderParagraphsWithAds = (
    paragraphs: string[] | undefined, // win.paragraphs is string[] | undefined
    adSlotId: string
  ) => {
    if (!paragraphs) return null

    return paragraphs.map((text, idx) => {
      const elements = []

      // 1. Render the text paragraph
      elements.push(
        <p
          key={`p-${idx}`} // Use prefix for key to avoid collision if AdUnit uses just idx
          className="text-lg leading-loose text-white opacity-90 mb-4 last:mb-0"
          style={{
            fontFamily: "'Lyon Display', 'Freight Big Pro', serif",
            lineHeight: '1.5',
          }}
        >
          {text}
        </p>
      )

      // 2. Conditional Ad Insertion Logic (Every Nth paragraph, not the last one)
      if ((idx + 1) % AD_PARAGRAPH_INTERVAL === 0 && idx < paragraphs.length - 1) {
        elements.push(
          <div key={`ad-${idx}`} className="my-10 p-4 border-y border-gray-700/50">
            <ArticleAdUnit slotId={adSlotId} />
          </div>
        )
      }

      return elements
    })
  }

  // WinCard Component Code (Refactored handleSave)

  // Rename the handler file import if you used a new name:

  const handleCelebrate = async () => {
    if (isUpvoting) return
    setIsUpvoting(true)

    // 1. Determine the action based on the current state
    const action = isCelebrated ? 'unvote' : 'upvote'

    try {
      // 2. Call the new toggle hook
      const result = await toggleCelebrate(win.id, action)

      let newUpvotes = upvotes
      let newIsCelebrated = isCelebrated

      // 3. Update state based on the result
      if (result.action === 'VOTED') {
        newUpvotes += 1
        newIsCelebrated = true
      } else if (result.action === 'UNVOTED') {
        newUpvotes = Math.max(0, newUpvotes - 1)
        newIsCelebrated = false
      }

      setUpvotes(newUpvotes)
      setIsCelebrated(newIsCelebrated) // <-- Update celebration status
    } catch (err: any) {
      if (err.message?.includes('Authentication')) handleAuthRedirect(err.message)
    } finally {
      setIsUpvoting(false)
    }
  }

  // WinCard Component Code (Refactored handleSave)

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true) // Start loading
    setApiError(null)

    try {
      // 1. Use the new combined toggle route
      const res = await authFetch(`${API_URL}/gurkha/wins/toggle-save/${win.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()

      if (res.ok) {
        // 2. Use the 'isSaved' flag returned by the backend
        // Backend returns: { success: true, action: 'SAVED'/'UNSAVED', isSaved: true/false }
        setSaved(data.isSaved) // <-- CORRECT SETTER
      } else {
        throw new Error(
          data.message || data.error || `Failed to toggle save state (Status: ${res.status}).`
        )
      }
    } catch (err: any) {
      console.error('WinCard save error:', err)
      if (
        err.message.includes('Authentication') ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setApiError(err.message || 'Save failed.') // <-- CORRECT SETTER
      }
    } finally {
      setIsSaving(false) // End loading
    }
  }

  const handleDateClick = () => {
    const dateStr = win.createdAt.split('T')[0]
    router.push(`/winners/date/${dateStr}`)
  }

  if (!win) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        {apiError || 'Loading…'}
      </div>
    )
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-[#3b3a3c]  ">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col items-center text-center space-y-1 dark:text-white">
          <div className=" flex justify-between items-center w-full">
            <button
              onClick={() => router.push('/winners')}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1
              className=" text-xl sm:text-xl mx-auto"
              style={{
                fontFamily: "'Freight Big Pro', serif",
                fontWeight: 500,
              }}
            >
              {win.title}
            </h1>

            {/* --- ACTION BUTTON BLOCK (CONDITIONAL RENDERING) --- */}
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  {/* CELEBRATE BUTTON (Logged In) */}
                  <button
                    onClick={handleCelebrate}
                    disabled={isUpvoting}
                    className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full border transition-colors ${
                      isCelebrated
                        ? 'border-orange-500 text-orange-600 bg-orange-50 dark:bg-orange-900/20'
                        : 'border-gray-300 dark:border-gray-600 text-gray-500 hover:border-orange-300'
                    }`}
                    title={isCelebrated ? 'Remove celebration' : 'Celebrate this win!'}
                  >
                    <PartyPopper size={16} />
                    {upvotes}
                  </button>

                  {/* SAVE BUTTON (Logged In) */}
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`w-8 h-8 flex items-center justify-center rounded-full border transition-colors ${
                      saved || isSaving
                        ? 'border-green-600 text-green-600'
                        : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-400'
                    }`}
                    title={saved ? 'Unsave win' : 'Save win'}
                  >
                    <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} />
                  </button>
                </>
              ) : (
                // --- LOGGED-OUT PROMPT (FB/Early Days Style) ---
                <button
                  onClick={handleLoginRedirect}
                  className="px-3 py-1 text-xs rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                  title="Login to celebrate and comment"
                >
                  Login to Engage
                </button>
              )}
            </div>
          </div>

          {/* BRICK 3: FIXED RETURN - NAVIGATION CONTROLS */}
          {/* Discovery Controls - Professional Slate Theme */}
          <div className="flex items-center gap-4 pb-2">
            <SortToggle
              sortMode={sortMode}
              onToggle={() =>
                setSortMode((prev) =>
                  prev === 'recent' ? 'hottest' : prev === 'hottest' ? 'shuffle' : 'recent'
                )
              }
              show={true}
            />

            <button
              onClick={stumbleToNext}
              disabled={isLoadingNavigation}
              className="flex items-center gap-2 px-8 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold text-sm tracking-wide transition-all hover:opacity-80 active:scale-95 disabled:bg-gray-400"
            >
              {isLoadingNavigation ? <Loader2 className="animate-spin" size={18} /> : 'NEXT WIN'}
              {!isLoadingNavigation && <ChevronRight size={18} />}
            </button>
          </div>

          <div
            className="text-sm text-center"
            style={{
              fontFamily: "'Roboto Mono', monospace",
              fontWeight: 400,
              fontStyle: 'normal',
              letterSpacing: '-0.05rem',
            }}
          >
            Posted by{' '}
            <span
              className="font-semibold hover:underline cursor-pointer"
              onClick={() => router.push(`/publicprofile/${win.username}`)}
            >
              @{win.username}
            </span>{' '}
            on{' '}
            <span className="hover:underline cursor-pointer" onClick={handleDateClick}>
              {new Date(win.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div>
            <SocialShareButtons win={win} />
          </div>
        </div>
      </div>

      <main className=" space-y-10 max-w-2xl  mx-auto ">
        <div
          className=" px-10 py-4"
          style={{
            fontFamily: "'Lyon Display', 'Freight Big Pro', serif",
            fontWeight: 500,
            wordSpacing: 1.1,
            letterSpacing: 0.1,
            fontStyle: 'normal',
          }}
        >
          {renderParagraphsWithAds(win.paragraphs, ARTICLE_AD_SLOT_ID)}
        </div>
        {/* --- MediaCarousel integration --- */}
        {((win.mediaUrls?.length > 0 && win.mimeTypes?.length === win.mediaUrls.length) ||
          win.externalLink?.url ||
          win.socialLinks?.length > 0) && (
          <MediaCarousel
            mediaUrls={win.mediaUrls}
            mimeTypes={win.mimeTypes}
            externalLink={win.externalLink}
            socialLinks={win.socialLinks}
          />
        )}
        <CommentSection winId={winId} />
        <PromoBanner />
      </main>
    </div>
  )
}
