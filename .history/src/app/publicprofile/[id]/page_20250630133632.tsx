'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import FollowButton from '@/app/components/FollowButton'
import { Button } from '@/app/components/ui/Button' // Assuming Button component handles its own dark/light mode
import ReportUserModal from '@/app/components/ReportUserModal'
import Link from 'next/link'
import { Mail } from 'lucide-react'

const PLATFORMS = {
  linkedin: {
    name: 'LinkedIn',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    domain: 'linkedin.com',
    color: 'text-blue-600 dark:text-blue-400',
  },
  github: {
    name: 'GitHub',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    domain: 'github.com',
    color: 'text-gray-900 dark:text-gray-100',
  },
  twitter: {
    name: 'Twitter/X',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    domain: 'twitter.com',
    color: 'text-black dark:text-white',
  },
  youtube: {
    name: 'YouTube',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    domain: 'youtube.com',
    color: 'text-red-600 dark:text-red-400',
  },
  instagram: {
    name: 'Instagram',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    domain: 'instagram.com',
    color: 'text-pink-600 dark:text-pink-400',
  },
  quora: {
    name: 'Quora',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.738 18.701c-.831 0-1.512-.662-1.512-1.484 0-.823.681-1.485 1.512-1.485.832 0 1.513.662 1.513 1.485 0 .822-.681 1.484-1.513 1.484m5.908-6.748c-.773.462-1.677.745-2.674.745-2.871 0-5.197-2.325-5.197-5.195 0-2.869 2.326-5.194 5.197-5.194 2.87 0 5.195 2.325 5.195 5.194 0 .996-.283 1.927-.745 2.716l2.084 1.239c.487-.937.756-2.005.756-3.126C23.262 3.517 19.743 0 15.428 0c-4.315 0-7.834 3.517-7.834 7.832 0 1.12.269 2.189.756 3.126l2.084-1.239c-.462-.789-.745-1.72-.745-2.716 0-2.87 2.326-5.195 5.197-5.195 2.871 0 5.195 2.325 5.195 5.195 0 2.87-2.324 5.194-5.195 5.194-.997 0-1.901-.283-2.674-.745l-1.239 2.084c.937.487 2.005.756 3.126.756 4.315 0 7.834-3.517 7.834-7.832 0-1.121-.269-2.189-.756-3.126l-2.084 1.239z" />
      </svg>
    ),
    domain: 'quora.com',
    color: 'text-red-700 dark:text-red-400',
  },
  reddit: {
    name: 'Reddit',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
    domain: 'reddit.com',
    color: 'text-orange-600 dark:text-orange-400',
  },
  warpcast: {
    name: 'Warpcast',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.5 4L12 12.5L3.5 4L3.5 20L7.5 20L7.5 9.5L12 14L16.5 9.5L16.5 20L20.5 20L20.5 4Z" />
      </svg>
    ),
    domain: 'farcaster.xyz',
    color: 'text-purple-600 dark:text-purple-400',
  },
  custom: {
    name: 'Custom Link',
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07L10 6.58m-4 4L3.46 13.46a5 5 0 0 0 7.07 7.07l3-3a5 5 0 0 0-7.54-.54" />
        <path d="M22 22 2 2" />
      </svg>
    ),
    domain: '',
    color: 'text-gray-600 dark:text-gray-400',
  },
}

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

  const handleSocialLinkClick = async (
    socialIdentifier: string,
    socialId: string,
    socialLink: string
  ) => {
    try {
      // Open the link in a new tab first
      window.open(socialLink, '_blank')

      // Then send POST request to increment counter
      await fetch(`${API_BASE}/gurkha/incrementLinkClick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userId,
          social_id: socialId,
          social_identifier: socialIdentifier,
        }),
      })
    } catch (error) {
      console.error('Error incrementing link click:', error)
    }
  }
  const getPlatformConfig = (platformKey: string) => {
    return PLATFORMS[platformKey as keyof typeof PLATFORMS] || PLATFORMS.custom
  }
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

        <div className="flex-1 space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-2xl font-bold text-current">@{profile.username}</h1>

            <div className="flex gap-2">
              <div>
                <Link href={`/message?to=${profile.username}`}>
                  <button className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 px-4 py-2 rounded-xl text-current">
                    <Mail size={28} />
                  </button>
                </Link>
              </div>
              <FollowButton targetUsername={profile.username} />{' '}
              {/* Assuming FollowButton handles its own dark/light mode */}
              <Button variant="dark" size="sm" onClick={() => setShowReportModal(true)}>
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
          {/* Display Social Links */}
          {profile.socialLinks && profile.socialLinks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
              {profile.socialLinks.map((link) => {
                const config = getPlatformConfig(link.social_id)
                return (
                  <button
                    key={link.social_identifier}
                    onClick={() =>
                      handleSocialLinkClick(
                        link.social_identifier,
                        link.social_id,
                        link.social_link
                      )
                    } // Pass social_link directly
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700
                               text-sm font-medium text-current hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label={`Visit ${config.name} profile`}
                  >
                    <span className={`${config.color}`}>{config.icon}</span>
                    <span>{config.name}</span>
                  </button>
                )
              })}
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
