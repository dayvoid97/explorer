'use client'

import React, { useState, useMemo } from 'react'
import { PartyPopper, MessageCircle, Bookmark } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { celebrateWin } from '../hooks/useCelebrateWins'
import { getToken } from '../lib/auth'
import Image from 'next/image'
import audio from '../../../public/audio.png'

export interface WinProps {
  win: {
    id: string
    username: string
    createdAt: string
    title: string
    paragraphs: string[]
    mediaUrls?: string[]
    upvotes?: number
    previewImageUrl?: string
    commentCount?: number
  }
}

export default function WinCard({ win }: WinProps) {
  const router = useRouter()
  const [upvotes, setUpvotes] = useState(win.upvotes ?? 0)
  const [expanded, setExpanded] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isUpvoting, setIsUpvoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLong = useMemo(() => win.paragraphs.join('').length > 200, [win.paragraphs])
  const isVideo = win.previewImageUrl?.endsWith('.mp4') || win.previewImageUrl?.endsWith('.webm')

  const goToDetail = () => router.push(`/winners/wincard/${win.id}`)

  const handleCelebrate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const token = getToken()
    if (!token) return router.push('/login')

    try {
      setIsUpvoting(true)
      const count = await celebrateWin(win.id, token)
      setUpvotes(count)
    } catch {
      setError('Celebrate failed.')
    } finally {
      setIsUpvoting(false)
    }
  }

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const token = getToken()
    if (!token) return router.push('/login')

    try {
      const res = await fetch(`/api/gurkha/wins/save/${win.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (res.ok || res.status === 409) setSaved(true)
    } catch {
      setError('Save failed.')
    }
  }

  return (
    <div
      onClick={goToDetail}
      className="aspect-[1.618] w-full max-w-
