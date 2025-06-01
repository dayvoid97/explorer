'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken, removeToken } from '../lib/auth'
import MyCards from './MyCards'
import SavedCards from './SavedCards'
import SearchAndAddCard from './SearchAndAddCard'

export interface WinEntry {
  id: string
  title: string
  createdAt: string
  upvotes: number
  preview: string
}

export interface Card {
  cardId: string
  cardTicker: string
  companyName: string
  createdAt: string
  isPublished: boolean
  items?: any[]
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

interface ProfileData {
  username: string
  email: string
  experience: string
  isVerified: boolean
  timestamp: string
  myCards: Card[]
  wins?: WinEntry[] // <-- add this
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
      const res = await fetch(`${API_BASE}/gurkha/profile`, {
        headers: { Authorization: `Bearer ${token}` },
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

  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) return <p className="text-center p-6">Loading profile...</p>
  if (error) return <p className="text-center text-red-600 p-6">{error}</p>
  if (!profile) return null

  return (
    <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-10">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">👤 My Profile</h1>

        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
          <p>
            <strong>Username:</strong> {profile.username}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <div>
            <p>
              <strong>Verified:</strong>{' '}
              <span
                className={`font-semibold ${
                  profile.isVerified ? 'text-green-600' : 'text-yellow-600'
                }`}
              >
                {profile.isVerified ? 'Yes' : 'No'}
              </span>
            </p>

            {!profile.isVerified && (
              <div className="mt-1 text-xs text-yellow-600">
                <span className="italic">You haven't verified your profile yet.</span>{' '}
                <a href="/recover/verify" className="text-blue-600 underline hover:text-blue-800">
                  Verify now →
                </a>
              </div>
            )}
          </div>

          <p>
            <strong>Joined:</strong>{' '}
            {new Date(profile.timestamp).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              removeToken()
              router.push('/login')
            }}
            className="text-sm text-red-500 underline hover:text-red-600 transition"
          >
            Log Out
          </button>
        </div>
      </section>

      <section className="mb-12">
        <SearchAndAddCard />
      </section>

      <MyCards cards={profile.myCards || []} />
      <SavedCards />
    </main>
  )
}
