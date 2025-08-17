'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import FollowButton from '@/app/components/FollowButton'
import { Button } from '@/app/components/ui/Button' // Assuming Button component handles its own dark/light mode
import ReportUserModal from '@/app/components/ReportUserModal'
import Link from 'next/link'
import { Mail } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL
interface SocialLink {
  social_id: string
  social_link: string
  social_identifier: string
}

interface PublicProfile {
  username: string
  bio?: string
  link?: string
  experience?: string
  socialLinks?: SocialLink[] // Add socialLinks to the interface

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
    return (
      <div className="flex justify-center items-center min-h-screen text-current">Loading...</div>
    )
  if (!profile) return <div className="text-center py-20 text-current">User not found.</div>

  return (
    <div className="min-h-screen px-4 py-10 max-w-5xl mx-auto space-y-12">
      {/* Profile Header */}
      <section className="border rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700">
          {profile.profilePicUrl ? (
            <img src={profile.profilePicUrl} alt="Profile" className="object-cover w-full h-full" />
          ) : (
            // Placeholder background for default profile pic, adapt if needed
            // This still uses a color, but for a placeholder, it might be acceptable.
            // For true neutrality, you could use a more subtle border/icon
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 font-bold text-2xl">
              {profile.username.charAt(0).toUpperCase()}{' '}
              {/* Use first initial instead of full username if too long */}
            </div>
          )}
        </div>

        {/* Mail button - adjust hover for neutrality */}
        <Link href={`/message?to=${profile.username}`}>
          <button className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 px-4 py-2 rounded-xl text-current">
            <Mail size={28} />
          </button>
        </Link>

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-2xl font-bold text-current">@{profile.username}</h1>
            <div className="flex gap-2">
              <FollowButton targetUsername={profile.username} />{' '}
              {/* Assuming FollowButton handles its own dark/light mode */}
              <Button variant="ghost" size="sm" onClick={() => setShowReportModal(true)}>
                🚨 Report
              </Button>
            </div>
          </div>

          {profile.experience && (
            <p className="text-sm text-gray-500 dark:text-gray-400">🎓 {profile.experience}</p>
          )}
          {profile.bio && (
            <p className="text-sm text-current leading-relaxed whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}
          {profile.link && (
            <a
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400 block"
            >
              🔗 {profile.link}
            </a>
          )}

          {profile.flagged && (
            <div className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700 rounded-md p-2 text-xs mt-2">
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
        <h2 className="text-xl font-semibold mb-4 text-current">🏆 Wins</h2>
        {profile.wins?.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.wins.map((win, idx) => (
              <div
                key={idx}
                onClick={() => router.push(`/winners/wincard/${win.winId}`)}
                className="cursor-pointer border rounded-lg p-4 hover:shadow-md transition text-current"
              >
                <p className="font-medium">{win.title || `Win #${idx + 1}`}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">No Ws yet — stay tuned!</p>
        )}
      </section>

      {/* Cards */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-current">📊 Cards</h2>
        {profile.cards?.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {profile.cards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => router.push(`/company/${card.cardId}`)}
                className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer text-current"
              >
                <p className="font-semibold">{card.cardTicker}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {card.cardBio}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">No public company cards yet.</p>
        )}
      </section>
    </div>
  )
}
