'use client'

import Image from 'next/image'
import { useRef } from 'react'
import type { StreetPhoto } from '@/app/lib/street-photos'

/**
 * "From the Street": a sideways-scrolling row of Wall Street postcards. The
 * photos come from public/wall-street/ (see lib/street-photos.ts). Each one is
 * resized by the image optimizer and only loaded as it scrolls into view.
 */
export default function StreetGallery({ photos }: { photos: StreetPhoto[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  // One screenful of postcards per click
  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' })
  }

  return (
    <div>
      <div
        ref={trackRef}
        tabIndex={0}
        aria-label="Photos from Wall Street and the Financial District"
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 focus:outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo) => (
          <figure key={photo.src} className="group w-[260px] shrink-0 snap-start sm:w-[320px]">
            {/* The white border is the postcard */}
            <div className="bg-white p-2">
              <div className="relative aspect-[4/5] overflow-hidden bg-white/10">
                <Image
                  src={photo.src}
                  alt={photo.caption || `Wall Street, ${photo.location}`}
                  fill
                  sizes="(min-width: 640px) 320px, 260px"
                  quality={75}
                  className="object-cover grayscale-[35%] transition duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                />
              </div>
            </div>
            <figcaption className="pt-3">
              {photo.caption ? <p className="text-[14px] text-white/85">{photo.caption}</p> : null}
              <p className="pt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                {photo.location}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Previous photos"
          className="h-10 w-10 border border-white/20 text-white/70 transition hover:border-white hover:text-white"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="More photos"
          className="h-10 w-10 border border-white/20 text-white/70 transition hover:border-white hover:text-white"
        >
          →
        </button>
        <p className="ml-3 text-[11px] uppercase tracking-[0.2em] text-white/45">
          {photos.length} postcard{photos.length === 1 ? '' : 's'} from the Street
        </p>
      </div>
    </div>
  )
}
