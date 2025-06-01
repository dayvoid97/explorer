'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ArrowUp } from 'lucide-react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function WinDetailPage() {
  const router = useRouter()
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

  if (!win) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white text-gray-500 text-xl">
        Loading…
      </div>
    )
  }

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      {/* Left Skyscraper */}
      <aside className="w-60 hidden lg:flex flex-col items-center justify-start bg-gray-100 py-10 shadow-inner">
        <div className="text-xl font-semibold">🎯 PROMO 1</div>
        <p className="text-sm mt-2">Don't miss this deal.</p>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold leading-tight">{win.title}</h1>
          <div
            onClick={() => router.push(`/publicprofile/${winId}`)}
            className="cursor-pointer space-y-2"
          >
            <p className="text-sm text-gray-500">
              Posted by <span className="font-medium">@{win.username}</span> on{' '}
              {new Date(win.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {win.paragraphs?.map((text: string, idx: number) => (
            <p key={idx} className="text-lg leading-relaxed tracking-wide">
              {text}
            </p>
          ))}
        </div>

        {win.mediaUrls?.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {win.mediaUrls.map((url: string, idx: number) => (
              <div key={idx} className="group overflow-hidden rounded-2xl shadow-md">
                <img
                  src={url}
                  alt={`Win media ${idx}`}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ))}
          </section>
        )}

        <div className="flex items-center gap-2 text-blue-600 mt-4 text-sm">
          <ArrowUp size={18} />
          {win.upvotes || 0} upvotes
        </div>
      </main>

      {/* Right Skyscraper */}
      <aside className="w-60 hidden lg:flex flex-col items-center justify-start bg-gray-100 py-10 shadow-inner">
        <div className="text-xl font-semibold">🔥 PROMO 2</div>
        <p className="text-sm mt-2">Level up with this.</p>
      </aside>
    </div>
  )
}
