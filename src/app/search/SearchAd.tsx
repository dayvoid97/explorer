'use client'

import { useAdSlot } from '@/app/hooks/useAdSlot'
import { useIsDesktop } from '@/app/hooks/useIsDesktop'
import { AdLabel } from '@/app/components/AdLabel'

/*
 * One display ad inside the /search results (AdSense unit "fg-insearch-web").
 * Desktop only, and only when the list shows more than five results, so the ad
 * always sits between results and never trails a short list. It goes after the
 * third result: inside the first screen on a desktop, where it is seen.
 */
export const SEARCH_AD_SLOT = '5992859906' // fg-insearch-web
export const SEARCH_AD_MIN_RESULTS = 6
export const SEARCH_AD_AFTER = 3

/** Renders nothing below 1024px: no element, no ad request. */
export default function SearchAd() {
  const isDesktop = useIsDesktop()
  if (!SEARCH_AD_SLOT || !isDesktop) return null
  return <SearchAdBox />
}

function SearchAdBox() {
  const { ref, shouldRender } = useAdSlot('search_results')
  return (
    <li aria-label="Advertisement">
      {/* `ad-slot` collapses the whole row, rule included, if AdSense has no ad */}
      <div ref={ref} className="ad-slot border-b border-black/10 py-5">
        <AdLabel align="left" />
        {/* Reserve a rectangle's height so the results below don't jump when it fills */}
        <div className="min-h-[250px]">
          {shouldRender ? (
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-8441965953327461"
              data-ad-slot={SEARCH_AD_SLOT}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          ) : null}
        </div>
      </div>
    </li>
  )
}
