'use client'

import { useAdSlot } from '@/app/hooks/useAdSlot'
import { useIsDesktop } from '@/app/hooks/useIsDesktop'
import { AdLabel } from '@/app/components/AdLabel'

import { NEWS_AD_CLIENT, NEWS_RAIL_AD_SLOT } from './news-ad-config'

/*
 * Ads on the /news front page (slot in ./news-ad-config.ts): desktop only, one
 * sticky 300×600 in a newspaper-style ad column beside the day-by-day list.
 * No ads on the front page on phones and tablets.
 */

/**
 * Desktop: the newspaper ad column. A ruled box with the label in small caps,
 * holding an exact 300×600 (AdSense's exact-size method), sticky so it stays
 * beside the reader through the list.
 *
 * It is not rendered at all below 1024px: no element, no sticky layer, no ad
 * request, so phones carry nothing for it.
 */
export function NewsRailAd() {
  const isDesktop = useIsDesktop()
  if (!NEWS_RAIL_AD_SLOT || !isDesktop) return null
  return <RailAdBox />
}

function RailAdBox() {
  const { ref, shouldRender } = useAdSlot('news_rail')
  return (
    <aside className="mt-10" aria-label="Advertisement">
      <div ref={ref} className="ad-slot sticky top-28">
        <div className="border-y-2 border-stone-800 py-3">
          <AdLabel align="center" />
          <div className="mx-auto h-[600px] w-[300px]">
            {shouldRender && (
              <ins
                className="adsbygoogle"
                style={{ display: 'inline-block', width: 300, height: 600 }}
                data-ad-client={NEWS_AD_CLIENT}
                data-ad-slot={NEWS_RAIL_AD_SLOT}
              />
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
