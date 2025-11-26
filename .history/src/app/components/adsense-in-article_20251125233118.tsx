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
      className="my-8 flex justify-center items-center min-h-[250px] bg-white rounded-lg border-2 border-gray-100"
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-8441965953327461"
        data-ad-slot="6533303772"
      ></ins>
    </div>
  )
}
