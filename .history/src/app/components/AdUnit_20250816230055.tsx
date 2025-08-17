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
  userAgent: string
}

export default function AdUnit() {
  const adRef = useRef<HTMLModElement | null>(null)
  const loadTimeRef = useRef<number | null>(null)
  const viewTimerRef = useRef<NodeJS.Timeout | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)

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
      adSlot: 'xx', // Replace with actual slot
      adClient: 'ca-pub-xxx', // Replace with actual client
      event: 'loaded',
      timestamp: loadTimeRef.current,
      url: window.location.href,
      userAgent: navigator.userAgent,
    })

    // Start 5-second view timer
    viewTimerRef.current = setTimeout(() => {
      sendMetrics({
        adSlot: 'xx',
        adClient: 'ca-pub-xxx',
        event: 'viewed',
        timestamp: Date.now(),
        viewDuration: 5000,
        url: window.location.href,
        userAgent: navigator.userAgent,
      })
    }, 5000)
  }, [sendMetrics])

  // Track ad changes
  const trackAdChanged = useCallback(() => {
    sendMetrics({
      adSlot: 'xx',
      adClient: 'ca-pub-xxx',
      event: 'changed',
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    })
  }, [sendMetrics])

  useEffect(() => {
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

          // Track that ad was loaded
          trackAdLoaded()
        }
      } catch (e) {
        console.error('Adsense error:', e)
      }
    }

    initializeAd()

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
      if (viewTimerRef.current) {
        clearTimeout(viewTimerRef.current)
      }
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [trackAdLoaded, trackAdChanged])

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: 'block', width: '100%', height: '300px' }}
      data-ad-client="ca-pub-8441965953327461"
      data-ad-slot="xx"
      data-ad-format="auto"
    ></ins>
  )
}
