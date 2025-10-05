'use client'

import { useEffect, useRef } from 'react'

interface AdUnitProps {
  adSlot: string
  adClient?: string
  className?: string
  style?: React.CSSProperties
  adFormat?: string
}

export default function AdUnit({
  adSlot,
  adClient = 'ca-pub-8441965953327461',
  className = '',
  style = { display: 'block', width: '100%', minHeight: '250px' },
  adFormat = 'auto',
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current) {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  return (
    <div ref={adRef} className={className}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </div>
  )
}
