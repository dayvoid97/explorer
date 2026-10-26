'use client'

import { useEffect, useState } from 'react'
import { useAdSlot } from '@/app/hooks/useAdSlot'
import { AdLabel } from '@/app/components/AdLabel'

import { NEWS_AD_CLIENT, NEWS_RAIL_AD_SLOT, NEWS_ROW_AD_SLOT } from './news-ad-config'

/*
 * Ads on the /news front page (slots in ./news-ad-config.ts):
 * - Desktop (lg+): one sticky 300×600 in a newspaper-style ad column beside the
 *   day-by-day list.
 * - Phones and tablets: full-bleed ad rows across the paper, after the lead
 *   story and then every NEWS_ROW_AD_EVERY briefs.
 */

/**
 * Phones and tablets: a full-bleed row across the paper. It cancels the paper's
 * side padding so ads that AdSense stretches to full width stay inside the
 * frame, and it grows with taller ads. Hidden on desktop, so no request there.
 */
export function NewsRowAd({ n }: { n: number }) {
  const { ref, shouldRender } = useAdSlot(`news_row_${n}`)
  if (!NEWS_ROW_AD_SLOT) return null
  return (
    <div
      ref={ref}
      className="ad-slot -mx-5 my-6 border-y border-stone-300 bg-[#F7F0E1] py-3 sm:-mx-10 lg:hidden"
    >
      <div className="px-5 sm:px-10">
        <AdLabel align="right" />
      </div>
      <div className="flex min-h-[250px] w-full items-center justify-center">
        {shouldRender && (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client={NEWS_AD_CLIENT}
            data-ad-slot={NEWS_ROW_AD_SLOT}
            data-ad-format="rectangle"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </div>
  )
}

const DESKTOP_QUERY = '(min-width: 1024px)'

/** True only on desktop-width screens, tracking resizes. False during SSR. */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return isDesktop
}

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
