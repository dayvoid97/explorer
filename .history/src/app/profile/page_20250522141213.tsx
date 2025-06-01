'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '../lib/auth'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      const token = getToken()
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const res = await fetch(`${API_BASE}/gurkha/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setProfile(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      }
    }

    fetchProfile()
  }, [])

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>
  if (!profile) return <p className="text-center mt-10">Loading profile...</p>

  return (
    <main className="max-w-md mx-auto py-10 px-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">MY PROFILE</h1>

      <div className="text-center mb-6">
        <div className="rounded-full w-20 h-20 bg-white mx-auto mb-2" />
        <p className="text-sm text-gray-400">@{profile.username}</p>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg mb-6">
        <p className="text-xl font-semibold">FINANCIAL GURKHA EXPLORER</p>
        <p className="mt-2 text-sm text-gray-400">{profile.experience}</p>
        <p className="text-xs text-gray-500 mt-1">
          Joined: {new Date(profile.timestamp).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-6">
        <section>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">My Cards</h2>
            <a href="#" className="text-sm underline">
              View All
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full h-24 bg-white rounded-md" />
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Explored Cards</h2>
            <a href="#" className="text-sm underline">
              View All
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full h-24 bg-white rounded-md" />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Explore Analytics</h2>
          <div className="w-full h-32 bg-white rounded-md mt-2" />
        </section>
      </div>
    </main>
  )
}
