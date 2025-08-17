'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authFetch } from '../lib/api'
import { removeTokens, getAccessToken } from '../lib/auth'

import MyCards from './MyCards'
import SavedCards from './SavedCards'
import SearchAndAddCard from './SearchAndAddCard'
import MyWins from '../components/MyWins'
import SavedWins from '../components/SavedWins'
import ProfilePicture from '../components/ProfilePicture'
import MessagesCard from '../components/MessageCard'
import SocialLinksProfile from '../components/ui/SocialLinks'
import ManageChronologiesEntry from '../components/ManageChronoWrapper'

function FollowersFollowingModal({
  open,
  onClose,
  type,
  users,
}: {
  open: boolean
  onClose: () => void
  type: 'followers' | 'following'
  users: { username: string }[]
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {type === 'followers' ? 'Followers' : 'Following'}
        </h2>
        <button
          className="absolute top-2 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>
        <ul className="max-h-64 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
          {users.length === 0 ? (
            <li className="py-2 text-gray-500 text-center">No {type} yet.</li>
          ) : (
            users.map((user) => (
              <li key={user.username} className="py-2">
                @{user.username}
              </li>
            ))
          )}
        </ul>
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

  const [profile, setProfile] = useState<any>(null)
  const [experience, setExperience] = useState('')
  const [bio, setBio] = useState('')
  const [showModal, setShowModal] = useState<null | 'followers' | 'following'>(null)
  const [followers, setFollowers] = useState<{ username: string }[]>([])
  const [following, setFollowing] = useState<{ username: string }[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [userChronologies, setUserChronologies] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setHasToken(false)
      setLoading(false)
      return
    }
    setHasToken(true)
    fetchProfile()
    // fetchChronologies()
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
        <div className="flex gap-8 justify-center my-4">
          <button
            className="text-center hover:underline"
            onClick={() => router.push('/profile/followers')}
          >
            <div className="text-lg font-bold">{profile.followersCount ?? 0}</div>
            <div className="text-xs text-gray-500">Followers</div>
          </button>
          <button
            className="text-center hover:underline"
            onClick={() => router.push('/profile/following')}
          >
            <div className="text-lg font-bold">{profile.followingCount ?? 0}</div>
            <div className="text-xs text-gray-500">Following</div>
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
          <div className="text-xs text-yellow-600 mb-4">
            <span className="italic">You haven't verified your profile yet. </span>
            <a href="/recover/verify" className="text-blue-600 underline hover:text-blue-800">
              Verify now →
            </a>
          </div>
        )}

        <div className="text-xs text-green-600 mb-4">
          <MessagesCard />
        </div>
        <div className="text-xs text-green-600 mb-4">
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

              {/* <button
                onClick={() => router.push('/live')}
                className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700 flex items-center space-x-1"
              >
                <span>🔴</span>
                <span>Go LIVE</span>
              </button> */}
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

      <SearchAndAddCard />

      {/* Cards Toggle */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={() => setShowSavedCards(false)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
      ${
        !showSavedCards
          ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
          : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
        >
          My Cards
        </button>
        <button
          onClick={() => setShowSavedCards(true)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
      ${
        showSavedCards
          ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
          : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
        >
          Saved Cards
        </button>
      </div>

      {showSavedCards ? <SavedCards /> : <MyCards cards={profile.myCards || []} />}

      {/* Wins Toggle */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={() => setShowSavedWins(false)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
      ${
        !showSavedWins
          ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
          : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
        >
          My Wins
        </button>
        <button
          onClick={() => setShowSavedWins(true)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
      ${
        showSavedWins
          ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
          : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
        >
          Saved Wins
        </button>
      </div>

      {showSavedWins ? (
        <SavedWins />
      ) : (
        <MyWins wins={profile.wins || []} userChronologies={userChronologies} />
      )}
    </main>
  )
}
