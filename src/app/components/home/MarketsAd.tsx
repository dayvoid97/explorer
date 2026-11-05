'use client'

import { useAdSlot } from '@/app/hooks/useAdSlot'
import { AdLabel } from '@/app/components/AdLabel'

/**
 * Responsive display unit beside the homepage market tables
 * (AdSense slot "fg-explorer-markers-ad"). AdSense sizes it to the box: usually
 * a 336×280 or 300×250 rectangle on desktop, full width on phones. The AdSense
 * library itself is loaded once, site-wide; this only places the slot.
 */
export default function MarketsAd() {
  const { ref, shouldRender } = useAdSlot('home_markets')
  return (
    // `ad-slot` collapses the unit, label included, if AdSense returns no ad
    <div ref={ref} className="ad-slot">
      <AdLabel align="right" />
      {/* Reserve a rectangle's height so the page doesn't jump when the ad fills */}
      <div className="min-h-[280px]">
        {shouldRender ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-8441965953327461"
            data-ad-slot="5893872697"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : null}
      </div>
    </div>
  )
}
