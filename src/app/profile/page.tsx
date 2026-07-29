'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch } from '../lib/api'
import { removeTokens, getAccessToken } from '../lib/auth'
import Link from 'next/link'

import MyCards from './MyCards'
// import SavedCards from './SavedCards'
// import SearchAndAddCard from './SearchAndAddCard'
import MyWins from '../components/MyWins'
import SavedWins from '../components/SavedWins'
import ProfilePicture from '../components/ProfilePicture'
import MessagesCard from '../components/MessageCard'
import SocialLinksProfile from '../components/ui/SocialLinks'
import ManageChronologiesEntry from '../components/ManageChronoWrapper'

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
    /* top-[64px] assumes your navbar height is 64px. Adjust this value to match your nav height exactly */
    <div className="animate-in fade-in slide-in-from-bottom-4 fixed top-[64px] inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-950 flex flex-col duration-300">
      {/* Header Area */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex-1">
          {/* Segmented Toggle - Centered */}
          <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-xl w-full max-w-xs mx-auto">
            <button
              onClick={() => setType('followers')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                type === 'followers'
                  ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Followers
            </button>
            <button
              onClick={() => setType('following')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                type === 'following'
                  ? 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Following
            </button>
          </div>
        </div>

        {/* Distinct Close Button */}
        <button
          onClick={onClose}
          className="ml-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-900 dark:text-gray-100 hover:bg-red-500 hover:text-white transition-all shadow-md active:scale-95"
          aria-label="Close"
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

      {/* Content Area */}
      <div className="custom-scrollbar flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Fetching {type}...</p>
          </div>
        ) : safeUsers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-400">No {type} found.</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full p-4 divide-y divide-gray-50 dark:divide-gray-900">
            {safeUsers.map((user) => (
              <div key={user.username} className="group flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  {user.profilePicUrl ? (
                    <img
                      src={user.profilePicUrl}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-800 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 flex items-center justify-center font-bold text-lg">
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-base">
                      @{user.username}
                    </p>
                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">
                      {user.experience || 'Member'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => (window.location.href = `/publicprofile/${user.username}`)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full 
             bg-gray-50 dark:bg-gray-900 
             border border-gray-200 dark:border-gray-800 
             text-gray-900 dark:text-gray-100 
             font-bold text-xs uppercase tracking-wide
             hover:bg-blue-600 hover:text-white hover:border-blue-600
             dark:hover:bg-blue-500 dark:hover:border-blue-500
             active:scale-95 transition-all duration-200 shadow-sm"
                >
                  <span>Profile</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSavedWins, setShowSavedWins] = useState(false)
  const [hasToken, setHasToken] = useState(true)
  const [showSavedCards, setShowSavedCards] = useState(false)

  const [activeContent, setActiveContent] = useState<
    'myCards' | 'savedCards' | 'myWins' | 'savedWins'
  >('myCards')

  const [profile, setProfile] = useState<any>(null)
  const [experience, setExperience] = useState('')
  const [bio, setBio] = useState('')

  const [followers, setFollowers] = useState<{ username: string }[]>([])
  const [following, setFollowing] = useState<{ username: string }[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [userChronologies, setUserChronologies] = useState<{ id: string; name: string }[]>([])

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [activeList, setActiveList] = useState<'followers' | 'following'>('followers')

  // Inside ProfilePage
  const openConnections = async (type: 'followers' | 'following') => {
    setActiveList(type)
    setIsSheetOpen(true)
    setLoadingList(true)
    try {
      const res = await authFetch(`${API_BASE}/gurkha/profile/${type}`)
      const data = await res.json()

      // BACKEND CHECK: Your backend sends { followers: [] } or { following: [] }
      const list = type === 'followers' ? data.followers || [] : data.following || []

      if (type === 'followers') setFollowers(list)
      else setFollowing(list)
    } catch (err) {
      setFollowers([])
      setFollowing([])
    } finally {
      setLoadingList(false)
    }
  }

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setHasToken(false)
      setLoading(false)
      return
    }
    setHasToken(true)
    fetchProfile()
  }, [])

  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setError(errMessage)
    removeTokens()
    setHasToken(false)
  }

  const handleLoginRedirect = () => {
    router.push('/login')
  }

  const fetchProfile = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await authFetch(`${API_BASE}/gurkha/profile`)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(
          data.message || data.error || `Failed to fetch profile (Status: ${res.status})`
        )
      }
      console.log(data)

      setProfile(data)
      setExperience(data.experience || '')
      setBio(data.bio || '')
    } catch (err: any) {
      console.error('Frontend profile fetch error:', err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const renderActiveContent = () => {
    switch (activeContent) {
      case 'myCards':
        return <MyCards cards={profile.myCards || []} />
      case 'myWins':
        return <MyWins wins={profile.wins || []} userChronologies={userChronologies} />
      case 'savedWins':
        return <SavedWins />
      default:
        return <MyCards cards={profile.myCards || []} />
    }
  }

  const handleUpdateProfile = async () => {
    setError('')
    setSuccess('')

    try {
      const res = await authFetch(`${API_BASE}/gurkha/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experience, bio }),
      })

      const result = await res.json()
      if (!res.ok) {
        throw new Error(result.message || result.error || 'Failed to update profile')
      }
      setSuccess('✅ Profile updated!')
    } catch (err: any) {
      console.error('Frontend profile update error:', err)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setError(err.message)
      }
    }
  }

  if (!hasToken) {
    return (
      <main className="max-w-md mx-auto py-20 px-4">
        <div className="text-center space-y-6 border rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="">You need to be logged in to view your profile.</p>
          <button
            onClick={handleLoginRedirect}
            className="px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Login
          </button>
        </div>
      </main>
    )
  }

  if (loading) return <p className="text-center p-6">Loading profile...</p>
  if (error) return <p className="text-center text-red-600 p-6">{error}</p>
  if (!profile) return null

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-12">
      <section className="border border-gray-200 rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
        <ProfilePicture currentUrl={profile.profilePicUrl} onUploadSuccess={fetchProfile} />
        {/* Replace the old flex gap-8 justify-center section with this */}
        <div className="flex justify-center items-center divide-x divide-gray-200 dark:divide-gray-700 my-8">
          <button
            className="px-8 text-center hover:opacity-70 transition-opacity"
            onClick={() => openConnections('followers')}
          >
            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {profile.followersCount ?? 0}
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Followers
            </div>
          </button>

          <button
            className="px-8 text-center hover:opacity-70 transition-opacity"
            onClick={() => openConnections('following')}
          >
            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {profile.followingCount ?? 0}
            </div>
            <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Following
            </div>
          </button>
        </div>
        {/* <div>{profile.chronologies}</div> */}

        <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Discovery Count</strong> {profile.views}
          </p>

          <p>
            <strong>Verified:</strong>{' '}
            <span
              className={
                profile.isVerified
                  ? 'text-green-600 font-semibold'
                  : 'text-yellow-600 font-semibold'
              }
            >
              {profile.isVerified ? 'Yes' : 'No'}
            </span>
          </p>
        </div>

        {!profile.isVerified && (
          <div className="animate-in fade-in slide-in-from-top-2 text-[11px] font-medium text-yellow-600/90 bg-yellow-500/5 p-3 rounded-xl border border-yellow-500/10 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
              <span>
                <span className="font-bold">Account Unverified.</span>
                <span className="xs:inline opacity-70 italic hidden">
                  {' '}
                  Confirm your email to secure your profile.
                </span>
              </span>
            </div>
            <Link
              href={`/profile/verify?email=${encodeURIComponent(profile.email)}`}
              className="text-blue-500 font-black uppercase tracking-widest hover:text-blue-400 transition-colors whitespace-nowrap ml-4"
            >
              Verify now →
            </Link>
          </div>
        )}
        <div className="flex items-center gap-4 text-xs ">
          <MessagesCard />
          <ManageChronologiesEntry />
        </div>

        {/* The SocialLinksProfile component is placed here */}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Experience</label>
            <input
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="Beginner, Expert, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
              rows={3}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-2">
              <button
                onClick={handleUpdateProfile}
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>

            <button
              onClick={() => {
                removeTokens()
                router.push('/login')
              }}
              className="text-red-500 text-sm underline hover:text-red-600"
            >
              Log Out
            </button>
          </div>

          {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
        </div>
      </section>

      <SocialLinksProfile
        authFetch={authFetch}
        apiBaseUrl={API_BASE || ''}
        initialLinks={profile.socialLinks || []}
        onLinksUpdated={fetchProfile}
      />

      {/* Unified Content Toggle - 4 buttons */}

      <section className="mt-8 p-6 border border-gray-100 dark:border-gray-800 rounded-xl ">
        <div className="flex justify-center gap-2 mt-10 flex-wrap">
          <button
            onClick={() => setActiveContent('myCards')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${
              activeContent === 'myCards'
                ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
                : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            My Cards
          </button>
          <button
            onClick={() => setActiveContent('myWins')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${
              activeContent === 'myWins'
                ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
                : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            My Wins
          </button>
          <button
            onClick={() => setActiveContent('savedWins')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
            ${
              activeContent === 'savedWins'
                ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
                : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Saved Wins
          </button>
        </div>
        {renderActiveContent()}
      </section>
      <ConnectionsSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        type={activeList}
        setType={(newType) => openConnections(newType)} // Re-fetches when toggled
        users={activeList === 'followers' ? followers : following}
        loading={loadingList}
      />
    </main>
  )
}
