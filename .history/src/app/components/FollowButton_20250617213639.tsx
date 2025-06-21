'use client'

import React, { useEffect, useState } from 'react'
import { getToken } from '@/app/lib/auth'
import { Button } from './ui/Button'

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
      const res = await fetch(`/api/user/follow-status?username=${targetUsername}`, {
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

    const endpoint = isFollowing ? '/api/user/unfollow' : '/api/user/follow'

    try {
      const res = await fetch(endpoint, {
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

  if (isFollowing === null) return null // Or a spinner if needed

  return (
    <Button onClick={handleToggleFollow} disabled={loading}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
