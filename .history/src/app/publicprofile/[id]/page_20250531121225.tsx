'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface PublicProfile {
  username: string
  bio?: string
  link?: string
  experience?: string
  wins?: { winId: string; title?: string }[]
  cards?: { cardId: string; cardBio?: string; cardTicker: string }[]
}

export default function PublicProfilePage() {
  const params = useParams()
  const userId = params?.id as string
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!userId) return
    fetch(`${API_BASE}/gurkha/publicprofile?id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data)
        setLoading(false)
      })
    fetch(`${API_BASE}/gurkha/publicprofile/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userId }),
    }).catch((err) => {
      console.error(err)
      setLoading(false)
    })
  }, [userId])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!profile) {
    return <div className="text-center py-20">User not found.</div>
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-5xl mx-auto space-y-12">
      {/* Profile Card */}
      <section className="flex items-start gap-6 border rounded-xl p-6 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-blue-200 text-blue-900 font-bold text-xl flex items-center justify-center">
          {profile?.username?.charAt(0)?.toUpperCase() || '?'}
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">@{profile.username}</h1>
          {profile.experience && (
            <p className="text-muted-foreground text-sm">Experience: {profile.experience}</p>
          )}
          {profile.bio && <p className="text-sm text-gray-700 leading-relaxed">{profile.bio}</p>}
          {profile.link && (
            <a
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {profile.link}
            </a>
          )}
        </div>
      </section>

      {/* Wins Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🏆 Public Wins</h2>
        {profile.wins && profile.wins.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.wins.map((win, idx) => (
              <div
                key={idx}
                className="border p-4 rounded-lg hover:shadow transition cursor-pointer"
                onClick={() => router.push(`/winners/wincard/${win.winId}`)}
              >
                <p className="font-medium">{win.title || `Win #${idx + 1}`}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">This user hasn’t shared any wins yet.</p>
        )}
      </section>

      {/* Cards Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🗂️ Public Company Cards</h2>
        {profile.cards && profile.cards.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.cards.map((card, idx) => (
              <div
                key={idx}
                className="border p-4 rounded-lg hover:shadow transition cursor-pointer"
                onClick={() => router.push(`/company/${card.cardId}`)}
              >
                <p className="font-semibold">{card.cardTicker}</p>
                <p className="text-sm mt-1 text-gray-500 line-clamp-2">{card.cardBio}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No company cards published yet.</p>
        )}
      </section>
    </div>
  )
}
