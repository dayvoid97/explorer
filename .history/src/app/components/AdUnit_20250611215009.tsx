'use client'

import { useEffect, useRef } from 'react'

export default function AdUnit() {
  const adRef = useRef<HTMLModElement | null>(null)

  useEffect(() => {
    const pushAd = () => {
      try {
        if (
          typeof window !== 'undefined' &&
          window.adsbygoogle &&
          adRef.current &&
          !adRef.current.hasAttribute('data-adsbygoogle-status')
        ) {
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        }
      } catch (e) {
        console.error('Adsense error:', e)
      }
    }

    // Small delay to ensure the DOM is fully ready
    const timer = setTimeout(pushAd, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: 'block', width: '100%', height: '300px' }}
      data-ad-client="ca-pub-8441965953327461"
      data-ad-slot="7604243956"
      data-ad-format="auto"
    ></ins>
  )
}
