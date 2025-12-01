'use client'

import { useEffect, useRef } from 'react'

export const AdSenseInArticle = () => {
  const adRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }, [])

  return (
    <div
      ref={adRef}
      className="my-4 flex justify-center items-center min-h-[250px] rounded-lg border-2 border-gray-200"
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-5i+db-4k-72+158"
        data-ad-client="ca-pub-8441965953327461"
        data-ad-slot="2669997570"
      ></ins>
    </div>
  )
}
