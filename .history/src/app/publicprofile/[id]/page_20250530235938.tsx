'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface PublicProfile {
  username: string
  experience?: string
  wins?: { winId: string }[]
}

export default function PublicProfilePage() {
  const params = useParams()
  const userId = params?.id as string
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    fetch(`${API_BASE}/gurkha/publicprofile?id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data)
        setLoading(false)
      })
      .catch((err) => {
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
    <div className="min-h-screen bg-white px-4 py-10 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-blue-200 text-blue-900 font-bold text-xl rounded-full flex items-center justify-center">
          {profile.username.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold">@{profile.username}</h1>
          {profile.experience && (
            <p className="text-sm text-gray-600">Experience Level: {profile.experience}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Wins Shared</h2>
        {profile.wins && profile.wins.length > 0 ? (
          <ul className="space-y-3">
            {profile.wins.map((win, idx) => (
              <li
                key={idx}
                className="border p-4 rounded-md hover:shadow transition cursor-pointer"
                onClick={() => (window.location.href = `/wins/${win.winId}`)}
              >
                🏆 View Win #{idx + 1}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">This user hasn't posted any wins yet.</p>
        )}
      </div>
    </div>
  )
}
