'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useParams } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function WinDetailPage() {
  const params = useParams()
  const winId = params?.id as string
  const [win, setWin] = useState<any>(null)

  useEffect(() => {
    if (!winId) return
    fetch(`${API_URL}/gurkha/wins/${winId}`)
      .then((res) => res.json())
      .then((data) => setWin(data))
      .catch(console.error)
  }, [winId])

  if (!win) return <p className="text-center p-10">Loading…</p>

  return (
    <div className="flex justify-center w-full min-h-screen bg-white">
      {/* Left Skyscraper */}
      <div className="w-52 hidden lg:flex items-start justify-center bg-gray-100 text-center p-4">
        <div className="text-lg font-bold">PROMO 1</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">{win.title}</h1>
        <p className="text-gray-500 text-sm mb-4">
          @{win.username} – {new Date(win.createdAt).toLocaleDateString()}
        </p>

        <div className="space-y-4 mb-6">
          {win.paragraphs?.map((text: string, idx: number) => (
            <p key={idx} className="text-gray-800 text-base leading-relaxed">
              {text}
            </p>
          ))}
        </div>

        {win.mediaUrls?.length > 0 && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {win.mediaUrls.map((url: string, idx: number) => (
              <img
                key={idx}
                src={url}
                alt={`Win media ${idx}`}
                className="w-full h-auto rounded shadow"
              />
            ))}
          </div>
        )}

        <div className="text-sm text-blue-600">🎉 {win.upvotes || 0} upvotes</div>
      </div>

      {/* Right Skyscraper */}
      <div className="w-52 hidden lg:flex items-start justify-center bg-gray-100 text-center p-4">
        <div className="text-lg font-bold">PROMO 2</div>
      </div>
    </div>
  )
}
