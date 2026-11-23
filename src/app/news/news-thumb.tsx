'use client'

import { useState } from 'react'
import { resolveCoverImage } from '@/app/lib/cover-image'

/**
 * Cover thumbnail for the news front page. Rendered with a plain <img> that
 * serves the original file directly — no image optimizer in the path (the
 * Vercel optimizer quota returned 402s and broke cover rendering on
 * 2026-11-23). A quiet branded panel shows when there is no cover or the
 * file fails to load, so a broken image never shows.
 */
export function NewsThumb({
  src,
  alt,
  priority = false,
}: {
  src?: string
  alt: string
  sizes?: string
  priority?: boolean
}) {
  const img = resolveCoverImage(src)
  const [failed, setFailed] = useState(false)

  if (!img || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#efe6d2]">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#a8873c]"
          style={{ fontFamily: "'Freight Big Pro', Georgia, serif" }}
        >
          The Daily Brief
        </span>
      </div>
    )
  }

  return (
    <img
      src={img.src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  )
}
