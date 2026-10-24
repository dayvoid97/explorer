'use client'

import Image from 'next/image'
import { useState } from 'react'
import { resolveCoverImage } from '@/app/lib/cover-image'

/**
 * Cover thumbnail for the news front page. Optimized through next/image when
 * the cover is hosted on this site; a quiet branded panel when there is no
 * cover or it fails to load, so a broken image never shows.
 */
export function NewsThumb({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src?: string
  alt: string
  sizes: string
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
    <Image
      src={img.src}
      alt={alt}
      fill
      sizes={sizes}
      quality={75}
      priority={priority}
      unoptimized={!img.optimize}
      onError={() => setFailed(true)}
      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  )
}
