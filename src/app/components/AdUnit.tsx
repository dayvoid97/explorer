'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface AdUnitProps {
  adSlot: string
  adClient?: string
  className?: string
  style?: React.CSSProperties
  adFormat?: 'auto' | 'horizontal' | 'vertical' | 'rectangle'
  responsive?: boolean
}

export default function AdUnit({
  adSlot,
  adClient = 'ca-pub-8441965953327461',
  className = '',
  style = { display: 'block', overflow: 'hidden' },
  adFormat = 'horizontal', // Default to horizontal for your feed
  responsive = true,
}: AdUnitProps) {
  // We track the pathname to force-push ads when the user navigates
  const pathname = usePathname()

  useEffect(() => {
    // 1. Safety check for SSR
    if (typeof window === 'undefined') return

    try {
      // 2. Initialize the adsbygoogle array if it doesn't exist
      const adsbygoogle = (window as any).adsbygoogle || []

      // 3. Only push if there is a corresponding <ins> tag ready
      // Google Adsense will find the most recent uninitialized <ins>
      adsbygoogle.push({})
    } catch (err) {
      // Catch "All 'ins' elements are already filled" errors quietly
      console.warn('AdSense notice:', err)
    }
  }, [pathname, adSlot]) // Trigger re-injection on route change or slot swap

  return (
    <div
      className={`ad-wrapper ${className}`}
      style={{ width: '100%', minHeight: style.minHeight || '90px' }}
    >
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}
