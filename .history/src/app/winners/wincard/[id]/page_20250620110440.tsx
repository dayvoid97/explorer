'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowUp } from 'lucide-react'
import PromoBanner from '@/app/components/PromoBanner'
import CommentSection from '@/app/components/CommentSection'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function WinDetailPage() {
  const router = useRouter()
  const params = useParams()
  const winId = params?.id as string
  const [win, setWin] = useState<any>(null)

  useEffect(() => {
    if (!winId) return

    // Fetch win details
    fetch(`${API_URL}/gurkha/wins/${winId}`)
      .then((res) => res.json())
      .then((data) => setWin(data))
      .catch(console.error) // Add basic error handling for fetch

    // Increment view count
    fetch(`${API_URL}/gurkha/wins/increment-view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winId }),
    }).catch(console.error)
  }, [winId])

  if (!win) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-xl">
        Loading…
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto space-y-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{win.title}</h1>

        <div
          className="text-muted-foreground text-sm hover:underline cursor-pointer"
          onClick={() => router.push(`/publicprofile/${win.username}`)}
        >
          Posted by <span className="font-semibold">@{win.username}</span> on{' '}
          {new Date(win.createdAt).toLocaleDateString()}
        </div>
      </div>
      {/* Win Body */}
      <div className="space-y-6">
        {win.paragraphs?.map((text: string, idx: number) => (
          <p key={idx} className="text-lg leading-relaxed tracking-wide">
            {text}
          </p>
        ))}
      </div>
      {/* Media */}
      {win.mediaUrls?.length > 0 && win.mimeTypes?.length === win.mediaUrls.length && (
        <section className="grid sm:grid-cols-2 gap-5">
          {win.mediaUrls.map((url: string, idx: number) => {
            const type = win.mimeTypes[idx]

            return (
              <div
                key={idx}
                className="group bg-muted/20 overflow-hidden rounded-xl border transition hover:shadow-lg p-2"
              >
                {type.startsWith('image/') && (
                  <img
                    src={url}
                    alt={`Media ${idx}`}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                )}

                {type.startsWith('video/') && (
                  <video controls src={url} className="w-full h-64 object-cover rounded-lg" />
                )}

                {type.startsWith('audio/') && (
                  <audio controls className="w-full mt-4">
                    <source src={url} type={type} />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            )
          })}
        </section>
      )}
      {/* Upvotes */}
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm pt-2">
        <ArrowUp size={18} />
        {win.upvotes || 0} upvotes
      </div>
      {/* Comment Section will be rendered here */}
      <CommentSection winId={winId} /> {/* <-- CommentSection added here */}
      <PromoBanner winId={winId} />
    </div>
  )
}
