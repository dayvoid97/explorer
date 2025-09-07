'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { AD_CONFIG } from '../config/adConfig'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface AdMetrics {
  adSlot: string
  adClient: string
  event: 'loaded' | 'viewed' | 'changed'
  timestamp: number
  viewDuration?: number
  url: string
  chronologyId?: string
  userAgent: string
  referrer?: string
  sessionId: string
  screen?: { width: number; height: number }
}

interface ChronoWVerticalAdProps {
  chronologyId?: string
  className?: string
}

export default function ChronoWVerticalAd({
  chronologyId,
  className = '',
}: ChronoWVerticalAdProps) {
  const adRef = useRef<HTMLModElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const loadTimeRef = useRef<number | null>(null)
  const viewTimerRef = useRef<NodeJS.Timeout | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null)
  const isInitializedRef = useRef(false)
  const hasLoadedRef = useRef(false)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenViewed, setHasBeenViewed] = useState(false)

  // Generate stable sessionId for deduplication
  const sessionIdRef = useRef<string>(uuidv4())

  // Send metrics to backend with retry logic
  const sendMetrics = useCallback(async (metrics: Omit<AdMetrics, 'sessionId'>, retries = 3) => {
    const fullPayload: AdMetrics = {
      ...metrics,
      sessionId: sessionIdRef.current,
      referrer: document.referrer,
      screen: { width: window.innerWidth, height: window.innerHeight },
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${API_BASE_URL}/gurkha/impressions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullPayload),
        })

        if (response.ok) {
          console.log(`ChronoW Ad metrics sent: ${metrics.event} (attempt ${attempt})`)
          return
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        console.error(`Failed to send ChronoW ad metrics (attempt ${attempt}/${retries}):`, error)

        if (attempt === retries) {
          console.error('All retry attempts failed for ChronoW ad metrics:', fullPayload)
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
        }
      }
    }
  }, [])

  // Track ad loading
  const trackAdLoaded = useCallback(() => {
    if (hasLoadedRef.current) return

    hasLoadedRef.current = true
    loadTimeRef.current = Date.now()

    console.log(`ChronoW vertical ad loaded for slot: ${AD_CONFIG.AD_SLOTS.CHRONOW_VERTICAL}`)

    sendMetrics({
      adSlot: AD_CONFIG.AD_SLOTS.CHRONOW_VERTICAL,
      adClient: AD_CONFIG.CLIENT_ID,
      event: 'loaded',
      timestamp: loadTimeRef.current,
      url: window.location.href,
      userAgent: navigator.userAgent,
      chronologyId,
    })
  }, [sendMetrics, chronologyId])

  // Track ad viewed
  const trackAdViewed = useCallback(() => {
    if (!isVisible || hasBeenViewed) return

    setHasBeenViewed(true)
    console.log(`ChronoW vertical ad viewed for slot: ${AD_CONFIG.AD_SLOTS.CHRONOW_VERTICAL}`)

    sendMetrics({
      adSlot: AD_CONFIG.AD_SLOTS.CHRONOW_VERTICAL,
      adClient: AD_CONFIG.CLIENT_ID,
      event: 'viewed',
      timestamp: Date.now(),
      viewDuration: 5000,
      url: window.location.href,
      userAgent: navigator.userAgent,
      chronologyId,
    })
  }, [sendMetrics, chronologyId, isVisible, hasBeenViewed])

  // Track ad changes
  const trackAdChanged = useCallback(() => {
    if (!isVisible) return

    console.log(`ChronoW vertical ad changed for slot: ${AD_CONFIG.AD_SLOTS.CHRONOW_VERTICAL}`)

    sendMetrics({
      adSlot: AD_CONFIG.AD_SLOTS.CHRONOW_VERTICAL,
      adClient: AD_CONFIG.CLIENT_ID,
      event: 'changed',
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      chronologyId,
    })
  }, [sendMetrics, chronologyId, isVisible])

  // Load AdSense script
  useEffect(() => {
    if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
      const script = document.createElement('script')
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.CLIENT_ID}`
      script.async = true
      script.crossOrigin = 'anonymous'
      script.onload = () => {
        console.log('AdSense script loaded for ChronoW')
      }
      script.onerror = () => {
        console.error('Failed to load AdSense script for ChronoW')
      }
      document.head.appendChild(script)
    }

    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      window.adsbygoogle = []
    }
  }, [])

  // Setup intersection observer
  useEffect(() => {
    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const wasVisible = isVisible
          const nowVisible = entry.isIntersecting

          setIsVisible(nowVisible)

          if (!wasVisible && nowVisible) {
            console.log(`ChronoW vertical ad entered viewport`)

            if (!isInitializedRef.current) {
              initializeAdSense()
            }

            if (viewTimerRef.current) clearTimeout(viewTimerRef.current)
            viewTimerRef.current = setTimeout(() => {
              trackAdViewed()
            }, 5000)
          }

          if (wasVisible && !nowVisible) {
            console.log(`ChronoW vertical ad left viewport`)
            if (viewTimerRef.current) {
              clearTimeout(viewTimerRef.current)
              viewTimerRef.current = null
            }
          }
        })
      },
      {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px',
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
  }, [])

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
        console.log(`Initializing ChronoW vertical ad`)

        window.adsbygoogle.push({})
        isInitializedRef.current = true

        setTimeout(() => {
          trackAdLoaded()
        }, 100)
      }
    } catch (e) {
      console.error('ChronoW AdSense initialization error:', e)
      sendMetrics({
        adSlot: AD_CONFIG.AD_SLOTS.CHRONOW_VERTICAL,
        adClient: AD_CONFIG.CLIENT_ID,
        event: 'loaded',
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        chronologyId,
      })
    }
  }, [trackAdLoaded, sendMetrics, chronologyId])

  // Setup mutation observer
  useEffect(() => {
    if (adRef.current) {
      observerRef.current = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'data-adsbygoogle-status'
          ) {
            const status = (mutation.target as HTMLElement).getAttribute('data-adsbygoogle-status')
            console.log(`ChronoW AdSense status changed to: ${status}`)

            if (status === 'done' && !hasLoadedRef.current) {
              trackAdLoaded()
            }
            trackAdChanged()
          }

          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            console.log(`ChronoW AdSense content added`)
            trackAdChanged()
          }
        })
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
  }, [trackAdChanged, trackAdLoaded])

  return (
    <div ref={containerRef} className={`chronow-vertical-ad-container relative my-8 ${className}`}>
      <div className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wide font-medium">
        Advertisement
      </div>

      {/* Vertical Ad with enhanced styling for ChronoW feed */}
      <div className="flex justify-center">
        <ins
          ref={adRef}
          className="adsbygoogle block"
          style={{
            display: 'block',
            width: '100%',
            maxWidth: '400px',
            minHeight: '300px',
          }}
          data-ad-client={AD_CONFIG.CLIENT_ID}
          data-ad-slot={AD_CONFIG.AD_SLOTS.CHRONOW_VERTICAL}
          data-ad-format="autorelaxed"
        />
      </div>

      {/* Debug indicator - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 text-xs bg-black text-white px-2 py-1 rounded z-10">
          {isVisible ? 'Visible' : 'Hidden'}
          {hasBeenViewed && ' ✓ Viewed'}
          {hasLoadedRef.current && ' ✓ Loaded'}
        </div>
      )}
    </div>
  )
}
