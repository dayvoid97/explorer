'use client'

import { useEffect, useRef, useCallback } from 'react'

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
}: AdUnitProps) {
  const adRef = useRef<HTMLModElement | null>(null)
  const loadTimeRef = useRef<number | null>(null)
  const viewTimerRef = useRef<NodeJS.Timeout | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)
  const isInitializedRef = useRef(false)

  // Send metrics to backend
  const sendMetrics = useCallback(async (metrics: AdMetrics) => {
    try {
      await fetch(`${API_BASE_URL}/gurkha/impressions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metrics),
      })
    } catch (error) {
      console.error('Failed to send ad metrics:', error)
    }
  }, [])

  // Track ad loading
  const trackAdLoaded = useCallback(() => {
    loadTimeRef.current = Date.now()

    sendMetrics({
      adSlot: adSlot,
      adClient: 'ca-pub-8441965953327461',
      event: 'loaded',
      timestamp: loadTimeRef.current,
      url: window.location.href,
      userAgent: navigator.userAgent,
    })

    // Start 5-second view timer
    viewTimerRef.current = setTimeout(() => {
      sendMetrics({
        adSlot: adSlot,
        adClient: 'ca-pub-8441965953327461',
        event: 'viewed',
        timestamp: Date.now(),
        viewDuration: 5000,
        url: window.location.href,
        userAgent: navigator.userAgent,
      })
    }, 5000)
  }, [sendMetrics, adSlot])

  // Track ad changes
  const trackAdChanged = useCallback(() => {
    sendMetrics({
      adSlot: adSlot,
      adClient: 'ca-pub-8441965953327461',
      event: 'changed',
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    })
  }, [sendMetrics, adSlot])

  useEffect(() => {
    // Prevent double initialization
    if (isInitializedRef.current) return

    const initializeAd = () => {
      try {
        if (
          typeof window !== 'undefined' &&
          window.adsbygoogle &&
          adRef.current &&
          !adRef.current.hasAttribute('data-adsbygoogle-status')
        ) {
          // Push the ad
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})

          // Mark as initialized
          isInitializedRef.current = true

          // Track that ad was loaded
          trackAdLoaded()
        }
      } catch (e) {
        console.error('AdSense error:', e)
      }
    }

    // Small delay to ensure AdSense script is loaded
    const timer = setTimeout(() => {
      initializeAd()
    }, 100)

    // Set up mutation observer to detect ad changes
    if (adRef.current) {
      observerRef.current = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' || mutation.type === 'attributes') {
            // Ad content changed
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

    // Cleanup function
    return () => {
      clearTimeout(timer)
      if (viewTimerRef.current) {
        clearTimeout(viewTimerRef.current)
      }
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
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

// Example usage component for the fg-winners-hp ad
export function FgWinnersHpAd({ className }: { className?: string }) {
  return (
    <AdUnit
      adSlot="1491551118"
      className={className}
      style={{
        display: 'inline-block',
        width: '1102px',
        height: '338px',
      }}
      adFormat="auto"
    />
  )
}
