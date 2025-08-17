'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import FollowButton from '@/app/components/FollowButton'
import { Button } from '@/app/components/ui/Button' // Assuming Button component handles its own dark/light mode
import ReportUserModal from '@/app/components/ReportUserModal'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Phone } from 'lucide-react'

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
  phone: {
    name: 'Phone',
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
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    domain: 'tel:',
    color: 'text-green-600 dark:text-green-400',
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
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
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
        <path d="M16.475 12.882H17.2c1.39 0 2.165-.754 2.165-1.978 0-1.225-.774-1.978-2.165-1.978h-.725v3.956zm.725-5.436c2.114 0 3.642 1.459 3.642 3.458 0 2.159-1.596 3.458-3.642 3.458h-.725V17H15v-9.554h2.2zM8.616 17H7.14V7.446h1.476V17zm-6.142 0L.001 7.446h1.61l1.396 7.204h.024l1.408-7.204h1.586L3.596 17H2.474z" />
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
        <path d="M23.2 12c0-.8-.2-1.5-.5-2.2-.3-.7-.8-1.3-1.4-1.8-.6-.5-1.3-.9-2.1-1.1C18.4 6.7 17.6 6.6 16.8 6.6h-1.4V5.2c0-.7-.3-1.3-.8-1.8S13.7 2.6 13 2.6s-1.3.3-1.8.8-.8 1.1-.8 1.8v1.4H8.8c-.8 0-1.6.1-2.4.3-.8.2-1.5.6-2.1 1.1-.6.5-1.1 1.1-1.4 1.8-.3.7-.5 1.4-.5 2.2s.2 1.5.5 2.2c.3.7.8 1.3 1.4 1.8.6.5 1.3.9 2.1 1.1.8.2 1.6.3 2.4.3h1.4v1.4c0 .7.3 1.3.8 1.8s1.1.8 1.8.8 1.3-.3 1.8-.8.8-1.1.8-1.8v-1.4h1.4c.8 0 1.6-.1 2.4-.3.8-.2 1.5-.6 2.1-1.1.6-.5 1.1-1.1 1.4-1.8.3-.7.5-1.4.5-2.2z" />
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
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07L10 6.58" />
        <path d="m14 11 3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      </svg>
    ),
    domain: '',
    color: 'text-gray-600 dark:text-gray-400',
  },
  email: {
    name: 'Email',
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
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    domain: 'mailto:',
    color: 'text-blue-500 dark:text-blue-400',
  },
  website: {
    name: 'Website',
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
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    domain: 'https://',
    color: 'text-indigo-600 dark:text-indigo-400',
  },
  discord: {
    name: 'Discord',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.010c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
      </svg>
    ),
    domain: 'discord.com',
    color: 'text-indigo-500 dark:text-indigo-400',
  },
  tiktok: {
    name: 'TikTok',
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-.88-.05A6.33 6.33 0 0 0 5.76 20.3a6.34 6.34 0 0 0 10.86-4.43V7.83a8.2 8.2 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.8-.26z" />
      </svg>
    ),
    domain: 'tiktok.com',
    color: 'text-black dark:text-white',
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
  socialLinks?: SocialLink[]
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
  const [showAllCards, setShowAllCards] = useState(false)
  const [showAllWins, setShowAllWins] = useState(false)
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
    if (socialLink.startsWith('tel:')) {
      window.location.href = socialLink
    } else {
      window.open(socialLink, '_blank')
    }

    try {
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

  // Add handler for explore clicks
  const handleExploreAll = async (type: 'card' | 'wins') => {
    try {
      await fetch(`${API_BASE}/gurkha/incrementExploreClick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: userId, type }),
      })
    } catch (error) {
      console.error('Error incrementing explore click:', error)
    }
  }

  if (loading)
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  if (!profile) return <div className="text-center py-20">User not found.</div>

  return (
    <div className="min-h-screen px-4 py-10 max-w-5xl mx-auto space-y-12">
      <section className="border rounded-xl shadow p-6 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2">
          {profile.profilePicUrl ? (
            <img
              src={profile.profilePicUrl}
              alt="Profile Picture"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-200 text-2xl font-bold">
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <h1 className="text-2xl font-semibold">@{profile.username}</h1>
            <div className="flex gap-2">
              <Link href={`/message?to=${profile.username}`}>
                <button
                  aria-label="Message user"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-md"
                >
                  <Mail size={20} />
                </button>
              </Link>
              <FollowButton targetUsername={profile.username} />
              <Button variant="ghost" size="sm" onClick={() => setShowReportModal(true)}>
                🚨 Report
              </Button>
            </div>
          </div>

          {profile.experience && <p className="text-sm text-gray-500">🎓 {profile.experience}</p>}
          {profile.bio && <p className="text-sm whitespace-pre-wrap">{profile.bio}</p>}
          {profile.link && (
            <a
              href={profile.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
              aria-label="User's external website"
            >
              🔗 {profile.link}
            </a>
          )}

          {profile.flagged && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-xs mt-2">
              ⚠️ This user is flagged. Content may be limited.
            </div>
          )}

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
                    }
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    aria-label={`Open ${config.name}`}
                  >
                    <span className={`${config.color}`}>{config.icon}</span>
                    <span className="text-sm font-medium">{config.name}</span>
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

      <section>
        <h2 className="text-xl font-semibold mb-4">🏆 Ws in the Chat</h2>
        {profile.wins?.length ? (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              {(showAllWins ? profile.wins : profile.wins.slice(0, 10)).map((win, idx) => (
                <div
                  key={idx}
                  onClick={() => router.push(`/winners/wincard/${win.winId}`)}
                  className="cursor-pointer border rounded-lg p-4 hover:shadow-md transition"
                >
                  <p className="font-medium">{win.title || `Win #${idx + 1}`}</p>
                </div>
              ))}
            </div>
            {profile.wins.length > 6 && !showAllWins && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={async () => {
                    setShowAllWins(true)
                    await handleExploreAll('wins')
                  }}
                  variant="outline"
                >
                  Explore All
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic">No Ws yet — stay tuned!</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Cards</h2>
        {profile.cards?.length ? (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              {(showAllCards ? profile.cards : profile.cards.slice(0, 10)).map((card, idx) => (
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
            {profile.cards.length > 6 && !showAllCards && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={async () => {
                    setShowAllCards(true)
                    await handleExploreAll('card')
                  }}
                  variant="outline"
                >
                  Explore All
                </Button>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic">No public company cards yet.</p>
        )}
      </section>
    </div>
  )
}
