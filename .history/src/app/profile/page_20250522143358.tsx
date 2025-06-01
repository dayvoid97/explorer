// app/profile/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, removeToken } from '../lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface ProfileData {
  username: string
  email: string
  experience: string
  isVerified: boolean
  timestamp: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bio, setBio] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const fetchProfile = async () => {
    const token = getToken()
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const res = await fetch(`${API_BASE}/gurkha/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch profile')

      setProfile(data)
      setBio(data.experience || '')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    const token = getToken()
    if (!token) return router.push('/login')

    try {
      const res = await fetch(`${API_BASE}/gurkha/profile/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ experience: bio }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setSuccessMessage('Bio updated successfully.')
    } catch (err: any) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) return <p className="text-center">Loading profile...</p>
  if (error) return <p className="text-center text-red-600">{error}</p>
  if (!profile) return null

  return (
    <main className="max-w-md mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-6">My Profile</h1>

      <div className="space-y-2 mb-8">
        <p>
          <strong>Username:</strong> @{profile.username}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Verified:</strong> {profile.isVerified ? 'Yes' : 'No'}
        </p>
        <p>
          <strong>Joined:</strong> {new Date(profile.timestamp).toLocaleString()}
        </p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about your market experience..."
          rows={4}
          className="w-full border border-gray-300 px-4 py-2 rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          Save Bio
        </button>
        {successMessage && <p className="text-green-600">{successMessage}</p>}
      </form>

      <button
        onClick={() => {
          removeToken()
          router.push('/login')
        }}
        className="mt-6 w-full text-red-500 underline"
      >
        Log Out
      </button>
    </main>
  )
}
