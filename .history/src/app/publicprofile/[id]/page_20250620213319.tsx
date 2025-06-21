'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import FollowButton from '@/app/components/FollowButton'
import { Button } from '@/app/components/ui/Button'
import ReportUserModal from '@/app/components/ReportUserModal'
import Link from 'next/link'
import { Mail } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface PublicProfile {
  username: string
  bio?: string
  link?: string
  experience?: string
  profilePicUrl?: string
  wins?: { winId: string; title?: string }[]
  cards?: { cardId: string; cardBio?: string; cardTicker: string }[]
  flagged?: boolean
}

export default function PublicProfilePage() {
  const [showReportModal, setShowReportModal] = useState(false)
  const params = useParams()
  const userId = params?.id as string
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/gurkha/publicprofile?id=${userId}`)
        const data = await res.json()
        setProfile(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    fetch(`${API_BASE}/gurkha/incrementView`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userId }),
    }).catch(console.error)
  }, [userId])

  if (loading)
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  if (!profile) return <div className="text-center py-20">User not found.</div>

  return (
    <div className="min-h-screen px-4 py-10 max-w-5xl mx-auto space-y-12">
      {/* Profile Header */}
      <section className="border rounded-xl shadow-sm p-6 bg-white flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
          {profile.profilePicUrl ? (
            <img src={profile.profilePicUrl} alt="Profile" className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <Link href={`/message?to=${profile.username}`}>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">
            <Mail size={18} color="black" />
          </button>
        </Link>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-2xl font-bold">@{profile.username}</h1>
            <div className="flex gap-2">
              <FollowButton targetUsername={profile.username} />
              <Button variant="ghost" size="sm" onClick={() => setShowReportModal(true)}>
                🚨 Report
              </Button>
            </div>
          </div>

          {profile.experience && <p className="text-sm text-gray-500">🎓 {profile.experience}</p>}
          {profile.bio && (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}
          {profile.link && (
            <a
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline block"
            >
              🔗 {profile.link}
            </a>
          )}

          {profile.flagged && (
            <div className="bg-red-100 text-red-700 border border-red-300 rounded-md p-2 text-xs mt-2">
              ⚠️ This user is flagged. Content may be limited.
            </div>
          )}
        </div>
      </section>

      {showReportModal && (
        <ReportUserModal
          reportedUsername={profile.username}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Wins */}
      <section>
        <h2 className="text-xl font-semibold mb-4">🏆 Wins</h2>
        {profile.wins?.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.wins.map((win, idx) => (
              <div
                key={idx}
                onClick={() => router.push(`/winners/wincard/${win.winId}`)}
                className="cursor-pointer border rounded-lg p-4 hover:shadow-md transition"
              >
                <p className="font-medium">{win.title || `Win #${idx + 1}`}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No Ws yet — stay tuned!</p>
        )}
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-xl font-semibold mb-4">📊 Cards</h2>
        {profile.cards?.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.cards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => router.push(`/company/${card.cardId}`)}
                className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              >
                <p className="font-semibold">{card.cardTicker}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{card.cardBio}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No public company cards yet.</p>
        )}
      </section>
    </div>
  )
}
