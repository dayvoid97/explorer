'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
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
        setChronology(chain.chronology ?? null)
        setWins((chain.wins ?? []).filter((w: Win) => !!w.id))
        setComments(comm.comments ?? [])
      } finally {
        setLoading(false)
      }
    }
    if (chronologyId) load()
  }, [chronologyId])

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
        <span className="text-muted-foreground text-xs">
          {new Date(chronology.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* header */}
      <h3
        className="text-foreground mb-2 text-3xl font-extrabold leading-tight"
        style={{
          fontFamily: "'Freight Big Pro', serif",
          fontWeight: 500,
          letterSpacing: '0.1em',
        }}
      >
        {chronology.name}
      </h3>
      <p className="text-muted-foreground mb-2 text-sm italic">By @{chronology.createdBy}</p>
      {chronology.description && (
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
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
            <div className="border-background bg-foreground absolute left-4 top-1.5 h-2.5 w-2.5 rounded-full border md:hidden" />
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
        <h2 className="text-foreground mb-3 text-xl font-semibold">💬 Thoughts?</h2>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Drop your thoughts on this chain..."
          className="border-border bg-background text-foreground placeholder:text-muted-foreground mb-3 w-full rounded-lg border p-3"
        />
        <button
          onClick={submitComment}
          className="border-border bg-foreground text-background rounded border px-4 py-2 hover:opacity-90"
        >
          Comment
        </button>

        <div className="mt-6 space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="border-border bg-card rounded-lg border px-4 py-3">
              <p className="text-foreground text-sm">{c.text}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                ✍️ {c.username} • {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
