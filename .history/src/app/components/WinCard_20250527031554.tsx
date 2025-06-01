'use client'

import React, { useEffect, useState } from 'react'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface WinProps {
  win: {
    id: string
    username: string
    createdAt: string
    title: string
    paragraphs: string[]
    mediaUrls?: string[]
    upvotes?: number
  }
}

export default function WinCard({ win }: WinProps) {
  const [signedUrls, setSignedUrls] = useState<string[]>([])

  useEffect(() => {
    const getSignedUrls = async () => {
      if (!win.mediaUrls || win.mediaUrls.length === 0) return

      const keys = win.mediaUrls.map((url) => {
        const parts = url.split('.com/')[1]
        return parts
      })

      const res = await fetch(`${API_BASE_URL}/gurkha/wins/public-media-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keys }),
      })

      const data = await res.json()
      if (res.ok && data.signedUrls) {
        setSignedUrls(data.signedUrls)
      }
    }

    getSignedUrls()
  }, [win.mediaUrls])

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl p-5 shadow-md space-y-4">
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>@{win.username}</span>
        <span>{new Date(win.createdAt).toLocaleDateString()}</span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{win.title}</h3>

      {win.paragraphs.map((p, i) => (
        <p key={i} className="text-sm text-gray-800 dark:text-gray-300 whitespace-pre-line">
          {p}
        </p>
      ))}

      {signedUrls.length > 0 && (
        <Carousel
          showThumbs={false}
          showStatus={false}
          showIndicators={signedUrls.length > 1}
          infiniteLoop
          emulateTouch
          className="rounded-xl border border-gray-300 dark:border-gray-700"
        >
          {signedUrls.map((url, i) => (
            <div key={i} className="max-h-[300px] flex justify-center items-center bg-black">
              <img
                src={url}
                alt={`win-media-${i}`}
                className="object-contain h-[300px] rounded-xl"
              />
            </div>
          ))}
        </Carousel>
      )}

      <div className="text-sm text-blue-600 dark:text-blue-400">
        🎉 {win.upvotes ?? 0} Celebrations
      </div>
    </div>
  )
}
