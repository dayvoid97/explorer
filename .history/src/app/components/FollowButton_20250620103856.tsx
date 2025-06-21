'use client'

import React, { useEffect, useState } from 'react'
import { getToken } from '@/app/lib/auth'
import { Button } from './ui/Button'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL

export default function FollowButton({ targetUsername }: { targetUsername: string }) {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const t = getToken()
    setToken(t)
    if (t) fetchFollowStatus(t)
  }, [])

  const fetchFollowStatus = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/gurkha/users/follow-status?username=${targetUsername}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      setIsFollowing(data.isFollowing)
    } catch (err) {
      console.error('Failed to fetch follow status', err)
    }
  }

  const handleToggleFollow = async () => {
    if (!token) return
    setLoading(true)

    const endpoint = isFollowing ? '/gurkha/users/unfollow' : '/gurkha/users/follow'

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUsername }),
      })

      if (!res.ok) throw new Error('Network error')

      setIsFollowing((prev) => !prev)
    } catch (err) {
      console.error('Follow/unfollow failed', err)
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <Button variant="outline" disabled>
        Log in to follow
      </Button>
    )
  }

  if (isFollowing === null) {
    return (
      <Button variant="outline" disabled>
        Checking...
      </Button>
    )
  }

  return (
    <Button
      variant={isFollowing ? 'outline' : 'default'}
      onClick={handleToggleFollow}
      disabled={loading}
    >
      {loading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
