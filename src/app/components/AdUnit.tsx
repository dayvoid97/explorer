'use client'

import { useEffect } from 'react'

export default function AdUnit() {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (e) {
      console.error('Adsense error:', e)
    }
  }, [])

  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '300px' }}
        data-ad-client="ca-pub-8441965953327461"
        data-ad-slot="7604243956"
        data-ad-format="auto"
      ></ins>
    </>
  )
}
