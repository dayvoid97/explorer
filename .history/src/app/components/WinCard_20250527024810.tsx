'use client'

import React, { useEffect, useState } from 'react'
import { getToken } from '@/lib/auth'

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

      const token = getToken()
      const keys = win.mediaUrls.map((url) => {
        const parts = url.split('.com/')[1]
        return parts
      })

      const res = await fetch('/api/wins/media-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-4 shadow-md space-y-3">
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <span>@{win.username}</span>
        <span>{new Date(win.createdAt).toLocaleDateString()}</span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{win.title}</h3>

      {win.paragraphs.slice(0, 2).map((p, i) => (
        <p key={i} className="text-sm text-gray-800 dark:text-gray-300">
          {p}
        </p>
      ))}

      {signedUrls.length > 0 && (
        <div className="flex space-x-2">
          {signedUrls.slice(0, 2).map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`media-${i}`}
              className="w-[200px] h-[200px] object-cover rounded-md border border-gray-300 dark:border-gray-600"
            />
          ))}
        </div>
      )}

      <div className="text-sm text-blue-600 dark:text-blue-400">
        🎉 {win.upvotes ?? 0} Celebrations
      </div>
    </div>
  )
}
