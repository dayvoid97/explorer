'use client'

import { useAdSlot } from '@/app/hooks/useAdSlot'
import { AdLabel } from '@/app/components/AdLabel'

/**
 * In-article AdSense unit — mobile and tablet only.
 *
 * Loading is handled by the shared `useAdSlot` hook: queue-safe push, requested
 * only when the slot comes within about one screen of the viewport, and skipped
 * entirely when the container is hidden. See that file for why each matters.
 *
 * Two structural constraints specific to this unit:
 *
 * - It renders a <div>, so it must be injected into the markdown as a
 *   standalone block. Appending it to a paragraph makes MDX treat it as inline
 *   content, producing invalid <p><div/></p> markup and a hydration error.
 * - `lg:hidden` because the sidebar skyscraper covers desktop. Running both
 *   would double the ad load on the same screen.
 */
export const AdSenseInArticle = ({ position }: { position?: string }) => {
  const { ref, shouldRender } = useAdSlot(position ?? 'in_article')

  return (
    // No box around the unit: on phones AdSense expands responsive ads to the
    // full screen width, so any border or padding here ends up cut through by
    // the ad. The "Advertisement ⓘ" label alone marks it. `ad-slot` lets
    // globals.css collapse the unit, label included, when AdSense returns no ad.
    <div ref={ref} className="ad-slot my-8 lg:hidden">
      <AdLabel align="right" />
      {/* Reserve a minimum height so the article does not jump when the ad
          fills — layout shift is both a ranking signal and an annoyance. */}
      <div className="min-h-[100px]">
        {shouldRender && (
          <>
            <ins
              className="adsbygoogle"
              style={{ display: 'block', textAlign: 'center' }}
              data-ad-layout="in-article"
              data-ad-format="fluid"
              data-ad-client="ca-pub-8441965953327461"
              data-ad-slot="9398911626"
            />
          </>
        )}
      </div>
    </div>
  )
}
