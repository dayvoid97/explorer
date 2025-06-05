'use client'

import React, { useEffect, useRef } from 'react'
import { usePostHog } from 'posthog-js/react'
import { useRouter } from 'next/navigation'
import { getToken } from '../lib/auth'

declare global {
  interface Window {
    adsbygoogle: any
  }
}

const AD_SLOT = '7604243956'
const LOCATION = 'PromoBanner'

export default function PromoBanner() {
  const adRef = useRef<HTMLDivElement>(null)
  const posthog = usePostHog()
  const router = useRouter()
  const pingInterval = useRef<NodeJS.Timeout | null>(null)

  const sendImpressionPing = async () => {
    const token = getToken()
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/ad/impression`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ adSlot: AD_SLOT, location: LOCATION }),
      })
    } catch (err) {
      console.error('❌ Failed to log ad impression:', err)
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
          window.adsbygoogle.push({})
          posthog?.capture('ad_impression', { adSlot: AD_SLOT, location: LOCATION })
          sendImpressionPing() // fire once
        }
      } catch (err) {
        console.warn('Ad load failed:', err)
      }
    }

    document.head.appendChild(script)

    // ⏱ set up ping every 5 seconds
    pingInterval.current = setInterval(() => {
      sendImpressionPing()
    }, 5000)

    return () => {
      document.head.removeChild(script)
      if (pingInterval.current) clearInterval(pingInterval.current)
    }
  }, [])

  const handleClick = () => {
    const token = getToken()
    if (token) router.push('/wins')
    else router.push('/login')
  }

  return (
    <div className="relative mt-8 p-0">
      <div
        className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition hover:shadow-md"
        style={{ backgroundColor: 'transparent', padding: '1.5rem' }}
      >
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">🌟 Inspired by this win?</h3>
          <p className="text-muted-foreground text-sm">
            Share your own milestone and inspire others.
          </p>
          <button
            onClick={handleClick}
            className="mt-3 text-sm font-medium text-blue-600 hover:underline"
          >
            Add Your Win
          </button>
        </div>

        {/* Google AdSense Block */}
        <div ref={adRef} className="mt-4">
          <ins
            className="adsbygoogle"
            style={{ display: 'block', backgroundColor: 'transparent' }}
            data-ad-client="ca-pub-8441965953327461"
            data-ad-slot={AD_SLOT}
            data-ad-format="fluid"
            data-ad-layout-key="-6q+e9+15-2u+4y"
          ></ins>
        </div>
      </div>
    </div>
  )
}
