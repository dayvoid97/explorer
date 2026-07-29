'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Heart, Repeat2, Share, Eye, MessageCircle, Bookmark } from 'lucide-react'
import { chronologyService } from '@/app/lib/chronologyService' // Reuse service
import { getAccessToken, isLoggedIn } from '@/app/lib/auth'
import ThreadItem, { Win } from '../../components/ThreadItem'
import ProgressRail from '@/app/components/ProgressRail'

interface Chronology {
  id: string
  name: string
  createdBy: string
  createdAt: number
  description?: string
  categories?: string[]
  isPrivate?: boolean
  likeCount?: number
  repostCount?: number
  hitCount?: number
  saveCount?: number
  likedByUser?: boolean
  repostedByUser?: boolean
  savedByUser?: boolean
}

interface Comment {
  id: string
  text: string
  username: string
  createdAt: number
}

export default function ChronologyDetailPage() {
  const { chronologyId } = useParams<{ chronologyId: string }>()
  const [chronology, setChronology] = useState<Chronology | null>(null)
  const [wins, setWins] = useState<Win[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [isLiked, setIsLiked] = useState(false)
  const [isReposted, setIsReposted] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    const load = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL
        const [chainRes, commentsRes] = await Promise.all([
          fetch(`${base}/gurkha/chronology/${chronologyId}/chain`),
          fetch(`${base}/gurkha/chronology/${chronologyId}/comments`),
        ])
        const chain = await chainRes.json()
        const comm = await commentsRes.json()

        const chronoData = chain.chronology ?? null
        setChronology(chronoData)
        setWins((chain.wins ?? []).filter((w: Win) => !!w.id))
        setComments(comm.comments ?? [])

        // Sync local interaction state
        if (chronoData) {
          setIsLiked(!!chronoData.likedByUser)
          setIsReposted(!!chronoData.repostedByUser)
          setIsSaved(!!chronoData.savedByUser)
          setLikes(chronoData.likeCount || 0)
        }
      } finally {
        setLoading(false)
      }
    }
    if (chronologyId) load()
  }, [chronologyId])

  const handleInteract = async (type: 'like' | 'save' | 'repost' | 'share') => {
    if (type === 'share') {
      await navigator.clipboard.writeText(window.location.href)
      return alert('Link copied to clipboard!')
    }

    if (!isLoggedIn()) return alert('Login to interact')

    try {
      const data = await chronologyService.interact(chronologyId, type)
      if (type === 'like') {
        setIsLiked(data.liked)
        setLikes((prev) => (data.liked ? prev + 1 : Math.max(0, prev - 1)))
      }
      if (type === 'repost') setIsReposted(data.reposted)
      if (type === 'save') setIsSaved(data.saved)
    } catch (err) {
      console.error(err)
    }
  }

  const sortedWins = useMemo(() => {
    return [...wins].sort((a, b) =>
      sortOrder === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [wins, sortOrder])

  const itemIds = useMemo(() => sortedWins.map((w) => w.id), [sortedWins])

  const submitComment = async () => {
    if (!newComment.trim()) return
    if (!isLoggedIn()) return alert('Login to comment')
    const token = await getAccessToken()
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/gurkha/chronology/${chronologyId}/comment`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment }),
      }
    )
    const data = await res.json()
    if (data?.comment) {
      setComments((prev) => [data.comment, ...prev])
      setNewComment('')
    }
  }

  if (loading) return <p className="text-foreground py-16 text-center">Loading…</p>
  if (!chronology) return <p className="text-foreground py-16 text-center">Not found.</p>

  return (
    <section className="relative mx-auto max-w-3xl px-4 py-10">
      {/* top nav */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/chronoW"
          className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-4"
        >
          ← Back to ChronoDubs
        </Link>
        <div className="text-muted-foreground flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" /> {chronology.hitCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3 h-3" /> {comments.length}
          </span>
          <span>{new Date(chronology.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* header */}
      <h3
        className="text-foreground mb-2 text-4xl font-extrabold leading-tight"
        style={{
          fontFamily: "'Freight Big Pro', serif",
          fontWeight: 500,
          letterSpacing: '-0.1rem',
        }}
      >
        {chronology.name}
      </h3>

      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground text-sm italic">By @{chronology.createdBy}</p>

        {/* LOGGED IN INTERACTION BAR */}
        {isLoggedIn() && (
          <div className="bg-secondary/30 border-border flex items-center gap-1 rounded-full p-1 border">
            <button
              onClick={() => handleInteract('like')}
              className={`p-2 rounded-full transition-all ${
                isLiked ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => handleInteract('repost')}
              className={`p-2 rounded-full transition-all ${
                isReposted
                  ? 'text-green-500 bg-green-500/10'
                  : 'text-muted-foreground hover:text-green-500'
              }`}
            >
              <Repeat2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleInteract('save')}
              className={`p-2 rounded-full transition-all ${
                isSaved
                  ? 'text-yellow-500 bg-yellow-500/10'
                  : 'text-muted-foreground hover:text-yellow-500'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => handleInteract('share')}
              className="text-muted-foreground p-2 rounded-full hover:text-blue-500 transition-all"
            >
              <Share className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Engagement Stats for everyone */}
      {/* Engagement Stats - Only visible if counts > 0 */}
      {(likes > 0 || (chronology.repostCount ?? 0) > 0 || (chronology.saveCount ?? 0) > 0) && (
        <div className="border-border/50 text-muted-foreground flex gap-6 mb-6 border-y py-3 text-xs font-mono">
          {likes > 0 && (
            <div className="flex flex-col">
              <span className="text-foreground font-bold">{likes}</span>
              <span>Dubbed</span>
            </div>
          )}
          {(chronology.repostCount ?? 0) > 0 && (
            <div className="flex flex-col">
              <span className="text-foreground font-bold">{chronology.repostCount}</span>
              <span>Reposts</span>
            </div>
          )}
          {(chronology.saveCount ?? 0) > 0 && (
            <div className="flex flex-col">
              <span className="text-foreground font-bold">{chronology.saveCount}</span>
              <span>Noted</span>
            </div>
          )}
        </div>
      )}

      {chronology.description && (
        <p className="text-muted-foreground mb-4 text-base leading-relaxed">
          {chronology.description}
        </p>
      )}

      {(chronology.categories ?? []).length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {(chronology.categories ?? []).map((cat, i) => (
            <span
              key={i}
              className="border-border text-muted-foreground rounded-full border px-2 py-0.5 text-xs font-medium"
            >
              #{cat}
            </span>
          ))}
        </div>
      )}

      {/* sort toggle */}
      <div className="text-muted-foreground mb-8 flex items-center justify-end gap-2 text-xs">
        <span>Sort by date:</span>
        <button
          onClick={() => setSortOrder('asc')}
          className={`px-2 py-1 rounded border ${
            sortOrder === 'asc'
              ? 'border-foreground text-foreground'
              : 'border-border hover:text-foreground'
          }`}
        >
          Asc
        </button>
        <button
          onClick={() => setSortOrder('desc')}
          className={`px-2 py-1 rounded border ${
            sortOrder === 'desc'
              ? 'border-foreground text-foreground'
              : 'border-border hover:text-foreground'
          }`}
        >
          Desc
        </button>
      </div>

      {/* progress rail */}
      <ProgressRail itemIds={itemIds} />

      {/* thread */}
      <div className="md:before:bg-border relative space-y-8 md:before:absolute md:before:left-5 md:before:top-0 md:before:bottom-0 md:before:w-px">
        {sortedWins.map((win) => (
          <div key={win.id} id={`win-${win.id}`} className="relative flex gap-4 pl-14">
            <div className="" />
            <ThreadItem win={win} />
          </div>
        ))}
        {sortedWins.length === 0 && (
          <div className="border-border text-muted-foreground rounded-lg border border-dashed p-8 text-center text-sm">
            No posts yet — check back soon.
          </div>
        )}
      </div>

      {/* comments */}
      <div className="mt-12">
        <h2
          className="text-foreground mb-3 text-xl font-semibold"
          style={{
            fontFamily: "'Roboto Mono', monospace",
            fontWeight: 400,
            fontStyle: 'normal',
            letterSpacing: '-0.05rem',
          }}
        >
          Drop A Comment
        </h2>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Say something..."
          className="border-border bg-background text-foreground placeholder:text-muted-foreground mb-3 w-full rounded-lg border p-3"
        />
        <button
          onClick={submitComment}
          className="border-border bg-foreground text-background rounded border px-4 py-2 hover:opacity-90"
          style={{
            fontFamily: "'Roboto Mono', monospace",
            fontWeight: 400,
            fontStyle: 'normal',
            letterSpacing: '-0.05rem',
          }}
        >
          Comment
        </button>

        <div className="mt-6 space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="border-border bg-card rounded-lg border px-4 py-3">
              <p className="text-foreground text-sm">{c.text}</p>
              <p
                className="text-muted-foreground mt-1 text-xs"
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  fontWeight: 400,
                  fontStyle: 'normal',
                  letterSpacing: '-0.05rem',
                }}
              >
                ✍️ {c.username} • {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
