'use client'

import { useAdSlot } from '@/app/hooks/useAdSlot'

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
    <div ref={ref} className="my-8 lg:hidden">
      {/* Reserve a minimum height so the article does not jump when the ad
          fills — layout shift is both a ranking signal and an annoyance. */}
      <div className="min-h-[100px]">
        {shouldRender && (
          <>
            <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
              Advertisement
            </p>
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
