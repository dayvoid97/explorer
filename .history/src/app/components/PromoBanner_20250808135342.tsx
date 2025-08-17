'use client'

import React, { useEffect, useRef } from 'react'
import { usePostHog } from 'posthog-js/react' // Assuming PostHog is correctly configured
import { useRouter } from 'next/navigation'
// UPDATED IMPORTS: Use authFetch for API calls, and isLoggedIn for login status checks
import { authFetch } from '../lib/api' // Make sure this path is correct
import { isLoggedIn } from '../lib/auth' // isLoggedIn for redirect logic
import Image from 'next/image'

import careerStaked from '../../../public/career-staked.png' // Assuming this path is correct

declare global {
  interface Window {
    adsbygoogle: any
  }
}

const AD_SLOT = '7604243956'
const LOCATION = 'PromoBanner'

interface PromoBannerProps {
  winId?: string
}

export default function PromoBanner({ winId }: PromoBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const posthog = usePostHog()
  const router = useRouter()
  const pingInterval = useRef<NodeJS.Timeout | null>(null)

  const sendImpressionPing = async () => {
    // REMOVED: const token = getToken(); - authFetch handles token internally
    const payload = {
      adSlot: AD_SLOT,
      location: LOCATION,
      winId: winId || null,
    }

    try {
      // CHANGED: Use authFetch for the authenticated call
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/ad/impression`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }, // authFetch adds Authorization header conditionally
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        // Log error, but don't force a user redirect as this is a background task
        console.warn(
          `❌ Ad impression ping failed (Status: ${res.status}):`,
          errorData.message || res.statusText
        )
      }
    } catch (err: any) {
      // Log network errors or errors from authFetch (e.g., if refresh fails)
      // but still no user-facing redirect as it's a background task.
      console.error('❌ Ad impression ping failed due to fetch error:', err.message)
    }
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8441965953327461'
    script.async = true
    script.crossOrigin = 'anonymous'

    script.onload = () => {
      try {
        if (window.adsbygoogle && adRef.current) {
          ;(window.adsbygoogle.push as (obj: {}) => void)({}) // Explicitly cast push to avoid TS error
          posthog?.capture('ad_impression', { adSlot: AD_SLOT, location: LOCATION })
          sendImpressionPing() // Send initial ping after ad loads
        }
      } catch (err) {
        console.warn('Ad load failed or adsbygoogle push error:', err)
      }
    }

    document.head.appendChild(script)

    // Set up interval for recurring impression pings
    pingInterval.current = setInterval(() => {
      sendImpressionPing()
    }, 5000) // Ping every 5 seconds

    // Cleanup function
    return () => {
      document.head.removeChild(script) // Remove script when component unmounts
      if (pingInterval.current) clearInterval(pingInterval.current) // Clear interval
    }
  }, [winId]) // Rerun useEffect if winId changes, ensuring correct payload for pings

  const handleClick = () => {
    // CHANGED: Use isLoggedIn() to determine redirect path
    router.push(isLoggedIn() ? '/wins' : '/login')
  }

  return (
    <div className="relative mt-8 p-0">
      <div
        // Added dark mode border, background. Removed inline style for background.
        className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition hover:shadow-md bg-white dark:bg-gray-800"
        style={{ padding: '1.5rem' }} // Keep padding
      >
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">GET INSPIRED</h3>{' '}
          {/* Dark mode text */}
          <p className="">
            {' '}
            {/* Dark mode text */}
            Share your milestones, dubs, and life scoops.
          </p>
          <button
            onClick={handleClick}
            className="mt-3 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            Post your DUBS
          </button>
        </div>
        <div className="mt-5 w-full space-y-2">
          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
            Sponsored
          </p>{' '}
          <Image
            src={careerStaked}
            alt="Strum Vibe Together App on the iOS App Store"
            className="rounded-lg w-full h-auto object-cover"
            priority
          />
        </div>
      </div>
    </div>
  )
}
