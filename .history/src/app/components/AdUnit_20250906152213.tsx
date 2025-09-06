'use client'

import { useEffect, useRef, useCallback } from 'react'
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
  const loadTimeRef = useRef<number | null>(null)
  const viewTimerRef = useRef<NodeJS.Timeout | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)
  const isInitializedRef = useRef(false)

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
    } catch (error) {
      console.error('Failed to send ad metrics:', error)
    }
  }, [])

  // Track ad loading
  const trackAdLoaded = useCallback(() => {
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

    // Start 5-second view timer
    viewTimerRef.current = setTimeout(() => {
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
    }, 5000)
  }, [sendMetrics, adSlot, winId])

  // Track ad changes
  const trackAdChanged = useCallback(() => {
    sendMetrics({
      adSlot,
      adClient: 'ca-pub-8441965953327461',
      event: 'changed',
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      winId,
    })
  }, [sendMetrics, adSlot, winId])

  useEffect(() => {
    if (isInitializedRef.current) return

    const initializeAd = () => {
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
    }

    const timer = setTimeout(initializeAd, 100)

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
      clearTimeout(timer)
      if (viewTimerRef.current) clearTimeout(viewTimerRef.current)
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [trackAdLoaded, trackAdChanged])

  return (
    <div className={`ad-container ${className}`}>
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
