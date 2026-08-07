'use client'

import { useAdSlot } from '@/app/hooks/useAdSlot'

/**
 * Desktop sidebar skyscraper (300x600).
 *
 * Two fixes over the previous implementation:
 *
 * 1. It now actually loads. The old code did `if (window.adsbygoogle) push()`,
 *    but the AdSense library is loaded lazily, so on most page loads that check
 *    failed and the slot was silently skipped. The shared hook queues the push
 *    instead, which works whether or not the library has arrived.
 *
 * 2. It no longer requests an ad on mobile. The wrapper is `hidden lg:block`,
 *    but a hidden element still mounts — so every phone pageview was requesting
 *    a 300x600 into a container with no layout box. That is an impression that
 *    can never be viewed, which drags the site's viewability rate down and, by
 *    extension, the CPM on every other unit.
 *
 * Sticky positioning is deliberate: on a 6,000-word article a static sidebar ad
 * scrolls out of view within the first few percent of the page. Sticky keeps it
 * viewable for the whole read, which is the single largest viewability gain
 * available on desktop. It sits in its own column and never overlays content,
 * so it stays within AdSense policy.
 */
export const AdSenseSidebarAd = () => {
  const { ref, shouldRender } = useAdSlot('sidebar_skyscraper')

  return (
    <div ref={ref} className="sticky top-4 mx-auto w-[300px]">
      {/* Reserve the full slot height up front so filling the ad does not push
          article content around and register as layout shift (CLS). */}
      <div className="min-h-[600px]">
        {shouldRender && (
          <>
            <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/25">
              Advertisement
            </p>
            <ins
              className="adsbygoogle"
              style={{ display: 'inline-block', width: '300px', height: '600px' }}
              data-ad-client="ca-pub-8441965953327461"
              data-ad-slot="1584501832"
            />
          </>
        )}
      </div>
    </div>
  )
}
