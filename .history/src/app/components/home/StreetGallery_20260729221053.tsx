'use client'

import { useRef } from 'react'

/**
 * "From the Street" — photo gallery from Wall St. and Lower Manhattan visits.
 * Add new shots to the GALLERY array: drop the image in /public and add an entry.
 */
const GALLERY: { src: string; caption: string; location: string }[] = [
  {
    src: '/kanchan-wallst-financialgurkha.png',
    caption: 'On the doorstep of 14 Wall Street',
    location: 'Wall St, Financial District',
  },
  {
    src: '/starbucks-at-wallst-financialgurkha.jpeg',
    caption: 'Morning coffee before the open',
    location: 'Financial District',
  },
  {
    src: '/new-york-street-map-financialgurkha.jpeg',
    caption: 'Street art on the subway map',
    location: 'Lower Manhattan',
  },
]

export default function StreetGallery() {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 420, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {GALLERY.map((photo) => (
          <figure
            key={photo.src}
            className="group relative w-[300px] sm:w-[380px] shrink-0 snap-start overflow-hidden"
          >
            <div className="aspect-[4/5] overflow-hidden bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                className="h-full w-full object-cover grayscale-[35%] transition duration-700 group-hover:grayscale-0 group-hover:scale-[1.03]"
              />
            </div>
            <figcaption className="pt-3">
              <p className="text-sm text-white/85 font-light">{photo.caption}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C9A24B] pt-1">
                {photo.location}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-2 flex gap-2">
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Previous photos"
          className="h-10 w-10 border border-white/15 text-white/60 hover:border-[#C9A24B] hover:text-[#C9A24B] transition"
        >
          ←
        </button>
        <button
          onClick={() => scrollBy(1)}
          aria-label="More photos"
          className="h-10 w-10 border border-white/15 text-white/60 hover:border-[#C9A24B] hover:text-[#C9A24B] transition"
        >
          →
        </button>
      </div>
    </div>
  )
}
