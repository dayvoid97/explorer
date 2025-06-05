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
      {/* Ensure script only runs once per page */}
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8441965953327461"
        crossOrigin="anonymous"
      ></script>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-gn-d+k-5i+dm"
        data-ad-client="ca-pub-8441965953327461"
        data-ad-slot="4978074443"
      ></ins>
    </>
  )
}
