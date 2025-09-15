'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface AdMetrics {
  adSlot: string
  adClient: string
  event: 'loaded' | 'viewed' | 'changed'
  timestamp: number
  viewDuration?: number
  url: string
  winId?: string
  userAgent: string
  referrer?: string
  sessionId: string
  screen?: { width: number; height: number }
}

interface AdUnitProps {
  adSlot: string
  className?: string
  style?: React.CSSProperties
  adFormat?: string
  winId?: string
}

export default function AdUnit({
  adSlot,
  className = '',
  style = { display: 'block', width: '100%', minHeight: '250px' },
  adFormat = 'auto',
  winId,
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const loadTimeRef = useRef<number | null>(null)
  const viewTimerRef = useRef<NodeJS.Timeout | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null)
  const isInitializedRef = useRef(false)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenViewed, setHasBeenViewed] = useState(false)

  // Generate stable sessionId for deduplication
  const sessionIdRef = useRef<string>(uuidv4())

  // Send metrics to backend
  const sendMetrics = useCallback(async (metrics: Omit<AdMetrics, 'sessionId'>) => {
    const fullPayload: AdMetrics = {
      ...metrics,
      sessionId: sessionIdRef.current,
      referrer: document.referrer,
      screen: { width: window.innerWidth, height: window.innerHeight },
    }
    try {
      await fetch(`${API_BASE_URL}/gurkha/impressions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPayload),
      })
      console.log(`✅ AdSense metrics sent: ${metrics.event}`)
    } catch (error) {
      console.error('Failed to send ad metrics:', error)
    }
  }, [])

  // Track ad loading - only when visible
  const trackAdLoaded = useCallback(() => {
    if (!isVisible) return // Only track if ad is visible

    loadTimeRef.current = Date.now()
    sendMetrics({
      adSlot,
      adClient: 'ca-pub-8441965953327461',
      event: 'loaded',
      timestamp: loadTimeRef.current,
      url: window.location.href,
      userAgent: navigator.userAgent,
      winId,
    })
  }, [sendMetrics, adSlot, winId, isVisible])

  // Track ad viewed - only when visible for 5 seconds
  const trackAdViewed = useCallback(() => {
    if (!isVisible || hasBeenViewed) return // Only track once when visible

    setHasBeenViewed(true)
    sendMetrics({
      adSlot,
      adClient: 'ca-pub-8441965953327461',
      event: 'viewed',
      timestamp: Date.now(),
      viewDuration: 5000,
      url: window.location.href,
      userAgent: navigator.userAgent,
      winId,
    })
  }, [sendMetrics, adSlot, winId, isVisible, hasBeenViewed])

  // Track ad changes
  const trackAdChanged = useCallback(() => {
    if (!isVisible) return // Only track changes when visible

    sendMetrics({
      adSlot,
      adClient: 'ca-pub-8441965953327461',
      event: 'changed',
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      winId,
    })
  }, [sendMetrics, adSlot, winId, isVisible])

  // Setup intersection observer for viewport detection
  useEffect(() => {
    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasVisible = isVisible
          const nowVisible = entry.isIntersecting

          setIsVisible(nowVisible)

          // Ad just became visible
          if (!wasVisible && nowVisible) {
            console.log(`👁️ AdSense ad "${adSlot}" entered viewport`)

            // Initialize AdSense if not already done
            if (!isInitializedRef.current) {
              initializeAdSense()
            }

            // Start 5-second view timer
            if (viewTimerRef.current) clearTimeout(viewTimerRef.current)
            viewTimerRef.current = setTimeout(() => {
              trackAdViewed()
            }, 5000)
          }

          // Ad left viewport
          if (wasVisible && !nowVisible) {
            console.log(`🙈 AdSense ad "${adSlot}" left viewport`)
            // Clear view timer if ad leaves viewport before 5 seconds
            if (viewTimerRef.current) {
              clearTimeout(viewTimerRef.current)
              viewTimerRef.current = null
            }
          }
        })
      },
      {
        threshold: 0.5, // Trigger when 50% of the ad is visible
        rootMargin: '0px 0px -50px 0px', // Slight offset for meaningful visibility
      }
    )

    if (containerRef.current) {
      intersectionObserverRef.current.observe(containerRef.current)
    }

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect()
      }
    }
  }, [adSlot])

  // Initialize AdSense
  const initializeAdSense = useCallback(() => {
    if (isInitializedRef.current) return

    try {
      if (
        typeof window !== 'undefined' &&
        window.adsbygoogle &&
        adRef.current &&
        !adRef.current.hasAttribute('data-adsbygoogle-status')
      ) {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        isInitializedRef.current = true
        trackAdLoaded()
      }
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [trackAdLoaded])

  // Setup mutation observer for ad changes
  useEffect(() => {
    if (adRef.current) {
      observerRef.current = new MutationObserver(() => {
        trackAdChanged()
      })

      observerRef.current.observe(adRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-adsbygoogle-status'],
      })
    }

    return () => {
      if (viewTimerRef.current) clearTimeout(viewTimerRef.current)
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [trackAdChanged])

  return (
    <div ref={containerRef} className={`ad-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-8441965953327461"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  )
}
