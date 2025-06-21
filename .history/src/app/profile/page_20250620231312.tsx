'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, removeToken } from '../lib/auth'
import MyCards from './MyCards'
import SavedCards from './SavedCards'
import SearchAndAddCard from './SearchAndAddCard'
import MyWins from '../components/MyWins'
import SavedWins from '../components/SavedWins'
import ProfilePicture from '../components/ProfilePicture'
import InboxPreview from '../components/InboxPreview'

export default function ProfilePage() {
  const router = useRouter()
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSavedWins, setShowSavedWins] = useState(false)

  const [profile, setProfile] = useState<any>(null)
  const [experience, setExperience] = useState('')
  const [bio, setBio] = useState('')

  const handleAuthError = (errMessage: string) => {
    setError(errMessage)
    removeToken() // Clear the invalid token
    router.push('/login') // Redirect to login
  }

  const fetchProfile = async () => {
    const token = getToken()
    if (!token) {
      handleAuthError('No authentication token found. Please log in.')
      return
    }

    try {
      const res = await fetch(`${API_BASE}/gurkha/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status === 401) {
        handleAuthError('Session expired. Please log in again.')
        return
      }

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch profile')

      setProfile(data)
      setExperience(data.experience || '')
      setBio(data.bio || '')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    const token = getToken()
    if (!token) {
      handleAuthError('No authentication token found. Please log in.')
      return
    }

    try {
      const res = await fetch(`${API_BASE}/gurkha/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ experience, bio }),
      })

      if (res.status === 401) {
        handleAuthError('Session expired. Please log in again.')
        return
      }

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to update profile')
      setSuccess('✅ Profile updated!')
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) return <p className="text-center p-6">Loading profile...</p>
  if (error) return <p className="text-center text-red-600 p-6">{error}</p>
  if (!profile) return null

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-12">
      {/* Profile Info */}
      <section className="border border-gray-200 rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
        <ProfilePicture currentUrl={profile.profilePicUrl} onUploadSuccess={fetchProfile} />

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
          <p>
            <strong>Joined:</strong>{' '}
            {new Date(profile.timestamp).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>

        {!profile.isVerified && (
          <div className="text-xs text-yellow-600 mb-4">
            <span className="italic">You haven't verified your profile yet. </span>
            <a href="/recover/verify" className="text-blue-600 underline hover:text-blue-800">
              Verify now →
            </a>
            <MessagesCard />
          </div>
        )}

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
            <button
              onClick={handleUpdateProfile}
              className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>

            <button
              onClick={() => {
                removeToken()
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

      {/* Add Card */}

      <SearchAndAddCard />

      {/* My Cards */}
      <MyCards cards={profile.myCards || []} />

      {/* Wins Toggle */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          onClick={() => setShowSavedWins(false)}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            !showSavedWins ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          My Wins
        </button>
        <button
          onClick={() => setShowSavedWins(true)}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            showSavedWins ? 'bg-blue-600 text-white' : 'bg-gray-100'
          }`}
        >
          Saved Wins
        </button>
      </div>
      {showSavedWins ? <SavedWins /> : <MyWins wins={profile.wins || []} />}

      {/* Saved Cards */}
      <SavedCards />
    </main>
  )
}
