'use client'

import React, { useEffect, useRef } from 'react'
import { usePostHog } from 'posthog-js/react'

declare global {
  interface Window {
    adsbygoogle: any
  }
}

export default function PromoBanner() {
  const adRef = useRef<HTMLDivElement>(null)
  const posthog = usePostHog()

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
          posthog?.capture('ad_impression', {
            ad_slot: '7604243956',
            location: 'PromoBanner',
          })
        }
      } catch (err) {
        console.warn('Ad load failed:', err)
      }
    }

    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [posthog])

  return (
    <div className="relative mt-8 p-0">
      <div
        className="rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition hover:shadow-md"
        style={{
          backgroundColor: 'transparent',
          padding: '1.5rem',
        }}
      >
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">🌟 Inspired by this win?</h3>
          <p className="text-muted-foreground text-sm">
            Check out what other visionaries are building or promote your own milestone here.
          </p>
        </div>

        {/* Google AdSense Block */}
        <div ref={adRef} className="mt-4">
          <ins
            className="adsbygoogle"
            style={{
              display: 'block',
              backgroundColor: 'transparent', // make ad container transparent
            }}
            data-ad-client="ca-pub-8441965953327461"
            data-ad-slot="7604243956"
            data-ad-format="fluid"
            data-ad-layout-key="-6q+e9+15-2u+4y"
          ></ins>
        </div>
      </div>
    </div>
  )
}
