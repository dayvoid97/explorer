'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import FollowButton from '@/app/components/FollowButton'
import { Button } from '@/app/components/ui/Button' // Assuming Button component handles its own dark/light mode
import ReportUserModal from '@/app/components/ReportUserModal'
import Link from 'next/link'
import { getAccessToken } from '@/app/lib/auth'

import { Mail, Globe, Award, BookOpen, Layers, MoreVertical } from 'lucide-react'
import { Phone } from 'lucide-react'
import { get } from 'http'

const PLATFORMS = {
  linkedin: {
    name: 'LinkedIn',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    domain: 'linkedin.com',
    color: 'text-blue-600 dark:text-blue-400',
  },
  phone: {
    name: 'Phone',
    icon: <Phone className="w-8 h-8" />,
    domain: 'tel:',
    color: 'text-green-600 dark:text-green-400',
  },
  github: {
    name: 'GitHub',
    icon: (
      <img
        className="w-8 h-8"
        src="https://brand.github.com/_next/static/media/logo-04.9a1517f0.png"
        alt="Github logo"
      />
    ),
    domain: 'github.com',
    color: 'text-gray-900 dark:text-gray-100',
  },
  twitter: {
    name: 'Twitter/X',
    icon: (
      <img
        className="w-8 h-8"
        src="https://cdn.brandfetch.io/idS5WhqBbM/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1692089092800"
        alt="Instagram logo"
      />
    ),
    domain: 'twitter.com',
    color: 'text-black dark:text-white',
  },
  youtube: {
    name: 'YouTube',
    icon: (
      <img
        className="w-8 h-8"
        src="https://cdn.brandfetch.io/idVfYwcuQz/theme/dark/symbol.svg?c=1bxid64Mup7aczewSAYMX&t=1728452988041"
        alt="Youtube logo"
      />
    ),
    domain: 'youtube.com',
    color: 'text-red-600 dark:text-red-400',
  },
  instagram: {
    name: 'Instagram',
    icon: (
      <img
        className="w-8 h-8"
        src="https://cdn.brandfetch.io/ido5G85nya/theme/light/id8qc6z_TX.svg?c=1bxid64Mup7aczewSAYMX&t=1724650623897"
        alt="Instagram logo"
      />
    ),
    domain: 'instagram.com',
    color: 'text-pink-600 dark:text-pink-400',
  },
  quora: {
    name: 'Quora',
    icon: (
      <img
        className="w-8 h-8"
        src="https://cdn.brandfetch.io/idnoi4zGot/theme/dark/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1667574542715"
        alt="Quora logo"
      />
    ),
    domain: 'quora.com',
    color: 'text-red-700 dark:text-red-400',
  },
  reddit: {
    name: 'Reddit',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
    domain: 'reddit.com',
    color: 'text-orange-600 dark:text-orange-400',
  },
  warpcast: {
    name: 'Warpcast',
    icon: (
      <img
        className="w-8 h-8"
        src="https://cdn.brandfetch.io/idXTdEQamb/w/1024/h/1024/theme/dark/logo.png?c=1bxid64Mup7aczewSAYMX&t=1748972601411"
        alt="Warpcast Logo"
      />
    ),
    domain: 'farcaster.xyz',
    color: 'text-purple-600 dark:text-purple-400',
  },
  custom: {
    name: 'Website',
    icon: (
      <svg
        className="w-8 h-8"
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
    domain: '',
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
  followersCount?: number
  followingCount?: number
  wins?: { winId: string; title?: string }[]
  cards?: { cardId: string; cardBio?: string; cardTicker: string }[]
  chronologies?: { id: string; name: string; categories: string[]; winCount: number }[]
  flagged?: boolean
}

function ConnectionsSheet({
  isOpen,
  onClose,
  type,
  setType,
  users = [],
  loading,
}: {
  isOpen: boolean
  onClose: () => void
  type: 'followers' | 'following'
  setType: (type: 'followers' | 'following') => void
  users: any[]
  loading: boolean
}) {
  if (!isOpen) return null

  const safeUsers = Array.isArray(users) ? users : []

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 fixed top-[64px] inset-x-0 bottom-0 z-50  dark:bg-gray-950 flex flex-col duration-300">
      {/* Header with Segmented Toggle */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
        <div className="flex-1 flex justify-center">
          <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-xl w-full max-w-xs">
            <button
              onClick={() => setType('followers')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'followers'
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white'
                  : 'text-gray-500'
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => setType('following')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                type === 'following'
                  ? 'bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white'
                  : 'text-gray-500'
              }`}
            >
              Following
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 bg-gray-100  rounded-full hover:bg-red-500 hover:text-white transition-all shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Connection List */}
      <div className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full">
        {loading ? (
          <div className="flex justify-center p-20 animate-pulse text-gray-400 font-medium">
            Loading Network...
          </div>
        ) : safeUsers.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No {type} found.</div>
        ) : (
          <div className="space-y-6">
            {safeUsers.map((user) => (
              <div key={user.username} className="group flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {user.profilePicUrl ? (
                      <img
                        src={user.profilePicUrl}
                        className="w-12 h-12 rounded-full object-cover border dark:border-gray-800"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                    {/* Activity Badge: Shows Total Wins + Chronologies */}
                    <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold border-2 border-white dark:border-gray-950 shadow-sm">
                      {user.entryCount || 0}
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100">@{user.username}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">
                        {user.experience || 'Member'}
                      </span>
                      <span className="text-[10px] text-gray-400">•</span>
                      <span className="text-[10px] text-gray-400">
                        {user.entryCount || 0} contributions
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => (window.location.href = `/publicprofile/${user.username}`)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs uppercase hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PublicProfilePage() {
  const [activeTab, setActiveTab] = useState<'wins' | 'cards' | 'chronologies'>('wins')
  const [showReportModal, setShowReportModal] = useState(false)
  const params = useParams()
  const userId = params?.id as string
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [activeListType, setActiveListType] = useState<'followers' | 'following'>('followers')
  const [connectionUsers, setConnectionUsers] = useState<any[]>([])
  const [loadingList, setLoadingList] = useState(false)

  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null)

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

  // Inside PublicProfilePage component
  // Inside PublicProfilePage component
  const openConnections = async (type: 'followers' | 'following') => {
    const token = getAccessToken()

    if (!token) {
      alert('Authentication Required: You must be logged in to explore the network of our winners.')
      return
    }

    setActiveListType(type)
    setIsSheetOpen(true)
    setLoadingList(true)

    try {
      // Targets the PUBLIC PROFILE'S username
      const res = await fetch(
        `${API_BASE}/gurkha/publicprofile/${type}?username=${profile?.username}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Requester validation
          },
        }
      )

      if (res.status === 401) {
        alert('Session expired. Please log in again.')
        setIsSheetOpen(false)
        return
      }

      const data = await res.json()
      const list = type === 'followers' ? data.followers || [] : data.following || []
      setConnectionUsers(list)
    } catch (err) {
      console.error('Error fetching network details:', err)
      setConnectionUsers([])
    } finally {
      setLoadingList(false)
    }
  }

  if (loading)
    return <div className="flex justify-center items-center min-h-screen">Loading Profile...</div>
  if (!profile) return <div className="text-center py-20">User not found.</div>

  const handleSocialLinkClick = async (
    socialIdentifier: string,
    socialId: string,
    socialLink: string
  ) => {
    // Prevent double-clicks if this specific link is already processing
    if (activeTrackingId === socialIdentifier) return

    setActiveTrackingId(socialIdentifier)

    // 1. Immediate Redirection for UX
    if (socialLink.startsWith('tel:')) {
      window.location.href = socialLink
    } else {
      window.open(socialLink, '_blank')
    }

    // 2. Background Tracking
    try {
      await fetch(`${API_BASE}/gurkha/incrementLinkClick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({
          username: userId,
          social_id: socialId,
          social_identifier: socialIdentifier,
        }),
      })
    } catch (error) {
      console.error('Error incrementing link click:', error)
    } finally {
      // Small delay or immediate clear so they can click again if needed
      setActiveTrackingId(null)
    }
  }

  const getPlatformConfig = (platformKey: string) => {
    return PLATFORMS[platformKey as keyof typeof PLATFORMS] || PLATFORMS.custom
  }

  if (loading)
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  if (!profile) return <div className="text-center py-20">User not found.</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
      {/* Header Banner Area */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-gray-900" />

      <div className="max-w-4xl mx-auto px-4 -mt-16">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-900 shadow-lg bg-gray-200">
                {profile.profilePicUrl ? (
                  <img
                    src={profile.profilePicUrl}
                    alt="PFP"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-4xl font-bold">
                    {profile.username[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex gap-10 mt-6 justify-center sm:justify-start border-t border-gray-100 dark:border-gray-800 pt-6">
                <button
                  onClick={() => openConnections('followers')}
                  className="group flex flex-col items-center sm:items-start transition-transform active:scale-95"
                >
                  <span className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-blue-600">
                    {profile.followersCount || 0}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                    Followers
                  </span>
                </button>

                <button
                  onClick={() => openConnections('following')}
                  className="group flex flex-col items-center sm:items-start transition-transform active:scale-95"
                >
                  <span className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-blue-600">
                    {profile.followingCount || 0}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
                    Following
                  </span>
                </button>
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              <Link href={`/message?to=${profile.username}`}>
                <Button variant="outline" size="sm" className="rounded-full shadow-sm">
                  <Mail size={16} className="mr-2" /> Message
                </Button>
              </Link>
              <FollowButton targetUsername={profile.username} />
              <button
                onClick={() => setShowReportModal(true)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <MoreVertical size={20} />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              @{profile.username}
            </h1>
            {profile.experience && (
              <span className="inline-block mt-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide uppercase">
                {profile.experience}
              </span>
            )}
            <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              {profile.bio}
            </p>

            {profile.link && (
              <a
                href={profile.link}
                target="_blank"
                className="flex items-center mt-3 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
              >
                <Globe size={14} className="mr-2" /> {profile.link.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>

          {/* Social Links Bar */}
          {profile.socialLinks && profile.socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
              <h2>My Links</h2>
              {profile.socialLinks.map((link) => {
                const config =
                  PLATFORMS[link.social_id as keyof typeof PLATFORMS] || PLATFORMS.custom
                const isProcessing = activeTrackingId === link.social_identifier

                return (
                  <button
                    key={link.social_identifier}
                    // Use the handler instead of window.open
                    onClick={() =>
                      handleSocialLinkClick(
                        link.social_identifier,
                        link.social_id,
                        link.social_link
                      )
                    }
                    // Disable while any link is tracking to prevent spam
                    disabled={!!activeTrackingId}
                    className={`group p-6 rounded-lg transition-all ${
                      isProcessing
                        ? 'bg-gray-100 dark:bg-gray-800 scale-95'
                        : 'hover:bg-green-100 dark:hover:bg-green-800'
                    } ${activeTrackingId && !isProcessing ? 'opacity-40' : 'opacity-100'}`}
                    title={config.name}
                  >
                    <span
                      className={`${config.color} transition-opacity ${
                        isProcessing ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                      }`}
                    >
                      {/* If it's processing, you could optionally show a spinner here */}
                      {config.icon}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Place this inside your profile header section */}

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 mb-8 sticky top-0 bg-gray-50/80 dark:bg-black/80 backdrop-blur-md z-10">
          <TabButton
            active={activeTab === 'wins'}
            label="Wins"
            icon={<Award size={18} />}
            count={profile.wins?.length}
            onClick={() => setActiveTab('wins')}
          />
          <TabButton
            active={activeTab === 'chronologies'}
            label="Chronologies"
            icon={<BookOpen size={18} />}
            count={profile.chronologies?.length}
            onClick={() => setActiveTab('chronologies')}
          />
          <TabButton
            active={activeTab === 'cards'}
            label="Cards"
            icon={<Layers size={18} />}
            count={profile.cards?.length}
            onClick={() => setActiveTab('cards')}
          />
        </div>

        {/* Tab Content */}
        <div className="grid gap-4">
          {activeTab === 'wins' && <WinsGrid wins={profile.wins} router={router} />}
          {activeTab === 'chronologies' && (
            <ChronologyGrid chronos={profile.chronologies} router={router} />
          )}
          {activeTab === 'cards' && <CardsGrid cards={profile.cards} router={router} />}
        </div>
      </div>

      {showReportModal && (
        <ReportUserModal
          reportedUsername={profile.username}
          onClose={() => setShowReportModal(false)}
        />
      )}

      <ConnectionsSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        type={activeListType}
        setType={(type) => openConnections(type)}
        users={connectionUsers}
        loading={loadingList}
      />
    </div>
  )
}

function TabButton({ active, label, icon, count, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 text-sm font-medium
        border-b-2 transition-colors
        ${
          active
            ? 'border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
        }
      `}
    >
      {icon && <span className="text-xs opacity-70">{icon}</span>}

      <span>{label}</span>

      {count !== undefined && (
        <span
          className={`
            ml-1 text-[10px] px-1.5 py-0.5 rounded
            ${
              active
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
            }
          `}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function WinsGrid({ wins, router }: any) {
  if (!wins?.length) {
    return <EmptyState msg="No Ws recorded yet." />
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {wins.map((win: any) => (
        <div
          key={win.winId}
          onClick={() => router.push(`/winners/wincard/${win.winId}`)}
          className="
            cursor-pointer rounded-lg border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            p-4 transition
            hover:bg-gray-50 dark:hover:bg-gray-800
          "
        >
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
            {win.title}
          </p>
        </div>
      ))}
    </div>
  )
}

function ChronologyGrid({ chronos, router }: any) {
  if (!chronos?.length) {
    return <EmptyState msg="No chronologies started." />
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {chronos.map((chrono: any) => (
        <div
          key={chrono.id}
          onClick={() => router.push(`/chronoW/${chrono.id}`)}
          className="
            cursor-pointer rounded-lg border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            p-4 transition
            hover:bg-gray-50 dark:hover:bg-gray-800
          "
        >
          {/* Title + count */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{chrono.name}</h3>

            <span className="text-xs text-gray-500 dark:text-gray-400">{chrono.winCount} wins</span>
          </div>

          {/* Categories */}
          {chrono.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 text-xs text-gray-400">
              {chrono.categories.map((c: string) => (
                <span key={c}>#{c}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function CardsGrid({ cards, router }: any) {
  if (!cards?.length) {
    return <EmptyState msg="No company cards available." />
  }

  return (
    <div className="grid gap-3">
      {cards.map((card: any) => (
        <div
          key={card.cardId}
          onClick={() => router.push(`/company/${card.cardId}`)}
          className="
            cursor-pointer rounded-lg border border-gray-200 dark:border-gray-800
            bg-white dark:bg-gray-900
            p-4 transition
            hover:bg-gray-50 dark:hover:bg-gray-800
          "
        >
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {card.cardTicker}
          </h3>

          {card.cardBio && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              {card.cardBio}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
      <p className="text-gray-500 italic">{msg}</p>
    </div>
  )
}
