'use client'

import React, { useEffect, useRef, useState } from 'react'
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  const sendImpressionPing = async () => {
    const payload = {
      adSlot: AD_SLOT,
      winId: winId || 'unknown', // Ensure winId is never null
      adClient: LOCATION, // Using location as adClient identifier
      event: 'impression', // Specify the event type
      timestamp: Date.now(), // Current timestamp
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
      } else {
        console.log('✅ Ad impression recorded successfully')
      }
    } catch (err: any) {
      console.error('❌ Ad impression ping failed:', err.message)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (!hasBeenVisible) {
              setHasBeenVisible(true)
              // Fire initial impression when first coming into view
              sendImpressionPing()

              // Start interval pings every 5 seconds while visible
              pingInterval.current = setInterval(() => {
                sendImpressionPing()
              }, 5000)
            }
          } else {
            setIsVisible(false)
            // Stop pings when not visible
            if (pingInterval.current) {
              clearInterval(pingInterval.current)
              pingInterval.current = null
            }
          }
        })
      },
      {
        threshold: 0.5, // Trigger when 50% of the ad is visible
        rootMargin: '0px 0px -50px 0px', // Slight offset to ensure meaningful visibility
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (pingInterval.current) clearInterval(pingInterval.current)
      observer.disconnect()
    }
  }, [winId, hasBeenVisible])

  // Resume pings when component becomes visible again (if it was already visible once)
  useEffect(() => {
    if (isVisible && hasBeenVisible && !pingInterval.current) {
      pingInterval.current = setInterval(() => {
        sendImpressionPing()
      }, 5000)
    }
  }, [isVisible, hasBeenVisible])

  const handleClick = () => {
    router.push(isLoggedIn() ? '/wins' : '/login')
  }

  return (
    <div ref={containerRef} className="relative mt-4">
      <div
        className="rounded-xl border  shadow-sm transition hover:shadow-md  dark:bg-gray-800"
        style={{ padding: '1.5rem' }}
      >
        <div className="space-y-1">
          <h3 className="dark:text-[#eff0f2]] text-lg font-semibold text-white">GET INSPIRED</h3>
          <p className="dark:text-[#eff0f2]] text-xs font-semibold text-white">
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
