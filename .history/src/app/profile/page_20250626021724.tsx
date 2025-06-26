'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// UPDATED IMPORT: Use authFetch for API calls, and removeTokens from new lib/auth.ts
import { authFetch } from '../lib/api' // Make sure lib/api.ts is created and in the correct path relative to this file
import { removeTokens, getAccessToken } from '../lib/auth' // Now refers to plural removeTokens, and add getAccessToken

import MyCards from './MyCards'
import SavedCards from './SavedCards'
import SearchAndAddCard from './SearchAndAddCard'
import MyWins from '../components/MyWins'
import SavedWins from '../components/SavedWins'
import ProfilePicture from '../components/ProfilePicture'
import MessagesCard from '../components/MessageCard'

export default function ProfilePage() {
  const router = useRouter()
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSavedWins, setShowSavedWins] = useState(false)
  const [hasToken, setHasToken] = useState(true) // Track if user has token

  const [profile, setProfile] = useState<any>(null)
  const [experience, setExperience] = useState('')
  const [bio, setBio] = useState('')

  // Check if user has token on component mount
  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      setHasToken(false)
      setLoading(false)
      // Option 1: Automatically redirect (uncomment if you want this)
      // router.push('/login')
      return
    }
    setHasToken(true)
    fetchProfile()
  }, [])

  // This function is now only called when authFetch determines a full re-login is needed
  const handleAuthRedirect = (errMessage: string = 'Session expired. Please log in again.') => {
    setError(errMessage)
    removeTokens() // Clear both access and refresh tokens
    setHasToken(false)
    // Option 1: Automatically redirect (uncomment if you want this)
    // router.push('/login')
  }

  const handleLoginRedirect = () => {
    router.push('/login')
  }

  const fetchProfile = async () => {
    // authFetch handles getting/adding the token, and refreshing.
    // We only set loading/error states around authFetch.
    setLoading(true)
    setError('') // Clear any previous errors

    try {
      // CHANGED: Use authFetch for this authenticated call
      const res = await authFetch(`${API_BASE}/gurkha/profile`)
      const data = await res.json()

      if (!res.ok) {
        // This 'if' block handles non-401/403 errors (e.g., 404 User not found, 500 server error)
        // Token-related 401/403s are handled internally by authFetch.
        throw new Error(
          data.message || data.error || `Failed to fetch profile (Status: ${res.status})`
        )
      }

      setProfile(data)
      setExperience(data.experience || '')
      setBio(data.bio || '')
    } catch (err: any) {
      console.error('Frontend profile fetch error:', err)
      // Catch errors thrown by authFetch (e.g., when refresh fails or no token initially)
      if (
        err.message === 'Authentication required. Please log in again.' ||
        err.message.includes('No authentication token')
      ) {
        handleAuthRedirect(err.message)
      } else {
        setError(err.message) // Set other non-auth related errors
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    setError('') // Clear previous errors
    setSuccess('') // Clear previous success messages

    try {
      // CHANGED: Use authFetch for this authenticated call
      const res = await authFetch(`${API_BASE}/gurkha/profile/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }, // authFetch adds Authorization header
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

  // Show login prompt if no token
  if (!hasToken) {
    return (
      <main className="max-w-md mx-auto py-20 px-4">
        <div className="text-center space-y-6 border  rounded-xl shadow-sm p-8">
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

  // Render loading, error, or null states before actual profile content
  if (loading) return <p className="text-center p-6">Loading profile...</p>
  if (error) return <p className="text-center text-red-600 p-6">{error}</p>
  if (!profile) return null // If no profile and no error, maybe a user not found or similar empty state

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
                removeTokens() // CHANGED: Call removeTokens (plural)
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

      {showSavedWins ? <SavedWins /> : <MyWins wins={profile.wins || []} />}

      {/* Saved Cards */}
      <SavedCards />
    </main>
  )
}
