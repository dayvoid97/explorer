'use client'

import React, { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch } from '../lib/api'
import { isLoggedIn } from '../lib/auth'
import Image from 'next/image'

import careerStaked from '../../../public/career-staked.png'

const AD_SLOT = 'customAd'
const LOCATION = 'PromoBanner'

interface PromoBannerProps {
  winId?: string
}

export default function PromoBanner({ winId }: PromoBannerProps) {
  const router = useRouter()
  const pingInterval = useRef<NodeJS.Timeout | null>(null)

  const sendImpressionPing = async () => {
    const payload = {
      adSlot: AD_SLOT,
      location: LOCATION,
      winId: winId || null,
    }

    try {
      const res = await authFetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/ad/impression`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.warn(
          `❌ Ad impression ping failed (Status: ${res.status}):`,
          errorData.message || res.statusText
        )
      }
    } catch (err: any) {
      console.error('❌ Ad impression ping failed:', err.message)
    }
  }

  useEffect(() => {
    // Fire initial impression
    sendImpressionPing()

    // Fire pings every 5 seconds
    pingInterval.current = setInterval(() => {
      sendImpressionPing()
    }, 5000)

    // Cleanup
    return () => {
      if (pingInterval.current) clearInterval(pingInterval.current)
    }
  }, [winId])

  const handleClick = () => {
    router.push(isLoggedIn() ? '/wins' : '/login')
  }

  return (
    <div className="relative mt-8 p-0">
      <div
        className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition hover:shadow-md bg-white dark:bg-gray-800"
        style={{ padding: '1.5rem' }}
      >
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">GET INSPIRED</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Share your milestones, dubs, and life scoops.
          </p>
          <button
            onClick={handleClick}
            className="mt-3 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
          >
            Post your Dubs
          </button>
        </div>

        <div className="mt-5 w-full space-y-2">
          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">
            Sponsored
          </p>
          <a href="https://apps.apple.com/us/app/strum-vibe-together/id6654898214">
            <Image
              src={careerStaked}
              alt="Strum Vibe Together App on the iOS App Store"
              className="rounded-lg w-full h-auto object-cover"
              priority
            />
          </a>
        </div>
      </div>
    </div>
  )
}
