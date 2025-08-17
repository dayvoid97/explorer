'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useState } from 'react'
import { isLoggedIn, getAccessToken } from '../lib/auth'

// Import the placeholder image
import placeholderPfp from '../../../public/audio.png'
import litt from '../../../public/bonfire-full.png'
import repost from '../../../public/reload-icon.png'
import comment from '../../../public/comment-icon.png'

export type ChronologyCardHydrated = {
  id: string
  name: string
  description: string
  createdAt: number
  createdBy: string
  categories: string[]
  collaborators?: string[]
  stats?: {
    winsCount: number
    totalUpvotes: number
    totalViews: number
    totalCelebrations: number
    totalComments: number
    lastWinAt: number
  }
  creator?: { display: string; pfp?: string | null }
  previewMedia?: string[]
}

export default function ChronologyCard(props: ChronologyCardHydrated) {
  const {
    id,
    name,
    description,
    createdAt,
    createdBy,
    categories = [],
    stats,
    creator,
    previewMedia = [],
  } = props

  const [activeButton, setActiveButton] = useState<null | 'like' | 'repost' | 'share'>(null)

  const interact = async (type: 'like' | 'save' | 'share' | 'repost') => {
    if (!isLoggedIn()) return alert('Please log in to interact.')
    const token = await getAccessToken()
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/${id}/${type}`
    await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
    if (type === 'share') {
      try {
        await navigator.share?.({ url: `/chronoW/${id}`, title: name })
      } catch {}
    }
  }

  const pfpUrl = creator?.pfp || placeholderPfp

  const handleButtonPress = (button: 'like' | 'repost' | 'share') => {
    setActiveButton(button)
    setTimeout(() => setActiveButton(null), 300) // Reset the active button after animation
  }

  return (
    <article className="group border-border bg-card hover:border-foreground/60 rounded-2xl border p-6 transition-all max-w-3xl mx-auto shadow-lg hover:shadow-2xl min-h-[350px]">
      <Link href={`/chronoW/${id}`}>
        <h3 className="text-foreground line-clamp-1 text-xl font-semibold">{name}</h3>
        <p className="text-muted-foreground mt-2 line-clamp-3 text-base">{description}</p>
      </Link>

      {categories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.slice(0, 4).map((cat, i) => (
            <span
              key={i}
              className="border-border text-muted-foreground rounded-full border px-3 py-1 text-[13px]"
            >
              #{cat}
            </span>
          ))}
          {categories.length > 4 && (
            <span className="text-muted-foreground text-[13px]">+{categories.length - 4}</span>
          )}
        </div>
      )}

      <div className="text-muted-foreground mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <Image
            src={pfpUrl}
            alt="Profile Picture"
            width={30}
            height={30}
            className="rounded-full"
          />
          <span>@{creator?.display || createdBy}</span>
        </div>
        <span>{new Date(stats?.lastWinAt || createdAt).toLocaleDateString()}</span>
      </div>

      {previewMedia.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {previewMedia.map((u, i) => (
            <div
              key={i}
              className="border-border relative h-32 w-full overflow-hidden rounded-lg border"
            >
              <Image
                src={u}
                alt="Media Preview"
                fill
                sizes="(max-width:768px) 33vw, 200px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="foreground mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-5">
          <button
            onClick={() => {
              interact('like')
              handleButtonPress('like')
            }}
            className={`hover:text-foreground p-2 transition-transform duration-300 transform ${
              activeButton === 'like' ? 'scale-110' : ''
            }`}
          >
            <Image src={litt} alt="Like" width={24} height={24} />
          </button>

          <button
            onClick={() => {
              interact('repost')
              handleButtonPress('repost')
            }}
            className={`hover:text-foreground p-2 transition-transform duration-300 transform ${
              activeButton === 'repost' ? 'scale-110' : ''
            }`}
          >
            <Image src={repost} alt="Repost" width={24} height={24} />
          </button>

          <button
            onClick={() => {
              interact('share')
              handleButtonPress('share')
            }}
            className={`hover:text-foreground p-2 transition-transform duration-300 transform ${
              activeButton === 'share' ? 'scale-110' : ''
            }`}
          >
            <Image src={comment} alt="Share" width={24} height={24} />
          </button>
        </div>
      </div>
    </article>
  )
}
